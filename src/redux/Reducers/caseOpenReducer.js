import { createSlice } from "@reduxjs/toolkit";

const caseOpenSlice = createSlice({
  name: "caseOpen",
  initialState: {
    cases: [],
    casesData: [],
    caseSelected: null,
    sidebarState: "closed",
  },
  reducers: {
    updateCasesOpen: (state, action) => {
      state.cases = action.payload;
    },
    updateCasesData: (state, action) => {
      state.casesData = action.payload;
    },
    updateCaseSelected: (state, action) => {
      state.caseSelected = action.payload;
    },
    updateSidebarState: (state, action) => {
      state.sidebarState = action.payload;
    }
  },
});

// Export action for dispatch
export const { updateCasesOpen, updateCasesData, updateCaseSelected, updateSidebarState } = caseOpenSlice.actions;

// Export reducer
export default caseOpenSlice.reducer;
