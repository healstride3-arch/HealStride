import { createContext, useContext, useState } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
  localStorage.getItem("language") || "en"
);

  const changeLanguage = (newLanguage) => {
  setLanguage(newLanguage);
  i18n.changeLanguage(newLanguage);
  localStorage.setItem("language", newLanguage);
};

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "hi" : "en";
    changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        changeLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};