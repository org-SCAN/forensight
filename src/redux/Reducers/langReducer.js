import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fallbackTranslations from "../../i18/en.json";
import { getLangFromDB, saveLangToDB } from "../../db/localStorageDB";

export const loadLang = createAsyncThunk("lang/loadLang", async (_, { dispatch }) => {
  const savedLang = await getLangFromDB();
  const lang = savedLang || "en"; 

  try {
    const translations = await import(`../../i18/${lang}.json`);
    dispatch(setLanguage({ lang, translations: translations.default }));
  } catch (error) {
    console.error(`Failed to load ${lang}.json, using fallback.`, error);
    dispatch(setLanguage({ lang: "en", translations: fallbackTranslations }));
  }

  return lang;
});

const initialState = {
  lang: "en",
  translations: fallbackTranslations,
};

const langSlice = createSlice({
  name: "lang",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload.lang;
      state.translations = action.payload.translations || fallbackTranslations;
      saveLangToDB(state.lang);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadLang.fulfilled, (state, action) => {
      state.lang = action.payload;
    });
  },
});

export const { setLanguage } = langSlice.actions;

export const changeLanguage = (newLang) => async (dispatch) => {
  try {
    const translations = await import(`../../i18/${newLang}.json`);
    dispatch(setLanguage({ lang: newLang, translations: translations.default }));
  } catch (error) {
    console.error(`Failed to load ${newLang}.json, using fallback.`, error);
    dispatch(setLanguage({ lang: "en", translations: fallbackTranslations }));
  }
};

export default langSlice.reducer;
