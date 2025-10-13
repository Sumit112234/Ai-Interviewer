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

  // console.log("DynamicFaceAvatar render:", { emotion } )
  // Image naming convention mapping
  // Assumes images are named like: "happy_eyes_open_mouth_closed.jpg", "sad_eyes_closed_mouth_a.jpg", etc.
  const getImageName = (emotion, eyeState, mouthState) => {
    if(emotion !== 'neutral' && emotion !== 'happy' &&  emotion !== 'angry' ) { 
      return `${'neutral'}_${eyeState}_${mouthState}.png`
    }else
      return `${emotion}_${eyeState}_${mouthState}.png`
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



// "use client"

// import { useEffect, useRef, useState, useMemo } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function RealisticFaceAvatar({ 
//   speechRate = 0.9,
//   speechVolume = 0.8,
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0,
//   imageBasePath = "/images/avatar",
//   onSpeechStart = () => {},
//   onSpeechEnd = () => {}
// }) {
//   const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
//   const [textIndex, setTextIndex] = useState(0)
//   const [blinkState, setBlinkState] = useState(false)
//   const [internalIsSpeaking, setInternalIsSpeaking] = useState(false)
//   const blinkIntervalRef = useRef(null)
//   const textAnimationRef = useRef(null)
//   const lastMouthStateRef = useRef("mouth_closed")
//   const imagePreloadRef = useRef(new Set())
//   const [imagesPreloaded, setImagesPreloaded] = useState(false)
//   const utteranceRef = useRef(null)

//   // Map available images to standardized mouth states
//   const mouthStateMapping = {
//     'mouth_closed': 'mouth_closed',
//     'mouth_rest': 'mouth_closed',
//     'mouth_little_open': 'mouth_little_open',
//     'mouth_open': 'mouth_open',
//     'mouth_a': 'mouth_a',
//     'mouth_aa': 'mouth_a',
//     'mouth_e': 'mouth_e',
//     'mouth_ee': 'mouth_e',
//     'mouth_i': 'mouth_i',
//     'mouth_ii': 'mouth_i',
//     'mouth_o': 'mouth_o',
//     'mouth_oh': 'mouth_o',
//     'mouth_oo': 'mouth_o',
//     'mouth_u': 'mouth_u',
//     'mouth_uu': 'mouth_u',
//     'mouth_b': 'mouth_closed',
//     'mouth_p': 'mouth_closed',
//     'mouth_m': 'mouth_closed',
//     'mouth_f': 'mouth_little_open',
//     'mouth_v': 'mouth_little_open',
//     'mouth_th': 'mouth_little_open',
//     'mouth_s': 'mouth_little_open',
//     'mouth_z': 'mouth_little_open',
//     'mouth_t': 'mouth_little_open',
//     'mouth_d': 'mouth_little_open',
//     'mouth_n': 'mouth_closed',
//     'mouth_l': 'mouth_little_open',
//     'mouth_r': 'mouth_little_open',
//     'mouth_k': 'mouth_open',
//     'mouth_g': 'mouth_open',
//     'mouth_w': 'mouth_o',
//     'mouth_y': 'mouth_e'
//   }

//   // Interviewer personality configurations
//   const interviewerPersonalities = {
//     professional: {
//       voice: { pitch: 1.0, rate: 0.8 }
//     },
//     friendly: {
//       voice: { pitch: 1.2, rate: 0.9 }
//     },
//     technical: {
//       voice: { pitch: 0.9, rate: 0.85 }
//     },
//     senior: {
//       voice: { pitch: 0.95, rate: 0.75 }
//     }
//   }

//   // Preload all avatar images
//   useEffect(() => {
//     const emotions = ['neutral', 'happy', 'angry']
//     const eyeStates = ['eyes_open', 'eyes_closed']
//     const mouthStates = ['mouth_closed', 'mouth_a', 'mouth_e', 'mouth_i', 'mouth_o', 'mouth_u', 'mouth_little_open', 'mouth_open']
    
//     const preloadImages = async () => {
//       const imagePromises = []
      
//       emotions.forEach(emo => {
//         eyeStates.forEach(eye => {
//           mouthStates.forEach(mouth => {
//             const imageName = `${emo}_${eye}_${mouth}.png`
//             const imagePath = `${imageBasePath}/${imageName}`
            
//             if (!imagePreloadRef.current.has(imagePath)) {
//               const img = new window.Image()
//               img.src = imagePath
//               imagePromises.push(
//                 new Promise((resolve) => {
//                   img.onload = () => {
//                     imagePreloadRef.current.add(imagePath)
//                     resolve()
//                   }
//                   img.onerror = () => resolve() // Continue even if image fails
//                 })
//               )
//             }
//           })
//         })
//       })
      
//       await Promise.all(imagePromises)
//       setImagesPreloaded(true)
//     }
    
//     preloadImages()
//   }, [imageBasePath])

//   // Load voices on mount
//   useEffect(() => {
//     const loadVoices = () => {
//       if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//         window.speechSynthesis.getVoices()
//       }
//     }
//     loadVoices()
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       window.speechSynthesis.onvoiceschanged = loadVoices
//     }
//   }, [])

//   // Integrated speech synthesis function
//   const speakText = (text) => {
//     if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    
//     // Cancel any ongoing speech
//     window.speechSynthesis.cancel()
    
//     const utterance = new SpeechSynthesisUtterance(text)
//     const voices = window.speechSynthesis.getVoices()
//     const personalityConfig = interviewerPersonalities[personality] || interviewerPersonalities.professional

//     // Prioritize Indian female voice
//     const selectedVoice =
//       voices.find(
//         (voice) =>
//           voice.lang.toLowerCase().includes("en-in") &&
//           (voice.name.toLowerCase().includes("female") ||
//             voice.name.toLowerCase().includes("woman") ||
//             voice.name.toLowerCase().includes("girl"))
//       ) ||
//       // Fallback: any female voice
//       voices.find(
//         (voice) =>
//           voice.name.toLowerCase().includes("female") ||
//           voice.name.toLowerCase().includes("woman") ||
//           voice.name.toLowerCase().includes("girl")
//       ) ||
//       // Fallback: any Indian voice
//       voices.find((voice) => voice.lang.toLowerCase().includes("en-in")) ||
//       // Ultimate fallback: first available voice
//       voices[0]

//     utterance.voice = selectedVoice
//     utterance.pitch = personalityConfig.voice.pitch
//     utterance.rate = speechRate
//     utterance.volume = speechVolume

//     utterance.onstart = () => {
//       setInternalIsSpeaking(true)
//       onSpeechStart()
//     }

//     utterance.onend = () => {
//       setInternalIsSpeaking(false)
//       onSpeechEnd()
//     }

//     utterance.onerror = () => {
//       setInternalIsSpeaking(false)
//       onSpeechEnd()
//     }

//     utteranceRef.current = utterance
//     window.speechSynthesis.speak(utterance)
//   }

//   // Trigger speech when currentText changes and isSpeaking is true
//   useEffect(() => {
//     if (isSpeaking && currentText && imagesPreloaded) {
//       speakText(currentText)
//     } else if (!isSpeaking && utteranceRef.current) {
//       // Stop speech if isSpeaking becomes false
//       if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//         window.speechSynthesis.cancel()
//       }
//       setInternalIsSpeaking(false)
//     }

//     return () => {
//       if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//         window.speechSynthesis.cancel()
//       }
//     }
//   }, [isSpeaking, currentText, imagesPreloaded])

//   // Enhanced image naming with .png extension
//   const getImageName = (emotion, eyeState, mouthState) => {
//     if(emotion !== 'neutral' && emotion !== 'happy' && emotion !== 'angry') {
//       emotion = 'neutral'
//     }
//     const mappedMouth = mouthStateMapping[mouthState] || 'mouth_closed'
//     return `${emotion}_${eyeState}_${mappedMouth}.png`
//   }

//   // Comprehensive phoneme to viseme mapping with linguistic rules
//   const phonemeToViseme = useMemo(() => ({
//     // Silence and pauses
//     'sil': 'mouth_closed',
//     ' ': 'mouth_closed',
//     '.': 'mouth_closed',
//     ',': 'mouth_rest',
//     '!': 'mouth_little_open',
//     '?': 'mouth_little_open',
    
//     // Vowels - Open sounds
//     'a': 'mouth_a',
//     'aa': 'mouth_a',
//     'ah': 'mouth_a',
    
//     // Vowels - Front/Smile sounds
//     'e': 'mouth_e',
//     'eh': 'mouth_e',
//     'i': 'mouth_i',
//     'ii': 'mouth_e',
//     'ee': 'mouth_e',
    
//     // Vowels - Back/Round sounds
//     'o': 'mouth_o',
//     'oh': 'mouth_o',
//     'oo': 'mouth_o',
//     'u': 'mouth_u',
//     'uu': 'mouth_u',
//     'uh': 'mouth_little_open',
    
//     // Diphthongs
//     'ai': 'mouth_a',
//     'ay': 'mouth_a',
//     'ey': 'mouth_e',
//     'oi': 'mouth_o',
//     'oy': 'mouth_o',
//     'au': 'mouth_o',
//     'aw': 'mouth_o',
//     'ow': 'mouth_o',
    
//     // Bilabial consonants (lips together)
//     'b': 'mouth_closed',
//     'p': 'mouth_closed',
//     'm': 'mouth_closed',
    
//     // Labiodental consonants (lip-teeth)
//     'f': 'mouth_little_open',
//     'v': 'mouth_little_open',
    
//     // Dental consonants (tongue-teeth)
//     'th': 'mouth_little_open',
//     'dh': 'mouth_little_open',
    
//     // Alveolar consonants (tongue-alveolar ridge)
//     's': 'mouth_little_open',
//     'z': 'mouth_little_open',
//     't': 'mouth_little_open',
//     'd': 'mouth_little_open',
//     'n': 'mouth_closed',
//     'l': 'mouth_little_open',
//     'r': 'mouth_little_open',
    
//     // Palatal and velar consonants
//     'sh': 'mouth_little_open',
//     'zh': 'mouth_little_open',
//     'ch': 'mouth_little_open',
//     'j': 'mouth_little_open',
//     'k': 'mouth_open',
//     'g': 'mouth_open',
//     'ng': 'mouth_closed',
//     'h': 'mouth_open',
    
//     // Glides
//     'w': 'mouth_o',
//     'y': 'mouth_e',
//   }), [])

//   // Advanced phoneme detection with context
//   const getPhonemeFromText = (text, index) => {
//     if (!text || index >= text.length) return 'sil'
    
//     const char = text[index]?.toLowerCase() || ''
//     const prevChar = text[index - 1]?.toLowerCase() || ''
//     const nextChar = text[index + 1]?.toLowerCase() || ''
//     const next2Char = text[index + 2]?.toLowerCase() || ''
    
//     // Punctuation
//     if (['.', '!', '?', ',', ';', ':'].includes(char)) {
//       return char === ',' ? 'sil' : 'sil'
//     }
    
//     // Spaces
//     if (char === ' ' || char === '\n' || char === '\t') return 'sil'
    
//     // Three-letter combinations (trigraphs)
//     if (char === 't' && nextChar === 'c' && next2Char === 'h') return 'ch'
//     if (char === 'd' && nextChar === 'g' && next2Char === 'e') return 'j'
    
//     // Two-letter combinations (digraphs)
//     const digraph = char + nextChar
//     const digraphMap = {
//       'th': 'th', 'sh': 'sh', 'ch': 'ch', 'ph': 'f',
//       'wh': 'w', 'ng': 'ng', 'gh': 'g',
//       'ee': 'ee', 'oo': 'oo', 'ea': 'ee', 'ou': 'au',
//       'ai': 'ai', 'ay': 'ay', 'oy': 'oy', 'ow': 'ow'
//     }
//     if (digraphMap[digraph]) return digraphMap[digraph]
    
//     // Special vowel rules
//     if ('aeiou'.includes(char)) {
//       // Silent 'e' rule
//       if (char === 'e' && index === text.length - 1) return 'sil'
//       if (char === 'e' && nextChar && !'aeiou'.includes(nextChar) && index === text.length - 2) return 'sil'
      
//       // Long vs short vowels
//       const nextNextChar = text[index + 2]?.toLowerCase() || ''
//       const isLongVowel = (nextChar && !'aeiou'.includes(nextChar) && nextNextChar === 'e') ||
//                           (nextChar === char) // double vowel
      
//       if (char === 'a') return isLongVowel ? 'ay' : 'aa'
//       if (char === 'e') return isLongVowel ? 'ee' : 'eh'
//       if (char === 'i') return isLongVowel ? 'ii' : 'i'
//       if (char === 'o') return isLongVowel ? 'oh' : 'o'
//       if (char === 'u') return isLongVowel ? 'uu' : 'uh'
//     }
    
//     // Consonants with context
//     if (char === 'c') {
//       // Soft 'c' before e, i, y
//       if ('eiy'.includes(nextChar)) return 's'
//       return 'k'
//     }
    
//     if (char === 'g') {
//       // Soft 'g' before e, i, y (sometimes)
//       if ('ei'.includes(nextChar) && Math.random() > 0.5) return 'j'
//       return 'g'
//     }
    
//     if (char === 'x') {
//       return index === 0 ? 'z' : 'ks'
//     }
    
//     if (char === 'y') {
//       // 'y' as consonant at start, vowel elsewhere
//       return index === 0 || prevChar === ' ' ? 'y' : 'i'
//     }
    
//     // Default: return the character if it's in our map
//     return phonemeToViseme[char] ? char : 'sil'
//   }

//   // Personality configurations
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3500,
//       speechSpeed: 90,
//       transitionSpeed: 120,
//       holdFrames: 2
//     },
//     friendly: {
//       blinkRate: 2500,
//       speechSpeed: 70,
//       transitionSpeed: 80,
//       holdFrames: 1
//     },
//     technical: {
//       blinkRate: 4500,
//       speechSpeed: 100,
//       transitionSpeed: 140,
//       holdFrames: 3
//     },
//     senior: {
//       blinkRate: 4000,
//       speechSpeed: 110,
//       transitionSpeed: 150,
//       holdFrames: 3
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Adjust speech animation speed based on speechRate
//   const adjustedSpeechSpeed = config.speechSpeed / speechRate

//   // Natural blinking with patterns
//   useEffect(() => {
//     const startBlinking = () => {
//       blinkIntervalRef.current = setInterval(() => {
//         const shouldDoubleBlink = Math.random() < 0.12
        
//         setBlinkState(true)
//         setTimeout(() => {
//           setBlinkState(false)
          
//           if (shouldDoubleBlink) {
//             setTimeout(() => {
//               setBlinkState(true)
//               setTimeout(() => setBlinkState(false), 100)
//             }, 180)
//           }
//         }, 120)
        
//       }, config.blinkRate + (Math.random() - 0.5) * 1000)
//     }

//     startBlinking()
//     return () => {
//       if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)
//     }
//   }, [config.blinkRate])

//   // Optimized mouth shape changes with holding
//   const changeMouthShape = (newMouthShape) => {
//     const mappedShape = mouthStateMapping[newMouthShape] || 'mouth_closed'
    
//     // Don't change if it's the same
//     if (lastMouthStateRef.current === mappedShape) return
    
//     const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//     setCurrentImageState(getImageName(emotion, eyeState, mappedShape))
//     lastMouthStateRef.current = mappedShape
//   }

//   // Speech animation with frame holding - now respects speechRate
//   useEffect(() => {
//     if (internalIsSpeaking && currentText && imagesPreloaded) {
//       let currentIndex = 0
//       let holdCounter = 0
//       let currentMouth = 'mouth_closed'
      
//       const animateText = () => {
//         if (currentIndex < currentText.length) {
//           // Hold current frame for stability
//           if (holdCounter > 0) {
//             holdCounter--
//             return
//           }
          
//           const phoneme = getPhonemeFromText(currentText, currentIndex)
//           const newMouth = phonemeToViseme[phoneme] || 'mouth_closed'
          
//           // Only change if different
//           if (newMouth !== currentMouth) {
//             changeMouthShape(newMouth)
//             currentMouth = newMouth
//             holdCounter = config.holdFrames
//           }
          
//           setTextIndex(currentIndex)
//           currentIndex++
//         } else {
//           // End of speech
//           changeMouthShape('mouth_closed')
//           currentIndex = 0
//           holdCounter = 0
//         }
//       }

//       textAnimationRef.current = setInterval(animateText, adjustedSpeechSpeed)
//     } else {
//       changeMouthShape('mouth_closed')
//       setTextIndex(0)
      
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }

