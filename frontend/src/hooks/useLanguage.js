import { useState } from "react";
import translations from "../translations";

function useLanguage() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "fi"
  );

  const changeLanguage = (lang) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  const t = translations[language] || translations.fi;

  return { t, language, changeLanguage };
}

export default useLanguage;
