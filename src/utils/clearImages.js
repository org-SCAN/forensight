import { getAllCases } from "../db/indexedDB";

export const clearImages = async () => {
    try {
        const allCases = await getAllCases();
        allCases.forEach((folder) => {
            folder.cases.forEach((folderData) => {
                folderData.data.coordinates.forEach((coord) => {
                    URL.revokeObjectURL(coord.imageUrl);
                });
            });
        });
        console.log("🗑 Images cleared.");
    } catch (error) {
        console.error("❌ Error clearing images:", error);
    }
}