//     return () => {
//       if (textAnimationRef.current) clearInterval(textAnimationRef.current)
//     }
//   }, [internalIsSpeaking, currentText, adjustedSpeechSpeed, config.holdFrames, emotion, imagesPreloaded])

//   // Update on blink without unnecessary changes
//   useEffect(() => {
//     const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//     const currentMouth = lastMouthStateRef.current
//     setCurrentImageState(getImageName(emotion, eyeState, currentMouth))
//   }, [blinkState, emotion])

//   // Subtle idle animations
//   useEffect(() => {
//     if (!internalIsSpeaking && !isLoading) {
//       const idleAnimation = setInterval(() => {
//         if (Math.random() < 0.3) {
//           changeMouthShape('mouth_little_open')
//           setTimeout(() => changeMouthShape('mouth_closed'), 400)
//         }
//       }, 12000 + Math.random() * 8000)

//       return () => clearInterval(idleAnimation)
//     }
//   }, [internalIsSpeaking, isLoading])

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-900">
//       {/* Loading state */}
//       {!imagesPreloaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
//           <div className="text-center">
//             <motion.div
//               className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <p className="text-white">Loading avatar images...</p>
//           </div>
//         </div>
//       )}

//       {/* Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           scale: internalIsSpeaking ? [1, 1.002, 1] : 1
//         }}
//         transition={{
//           scale: { 
//             duration: 1.2, 
//             repeat: internalIsSpeaking ? Infinity : 0,
//             ease: "easeInOut"
//           }
//         }}
//       >
//         {/* Avatar Image with minimal transitions */}
//         <div className="relative w-full h-full">
//           <AnimatePresence mode="sync" initial={false}>
//             <motion.div
//               key={currentImageState}
//               className="absolute inset-0"
//               initial={{ opacity: 0.95 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0.95 }}
//               transition={{ 
//                 duration: 0.05,
//                 ease: "linear"
//               }}
//             >
//               <Image
//                 src={`${imageBasePath}/${currentImageState}`}
//                 alt={`AI Avatar - ${emotion}`}
//                 fill
//                 className="object-cover object-center"
//                 priority
//                 quality={95}
//                 onError={(e) => {
//                   console.error(`Missing image: ${currentImageState}`)
//                   const fallback = `${imageBasePath}/neutral_eyes_open_mouth_closed.png`
//                   if (e.target.src !== fallback) {
//                     e.target.src = fallback
//                   }
//                 }}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* Subtle breathing effect */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/1 pointer-events-none"
//             animate={{
//               opacity: [0.05, 0.15, 0.05]
//             }}
//             transition={{
//               duration: 6,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* Status Indicators */}
//       <AnimatePresence>
//         {/* Speaking Indicator */}
//         {internalIsSpeaking && (
//           <motion.div
//             className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl"
//             initial={{ opacity: 0, scale: 0.8, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             transition={{ duration: 0.2 }}
//           >
//             {[...Array(5)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-1 bg-green-400 rounded-full"
//                 animate={{
//                   height: [4, Math.random() * 12 + 6, 4],
//                   opacity: [0.4, 1, 0.4]
//                 }}
//                 transition={{
//                   duration: 0.3 + Math.random() * 0.2,
//                   repeat: Infinity,
//                   delay: i * 0.06,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//             <div className="flex flex-col items-end ml-2">
//               <span className="text-white text-xs font-medium">Speaking</span>
//               {currentText && (
//                 <span className="text-green-300 text-xs font-mono">
//                   {getPhonemeFromText(currentText, textIndex)}
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs font-medium">Processing</span>
//           </motion.div>
//         )}

//         {/* Personality & Emotion Badge */}
//         <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
//           <div className="flex items-center space-x-2">
//             <span className="text-white text-xs font-medium capitalize">{personality}</span>
//             <span className="text-gray-400 text-xs">•</span>
//             <span className={`text-xs capitalize font-medium ${
//               emotion === 'happy' ? 'text-yellow-400' :
//               emotion === 'angry' ? 'text-red-400' :
//               'text-purple-400'
//             }`}>
//               {emotion}
//             </span>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         {internalIsSpeaking && currentText && (
//           <motion.div
//             className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl min-w-40"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-white text-xs font-medium">Progress</span>
//               <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
//                   animate={{
//                     width: `${(textIndex / currentText.length) * 100}%`
//                   }}
//                   transition={{ duration: 0.1, ease: "linear" }}
//                 />
//               </div>
//               <span className="text-gray-300 text-xs font-mono">
//                 {Math.round((textIndex / currentText.length) * 100)}%
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Emotion-based ambient lighting */}
//       <motion.div
//         className={`absolute inset-0 rounded-lg pointer-events-none ${
//           emotion === "happy" ? "bg-gradient-to-br from-yellow-400/3 via-transparent to-orange-400/3" :
//           emotion === "angry" ? "bg-gradient-to-br from-red-500/4 via-transparent to-orange-600/4" :
//           "bg-gradient-to-br from-purple-500/3 via-transparent to-blue-500/3"
//         }`}
//         animate={{
//           opacity: [0.15, 0.35, 0.15]
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />
//     </div>
//   )
// }



// "use client"

