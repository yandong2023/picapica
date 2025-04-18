// src/components/PrivacyPolicy.js

import React from 'react';
import '../App.css';

const PrivacyPolicy = () => {
  return (
    <div className="background-gradient h-screen flex flex-col justify-center items-center text-center">
      <div className="privacy-container">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-700 mb-4">
          At PicapicaBooth, your privacy is our top priority. We do not track, collect, or store any personal data.
          All photos taken are processed locally on your device and are not uploaded or saved to any external server.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          We respect your privacy and are committed to protecting it. No cookies or trackers are used on this site.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          PicapicaBooth is designed with your privacy in mind, allowing you to create and share photo memories without compromising your personal information.
        </p>
    </div>
    </div>
  );
};

export default PrivacyPolicy;
