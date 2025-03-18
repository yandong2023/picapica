import "./App.css";
import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";  
import Home from "./components/Home";
import Welcome from "./components/Welcome";
import PhotoBooth from "./components/PhotoBooth";
import PhotoPreview from "./components/PhotoPreview";
import PrivacyPolicy from './components/PrivacyPolicy';
import Contact from "./components/Contact";
import Tutorial from "./components/Tutorial";


function App() {
	const [capturedImages, setCapturedImages] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);

  // Show tutorial
  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  // Close tutorial
  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="App">
      {showTutorial && <Tutorial onComplete={handleCloseTutorial} />}
      
      <header className="App-header">
        <nav className="navbar">
          <Link to="/" className="logo-link">
            <h1>PicapicaBooth</h1>
          </Link>
          <Link to="/">Home</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/contact">Contact</Link>
          <button className="tutorial-link" onClick={handleShowTutorial}>
            Tutorial
          </button>
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

export default App;
