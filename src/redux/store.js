import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import caseOpenReducer from "./Reducers/caseOpenReducer"; 
import caseListReducer from "./Reducers/caseListReducer";
import themeReducer from "./Reducers/themeReducer";
import langReducer from "./Reducers/langReducer";
import mapReducer from "./Reducers/mapReducer";
import blurReducer from "./Reducers/blurReducer";

const rootReducer = combineReducers({
  caseOpen: caseOpenReducer,
  caseList: caseListReducer,
  theme: themeReducer,
  lang: langReducer,
  map: mapReducer,
  blur: blurReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
