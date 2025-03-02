// in case of missing translation
// EN will be returned

import { useSelector } from "react-redux";
import fallbackTranslations from "../i18/en.json";

const useTranslation = () => {
  const { translations } = useSelector((state) => state.lang) || {};

  return (key) => {
    return (
      key
        .split(".")
        .reduce((obj, i) => (obj && obj[i] !== undefined ? obj[i] : null), translations)
      || key
        .split(".")
        .reduce((obj, i) => (obj && obj[i] !== undefined ? obj[i] : null), fallbackTranslations)
      || key
    );
  };
};

export default useTranslation;