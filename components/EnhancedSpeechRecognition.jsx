"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX, Zap } from 'lucide-react'

export default function EnhancedSpeechRecognition({
  isListening,
  setIsListening,
  onTranscript,
  onInterimTranscript,
  onVoiceActivity,
  isMicOn,
  isInterviewStarted
}) {
  const recognitionRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const confidenceThreshold = 0.7
  
  const [isSupported, setIsSupported] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [speechDetected, setSpeechDetected] = useState(false)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      initializeSpeechRecognition(SpeechRecognition)
    }

    initializeAudioAnalysis()

    return () => {
      cleanup()
    }
  }, [])

  const initializeSpeechRecognition = (SpeechRecognition) => {
    recognitionRef.current = new SpeechRecognition()
    
    // Enhanced configuration
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = "en-US"
    recognitionRef.current.maxAlternatives = 3

    recognitionRef.current.onstart = () => {
      console.log("Speech recognition started")
      setSpeechDetected(false)
    }

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = ""
      let finalTranscript = ""
      let maxConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        const confidence = event.results[i][0].confidence || 1

        if (event.results[i].isFinal) {
          finalTranscript += transcript
          maxConfidence = Math.max(maxConfidence, confidence)
        } else {
          interimTranscript += transcript
        }
      }

      if (interimTranscript) {
        setCurrentTranscript(interimTranscript)
        onInterimTranscript?.(interimTranscript)
        setSpeechDetected(true)
        resetSilenceTimer()
      }

      if (finalTranscript.trim()) {
        setConfidence(maxConfidence)
        setCurrentTranscript("")
        onInterimTranscript?.("")
        
        // Only process if confidence is above threshold
        if (maxConfidence >= confidenceThreshold) {
          onTranscript?.(finalTranscript.trim(), maxConfidence)
          setIsListening(false)
        } else {
          console.log("Low confidence transcript ignored:", finalTranscript, maxConfidence)
        }
      }
    }

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      
      if (event.error === "no-speech") {
        // Restart recognition after no speech
        setTimeout(() => {
          if (isListening && isMicOn) {
            startListening()
          }
        }, 1000)
      } else if (event.error === "audio-capture") {
        setIsListening(false)
      }
    }

    recognitionRef.current.onend = () => {
      console.log("Speech recognition ended")
      if (isListening && isMicOn) {
        // Auto-restart if still supposed to be listening
        setTimeout(() => {
          startListening()
        }, 100)
      }
    }
  }

  const initializeAudioAnalysis = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      analyserRef.current.smoothingTimeConstant = 0.8

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      microphoneRef.current.connect(analyserRef.current)

      startAudioAnalysis()
    } catch (error) {
      console.error("Error initializing audio analysis:", error)
    }
  }

  const startAudioAnalysis = () => {
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const analyze = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      const normalizedVolume = average / 255

      setNoiseLevel(normalizedVolume)
      
      // Voice activity detection
      const voiceActivityLevel = Math.min(Math.floor(normalizedVolume * 10), 5)
      onVoiceActivity?.(voiceActivityLevel)

      // Detect speech vs noise
      const speechThreshold = 0.1
      if (normalizedVolume > speechThreshold && isListening) {
        setSpeechDetected(true)
        resetSilenceTimer()
      }

      requestAnimationFrame(analyze)
    }

    analyze()
  }

  const resetSilenceTimer = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }

    // Auto-stop listening after 3 seconds of silence
    silenceTimerRef.current = setTimeout(() => {
      if (speechDetected && currentTranscript.trim()) {
        setIsListening(false)
      }
    }, 3000)
  }

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isMicOn || !isInterviewStarted) return

    try {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume()
      }
      
      recognitionRef.current.start()
      setIsListening(true)
      setSpeechDetected(false)
      setCurrentTranscript("")
    } catch (error) {
      console.error("Error starting speech recognition:", error)
    }
  }, [isMicOn, isInterviewStarted])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setSpeechDetected(false)
    setCurrentTranscript("")
    onInterimTranscript?.("")
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
  }, [onInterimTranscript])

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
  }

  useEffect(() => {
    if (isListening && !recognitionRef.current) {
      startListening()
    } else if (!isListening && recognitionRef.current) {
      stopListening()
    }
  }, [isListening, startListening, stopListening])

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-red-500/20 rounded-lg border border-red-500/30">
        <p className="text-red-200 text-sm">
          Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main Control Button */}
      <div className="flex items-center justify-center">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!isMicOn || !isInterviewStarted}
            className={`relative w-16 h-16 rounded-full ${
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-blue-500 hover:bg-blue-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
            
            {/* Voice activity ring */}
            {isListening && speechDetected && (
              <motion.div
                className="absolute inset-0 border-2 border-white/50 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isMicOn ? "bg-green-400" : "bg-red-400"
          }`} />
          <span className="text-white/70">
            {isMicOn ? "Microphone Ready" : "Microphone Off"}
          </span>
        </div>

        {isListening && (
          <div className="flex items-center space-x-2">
            <Zap className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-400">Listening...</span>
          </div>
        )}
      </div>

      {/* Audio Level Indicator */}
      {isListening && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Audio Level</span>
            <span>{Math.round(noiseLevel * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-400 h-1 rounded-full"
              style={{ width: `${noiseLevel * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Confidence Indicator */}
      {confidence > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Speech Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className={`h-1 rounded-full ${
                confidence >= confidenceThreshold 
                  ? "bg-green-400" 
                  : "bg-yellow-400"
              }`}
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isListening && isInterviewStarted && (
        <p className="text-center text-white/60 text-xs">
          Click the microphone to start speaking your answer
        </p>
      )}

      {isListening && !speechDetected && (
        <p className="text-center text-blue-300 text-xs animate-pulse">
          Speak clearly into your microphone...
        </p>
      )}
    </div>
  )
}
