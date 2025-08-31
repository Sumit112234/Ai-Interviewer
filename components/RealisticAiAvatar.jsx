"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function DynamicFaceAvatar({ 
  personality = "professional", 
  isSpeaking = false, 
  isLoading = false,
  emotion = "neutral",
  eyeDirection = "center",
  currentText = "",
  speechProgress = 0,
  imageBasePath = "/images/avatar" // Base path for your images
}) {
  const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
  const [textIndex, setTextIndex] = useState(0)
  const [blinkState, setBlinkState] = useState(false)
  const blinkIntervalRef = useRef(null)
  const speechAnimationRef = useRef(null)
  const textAnimationRef = useRef(null)

  // Image naming convention mapping
  // Assumes images are named like: "happy_eyes_open_mouth_closed.jpg", "sad_eyes_closed_mouth_a.jpg", etc.
  const getImageName = (emotion, eyeState, mouthState) => {
    return `${"neutral"}_${eyeState}_${mouthState}.png`
  }

  // Vowel to mouth shape mapping
  const vowelToMouthShape = {
    'a': 'mouth_a',
    'e': 'mouth_e', 
    'i': 'mouth_i',
    'o': 'mouth_o',
    'u': 'mouth_u',
    ' ': 'mouth_closed', // Space = closed mouth
    '.': 'mouth_closed',
    ',': 'mouth_closed',
    '!': 'mouth_open',
    '?': 'mouth_little_open'
  }

  // Consonant to mouth shape mapping (simplified)
  const consonantToMouthShape = {
    'b': 'mouth_closed', 'p': 'mouth_closed', 'm': 'mouth_closed',
    'f': 'mouth_little_open', 'v': 'mouth_little_open',
    'th': 'mouth_little_open', 'd': 'mouth_little_open', 't': 'mouth_little_open',
    'l': 'mouth_little_open', 'n': 'mouth_little_open', 's': 'mouth_little_open',
    'r': 'mouth_open', 'k': 'mouth_open', 'g': 'mouth_open',
    'w': 'mouth_u', 'y': 'mouth_i'
  }

  // Personality-based configurations
  const personalityConfig = {
    professional: {
      blinkRate: 3000,
      speechSpeed: 120, // ms per character
      expressionIntensity: 0.7
    },
    friendly: {
      blinkRate: 2500,
      speechSpeed: 100,
      expressionIntensity: 0.9
    },
    technical: {
      blinkRate: 4000,
      speechSpeed: 150,
      expressionIntensity: 0.6
    },
    senior: {
      blinkRate: 3500,
      speechSpeed: 130,
      expressionIntensity: 0.8
    }
  }

  const config = personalityConfig[personality] || personalityConfig.professional

  // Get mouth shape for current character
  const getMouthShapeForChar = (char) => {
    const lowerChar = char.toLowerCase()
    
    // Check vowels first
    if (vowelToMouthShape[lowerChar]) {
      return vowelToMouthShape[lowerChar]
    }
    
    // Check consonants
    for (const [consonant, shape] of Object.entries(consonantToMouthShape)) {
      if (lowerChar === consonant || (consonant.length > 1 && currentText.toLowerCase().includes(consonant))) {
        return shape
      }
    }
    
    // Default for other characters
    if (/[bcdfghjklmnpqrstvwxyz]/.test(lowerChar)) {
      return 'mouth_little_open'
    }
    
    return 'mouth_closed'
  }

  // Blinking animation
  useEffect(() => {
    const startBlinking = () => {
      blinkIntervalRef.current = setInterval(() => {
        setBlinkState(true)
        setTimeout(() => setBlinkState(false), 150) // Blink duration
      }, config.blinkRate + Math.random() * 1000) // Add randomness
    }

    startBlinking()
    return () => {
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current)
      }
    }
  }, [config.blinkRate])

  // Text-based speech animation
  useEffect(() => {
    if (isSpeaking && currentText) {
      let currentIndex = 0
      
      const animateText = () => {
        if (currentIndex < currentText.length) {
          const currentChar = currentText[currentIndex]
          const mouthShape = getMouthShapeForChar(currentChar)
          const eyeState = blinkState ? "eyes_closed" : "eyes_open"
          
          setCurrentImageState(getImageName(emotion, eyeState, mouthShape))
          setTextIndex(currentIndex)
          currentIndex++
        } else {
          // Reset to neutral when done
          const eyeState = blinkState ? "eyes_closed" : "eyes_open"
          setCurrentImageState(getImageName(emotion, eyeState, "mouth_closed"))
          currentIndex = 0 // Loop or stop
        }
      }

      textAnimationRef.current = setInterval(animateText, config.speechSpeed)
    } else {
      // Not speaking - set to neutral/closed mouth
      const eyeState = blinkState ? "eyes_closed" : "eyes_open"
      setCurrentImageState(getImageName(emotion, eyeState, "mouth_closed"))
      setTextIndex(0)
      
      if (textAnimationRef.current) {
        clearInterval(textAnimationRef.current)
      }
    }

    return () => {
      if (textAnimationRef.current) {
        clearInterval(textAnimationRef.current)
      }
    }
  }, [isSpeaking, currentText, config.speechSpeed, emotion])

  // Update image when blink state changes
  useEffect(() => {
    if (!isSpeaking) {
      const eyeState = blinkState ? "eyes_closed" : "eyes_open"
      setCurrentImageState(getImageName(emotion, eyeState, "mouth_closed"))
    } else if (currentText) {
      const currentChar = currentText[textIndex] || ' '
      const mouthShape = getMouthShapeForChar(currentChar)
      const eyeState = blinkState ? "eyes_closed" : "eyes_open"
      setCurrentImageState(getImageName(emotion, eyeState, mouthShape))
    }
  }, [blinkState, emotion, isSpeaking, currentText, textIndex])

  // Random idle animations when not speaking
  useEffect(() => {
    if (!isSpeaking && !isLoading) {
      const idleAnimation = setInterval(() => {
        // Occasionally change to slight variations even when idle
        const variations = ['mouth_closed', 'mouth_little_open']
        const randomMouth = variations[Math.floor(Math.random() * variations.length)]
        const eyeState = blinkState ? "eyes_closed" : "eyes_open"
        
        setCurrentImageState(getImageName(emotion, eyeState, randomMouth))
        
        // Reset to closed mouth after a brief moment
        setTimeout(() => {
          const currentEyeState = blinkState ? "eyes_closed" : "eyes_open"
          setCurrentImageState(getImageName(emotion, currentEyeState, "mouth_closed"))
        }, 200)
      }, 5000 + Math.random() * 10000) // Random idle movements every 5-15 seconds

      return () => clearInterval(idleAnimation)
    }
  }, [isSpeaking, isLoading, emotion, blinkState])

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Main Avatar Container */}
      <motion.div
        className="relative w-full h-full"
        animate={{
          scale: isSpeaking ? [1, 1.01, 1] : 1
        }}
        transition={{
          scale: { duration: 0.5, repeat: isSpeaking ? Infinity : 0 }
        }}
      >
        {/* Dynamic Avatar Image */}
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
               
              className="relative w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }} // Very fast transitions for smooth speech
            >
              <Image
                src={`${imageBasePath}/${currentImageState}`}
                alt={`AI Avatar - ${emotion} - ${currentImageState}`}
                fill
                className="object-cover object-center rounded-lg"
                priority
                // Add error handling for missing images
                onError={(e) => {
                  // Fallback to neutral image if specific image doesn't exist
                  e.target.src = `${imageBasePath}/neutral_eyes_open_mouth_closed.jpg`
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Breathing Animation Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/3"
            animate={{
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Status Indicators */}
      <AnimatePresence>
        {/* Speaking Indicator with Current Character */}
        {isSpeaking && (
          <motion.div
            className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {/* Audio visualizer bars */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-green-400 rounded-full"
                animate={{
                  height: [4, 12, 4],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
            <div className="flex flex-col items-end">
              <span className="text-white text-xs">Speaking</span>
              {currentText && (
                <span className="text-green-300 text-xs font-mono">
                  "{currentText[textIndex] || ''}"
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="text-white text-xs">Processing</span>
          </motion.div>
        )}

        {/* Emotion & Personality Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs font-medium capitalize">{personality}</span>
            <span className="text-gray-300 text-xs">•</span>
            <span className="text-white text-xs capitalize">{emotion}</span>
          </div>
        </div>

        {/* Speech Progress Bar */}
        {isSpeaking && currentText && (
          <motion.div
            className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center space-x-3">
              <span className="text-white text-xs">Progress</span>
              <div className="w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-400 rounded-full"
                  animate={{
                    width: `${(textIndex / currentText.length) * 100}%`
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <span className="text-gray-300 text-xs">
                {Math.round((textIndex / currentText.length) * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emotion-based Ambient Lighting */}
      <motion.div
        className={`absolute inset-0 rounded-lg ${
          emotion === "happy" ? "bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10" :
          emotion === "sad" ? "bg-gradient-to-br from-blue-500/10 via-transparent to-gray-500/10" :
          emotion === "angry" ? "bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" :
          emotion === "surprised" ? "bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" :
          emotion === "thinking" ? "bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" :
          "bg-gradient-to-br from-purple-500/8 via-transparent to-blue-500/8" // neutral
        }`}
        animate={{
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Current Text Display (Debug/Development) */}
      {false && process.env.NODE_ENV === 'development' && currentText && (
        <div className="absolute top-16 left-4 bg-black/80 backdrop-blur-sm rounded px-3 py-1 max-w-xs">
          <div className="text-white text-xs">
            <div className="font-semibold">Current Text:</div>
            <div className="font-mono break-words">
              {currentText.split('').map((char, index) => (
                <span
                  key={index}
                  className={index === textIndex ? 'bg-green-400 text-black' : ''}
                >
                  {char === ' ' ? '␣' : char}
                </span>
              ))}
            </div>
            <div className="text-gray-400 text-xs mt-1">
              Image: {currentImageState}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}




// import { useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function RealisticAIAvatar({ 
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0
// }) {
//   const [blinkState, setBlinkState] = useState(false)
//   const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
//   const [mouthState, setMouthState] = useState("closed")
//   const [headTilt, setHeadTilt] = useState(0)
//   const blinkIntervalRef = useRef(null)
//   const eyeMovementRef = useRef(null)
//   const speechAnimationRef = useRef(null)

//   // Personality-based configurations
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3000, // Every 3 seconds
//       eyeMovementIntensity: 0.3,
//       headMovementRange: 2,
//       speechIntensity: 0.7
//     },
//     friendly: {
//       blinkRate: 2500,
//       eyeMovementIntensity: 0.5,
//       headMovementRange: 4,
//       speechIntensity: 0.9
//     },
//     technical: {
//       blinkRate: 4000,
//       eyeMovementIntensity: 0.2,
//       headMovementRange: 1,
//       speechIntensity: 0.6
//     },
//     senior: {
//       blinkRate: 3500,
//       eyeMovementIntensity: 0.4,
//       headMovementRange: 3,
//       speechIntensity: 0.8
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Blinking animation
//   useEffect(() => {
//     const startBlinking = () => {
//       blinkIntervalRef.current = setInterval(() => {
//         setBlinkState(true)
//         setTimeout(() => setBlinkState(false), 150) // Blink duration
//       }, config.blinkRate + Math.random() * 1000) // Add randomness
//     }

//     startBlinking()
//     return () => {
//       if (blinkIntervalRef.current) {
//         clearInterval(blinkIntervalRef.current)
//       }
//     }
//   }, [config.blinkRate])

//   // Eye movement animation
//   useEffect(() => {
//     const moveEyes = () => {
//       const baseX = eyeDirection === "left" ? -0.5 : eyeDirection === "right" ? 0.5 : 0
//       const baseY = eyeDirection === "up" ? -0.3 : eyeDirection === "down" ? 0.3 : 0
      
//       // Add natural micro-movements
//       const naturalX = baseX + (Math.random() - 0.5) * config.eyeMovementIntensity
//       const naturalY = baseY + (Math.random() - 0.5) * config.eyeMovementIntensity * 0.5
      
//       setEyePosition({ x: naturalX, y: naturalY })
//     }

//     eyeMovementRef.current = setInterval(moveEyes, 2000 + Math.random() * 3000)
//     return () => {
//       if (eyeMovementRef.current) {
//         clearInterval(eyeMovementRef.current)
//       }
//     }
//   }, [eyeDirection, config.eyeMovementIntensity])

//   // Speech animation
//   useEffect(() => {
//     if (isSpeaking) {
//       const animateSpeech = () => {
//         const mouthStates = ["closed", "slightly-open", "open", "wide-open"]
//         const randomState = mouthStates[Math.floor(Math.random() * mouthStates.length)]
//         setMouthState(randomState)
        
//         // Add subtle head movements while speaking
//         setHeadTilt((Math.random() - 0.5) * config.headMovementRange)
//       }

//       speechAnimationRef.current = setInterval(animateSpeech, 100 + Math.random() * 100)
//     } else {
//       setMouthState("closed")
//       setHeadTilt(0)
//       if (speechAnimationRef.current) {
//         clearInterval(speechAnimationRef.current)
//       }
//     }

//     return () => {
//       if (speechAnimationRef.current) {
//         clearInterval(speechAnimationRef.current)
//       }
//     }
//   }, [isSpeaking, config.headMovementRange, config.speechIntensity])

//   // Emotion-based expressions
//   const getEmotionStyles = () => {
//     switch (emotion) {
//       case "happy":
//         return { filter: "brightness(1.1) contrast(1.05)" }
//       case "thinking":
//         return { filter: "brightness(0.95) contrast(1.1)" }
//       case "focused":
//         return { filter: "contrast(1.1) saturate(1.1)" }
//       case "welcoming":
//         return { filter: "brightness(1.05) saturate(1.1)" }
//       case "satisfied":
//         return { filter: "brightness(1.1) saturate(1.05)" }
//       default:
//         return { filter: "brightness(1) contrast(1)" }
//     }
//   }

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//       {/* Main Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           rotateZ: headTilt,
//           scale: isSpeaking ? [1, 1.02, 1] : 1
//         }}
//         transition={{
//           rotateZ: { duration: 0.5, ease: "easeOut" },
//           scale: { duration: 0.8, repeat: isSpeaking ? Infinity : 0 }
//         }}
//         style={getEmotionStyles()}
//       >
//         {/* Base Avatar Image */}
//         <div className="relative w-full h-full">
//           <Image
//             src="/images/ai-interviewer-avatar.jpg"
//             alt="AI Interviewer"
//             fill
//             className="object-cover object-center rounded-lg"
//             priority
//           />
          
//           {/* Eye Overlay for Movement */}
//           <div className="absolute inset-0">
//             {/* Left Eye */}
//             <motion.div
//               className="absolute w-3 h-3 bg-black rounded-full opacity-80"
//               style={{
//                 left: "41%",
//                 top: "42%",
//                 transform: "translate(-50%, -50%)"
//               }}
//               animate={{
//                 x: eyePosition.x * 4,
//                 y: eyePosition.y * 3,
//                 scaleY: blinkState ? 0.1 : 1
//               }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//             />
            
//             {/* Right Eye */}
//             <motion.div
//               className="absolute w-3 h-3 bg-black rounded-full opacity-80"
//               style={{
//                 left: "59%",
//                 top: "42%",
//                 transform: "translate(-50%, -50%)"
//               }}
//               animate={{
//                 x: eyePosition.x * 4,
//                 y: eyePosition.y * 3,
//                 scaleY: blinkState ? 0.1 : 1
//               }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//             />
//           </div>

//           {/* Mouth Animation Overlay */}
//           {isSpeaking && (
//             <motion.div
//               className="absolute"
//               style={{
//                 left: "50%",
//                 top: "65%",
//                 transform: "translate(-50%, -50%)"
//               }}
//             >
//               <motion.div
//                 className="w-6 h-3 bg-red-900 rounded-full opacity-60"
//                 animate={{
//                   scaleX: mouthState === "closed" ? 0.8 : 
//                           mouthState === "slightly-open" ? 1 :
//                           mouthState === "open" ? 1.2 : 1.4,
//                   scaleY: mouthState === "closed" ? 0.3 : 
//                           mouthState === "slightly-open" ? 0.6 :
//                           mouthState === "open" ? 1 : 1.3
//                 }}
//                 transition={{ duration: 0.1, ease: "easeOut" }}
//               />
//             </motion.div>
//           )}

//           {/* Breathing Animation */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5"
//             animate={{
//               opacity: [0.3, 0.5, 0.3]
//             }}
//             transition={{
//               duration: 4,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* Status Indicators */}
//       <AnimatePresence>
//         {/* Speaking Indicator */}
//         {isSpeaking && (
//           <motion.div
//             className="absolute bottom-4 right-4 flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             {[...Array(4)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-1 bg-green-400 rounded-full"
//                 animate={{
//                   height: [4, 12, 4],
//                   opacity: [0.4, 1, 0.4]
//                 }}
//                 transition={{
//                   duration: 0.6,
//                   repeat: Infinity,
//                   delay: i * 0.1
//                 }}
//               />
//             ))}
//             <span className="text-white text-xs ml-2">Speaking</span>
//           </motion.div>
//         )}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs">Thinking</span>
//           </motion.div>
//         )}

//         {/* Personality Badge */}
//         <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
//           <span className="text-white text-xs font-medium capitalize">{personality}</span>
//         </div>
//       </AnimatePresence>

//       {/* Emotion-based Visual Effects */}
//       <AnimatePresence>
//         {emotion === "thinking" && (
//           <motion.div
//             className="absolute -top-8 -right-8 w-16 h-16"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0 }}
//           >
//             {/* Thought bubbles */}
//             <motion.div
//               className="absolute w-3 h-3 bg-white/80 rounded-full"
//               style={{ right: "20px", top: "40px" }}
//               animate={{ y: [-2, -6, -2] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             />
//             <motion.div
//               className="absolute w-2 h-2 bg-white/60 rounded-full"
//               style={{ right: "30px", top: "50px" }}
//               animate={{ y: [-1, -3, -1] }}
//               transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
//             />
//             <motion.div
//               className="absolute w-1 h-1 bg-white/40 rounded-full"
//               style={{ right: "35px", top: "55px" }}
//               animate={{ y: [-0.5, -1.5, -0.5] }}
//               transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Ambient Lighting Effect */}
//       <motion.div
//         className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-lg"
//         animate={{
//           opacity: [0.3, 0.6, 0.3]
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />
//     </div>
//   )
// }


// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function RealisticAIAvatar({ 
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0
// }) {
//   const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
//   const [blinkState, setBlinkState] = useState(false)
//   const [headTilt, setHeadTilt] = useState(0)
//   const [textIndex, setTextIndex] = useState(0)
  
//   const blinkIntervalRef = useRef(null)
//   const speechAnimationRef = useRef(null)
//   const textAnimationRef = useRef(null)

//   // Image mapping based on your face states
//   const faceImages = {
//     // Neutral states
//     neutral_eyes_open_mouth_closed: "/images/neutral_eyes_open_mouth_closed.jpg",
//     neutral_eyes_closed_mouth_closed: "/images/neutral_eyes_closed_mouth_closed.jpg",
    
//     // Mouth states for speech
//     mouth_a: "/images/mouth_a.jpg", // Wide open mouth for 'A' sound
//     mouth_e: "/images/mouth_e.jpg", // Slightly open, wider mouth for 'E' sound
//     mouth_i: "/images/mouth_i.jpg", // Small opening, lips slightly apart for 'I' sound
//     mouth_o: "/images/mouth_o.jpg", // Round mouth opening for 'O' sound
//     mouth_u: "/images/mouth_u.jpg", // Small round opening for 'U' sound
    
//     // General mouth states
//     mouth_open_small: "/images/mouth_open_small.jpg",
//     mouth_open_medium: "/images/mouth_open_medium.jpg",
//     mouth_open_large: "/images/mouth_open_large.jpg",
    
//     // Blinking variants for each mouth state
//     mouth_a_eyes_closed: "/images/mouth_a_eyes_closed.jpg",
//     mouth_e_eyes_closed: "/images/mouth_e_eyes_closed.jpg",
//     mouth_i_eyes_closed: "/images/mouth_i_eyes_closed.jpg",
//     mouth_o_eyes_closed: "/images/mouth_o_eyes_closed.jpg",
//     mouth_u_eyes_closed: "/images/mouth_u_eyes_closed.jpg",
//     mouth_open_small_eyes_closed: "/images/mouth_open_small_eyes_closed.jpg",
//     mouth_open_medium_eyes_closed: "/images/mouth_open_medium_eyes_closed.jpg",
//     mouth_open_large_eyes_closed: "/images/mouth_open_large_eyes_closed.jpg"
//   }

//   // Personality-based configurations
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3000,
//       speechSpeed: 120, // ms between phonemes
//       headMovementRange: 2
//     },
//     friendly: {
//       blinkRate: 2500,
//       speechSpeed: 100,
//       headMovementRange: 4
//     },
//     technical: {
//       blinkRate: 4000,
//       speechSpeed: 150,
//       headMovementRange: 1
//     },
//     senior: {
//       blinkRate: 3500,
//       speechSpeed: 110,
//       headMovementRange: 3
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Phoneme to mouth shape mapping
//   const phonemeToMouth = {
//     'a': 'mouth_a',
//     'e': 'mouth_e',
//     'i': 'mouth_i',
//     'o': 'mouth_o',
//     'u': 'mouth_u',
//     'A': 'mouth_a',
//     'E': 'mouth_e',
//     'I': 'mouth_i',
//     'O': 'mouth_o',
//     'U': 'mouth_u'
//   }

//   // Consonant to mouth shape mapping (approximations)
//   const consonantToMouth = {
//     'b': 'neutral_eyes_open_mouth_closed', // Lips closed
//     'p': 'neutral_eyes_open_mouth_closed', // Lips closed
//     'm': 'neutral_eyes_open_mouth_closed', // Lips closed
//     'f': 'mouth_open_small', // Lip-teeth contact
//     'v': 'mouth_open_small', // Lip-teeth contact
//     'th': 'mouth_open_small', // Tongue between teeth
//     's': 'mouth_open_small', // Small opening
//     'z': 'mouth_open_small', // Small opening
//     'sh': 'mouth_open_medium', // Rounded lips
//     'ch': 'mouth_open_medium', // Similar to 'sh'
//     'j': 'mouth_open_medium', // Similar to 'ch'
//     'k': 'mouth_open_medium', // Mouth slightly open
//     'g': 'mouth_open_medium', // Similar to 'k'
//     't': 'mouth_open_small', // Tongue touches roof
//     'd': 'mouth_open_small', // Similar to 't'
//     'n': 'mouth_open_small', // Tongue touches roof
//     'l': 'mouth_open_small', // Tongue touches roof
//     'r': 'mouth_open_medium', // Tongue curled
//     'w': 'mouth_u', // Rounded lips like 'u'
//     'y': 'mouth_i', // Similar to 'i'
//     'h': 'mouth_open_small', // Breath
//     ' ': 'neutral_eyes_open_mouth_closed', // Space - neutral
//     '.': 'neutral_eyes_open_mouth_closed', // Punctuation - neutral
//     ',': 'neutral_eyes_open_mouth_closed',
//     '!': 'mouth_open_medium',
//     '?': 'mouth_open_medium'
//   }

//   // Function to get mouth shape from character
//   const getMouthShape = (char) => {
//     const lowerChar = char.toLowerCase()
    
//     // Check vowels first
//     if (phonemeToMouth[char] || phonemeToMouth[lowerChar]) {
//       return phonemeToMouth[char] || phonemeToMouth[lowerChar]
//     }
    
//     // Check consonants
//     if (consonantToMouth[lowerChar]) {
//       return consonantToMouth[lowerChar]
//     }
    
//     // Default to small opening for unknown characters
//     return 'mouth_open_small'
//   }

//   // Function to get current image key
//   const getCurrentImageKey = (mouthShape) => {
//     const baseShape = mouthShape || 'neutral_eyes_open_mouth_closed'
    
//     // If blinking, try to get the eyes-closed version
//     if (blinkState) {
//       const blinkingVersion = `${baseShape}_eyes_closed`
//       if (faceImages[blinkingVersion]) {
//         return blinkingVersion
//       }
//       // Fallback to neutral eyes closed if specific blink version doesn't exist
//       return 'neutral_eyes_closed_mouth_closed'
//     }
    
//     return baseShape
//   }

//   // Blinking animation
//   useEffect(() => {
//     const startBlinking = () => {
//       blinkIntervalRef.current = setInterval(() => {
//         setBlinkState(true)
//         setTimeout(() => setBlinkState(false), 150) // Blink duration
//       }, config.blinkRate + Math.random() * 1000) // Add randomness
//     }

//     startBlinking()
//     return () => {
//       if (blinkIntervalRef.current) {
//         clearInterval(blinkIntervalRef.current)
//       }
//     }
//   }, [config.blinkRate])

//   // Text-based speech animation
//   useEffect(() => {
//     if (isSpeaking && currentText) {
//       let index = 0
      
//       const animateText = () => {
//         if (index < currentText.length) {
//           const char = currentText[index]
//           const mouthShape = getMouthShape(char)
          
//           // Update the mouth shape
//           setCurrentImageState(getCurrentImageKey(mouthShape))
          
//           // Add subtle head movements while speaking
//           setHeadTilt((Math.random() - 0.5) * config.headMovementRange)
          
//           index++
//           setTextIndex(index)
//         } else {
//           // Reset to neutral when done
//           setCurrentImageState(getCurrentImageKey('neutral_eyes_open_mouth_closed'))
//           setHeadTilt(0)
//           index = 0 // Reset for looping if needed
//         }
//       }

//       // Start the animation
//       textAnimationRef.current = setInterval(animateText, config.speechSpeed)
      
//       return () => {
//         if (textAnimationRef.current) {
//           clearInterval(textAnimationRef.current)
//         }
//       }
//     } else {
//       // Not speaking - return to neutral
//       setCurrentImageState(getCurrentImageKey('neutral_eyes_open_mouth_closed'))
//       setHeadTilt(0)
//       setTextIndex(0)
      
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }
//   }, [isSpeaking, currentText, config.speechSpeed, config.headMovementRange, blinkState])

//   // Update image when blink state changes
//   useEffect(() => {
//     const currentMouthShape = currentImageState.includes('mouth_') 
//       ? currentImageState.split('_eyes_')[0] 
//       : 'neutral_eyes_open_mouth_closed'
//     setCurrentImageState(getCurrentImageKey(currentMouthShape))
//   }, [blinkState])

//   // Emotion-based expressions
//   const getEmotionStyles = () => {
//     switch (emotion) {
//       case "happy":
//         return { filter: "brightness(1.1) contrast(1.05)" }
//       case "thinking":
//         return { filter: "brightness(0.95) contrast(1.1)" }
//       case "focused":
//         return { filter: "contrast(1.1) saturate(1.1)" }
//       case "welcoming":
//         return { filter: "brightness(1.05) saturate(1.1)" }
//       case "satisfied":
//         return { filter: "brightness(1.1) saturate(1.05)" }
//       default:
//         return { filter: "brightness(1) contrast(1)" }
//     }
//   }

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//       {/* Main Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           rotateZ: headTilt,
//           scale: isSpeaking ? [1, 1.01, 1] : 1
//         }}
//         transition={{
//           rotateZ: { duration: 0.3, ease: "easeOut" },
//           scale: { duration: 0.6, repeat: isSpeaking ? Infinity : 0 }
//         }}
//         style={getEmotionStyles()}
//       >
//         {/* Dynamic Avatar Image */}
//         <div className="relative w-full h-full">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentImageState}
//               className="absolute inset-0"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.1 }}
//             >
//               <Image
//                 src={faceImages[currentImageState] || faceImages.neutral_eyes_open_mouth_closed}
//                 alt="AI Interviewer"
//                 fill
//                 className="object-cover object-center rounded-lg"
//                 priority
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* Breathing Animation */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5"
//             animate={{
//               opacity: [0.3, 0.5, 0.3]
//             }}
//             transition={{
//               duration: 4,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* Status Indicators */}
//       <AnimatePresence>
//         {/* Speaking Indicator with Text Progress */}
//         {isSpeaking && (
//           <motion.div
//             className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             {[...Array(4)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-1 bg-green-400 rounded-full"
//                 animate={{
//                   height: [4, 12, 4],
//                   opacity: [0.4, 1, 0.4]
//                 }}
//                 transition={{
//                   duration: 0.4,
//                   repeat: Infinity,
//                   delay: i * 0.1
//                 }}
//               />
//             ))}
//             <span className="text-white text-xs ml-2">
//               Speaking ({textIndex}/{currentText.length})
//             </span>
//           </motion.div>
//         )}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs">Thinking</span>
//           </motion.div>
//         )}

//         {/* Current Text Display (Debug) */}
//         {isSpeaking && currentText && (
//           <motion.div
//             className="absolute bottom-16 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//           >
//             <div className="text-white text-sm">
//               {currentText.split('').map((char, index) => (
//                 <span 
//                   key={index} 
//                   className={index === textIndex ? 'bg-blue-500 text-white px-1 rounded' : 'text-white/70'}
//                 >
//                   {char}
//                 </span>
//               ))}
//             </div>
//             <div className="text-white/50 text-xs mt-1">
//               Current mouth: {currentImageState}
//             </div>
//           </motion.div>
//         )}

//         {/* Personality Badge */}
//         <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
//           <span className="text-white text-xs font-medium capitalize">{personality}</span>
//         </div>
//       </AnimatePresence>

//       {/* Emotion-based Visual Effects */}
//       <AnimatePresence>
//         {emotion === "thinking" && (
//           <motion.div
//             className="absolute -top-8 -right-8 w-16 h-16"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0 }}
//           >
//             {/* Thought bubbles */}
//             <motion.div
//               className="absolute w-3 h-3 bg-white/80 rounded-full"
//               style={{ right: "20px", top: "40px" }}
//               animate={{ y: [-2, -6, -2] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             />
//             <motion.div
//               className="absolute w-2 h-2 bg-white/60 rounded-full"
//               style={{ right: "30px", top: "50px" }}
//               animate={{ y: [-1, -3, -1] }}
//               transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
//             />
//             <motion.div
//               className="absolute w-1 h-1 bg-white/40 rounded-full"
//               style={{ right: "35px", top: "55px" }}
//               animate={{ y: [-0.5, -1.5, -0.5] }}
//               transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
//             />
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Ambient Lighting Effect */}
//       <motion.div
//         className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-lg"
//         animate={{
//           opacity: [0.3, 0.6, 0.3]
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />
//     </div>
//   )
// }