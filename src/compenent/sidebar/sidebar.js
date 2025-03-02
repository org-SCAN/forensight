import React, { useState, useEffect } from "react";
import FileUploader from "./fileManager/fileUploader";
import FileDeleter from "./fileManager/fileDeleter";
import "../../css/sidebar/sidebar.css";
import "../../css/sidebar/folder-list.css";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch } from "react-redux";
import { updateCasesOpen, updateCaseSelected, updateSidebarState } from "../../redux/Reducers/caseOpenReducer";
import { initFolderOrder, getFolderOrder, updateFolderOrder } from "../../db/casesListDB";
import ThemeToggle from "./settings/themeToggle";
import LangSelector from "./settings/langSelector";
import MapSelector from "./settings/mapSelector";
import BlurSelector from "./settings/blurSelector";
import useTranslation from "../../utils/translation";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const dispatch = useDispatch();
  const t = useTranslation();

  const folderListLiveQuery = useLiveQuery(() => getFolderOrder(), []);

  useEffect(() => {
    if (folderListLiveQuery) {
      setFolderList(folderListLiveQuery);
    }
  }, [folderListLiveQuery]);

  useEffect(() => {
    initFolderOrder();
  }, []);

  const handleFolderClick = async (folderName) => {
    await updateFolderOrder(folderName);
    dispatch(updateCaseSelected(null));
    dispatch(updateCasesOpen(folderName));
    dispatch(updateSidebarState("folder"));
  };
  return (
    <div className="sidebar-wrapper">
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className={`sidebar-header ${isOpen ? "" : "closed"}`}>
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>☰</button>
          {isOpen && <span className="sidebar-title">ForenSight</span>}
        </div>
        
        <FileUploader isOpen={isOpen}/>
        <span className={`sidebar-items-title ${isOpen ? "" : "closed"}`}>{t("sideBar.items-title.recents") || "Recents"}</span>

        {folderList && (
            <div className={`sidebar-folder-list ${isOpen ? "" : "closed"}`}>
                {folderList.map((folderName, index) => (
                  <div key={index}
                      className={`sidebar-folder-item ${isOpen ? "" : "closed"}`}
                      onClick={() => handleFolderClick(folderName)}
                  >
                    <div className="sidebar-folder-header">
                      {isOpen ? (
                        <span className="sidebar-folder-tag">{folderName}</span>
                      ) : (
                        <span className="sidebar-folder-shortened">{folderName.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
        )}

        <span className={`sidebar-items-title ${isOpen ? "" : "closed"}`}>{t("sideBar.items-title.settings") || "Settings"}</span>

        <div className="sidebar-settings-section">
          {/*<ThemeToggle isOpen={isOpen}/>*/}
          <LangSelector isOpen={isOpen}/>
          <MapSelector isOpen={isOpen}/>
          <BlurSelector isOpen={isOpen}/>
        </div>
        
        <FileDeleter isOpen={isOpen}/>
      </div>
    </div>
  );
};

export default Sidebar;
