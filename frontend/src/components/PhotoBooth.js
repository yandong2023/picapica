import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PhotoBooth = ({ setCapturedImages }) => {
	const navigate = useNavigate();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [capturedImages, setImages] = useState([]);
	const [filter, setFilter] = useState("none");
	const [countdown, setCountdown] = useState(null);
	const [capturing, setCapturing] = useState(false);
	
	// Custom options
	const [countdownTime, setCountdownTime] = useState(3); // Default 3 seconds
	const [photoCount, setPhotoCount] = useState(4); // Default 4 photos
	const [showSettings, setShowSettings] = useState(false); // Control settings panel display

	useEffect(() => {
		startCamera();

		const handleVisibilityChange = () => {
			if (!document.hidden) {
				startCamera();
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	// Start Camera
	const startCamera = async () => {
		try {
			if (videoRef.current && videoRef.current.srcObject) {
				return;
			}
			const constraints = {
				video: {
					facingMode: "user",
					width: { ideal: 1920 },
					height: { ideal: 1080 },
					frameRate: { ideal: 30 },
				},
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current
					.play()
					.catch((err) => console.error("Error playing video:", err));

				// mirror video stream
				videoRef.current.style.transform = "scaleX(-1)";
				videoRef.current.style.objectFit = "cover";
			}
		} catch (error) {
			if (error.name == "NotAllowedError") {
				console.error("User denied camera permissions.");
			} else console.error("Error accessing camera:", error);
		}
	};

	// Toggle settings panel display
	const toggleSettings = () => {
		setShowSettings(!showSettings);
	};

	// Update countdown time
	const handleCountdownChange = (e) => {
		setCountdownTime(parseInt(e.target.value));
	};

	// Update photo count
	const handlePhotoCountChange = (e) => {
		setPhotoCount(parseInt(e.target.value));
	};

	// Countdown to take photos automatically
	const startCountdown = () => {
		if (capturing) return;
		setCapturing(true);
		setShowSettings(false); // Hide settings panel when starting to take photos

		let photosTaken = 0;
		const newCapturedImages = [];

		const captureSequence = async () => {
			// push captured images to preview
			if (photosTaken >= photoCount) {
				setCountdown(null);
				setCapturing(false);

				try {
					setCapturedImages([...newCapturedImages]);
					setImages([...newCapturedImages]);

					setTimeout(() => {
						navigate("/preview");
					}, 200);
				} catch (error) {
					console.error("Error navigating to preview:", error);
				}
				return;
			}

			let timeLeft = countdownTime;
			setCountdown(timeLeft);

			const timer = setInterval(() => {
				timeLeft -= 1;
				setCountdown(timeLeft);

				if (timeLeft === 0) {
					clearInterval(timer);
					const imageUrl = capturePhoto();
					if (imageUrl) {
						newCapturedImages.push(imageUrl);
						setImages((prevImages) => [...prevImages, imageUrl]);
					}
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

			const targetWidth = 1280;
			const targetHeight = 720;

			canvas.width = targetWidth;
			canvas.height = targetHeight;

			const videoRatio = video.videoWidth / video.videoHeight;
			const targetRatio = targetWidth / targetHeight;

			let drawWidth = video.videoWidth;
			let drawHeight = video.videoHeight;
			let startX = 0;
			let startY = 0;

			// crop image (?)
			if (videoRatio > targetRatio) {
				drawWidth = drawHeight * targetRatio;
				startX = (video.videoWidth - drawWidth) / 2;
			} else {
				drawHeight = drawWidth / targetRatio;
				startY = (video.videoHeight - drawHeight) / 2;
			}

        // Flip canvas for mirroring
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        context.drawImage(
            video,
            startX, startY, drawWidth, drawHeight,  
            0, 0, targetWidth, targetHeight        
        );
        context.restore();

        if (filter !== 'none') {
            context.filter = filter;
            context.drawImage(canvas, 0, 0);
            context.filter = 'none';
        }

        return canvas.toDataURL("image/png");
    }
};

	return (
		<div className="photo-booth">
			{countdown !== null && <h2 className="countdown animate">{countdown}</h2>}

			<div className="photo-container">
				<div className="camera-container">
					<video
						ref={videoRef}
						autoPlay
						className="video-feed"
						style={{ filter }}
					/>
					<canvas ref={canvasRef} className="hidden" />
				</div>

				<div className="preview-side">
					{capturedImages.map((image, index) => (
						<img
							key={index}
							src={image}
							alt={`Captured ${index + 1}`}
							className="side-preview"
						/>
					))}
				</div>
			</div>

			<div className="controls">
				{!capturing && (
					<>
						<button onClick={toggleSettings} className="settings-button">
							{showSettings ? "Hide Settings" : "Photo Settings"}
						</button>
						<button onClick={startCountdown} className="capture-button">
							Start Capture
						</button>
					</>
				)}
				{capturing && <div className="capturing-text">Capturing...</div>}
			</div>

			{showSettings && !capturing && (
				<div className="settings-panel">
					<div className="setting-item">
						<label htmlFor="countdown-time">Countdown Time (seconds):</label>
						<select 
							id="countdown-time" 
							value={countdownTime} 
							onChange={handleCountdownChange}
							className="setting-select"
						>
							<option value="3">3 seconds</option>
							<option value="5">5 seconds</option>
							<option value="10">10 seconds</option>
						</select>
					</div>
					
					<div className="setting-item">
						<label htmlFor="photo-count">Number of Photos:</label>
						<select 
							id="photo-count" 
							value={photoCount} 
							onChange={handlePhotoCountChange}
							className="setting-select"
						>
							<option value="2">2 photos</option>
							<option value="4">4 photos</option>
							<option value="6">6 photos</option>
						</select>
					</div>
				</div>
			)}

			<div className="filters">
				<button onClick={() => setFilter("none")}>No Filter</button>
				<button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
				<button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
				<button onClick={() => setFilter("contrast(150%)")}>High Contrast</button>
				<button onClick={() => setFilter("brightness(150%)")}>Bright</button>
				<button onClick={() => setFilter("hue-rotate(90deg)")}>Hue Shift</button>
				<button onClick={() => setFilter("invert(100%)")}>Invert</button>
				<button onClick={() => setFilter("saturate(200%)")}>Saturate</button>
			</div>
		</div>
	);
};

export default PhotoBooth;
