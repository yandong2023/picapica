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

    

    const imgWidth = 310;  
    const imgHeight = 190; 
    const borderSize = 20;  
    const photoSpacing = 10;  
    const textHeight = 25;  // Adjusted text height
    const totalHeight = (imgHeight * 4) + (photoSpacing * 3) + (borderSize * 2) + textHeight;

    // Set canvas dimensions
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
        const yOffset = borderSize + (imgHeight + photoSpacing) * index;

        // Draw image
        ctx.drawImage(img, borderSize, yOffset, imgWidth, imgHeight);

        
        imagesLoaded++;

        if (imagesLoaded === capturedImages.length) {
          // Format timestamp to match purple strip
          const now = new Date();
          const timestamp = now.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
          }) + '       ' + 
          now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          });

          // Set text style
          ctx.fillStyle = "#000000";
          ctx.font = "16px Arial";
          ctx.textAlign = "left";
          
          // Position text at bottom left with padding
          ctx.fillText(
            "Picapica          " + timestamp,
            borderSize,
            totalHeight - borderSize
          );
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