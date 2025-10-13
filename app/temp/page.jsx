"use client"

import { useState, useEffect, useRef } from "react"
import RealisticFaceAvatar from "../../components/RealisticAiAvatar"

export default function AvatarTestComponent() {
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
                    className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${
                      isSpeaking
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
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      emotion === emo
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
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                      personality === pers
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
                    className={`px-4 py-2 rounded-lg font-medium uppercase text-sm transition-all ${
                      imageExtension === ext
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
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                    isLoading
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                          isSpeaking
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
                className={`w-full mt-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSpeaking ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
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
