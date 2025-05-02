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
	const [layoutStyle, setLayoutStyle] = useState('classic'); // classic, grid, polaroid, magazine, vintage, comic, collage, social

	const generatePhotoStrip = useCallback(() => {
		const canvas = stripCanvasRef.current;
		if (!canvas || !capturedImages || capturedImages.length === 0) {
			return;
		}

		const ctx = canvas.getContext("2d");
		const borderSize = 40;
		const spacing = 20;
		let photoWidth, photoHeight, totalWidth, totalHeight;
		
		// Set dimensions based on layout style - 提高分辨率到原来的2倍
		switch(layoutStyle) {
			case "grid":
				// 2x2 grid layout (or similar based on photo count)
				photoWidth = 500; // 原来是250
				photoHeight = 500; // 原来是250，保持正方形
				const cols = Math.min(2, capturedImages.length);
				const rows = Math.ceil(capturedImages.length / 2);
				totalWidth = cols * photoWidth + (cols - 1) * spacing + borderSize * 2;
				totalHeight = rows * photoHeight + (rows - 1) * spacing + borderSize * 2;
				break;
				
			case "polaroid":
				// Polaroid-style layout with rotated photos
				photoWidth = 560; // 原来是280
				photoHeight = 480; // 原来是240
				// Extra space for polaroid frames and rotation
				totalWidth = 1000; // 原来是500
				totalHeight = Math.max(1200, capturedImages.length * 300 + 400); // 原来是600, 150, 200
				break;
				
			case "magazine":
				// Magazine cover style layout
				photoWidth = 640; // 原来是320
				photoHeight = 480; // 原来是240
				totalWidth = 800; // 原来是400
				totalHeight = 1200; // 原来是600
				break;
				
			case "classic":
				default:
				// Classic vertical strip
				photoWidth = 600; // 原来是300
				photoHeight = 450; // 原来是225
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

                case "vintage":
                    // Draw vintage film style layout
                    // Sepia background
                    ctx.fillStyle = "#F5F5DC"; // Beige background
                    ctx.fillRect(0, 0, totalWidth, totalHeight);
                    
                    // Film strip holes on sides
                    ctx.fillStyle = "#222";
                    for (let i = 0; i < totalHeight; i += 40) {
                        // Left side holes
                        ctx.beginPath();
                        ctx.arc(10, i + 20, 8, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Right side holes
                        ctx.beginPath();
                        ctx.arc(totalWidth - 10, i + 20, 8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    
                    // Draw photos with sepia effect
                    images.forEach((img, index) => {
                        const yOffset = borderSize + 20 + index * (photoHeight + spacing + 10);
                        
                        // Draw photo frame
                        ctx.fillStyle = "#111";
                        ctx.fillRect(borderSize + 15, yOffset - 5, photoWidth + 10, photoHeight + 10);
                        
                        // Draw photo
                        ctx.drawImage(img, borderSize + 20, yOffset, photoWidth, photoHeight);
                        
                        // Apply sepia filter
                        const imageData = ctx.getImageData(borderSize + 20, yOffset, photoWidth, photoHeight);
                        const data = imageData.data;
                        
                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            
                            // Sepia formula
                            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                        }
                        
                        ctx.putImageData(imageData, borderSize + 20, yOffset);
                        
                        // Add vintage date
                        ctx.fillStyle = "#222";
                        ctx.font = "italic 12px 'Courier New', monospace";
                        ctx.textAlign = "right";
                        ctx.fillText(`1975.${index + 1}.${index + 10}`, borderSize + photoWidth + 15, yOffset + photoHeight + 15);
                    });
                    break;
                    
                case "comic":
                    // Comic book style layout
                    // Comic background
                    ctx.fillStyle = "#FFF";
                    ctx.fillRect(0, 0, totalWidth, totalHeight);
                    
                    // Comic header
                    ctx.fillStyle = "#FF5252";
                    ctx.fillRect(borderSize, borderSize, totalWidth - borderSize * 2, 50);
                    
                    ctx.fillStyle = "#FFF";
                    ctx.font = "bold 30px 'Comic Sans MS', cursive";
                    ctx.textAlign = "center";
                    ctx.fillText("PICAPICA COMICS", totalWidth / 2, borderSize + 35);
                    
                    // Draw comic panels
                    const panelWidth = (totalWidth - borderSize * 2 - spacing * (Math.min(2, images.length) - 1)) / Math.min(2, images.length);
                    const panelHeight = (totalHeight - borderSize * 2 - 50 - spacing * (Math.ceil(images.length / 2) - 1)) / Math.ceil(images.length / 2);
                    
                    images.forEach((img, index) => {
                        const col = index % 2;
                        const row = Math.floor(index / 2);
                        const xOffset = borderSize + col * (panelWidth + spacing);
                        const yOffset = borderSize + 50 + spacing + row * (panelHeight + spacing);
                        
                        // Draw panel border (thick black line)
                        ctx.fillStyle = "#000";
                        ctx.fillRect(xOffset - 3, yOffset - 3, panelWidth + 6, panelHeight + 6);
                        
                        // Draw photo
                        ctx.drawImage(img, xOffset, yOffset, panelWidth, panelHeight);
                        
                        // Add comic speech bubble
                        if (index % 3 === 0) {
                            drawSpeechBubble(ctx, xOffset + panelWidth * 0.7, yOffset + panelHeight * 0.3, "POW!", "#FF5252");
                        } else if (index % 3 === 1) {
                            drawSpeechBubble(ctx, xOffset + panelWidth * 0.3, yOffset + panelHeight * 0.7, "ZOOM!", "#4CAF50");
                        } else {
                            drawSpeechBubble(ctx, xOffset + panelWidth * 0.5, yOffset + panelHeight * 0.5, "BAM!", "#2196F3");
                        }
                    });
                    break;
                    
                case "collage":
                    // Photo collage style
                    // Background
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, totalWidth, totalHeight);
                    
                    // Draw photos in collage style (different sizes and angles)
                    const collagePositions = [
                        { x: totalWidth * 0.1, y: totalHeight * 0.1, w: photoWidth * 0.8, h: photoHeight * 0.8, rotation: -0.1 },
                        { x: totalWidth * 0.5, y: totalHeight * 0.15, w: photoWidth * 0.9, h: photoHeight * 0.9, rotation: 0.05 },
                        { x: totalWidth * 0.15, y: totalHeight * 0.5, w: photoWidth * 0.85, h: photoHeight * 0.85, rotation: 0.15 },
                        { x: totalWidth * 0.55, y: totalHeight * 0.6, w: photoWidth * 0.75, h: photoHeight * 0.75, rotation: -0.08 }
                    ];
                    
                    images.forEach((img, index) => {
                        if (index < collagePositions.length) {
                            const pos = collagePositions[index];
                            
                            // Save context for rotation
                            ctx.save();
                            ctx.translate(pos.x + pos.w/2, pos.y + pos.h/2);
                            ctx.rotate(pos.rotation);
                            
                            // Draw white border
                            ctx.fillStyle = "#FFF";
                            ctx.fillRect(-pos.w/2 - 10, -pos.h/2 - 10, pos.w + 20, pos.h + 20);
                            
                            // Draw shadow
                            ctx.fillStyle = "rgba(0,0,0,0.2)";
                            ctx.fillRect(-pos.w/2 - 5, -pos.h/2 - 5, pos.w + 20, pos.h + 20);
                            
                            // Draw photo
                            ctx.drawImage(img, -pos.w/2, -pos.h/2, pos.w, pos.h);
                            
                            ctx.restore();
                        }
                    });
                    
                    // Add decorative elements
                    ctx.font = "bold 24px 'Arial', sans-serif";
                    ctx.fillStyle = "#FF6B9D";
                    ctx.textAlign = "center";
                    ctx.fillText("MEMORIES", totalWidth / 2, totalHeight - 30);
                    
                    // Add some confetti for decoration
                    drawConfetti(ctx, totalWidth * 0.25, totalHeight * 0.25);
                    drawConfetti(ctx, totalWidth * 0.75, totalHeight * 0.75);
                    break;
                    
                case "social":
                    // Social media optimized layout
                    // Square format for Instagram
                    const squareSize = Math.min(totalWidth, totalHeight) - borderSize * 2;
                    const xCenter = totalWidth / 2 - squareSize / 2;
                    const yCenter = totalHeight / 2 - squareSize / 2;
                    
                    // Draw white background
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, totalWidth, totalHeight);
                    
                    // Draw main square
                    ctx.fillStyle = "#F5F5F5";
                    ctx.fillRect(xCenter, yCenter, squareSize, squareSize);
                    
                    // Determine layout based on number of images
                    if (images.length === 1) {
                        // Single image fills the square
                        ctx.drawImage(images[0], xCenter + 10, yCenter + 10, squareSize - 20, squareSize - 20);
                    } else if (images.length === 2) {
                        // Two images side by side
                        ctx.drawImage(images[0], xCenter + 10, yCenter + 10, (squareSize - 30) / 2, squareSize - 20);
                        ctx.drawImage(images[1], xCenter + (squareSize + 10) / 2, yCenter + 10, (squareSize - 30) / 2, squareSize - 20);
                    } else {
                        // Grid layout for 3+ images
                        const gridSize = Math.ceil(Math.sqrt(images.length));
                        const cellSize = (squareSize - 20 - (gridSize - 1) * 5) / gridSize;
                        
                        images.forEach((img, index) => {
                            if (index < gridSize * gridSize) {
                                const col = index % gridSize;
                                const row = Math.floor(index / gridSize);
                                const xPos = xCenter + 10 + col * (cellSize + 5);
                                const yPos = yCenter + 10 + row * (cellSize + 5);
                                
                                ctx.drawImage(img, xPos, yPos, cellSize, cellSize);
                            }
                        });
                    }
                    
                    // Add social media elements
                    ctx.fillStyle = "#333";
                    ctx.font = "14px Arial";
                    ctx.textAlign = "left";
                    ctx.fillText("@picapicabooth", xCenter + 10, yCenter - 10);
                    
                    // Add like and comment icons
                    ctx.font = "16px Arial";
                    ctx.fillText("❤️ 1.2k    💬 234", xCenter + 10, yCenter + squareSize + 20);
                    
                    // Add watermark with website URL
                    ctx.fillStyle = "rgba(0,0,0,0.5)";
                    ctx.font = "bold 16px Arial";
                    ctx.textAlign = "center";
                    ctx.fillText("picapicabooth.app", totalWidth / 2, totalHeight - 20);
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
			
			// Add watermark/logo with domain name
			ctx.fillStyle = stripColor === "black" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)";
			ctx.font = "bold 16px Arial";
			ctx.textAlign = "right";
			ctx.fillText(
				"picapicabooth.app",
				totalWidth - borderSize/2,
				totalHeight - borderSize/2
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
				
			case "party":
				// Draw party decorations
				// Draw confetti
				drawConfetti(ctx, x + 30, y + 30);
				drawConfetti(ctx, x + width - 30, y + 30);
				drawConfetti(ctx, x + 30, y + height - 30);
				drawConfetti(ctx, x + width - 30, y + height - 30);
				
				// Draw emojis
				drawEmoji(ctx, x + width / 2, y + 25, "🎉", 20);
				drawEmoji(ctx, x + width / 2, y + height - 25, "🎊", 20);
				break;
				
			case "royal":
				// Draw royal decorations
				// Draw crowns
				drawCrown(ctx, x + width / 4, y + 25, 1, "#FFD700");
				drawCrown(ctx, x + width * 3/4, y + 25, 1, "#FFD700");
				
				// Draw fancy corners
				ctx.strokeStyle = "#FFD700";
				ctx.lineWidth = 3;
				
				// Top-left corner
				ctx.beginPath();
				ctx.moveTo(x + 5, y + 30);
				ctx.lineTo(x + 5, y + 5);
				ctx.lineTo(x + 30, y + 5);
				ctx.stroke();
				
				// Top-right corner
				ctx.beginPath();
				ctx.moveTo(x + width - 5, y + 30);
				ctx.lineTo(x + width - 5, y + 5);
				ctx.lineTo(x + width - 30, y + 5);
				ctx.stroke();
				
				// Bottom-left corner
				ctx.beginPath();
				ctx.moveTo(x + 5, y + height - 30);
				ctx.lineTo(x + 5, y + height - 5);
				ctx.lineTo(x + 30, y + height - 5);
				ctx.stroke();
				
				// Bottom-right corner
				ctx.beginPath();
				ctx.moveTo(x + width - 5, y + height - 30);
				ctx.lineTo(x + width - 5, y + height - 5);
				ctx.lineTo(x + width - 30, y + height - 5);
				ctx.stroke();
				break;
				
			case "emoji":
				// Draw popular emoji stickers
				const emojis = ["😍", "🥰", "😎", "🤩", "😂", "❤️", "✨", "🔥"];
				
				// Draw random emojis at corners
				drawEmoji(ctx, x + 25, y + 25, emojis[Math.floor(Math.random() * emojis.length)], 20);
				drawEmoji(ctx, x + width - 25, y + 25, emojis[Math.floor(Math.random() * emojis.length)], 20);
				drawEmoji(ctx, x + 25, y + height - 25, emojis[Math.floor(Math.random() * emojis.length)], 20);
				drawEmoji(ctx, x + width - 25, y + height - 25, emojis[Math.floor(Math.random() * emojis.length)], 20);
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
	
	// Draw speech bubble
	const drawSpeechBubble = (ctx, x, y, text, color) => {
		const bubbleWidth = text.length * 10 + 20;
		const bubbleHeight = 30;
		
		// Draw bubble
		ctx.fillStyle = color || "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x - 10, y + 20); // Pointer
		ctx.lineTo(x - bubbleWidth/2, y + 20);
		ctx.lineTo(x - bubbleWidth/2, y + 20 + bubbleHeight);
		ctx.lineTo(x + bubbleWidth/2, y + 20 + bubbleHeight);
		ctx.lineTo(x + bubbleWidth/2, y + 20);
		ctx.lineTo(x + 10, y + 20);
		ctx.closePath();
		ctx.fill();
		
		// Draw text
		ctx.fillStyle = "#000000";
		ctx.font = "bold 14px Arial";
		ctx.textAlign = "center";
		ctx.fillText(text, x, y + 40);
	};
	
	// Draw emoji sticker
	const drawEmoji = (ctx, x, y, emoji, size) => {
		ctx.font = `${size || 30}px Arial`;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(emoji, x, y);
	};
	
	// Draw confetti
	const drawConfetti = (ctx, x, y, colors) => {
		const confettiColors = colors || ["#FF5252", "#FFEB3B", "#2196F3", "#4CAF50", "#9C27B0"];
		
		for (let i = 0; i < 20; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * 40;
			const xPos = x + Math.cos(angle) * distance;
			const yPos = y + Math.sin(angle) * distance;
			const size = 2 + Math.random() * 5;
			
			ctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];
			ctx.beginPath();
			ctx.rect(xPos, yPos, size, size);
			ctx.fill();
		}
	};
	
	// Draw crown
	const drawCrown = (ctx, x, y, size, color) => {
		const scale = size || 1;
		ctx.fillStyle = color || "#FFD700";
		
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x - 15 * scale, y);
		ctx.lineTo(x - 20 * scale, y - 10 * scale);
		ctx.lineTo(x - 10 * scale, y - 5 * scale);
		ctx.lineTo(x, y - 15 * scale);
		ctx.lineTo(x + 10 * scale, y - 5 * scale);
		ctx.lineTo(x + 20 * scale, y - 10 * scale);
		ctx.lineTo(x + 15 * scale, y);
		ctx.closePath();
		ctx.fill();
		
		// Crown jewels
		ctx.fillStyle = "#FF5252";
		ctx.beginPath();
		ctx.arc(x, y - 7 * scale, 3 * scale, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.fillStyle = "#2196F3";
		ctx.beginPath();
		ctx.arc(x - 10 * scale, y - 3 * scale, 2 * scale, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.fillStyle = "#4CAF50";
		ctx.beginPath();
		ctx.arc(x + 10 * scale, y - 3 * scale, 2 * scale, 0, Math.PI * 2);
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
			
			<div className="layout-buttons layout-buttons-row2">
				<button 
					className={layoutStyle === "vintage" ? "active" : ""}
					onClick={() => setLayoutStyle("vintage")}
				>
					<i className="fas fa-film"></i> Vintage Film
				</button>
				<button 
					className={layoutStyle === "comic" ? "active" : ""}
					onClick={() => setLayoutStyle("comic")}
				>
					<i className="fas fa-comment-dots"></i> Comic Style
				</button>
				<button 
					className={layoutStyle === "collage" ? "active" : ""}
					onClick={() => setLayoutStyle("collage")}
				>
					<i className="fas fa-object-group"></i> Photo Collage
				</button>
				<button 
					className={layoutStyle === "social" ? "active" : ""}
					onClick={() => setLayoutStyle("social")}
				>
					<i className="fas fa-mobile-alt"></i> Social Media
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
				<h3><i className="fas fa-border-style"></i> Choose Frame Style</h3>
				<div className="frame-buttons">
					<button 
						className={selectedFrame === "none" ? "active" : ""}
						onClick={() => setSelectedFrame("none")}
					>
						<i className="fas fa-square"></i> No Frame
					</button>
					<button 
						className={selectedFrame === "pastel" ? "active" : ""}
						onClick={() => setSelectedFrame("pastel")}
					>
						<i className="fas fa-heart"></i> Pastel Hearts
					</button>
					<button 
						className={selectedFrame === "cute" ? "active" : ""}
						onClick={() => setSelectedFrame("cute")}
					>
						<i className="fas fa-cloud"></i> Cute Clouds
					</button>
				</div>
				<div className="frame-buttons frame-buttons-row2">
					<button 
						className={selectedFrame === "party" ? "active" : ""}
						onClick={() => setSelectedFrame("party")}
					>
						<i className="fas fa-birthday-cake"></i> Party Time
					</button>
					<button 
						className={selectedFrame === "royal" ? "active" : ""}
						onClick={() => setSelectedFrame("royal")}
					>
						<i className="fas fa-crown"></i> Royal Style
					</button>
					<button 
						className={selectedFrame === "emoji" ? "active" : ""}
						onClick={() => setSelectedFrame("emoji")}
					>
						<i className="far fa-grin-stars"></i> Emoji Fun
					</button>
				</div>
			</div>

			<canvas ref={stripCanvasRef} className="photo-strip" />

			<div className="preview-actions">
				<button onClick={downloadPhotoStrip} className="download-button">
					<i className="fas fa-download"></i> Download Photo Strip
				</button>
				<button onClick={() => navigate("/photobooth")} className="back-button">
					<i className="fas fa-camera"></i> Take New Photos
				</button>
				<button onClick={handleShare} className="share-button">
					<i className="fas fa-share-alt"></i> Share on Social Media
				</button>
			</div>

			{showShare && generatedImage && (
				<SocialShare imageUrl={generatedImage} onClose={closeShare} />
			)}
		</div>
	);
};

export default PhotoPreview;
