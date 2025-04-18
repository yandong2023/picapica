import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PhotoBooth = ({ setCapturedImages }) => {
	const navigate = useNavigate();
	const videoRef = useRef(null);
	const canvasRef = useRef(null);
	const [capturedImages, setImages] = useState([]);
	const [filter, setFilter] = useState("none");
	const [countdown, setCountdown] = useState(null);
	const [capturing, setCapturing] = useState(false);
	const [lightCondition, setLightCondition] = useState('normal'); // 'dark', 'normal', 'bright'
	const [recommendedFilter, setRecommendedFilter] = useState(null);
	const [showRecommendation, setShowRecommendation] = useState(false);
	
	// Custom options
	const [countdownTime, setCountdownTime] = useState(3); // Default 3 seconds
	const [photoCount, setPhotoCount] = useState(4); // Default 4 photos
	const [showSettings, setShowSettings] = useState(false); // Control settings panel display
	const [filterMode, setFilterMode] = useState('standard'); // 'standard', 'professional', 'artistic'

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

	// Analyze light conditions in the video stream
	const analyzeLightConditions = useCallback(() => {
		if (!videoRef.current) return;
		
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = 50; // Small sample for performance
		canvas.height = 50;
		
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;
		
		// Calculate average brightness
		let sum = 0;
		for (let i = 0; i < data.length; i += 4) {
			// Convert RGB to brightness using perceived luminance formula
			sum += (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
		}
		const avgBrightness = sum / (data.length / 4);
		
		// Determine light condition based on brightness
		let newCondition;
		let newRecommendation;
		
		if (avgBrightness < 60) {
			newCondition = 'dark';
			newRecommendation = 'brightness(150%)';
		} else if (avgBrightness > 180) {
			newCondition = 'bright';
			newRecommendation = 'contrast(120%) saturate(90%)';
		} else {
			newCondition = 'normal';
			newRecommendation = 'saturate(110%)';
		}
		
		// Only update if condition changed
		if (newCondition !== lightCondition) {
			setLightCondition(newCondition);
			setRecommendedFilter(newRecommendation);
			setShowRecommendation(true);
			
			// Auto-hide recommendation after 8 seconds
			setTimeout(() => setShowRecommendation(false), 8000);
		}
	}, [lightCondition]);

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
				
				// Start light analysis after camera is ready
				const analysisInterval = setInterval(analyzeLightConditions, 3000);
				return () => clearInterval(analysisInterval);
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
			<div className="booth-header">
				<h1>PicapicaBooth - Free Online Photo Booth</h1>
				{!capturing && <p className="instruction-text">Adjust your settings, select a filter, and click "Start Capture" to create your PicapicaBooth photo strip!</p>}
			</div>
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
							<i className="fas fa-cog"></i> {showSettings ? "Hide Settings" : "Photo Settings"}
						</button>
						<button onClick={startCountdown} className="capture-button pulse-animation">
							<i className="fas fa-camera"></i> Start Capture
						</button>
					</>
				)}
				{capturing && <div className="capturing-text"><i className="fas fa-spinner fa-spin"></i> Capturing your PicapicaBooth photos...</div>}
			</div>

			{showSettings && !capturing && (
				<div className="settings-panel">
					<h3><i className="fas fa-sliders-h"></i> PicapicaBooth Settings</h3>
					<div className="setting-item">
						<label htmlFor="countdown-time"><i className="fas fa-clock"></i> Countdown Time:</label>
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
						<label htmlFor="photo-count"><i className="fas fa-images"></i> Number of Photos:</label>
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
					<p className="settings-tip">Tip: Selecting more photos creates a richer PicapicaBooth photo strip!</p>
				</div>
			)}

			{showRecommendation && (
				<div className="smart-recommendation">
					<div className="recommendation-content">
						<i className="fas fa-lightbulb"></i>
						<div className="recommendation-text">
							<p>PicapicaBooth smart detection: {lightCondition === 'dark' ? 'low light' : lightCondition === 'bright' ? 'bright light' : 'normal light'}</p>
							<p>Recommended filter for best results</p>
						</div>
						<button onClick={() => {
							setFilter(recommendedFilter);
							setShowRecommendation(false);
						}} className="apply-recommendation">Apply Recommendation</button>
						<button onClick={() => setShowRecommendation(false)} className="dismiss-recommendation">
							<i className="fas fa-times"></i>
						</button>
					</div>
				</div>
			)}
			
			<div className="filters-section">
				<div className="filter-mode-selector">
					<button 
						className={filterMode === 'standard' ? 'active' : ''}
						onClick={() => setFilterMode('standard')}
					>
						<i className="fas fa-camera"></i> Standard Filters
					</button>
					<button 
						className={filterMode === 'professional' ? 'active' : ''}
						onClick={() => setFilterMode('professional')}
					>
						<i className="fas fa-camera-retro"></i> Professional Filters
					</button>
					<button 
						className={filterMode === 'artistic' ? 'active' : ''}
						onClick={() => setFilterMode('artistic')}
					>
						<i className="fas fa-palette"></i> Artistic Filters
					</button>
				</div>
				
				<h3>
					<i className="fas fa-magic"></i> 
					{filterMode === 'standard' ? 'Choose Standard Filters' : 
					 filterMode === 'professional' ? 'Choose Professional Filters' : 'Choose Artistic Filters'}
				</h3>
				
				{filterMode === 'standard' && (
					<div className="filters">
						<button className={filter === "none" ? "active" : ""} onClick={() => setFilter("none")}>
							<span className="filter-preview"></span>No Filter
						</button>
						<button className={filter === "grayscale(100%)" ? "active" : ""} onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
						<button className={filter === "sepia(100%)" ? "active" : ""} onClick={() => setFilter("sepia(100%)")}>Sepia</button>
						<button className={filter === "contrast(150%)" ? "active" : ""} onClick={() => setFilter("contrast(150%)")}>High Contrast</button>
						<button className={filter === "brightness(150%)" ? "active" : ""} onClick={() => setFilter("brightness(150%)")}>Bright</button>
					</div>
				)}
				
				{filterMode === 'professional' && (
					<div className="filters">
						<button className={filter === "contrast(110%) brightness(110%) saturate(120%)" ? "active" : ""} 
							onClick={() => setFilter("contrast(110%) brightness(110%) saturate(120%)")}>Portrait Enhance</button>
						<button className={filter === "contrast(120%) brightness(90%) saturate(105%)" ? "active" : ""} 
							onClick={() => setFilter("contrast(120%) brightness(90%) saturate(105%)")}>Dramatic Light</button>
						<button className={filter === "grayscale(100%) contrast(120%) brightness(120%)" ? "active" : ""} 
							onClick={() => setFilter("grayscale(100%) contrast(120%) brightness(120%)")}>Advanced B&W</button>
						<button className={filter === "sepia(50%) contrast(110%) brightness(105%) saturate(120%)" ? "active" : ""} 
							onClick={() => setFilter("sepia(50%) contrast(110%) brightness(105%) saturate(120%)")}>Film Look</button>
					</div>
				)}
				
				{filterMode === 'artistic' && (
					<div className="filters">
						<button className={filter === "hue-rotate(180deg) saturate(200%)" ? "active" : ""} 
							onClick={() => setFilter("hue-rotate(180deg) saturate(200%)")}>Dreamy Blue</button>
						<button className={filter === "sepia(80%) hue-rotate(50deg) saturate(140%)" ? "active" : ""} 
							onClick={() => setFilter("sepia(80%) hue-rotate(50deg) saturate(140%)")}>Vintage Green</button>
						<button className={filter === "invert(80%)" ? "active" : ""} 
							onClick={() => setFilter("invert(80%)")}>Negative</button>
						<button className={filter === "grayscale(100%) brightness(40%) contrast(180%)" ? "active" : ""} 
							onClick={() => setFilter("grayscale(100%) brightness(40%) contrast(180%)")}>Dark Mood</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default PhotoBooth;