// import { useEffect, useRef, useState, useMemo } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function RealisticFaceAvatar({ 
//   speechRate = 0.9,
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0,
//   imageBasePath = "/images/avatar"
// }) {
//   const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
//   const [textIndex, setTextIndex] = useState(0)
//   const [blinkState, setBlinkState] = useState(false)
//   const blinkIntervalRef = useRef(null)
//   const textAnimationRef = useRef(null)
//   const lastMouthStateRef = useRef("mouth_closed")
//   const imagePreloadRef = useRef(new Set())
//   const [imagesPreloaded, setImagesPreloaded] = useState(false)

//   // Map available images to standardized mouth states
//   const mouthStateMapping = {
//     'mouth_closed': 'mouth_closed',
//     'mouth_rest': 'mouth_closed',
//     'mouth_little_open': 'mouth_little_open',
//     'mouth_open': 'mouth_open',
//     'mouth_a': 'mouth_a',
//     'mouth_aa': 'mouth_a',
//     'mouth_e': 'mouth_e',
//     'mouth_ee': 'mouth_e',
//     'mouth_i': 'mouth_i',
//     'mouth_ii': 'mouth_i',
//     'mouth_o': 'mouth_o',
//     'mouth_oh': 'mouth_o',
//     'mouth_oo': 'mouth_o',
//     'mouth_u': 'mouth_u',
//     'mouth_uu': 'mouth_u',
//     'mouth_b': 'mouth_closed',
//     'mouth_p': 'mouth_closed',
//     'mouth_m': 'mouth_closed',
//     'mouth_f': 'mouth_little_open',
//     'mouth_v': 'mouth_little_open',
//     'mouth_th': 'mouth_little_open',
//     'mouth_s': 'mouth_little_open',
//     'mouth_z': 'mouth_little_open',
//     'mouth_t': 'mouth_little_open',
//     'mouth_d': 'mouth_little_open',
//     'mouth_n': 'mouth_closed',
//     'mouth_l': 'mouth_little_open',
//     'mouth_r': 'mouth_little_open',
//     'mouth_k': 'mouth_open',
//     'mouth_g': 'mouth_open',
//     'mouth_w': 'mouth_o',
//     'mouth_y': 'mouth_e'
//   }

//   // Preload all avatar images
//   useEffect(() => {
//     const emotions = ['neutral', 'happy', 'angry']
//     const eyeStates = ['eyes_open', 'eyes_closed']
//     const mouthStates = ['mouth_closed', 'mouth_a', 'mouth_e', 'mouth_i', 'mouth_o', 'mouth_u', 'mouth_little_open', 'mouth_open']
    
//     const preloadImages = async () => {
//       const imagePromises = []
      
//       emotions.forEach(emo => {
//         eyeStates.forEach(eye => {
//           mouthStates.forEach(mouth => {
//             const imageName = `${emo}_${eye}_${mouth}.png`
//             const imagePath = `${imageBasePath}/${imageName}`
            
//             if (!imagePreloadRef.current.has(imagePath)) {
//               const img = new window.Image()
//               img.src = imagePath
//               imagePromises.push(
//                 new Promise((resolve) => {
//                   img.onload = () => {
//                     imagePreloadRef.current.add(imagePath)
//                     resolve()
//                   }
//                   img.onerror = () => resolve() // Continue even if image fails
//                 })
//               )
//             }
//           })
//         })
//       })
      
//       await Promise.all(imagePromises)
//       setImagesPreloaded(true)
//     }
    
//     preloadImages()
//   }, [imageBasePath])

//   // Enhanced image naming with .jpg extension
//   const getImageName = (emotion, eyeState, mouthState) => {

//     if(emotion !== 'neutral' && emotion !== 'happy' && emotion !== 'angry') {
//       emotion = 'neutral'
//     }
//     const mappedMouth = mouthStateMapping[mouthState] || 'mouth_closed'
//     return `${emotion}_${eyeState}_${mappedMouth}.png`
//   }

//   // Comprehensive phoneme to viseme mapping with linguistic rules
//   const phonemeToViseme = useMemo(() => ({
//     // Silence and pauses
//     'sil': 'mouth_closed',
//     ' ': 'mouth_closed',
//     '.': 'mouth_closed',
//     ',': 'mouth_rest',
//     '!': 'mouth_little_open',
//     '?': 'mouth_little_open',
    
//     // Vowels - Open sounds
//     'a': 'mouth_a',
//     'aa': 'mouth_a',
//     'ah': 'mouth_a',
    
//     // Vowels - Front/Smile sounds
//     'e': 'mouth_e',
//     'eh': 'mouth_e',
//     'i': 'mouth_i',
//     'ii': 'mouth_e',
//     'ee': 'mouth_e',
    
//     // Vowels - Back/Round sounds
//     'o': 'mouth_o',
//     'oh': 'mouth_o',
//     'oo': 'mouth_o',
//     'u': 'mouth_u',
//     'uu': 'mouth_u',
//     'uh': 'mouth_little_open',
    
//     // Diphthongs
//     'ai': 'mouth_a',
//     'ay': 'mouth_a',
//     'ey': 'mouth_e',
//     'oi': 'mouth_o',
//     'oy': 'mouth_o',
//     'au': 'mouth_o',
//     'aw': 'mouth_o',
//     'ow': 'mouth_o',
    
//     // Bilabial consonants (lips together)
//     'b': 'mouth_closed',
//     'p': 'mouth_closed',
//     'm': 'mouth_closed',
    
//     // Labiodental consonants (lip-teeth)
//     'f': 'mouth_little_open',
//     'v': 'mouth_little_open',
    
//     // Dental consonants (tongue-teeth)
//     'th': 'mouth_little_open',
//     'dh': 'mouth_little_open',
    
//     // Alveolar consonants (tongue-alveolar ridge)
//     's': 'mouth_little_open',
//     'z': 'mouth_little_open',
//     't': 'mouth_little_open',
//     'd': 'mouth_little_open',
//     'n': 'mouth_closed',
//     'l': 'mouth_little_open',
//     'r': 'mouth_little_open',
    
//     // Palatal and velar consonants
//     'sh': 'mouth_little_open',
//     'zh': 'mouth_little_open',
//     'ch': 'mouth_little_open',
//     'j': 'mouth_little_open',
//     'k': 'mouth_open',
//     'g': 'mouth_open',
//     'ng': 'mouth_closed',
//     'h': 'mouth_open',
    
//     // Glides
//     'w': 'mouth_o',
//     'y': 'mouth_e',
//   }), [])

//   // Advanced phoneme detection with context
//   const getPhonemeFromText = (text, index) => {
//     if (!text || index >= text.length) return 'sil'
    
//     const char = text[index]?.toLowerCase() || ''
//     const prevChar = text[index - 1]?.toLowerCase() || ''
//     const nextChar = text[index + 1]?.toLowerCase() || ''
//     const next2Char = text[index + 2]?.toLowerCase() || ''
    
//     // Punctuation
//     if (['.', '!', '?', ',', ';', ':'].includes(char)) {
//       return char === ',' ? 'sil' : 'sil'
//     }
    
//     // Spaces
//     if (char === ' ' || char === '\n' || char === '\t') return 'sil'
    
//     // Three-letter combinations (trigraphs)
//     if (char === 't' && nextChar === 'c' && next2Char === 'h') return 'ch'
//     if (char === 'd' && nextChar === 'g' && next2Char === 'e') return 'j'
    
//     // Two-letter combinations (digraphs)
//     const digraph = char + nextChar
//     const digraphMap = {
//       'th': 'th', 'sh': 'sh', 'ch': 'ch', 'ph': 'f',
//       'wh': 'w', 'ng': 'ng', 'gh': 'g',
//       'ee': 'ee', 'oo': 'oo', 'ea': 'ee', 'ou': 'au',
//       'ai': 'ai', 'ay': 'ay', 'oy': 'oy', 'ow': 'ow'
//     }
//     if (digraphMap[digraph]) return digraphMap[digraph]
    
//     // Special vowel rules
//     if ('aeiou'.includes(char)) {
//       // Silent 'e' rule
//       if (char === 'e' && index === text.length - 1) return 'sil'
//       if (char === 'e' && nextChar && !'aeiou'.includes(nextChar) && index === text.length - 2) return 'sil'
      
//       // Long vs short vowels
//       const nextNextChar = text[index + 2]?.toLowerCase() || ''
//       const isLongVowel = (nextChar && !'aeiou'.includes(nextChar) && nextNextChar === 'e') ||
//                           (nextChar === char) // double vowel
      
//       if (char === 'a') return isLongVowel ? 'ay' : 'aa'
//       if (char === 'e') return isLongVowel ? 'ee' : 'eh'
//       if (char === 'i') return isLongVowel ? 'ii' : 'i'
//       if (char === 'o') return isLongVowel ? 'oh' : 'o'
//       if (char === 'u') return isLongVowel ? 'uu' : 'uh'
//     }
    
//     // Consonants with context
//     if (char === 'c') {
//       // Soft 'c' before e, i, y
//       if ('eiy'.includes(nextChar)) return 's'
//       return 'k'
//     }
    
//     if (char === 'g') {
//       // Soft 'g' before e, i, y (sometimes)
//       if ('ei'.includes(nextChar) && Math.random() > 0.5) return 'j'
//       return 'g'
//     }
    
//     if (char === 'x') {
//       return index === 0 ? 'z' : 'ks'
//     }
    
//     if (char === 'y') {
//       // 'y' as consonant at start, vowel elsewhere
//       return index === 0 || prevChar === ' ' ? 'y' : 'i'
//     }
    
//     // Default: return the character if it's in our map
//     return phonemeToViseme[char] ? char : 'sil'
//   }

//   // Personality configurations
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3500,
//       speechSpeed: 90,
//       transitionSpeed: 120,
//       holdFrames: 2
//     },
//     friendly: {
//       blinkRate: 2500,
//       speechSpeed: 70,
//       transitionSpeed: 80,
//       holdFrames: 1
//     },
//     technical: {
//       blinkRate: 4500,
//       speechSpeed: 100,
//       transitionSpeed: 140,
//       holdFrames: 3
//     },
//     senior: {
//       blinkRate: 4000,
//       speechSpeed: 110,
//       transitionSpeed: 150,
//       holdFrames: 3
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Natural blinking with patterns
//   useEffect(() => {
//     const startBlinking = () => {
//       blinkIntervalRef.current = setInterval(() => {
//         const shouldDoubleBlink = Math.random() < 0.12
        
//         setBlinkState(true)
//         setTimeout(() => {
//           setBlinkState(false)
          
//           if (shouldDoubleBlink) {
//             setTimeout(() => {
//               setBlinkState(true)
//               setTimeout(() => setBlinkState(false), 100)
//             }, 180)
//           }
//         }, 120)
        
//       }, config.blinkRate + (Math.random() - 0.5) * 1000)
//     }

//     startBlinking()
//     return () => {
//       if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current)
//     }
//   }, [config.blinkRate])

