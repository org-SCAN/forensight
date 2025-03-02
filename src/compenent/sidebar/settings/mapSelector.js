import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMap, loadMap } from "../../../redux/Reducers/mapReducer";
import { FaMap  } from "react-icons/fa";
import "../../../css/sidebar/mapSelector.css"; 
import useTranslation from "../../../utils/translation"; 

const MapSelector = ({isOpen}) => {
  const dispatch = useDispatch();
  const t = useTranslation();
  const map = useSelector((state) => state.map.map);

  useEffect(() => {
    dispatch(loadMap());
  }, [dispatch]);

  const handleMapChange = () => {
    //const nextMap = map === "default" ? "dark" : map === "dark" ? "satellite" : map === "satellite" ? "heat-map" : "default";
    const nextMap = map === "default" ? "satellite" : map === "satellite" ? "heat-map" : "default";
    dispatch(setMap(nextMap));
  }

  return (
    <div className={`lang-selector ${isOpen ? "" : "lang-icon"}`}>
      {isOpen ? (
        <>
          <span className="lang-text">{t("sideBar.settings.map.title") || "Map"}</span>
          <select className="lang-dropdown" value={map} onChange={(e) => dispatch(setMap(e.target.value))}>
            <option value="default">{t("sideBar.settings.map.default") || "Default"}</option>
            {/*<option value="dark">{t("sideBar.settings.map.dark") || "Dark view"}</option>*/}
            <option value="satellite">{t("sideBar.settings.map.satellite") || "Satellite"}</option>
            <option value="heat-map">{t("sideBar.settings.map.heat-map") || "Heat Map"}</option>
          </select>
        </>
      ) : (
        <>
          <button className="icon-btn" onClick={handleMapChange} title="Change Map">
            <FaMap className="lang-icon" />
          </button>
        </>
      )}
    </div>
  );
};

export default MapSelector;
