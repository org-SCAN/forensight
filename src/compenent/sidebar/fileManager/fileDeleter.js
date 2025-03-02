import React, {  useState  } from "react";
import { useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import '../../../css/sidebar/btn.css';
import { clearDatabase } from "../../../db/indexedDB";
import { clearFolderOrder } from "../../../db/casesListDB";
import { updateCasesOpen, updateCaseSelected, updateCasesData } from "../../../redux/Reducers/caseOpenReducer";
import { clearImages } from "../../../utils/clearImages";
import useTranslation from "../../../utils/translation";

function FileDeleter({isOpen}) {
  const dispatch = useDispatch();
  const t = useTranslation();

  const handleFolderClick = () => {
    dispatch(updateCasesOpen([]));
    dispatch(updateCaseSelected(null));
    dispatch(updateCasesData([]));
    clearImages();
    clearDatabase();
    clearFolderOrder();
  }

  return (
    <div>
        <button className="btn erase" onClick={handleFolderClick}>{isOpen ? (t("sideBar.buttons.delete") || "Erase All Data"):"-"}</button>
    </div>
  );
}

export default FileDeleter;