//   // Optimized mouth shape changes with holding
//   const changeMouthShape = (newMouthShape) => {
//     const mappedShape = mouthStateMapping[newMouthShape] || 'mouth_closed'
    
//     // Don't change if it's the same
//     if (lastMouthStateRef.current === mappedShape) return
    
//     const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//     setCurrentImageState(getImageName(emotion, eyeState, mappedShape))
//     lastMouthStateRef.current = mappedShape
//   }

//   // Speech animation with frame holding
//   useEffect(() => {
//     if (isSpeaking && currentText && imagesPreloaded) {
//       let currentIndex = 0
//       let holdCounter = 0
//       let currentMouth = 'mouth_closed'
      
//       const animateText = () => {
//         if (currentIndex < currentText.length) {
//           // Hold current frame for stability
//           if (holdCounter > 0) {
//             holdCounter--
//             return
//           }
          
//           const phoneme = getPhonemeFromText(currentText, currentIndex)
//           const newMouth = phonemeToViseme[phoneme] || 'mouth_closed'
          
//           // Only change if different
//           if (newMouth !== currentMouth) {
//             changeMouthShape(newMouth)
//             currentMouth = newMouth
//             holdCounter = config.holdFrames
//           }
          
//           setTextIndex(currentIndex)
//           currentIndex++
//         } else {
//           // End of speech
//           changeMouthShape('mouth_closed')
//           currentIndex = 0
//           holdCounter = 0
//         }
//       }

//       textAnimationRef.current = setInterval(animateText, config.speechSpeed)
//     } else {
//       changeMouthShape('mouth_closed')
//       setTextIndex(0)
      
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }

//     return () => {
//       if (textAnimationRef.current) clearInterval(textAnimationRef.current)
//     }
//   }, [isSpeaking, currentText, config.speechSpeed, config.holdFrames, emotion, imagesPreloaded])

//   // Update on blink without unnecessary changes
//   useEffect(() => {
//     const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//     const currentMouth = lastMouthStateRef.current
//     setCurrentImageState(getImageName(emotion, eyeState, currentMouth))
//   }, [blinkState, emotion])

//   // Subtle idle animations
//   useEffect(() => {
//     if (!isSpeaking && !isLoading) {
//       const idleAnimation = setInterval(() => {
//         if (Math.random() < 0.3) {
//           changeMouthShape('mouth_little_open')
//           setTimeout(() => changeMouthShape('mouth_closed'), 400)
//         }
//       }, 12000 + Math.random() * 8000)

//       return () => clearInterval(idleAnimation)
//     }
//   }, [isSpeaking, isLoading])

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-900">
//       {/* Loading state */}
//       {!imagesPreloaded && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
//           <div className="text-center">
//             <motion.div
//               className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <p className="text-white">Loading avatar images...</p>
//           </div>
//         </div>
//       )}

//       {/* Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           scale: isSpeaking ? [1, 1.002, 1] : 1
//         }}
//         transition={{
//           scale: { 
//             duration: 1.2, 
//             repeat: isSpeaking ? Infinity : 0,
//             ease: "easeInOut"
//           }
//         }}
//       >
//         {/* Avatar Image with minimal transitions */}
//         <div className="relative w-full h-full">
//           <AnimatePresence mode="sync" initial={false}>
//             <motion.div
//               key={currentImageState}
//               className="absolute inset-0"
//               initial={{ opacity: 0.95 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0.95 }}
//               transition={{ 
//                 duration: 0.05,
//                 ease: "linear"
//               }}
//             >
//               <Image
//                 src={`${imageBasePath}/${currentImageState}`}
//                 alt={`AI Avatar - ${emotion}`}
//                 fill
//                 className="object-cover object-center"
//                 priority
//                 quality={95}
//                 onError={(e) => {
//                   console.error(`Missing image: ${currentImageState}`)
//                   const fallback = `${imageBasePath}/neutral_eyes_open_mouth_closed.png`
//                   if (e.target.src !== fallback) {
//                     e.target.src = fallback
//                   }
//                 }}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* Subtle breathing effect */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/1 pointer-events-none"
//             animate={{
//               opacity: [0.05, 0.15, 0.05]
//             }}
//             transition={{
//               duration: 6,
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
//             className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl"
//             initial={{ opacity: 0, scale: 0.8, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             transition={{ duration: 0.2 }}
//           >
//             {[...Array(5)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-1 bg-green-400 rounded-full"
//                 animate={{
//                   height: [4, Math.random() * 12 + 6, 4],
//                   opacity: [0.4, 1, 0.4]
//                 }}
//                 transition={{
//                   duration: 0.3 + Math.random() * 0.2,
//                   repeat: Infinity,
//                   delay: i * 0.06,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//             <div className="flex flex-col items-end ml-2">
//               <span className="text-white text-xs font-medium">Speaking</span>
//               {currentText && (
//                 <span className="text-green-300 text-xs font-mono">
//                   {getPhonemeFromText(currentText, textIndex)}
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs font-medium">Processing</span>
//           </motion.div>
//         )}

//         {/* Personality & Emotion Badge */}
//         <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl">
//           <div className="flex items-center space-x-2">
//             <span className="text-white text-xs font-medium capitalize">{personality}</span>
//             <span className="text-gray-400 text-xs">•</span>
//             <span className={`text-xs capitalize font-medium ${
//               emotion === 'happy' ? 'text-yellow-400' :
//               emotion === 'angry' ? 'text-red-400' :
//               'text-purple-400'
//             }`}>
//               {emotion}
//             </span>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         {isSpeaking && currentText && (
//           <motion.div
//             className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-xl min-w-40"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-white text-xs font-medium">Progress</span>
//               <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
//                   animate={{
//                     width: `${(textIndex / currentText.length) * 100}%`
//                   }}
//                   transition={{ duration: 0.1, ease: "linear" }}
//                 />
//               </div>
//               <span className="text-gray-300 text-xs font-mono">
//                 {Math.round((textIndex / currentText.length) * 100)}%
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Emotion-based ambient lighting */}
//       <motion.div
//         className={`absolute inset-0 rounded-lg pointer-events-none ${
//           emotion === "happy" ? "bg-gradient-to-br from-yellow-400/3 via-transparent to-orange-400/3" :
//           emotion === "angry" ? "bg-gradient-to-br from-red-500/4 via-transparent to-orange-600/4" :
//           "bg-gradient-to-br from-purple-500/3 via-transparent to-blue-500/3"
//         }`}
//         animate={{
//           opacity: [0.15, 0.35, 0.15]
//         }}
//         transition={{
//           duration: 10,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />

