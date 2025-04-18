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
	const [layoutStyle, setLayoutStyle] = useState("classic"); // classic, grid, polaroid, magazine

	const generatePhotoStrip = useCallback(() => {
		const canvas = stripCanvasRef.current;
		if (!canvas || !capturedImages || capturedImages.length === 0) {
			return;
		}

		const ctx = canvas.getContext("2d");
		const borderSize = 40;
		const spacing = 20;
		let photoWidth, photoHeight, totalWidth, totalHeight;
		
		// Set dimensions based on layout style
		switch(layoutStyle) {
			case "grid":
				// 2x2 grid layout (or similar based on photo count)
				photoWidth = 250;
				photoHeight = 250; // Square photos
				const cols = Math.min(2, capturedImages.length);
				const rows = Math.ceil(capturedImages.length / 2);
				totalWidth = cols * photoWidth + (cols - 1) * spacing + borderSize * 2;
				totalHeight = rows * photoHeight + (rows - 1) * spacing + borderSize * 2;
				break;
				
			case "polaroid":
				// Polaroid-style layout with rotated photos
				photoWidth = 280;
				photoHeight = 240;
				// Extra space for polaroid frames and rotation
				totalWidth = 500;
				totalHeight = Math.max(600, capturedImages.length * 150 + 200);
				break;
				
			case "magazine":
				// Magazine cover style layout
				photoWidth = 320;
				photoHeight = 240;
				totalWidth = 400;
				totalHeight = 600;
				break;
				
			case "classic":
				default:
				// Classic vertical strip
				photoWidth = 300;
				photoHeight = 225;
				totalWidth = photoWidth + borderSize * 2;
				totalHeight =
					capturedImages.length * photoHeight +
					(capturedImages.length - 1) * spacing +
					borderSize * 2;
				break;
		}

		// Set canvas dimensions
		canvas.width = totalWidth;
		canvas.height = totalHeight;

		// Fill background
		ctx.fillStyle = stripColor;
		ctx.fillRect(0, 0, totalWidth, totalHeight);

		// Load and draw images
		let imagesLoaded = 0;
		const images = [];
		
		// Preload all images first
		capturedImages.forEach((src) => {
			const img = new Image();
			img.onload = () => {
				imagesLoaded++;
				if (imagesLoaded === capturedImages.length) {
					// All images loaded, now draw based on layout
					drawLayout(ctx, images, borderSize, spacing, photoWidth, photoHeight, totalWidth, totalHeight);
				}
			};
			img.src = src;
			images.push(img);
		});
		
		// Function to draw the layout based on selected style
		const drawLayout = (ctx, images, borderSize, spacing, photoWidth, photoHeight, totalWidth, totalHeight) => {
			switch(layoutStyle) {
				case "grid":
					// Draw grid layout
					images.forEach((img, index) => {
						const col = index % 2;
						const row = Math.floor(index / 2);
						const xOffset = borderSize + col * (photoWidth + spacing);
						const yOffset = borderSize + row * (photoHeight + spacing);
						
						// Draw photo
						ctx.drawImage(img, xOffset, yOffset, photoWidth, photoHeight);
						
						// Apply frame if selected
						if (selectedFrame !== "none") {
							drawFrameDecorations(ctx, xOffset, yOffset, photoWidth, photoHeight, selectedFrame);
						}
					});
					break;
					
				case "polaroid":
					// Draw polaroid-style layout
					images.forEach((img, index) => {
						// Save context for rotation
						ctx.save();
						
						// Calculate position with slight overlap
						const centerX = totalWidth / 2;
						const yPos = borderSize + index * 100;
						
						// Rotate slightly (alternate left/right)
						const rotation = (index % 2 === 0) ? -0.1 : 0.1;
						ctx.translate(centerX, yPos + photoHeight/2);
						ctx.rotate(rotation);
						
						// Draw polaroid frame (white border)
						ctx.fillStyle = "white";
						ctx.fillRect(-photoWidth/2 - 20, -photoHeight/2 - 20, photoWidth + 40, photoHeight + 60);
						
						// Draw photo
						ctx.drawImage(img, -photoWidth/2, -photoHeight/2, photoWidth, photoHeight);
						
						// Add polaroid caption area
						ctx.fillStyle = "#333";
						ctx.font = "italic 14px Arial";
						ctx.textAlign = "center";
						ctx.fillText(`Photo ${index + 1}`, 0, photoHeight/2 + 25);
						
						ctx.restore();
					});
					break;
					
				case "magazine":
					// Draw magazine cover style
					// Background and border
					ctx.fillStyle = "#000";
					ctx.fillRect(0, 0, totalWidth, totalHeight);
					
					// Title bar
					ctx.fillStyle = "#FF6B9D";
					ctx.fillRect(0, 40, totalWidth, 60);
					
					// Magazine title
					ctx.fillStyle = "white";
					ctx.font = "bold 30px Arial";
					ctx.textAlign = "center";
					ctx.fillText("PICAPICABOOTH", totalWidth/2, 80);
					
					// Main photo (largest)
					if (images.length > 0) {
						ctx.drawImage(images[0], borderSize, 120, totalWidth - borderSize*2, 280);
					}
					
					// Smaller photos at bottom
					const smallWidth = (totalWidth - borderSize*2 - spacing*(Math.min(3, images.length-1))) / Math.min(3, images.length-1);
					for (let i = 1; i < Math.min(4, images.length); i++) {
						const xPos = borderSize + (i-1) * (smallWidth + spacing);
						ctx.drawImage(images[i], xPos, 420, smallWidth, 100);
					}
					
					// Magazine taglines
					ctx.fillStyle = "white";
					ctx.font = "bold 16px Arial";
					ctx.textAlign = "left";
					ctx.fillText("EXCLUSIVE PHOTOSHOOT", borderSize, 30);
					
					ctx.font = "14px Arial";
					ctx.fillText("PICAPICABOOTH SPECIAL EDITION", borderSize, totalHeight - 20);
					break;
					
				case "classic":
					default:
					// Classic vertical strip
					images.forEach((img, index) => {
						const yOffset = borderSize + index * (photoHeight + spacing);
						
						// Draw photo
						ctx.drawImage(img, borderSize, yOffset, photoWidth, photoHeight);
						
						// Apply frame if selected
						if (selectedFrame !== "none") {
							drawFrameDecorations(ctx, borderSize, yOffset, photoWidth, photoHeight, selectedFrame);
						}
					});
					break;
			}
			
			// Draw border for all layouts except magazine which has its own styling
			if (layoutStyle !== "magazine") {
				ctx.strokeStyle = "#333";
				ctx.lineWidth = 2;
				ctx.strokeRect(
					borderSize / 2,
					borderSize / 2,
					totalWidth - borderSize,
					totalHeight - borderSize
				);
			}
			
			// Add watermark/logo
			ctx.fillStyle = stripColor === "black" ? "white" : "black";
			ctx.font = "12px Arial";
			ctx.textAlign = "center";
			ctx.fillText(
				"PicapicaBooth 2025",
				canvas.width - borderSize,
				totalHeight - borderSize / 2
			);
		};
		
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
		link.download = "picapicabooth-photostrip.png";
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
			<h2>PicapicaBooth Photo Preview</h2>

			<div className="layout-options">
				<h3><i className="fas fa-th-large"></i> Choose Layout Style</h3>
				<div className="layout-buttons">
					<button 
						className={layoutStyle === "classic" ? "active" : ""}
						onClick={() => setLayoutStyle("classic")}
					>
						<i className="fas fa-grip-lines"></i> Classic Strip
					</button>
					<button 
						className={layoutStyle === "grid" ? "active" : ""}
						onClick={() => setLayoutStyle("grid")}
					>
						<i className="fas fa-th"></i> Grid Layout
					</button>
					<button 
						className={layoutStyle === "polaroid" ? "active" : ""}
						onClick={() => setLayoutStyle("polaroid")}
					>
						<i className="fas fa-images"></i> Polaroid Style
					</button>
					<button 
						className={layoutStyle === "magazine" ? "active" : ""}
						onClick={() => setLayoutStyle("magazine")}
					>
						<i className="fas fa-book-open"></i> Magazine Cover
					</button>
				</div>
			</div>
			
			<div className="color-options">
				<h3><i className="fas fa-palette"></i> Choose Background Color</h3>
				<div className="color-buttons">
					<button className={stripColor === "white" ? "active" : ""} onClick={() => setStripColor("white")}>
						<span className="color-preview white"></span> White
					</button>
					<button className={stripColor === "black" ? "active" : ""} onClick={() => setStripColor("black")}>
						<span className="color-preview black"></span> Black
					</button>
					<button className={stripColor === "#f6d5da" ? "active" : ""} onClick={() => setStripColor("#f6d5da")}>
						<span className="color-preview pink"></span> Pink
					</button>
					<button className={stripColor === "#dde6d5" ? "active" : ""} onClick={() => setStripColor("#dde6d5")}>
						<span className="color-preview green"></span> Green
					</button>
					<button className={stripColor === "#adc3e5" ? "active" : ""} onClick={() => setStripColor("#adc3e5")}>
						<span className="color-preview blue"></span> Blue
					</button>
					<button className={stripColor === "#FFF2CC" ? "active" : ""} onClick={() => setStripColor("#FFF2CC")}>
						<span className="color-preview yellow"></span> Yellow
					</button>
					<button className={stripColor === "#dbcfff" ? "active" : ""} onClick={() => setStripColor("#dbcfff")}>
						<span className="color-preview purple"></span> Purple
					</button>
				</div>
			</div>

			<div className="frame-options">
				<h3><i className="fas fa-star"></i> Choose Decorations</h3>
				<div className="frame-buttons">
					<button className={selectedFrame === "pastel" ? "active" : ""} onClick={() => setSelectedFrame("pastel")}>
						<i className="fas fa-heart"></i> Girl Stickers
					</button>
					<button className={selectedFrame === "cute" ? "active" : ""} onClick={() => setSelectedFrame("cute")}>
						<i className="fas fa-cloud"></i> Cute Stickers
					</button>
					<button className={selectedFrame === "none" ? "active" : ""} onClick={() => setSelectedFrame("none")}>
						<i className="fas fa-ban"></i> No Stickers
					</button>
				</div>
			</div>

			<canvas ref={stripCanvasRef} className="photo-strip" />

			<div className="preview-actions">
				<button onClick={downloadPhotoStrip} className="download-button">Download PicapicaBooth Photo Strip</button>
				<button onClick={() => navigate("/photobooth")} className="back-button">Take New Photos with PicapicaBooth</button>
				<button onClick={handleShare} className="share-button">Share Your PicapicaBooth Creation</button>
			</div>

			{showShare && generatedImage && (
				<SocialShare imageUrl={generatedImage} onClose={closeShare} />
			)}
		</div>
	);
};

export default PhotoPreview;
