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
	const [cameraReady, setCameraReady] = useState(false); // 添加摄像头状态变量
	
	// Custom options
	const [countdownTime, setCountdownTime] = useState(3); // Default 3 seconds
	const [photoCount, setPhotoCount] = useState(4); // Default 4 photos
	const [showSettings, setShowSettings] = useState(false); // Control settings panel display
	const [filterMode, setFilterMode] = useState('standard'); // 'standard', 'professional', 'artistic'
	// 美颜功能相关状态 - 默认开启美颜功能，提供更好的用户体验
	const [beautyEnabled, setBeautyEnabled] = useState(true);
	const [smoothLevel, setSmoothLevel] = useState(10); // 皮肤平滑度 (0-100)
	const [brightnessLevel, setBrightnessLevel] = useState(5); // 美白程度 (0-50)
	const [enhanceLevel, setEnhanceLevel] = useState(10); // 面部增强 (0-100)

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
			// 如果已经有视频流，先停止它
			if (videoRef.current && videoRef.current.srcObject) {
				const tracks = videoRef.current.srcObject.getTracks();
				tracks.forEach(track => track.stop());
				videoRef.current.srcObject = null;
			}
			
			// 尝试使用更低的分辨率，提高兼容性
			const tryGetUserMedia = async (constraints) => {
				try {
					console.log("尝试使用以下约束获取摄像头:", constraints);
					return await navigator.mediaDevices.getUserMedia(constraints);
				} catch (err) {
					console.warn("获取摄像头失败:", err);
					throw err;
				}
			};
			
			// 定义多个分辨率选项，从高到低尝试
			const constraintsOptions = [
				// 选项1: 高分辨率
				{
					video: {
						facingMode: "user",
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
					audio: false,
				},
				// 选项2: 中等分辨率
				{
					video: {
						facingMode: "user",
						width: { ideal: 640 },
						height: { ideal: 480 },
					},
					audio: false,
				},
				// 选项3: 低分辨率
				{
					video: {
						facingMode: "user",
					},
					audio: false,
				},
				// 选项4: 最低要求，任何可用的视频
				{
					video: true,
					audio: false,
				}
			];
			
			// 逐个尝试不同的约束条件
			let stream = null;
			let lastError = null;
			
			for (const constraints of constraintsOptions) {
				try {
					stream = await tryGetUserMedia(constraints);
					console.log("成功获取摄像头流:", constraints);
					break; // 成功获取流，跳出循环
				} catch (error) {
					lastError = error;
					console.warn(`尝试约束 ${JSON.stringify(constraints)} 失败，尝试下一个选项`);
				}
			}
			
			if (!stream) {
				throw lastError || new Error("无法获取摄像头流，所有尝试均失败");
			}

			// 确保组件仍然挂载
			if (videoRef.current) {
				// 设置视频源
				videoRef.current.srcObject = stream;
				
				// 设置视频样式
				videoRef.current.style.transform = "scaleX(-1)";
				videoRef.current.style.objectFit = "cover";
				
				// 使用事件监听器确保视频加载完成后再播放
				const playVideo = () => {
					if (!videoRef.current) return;
					
					console.log("尝试播放视频...");
					videoRef.current.play()
						.then(() => {
							console.log("视频播放成功!");
							// 显示摄像头状态
							setCameraReady(true);
						})
						.catch(err => {
							// 如果播放失败，等待一段时间后重试
							console.warn("视频播放失败，正在重试...", err);
							setTimeout(() => {
								if (videoRef.current) {
									console.log("重试播放视频...");
									videoRef.current.play()
										.then(() => {
											console.log("重试播放成功!");
											setCameraReady(true);
										})
										.catch(e => {
											console.error("重试播放视频后仍然失败:", e);
											alert("无法播放摄像头视频。请刷新页面重试，或检查浏览器设置。");
										});
								}
							}, 1500);
						});
				};
				
				// 如果视频已经有足够的数据可以播放
				if (videoRef.current.readyState >= 2) {
					playVideo();
				} else {
					// 否则等待加载
					videoRef.current.addEventListener('loadeddata', playVideo, { once: true });
					
					// 添加超时处理，防止视频加载过久
					const timeoutId = setTimeout(() => {
						if (videoRef.current && !cameraReady) {
							console.warn("视频加载超时，尝试强制播放");
							playVideo();
						}
					}, 5000);
					
					// 清理超时
					return () => clearTimeout(timeoutId);
				}
				
				// Start light analysis after camera is ready
				const analysisInterval = setInterval(analyzeLightConditions, 3000);
				return () => {
					clearInterval(analysisInterval);
					// 清理视频事件监听器
					if (videoRef.current) {
						videoRef.current.removeEventListener('loadeddata', playVideo);
					}
				};
			}
		} catch (error) {
			if (error.name === "NotAllowedError") {
				console.error("用户拒绝了相机权限。");
				alert("需要相机权限才能使用照相亭功能。请允许访问相机。");
			} else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
				console.error("找不到摄像头设备。");
				alert("未检测到摄像头设备。请确保您的设备有摄像头并且已连接。");
			} else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
				console.error("摄像头被占用或无法访问。");
				alert("摄像头可能被其他应用程序占用。请关闭可能使用摄像头的其他应用，然后刷新页面。");
			} else {
				console.error("访问相机时出错:", error);
				alert("无法访问相机: " + (error.message || "未知错误") + "\n请刷新页面重试。");
			}
			// 设置摄像头状态为未就绪
			setCameraReady(false);
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

	// 美颜处理函数 - 简化版，避免过度处理导致图像变黑
	const applyBeautyEffect = (context, width, height) => {
		if (!beautyEnabled) return; // 如果美颜未启用，直接返回
		
		// 获取图像数据
		const imageData = context.getImageData(0, 0, width, height);
		const data = imageData.data;
		
		// 创建临时数组存储处理后的数据
		const tempData = new Uint8ClampedArray(data.length);
		for (let i = 0; i < data.length; i++) {
			tempData[i] = data[i];
		}
		
		// 简单的柔化和美白处理（不进行肤色检测，避免错误识别）
		const pixelWidth = width * 4;
		
		// 只对中心区域应用美颜，避免处理背景
		const centerStartX = Math.floor(width * 0.2);
		const centerEndX = Math.floor(width * 0.8);
		const centerStartY = Math.floor(height * 0.1);
		const centerEndY = Math.floor(height * 0.9);
		
		// 轻度模糊处理（只应用于非边缘区域）
		if (smoothLevel > 0) {
			const blurRadius = Math.max(1, Math.floor(smoothLevel / 20)); // 根据平滑度计算模糊半径
			
			for (let y = centerStartY + blurRadius; y < centerEndY - blurRadius; y++) {
				for (let x = centerStartX + blurRadius; x < centerEndX - blurRadius; x++) {
					const idx = (y * width + x) * 4;
					
					// 简单的3x3均值模糊
					for (let c = 0; c < 3; c++) { // 只处理RGB通道
						let sum = 0;
						let count = 0;
						
						// 收集周围像素
						for (let dy = -1; dy <= 1; dy++) {
							for (let dx = -1; dx <= 1; dx++) {
								const offset = ((y + dy) * width + (x + dx)) * 4 + c;
								sum += data[offset];
								count++;
							}
						}
						
						// 计算平均值，并与原始值混合
						const blurFactor = smoothLevel / 200; // 0-0.5范围
						const avgValue = sum / count;
						tempData[idx + c] = data[idx + c] * (1 - blurFactor) + avgValue * blurFactor;
					}
				}
			}
		}
		
		// 应用美白效果（全局处理）
		if (brightnessLevel > 0) {
			const brightnessFactor = brightnessLevel / 2; // 降低美白强度，避免过曝
			
			for (let i = 0; i < data.length; i += 4) {
				// 提高亮度，但保持自然
				for (let j = 0; j < 3; j++) {
					tempData[i + j] = Math.min(255, tempData[i + j] + brightnessFactor);
				}
			}
		}
		
		// 应用轻微的对比度增强（全局处理）
		if (enhanceLevel > 0) {
			const enhanceFactor = enhanceLevel / 400; // 降低增强强度，避免过度处理
			
			for (let i = 0; i < data.length; i += 4) {
				for (let j = 0; j < 3; j++) {
					const value = tempData[i + j];
					const normalized = value / 255; // 归一化到0-1
					
					// 轻微的S曲线对比度增强
					let enhanced;
					if (normalized < 0.5) {
						enhanced = normalized - enhanceFactor * (0.5 - normalized) * normalized;
					} else {
						enhanced = normalized + enhanceFactor * (normalized - 0.5) * (1 - normalized);
					}
					
					tempData[i + j] = Math.max(0, Math.min(255, enhanced * 255));
				}
			}
		}
		
		// 将处理后的数据写回
		for (let i = 0; i < data.length; i++) {
			data[i] = tempData[i];
		}
		
		context.putImageData(imageData, 0, 0);
	};

	// Capture Photo
	const capturePhoto = () => {
		const video = videoRef.current;
		const canvas = canvasRef.current;

		if (video && canvas) {
			const context = canvas.getContext("2d");

			// 恢复高分辨率，2560x1440
			const targetWidth = 2560;
			const targetHeight = 1440;

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
			
			// 应用美颜效果
			if (beautyEnabled) {
				applyBeautyEffect(context, targetWidth, targetHeight);
			}

			// 应用滤镜效果
			if (filter !== 'none') {
				context.filter = filter;
				context.drawImage(canvas, 0, 0);
				context.filter = 'none';
			}

			// 使用最高质量输出图像
			return canvas.toDataURL("image/png", 1.0);
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
					<h3><i className="fas fa-cog"></i> 照相设置</h3>
					
					<div className="beauty-settings">
						<h3><i className="fas fa-magic"></i> 美颜功能</h3>
						<div className="setting-item beauty-toggle">
							<label>启用美颜</label>
							<div className="toggle-switch">
								<input 
									type="checkbox" 
									id="beauty-toggle" 
									checked={beautyEnabled} 
									onChange={() => setBeautyEnabled(!beautyEnabled)} 
								/>
								<label htmlFor="beauty-toggle"></label>
							</div>
						</div>
						
						{beautyEnabled && (
							<div className="beauty-controls">
								<div className="setting-item slider">
									<label>皮肤平滑度: {smoothLevel}</label>
									<input 
										type="range" 
										min="0" 
										max="100" 
										value={smoothLevel} 
										onChange={(e) => setSmoothLevel(parseInt(e.target.value))} 
									/>
								</div>
								<div className="setting-item slider">
									<label>美白程度: {brightnessLevel}</label>
									<input 
										type="range" 
										min="0" 
										max="50" 
										value={brightnessLevel} 
										onChange={(e) => setBrightnessLevel(parseInt(e.target.value))} 
									/>
								</div>
								<div className="setting-item slider">
									<label>面部增强: {enhanceLevel}</label>
									<input 
										type="range" 
										min="0" 
										max="100" 
										value={enhanceLevel} 
										onChange={(e) => setEnhanceLevel(parseInt(e.target.value))} 
									/>
								</div>
								<button 
									className="reset-beauty" 
									onClick={() => {
										setSmoothLevel(30);
										setBrightnessLevel(10);
										setEnhanceLevel(20);
									}}
								>
									重置为默认值
								</button>
							</div>
						)}
					</div>
					
					<div className="setting-item">
						<label htmlFor="countdown-time"><i className="fas fa-clock"></i> 倒计时时间:</label>
						<select 
							id="countdown-time" 
							value={countdownTime} 
							onChange={handleCountdownChange}
							className="setting-select"
						>
							<option value="3">3秒</option>
							<option value="5">5秒</option>
							<option value="10">10秒</option>
						</select>
					</div>
					
					<div className="setting-item">
						<label htmlFor="photo-count"><i className="fas fa-images"></i> 照片数量:</label>
						<select 
							id="photo-count" 
							value={photoCount} 
							onChange={handlePhotoCountChange}
							className="setting-select"
						>
							<option value="2">2张</option>
							<option value="4">4张</option>
							<option value="6">6张</option>
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
