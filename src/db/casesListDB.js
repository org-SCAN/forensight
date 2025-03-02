import Dexie from "dexie";

export const caseListDB = new Dexie("CasesListDB");

caseListDB.version(1).stores({
  folderOrder: "id, orderedFolders",
});

export async function initFolderOrder() {
  const existing = await caseListDB.folderOrder.get("folderOrder");
  if (!existing) {
    await caseListDB.folderOrder.put({ id: "folderOrder", orderedFolders: [] });
  }
}

export async function getFolderOrder() {
  const orderEntry = await caseListDB.folderOrder.get("folderOrder");
  return orderEntry?.orderedFolders || [];
}

export async function updateFolderOrder(folderName) {
  const currentOrder = await getFolderOrder();

  const newOrder = [folderName, ...currentOrder.filter((f) => f !== folderName)];

  await caseListDB.folderOrder.put({ id: "folderOrder", orderedFolders: newOrder });
}

export async function clearFolderOrder() {
  await caseListDB.folderOrder.clear();
  console.log("Folder order cleared.");
}
