import React from 'react';
import { useLanguage } from '../i18n/i18n';

const LanguageSwitcher = () => {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <div className="language-switcher">
      <button 
        className={`${language === 'zh' ? 'active' : ''}`} 
        onClick={() => changeLanguage('zh')}
        title={t('switchToChinese')}
        aria-label={t('switchToChinese')}
      >
        <svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" fill="#EE1C25"/>
          <g fill="#FFFF00">
            <path d="M10,9 L13,12 L11,12 L14,15 L12,15 L15,18 L9,18 L12,15 L10,15 L13,12 L11,12 L10,9 Z"/>
            <path d="M20,9 L18,11 L20,11 L18,13 L20,13 L18,15 L22,15 L22,9 L20,9 Z"/>
            <path d="M28,13 L26,11 L24,13 L24,9 L22,11 L22,15 L28,15 L28,13 Z"/>
            <path d="M20,18 L18,20 L20,20 L18,22 L20,22 L18,24 L22,24 L22,18 L20,18 Z"/>
            <path d="M28,22 L26,20 L24,22 L24,18 L22,20 L22,24 L28,24 L28,22 Z"/>
          </g>
        </svg>
      </button>
      <button 
        className={`${language === 'en' ? 'active' : ''}`} 
        onClick={() => changeLanguage('en')}
        title={t('switchToEnglish')}
        aria-label={t('switchToEnglish')}
      >
        <svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" fill="#00247D"/>
          <path d="M0,0 L36,36 M36,0 L0,36" stroke="#FFFFFF" strokeWidth="3.6"/>
          <path d="M0,0 L36,36 M36,0 L0,36" stroke="#CF142B" strokeWidth="2.4"/>
          <path d="M18,0 L18,36 M0,18 L36,18" stroke="#FFFFFF" strokeWidth="6"/>
          <path d="M18,0 L18,36 M0,18 L36,18" stroke="#CF142B" strokeWidth="3.6"/>
        </svg>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