//       {/* Development Debug Info */}
//       {false && process.env.NODE_ENV === 'development' && currentText && (
//         <div className="absolute top-20 left-4 bg-black/95 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs shadow-xl border border-gray-700">
//           <div className="text-white text-xs space-y-1.5">
//             <div className="font-semibold text-green-400 border-b border-gray-700 pb-1">
//               Speech Analysis Debug
//             </div>
//             <div className="space-y-1">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Char:</span>
//                 <span className="font-mono text-green-300">
//                   "{currentText[textIndex] || ''}"
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Phoneme:</span>
//                 <span className="font-mono text-blue-300">
//                   {getPhonemeFromText(currentText, textIndex)}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Viseme:</span>
//                 <span className="font-mono text-purple-300">
//                   {phonemeToViseme[getPhonemeFromText(currentText, textIndex)]}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Mapped:</span>
//                 <span className="font-mono text-yellow-300 text-xs">
//                   {lastMouthStateRef.current}
//                 </span>
//               </div>
//               <div className="border-t border-gray-700 pt-1 mt-1">
//                 <span className="text-gray-400 text-xs">Image:</span>
//                 <div className="font-mono text-xs text-gray-300 break-all mt-0.5">
//                   {currentImageState}
//                 </div>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Index:</span>
//                 <span className="font-mono text-gray-300">
//                   {textIndex}/{currentText.length}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Speed:</span>
//                 <span className="font-mono text-gray-300">
//                   {config.speechSpeed}ms
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Hold:</span>
//                 <span className="font-mono text-gray-300">
//                   {config.holdFrames}f
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Context Display for Debugging */}
//       {false && process.env.NODE_ENV === 'development' && currentText && textIndex > 0 && (
//         <div className="absolute bottom-20 left-4 bg-black/95 backdrop-blur-sm rounded-lg px-3 py-2 max-w-md shadow-xl border border-gray-700">
//           <div className="text-xs">
//             <div className="text-gray-400 mb-1">Text Context:</div>
//             <div className="font-mono text-white">
//               <span className="text-gray-500">
//                 {currentText.substring(Math.max(0, textIndex - 10), textIndex)}
//               </span>
//               <span className="bg-green-600 px-1 rounded">
//                 {currentText[textIndex]}
//               </span>
//               <span className="text-gray-400">
//                 {currentText.substring(textIndex + 1, Math.min(currentText.length, textIndex + 11))}
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function RealisticFaceAvatar({ 
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0,
//   imageBasePath = "/images/avatar"
// }) {
//   const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
//   const [textIndex, setTextIndex] = useState(0)
//   const [blinkState, setBlinkState] = useState(false)
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const blinkIntervalRef = useRef(null)
//   const speechAnimationRef = useRef(null)
//   const textAnimationRef = useRef(null)
//   const lastMouthStateRef = useRef("mouth_closed")
//   const transitionTimeoutRef = useRef(null)

//   // Enhanced image naming convention with more mouth positions
//   const getImageName = (emotion, eyeState, mouthState) => {
//     return `${emotion}_${eyeState}_${mouthState}.png`
//   }

//   // Simplified 8-viseme system (Disney standard) - much easier to source images!
//   const phonemeToViseme = {
//     // VISEME A - Rest position (closed mouth)
//     'sil': 'mouth_rest',
//     ' ': 'mouth_rest',
//     '.': 'mouth_rest',
//     ',': 'mouth_rest',
    
//     // VISEME B - Wide open (A, I sounds)  
//     'a': 'mouth_a',      
//     'aa': 'mouth_a',     
//     'i': 'mouth_a',
//     'ih': 'mouth_a',
//     'ai': 'mouth_a',
    
//     // VISEME C - Narrow/smile (E, EE sounds)
//     'e': 'mouth_e',      
//     'eh': 'mouth_e',
//     'ii': 'mouth_e',
//     'y': 'mouth_e',
    
//     // VISEME D - Round/oval (O, U sounds)
//     'o': 'mouth_o',      
//     'oh': 'mouth_o',
//     'u': 'mouth_o',
//     'uu': 'mouth_o',
//     'w': 'mouth_o',
//     'au': 'mouth_o',
//     'oi': 'mouth_o',
    
//     // VISEME E - Lip closure (B, P, M)
//     'b': 'mouth_b',      
//     'p': 'mouth_b',      
//     'm': 'mouth_b',
    
//     // VISEME F - Lip/teeth contact (F, V)
//     'f': 'mouth_f',      
//     'v': 'mouth_f',
    
//     // VISEME G - Tongue/teeth (TH, S, Z, T, D, N, L)
//     'th': 'mouth_th',
//     'dh': 'mouth_th',
//     's': 'mouth_th',
//     'z': 'mouth_th',
//     't': 'mouth_th',
//     'd': 'mouth_th',
//     'n': 'mouth_th',
//     'l': 'mouth_th',
//     'r': 'mouth_th',
    
//     // VISEME H - Back consonants (K, G, NG, SH, CH)
//     'k': 'mouth_k',
//     'g': 'mouth_k',
//     'ng': 'mouth_k',
//     'sh': 'mouth_k',
//     'zh': 'mouth_k',
//     'ch': 'mouth_k',
//     'j': 'mouth_k',
//     'h': 'mouth_k',
//   }

//   // Coarticulation rules - how sounds blend into each other
//   const coarticulationRules = {
//     // Coming from bilabial sounds
//     'mouth_b': {
//       'mouth_a': 'mouth_ba', 
//       'mouth_i': 'mouth_bi',
//       'mouth_u': 'mouth_bu'
//     },
//     // Coming from vowels to consonants
//     'mouth_a': {
//       'mouth_b': 'mouth_ab',
//       'mouth_t': 'mouth_at', 
//       'mouth_s': 'mouth_as'
//     },
//     'mouth_i': {
//       'mouth_t': 'mouth_it',
//       'mouth_s': 'mouth_is'
//     }
//     // Add more coarticulation rules as needed
//   }

//   // Improved phoneme detection from text
//   const getPhonemeFromText = (text, index) => {
//     const char = text[index]?.toLowerCase() || ''
//     const prevChar = text[index - 1]?.toLowerCase() || ''
//     const nextChar = text[index + 1]?.toLowerCase() || ''
//     const context = text.substring(Math.max(0, index - 2), index + 3).toLowerCase()
    
//     // Handle common digraphs and trigraphs first
//     if (char === 't' && nextChar === 'h') return 'th'
//     if (char === 's' && nextChar === 'h') return 'sh'
//     if (char === 'c' && nextChar === 'h') return 'ch'
//     if (char === 'n' && nextChar === 'g') return 'ng'
    
//     // Vowel context analysis
//     if ('aeiou'.includes(char)) {
//       // Double vowels
//       if (char === nextChar) {
//         if (char === 'e') return 'ii'
//         if (char === 'o') return 'oo' 
//         return char + char
//       }
      
//       // Common diphthongs
//       if (char === 'a' && 'iy'.includes(nextChar)) return 'ai'
//       if (char === 'a' && 'uw'.includes(nextChar)) return 'au'  
//       if (char === 'o' && nextChar === 'i') return 'oi'
      
//       // Long vs short vowels (simplified)
//       if (char === 'a') {
//         // "father" type vs "cat" type
//         return context.includes('r') ? 'aa' : 'a'
//       }
//       if (char === 'e') {
//         // "beet" vs "bet"  
//         return nextChar === 'e' || context.match(/e[^aeiou]*e/) ? 'ii' : 'e'
//       }
//       if (char === 'i') {
//         return nextChar === 'e' || context.includes('igh') ? 'ii' : 'i'
//       }
//       if (char === 'o') {
//         return nextChar === 'o' || context.includes('oa') ? 'oh' : 'o'
//       }
//       if (char === 'u') {
//         return nextChar === 'e' || context.includes('oo') ? 'uu' : 'u'
//       }
//     }
    
//     // Return the character or silence
//     return phonemeToViseme[char] ? char : (char.match(/[a-z]/) ? char : 'sil')
//   }

//   // Get mouth shape with coarticulation consideration
//   const getMouthShapeForIndex = (text, index) => {
//     const currentPhoneme = getPhonemeFromText(text, index)
//     const prevPhoneme = index > 0 ? getPhonemeFromText(text, index - 1) : 'sil'
    
//     let currentViseme = phonemeToViseme[currentPhoneme] || 'mouth_closed'
//     const prevViseme = phonemeToViseme[prevPhoneme] || 'mouth_closed'
    
//     // Apply coarticulation if rules exist
//     if (coarticulationRules[prevViseme] && coarticulationRules[prevViseme][currentViseme]) {
//       currentViseme = coarticulationRules[prevViseme][currentViseme]
//     }
    
//     return currentViseme
//   }

//   // Personality-based configurations with more realistic timing
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3000,
//       speechSpeed: 85,        // Slower, more deliberate
//       transitionSpeed: 60,    // Smooth transitions
//       expressionIntensity: 0.7,
//       anticipationFrames: 2   // Look ahead for smoother animation
//     },
//     friendly: {
//       blinkRate: 2200,
//       speechSpeed: 75,        // Faster, more animated
//       transitionSpeed: 50,
//       expressionIntensity: 0.9,
//       anticipationFrames: 2
//     },
//     technical: {
//       blinkRate: 4200,
//       speechSpeed: 95,        // More measured
//       transitionSpeed: 70,
//       expressionIntensity: 0.6,
//       anticipationFrames: 3
//     },
//     senior: {
//       blinkRate: 3800,
//       speechSpeed: 105,       // More deliberate
//       transitionSpeed: 80,
//       expressionIntensity: 0.8,
//       anticipationFrames: 3
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Enhanced blinking with more natural patterns
//   useEffect(() => {
//     const startBlinking = () => {
//       blinkIntervalRef.current = setInterval(() => {
//         // Natural blink patterns - sometimes double blinks
//         const shouldDoubleBlink = Math.random() < 0.15
        
//         setBlinkState(true)
//         setTimeout(() => {
//           setBlinkState(false)
          
//           if (shouldDoubleBlink) {
//             setTimeout(() => {
//               setBlinkState(true)
//               setTimeout(() => setBlinkState(false), 120)
//             }, 200)
//           }
//         }, 150 + Math.random() * 50) // Variable blink duration
        
//       }, config.blinkRate + (Math.random() - 0.5) * 2000) // More natural randomness
//     }

//     startBlinking()
//     return () => {
//       if (blinkIntervalRef.current) {
//         clearInterval(blinkIntervalRef.current)
//       }
//     }
//   }, [config.blinkRate])

//   // Smooth mouth shape transitions
//   const smoothTransitionTo = (newMouthShape, force = false) => {
//     const currentMouth = lastMouthStateRef.current
    
//     // Don't change if it's the same (reduces flickering)
//     if (currentMouth === newMouthShape && !force) return
    
//     // Clear any pending transition
//     if (transitionTimeoutRef.current) {
//       clearTimeout(transitionTimeoutRef.current)
//     }
    
//     // Immediate change for large differences, transition for similar shapes
//     const shouldTransition = !force && areSimilarMouthShapes(currentMouth, newMouthShape)
    
//     if (shouldTransition) {
//       setIsTransitioning(true)
//       // Brief transition state if needed
//       transitionTimeoutRef.current = setTimeout(() => {
//         const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//         setCurrentImageState(getImageName(emotion, eyeState, newMouthShape))
//         lastMouthStateRef.current = newMouthShape
//         setIsTransitioning(false)
//       }, config.transitionSpeed / 2)
//     } else {
//       const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//       setCurrentImageState(getImageName(emotion, eyeState, newMouthShape))
//       lastMouthStateRef.current = newMouthShape
//     }
//   }

//   // Helper function to determine if mouth shapes are similar
//   const areSimilarMouthShapes = (shape1, shape2) => {
//     const similarGroups = [
//       ['mouth_a', 'mouth_aa', 'mouth_ai'],
//       ['mouth_i', 'mouth_ii', 'mouth_y'],
//       ['mouth_u', 'mouth_uu', 'mouth_w'],
//       ['mouth_o', 'mouth_oh', 'mouth_au'],
//       ['mouth_b', 'mouth_p', 'mouth_m'],
//       ['mouth_s', 'mouth_z', 'mouth_t', 'mouth_d'],
//       ['mouth_f', 'mouth_v'],
//       ['mouth_closed', 'mouth_n', 'mouth_l']
//     ]
    
//     return similarGroups.some(group => 
//       group.includes(shape1) && group.includes(shape2)
//     )
//   }

//   // Enhanced speech animation with lookahead
//   useEffect(() => {
//     if (isSpeaking && currentText) {
//       let currentIndex = 0
      
//       const animateText = () => {
//         if (currentIndex < currentText.length) {
//           // Get current and next mouth shapes for smoother animation
//           const currentMouthShape = getMouthShapeForIndex(currentText, currentIndex)
//           const nextMouthShape = currentIndex < currentText.length - 1 
//             ? getMouthShapeForIndex(currentText, currentIndex + 1) 
//             : 'mouth_closed'
          
//           // Anticipatory animation - slight influence from next shape
//           let finalMouthShape = currentMouthShape
//           if (config.anticipationFrames > 0 && currentIndex % config.anticipationFrames === 0) {
//             // Blend current and next for smoother transitions
//             finalMouthShape = currentMouthShape
//           }
          
//           smoothTransitionTo(finalMouthShape)
//           setTextIndex(currentIndex)
//           currentIndex++
//         } else {
//           // End of speech - return to neutral
//           smoothTransitionTo('mouth_closed', true)
//           currentIndex = 0
//         }
//       }

//       textAnimationRef.current = setInterval(animateText, config.speechSpeed)
//     } else {
//       // Not speaking - ensure closed mouth
//       smoothTransitionTo('mouth_closed', true)
//       setTextIndex(0)
      
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }

//     return () => {
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//       if (transitionTimeoutRef.current) {
//         clearTimeout(transitionTimeoutRef.current)
//       }
//     }
//   }, [isSpeaking, currentText, config.speechSpeed, config.anticipationFrames, emotion])

//   // Update image when blink state changes (maintain current mouth position)
//   useEffect(() => {
//     const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//     const currentMouth = lastMouthStateRef.current
//     setCurrentImageState(getImageName(emotion, eyeState, currentMouth))
//   }, [blinkState, emotion])

//   // More subtle idle animations
//   useEffect(() => {
//     if (!isSpeaking && !isLoading) {
//       const idleAnimation = setInterval(() => {
//         // Very subtle mouth movements
//         const subtleVariations = ['mouth_closed', 'mouth_rest', 'mouth_slight_smile']
//         const randomMouth = subtleVariations[Math.floor(Math.random() * subtleVariations.length)]
        
//         smoothTransitionTo(randomMouth)
        
//         // Return to neutral after a moment
//         setTimeout(() => {
//           smoothTransitionTo('mouth_closed')
//         }, 800 + Math.random() * 400)
        
//       }, 8000 + Math.random() * 15000) // Less frequent, more natural

//       return () => clearInterval(idleAnimation)
//     }
//   }, [isSpeaking, isLoading, emotion])

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//       {/* Main Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           scale: isSpeaking ? [1, 1.005, 1] : 1 // Much more subtle breathing
//         }}
//         transition={{
//           scale: { 
//             duration: 0.8, 
//             repeat: isSpeaking ? Infinity : 0,
//             ease: "easeInOut"
//           }
//         }}
//       >
//         {/* Dynamic Avatar Image with smoother transitions */}
//         <div className="relative w-full h-full">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentImageState}
//               className="relative w-full h-full"
//               initial={{ opacity: 0.8 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0.8 }}
//               transition={{ 
//                 duration: isTransitioning ? 0.03 : 0.08, // Very fast but not jarring
//                 ease: "easeInOut"
//               }}
//             >
//               <Image
//                 src={`${imageBasePath}/${currentImageState}`}
//                 alt={`AI Avatar - ${emotion} - ${currentImageState}`}
//                 fill
//                 className="object-cover object-center rounded-lg"
//                 priority
//                 onError={(e) => {
//                   console.log(`Missing image: ${currentImageState}, falling back to neutral`)
//                   e.target.src = `${imageBasePath}/neutral_eyes_open_mouth_closed.png`
//                 }}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* More subtle breathing overlay */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/2"
//             animate={{
//               opacity: [0.1, 0.2, 0.1]
//             }}
//             transition={{
//               duration: 5,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* Enhanced Status Indicators */}
//       <AnimatePresence>
//         {/* Speaking Indicator with Phoneme Display */}
//         {isSpeaking && (
//           <motion.div
//             className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             {/* More realistic audio visualizer */}
//             {[...Array(5)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-0.5 bg-green-400 rounded-full"
//                 animate={{
//                   height: [3, Math.random() * 15 + 5, 3],
//                   opacity: [0.3, 1, 0.3]
//                 }}
//                 transition={{
//                   duration: 0.2 + Math.random() * 0.3,
//                   repeat: Infinity,
//                   delay: i * 0.05,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//             <div className="flex flex-col items-end">
//               <span className="text-white text-xs">Speaking</span>
//               {currentText && (
//                 <span className="text-green-300 text-xs font-mono">
//                   Phoneme: {getPhonemeFromText(currentText, textIndex)}
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Rest of the status indicators remain the same */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs">Processing</span>
//           </motion.div>
//         )}

//         <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
//           <div className="flex items-center space-x-2">
//             <span className="text-white text-xs font-medium capitalize">{personality}</span>
//             <span className="text-gray-300 text-xs">•</span>
//             <span className="text-white text-xs capitalize">{emotion}</span>
//           </div>
//         </div>

//         {isSpeaking && currentText && (
//           <motion.div
//             className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-white text-xs">Progress</span>
//               <div className="w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-green-400 rounded-full"
//                   animate={{
//                     width: `${(textIndex / currentText.length) * 100}%`
//                   }}
//                   transition={{ duration: 0.1, ease: "easeOut" }}
//                 />
//               </div>
//               <span className="text-gray-300 text-xs">
//                 {Math.round((textIndex / currentText.length) * 100)}%
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* More subtle emotion-based ambient lighting */}
//       <motion.div
//         className={`absolute inset-0 rounded-lg ${
//           emotion === "happy" ? "bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5" :
//           emotion === "sad" ? "bg-gradient-to-br from-blue-500/5 via-transparent to-gray-500/5" :
//           emotion === "angry" ? "bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" :
//           emotion === "surprised" ? "bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" :
//           emotion === "thinking" ? "bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5" :
//           "bg-gradient-to-br from-purple-500/4 via-transparent to-blue-500/4"
//         }`}
//         animate={{
//           opacity: [0.2, 0.4, 0.2]
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />

