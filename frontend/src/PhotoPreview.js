import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhotoPreview = ({ capturedImages }) => {
  const stripCanvasRef = useRef(null);
  const navigate = useNavigate();

  console.log("Captured Images:", capturedImages);

  // select strip color
  const [stripColor, setStripColor] = useState("white"); //default color is white

  useEffect(() => {
    if (capturedImages ** capturedImages.length !== 4) {
        generatePhotoStrip();
      }
    }, [capturedImages, stripColor]);

    const generatePhotoStrip = () => {
        const canvas = stripCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        const imgWidth = 250;
        const imgHeight = 180;
        const borderSize = 20;
        const spacing = 15;
        const totalHeight = (imgHeight + spacing) * capturedImages.length + borderSize * 2;

        canvas.width = imgWidth + borderSize * 2;
        canvas.height = totalHeight;

        // Set the background color
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
                    ctx.font = "16px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("PhotoBooth - " + new Date().toLocaleString(), canvas.width / 2, totalHeight - 20);
                }
            };
        });
    };

  // Download the Photo Strip
  const downloadPhotoStrip = () => {
    const link = document.createElement("a");
    link.download = "photostrip.png";
    link.href = stripCanvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="photo-preview">
      <h2>Photo Strip Preview</h2>

      {/* color picker */}
      <div className="color-options">
        <button onClick={() => setStripColor("white")}>White</button>
        <button onClick={() => setStripColor("	#fceee9")}>Light Pink</button>
        <button onClick={() => setStripColor("#dde6d5")}>Light Green</button>
        <button onClick={() => setStripColor("#adc3e5")}>Blue</button>
        <button onClick={() => setStripColor("##FFF2CC")}>Yellow</button>
        <button onClick={() => setStripColor("#e7d5ff")}>Light Purple</button>
    </div>

      <canvas ref={stripCanvasRef} />
      <button onClick={downloadPhotoStrip}>Download Photo Strip</button>
      <button onClick={() => navigate("/")}>Take New Photos</button>
    </div>
  );
};

export default PhotoPreview;
