import React, { useRef, useState } from "react";

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]); // Holds multiple images
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(0); // Holds countdown value

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

  const startCountdown = () => {
    let timeLeft = 3; // Set countdown duration (3 seconds)
    setCountdown(timeLeft);

    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft === 0) {
        clearInterval(timer);
        capturePhoto(); // Capture the photo when countdown reaches 0
      }
    }, 1000);
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

  const downloadPhotoStrip = () => {
    if (capturedImages.length === 0) return;

    const imgWidth = 400; // Image width
    const imgHeight = 300; // Image height per photo
    const borderSize = 30; // White border around the strip
    const spacing = 20; // Space between photos
    const textHeight = 50; // Extra space for text at the bottom

    // Calculate total height based on image count
    const totalHeight = (imgHeight * capturedImages.length) + (spacing * (capturedImages.length - 1)) + (borderSize * 2) + textHeight;

    // Create a canvas
    const stripCanvas = document.createElement("canvas");
    const ctx = stripCanvas.getContext("2d");

    // Set proper width & height
    stripCanvas.width = imgWidth + (borderSize * 2); 
    stripCanvas.height = totalHeight;

    // Set background color to white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, stripCanvas.width, stripCanvas.height);

    // Draw each image in a vertical stack
    let loadedImages = 0;
    capturedImages.forEach((image, index) => {
        const yPos = borderSize + (imgHeight + spacing) * index;
        const xPos = borderSize;

        const img = new Image();
        img.src = image;
        img.onload = () => {
            ctx.drawImage(img, xPos, yPos, imgWidth, imgHeight);
            loadedImages++;

            // If all images are loaded, finalize the image and trigger download
            if (loadedImages === capturedImages.length) {
                ctx.fillStyle = "#000000"; // Black text
                ctx.font = "20px Arial";
                ctx.textAlign = "center";
                ctx.fillText("PhotoBooth - " + new Date().toLocaleDateString(), stripCanvas.width / 2, stripCanvas.height - 20);

                // Convert canvas to an image and download
                const link = document.createElement("a");
                link.download = "photobooth.png";
                link.href = stripCanvas.toDataURL("image/png");
                link.click();
            }
        };
    });
};


  return (
    <div className="photo-booth">
      <h1>PhotoBooth App 📸</h1>
      <video ref={videoRef} autoPlay className="video-feed" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Countdown display */}
      {countdown > 0 && <h2 className="countdown">Capture in {countdown}...</h2>}

      <div className="controls">
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={startCountdown}>Capture</button>
      </div>

      {/* Display up to 4 captured images in a vertical strip */}
      <div className="photo-strip">
        {capturedImages.map((image, index) => (
          <img key={index} src={image} alt={`Captured ${index + 1}`} className="captured-photo" />
        ))}
      </div>

      <div className="filters">
        <button onClick={() => setFilter("none")}>No Filter</button>
        <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
        <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
      </div>

      {/* Download button */}
      <button onClick={downloadPhotoStrip}>Download Photo Strip</button>
    </div>
  );
};

export default PhotoBooth;