//       {/* Development debug info */}
//       {process.env.NODE_ENV === 'development' && currentText && (
//         <div className="absolute top-16 left-4 bg-black/90 backdrop-blur-sm rounded px-3 py-2 max-w-sm">
//           <div className="text-white text-xs space-y-1">
//             <div className="font-semibold">Speech Analysis:</div>
//             <div className="font-mono text-xs">
//               Current: "{currentText[textIndex] || ''}" → {getPhonemeFromText(currentText, textIndex)}
//             </div>
//             <div className="font-mono text-xs">
//               Viseme: {getMouthShapeForIndex(currentText, textIndex)}
//             </div>
//             <div className="text-gray-400 text-xs">
//               Image: {currentImageState}
//             </div>
//             <div className="text-gray-400 text-xs">
//               Transition: {isTransitioning ? "Yes" : "No"}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function DynamicFaceAvatar({ 
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0,
//   imageBasePath = "/images/avatar" // Base path for your images
// }) {
//   const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
//   const [textIndex, setTextIndex] = useState(0)
//   const [blinkState, setBlinkState] = useState(false)
//   const blinkIntervalRef = useRef(null)
//   const speechAnimationRef = useRef(null)
//   const textAnimationRef = useRef(null)

//   // Image naming convention mapping
//   // Assumes images are named like: "happy_eyes_open_mouth_closed.jpg", "sad_eyes_closed_mouth_a.jpg", etc.
//   const getImageName = (emotion, eyeState, mouthState) => {
//     return `${"neutral"}_${eyeState}_${mouthState}.png`
//   }

//   // Vowel to mouth shape mapping
//   const vowelToMouthShape = {
//     'a': 'mouth_a',
//     'e': 'mouth_e', 
//     'i': 'mouth_i',
//     'o': 'mouth_o',
//     'u': 'mouth_u',
//     ' ': 'mouth_closed', // Space = closed mouth
//     '.': 'mouth_closed',
//     ',': 'mouth_closed',
//     '!': 'mouth_open',
//     '?': 'mouth_little_open'
//   }

//   // Consonant to mouth shape mapping (simplified)
//   const consonantToMouthShape = {
//     'b': 'mouth_closed', 'p': 'mouth_closed', 'm': 'mouth_closed',
//     'f': 'mouth_little_open', 'v': 'mouth_little_open',
//     'th': 'mouth_little_open', 'd': 'mouth_little_open', 't': 'mouth_little_open',
//     'l': 'mouth_little_open', 'n': 'mouth_little_open', 's': 'mouth_little_open',
//     'r': 'mouth_open', 'k': 'mouth_open', 'g': 'mouth_open',
//     'w': 'mouth_u', 'y': 'mouth_i'
//   }

//   // Personality-based configurations
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3000,
//       speechSpeed: 120, // ms per character
//       expressionIntensity: 0.7
//     },
//     friendly: {
//       blinkRate: 2500,
//       speechSpeed: 100,
//       expressionIntensity: 0.9
//     },
//     technical: {
//       blinkRate: 4000,
//       speechSpeed: 150,
//       expressionIntensity: 0.6
//     },
//     senior: {
//       blinkRate: 3500,
//       speechSpeed: 130,
//       expressionIntensity: 0.8
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Get mouth shape for current character
//   const getMouthShapeForChar = (char) => {
//     const lowerChar = char.toLowerCase()
    
//     // Check vowels first
//     if (vowelToMouthShape[lowerChar]) {
//       return vowelToMouthShape[lowerChar]
//     }
    
//     // Check consonants
//     for (const [consonant, shape] of Object.entries(consonantToMouthShape)) {
//       if (lowerChar === consonant || (consonant.length > 1 && currentText.toLowerCase().includes(consonant))) {
//         return shape
//       }
//     }
    
//     // Default for other characters
//     if (/[bcdfghjklmnpqrstvwxyz]/.test(lowerChar)) {
//       return 'mouth_little_open'
//     }
    
//     return 'mouth_closed'
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
//       let currentIndex = 0
      
//       const animateText = () => {
//         if (currentIndex < currentText.length) {
//           const currentChar = currentText[currentIndex]
//           const mouthShape = getMouthShapeForChar(currentChar)
//           const eyeState = blinkState ? "eyes_closed" : "eyes_open"
          
//           setCurrentImageState(getImageName(emotion, eyeState, mouthShape))
//           setTextIndex(currentIndex)
//           currentIndex++
//         } else {
//           // Reset to neutral when done
//           const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//           setCurrentImageState(getImageName(emotion, eyeState, "mouth_closed"))
//           currentIndex = 0 // Loop or stop
//         }
//       }

//       textAnimationRef.current = setInterval(animateText, config.speechSpeed)
//     } else {
//       // Not speaking - set to neutral/closed mouth
//       const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//       setCurrentImageState(getImageName(emotion, eyeState, "mouth_closed"))
//       setTextIndex(0)
      
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }

//     return () => {
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }
//   }, [isSpeaking, currentText, config.speechSpeed, emotion])

//   // Update image when blink state changes
//   useEffect(() => {
//     if (!isSpeaking) {
//       const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//       setCurrentImageState(getImageName(emotion, eyeState, "mouth_closed"))
//     } else if (currentText) {
//       const currentChar = currentText[textIndex] || ' '
//       const mouthShape = getMouthShapeForChar(currentChar)
//       const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//       setCurrentImageState(getImageName(emotion, eyeState, mouthShape))
//     }
//   }, [blinkState, emotion, isSpeaking, currentText, textIndex])

//   // Random idle animations when not speaking
//   useEffect(() => {
//     if (!isSpeaking && !isLoading) {
//       const idleAnimation = setInterval(() => {
//         // Occasionally change to slight variations even when idle
//         const variations = ['mouth_closed', 'mouth_little_open']
//         const randomMouth = variations[Math.floor(Math.random() * variations.length)]
//         const eyeState = blinkState ? "eyes_closed" : "eyes_open"
        
//         setCurrentImageState(getImageName(emotion, eyeState, randomMouth))
        
//         // Reset to closed mouth after a brief moment
//         setTimeout(() => {
//           const currentEyeState = blinkState ? "eyes_closed" : "eyes_open"
//           setCurrentImageState(getImageName(emotion, currentEyeState, "mouth_closed"))
//         }, 200)
//       }, 5000 + Math.random() * 10000) // Random idle movements every 5-15 seconds

//       return () => clearInterval(idleAnimation)
//     }
//   }, [isSpeaking, isLoading, emotion, blinkState])

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//       {/* Main Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           scale: isSpeaking ? [1, 1.01, 1] : 1
//         }}
//         transition={{
//           scale: { duration: 0.5, repeat: isSpeaking ? Infinity : 0 }
//         }}
//       >
//         {/* Dynamic Avatar Image */}
//         <div className="relative w-full h-full">
//           <AnimatePresence mode="wait">
//             <motion.div
               
//               className="relative w-full h-full"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.05 }} // Very fast transitions for smooth speech
//             >
//               <Image
//                 src={`${imageBasePath}/${currentImageState}`}
//                 alt={`AI Avatar - ${emotion} - ${currentImageState}`}
//                 fill
//                 className="object-cover object-center rounded-lg"
//                 priority
//                 // Add error handling for missing images
//                 onError={(e) => {
//                   // Fallback to neutral image if specific image doesn't exist
//                   e.target.src = `${imageBasePath}/neutral_eyes_open_mouth_closed.jpg`
//                 }}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* Breathing Animation Overlay */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/3"
//             animate={{
//               opacity: [0.2, 0.4, 0.2]
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
//         {/* Speaking Indicator with Current Character */}
//         {isSpeaking && (
//           <motion.div
//             className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             {/* Audio visualizer bars */}
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
//             <div className="flex flex-col items-end">
//               <span className="text-white text-xs">Speaking</span>
//               {currentText && (
//                 <span className="text-green-300 text-xs font-mono">
//                   "{currentText[textIndex] || ''}"
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Loading Indicator */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs">Processing</span>
//           </motion.div>
//         )}

