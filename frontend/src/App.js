import "./App.css";
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";  
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import PhotoBooth from "./components/PhotoBooth";
import PhotoPreview from "./components/PhotoPreview";
import PrivacyPolicy from './components/PrivacyPolicy';
import Contact from "./components/Contact";
import Tutorial from "./components/Tutorial";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { LanguageProvider, useLanguage } from "./i18n/i18n";


// Main application wrapper component providing language context
function AppWrapper() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

// Main application content component
function AppContent() {
  const [capturedImages, setCapturedImages] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();

  // Show tutorial
  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  // Close tutorial
  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  // Page title update
  useEffect(() => {
    // Set page title based on current path
    const pathTitles = {
      '/': `${t('appName')} - ${t('tagline')}`,
      '/photobooth': t('photoBoothTitle'),
      '/preview': t('previewTitle'),
      '/privacy-policy': `${t('privacy')} | ${t('appName')}`,
      '/contact': `${t('contact')} | ${t('appName')}`
    };
    
    document.title = pathTitles[location.pathname] || `${t('appName')} - ${t('tagline')}`;
  }, [location.pathname, t]);

  return (
    <div className="App">
      {showTutorial && <Tutorial onComplete={handleCloseTutorial} />}
      
      <header className="App-header">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="logo-link">
              <div className="logo">
                <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="8" fill="#FF6B9D"/>
                  <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28C15.5817 28 12 24.4183 12 20Z" fill="white"/>
                  <circle cx="20" cy="20" r="4" fill="#FF6B9D"/>
                  <rect x="24" y="10" width="2" height="4" rx="1" fill="white"/>
                </svg>
                <h1>{t('appName')}</h1>
                <span className="free-tag">{t('free')}</span>
              </div>
            </Link>
          </div>
          
          <div className="nav-center">
            <Link to="/">{t('features')}</Link>
            <Link to="/">{t('gallery')}</Link>
            <Link to="/privacy-policy">{t('privacy')}</Link>
            <Link to="/contact">{t('contact')}</Link>
            <button className="tutorial-link" onClick={handleShowTutorial}>
              <i className="fas fa-play-circle"></i> {t('tutorial')}
            </button>
          </div>
          
          <div className="nav-right">
            <LanguageSwitcher />
          </div>
        </nav>
      </header>
  
      <Routes>
        <Route path="/" element={<Home onShowTutorial={handleShowTutorial} />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/photobooth" element={<PhotoBooth setCapturedImages={setCapturedImages} />} />
        <Route path="/preview" element={<PhotoPreview capturedImages={capturedImages} />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
