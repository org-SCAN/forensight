import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateSidebarState, updateCaseSelected } from "../../redux/Reducers/caseOpenReducer";
import { FaFolderOpen } from "react-icons/fa6";
import { MdTextFields } from "react-icons/md";
import { IoCloseSharp, IoPricetags, IoCalendarNumber  } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { LuNotepadText } from "react-icons/lu";
import useTranslation from "../../utils/translation";
import "../../css/map/sideBar.css";
import "../../css/map/imageGallery.css";

const Sidebar = ({filteredCases, highlightedCoord, setHighlightedCoord, highlightedCase, setHighlightedCase}) => {
    const dispatch = useDispatch();
    const t = useTranslation();

    const selectedCase = useSelector((state) => state.caseOpen.caseSelected);
    const sidebarState = useSelector((state) => state.caseOpen.sidebarState);
    const blurAmount = useSelector((state) => state.blur.amount);
    const [isOpen, setIsOpen] = useState(!(sidebarState === "closed"));
    const [folder, setFolder] = useState([]);
    
    useEffect(() => {
        setIsOpen(!(sidebarState === "closed"));
    }, [sidebarState]);

    useEffect(() => {
        const folderMap = [];
        filteredCases.forEach((caseData) => {
            folderMap.push(caseData);
        });
        setFolder(folderMap);
    }, [filteredCases]);

    const headerTitle = folder.find((caseData) => caseData.data.id === selectedCase)?.data.tag || (t("map.sideBar.cases") || "CASES");

    const toggleSidebar = () => {
        dispatch(updateSidebarState(sidebarState === "closed" ? (selectedCase ? "case" : "folder") : "closed"));
    };

    const toggleMenu = () => {
        dispatch(updateSidebarState("folder"));
        dispatch(updateCaseSelected(null));
        setHighlightedCase(null);
    }

    const handleCaseClick = (caseId) => {
        dispatch(updateCaseSelected(caseId));
        dispatch(updateSidebarState("case"));
    };

    return (
        <div className={`sidebar-map ${isOpen ? "open" : "closed"}`}>
            <div className={`toggle-btn-container ${isOpen ? "open" : "closed"}`}>
                {sidebarState === "case" && (
                    <button className="toggle-menu-btn" onClick={toggleMenu}>
                        {<IoIosArrowBack className="action-icon" />}
                    </button>
                )}
                {isOpen && (
                    <h1 className="header-title">{headerTitle}</h1>
                )}
                <button className={`toggle-sidebar-btn ${sidebarState === "folder" ? "folder" : ""}`} onClick={toggleSidebar}>
                    {isOpen ? <IoCloseSharp className="action-icon" /> : <FaFolderOpen className="action-icon" />}
                    
                </button>
            </div>
            {filteredCases.length === 0 && isOpen && (
                <div className="no-cases">
                    <p>{t('map.sideBar.noData') || 'No cases found'}</p>
                </div>
            )}

            {sidebarState === "folder" && (
                <div className="folder-list">
                    {folder.map((caseData) => (
                    <div key={caseData.data.id}
                        className={`folder-item ${highlightedCase === caseData.data.id ? "hover" : ""}`}
                        onClick={() => handleCaseClick(caseData.data.id)}
                        onMouseEnter={() => setHighlightedCase(caseData.data.id)}
                        onMouseLeave={() => setHighlightedCase(null)}
                    >
                        <div className="folder-header">
                        <img src={`light-sex-${caseData.data.sex}.png`} alt="Sex" className="folder-icon sex-icon" />
                        <img src={`light-age-${caseData.data.age}.png`} alt="Age" className="folder-icon age-icon" />
                        <h4 className="folder-tag">{caseData.data.tag}</h4> 
                        </div>
                    </div>
                    ))}
                </div>
            )}


            {sidebarState === "case" &&
                filteredCases.map((caseData) => {
                if (caseData.data.id !== selectedCase) return null;
                return (
                    <div key={caseData.data.id}>
                    <div className="case-details">
                        <div className="case-info">
                        <div className="info-item">
                            <img className="info-icon" src={`light-sex-${caseData.data.sex}.png`} />
                            <span>{t('map.filterBar.sex.' + caseData.data.sex) || caseData.data.sex}</span>
                        </div>
                        <div className="info-item">
                            <img className="info-icon" src={`light-age-${caseData.data.age}.png`} />
                            <span>{t('map.filterBar.age.' + caseData.data.age) || caseData.data.age}</span>
                        </div>
                        {caseData.data.types && (
                            <div className="info-item">
                            <IoPricetags className="info-icon" />
                            <span>{caseData.data.types.join(" | ")}</span>
                            </div>
                        )}
                        <div className="info-item">
                            <IoCalendarNumber className="info-icon" />
                            <span>{new Date(caseData.data.date).toLocaleDateString()}</span>
                        </div>
                        {caseData.data.description && (
                            <div className="info-item">
                                <LuNotepadText className="info-icon" />
                                <span>{caseData.data.description}</span>
                            </div>
                        )}
                        {caseData.data.customField && (
                            <div className="info-item">
                                <MdTextFields className="info-icon" />
                                <span>{caseData.data.customField}</span>
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="image-gallery">
                        {caseData.data.coordinates.map((coord) => (
                        <div
                            key={coord.id}
                            className={`image-section ${highlightedCoord === coord ? "hover" : ""}`}
                            onMouseEnter={() => setHighlightedCoord(coord)}
                            onMouseLeave={() => setHighlightedCoord(null)}
                        >
                            <img 
                                src={URL.createObjectURL(coord.imageBlob)} 
                                alt="Case" 
                                className="image-preview"
                                style={{ filter: `blur(${blurAmount*0.2}px)`}}
                                onLoad={(e) => URL.revokeObjectURL(e.target.src)} 
                            />
                        </div>
                        ))}
                    </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Sidebar;
