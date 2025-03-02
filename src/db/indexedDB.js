import Dexie from "dexie";

export const db = new Dexie("CasesDB");

db.version(1).stores({
  folderCases: "++id, folderName, cases", 
});

export async function saveCases(folderName, mergedData) {
  try {

    // Ensure no dublons in the cases array

    const uniqueMergedData = mergedData.filter(
      (case1, index, self) =>
        index === self.findIndex((case2) => case2.fileName === case1.fileName)
    );

    // Rewrite cases in existing folder
    const existingFolder = await db.folderCases.get({ folderName });

    if (existingFolder) {
      const newCases = uniqueMergedData.filter(
        (newCase) =>
          !existingFolder.cases.some((existing) => existing.fileName === newCase.fileName)
      );
      await db.folderCases.update(existingFolder.id, {
        cases: [...existingFolder.cases, ...newCases],
      });
      console.log(`Updated folder: ${folderName}`);
    } 
    else {  
      await db.folderCases.add({
        folderName,
        cases: uniqueMergedData,
      });
      console.log(`New folder added: ${folderName}`);
    }
  } catch (error) {
    console.error("Error saving cases:", error);
  }
}

export async function getAllCases() {
  return await db.folderCases.toArray();
}

export async function getCasesByFolder(folderName) {
  return await db.folderCases.get({ folderName });
}

export async function clearDatabase() {
  await db.folderCases.clear();
  console.log("IndexedDB cleared.");
}
