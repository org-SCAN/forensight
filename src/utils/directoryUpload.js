import JSZip from "jszip";
import { updateCasesOpen } from "../redux/Reducers/caseOpenReducer";
import { updateCaseList } from "../redux/Reducers/caseListReducer";
import { saveCases } from "../db/indexedDB";  
import { updateFolderOrder } from "../db/casesListDB"; 
import { mergeData } from "./mergedData";

export const DirectoryUpload = async (dispatch, setErrorMessage) => {
    try {
        const directoryHandle = await window.showDirectoryPicker();
        const folderName = directoryHandle.name;
        let extractedJsons = [];
        let extractedImages = [];
        let jsonFileFound = false;

        for await (const entry of directoryHandle.values()) {
            if (entry.kind === "file" && entry.name.endsWith(".zip")) {
                const file = await entry.getFile();
                const arrayBuffer = await file.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);

                for (const relativePath in zip.files) {
                    const zipEntry = zip.files[relativePath];
                    if (zipEntry.name.endsWith(".json")) {
                        const jsonText = await zipEntry.async("text");
                        const jsonData = JSON.parse(jsonText);
                        const fileNameWithoutExtension = zipEntry.name.replace(/\.json$/, "");
                        extractedJsons.push({ fileName: fileNameWithoutExtension, data: jsonData });
                        jsonFileFound = true;
                    }
                    if (zipEntry.name.endsWith(".jpg")) {
                        const imageBlob = await zipEntry.async("blob");
                        const fileNameWithoutExtension = zipEntry.name.replace(/\.jpg$/, "");
                        console.log("imageBlob", imageBlob);
                        extractedImages.push({ id: fileNameWithoutExtension, imageBlob });
                    }
                }
            }
        }

        if (!jsonFileFound) {
            setErrorMessage("No JSON files found!");
        } else {
            const mergedData = mergeData(extractedJsons, extractedImages);
            await saveCases(folderName, mergedData);
            await updateFolderOrder(folderName);
            dispatch(updateCasesOpen(folderName)); // Update Redux
            dispatch(updateCaseList(folderName)); // Update Redux
            setErrorMessage("");
        }
    } catch (error) {
        console.error("Error selecting folder:", error);
        setErrorMessage("Error selecting folder.");
    }
};
