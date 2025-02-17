import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PhotoBooth = ({ setCapturedImages }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);

  // Detect if it's a mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    startCamera();
  
    const handleVisibilityChange = () => {
        if (!document.hidden) {
            startCamera();
        }
    };
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
}, []);

  // Start Camera
  const startCamera = async () => {
    try {
        const constraints = {
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            
            // Fix mirroring issue
            videoRef.current.style.transform = "scaleX(-1)";
            videoRef.current.style.objectFit = "cover"; // Ensures it doesn't stretch weirdly
        }
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
};

  // Countdown to take 4 pictures automatically
  const startCountdown = () => {
    if (capturing) return;
    setCapturing(true);

    let photosTaken = 0;
    const newCapturedImages = [];

    const captureSequence = () => {
      if (photosTaken >= 4) {
        setCountdown(null);
        setCapturing(false);
        setCapturedImages((prevImages) => [...prevImages, ...newCapturedImages].slice(-4));
        setImages((prevImages) => [...prevImages, ...newCapturedImages].slice(-4)); 
        navigate("/preview");
        return;
      }

      let timeLeft = 3;
      setCountdown(timeLeft);

      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft === 0) {
          clearInterval(timer);
          const imageUrl = capturePhoto();
          if (imageUrl) {
            newCapturedImages.push(imageUrl);
            setImages((prevImages) => [...prevImages, imageUrl]);
          }
          photosTaken += 1;
          setTimeout(captureSequence, 1000);
        }
      }, 1000);
    };

    captureSequence();
  };

  // Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
        const context = canvas.getContext("2d");

        // Get the actual video dimensions
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set a standard aspect ratio (4:3 or 16:9)
        const aspectRatio = 4 / 3;
        let canvasWidth = videoWidth;
        let canvasHeight = videoWidth / aspectRatio;

        // If height exceeds videoHeight, adjust
        if (canvasHeight > videoHeight) {
            canvasHeight = videoHeight;
            canvasWidth = videoHeight * aspectRatio;
        }

        // Set canvas size
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Capture frame
        context.filter = filter;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageUrl = canvas.toDataURL("image/png");
        return imageUrl;
    }
};

  return (
    <div className="photo-booth">
      {countdown !== null && <h2 className="countdown animate">{countdown}</h2>}

      <div className="photo-container">
        <div className="camera-container">
          <video ref={videoRef} autoPlay className="video-feed" style={{ filter }} />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="preview-side">
          {capturedImages.map((image, index) => (
            <img key={index} src={image} alt={`Captured ${index + 1}`} className="side-preview" />
          ))}
        </div>
      </div>
      
      <div className="controls">
        <button onClick={startCountdown} disabled={capturing}>
          {capturing ? "Capturing..." : "Start Capture :)"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("none")}>No Filter</button>
        <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
        <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
      </div>
    </div>
  );
};

export default PhotoBooth;

