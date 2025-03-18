import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SocialShare from "./SocialShare";

const PhotoPreview = ({ capturedImages }) => {
	const stripCanvasRef = useRef(null);
	const navigate = useNavigate();
	const [stripColor, setStripColor] = useState("white");
	const [selectedFrame, setSelectedFrame] = useState("none");
	const [generatedImage, setGeneratedImage] = useState(null);
	const [showShare, setShowShare] = useState(false);

	const generatePhotoStrip = useCallback(() => {
		const canvas = stripCanvasRef.current;
		if (!canvas || !capturedImages || capturedImages.length === 0) {
			return;
		}

		const ctx = canvas.getContext("2d");
		const borderSize = 40;
		const spacing = 20;
		const photoWidth = 300;
		const photoHeight = 225;
		const totalWidth = photoWidth + borderSize * 2;
		const totalHeight =
			capturedImages.length * photoHeight +
			(capturedImages.length - 1) * spacing +
			borderSize * 2;

		// Set canvas dimensions
		canvas.width = totalWidth;
		canvas.height = totalHeight;

		// Fill background
		ctx.fillStyle = stripColor;
		ctx.fillRect(0, 0, totalWidth, totalHeight);

		// Load and draw images
		let imagesLoaded = 0;
		capturedImages.forEach((src, index) => {
			const img = new Image();
			img.onload = () => {
				const yOffset = borderSize + index * (photoHeight + spacing);
				const imgWidth = photoWidth;
				const imgHeight = photoHeight;

				// Draw the photo
				ctx.drawImage(img, borderSize, yOffset, imgWidth, imgHeight);

				// Apply frame decorations based on selected frame
				if (selectedFrame !== "none") {
					drawFrameDecorations(ctx, borderSize, yOffset, imgWidth, imgHeight, selectedFrame);
				}

				imagesLoaded++;
				if (imagesLoaded === capturedImages.length) {
					// Draw border
					ctx.strokeStyle = "#333";
					ctx.lineWidth = 2;
					ctx.strokeRect(
						borderSize / 2,
						borderSize / 2,
						totalWidth - borderSize,
						totalHeight - borderSize
					);

					// Add logo or text
					ctx.fillStyle = stripColor === "black" ? "white" : "black";
					ctx.font = "12px Arial";
					ctx.textAlign = "center";

					ctx.fillText(
						" 2025 AW",
						canvas.width - borderSize,
						totalHeight - borderSize / 2
					);
				}
			};
			img.src = src;
		});
	}, [capturedImages, stripColor, selectedFrame]);

	// Draw frame decorations
	const drawFrameDecorations = (ctx, x, y, width, height, frameType) => {
		switch (frameType) {
			case "pastel":
				// Draw pastel stickers
				// Draw hearts
				drawHeart(ctx, x + 20, y + 20, 15, "#ff6b9d");
				drawHeart(ctx, x + width - 20, y + 20, 15, "#ff6b9d");
				drawHeart(ctx, x + 20, y + height - 20, 15, "#ff6b9d");
				drawHeart(ctx, x + width - 20, y + height - 20, 15, "#ff6b9d");
				
				// Draw stars
				drawStar(ctx, x + width / 2, y + 20, 10, "#FFD700");
				drawStar(ctx, x + width / 2, y + height - 20, 10, "#FFD700");
				break;
				
			case "cute":
				// Draw cute stickers
				// Draw clouds
				drawCloud(ctx, x + 30, y + 30, "#87CEEB");
				drawCloud(ctx, x + width - 30, y + 30, "#87CEEB");
				
				// Draw flowers
				drawFlower(ctx, x + 30, y + height - 30, "#FF9BE4");
				drawFlower(ctx, x + width - 30, y + height - 30, "#FF9BE4");
				break;
				
			default:
				break;
		}
	};

	// Draw heart
	const drawHeart = (ctx, x, y, size, color) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x, y + size / 4);
		ctx.bezierCurveTo(
			x, y, 
			x - size / 2, y, 
			x - size / 2, y + size / 4
		);
		ctx.bezierCurveTo(
			x - size / 2, y + size / 2, 
			x, y + size * 0.75, 
			x, y + size
		);
		ctx.bezierCurveTo(
			x, y + size * 0.75, 
			x + size / 2, y + size / 2, 
			x + size / 2, y + size / 4
		);
		ctx.bezierCurveTo(
			x + size / 2, y, 
			x, y, 
			x, y + size / 4
		);
		ctx.fill();
	};

	// Draw star
	const drawStar = (ctx, x, y, size, color) => {
		ctx.fillStyle = color;
		ctx.beginPath();
		for (let i = 0; i < 5; i++) {
			const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
			const point = i === 0 ? "moveTo" : "lineTo";
			ctx[point](
				x + size * Math.cos(angle),
				y + size * Math.sin(angle)
			);
		}
		ctx.closePath();
		ctx.fill();
	};

	// Draw cloud
	const drawCloud = (ctx, x, y, color) => {
		ctx.fillStyle = color;
		const cloudParts = [
			{ x: 0, y: 0, r: 14 },
			{ x: -10, y: 5, r: 10 },
			{ x: 10, y: 5, r: 10 },
		];
		cloudParts.forEach((part) => {
			ctx.beginPath();
			ctx.arc(x + part.x, y + part.y, part.r, 0, Math.PI * 2);
			ctx.fill();
		});
	};

	// Draw flower
	const drawFlower = (ctx, x, y, color) => {
		ctx.fillStyle = color;
		for (let i = 0; i < 5; i++) {
			ctx.beginPath();
			const angle = (i * 2 * Math.PI) / 5;
			ctx.ellipse(
				x + Math.cos(angle) * 10,
				y + Math.sin(angle) * 10,
				8,
				8,
				0,
				0,
				2 * Math.PI
			);
			ctx.fill();
		}
		// Flower center
		ctx.fillStyle = "#FFE4E1";
		ctx.beginPath();
		ctx.arc(x, y, 6, 0, 2 * Math.PI);
		ctx.fill();
	};

	useEffect(() => {
		if (!capturedImages || capturedImages.length === 0) {
			navigate("/photobooth");
		} else {
			generatePhotoStrip();
		}
	}, [capturedImages, generatePhotoStrip, navigate]);

	useEffect(() => {
		generatePhotoStrip();
	}, [stripColor, selectedFrame, generatePhotoStrip]);

	const downloadPhotoStrip = () => {
		const canvas = stripCanvasRef.current;
		if (!canvas) return;

		const dataUrl = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "picapica-photostrip.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleShare = () => {
		const canvas = stripCanvasRef.current;
		if (!canvas) return;
		
		const dataUrl = canvas.toDataURL("image/png");
		setGeneratedImage(dataUrl);
		setShowShare(true);
	};

	const closeShare = () => {
		setShowShare(false);
	};

	return (
		<div className="photo-preview">
			<h2>Photo Preview</h2>

			<div className="color-options">
				<button onClick={() => setStripColor("white")}>White</button>
				<button onClick={() => setStripColor("black")}>Black</button>
				<button onClick={() => setStripColor("#f6d5da")}>Pink</button>
				<button onClick={() => setStripColor("#dde6d5")}>Green</button>
				<button onClick={() => setStripColor("#adc3e5")}>Blue</button>
				<button onClick={() => setStripColor("#FFF2CC")}>Yellow</button>
				<button onClick={() => setStripColor("#dbcfff")}>Purple</button>
			</div>

			<div className="frame-options">
				<button onClick={() => setSelectedFrame("pastel")}>Girly Stickers</button>
				<button onClick={() => setSelectedFrame("cute")}>Cute Stickers</button>
				<button onClick={() => setSelectedFrame("none")}>No Stickers</button>
			</div>

			<canvas ref={stripCanvasRef} className="photo-strip" />

			<div className="preview-actions">
				<button onClick={downloadPhotoStrip} className="download-button">Download Photo Strip</button>
				<button onClick={() => navigate("/photobooth")} className="back-button">Take New Photos</button>
				<button onClick={handleShare} className="share-button">Share Photo</button>
			</div>

			{showShare && generatedImage && (
				<SocialShare imageUrl={generatedImage} onClose={closeShare} />
			)}
		</div>
	);
};

export default PhotoPreview;
