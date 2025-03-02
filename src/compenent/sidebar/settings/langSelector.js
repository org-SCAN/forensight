import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "../../../redux/Reducers/langReducer";
import { MdGTranslate } from "react-icons/md";
import useTranslation from "../../../utils/translation";

const LangSelector = ({ isOpen }) => {
  const dispatch = useDispatch();
  const t = useTranslation();
  const { lang } = useSelector((state) => state.lang);

  const languages = ["en", "fr", "es", "ar"];
  const nextLang = languages[(languages.indexOf(lang) + 1) % languages.length];

  return (
    <div className={`lang-selector ${isOpen ? "" : "lang-icon"}`}>
      {isOpen ? (
        <> 
          <span className="lang-text">{t("sideBar.settings.language") || "Language"}</span>
          <select className="lang-dropdown" value={lang} onChange={(e) => dispatch(changeLanguage(e.target.value))}>
            {languages.map((language) => (
              <option key={language} value={language}>{language.toUpperCase()}</option>
            ))}
          </select>
        </>
      ) : (
        <button className="icon-btn" onClick={() => dispatch(changeLanguage(nextLang))} title="Change Language">
          <MdGTranslate className="lang-icon" />
        </button>
      )}
    </div>
  );
};

export default LangSelector;
