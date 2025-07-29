import React from 'react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../../contexts/i18nContext';

const LanguageSelector = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, supportedLanguages } = useTranslation();

  const languageNames = {
    [SUPPORTED_LANGUAGES.EN]: 'English',
    [SUPPORTED_LANGUAGES.ES]: 'Español',
    [SUPPORTED_LANGUAGES.FR]: 'Français',
    [SUPPORTED_LANGUAGES.DE]: 'Deutsch',
  };

  const languageEmojis = {
    [SUPPORTED_LANGUAGES.EN]: '🇺🇸',
    [SUPPORTED_LANGUAGES.ES]: '🇪🇸',
    [SUPPORTED_LANGUAGES.FR]: '🇫🇷',
    [SUPPORTED_LANGUAGES.DE]: '🇩🇪',
  };

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <label htmlFor="language-selector" className="sr-only">
        Select Language
      </label>
      <select
        id="language-selector"
        value={currentLanguage}
        onChange={handleLanguageChange}
        className="
          appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8
          text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          hover:border-gray-400 transition-colors
        "
        aria-label="Select Language"
      >
        {Object.values(supportedLanguages).map((langCode) => (
          <option key={langCode} value={langCode}>
            {languageEmojis[langCode]} {languageNames[langCode]}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="
        absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none
      ">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
