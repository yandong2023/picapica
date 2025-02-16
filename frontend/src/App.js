import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoBooth from "./PhotoBooth";
import PhotoPreview from "./PhotoPreview";

function App() {
  const [capturedImages, setCapturedImages] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoBooth setCapturedImages={setCapturedImages} />} />
        <Route path="/preview" element={<PhotoPreview capturedImages={capturedImages} />} />
      </Routes>
    </Router>
  );
}

export default App;