//         {/* Emotion & Personality Badge */}
//         <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
//           <div className="flex items-center space-x-2">
//             <span className="text-white text-xs font-medium capitalize">{personality}</span>
//             <span className="text-gray-300 text-xs">•</span>
//             <span className="text-white text-xs capitalize">{emotion}</span>
//           </div>
//         </div>

//         {/* Speech Progress Bar */}
//         {isSpeaking && currentText && (
//           <motion.div
//             className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-white text-xs">Progress</span>
//               <div className="w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-green-400 rounded-full"
//                   animate={{
//                     width: `${(textIndex / currentText.length) * 100}%`
//                   }}
//                   transition={{ duration: 0.1 }}
//                 />
//               </div>
//               <span className="text-gray-300 text-xs">
//                 {Math.round((textIndex / currentText.length) * 100)}%
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Emotion-based Ambient Lighting */}
//       <motion.div
//         className={`absolute inset-0 rounded-lg ${
//           emotion === "happy" ? "bg-gradient-to-br from-yellow-500/10 via-transparent to-orange-500/10" :
//           emotion === "sad" ? "bg-gradient-to-br from-blue-500/10 via-transparent to-gray-500/10" :
//           emotion === "angry" ? "bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10" :
//           emotion === "surprised" ? "bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" :
//           emotion === "thinking" ? "bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" :
//           "bg-gradient-to-br from-purple-500/8 via-transparent to-blue-500/8" // neutral
//         }`}
//         animate={{
//           opacity: [0.3, 0.6, 0.3]
//         }}
//         transition={{
//           duration: 6,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />

//       {/* Current Text Display (Debug/Development) */}
//       {false && process.env.NODE_ENV === 'development' && currentText && (
//         <div className="absolute top-16 left-4 bg-black/80 backdrop-blur-sm rounded px-3 py-1 max-w-xs">
//           <div className="text-white text-xs">
//             <div className="font-semibold">Current Text:</div>
//             <div className="font-mono break-words">
//               {currentText.split('').map((char, index) => (
//                 <span
//                   key={index}
//                   className={index === textIndex ? 'bg-green-400 text-black' : ''}
//                 >
//                   {char === ' ' ? '␣' : char}
//                 </span>
//               ))}
//             </div>
//             <div className="text-gray-400 text-xs mt-1">
//               Image: {currentImageState}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import Image from "next/image"

// export default function RealisticFaceAvatar({ 
//   personality = "professional", 
//   isSpeaking = false, 
//   isLoading = false,
//   emotion = "neutral",
//   eyeDirection = "center",
//   currentText = "",
//   speechProgress = 0,
//   imageBasePath = "/images/avatar"
// }) {
//   const [currentImageState, setCurrentImageState] = useState("neutral_eyes_open_mouth_closed")
//   const [textIndex, setTextIndex] = useState(0)
//   const [blinkState, setBlinkState] = useState(false)
//   const [isTransitioning, setIsTransitioning] = useState(false)
//   const blinkIntervalRef = useRef(null)
//   const speechAnimationRef = useRef(null)
//   const textAnimationRef = useRef(null)
//   const lastMouthStateRef = useRef("mouth_closed")
//   const transitionTimeoutRef = useRef(null)

//   // Enhanced image naming convention with more mouth positions
//   const getImageName = (emotion, eyeState, mouthState) => {
//     return `${emotion}_${eyeState}_${mouthState}.png`
//   }

//   // More detailed phoneme to viseme mapping (based on real speech animation)
//   const phonemeToViseme = {
//     // Silence and pauses
//     'sil': 'mouth_closed',
//     ' ': 'mouth_closed',
//     '.': 'mouth_closed',
//     ',': 'mouth_closed',
    
//     // Vowels - primary mouth shapes
//     'a': 'mouth_a',      // "cat", "bat" - wide open
//     'aa': 'mouth_a',     // "father", "call" - wide open  
//     'e': 'mouth_e',      // "bet", "red" - medium open
//     'eh': 'mouth_e',     
//     'i': 'mouth_i',      // "bit", "sit" - narrow
//     'ih': 'mouth_i',     
//     'ii': 'mouth_ee',    // "beet", "see" - narrow smile
//     'o': 'mouth_o',      // "got", "cot" - round open
//     'oh': 'mouth_oh',    // "boat", "go" - round medium
//     'u': 'mouth_u',      // "book", "put" - round closed
//     'uu': 'mouth_oo',    // "boot", "food" - round very closed
    
//     // Diphthongs
//     'ai': 'mouth_ai',    // "bite", "my"
//     'au': 'mouth_au',    // "bout", "how"
//     'oi': 'mouth_oi',    // "boy", "coin"
    
//     // Bilabial consonants - lips together/close
//     'b': 'mouth_b',      
//     'p': 'mouth_b',      
//     'm': 'mouth_b',
//     'w': 'mouth_u',      // lip rounding
    
//     // Labiodental - lip to teeth
//     'f': 'mouth_f',      
//     'v': 'mouth_f',
    
//     // Dental/Alveolar - tongue positions  
//     't': 'mouth_t',      // tongue tip up
//     'd': 'mouth_t',
//     's': 'mouth_s',      // tongue groove
//     'z': 'mouth_s',
//     'n': 'mouth_n',      // tongue tip up, mouth slightly open
//     'l': 'mouth_l',      // tongue tip up, sides open
//     'r': 'mouth_r',      // tongue back, lips slightly rounded
    
//     // Palatal/Velar
//     'sh': 'mouth_sh',    // "shoe", lips forward
//     'zh': 'mouth_sh',    // "measure"
//     'ch': 'mouth_ch',    // "church"
//     'j': 'mouth_ch',     // "judge"  
//     'k': 'mouth_k',      // tongue back up
//     'g': 'mouth_k',
//     'ng': 'mouth_ng',    // "sing"
    
//     // Glottal
//     'h': 'mouth_h',      // breathy
    
//     // Affricates and others
//     'th': 'mouth_th',    // "think", tongue between teeth
//     'dh': 'mouth_th',    // "this"
//     'y': 'mouth_y',      // "yes", like 'i' but more constrained
//   }

//   // Coarticulation rules - how sounds blend into each other
//   const coarticulationRules = {
//     // Coming from bilabial sounds
//     'mouth_b': {
//       'mouth_a': 'mouth_ba', 
//       'mouth_i': 'mouth_bi',
//       'mouth_u': 'mouth_bu'
//     },
//     // Coming from vowels to consonants
//     'mouth_a': {
//       'mouth_b': 'mouth_ab',
//       'mouth_t': 'mouth_at', 
//       'mouth_s': 'mouth_as'
//     },
//     'mouth_i': {
//       'mouth_t': 'mouth_it',
//       'mouth_s': 'mouth_is'
//     }
//     // Add more coarticulation rules as needed
//   }

//   // Improved phoneme detection from text
//   const getPhonemeFromText = (text, index) => {
//     const char = text[index]?.toLowerCase() || ''
//     const prevChar = text[index - 1]?.toLowerCase() || ''
//     const nextChar = text[index + 1]?.toLowerCase() || ''
//     const context = text.substring(Math.max(0, index - 2), index + 3).toLowerCase()
    
//     // Handle common digraphs and trigraphs first
//     if (char === 't' && nextChar === 'h') return 'th'
//     if (char === 's' && nextChar === 'h') return 'sh'
//     if (char === 'c' && nextChar === 'h') return 'ch'
//     if (char === 'n' && nextChar === 'g') return 'ng'
    
//     // Vowel context analysis
//     if ('aeiou'.includes(char)) {
//       // Double vowels
//       if (char === nextChar) {
//         if (char === 'e') return 'ii'
//         if (char === 'o') return 'oo' 
//         return char + char
//       }
      
//       // Common diphthongs
//       if (char === 'a' && 'iy'.includes(nextChar)) return 'ai'
//       if (char === 'a' && 'uw'.includes(nextChar)) return 'au'  
//       if (char === 'o' && nextChar === 'i') return 'oi'
      
//       // Long vs short vowels (simplified)
//       if (char === 'a') {
//         // "father" type vs "cat" type
//         return context.includes('r') ? 'aa' : 'a'
//       }
//       if (char === 'e') {
//         // "beet" vs "bet"  
//         return nextChar === 'e' || context.match(/e[^aeiou]*e/) ? 'ii' : 'e'
//       }
//       if (char === 'i') {
//         return nextChar === 'e' || context.includes('igh') ? 'ii' : 'i'
//       }
//       if (char === 'o') {
//         return nextChar === 'o' || context.includes('oa') ? 'oh' : 'o'
//       }
//       if (char === 'u') {
//         return nextChar === 'e' || context.includes('oo') ? 'uu' : 'u'
//       }
//     }
    
//     // Return the character or silence
//     return phonemeToViseme[char] ? char : (char.match(/[a-z]/) ? char : 'sil')
//   }

//   // Get mouth shape with coarticulation consideration
//   const getMouthShapeForIndex = (text, index) => {
//     const currentPhoneme = getPhonemeFromText(text, index)
//     const prevPhoneme = index > 0 ? getPhonemeFromText(text, index - 1) : 'sil'
    
//     let currentViseme = phonemeToViseme[currentPhoneme] || 'mouth_closed'
//     const prevViseme = phonemeToViseme[prevPhoneme] || 'mouth_closed'
    
//     // Apply coarticulation if rules exist
//     if (coarticulationRules[prevViseme] && coarticulationRules[prevViseme][currentViseme]) {
//       currentViseme = coarticulationRules[prevViseme][currentViseme]
//     }
    
//     return currentViseme
//   }

//   // Personality-based configurations with more realistic timing
//   const personalityConfig = {
//     professional: {
//       blinkRate: 3000,
//       speechSpeed: 85,        // Slower, more deliberate
//       transitionSpeed: 60,    // Smooth transitions
//       expressionIntensity: 0.7,
//       anticipationFrames: 2   // Look ahead for smoother animation
//     },
//     friendly: {
//       blinkRate: 2200,
//       speechSpeed: 75,        // Faster, more animated
//       transitionSpeed: 50,
//       expressionIntensity: 0.9,
//       anticipationFrames: 2
//     },
//     technical: {
//       blinkRate: 4200,
//       speechSpeed: 95,        // More measured
//       transitionSpeed: 70,
//       expressionIntensity: 0.6,
//       anticipationFrames: 3
//     },
//     senior: {
//       blinkRate: 3800,
//       speechSpeed: 105,       // More deliberate
//       transitionSpeed: 80,
//       expressionIntensity: 0.8,
//       anticipationFrames: 3
//     }
//   }

