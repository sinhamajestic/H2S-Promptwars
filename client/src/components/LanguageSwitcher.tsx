import React from 'react';
import { useUserContext } from '../store/userContext';

export const LanguageSwitcher: React.FC = () => {
  const language = useUserContext((state) => state.language);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    useUserContext.setState({ language: e.target.value });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-switcher" className="sr-only">
        Select Language
      </label>
      <select
        id="language-switcher"
        value={language}
        onChange={handleChange}
        className="bg-white border border-slate-300 text-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label="Select Language"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};
