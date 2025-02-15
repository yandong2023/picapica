import React, { useRef, useState, useEffect } from "react";

const PhotoBooth = () => {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);

  // Automatically start the camera when photobooth is opened
  useEffect(() => {
    if (showCamera) {
      startCamera();
    }
  }, [showCamera]);

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
    if (capturing) return;
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
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.filter = filter;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageUrl = canvas.toDataURL("image/png");
      setCapturedImages((prevImages) => {
        const updatedImages = [...prevImages, imageUrl];
        return updatedImages.slice(-4);
      });
    }
  };

  // Reset the photobooth
  const resetPhotoBooth = () => {
    setCapturedImages([]);
    setCountdown(null);
    setCapturing(false);

    if (videoRef.current && videoRef.current.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false); // Go back to home screen
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
            <button onClick={startCountdown} disabled={capturing}>Start Capture</button>
            <button onClick={resetPhotoBooth}>Reset</button>
            <button onClick={downloadPhotoStrip} disabled={capturedImages.length === 0}>Download Photo Strip</button>
          </div>
          <div className="filters">
            <button onClick={() => setFilter("none")}>No Filter</button>
            <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
            <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;

