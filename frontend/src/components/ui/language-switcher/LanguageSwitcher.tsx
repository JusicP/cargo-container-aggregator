import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(event.target.value);
    };

    const languages = [
        { code: 'ua', label: 'Українська', short: 'УКР' },
        { code: 'en', label: 'English', short: 'ENG' }
    ];

    return (
        <div className="language-switcher">
            <select
                value={i18n.language}
                onChange={changeLanguage}
                className="language-select"
                aria-label="Select language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.short}
                    </option>
                ))}
            </select>
            <span className="select-arrow">▾</span>
        </div>
    );
};

export default LanguageSwitcher;