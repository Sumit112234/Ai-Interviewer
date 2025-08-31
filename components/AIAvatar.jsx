"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function AIAvatar({ 
  personality = "professional", 
  isSpeaking = false, 
  isLoading = false,
  emotion = "neutral",
  eyeDirection = "center",
  currentText = ""
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [blinkTimer, setBlinkTimer] = useState(0)
  const [eyeMovementTimer, setEyeMovementTimer] = useState(0)
  const [mouthAnimation, setMouthAnimation] = useState(0)
  const [speechAnalysis, setSpeechAnalysis] = useState({ intensity: 0, frequency: 0 })

  // Avatar configuration based on personality
  const avatarConfig = {
    professional: {
      skinTone: "#F4C2A1",
      hairColor: "#4A4A4A",
      eyeColor: "#2E5C8A",
      clothingColor: "#1F2937",
      expression: "serious"
    },
    friendly: {
      skinTone: "#F7D4B8",
      hairColor: "#8B4513",
      eyeColor: "#228B22",
      clothingColor: "#3B82F6",
      expression: "warm"
    },
    technical: {
      skinTone: "#E8C5A0",
      hairColor: "#2C2C2C",
      eyeColor: "#4B5563",
      clothingColor: "#374151",
      expression: "focused"
    },
    senior: {
      skinTone: "#F0D0A0",
      hairColor: "#6B7280",
      eyeColor: "#1F2937",
      clothingColor: "#111827",
      expression: "confident"
    }
  }

  const config = avatarConfig[personality] || avatarConfig.professional

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const animate = () => {
      drawAvatar(ctx, canvas.width, canvas.height)
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [personality, isSpeaking, isLoading, emotion, eyeDirection, blinkTimer, eyeMovementTimer, mouthAnimation])

  useEffect(() => {
    // Blink animation
    const blinkInterval = setInterval(() => {
      setBlinkTimer(prev => (prev + 1) % 180) // Blink every 3 seconds at 60fps
    }, 16)

    // Eye movement
    const eyeMovementInterval = setInterval(() => {
      setEyeMovementTimer(prev => (prev + 1) % 300) // Change direction every 5 seconds
    }, 16)

    // Mouth animation for speaking
    let mouthInterval
    if (isSpeaking) {
      mouthInterval = setInterval(() => {
        setMouthAnimation(prev => (prev + 0.3) % (Math.PI * 2))
        // Simulate speech analysis
        setSpeechAnalysis({
          intensity: 0.3 + Math.random() * 0.7,
          frequency: 0.5 + Math.random() * 0.5
        })
      }, 50)
    } else {
      setMouthAnimation(0)
      setSpeechAnalysis({ intensity: 0, frequency: 0 })
    }

    return () => {
      clearInterval(blinkInterval)
      clearInterval(eyeMovementInterval)
      if (mouthInterval) clearInterval(mouthInterval)
    }
  }, [isSpeaking])

  const drawAvatar = (ctx, width, height) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2

    // Background gradient
    const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2)
    bgGradient.addColorStop(0, "rgba(139, 92, 246, 0.1)")
    bgGradient.addColorStop(1, "rgba(59, 130, 246, 0.05)")
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Head
    ctx.fillStyle = config.skinTone
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 20, 80, 100, 0, 0, Math.PI * 2)
    ctx.fill()

    // Hair
    ctx.fillStyle = config.hairColor
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 80, 85, 60, 0, 0, Math.PI)
    ctx.fill()

    // Eyes
    const eyeY = centerY - 40
    const leftEyeX = centerX - 25
    const rightEyeX = centerX + 25

    // Eye movement calculation
    let eyeOffsetX = 0
    let eyeOffsetY = 0
    
    if (eyeDirection === "left") {
      eyeOffsetX = -3
    } else if (eyeDirection === "right") {
      eyeOffsetX = 3
    } else if (eyeDirection === "up") {
      eyeOffsetY = -2
    } else if (eyeDirection === "down") {
      eyeOffsetY = 2
    } else {
      // Natural eye movement
      eyeOffsetX = Math.sin(eyeMovementTimer * 0.02) * 2
      eyeOffsetY = Math.cos(eyeMovementTimer * 0.015) * 1
    }

    // Eye whites
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.ellipse(leftEyeX, eyeY, 12, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(rightEyeX, eyeY, 12, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Pupils
    ctx.fillStyle = config.eyeColor
    ctx.beginPath()
    ctx.ellipse(leftEyeX + eyeOffsetX, eyeY + eyeOffsetY, 6, 6, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(rightEyeX + eyeOffsetX, eyeY + eyeOffsetY, 6, 6, 0, 0, Math.PI * 2)
    ctx.fill()

    // Blinking
    if (blinkTimer > 170 || (isLoading && Math.sin(Date.now() * 0.01) > 0.7)) {
      ctx.fillStyle = config.skinTone
      ctx.fillRect(leftEyeX - 15, eyeY - 10, 30, 8)
      ctx.fillRect(rightEyeX - 15, eyeY - 10, 30, 8)
    }

    // Eyebrows
    ctx.strokeStyle = config.hairColor
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    
    const browOffset = emotion === "surprised" ? -5 : emotion === "angry" ? 3 : 0
    
    ctx.beginPath()
    ctx.moveTo(leftEyeX - 15, eyeY - 15 + browOffset)
    ctx.lineTo(leftEyeX + 15, eyeY - 18 + browOffset)
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(rightEyeX - 15, eyeY - 18 + browOffset)
    ctx.lineTo(rightEyeX + 15, eyeY - 15 + browOffset)
    ctx.stroke()

    // Nose
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.beginPath()
    ctx.ellipse(centerX, centerY - 10, 4, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    // Mouth
    const mouthY = centerY + 20
    ctx.strokeStyle = "#8B4513"
    ctx.lineWidth = 2
    ctx.lineCap = "round"

    if (isSpeaking) {
      // Animated mouth for speaking
      const mouthWidth = 15 + speechAnalysis.intensity * 10
      const mouthHeight = 5 + speechAnalysis.intensity * 8
      const mouthOpenness = Math.abs(Math.sin(mouthAnimation)) * speechAnalysis.intensity

      ctx.fillStyle = "#4A1810"
      ctx.beginPath()
      ctx.ellipse(centerX, mouthY + mouthOpenness * 3, mouthWidth, mouthHeight, 0, 0, Math.PI * 2)
      ctx.fill()

      // Teeth
      if (mouthOpenness > 0.3) {
        ctx.fillStyle = "white"
        ctx.fillRect(centerX - mouthWidth * 0.6, mouthY - 2, mouthWidth * 1.2, 3)
      }
    } else {
      // Static mouth based on emotion
      ctx.beginPath()
      if (emotion === "happy" || emotion === "welcoming") {
        ctx.arc(centerX, mouthY - 5, 15, 0, Math.PI)
      } else if (emotion === "sad") {
        ctx.arc(centerX, mouthY + 10, 15, Math.PI, Math.PI * 2)
      } else {
        ctx.moveTo(centerX - 10, mouthY)
        ctx.lineTo(centerX + 10, mouthY)
      }
      ctx.stroke()
    }

    // Clothing/Collar
    ctx.fillStyle = config.clothingColor
    ctx.fillRect(centerX - 90, centerY + 80, 180, 40)

    // Loading indicator
    if (isLoading) {
      const loadingRadius = 100
      const loadingAngle = (Date.now() * 0.005) % (Math.PI * 2)
      
      ctx.strokeStyle = "rgba(139, 92, 246, 0.6)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, loadingRadius, loadingAngle, loadingAngle + Math.PI / 2)
      ctx.stroke()
    }

    // Emotion-based effects
    if (emotion === "thinking") {
      // Thought bubble effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.beginPath()
      ctx.ellipse(centerX + 60, centerY - 80, 20, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.beginPath()
      ctx.ellipse(centerX + 45, centerY - 60, 8, 6, 0, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.beginPath()
      ctx.ellipse(centerX + 35, centerY - 45, 4, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full h-full object-contain"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          rotateY: isSpeaking ? [0, 2, -2, 0] : 0
        }}
        transition={{ 
          duration: 0.5,
          rotateY: { duration: 2, repeat: isSpeaking ? Infinity : 0 }
        }}
      />
      
      {/* Personality indicator */}
      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-white text-xs font-medium capitalize">{personality}</span>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <motion.div
          className="absolute bottom-2 right-2 flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-purple-400 rounded-full"
              animate={{
                height: [4, 12, 4],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}
