import Dexie from "dexie";

export const localStorageDB = new Dexie("LocalStorageDB");
localStorageDB.version(1).stores({
  field: "key",
});

// Function to get the theme from IndexedDB
export async function getThemeFromDB() {
  const theme = await localStorageDB.field.get("theme");
  return theme ? theme.value : "light"; 
}

export async function getMapFromDB() {
  const map = await localStorageDB.field.get("map");
  return map ? map.value : "default";
}

export async function getBlurFromDB() {
  const blur = await localStorageDB.field.get("blur");
  return blur ? blur.value : 100;
}

export async function getLangFromDB() {
  const lang = await localStorageDB.field.get("lang");
  return lang ? lang.value : "en";
}

// Function to save the theme to IndexedDB
export async function saveThemeToDB(theme) {
  await localStorageDB.field.put({ key: "theme", value: theme });
}

export async function saveMapToDB(map) {
  await localStorageDB.field.put({ key: "map", value: map });
}

export async function saveBlurToDB(blur) {
  await localStorageDB.field.put({ key: "blur", value: blur });
}

export async function saveLangToDB(lang) {
  await localStorageDB.field.put({ key: "lang", value: lang });
}

// Function to clear the theme from IndexedDB
export async function clearLocalStorageDB() {
  await localStorageDB.field.clear();
}