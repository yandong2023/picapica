import React from 'react';
import { useLanguage } from '../i18n/i18n';

const LanguageSwitcher = ({ onSwitchLanguage }) => {
  const { language, changeLanguage, t } = useLanguage();

  const handleSwitch = (lang) => {
    changeLanguage(lang);
    if (onSwitchLanguage) {
      onSwitchLanguage(lang);
    }
  };

  return (
    <div className="language-switcher">
      <button 
        className={`${language === 'zh' ? 'active' : ''}`} 
        onClick={() => handleSwitch('zh')}
        title={t('switchToChinese')}
        aria-label={t('switchToChinese')}
      >
        <span style={{fontSize: 24}}>🇨🇳</span>
      </button>
      <button 
        className={`${language === 'en' ? 'active' : ''}`} 
        onClick={() => handleSwitch('en')}
        title={t('switchToEnglish')}
        aria-label={t('switchToEnglish')}
      >
        <span style={{fontSize: 24}}>🇬🇧</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
