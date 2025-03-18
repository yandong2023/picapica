import React, { useState, useEffect } from 'react';
import '../App.css';

// Tutorial component
const Tutorial = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Tutorial steps content
  const steps = [
    {
      title: 'Welcome to PicapicaBooth!',
      content: 'Join over 300,000 monthly users who create amazing photo memories with PicapicaBooth. This quick tutorial will show you how to get started.',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    },
    {
      title: 'Step 1: Start Your Camera',
      content: 'Click the "Photo Settings" button to customize your experience, then "Start Capture" to activate your camera. PicapicaBooth will ask for permission to use your camera.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    },
    {
      title: 'Step 2: Customize Your Session',
      content: 'Set your countdown timer and choose how many photos you want to take. PicapicaBooth lets you personalize your photo session completely!',
      image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    },
    {
      title: 'Step 3: Get Creative with Filters',
      content: 'Apply fun filters to your photos! PicapicaBooth offers various options like Grayscale, Sepia, High Contrast, and more to make your photos stand out.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    },
    {
      title: 'Step 4: Share Your Memories',
      content: 'Save your photo strip or share it directly to social media. PicapicaBooth makes it easy to share your memories with friends and family worldwide!',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'
    }
  ];

  useEffect(() => {
    // Check if user is visiting for the first time
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  // Next step
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeTutorial();
    }
  };

  // Previous step
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Complete tutorial
  const completeTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
    if (onComplete) onComplete();
  };

  // If tutorial is not shown, return null
  if (!showTutorial) return null;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-container">
        <div className="tutorial-header">
          <h2>{steps[step].title}</h2>
          <button className="close-button" onClick={completeTutorial}>×</button>
        </div>
        
        <div className="tutorial-content">
          <div className="tutorial-image">
            {steps[step].image ? (
              <img 
                src={steps[step].image} 
                alt={`PicapicaBooth Tutorial - ${steps[step].title}`}
                className="tutorial-img" 
              />
            ) : (
              <div className="placeholder-image">
                <span>Step {step+1} Image</span>
              </div>
            )}
          </div>
          
          <p>{steps[step].content}</p>
          
          <div className="tutorial-progress">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`progress-dot ${index === step ? 'active' : ''}`}
                onClick={() => setStep(index)}
              />
            ))}
          </div>
        </div>
        
        <div className="tutorial-footer">
          {step > 0 && (
            <button className="tutorial-button" onClick={prevStep}>Previous</button>
          )}
          
          <button className="tutorial-button primary" onClick={nextStep}>
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
