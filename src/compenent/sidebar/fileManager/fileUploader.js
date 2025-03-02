import React, {  useState,  } from "react";
import { useDispatch } from "react-redux";
import "leaflet/dist/leaflet.css";
import { DirectoryUpload } from "../../../utils/directoryUpload";
import '../../../css/sidebar/btn.css';
import useTranslation from "../../../utils/translation";

function FileUploader({isOpen}) {
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const t = useTranslation();
  
  return (
    <div>
        <button className="btn upload" onClick={() => DirectoryUpload(dispatch, setErrorMessage)}>{isOpen ? (t("sideBar.buttons.add") || "Open Dataset") : "+"}</button>
        {errorMessage && (
          <>
            <span className={`sidebar-items-title ${isOpen ? "" : "closed"}`}>{errorMessage}</span>
          </>
        )}
    </div>
  );
}

export default FileUploader;