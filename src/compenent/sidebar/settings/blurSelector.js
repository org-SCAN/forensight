import React from "react";
import { MdBlurOn, MdBlurOff } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setBlur } from "../../../redux/Reducers/blurReducer";
import "../../../css/sidebar/blurSelector.css"; 
import useTranslation from "../../../utils/translation";

const BlurSelector = ({isOpen}) => {
  const dispatch = useDispatch();
  const t = useTranslation();
  const amount = useSelector((state) => state.blur.amount);

  const handleBlurChange = () => {
    if (amount === 0) {
      dispatch(setBlur(100));
    } else {
      dispatch(setBlur(0));
    }
  }

  return (
    <div className={`blur-selector ${isOpen ? "" : "blur-icon"}`}>
      {isOpen ? (
        <>
          <span className="blur-text">{t("sideBar.settings.blur") || "Blur"} {amount}%</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="1" 
            value={amount} 
            onChange={(e) => dispatch(setBlur(Number(e.target.value)))} 
            className="blur-slider"
          />
        </>
      ) : (
        <>
          <label className="toggle-icon">
            <input type="checkbox" checked={amount !== 0} onChange={handleBlurChange} />
            {amount === 0 ? <MdBlurOff className="blur-icon" /> : <MdBlurOn className="blur-icon" />}
          </label>
        </>
      )}
    </div>
  );
};

export default BlurSelector;