//   const config = personalityConfig[personality] || personalityConfig.professional

//   // Enhanced blinking with more natural patterns
//   useEffect(() => {
//     const startBlinking = () => {
//       blinkIntervalRef.current = setInterval(() => {
//         // Natural blink patterns - sometimes double blinks
//         const shouldDoubleBlink = Math.random() < 0.15
        
//         setBlinkState(true)
//         setTimeout(() => {
//           setBlinkState(false)
          
//           if (shouldDoubleBlink) {
//             setTimeout(() => {
//               setBlinkState(true)
//               setTimeout(() => setBlinkState(false), 120)
//             }, 200)
//           }
//         }, 150 + Math.random() * 50) // Variable blink duration
        
//       }, config.blinkRate + (Math.random() - 0.5) * 2000) // More natural randomness
//     }

//     startBlinking()
//     return () => {
//       if (blinkIntervalRef.current) {
//         clearInterval(blinkIntervalRef.current)
//       }
//     }
//   }, [config.blinkRate])

//   // Smooth mouth shape transitions
//   const smoothTransitionTo = (newMouthShape, force = false) => {
//     const currentMouth = lastMouthStateRef.current
    
//     // Don't change if it's the same (reduces flickering)
//     if (currentMouth === newMouthShape && !force) return
    
//     // Clear any pending transition
//     if (transitionTimeoutRef.current) {
//       clearTimeout(transitionTimeoutRef.current)
//     }
    
//     // Immediate change for large differences, transition for similar shapes
//     const shouldTransition = !force && areSimilarMouthShapes(currentMouth, newMouthShape)
    
//     if (shouldTransition) {
//       setIsTransitioning(true)
//       // Brief transition state if needed
//       transitionTimeoutRef.current = setTimeout(() => {
//         const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//         setCurrentImageState(getImageName(emotion, eyeState, newMouthShape))
//         lastMouthStateRef.current = newMouthShape
//         setIsTransitioning(false)
//       }, config.transitionSpeed / 2)
//     } else {
//       const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//       setCurrentImageState(getImageName(emotion, eyeState, newMouthShape))
//       lastMouthStateRef.current = newMouthShape
//     }
//   }

//   // Helper function to determine if mouth shapes are similar
//   const areSimilarMouthShapes = (shape1, shape2) => {
//     const similarGroups = [
//       ['mouth_a', 'mouth_aa', 'mouth_ai'],
//       ['mouth_i', 'mouth_ii', 'mouth_y'],
//       ['mouth_u', 'mouth_uu', 'mouth_w'],
//       ['mouth_o', 'mouth_oh', 'mouth_au'],
//       ['mouth_b', 'mouth_p', 'mouth_m'],
//       ['mouth_s', 'mouth_z', 'mouth_t', 'mouth_d'],
//       ['mouth_f', 'mouth_v'],
//       ['mouth_closed', 'mouth_n', 'mouth_l']
//     ]
    
//     return similarGroups.some(group => 
//       group.includes(shape1) && group.includes(shape2)
//     )
//   }

//   // Enhanced speech animation with lookahead
//   useEffect(() => {
//     if (isSpeaking && currentText) {
//       let currentIndex = 0
      
//       const animateText = () => {
//         if (currentIndex < currentText.length) {
//           // Get current and next mouth shapes for smoother animation
//           const currentMouthShape = getMouthShapeForIndex(currentText, currentIndex)
//           const nextMouthShape = currentIndex < currentText.length - 1 
//             ? getMouthShapeForIndex(currentText, currentIndex + 1) 
//             : 'mouth_closed'
          
//           // Anticipatory animation - slight influence from next shape
//           let finalMouthShape = currentMouthShape
//           if (config.anticipationFrames > 0 && currentIndex % config.anticipationFrames === 0) {
//             // Blend current and next for smoother transitions
//             finalMouthShape = currentMouthShape
//           }
          
//           smoothTransitionTo(finalMouthShape)
//           setTextIndex(currentIndex)
//           currentIndex++
//         } else {
//           // End of speech - return to neutral
//           smoothTransitionTo('mouth_closed', true)
//           currentIndex = 0
//         }
//       }

//       textAnimationRef.current = setInterval(animateText, config.speechSpeed)
//     } else {
//       // Not speaking - ensure closed mouth
//       smoothTransitionTo('mouth_closed', true)
//       setTextIndex(0)
      
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//     }

//     return () => {
//       if (textAnimationRef.current) {
//         clearInterval(textAnimationRef.current)
//       }
//       if (transitionTimeoutRef.current) {
//         clearTimeout(transitionTimeoutRef.current)
//       }
//     }
//   }, [isSpeaking, currentText, config.speechSpeed, config.anticipationFrames, emotion])

//   // Update image when blink state changes (maintain current mouth position)
//   useEffect(() => {
//     const eyeState = blinkState ? "eyes_closed" : "eyes_open"
//     const currentMouth = lastMouthStateRef.current
//     setCurrentImageState(getImageName(emotion, eyeState, currentMouth))
//   }, [blinkState, emotion])

//   // More subtle idle animations
//   useEffect(() => {
//     if (!isSpeaking && !isLoading) {
//       const idleAnimation = setInterval(() => {
//         // Very subtle mouth movements
//         const subtleVariations = ['mouth_closed', 'mouth_rest', 'mouth_slight_smile']
//         const randomMouth = subtleVariations[Math.floor(Math.random() * subtleVariations.length)]
        
//         smoothTransitionTo(randomMouth)
        
//         // Return to neutral after a moment
//         setTimeout(() => {
//           smoothTransitionTo('mouth_closed')
//         }, 800 + Math.random() * 400)
        
//       }, 8000 + Math.random() * 15000) // Less frequent, more natural

//       return () => clearInterval(idleAnimation)
//     }
//   }, [isSpeaking, isLoading, emotion])

//   return (
//     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
//       {/* Main Avatar Container */}
//       <motion.div
//         className="relative w-full h-full"
//         animate={{
//           scale: isSpeaking ? [1, 1.005, 1] : 1 // Much more subtle breathing
//         }}
//         transition={{
//           scale: { 
//             duration: 0.8, 
//             repeat: isSpeaking ? Infinity : 0,
//             ease: "easeInOut"
//           }
//         }}
//       >
//         {/* Dynamic Avatar Image with smoother transitions */}
//         <div className="relative w-full h-full">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentImageState}
//               className="relative w-full h-full"
//               initial={{ opacity: 0.8 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0.8 }}
//               transition={{ 
//                 duration: isTransitioning ? 0.03 : 0.08, // Very fast but not jarring
//                 ease: "easeInOut"
//               }}
//             >
//               <Image
//                 src={`${imageBasePath}/${currentImageState}`}
//                 alt={`AI Avatar - ${emotion} - ${currentImageState}`}
//                 fill
//                 className="object-cover object-center rounded-lg"
//                 priority
//                 onError={(e) => {
//                   console.log(`Missing image: ${currentImageState}, falling back to neutral`)
//                   e.target.src = `${imageBasePath}/neutral_eyes_open_mouth_closed.png`
//                 }}
//               />
//             </motion.div>
//           </AnimatePresence>

//           {/* More subtle breathing overlay */}
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/2"
//             animate={{
//               opacity: [0.1, 0.2, 0.1]
//             }}
//             transition={{
//               duration: 5,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//           />
//         </div>
//       </motion.div>

//       {/* Enhanced Status Indicators */}
//       <AnimatePresence>
//         {/* Speaking Indicator with Phoneme Display */}
//         {isSpeaking && (
//           <motion.div
//             className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/80 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             {/* More realistic audio visualizer */}
//             {[...Array(5)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="w-0.5 bg-green-400 rounded-full"
//                 animate={{
//                   height: [3, Math.random() * 15 + 5, 3],
//                   opacity: [0.3, 1, 0.3]
//                 }}
//                 transition={{
//                   duration: 0.2 + Math.random() * 0.3,
//                   repeat: Infinity,
//                   delay: i * 0.05,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//             <div className="flex flex-col items-end">
//               <span className="text-white text-xs">Speaking</span>
//               {currentText && (
//                 <span className="text-green-300 text-xs font-mono">
//                   Phoneme: {getPhonemeFromText(currentText, textIndex)}
//                 </span>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Rest of the status indicators remain the same */}
//         {isLoading && (
//           <motion.div
//             className="absolute top-4 left-4 flex items-center space-x-2 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//           >
//             <motion.div
//               className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//             <span className="text-white text-xs">Processing</span>
//           </motion.div>
//         )}

//         <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2">
//           <div className="flex items-center space-x-2">
//             <span className="text-white text-xs font-medium capitalize">{personality}</span>
//             <span className="text-gray-300 text-xs">•</span>
//             <span className="text-white text-xs capitalize">{emotion}</span>
//           </div>
//         </div>

//         {isSpeaking && currentText && (
//           <motion.div
//             className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//           >
//             <div className="flex items-center space-x-3">
//               <span className="text-white text-xs">Progress</span>
//               <div className="w-24 h-1 bg-gray-600 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-green-400 rounded-full"
//                   animate={{
//                     width: `${(textIndex / currentText.length) * 100}%`
//                   }}
//                   transition={{ duration: 0.1, ease: "easeOut" }}
//                 />
//               </div>
//               <span className="text-gray-300 text-xs">
//                 {Math.round((textIndex / currentText.length) * 100)}%
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* More subtle emotion-based ambient lighting */}
//       <motion.div
//         className={`absolute inset-0 rounded-lg ${
//           emotion === "happy" ? "bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5" :
//           emotion === "sad" ? "bg-gradient-to-br from-blue-500/5 via-transparent to-gray-500/5" :
//           emotion === "angry" ? "bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5" :
//           emotion === "surprised" ? "bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" :
//           emotion === "thinking" ? "bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5" :
//           "bg-gradient-to-br from-purple-500/4 via-transparent to-blue-500/4"
//         }`}
//         animate={{
//           opacity: [0.2, 0.4, 0.2]
//         }}
//         transition={{
//           duration: 8,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       />

//       {/* Development debug info */}
//       {process.env.NODE_ENV === 'development' && currentText && (
//         <div className="absolute top-16 left-4 bg-black/90 backdrop-blur-sm rounded px-3 py-2 max-w-sm">
//           <div className="text-white text-xs space-y-1">
//             <div className="font-semibold">Speech Analysis:</div>
//             <div className="font-mono text-xs">
//               Current: "{currentText[textIndex] || ''}" → {getPhonemeFromText(currentText, textIndex)}
//             </div>
//             <div className="font-mono text-xs">
//               Viseme: {getMouthShapeForIndex(currentText, textIndex)}
//             </div>
//             <div className="text-gray-400 text-xs">
//               Image: {currentImageState}
//             </div>
//             <div className="text-gray-400 text-xs">
//               Transition: {isTransitioning ? "Yes" : "No"}
//             </div>
//           </div>
//         </div>
//       )}
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