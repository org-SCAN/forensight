import { createSlice } from "@reduxjs/toolkit";

const caseListSlice = createSlice({
  name: "caseList",
  initialState: {
    listFileName: [],
  },
  reducers: {
    updateCaseList: (state, action) => {
      state.listFileName = [
        action.payload,
        ...state.listFileName,
      ];
    },
    reorderCaseList: (state, action) => {
      const clickedFile = action.payload;
      state.listFileName = [
        clickedFile,
        ...state.listFileName.filter((file) => file !== clickedFile),
      ];
    },
  },
});

// Export actions for dispatch
export const { updateCaseList, reorderCaseList } = caseListSlice.actions;

// Export reducer
export default caseListSlice.reducer;
