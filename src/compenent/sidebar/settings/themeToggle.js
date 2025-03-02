import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, loadTheme } from "../../../redux/Reducers/themeReducer";
import { setMap } from "../../../redux/Reducers/mapReducer";
import { FaSun, FaMoon } from "react-icons/fa"; 
import "../../../css/sidebar/themeToggle.css";  

const ThemeToggle = ({isOpen}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  const handleThemeChange = () => {
    dispatch(toggleTheme());
    /*if (theme === "dark") (
      dispatch(setMap("light"))
    )
    else (
      dispatch(setMap("dark"))
    )*/
  }

  return (
    <div className={`theme-toggle ${isOpen ? "" : "theme-icon"}`}>
      {isOpen ? (
        <>
          <span className={`theme-text`}>Theme</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={theme === "dark"} onChange={handleThemeChange} />
            <span className="slider round"></span>
          </label>
        </>
      ) : (
        <>
          <label className="toggle-icon">
            <input type="checkbox" checked={theme === "dark"} onChange={handleThemeChange} />
            {theme === "dark" ? <FaMoon className="theme-icon" /> : <FaSun className="theme-icon" />}
          </label>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;
