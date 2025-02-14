import React, { useRef, useState } from "react";

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]); // Holds multiple images
  const [filter, setFilter] = useState("none");

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
        const updatedImages = [imageUrl, ...prevImages];
        return updatedImages.slice(0, 4); // Keep only the last 4 images
      });
    }
  };

  return (
    <div className="photo-booth">
      <h1>PhotoBooth App 📸</h1>
      <video ref={videoRef} autoPlay className="video-feed" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="controls">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Capture</button>
      </div>

      {/* Display up to 4 captured images */}
      <div className="image-grid">
        {capturedImages.length > 0 ? (
          capturedImages.map((image, index) => (
            <img key={index} src={image} alt={`Captured ${index + 1}`} className="captured-photo" />
          ))
        ) : (
          <p>No photos captured yet</p>
        )}
      </div>

      <div className="filters">
        <button onClick={() => setFilter("none")}>No Filter</button>
        <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
        <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
      </div>
    </div> // ✅ Closing main parent div
  );
};

export default PhotoBooth;
