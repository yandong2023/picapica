import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhotoPreview = ({ capturedImages }) => {
  const stripCanvasRef = useRef(null);
  const navigate = useNavigate();
  const [stripColor, setStripColor] = useState("white");

  useEffect(() => {
    if (capturedImages.length === 4) {
        setTimeout(() => {
            generatePhotoStrip();
        }, 100);
    }
  }, [capturedImages, stripColor]);

  const generatePhotoStrip = () => {
    const canvas = stripCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const imgWidth = 180; // Match photobooth-strip width
    const imgHeight = imgWidth * (3 / 4); // Maintain aspect ratio 4:3
    const borderSize = 20;
    const spacing = 10;
    const textHeight = 30; // Adjust for text placement
    const totalHeight = (imgHeight + spacing) * capturedImages.length + borderSize * 2 + textHeight;

    canvas.width = imgWidth + borderSize * 2;
    canvas.height = totalHeight;

    // Set background color
    ctx.fillStyle = stripColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let imagesLoaded = 0;
    capturedImages.forEach((image, index) => {
        const img = new Image();
        img.src = image;
        img.onload = () => {
            ctx.drawImage(img, borderSize, borderSize + (imgHeight + spacing) * index, imgWidth, imgHeight);
            imagesLoaded++;

            if (imagesLoaded === capturedImages.length) {
                ctx.fillStyle = "#000000";
                ctx.font = "14px Arial";
                ctx.textAlign = "center";
                ctx.fillText("PhotoBooth - " + new Date().toLocaleString(), canvas.width / 2, totalHeight - 10);
            }
        };
    });
  };

  const downloadPhotoStrip = () => {
    const link = document.createElement("a");
    link.download = "photostrip.png";
    link.href = stripCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="photo-preview">
      <h2>Photo Strip Preview</h2>

      <div className="color-options">
        <button onClick={() => setStripColor("white")}>White</button>
        <button onClick={() => setStripColor("#fceee9")}>Pink</button>
        <button onClick={() => setStripColor("#dde6d5")}>Green</button>
        <button onClick={() => setStripColor("#adc3e5")}>Blue</button>
        <button onClick={() => setStripColor("#FFF2CC")}>Yellow</button>
        <button onClick={() => setStripColor("#dbcfff")}>Purple</button>
      </div>

      <canvas ref={stripCanvasRef} className="photo-strip" />

      <div className="strip-buttons">
        <button onClick={downloadPhotoStrip}>📥 Download Photo Strip</button>
        <button onClick={() => navigate("/")}>🔄 Take New Photos</button>
      </div>
    </div>
  );
};

export default PhotoPreview;
