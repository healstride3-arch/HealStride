import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = ({ variant = "default" }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  if (variant === "mobile") {
    return (
      <div className="flex items-center justify-between py-2.5 px-3.5 bg-gray-50 rounded-xl mt-3 border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
          <Globe className="w-4 h-4 text-teal-700" />
          <span>Language / भाषा</span>
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              currentLang === "en"
                ? "bg-teal-700 text-white"
                : "text-gray-600 hover:text-teal-700"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => changeLanguage("hi")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
              currentLang === "hi"
                ? "bg-teal-700 text-white"
                : "text-gray-600 hover:text-teal-700"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200 shadow-sm">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 transform hover:scale-105 ${
          currentLang === "en"
            ? "bg-teal-700 text-white shadow-sm"
            : "text-gray-600 hover:text-teal-700 hover:bg-gray-200/60"
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      <span className="text-gray-300 text-xs font-normal">|</span>
      <button
        type="button"
        onClick={() => changeLanguage("hi")}
        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 transform hover:scale-105 ${
          currentLang === "hi"
            ? "bg-teal-700 text-white shadow-sm"
            : "text-gray-600 hover:text-teal-700 hover:bg-gray-200/60"
        }`}
        aria-label="Switch to Hindi"
      >
        हिंदी
      </button>
    </div>
  );
};

export default LanguageSwitcher;
