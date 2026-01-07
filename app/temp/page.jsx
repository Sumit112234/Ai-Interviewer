"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import RealisticFaceAvatar from "../../components/RealisticAiAvatar"

const AvatarTestComponent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [emotion, setEmotion] = useState("neutral")
  const [personality, setPersonality] = useState("professional")
  const [speechProgress, setSpeechProgress] = useState(0)
  const [imageExtension, setImageExtension] = useState("jpg")
  const speechTimeoutRef = useRef(null)

  const hardcodedTexts = {
    short: "Hello! How are you doing today?",
    medium: "Welcome to the future of AI avatars with realistic facial expressions and natural lip-syncing.",
    long: "The quick brown fox jumps over the lazy dog. Programming is fun when you understand the basics. Beautiful weather outside, perfect for a walk.",
    technical: "Artificial intelligence and machine learning are transforming how we interact with technology every single day.",
    vowelTest: "The rain in Spain stays mainly in the plain. How now brown cow.",
    consonantTest: "Peter Piper picked a peck of pickled peppers. She sells seashells by the seashore."
  }

  const sampleTexts = [
    "Hello! How are you doing today?",
    "The quick brown fox jumps over the lazy dog.",
    "Welcome to the future of AI avatars with realistic facial expressions.",
    "I can help you with various tasks using advanced technology.",
    "Let me demonstrate different mouth movements and phonemes.",
    "Programming is fun when you understand the basics.",
    "Beautiful weather outside, perfect for a walk.",
    "Artificial intelligence is revolutionizing the way we communicate and interact with computers.",
    "Testing various vowel sounds: ah, eh, ee, oh, oo. Now testing consonants: ba, pa, ma, fa, va, tha, sa."
  ]

  const calculateDuration = (text, personalityType) => {
    const speeds = {
      professional: 90,
      friendly: 70,
      technical: 100,
      senior: 110
    }
    const speed = speeds[personalityType] || 90
    return text.length * speed + 1000
  }

  const startSpeaking = (text, autoStop = true) => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
    }
    setCurrentText(text)
    setIsSpeaking(true)
    setSpeechProgress(0)

    if (autoStop) {
      const duration = calculateDuration(text, personality)
      speechTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false)
        setCurrentText("")
        setSpeechProgress(0)
      }, duration)
    }
  }

  const stopSpeaking = () => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
    }
    setIsSpeaking(false)
    setCurrentText("")
    setSpeechProgress(0)
  }

  const toggleLoading = () => {
    setIsLoading((prev) => !prev)
  }

  const quickTest = (textKey) => {
    startSpeaking(hardcodedTexts[textKey])
  }

  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Realistic AI Avatar Testing Suite
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Test different emotions, personalities, and speech patterns - Complete text reading guaranteed
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Display and Quick Tests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Avatar */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <div className="aspect-square max-w-2xl mx-auto bg-gray-900/50 rounded-xl overflow-hidden">
                <RealisticFaceAvatar
                  personality={personality}
                  isSpeaking={isSpeaking}
                  isLoading={isLoading}
                  emotion={emotion}
                  eyeDirection="center"
                  currentText={currentText}
                  speechProgress={speechProgress}
                  imageBasePath="/images/avatar"
                  imageExtension={imageExtension}

                />
              </div>
            </div>

            {/* Quick Test Buttons */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">⚡</span>Quick Hardcoded Tests
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.keys(hardcodedTexts).map((key) => (
                  <button
                    key={key}
                    onClick={() => quickTest(key)}
                    disabled={isSpeaking}
                    className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${isSpeaking
                        ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                      }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Current Hardcoded Text Preview:</p>
                <p className="text-sm text-gray-300 max-h-20 overflow-y-auto">
                  {currentText || "No text selected"}
                </p>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Emotion Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">😊</span>Emotion
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {["neutral", "happy", "angry"].map((emo) => (
                  <button
                    key={emo}
                    onClick={() => setEmotion(emo)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${emotion === emo
                        ? "bg-purple-600 text-white shadow-lg scale-105"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                  >
                    {emo.charAt(0).toUpperCase() + emo.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Personality Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🎭</span>Personality
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {["professional", "friendly", "technical", "senior"].map((pers) => (
                  <button
                    key={pers}
                    onClick={() => setPersonality(pers)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${personality === pers
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                  >
                    {pers.charAt(0).toUpperCase() + pers.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Format Selector */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🖼️</span>Image Format
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {["png", "jpg"].map((ext) => (
                  <button
                    key={ext}
                    onClick={() => setImageExtension(ext)}
                    className={`px-4 py-2 rounded-lg font-medium uppercase text-sm transition-all ${imageExtension === ext
                        ? "bg-indigo-600 text-white shadow-lg scale-105"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                  >
                    .{ext}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Current: <span className="text-indigo-400 font-mono">.{imageExtension}</span>
              </p>
            </div>

            {/* Speech Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">🎤</span>Speech Control
              </h2>
              <div className="space-y-3">
                <button
                  onClick={toggleLoading}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${isLoading
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                >
                  {isLoading ? "Stop Loading" : "Toggle Loading"}
                </button>
                <div className="border-t border-gray-700 pt-3">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Sample Texts:</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {sampleTexts.map((text, idx) => (
                      <button
                        key={idx}
                        onClick={() => startSpeaking(text)}
                        disabled={isSpeaking}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${isSpeaking
                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                            : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          }`}
                      >
                        {text.substring(0, 45)}...
                      </button>
                    ))}
                  </div>
                </div>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="w-full px-4 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg"
                  >
                    ⏹️ Stop Speaking
                  </button>
                )}
              </div>
            </div>

            {/* Custom Text Input */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">✏️</span>Custom Text
              </h2>
              <textarea
                id="customTextArea"
                className="w-full bg-gray-700 text-white rounded-lg p-3 text-sm min-h-24 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter custom text for the avatar to speak... (it will read the ENTIRE text)"
                disabled={isSpeaking}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey && e.target.value.trim()) {
                    startSpeaking(e.target.value)
                  }
                }}
              />
              <button
                onClick={() => {
                  const textarea = document.getElementById('customTextArea')
                  if (textarea && textarea.value.trim()) {
                    startSpeaking(textarea.value)
                  }
                }}
                disabled={isSpeaking}
                className={`w-full mt-2 px-4 py-2 rounded-lg font-medium transition-all ${isSpeaking ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                🎙️ Speak Custom Text
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Tip: Press Ctrl+Enter to speak. Duration is auto-calculated.
              </p>
            </div>

            {/* Status Info */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="mr-2">📊</span>Status
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Speaking:</span>
                  <span className={`font-medium ${isSpeaking ? "text-green-400" : "text-gray-500"}`}>
                    {isSpeaking ? "🔊 Active" : "🔇 Idle"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Loading:</span>
                  <span className={`font-medium ${isLoading ? "text-orange-400" : "text-gray-500"}`}>
                    {isLoading ? "⏳ Active" : "✓ Idle"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Emotion:</span>
                  <span className="font-medium text-purple-400 capitalize">{emotion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Personality:</span>
                  <span className="font-medium text-blue-400 capitalize">{personality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format:</span>
                  <span className="font-medium text-indigo-400 uppercase">.{imageExtension}</span>
                </div>
                {currentText && (
                  <>
                    <div className="pt-2 border-t border-gray-700">
                      <span className="text-gray-400 block mb-1">Text Length:</span>
                      <span className="text-green-300 text-xs font-mono">
                        {currentText.length} characters
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-gray-400 block mb-1">Estimated Duration:</span>
                      <span className="text-blue-300 text-xs font-mono">
                        {Math.round(calculateDuration(currentText, personality) / 1000)}s
                      </span>
                    </div>
                    <div className="pt-1">
                      <span className="text-gray-400 block mb-1">Current Text:</span>
                      <span className="text-gray-300 text-xs block max-h-16 overflow-y-auto bg-gray-900/50 p-2 rounded">
                        {currentText}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">🎯 Testing Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-purple-400 mb-2">1. Quick Tests</h3>
              <p>Use the hardcoded test buttons for instant testing. Avatar will read the ENTIRE text.</p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-400 mb-2">2. Emotions</h3>
              <p>Switch between neutral, happy, and angry to see different facial expressions.</p>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">3. Custom Text</h3>
              <p>Enter any text and the avatar will read it completely with proper timing.</p>
            </div>
            <div>
              <h3 className="font-semibold text-orange-400 mb-2">4. Personalities</h3>
              <p>Different personalities have different speech speeds and blink patterns.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


const AIInterviewer = () => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [cheatingWarnings, setCheatingWarnings] = useState([]);
  const [cheatingConfidence, setCheatingConfidence] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [serverStatus, setServerStatus] = useState('disconnected');
  const [detectionDetails, setDetectionDetails] = useState(null);
  const [warningHistory, setWarningHistory] = useState([]);
  const [cheatingScore, setCheatingScore] = useState(0);
  const intervalRef = useRef(null);
  const warningSoundRef = useRef(null);

  // Initialize warning sound
  useEffect(() => {
    warningSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-985.mp3');
    warningSoundRef.current.volume = 0.3;
  }, []);

  // Check server connection
  const checkServerConnection = async () => {
    try {
      const response = await fetch('https://cheating-detector-9e3o.onrender.com/');
      if (response.ok) {
        setServerStatus('connected');
        return true;
      }
    } catch (error) {
      console.error('Server not available:', error);
      setServerStatus('disconnected');
      return false;
    }
  };

  // Reset detector state
  const resetDetector = async () => {
    try {
      await fetch('https://cheating-detector-9e3o.onrender.com/reset', {
        method: 'POST',
      });
      setCheatingScore(0);
      setWarningHistory([]);
      console.log('Detector reset');
    } catch (error) {
      console.error('Failed to reset detector:', error);
    }
  };

  // Play warning sound
  const playWarningSound = () => {
    if (warningSoundRef.current) {
      warningSoundRef.current.currentTime = 0;
      warningSoundRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Show warning notification
  const showWarningNotification = (warnings, confidence) => {
    if (warnings.length > 0) {
      const warningText = warnings.join('\n');

      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚠️ Cheating Alert', {
          body: warningText,
          icon: '/warning-icon.png'
        });
      }

      // Play sound for critical warnings
      if (confidence > 0.5) {
        playWarningSound();
      }
    }
  };

  // Capture and send frame
  const captureAndSendFrame = useCallback(async () => {
     if (!videoRef.current) return;

      if (videoRef.current.readyState < 2) {
        console.log('Video not ready yet');
        return;
      }

  console.log('Video element ready, capturing frame...');

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert to base64 JPEG
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      console.log('Requesting cheating analysis...');

      const response = await fetch('https://cheating-detector-9e3o.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          reset: false
        })
      });

      console.log('Response received from server', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update state based on response
      const isCheating = result.cheating_detected;
      setCheatingDetected(isCheating);
      setCheatingConfidence(result.confidence);
      setCheatingScore(prev => prev + (isCheating ? 10 : 0));

      // Update warnings
      if (result.warnings && result.warnings.length > 0) {
        setCheatingWarnings(result.warnings);

        // Add to warning history
        const newWarning = {
          timestamp: new Date().toLocaleTimeString(),
          warnings: result.warnings,
          confidence: result.confidence,
          details: result.details
        };

        setWarningHistory(prev => [newWarning, ...prev.slice(0, 9)]); // Keep last 10

        // Show notifications for critical warnings
        if (result.confidence > 0.4) {
          showWarningNotification(result.warnings, result.confidence);
        }
      } else {
        setCheatingWarnings([]);
      }

      // Store detailed results
      setDetectionDetails(result.details);

      // Log detection results
      if (result.warnings.length > 0) {
        console.log('Detection Results:', {
          warnings: result.warnings,
          confidence: result.confidence,
          details: result.details
        });
      }

      return result;

    } catch (error) {
      console.error('Error sending frame:', error);
    }
  }, [isMonitoring]);

  // Request notification permission
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  };

  // Start monitoring
  const startMonitoring = async () => {
    // Request notification permission
    requestNotificationPermission();

    // First check server connection
    const connected = await checkServerConnection();
    if (!connected) {
      alert('Cannot connect to cheating detection server. Please make sure the server is running on https://cheating-detector-9e3o.onrender.com');
      return;
    }

    // Start camera if not already on
    if (!isCameraOn) {
      const cameraStarted = await startCamera();
      if (!cameraStarted) {
        alert('Cannot access camera. Please check permissions.');
        return;
      }
    }

    // Reset detector for new interview
    await resetDetector();

    setIsMonitoring(true);
    setCheatingDetected(false);
    setCheatingWarnings([]);

    console.log('Starting monitoring...');

    // Send first frame immediately
    await captureAndSendFrame();

    // Then send every 3 seconds
    intervalRef.current = setInterval(captureAndSendFrame, 3000);
  };

  // Stop monitoring
  const stopMonitoring = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsMonitoring(false);
    console.log('Monitoring stopped');
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);

        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current.readyState >= 2) {
            resolve();
          } else {
            videoRef.current.onloadeddata = resolve;
          }
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return false;
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  // Get severity color
  const getSeverityColor = (confidence) => {
    if (confidence > 0.7) return 'bg-red-500';
    if (confidence > 0.5) return 'bg-orange-500';
    if (confidence > 0.3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Get severity text color
  const getSeverityTextColor = (confidence) => {
    if (confidence > 0.7) return 'text-red-700';
    if (confidence > 0.5) return 'text-orange-700';
    if (confidence > 0.3) return 'text-yellow-700';
    return 'text-green-700';
  };

  // Check server connection on mount
  useEffect(() => {
    checkServerConnection();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      stopCamera();
    };
  }, []);

  return (
    <div className="interview-container p-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Interview Proctoring System</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${serverStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${serverStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
            Server: {serverStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>

          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isCameraOn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isCameraOn ? 'bg-green-500' : 'bg-gray-500'
              }`}></span>
            Camera: {isCameraOn ? 'On' : 'Off'}
          </div>

          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${isMonitoring ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isMonitoring ? 'bg-blue-500' : 'bg-gray-500'
              }`}></span>
            Monitoring: {isMonitoring ? 'Active' : 'Inactive'}
          </div>

          {cheatingScore > 0 && (
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <span className="w-2 h-2 rounded-full mr-2 bg-red-500"></span>
              Cheating Score: {cheatingScore}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 lg:h-96 object-cover"
            />
            {!isCameraOn && (
              <div className="flex items-center justify-center h-64 lg:h-96 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <div className="text-center">
                  <div className="text-5xl mb-4">📷</div>
                  <p className="text-xl font-medium">Camera is off</p>
                  <p className="text-gray-400 mt-2">Click "Start Interview" to begin proctoring</p>
                </div>
              </div>
            )}

            {/* Overlay warnings on camera feed */}
            {cheatingWarnings.length > 0 && (
              <div className="absolute top-4 left-4 right-4">
                <div className={`p-3 rounded-lg shadow-lg ${cheatingConfidence > 0.7 ? 'bg-red-600' :
                    cheatingConfidence > 0.5 ? 'bg-orange-500' :
                      cheatingConfidence > 0.3 ? 'bg-yellow-500' : 'bg-blue-500'
                  } text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">
                        {cheatingConfidence > 0.7 ? '🚨' :
                          cheatingConfidence > 0.5 ? '⚠️' : '👁️'}
                      </span>
                      <span className="font-bold">
                        {cheatingDetected ? 'CHEATING DETECTED' : 'WARNING'}
                      </span>
                    </div>
                    <span className="font-mono font-bold">
                      {Math.round(cheatingConfidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Interview Controls</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={startMonitoring}
                disabled={isMonitoring || serverStatus !== 'connected'}
                className={`px-8 py-3 rounded-xl font-medium text-lg flex-1 transition-all ${isMonitoring || serverStatus !== 'connected'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                  }`}
              >
                {isMonitoring ? '🔴 Monitoring Active' : '▶️ Start Interview'}
              </button>

              <button
                onClick={stopMonitoring}
                disabled={!isMonitoring}
                className={`px-8 py-3 rounded-xl font-medium text-lg flex-1 transition-all ${!isMonitoring
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
                  }`}
              >
                ⏹️ Stop Interview
              </button>
            </div>

            {serverStatus !== 'connected' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">
                  ⚠️ Server not connected. Please start the Python server:
                </p>
                <code className="block mt-1 p-2 bg-gray-800 text-green-300 rounded text-sm">
                  python server.py
                </code>
              </div>
            )}
          </div>
        </div>

        {/* Detection Panel */}
        <div className="space-y-6">
          {/* Confidence Meter */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Cheating Confidence</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Level</span>
                <span className={`text-2xl font-bold ${getSeverityTextColor(cheatingConfidence)}`}>
                  {Math.round(cheatingConfidence * 100)}%
                </span>
              </div>

              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${cheatingConfidence < 0.3 ? 'bg-green-200 text-green-800' :
                        cheatingConfidence < 0.6 ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                      }`}>
                      {cheatingConfidence < 0.3 ? 'SAFE' :
                        cheatingConfidence < 0.6 ? 'SUSPICIOUS' : 'CHEATING'}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                  <div
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${getSeverityColor(cheatingConfidence)
                      }`}
                    style={{ width: `${cheatingConfidence * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Safe</span>
                  <span>Warning</span>
                  <span>Critical</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Warnings */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Live Warnings</h2>
              {cheatingWarnings.length > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                  {cheatingWarnings.length} active
                </span>
              )}
            </div>

            {cheatingWarnings.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3 text-green-500">✓</div>
                <p className="text-gray-600 font-medium">No issues detected</p>
                <p className="text-gray-500 text-sm mt-1">Candidate is following guidelines</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {cheatingWarnings.map((warning, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${warning.includes('🚨') || warning.includes('📱') ? 'border-red-500 bg-red-50' :
                        warning.includes('⚠️') ? 'border-orange-500 bg-orange-50' :
                          warning.includes('👀') || warning.includes('👁️') ? 'border-yellow-500 bg-yellow-50' :
                            'border-blue-500 bg-blue-50'
                      }`}
                  >
                    <div className="flex items-start">
                      <span className="text-xl mr-2">
                        {warning.includes('📱') ? '📱' :
                          warning.includes('👁️') ? '👁️' :
                            warning.includes('👀') ? '👀' :
                              warning.includes('🚨') ? '🚨' : '⚠️'}
                      </span>
                      <span className="text-sm font-medium">{warning}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detection Details */}
          {detectionDetails && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Detection Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Face Detected:</span>
                  <span className={`font-medium ${detectionDetails.face_detected ? 'text-green-600' : 'text-red-600'}`}>
                    {detectionDetails.face_detected ? 'Yes ✓' : 'No ✗'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eyes Closed:</span>
                  <span className={`font-medium ${detectionDetails.eyes_closed ? 'text-red-600' : 'text-green-600'}`}>
                    {detectionDetails.eyes_closed ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Looking Away:</span>
                  <span className={`font-medium ${detectionDetails.looking_away ? 'text-yellow-600' : 'text-green-600'}`}>
                    {detectionDetails.looking_away ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Suspicious Objects:</span>
                  <span className={`font-medium ${detectionDetails.suspicious_object_detected ? 'text-red-600' : 'text-green-600'}`}>
                    {detectionDetails.suspicious_object_detected ? 'Detected' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eye Aspect Ratio:</span>
                  <span className="font-medium">
                    {detectionDetails.eye_aspect_ratio?.toFixed(3) || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gaze Direction:</span>
                  <span className="font-medium capitalize">
                    {detectionDetails.gaze_direction || 'center'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attention Level:</span>
                  <span className={`font-medium ${detectionDetails.attention_percentage > 80 ? 'text-green-600' :
                      detectionDetails.attention_percentage > 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {detectionDetails.attention_percentage || 100}%
                  </span>
                </div>
              </div>

              {/* Detected Objects */}
              {detectionDetails.detected_objects && detectionDetails.detected_objects.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium text-gray-700 mb-2">Detected Objects:</h3>
                  <div className="space-y-2">
                    {detectionDetails.detected_objects.map((obj, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{obj.label}</span>
                        <span className="text-gray-600 ml-2">({(obj.confidence * 100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Warning History */}
          {warningHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Warning History</h2>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  Last 10 warnings
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {warningHistory.map((warning, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">{warning.timestamp}</div>
                        <div className="text-sm font-medium">
                          {warning.warnings[0]?.substring(0, 50)}
                          {warning.warnings[0]?.length > 50 ? '...' : ''}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${warning.confidence > 0.7 ? 'bg-red-100 text-red-800' :
                          warning.confidence > 0.5 ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {Math.round(warning.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;