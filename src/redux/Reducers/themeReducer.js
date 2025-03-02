import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getThemeFromDB, saveThemeToDB } from "../../db/localStorageDB";

export const loadTheme = createAsyncThunk("theme/loadTheme", async () => {
  return await getThemeFromDB();
});

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light", 
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      saveThemeToDB(state.mode); 
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      saveThemeToDB(state.mode);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
