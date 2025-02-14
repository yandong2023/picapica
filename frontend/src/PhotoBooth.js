import React, { useRef, useState } from "react";

const PhotoBooth = () => {
  const [showCamera, setShowCamera] = useState(false); // Controls home screen vs. camera screen
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false); // FIX: Boolean, not array

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Countdown to take 4 pictures automatically
  const startCountdown = () => {
    if (capturing) return; // Prevent multiple captures at once
    setCapturing(true);

    let photosTaken = 0;

    const captureSequence = () => {
      if (photosTaken >= 4) {
        setCountdown(null);
        setCapturing(false);
        return;
      }

      let timeLeft = 3;
      setCountdown(timeLeft);

      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft === 0) {
          clearInterval(timer);
          capturePhoto();
          photosTaken += 1;
          setTimeout(captureSequence, 1000); // Wait 1 second before next countdown
        }
      }, 1000);
    };

    captureSequence(); // Start the countdown sequence
  };

  // Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.filter = filter;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageUrl = canvas.toDataURL("image/png");
      setCapturedImages((prevImages) => {
        const updatedImages = [...prevImages, imageUrl]; // Append new image at end
        return updatedImages.slice(-4); // Keep only last 4 images
      });
    }
  };

  // Reset the photobooth
  const resetPhotoBooth = () => {
    setCapturedImages([]);
    setCountdown(null);
    setCapturing(false);
  };

  // Download Photo Strip
  const downloadPhotoStrip = () => {
    if (capturedImages.length === 0) return;

    const imgWidth = 400;
    const imgHeight = 300;
    const borderSize = 30;
    const spacing = 20;
    const totalHeight = (imgHeight + spacing) * capturedImages.length + borderSize * 2;

    const stripCanvas = document.createElement("canvas");
    const ctx = stripCanvas.getContext("2d");

    stripCanvas.width = imgWidth + borderSize * 2;
    stripCanvas.height = totalHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

    let loadedImages = 0;

    capturedImages.forEach((image, index) => {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        ctx.drawImage(img, borderSize, borderSize + (imgHeight + spacing) * index, imgWidth, imgHeight);
        loadedImages++;

        if (loadedImages === capturedImages.length) {
          ctx.fillStyle = "#000000";
          ctx.font = "20px Arial";
          ctx.textAlign = "center";
          ctx.fillText("PhotoBooth - " + new Date().toLocaleString(), stripCanvas.width / 2, totalHeight - 20);

          const link = document.createElement("a");
          link.download = "photostrip.png";
          link.href = stripCanvas.toDataURL("image/png");
          link.click();
        }
      };
    });
  };

  if (!showCamera) {
    return (
      <div className="home-screen">
        <h1>Welcome to PhotoBooth 📸</h1>
        <button onClick={() => setShowCamera(true)}>Start</button>
      </div>
    );
  }

  return (
    <div className="photo-booth">
      <h1>PhotoBooth App 📸</h1>

      {countdown !== null && <h2 className="countdown">{countdown}</h2>}

      <div className="main-container">
        <div className="photo-strip">
          {capturedImages.map((image, index) => (
            <img key={index} src={image} alt={`Captured ${index + 1}`} className="captured-photo" />
          ))}
        </div>

        <div className="camera-container">
          <video ref={videoRef} autoPlay className="video-feed" />
          <canvas ref={canvasRef} className="hidden" />

          <div className="controls">
            <button onClick={startCamera}>Start Camera</button>
            <button onClick={startCountdown} disabled={capturing}>Capture 4 Photos</button>
            <button onClick={resetPhotoBooth}>Reset</button>
          </div>

          <div className="filters">
            <button onClick={() => setFilter("none")}>No Filter</button>
            <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
            <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
          </div>

          <button onClick={downloadPhotoStrip}>Download Photo Strip</button>
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
