import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlurFromDB, saveBlurToDB } from "../../db/localStorageDB";

export const loadBlur = createAsyncThunk("blur/loadBlur", async () => {
  return await getBlurFromDB();
});

const blurSlice = createSlice({
  name: "blur",
  initialState: {
    amount: 100,
  },
  reducers: {
    setBlur: (state, action) => {
      state.amount = action.payload;
      saveBlurToDB(state.amount);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadBlur.fulfilled, (state, action) => {
      state.amount = action.payload;
    });
  },
});

export const { setBlur } = blurSlice.actions;
export default blurSlice.reducer;
