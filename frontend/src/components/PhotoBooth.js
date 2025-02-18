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
            return; // Prevent restarting the camera if it's already running
        }

        const constraints = {
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Error playing video:", err));

            // Fix mirroring issue
            videoRef.current.style.transform = "scaleX(-1)";
            videoRef.current.style.objectFit = "cover"; 
        }
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
  };

  // Countdown to take 4 pictures automatically
  const startCountdown = () => {
    if (capturing) return;
    setCapturing(true);
  
    let photosTaken = 0;
    const newCapturedImages = [];
  
    const captureSequence = async () => {
        if (photosTaken >= 4) {
            setCountdown(null);
            setCapturing(false);

            try {
                setCapturedImages([...newCapturedImages]);
                setImages([...newCapturedImages]);

                // Delay navigation slightly to ensure state update
                setTimeout(() => {
                    navigate("/preview");
                }, 200);
            } catch (error) {
                console.error("Error navigating to preview:", error);
            }
            return;
        }

        let timeLeft = 3;
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

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Flip canvas for mirroring
        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();

        // Return image URL
        return canvas.toDataURL("image/png");
    }
  };

  return (
    <div className="photo-booth">
      {countdown !== null && <h2 className="countdown animate">{countdown}</h2>}

      <div className="photo-container">
        <div className="camera-container">
          <video ref={videoRef} autoPlay className="video-feed" style={{ filter }} />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="preview-side">
          {capturedImages.map((image, index) => (
            <img key={index} src={image} alt={`Captured ${index + 1}`} className="side-preview" />
          ))}
        </div>
      </div>
      
      <div className="controls">
        <button onClick={startCountdown} disabled={capturing}>
          {capturing ? "Capturing..." : "Start Capture :)"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("none")}>No Filter</button>
        <button onClick={() => setFilter("grayscale(100%)")}>Grayscale</button>
        <button onClick={() => setFilter("sepia(100%)")}>Sepia</button>
      </div>
    </div>
  );
};

export default PhotoBooth;
