import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMapFromDB, saveMapToDB } from "../../db/localStorageDB";

export const loadMap = createAsyncThunk("map/loadMap", async () => {
  return await getMapFromDB();
});

const mapSlice = createSlice({
  name: "map",
  initialState: {
    map: "default", 
  },
  reducers: {
    setMap: (state, action) => {
      if ( ["default", "dark", "satellite", "heat-map"].includes(action.payload) ) {
        state.map = action.payload;
      } else {
        state.map = "default";
      }
      saveMapToDB(state.map);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadMap.fulfilled, (state, action) => {
      state.map = action.payload;
    });
  },
});

export const { setMap } = mapSlice.actions;
export default mapSlice.reducer;
