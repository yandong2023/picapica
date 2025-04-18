// i18n.js - Multilingual support configuration
import { createContext, useState, useContext, useEffect } from 'react';
import translations from './translations';

// 创建语言上下文
export const LanguageContext = createContext();

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // Get saved language setting from localStorage, default to English
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('picapica_language');
    return savedLanguage || 'en'; // Default to English
  });

  // 切换语言函数
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('picapica_language', lang);
    // 更新HTML lang属性
    document.documentElement.lang = lang;
  };

  // 翻译函数
  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // 如果找不到翻译，返回键名
        return key;
      }
    }
    
    return translation;
  };

  // 初始化时设置HTML lang属性
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 使用语言的自定义Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default { LanguageProvider, useLanguage };
