"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  Square,
  Bot,
  User,
  ArrowLeft,
  Volume2,
  Zap,
  Brain,
  MessageCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import RealisticAIAvatar from "@/components/RealisticAiAvatar"
import EnhancedSpeechRecognition from "@/components/EnhancedSpeechRecognition"
import InterviewProgress from "@/components/InterviewProgress"

export default function InterviewPage() {
  const router = useRouter()
  const videoRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const conversationRef = useRef([]) 

  const [resumeData, setResumeData] = useState(null)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [conversation, setConversation] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState("professional")
  const [isLoading, setIsLoading] = useState(false)
  const [userResponse, setUserResponse] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [speechVolume, setSpeechVolume] = useState([0.8])
  const [speechRate, setSpeechRate] = useState([0.9])
  const [voiceActivityLevel, setVoiceActivityLevel] = useState(0)
  const [isProcessingResponse, setIsProcessingResponse] = useState(false)
  const [avatarState, setAvatarState] = useState({
    isSpeaking: false,
    emotion: "neutral",
    eyeDirection: "center",
  })
  const [allScores, setAllScores] = useState([])
  const [questionCount, setQuestionCount] = useState(0)

  useEffect(() => {
    conversationRef.current = conversation
    try {
      localStorage.setItem("interviewConversation", JSON.stringify(conversation))
    } catch {}
  }, [conversation])

  const interviewerPersonalities = [
    {
      value: "professional",
      label: "Professional & Formal",
      avatar: { emotion: "serious", eyePattern: "focused" },
      voice: { pitch: 1.0, rate: 0.8 },
    },
    {
      value: "friendly",
      label: "Friendly & Approachable",
      avatar: { emotion: "happy", eyePattern: "warm" },
      voice: { pitch: 1.2, rate: 0.9 },
    },
    {
      value: "technical",
      label: "Technical Expert",
      avatar: { emotion: "focused", eyePattern: "analytical" },
      voice: { pitch: 0.9, rate: 0.85 },
    },
    {
      value: "senior",
      label: "Senior Manager",
      avatar: { emotion: "confident", eyePattern: "authoritative" },
      voice: { pitch: 0.95, rate: 0.75 },
    },
  ]

  useEffect(() => {
    const savedData = localStorage.getItem("resumeData")
    if (savedData) {
      setResumeData(JSON.parse(savedData))
    } else {
      router.push("/")
    }

    const savedCount = localStorage.getItem("questionCount")
    if (savedCount) {
      setQuestionCount(Number.parseInt(savedCount, 10))
    } else {
      localStorage.setItem("questionCount", "0")
      setQuestionCount(0)
    }

    // restore conversation if present
    try {
      const savedConv = localStorage.getItem("interviewConversation")
      if (savedConv) {
        const parsed = JSON.parse(savedConv)
        if (Array.isArray(parsed)) {
          setConversation(parsed)
          conversationRef.current = parsed
        }
      }
    } catch {}

    initializeMedia()
    initializeAudioAnalysis()

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      })
      mediaStreamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing media devices:", error)
    }
  }

  const initializeAudioAnalysis = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
    } catch (error) {
      console.error("Error initializing audio analysis:", error)
    }
  }

  useEffect(() => {
  const loadVoices = () => {
    console.log("Available voices:", speechSynthesis.getVoices())
  }
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}, [])


  const speakText = useCallback(
    (text) => {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        const voices = speechSynthesis.getVoices()
        const personality = interviewerPersonalities.find((p) => p.value === selectedPersonality)

        const selectedVoice =
          voices.find(
            (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("male"),
          ) || voices[0]

        if (personality) {
          utterance.pitch = personality.voice.pitch
          utterance.rate = speechRate[0]
          utterance.volume = speechVolume[0]
        }

        utterance.voice = selectedVoice

        utterance.onstart = () => {
          setIsSpeaking(true)
          setAvatarState((prev) => ({
            ...prev,
            isSpeaking: true,
            emotion: personality?.avatar.emotion || "neutral",
          }))
        }

        utterance.onend = () => {
          setIsSpeaking(false)
          setAvatarState((prev) => ({
            ...prev,
            isSpeaking: false,
            emotion: "neutral",
          }))
        }

        utterance.onerror = () => {
          setIsSpeaking(false)
          setAvatarState((prev) => ({
            ...prev,
            isSpeaking: false,
          }))
        }

        speechSynthesis.speak(utterance)
      }
    },
    [selectedPersonality, speechVolume, speechRate],
  )

//    const speakText = useCallback(
//   (text) => {
//     if ("speechSynthesis" in window) {
//       speechSynthesis.cancel()
//       const utterance = new SpeechSynthesisUtterance(text)
//       const voices = speechSynthesis.getVoices()
//       const personality = interviewerPersonalities.find((p) => p.value === selectedPersonality)

//       const indianFemaleVoices = [
//         "Microsoft Heera - English (India)", // Windows
//         "Sangeeta", // macOS
//         "Veena",    // macOS (sometimes available)
//         "Google हिन्दी", // Android Chrome
//       ]

//       const selectedVoice =
//         voices.find((voice) =>
//           indianFemaleVoices.some((name) => voice.name.toLowerCase().includes(name.toLowerCase()))
//         ) ||
//         voices.find((voice) => voice.lang.toLowerCase().includes("en-in")) || // any Indian voice
//         voices.find((voice) => voice.name.toLowerCase().includes("female")) || // fallback female
//         voices[0] // ultimate fallback

//       if (personality) {
//         utterance.pitch = personality.voice.pitch
//         utterance.rate = speechRate[0]
//         utterance.volume = speechVolume[0]
//       }

//       utterance.voice = selectedVoice

//       utterance.onstart = () => {
//         setIsSpeaking(true)
//         setAvatarState((prev) => ({
//           ...prev,
//           isSpeaking: true,
//           emotion: personality?.avatar.emotion || "neutral",
//         }))
//       }

//       utterance.onend = () => {
//         setIsSpeaking(false)
//         setAvatarState((prev) => ({
//           ...prev,
//           isSpeaking: false,
//           emotion: "neutral",
//         }))
//       }

//       utterance.onerror = () => {
//         setIsSpeaking(false)
//         setAvatarState((prev) => ({
//           ...prev,
//           isSpeaking: false,
//         }))
//       }

//       speechSynthesis.speak(utterance)
//     }
//   },
//   [selectedPersonality, speechVolume, speechRate],
// )


  const generateQuestion = async (context = "", currentConversation = null) => {
    setIsLoading(true)
    setAvatarState((prev) => ({ ...prev, emotion: "thinking" }))

    const conversationToSend = currentConversation ?? conversationRef.current
    console.log("conversation in generateQuestion (len):", conversationToSend.length)

    try {
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData,
          conversation: conversationToSend,
          conver: conversationToSend,
          questionCount: Number.parseInt(localStorage.getItem("questionCount") || "0", 10),
          context,
          personality: selectedPersonality,
        }),
      })

      const data = await response.json()
      if (data.question) {
        const newQuestion = data.question
        setCurrentQuestion(newQuestion)

        const nextConversation = [...conversationToSend, { type: "ai", content: newQuestion, timestamp: Date.now() }]

        conversationRef.current = nextConversation
        setConversation(nextConversation)

        setQuestionCount((prev) => {
          const newCount = prev + 1
          localStorage.setItem("questionCount", String(newCount))
          return newCount
        })
      if (data.scores) {
        setAllScores((prev) => [...prev, data.scores])
      }


        setTimeout(() => {
          speakText(newQuestion)
        }, 500)
      }
    } catch (error) {
      console.error("Error generating question:", error)
    } finally {
      setIsLoading(false)
      setAvatarState((prev) => ({ ...prev, emotion: "neutral" }))
    }
  }

  const handleUserResponse = async (response, confidence = 1.0) => {
    console.log("conversation from handler (len):", conversationRef.current.length)
    if (!response?.trim()) return

    setIsProcessingResponse(true)

    const userMsg = {
      type: "user",
      content: response,
      timestamp: Date.now(),
      confidence,
    }

    const base = conversationRef.current
    const next = [...base, userMsg]

    conversationRef.current = next
    setConversation(next)

    setTimeout(() => {
      setIsProcessingResponse(false)
      console.log("Generating next question...",  Number.parseInt(localStorage.getItem("questionCount") || "0", 10))
      if ( Number.parseInt(localStorage.getItem("questionCount") || "0", 10) < 5) {
        generateQuestion(response, next)
      } else {
        endInterview()
      }
    }, 600)
  }

  const startInterview = () => {
    setIsInterviewStarted(true)
    setAvatarState((prev) => ({ ...prev, emotion: "welcoming" }))

    const welcomeMessage = `Hello ${resumeData?.fullName || "there"}! I'm excited to interview you for the ${resumeData?.roleAppliedFor} position. Let's begin with our first question.`

    setTimeout(() => {
      speakText(welcomeMessage)
      setTimeout(() => {
        generateQuestion()
      }, 3000)
    }, 1000)
  }

  const endInterview = () => {
    setIsInterviewStarted(false)
    setAvatarState((prev) => ({ ...prev, emotion: "satisfied" }))

    const closingMessage = "Thank you for your time today. I'll now prepare your detailed feedback report."
    speakText(closingMessage)

    setTimeout(() => {
      const finalConv = conversationRef.current
      try {
        localStorage.setItem(
          "interviewData",
          JSON.stringify({
            conversation: finalConv,
            resumeData,
            completedAt: new Date().toISOString(),
            duration: Date.now() - (finalConv[0]?.timestamp || Date.now()),
            allScores : allScores
          }),
        )
      } catch {}
      router.push("/report")
    }, 4000)
  }

  const toggleMic = () => {
    setIsMicOn(!isMicOn)
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicOn
      }
    }
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn
      }
    }
  }

  const handlePersonalityChange = (value) => {
    setSelectedPersonality(value)
    const personality = interviewerPersonalities.find((p) => p.value === value)
    if (personality) {
      setAvatarState((prev) => ({
        ...prev,
        emotion: personality.avatar.emotion,
        eyeDirection: "center",
      }))
    }
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading interview environment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-white hover:bg-white/10 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Interview
            </Button>

            <div className="flex items-center space-x-4">
              <InterviewProgress current={questionCount} total={8} isActive={isInterviewStarted} />

              <Select value={selectedPersonality} onValueChange={handlePersonalityChange}>
                <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white backdrop-blur-sm">
                  <Bot className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {interviewerPersonalities.map((personality, i) => (
                    <SelectItem key={i} value={personality.value} className="text-white">
                      {personality.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-4"
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-md flex-1">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">You</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isListening && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                        className="flex items-center text-red-400"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        <span className="text-sm">Listening</span>
                      </motion.div>
                    )}
                    {voiceActivityLevel > 0 && (
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-4 rounded-full transition-all duration-100 ${
                              i < voiceActivityLevel ? "bg-green-400" : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${!isCameraOn ? "hidden" : ""}`}
                  />
                  {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center text-gray-400">
                        <VideoOff className="h-16 w-16 mx-auto mb-2" />
                        <p>Camera Off</p>
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
                      <Button
                        size="sm"
                        variant={isMicOn ? "default" : "destructive"}
                        onClick={toggleMic}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isCameraOn ? "default" : "destructive"}
                        onClick={toggleCamera}
                        className="rounded-full w-10 h-10 p-0"
                      >
                        {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <EnhancedSpeechRecognition
                    isListening={isListening}
                    setIsListening={setIsListening}
                    onTranscript={handleUserResponse}
                    onInterimTranscript={setInterimTranscript}
                    onVoiceActivity={setVoiceActivityLevel}
                    isMicOn={isMicOn}
                    isInterviewStarted={isInterviewStarted}
                  />
                </div>

                {interimTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30"
                  >
                    <p className="text-blue-200 text-sm italic">"{interimTranscript}"</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">AI Voice Volume</span>
                    </div>
                    <span className="text-white text-sm">{Math.round(speechVolume[0] * 100)}%</span>
                  </div>
                  <Slider
                    value={speechVolume}
                    onValueChange={setSpeechVolume}
                    max={1}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">Speech Rate</span>
                    </div>
                    <span className="text-white text-sm">{speechRate[0].toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={speechRate}
                    onValueChange={setSpeechRate}
                    max={1.5}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-4"
          >
            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-medium">AI Interviewer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isSpeaking && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.8 }}
                        className="flex items-center text-purple-400"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Speaking</span>
                      </motion.div>
                    )}
                    {isLoading && (
                      <div className="flex items-center text-blue-400">
                        <Brain className="h-4 w-4 mr-1 animate-pulse" />
                        <span className="text-sm">Thinking</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg overflow-hidden">
                  <RealisticAIAvatar
                    personality={selectedPersonality}
                    isSpeaking={isSpeaking}
                    isLoading={isLoading}
                    emotion={avatarState.emotion}
                    eyeDirection={avatarState.eyeDirection}
                    currentText={currentQuestion}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md flex-1">
              <CardContent className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Interview Conversation</h3>
                  {!isInterviewStarted ? (
                    <Button
                      onClick={startInterview}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-6"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  ) : (
                    <Button onClick={endInterview} variant="destructive" size="sm" className="px-6">
                      <Square className="h-4 w-4 mr-2" />
                      End Interview
                    </Button>
                  )}
                </div>

                <div className="flex-1 min-h-[5rem] max-h-[17rem] overflow-y-scroll space-y-3 pr-2">
                  <AnimatePresence>
                    {conversation.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === "user" ? "justify-end" : message.type === "instruction" ? "hidden" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white ml-4"
                              : "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white mr-4"
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            {message.type === "user" ? (
                              <User className="h-4 w-4 mr-2" />
                            ) : (
                              <Bot className="h-4 w-4 mr-2" />
                            )}
                            <span className="font-medium text-sm opacity-90">
                              {message.type === "user" ? "You" : "AI Interviewer"}
                            </span>
                            {message.confidence && message.confidence < 0.8 && (
                              <span className="ml-2 text-xs opacity-70">(Low confidence)</span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="text-xs opacity-60 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isProcessingResponse && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-gradient-to-r from-purple-500/60 to-pink-500/60 text-white p-4 rounded-2xl max-w-[85%] mr-4 backdrop-blur-sm">
                        <div className="flex items-center">
                          <Bot className="h-4 w-4 mr-2" />
                          <span className="font-medium text-sm opacity-90">AI Interviewer</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                          <span className="ml-3 text-sm opacity-80">Processing your response...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!isInterviewStarted && conversation.length === 0 && (
                    <div className="text-center text-white/70 py-12">
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <Brain className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-3">Ready for Your AI Interview?</h3>
                      <p className="text-sm max-w-md mx-auto leading-relaxed">
                        I'll conduct a personalized interview based on your resume for the{" "}
                        <span className="text-blue-400 font-medium">{resumeData.roleAppliedFor}</span> position. Click
                        "Start Interview" when you're ready to begin.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}






// "use client";
// import React, { useState, useRef } from 'react';
// import { Upload, Image, Video, Loader2, Download, AlertCircle, CheckCircle } from 'lucide-react';

// const FaceSwapApp = () => {
//   const [apiKey, setApiKey] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('image');
//   const [jobId, setJobId] = useState('');
//   const [status, setStatus] = useState('');
  
//   // Image swap states
//   const [sourceImage, setSourceImage] = useState(null);
//   const [targetImage, setTargetImage] = useState(null);
//   const [sourceImageUrl, setSourceImageUrl] = useState('');
//   const [targetImageUrl, setTargetImageUrl] = useState('');
  
//   // Video swap states
//   const [sourceVideo, setSourceVideo] = useState(null);
//   const [targetVideoImage, setTargetVideoImage] = useState(null);
//   const [sourceVideoUrl, setSourceVideoUrl] = useState('');
//   const [targetVideoImageUrl, setTargetVideoImageUrl] = useState('');
  
//   const fileInputRef = useRef();
//   const videoInputRef = useRef();

//   // Convert file to base64 or upload and get URL
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Image Face Swap API call
//   const performImageFaceSwap = async () => {
//     setLoading(true);
//     setError('');
//     setResult(null);

//     try {
//       const sourceUrl = sourceImageUrl || (sourceImage ? await fileToBase64(sourceImage) : '');
//       const targetUrl = targetImageUrl || (targetImage ? await fileToBase64(targetImage) : '');

//       if (!sourceUrl || !targetUrl) {
//         throw new Error('Please provide both source and target images');
//       }

//       const response = await fetch('https://api.market/api/magicapi/faceswap', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${apiKey}`,
//           'X-API-Key': apiKey
//         },
//         body: JSON.stringify({
//           source_image: sourceUrl,
//           target_image: targetUrl,
//           source_face_index: 0,
//           target_face_index: 0
//         })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       setResult(data);
//       setStatus('completed');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Video Face Swap API call
//   const performVideoFaceSwap = async () => {
//     setLoading(true);
//     setError('');
//     setResult(null);
//     setStatus('processing');

//     try {
//       const videoUrl = sourceVideoUrl || (sourceVideo ? await fileToBase64(sourceVideo) : '');
//       const imageUrl = targetVideoImageUrl || (targetVideoImage ? await fileToBase64(targetVideoImage) : '');

//       if (!videoUrl || !imageUrl) {
//         throw new Error('Please provide both source video and target face image');
//       }

//       const response = await fetch('https://api.market/api/magicapi/faceswap-v2', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${apiKey}`,
//           'X-API-Key': apiKey
//         },
//         body: JSON.stringify({
//           source_video: videoUrl,
//           target_face: imageUrl,
//           face_index: 0,
//           quality: 'high'
//         })
//       });

//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.error || `HTTP error! status: ${response.status}`);
//       }

//       // If API returns a job ID, poll for results
//       if (data.job_id) {
//         setJobId(data.job_id);
//         pollVideoResult(data.job_id);
//       } else {
//         setResult(data);
//         setStatus('completed');
//       }
//     } catch (err) {
//       setError(err.message);
//       setStatus('error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Poll for video processing results
//   const pollVideoResult = async (id) => {
//     const maxAttempts = 60; // 5 minutes with 5-second intervals
//     let attempts = 0;

//     const poll = async () => {
//       try {
//         const response = await fetch(`https://api.market/api/magicapi/faceswap-v2/status/${id}`, {
//           headers: {
//             'Authorization': `Bearer ${apiKey}`,
//             'X-API-Key': apiKey
//           }
//         });

//         const data = await response.json();
        
//         if (data.status === 'completed') {
//           setResult(data);
//           setStatus('completed');
//           return;
//         } else if (data.status === 'failed') {
//           setError('Video processing failed');
//           setStatus('error');
//           return;
//         }

//         attempts++;
//         if (attempts < maxAttempts) {
//           setTimeout(poll, 5000); // Poll every 5 seconds
//         } else {
//           setError('Processing timeout');
//           setStatus('error');
//         }
//       } catch (err) {
//         setError('Error checking status: ' + err.message);
//         setStatus('error');
//       }
//     };

//     poll();
//   };

//   const handleFileSelect = (type, file) => {
//     if (activeTab === 'image') {
//       if (type === 'source') setSourceImage(file);
//       if (type === 'target') setTargetImage(file);
//     } else {
//       if (type === 'video') setSourceVideo(file);
//       if (type === 'image') setTargetVideoImage(file);
//     }
//   };

//   const downloadResult = () => {
//     if (result?.output_url || result?.result_image) {
//       const url = result.output_url || result.result_image;
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `faceswap_result.${activeTab === 'image' ? 'jpg' : 'mp4'}`;
//       link.click();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
//             <Image className="w-10 h-10" />
//             AI Face Swap Studio
//           </h1>
//           <p className="text-blue-200 text-lg">
//             Swap faces in images and videos using advanced AI technology
//           </p>
//         </div>

//         {/* API Key Input */}
//         <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
//           <label className="block text-white font-medium mb-2">API Key</label>
//           <input
//             type="password"
//             value={apiKey}
//             onChange={(e) => setApiKey(e.target.value)}
//             placeholder="Enter your API Market key"
//             className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//           />
//         </div>

//         {/* Tab Selector */}
//         <div className="flex space-x-1 bg-white/10 p-1 rounded-lg mb-6">
//           <button
//             onClick={() => setActiveTab('image')}
//             className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
//               activeTab === 'image'
//                 ? 'bg-blue-600 text-white shadow-lg'
//                 : 'text-white/70 hover:text-white hover:bg-white/10'
//             }`}
//           >
//             <Image className="w-5 h-5 inline mr-2" />
//             Image Swap
//           </button>
//           <button
//             onClick={() => setActiveTab('video')}
//             className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
//               activeTab === 'video'
//                 ? 'bg-blue-600 text-white shadow-lg'
//                 : 'text-white/70 hover:text-white hover:bg-white/10'
//             }`}
//           >
//             <Video className="w-5 h-5 inline mr-2" />
//             Video Swap
//           </button>
//         </div>

//         {/* Image Swap Interface */}
//         {activeTab === 'image' && (
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             {/* Source Image */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Upload className="w-5 h-5" />
//                 Source Image (Face to Extract)
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={sourceImageUrl}
//                   onChange={(e) => setSourceImageUrl(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileSelect('source', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {sourceImage && (
//                   <p className="text-green-400 text-sm">✓ {sourceImage.name}</p>
//                 )}
//               </div>
//             </div>

//             {/* Target Image */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Upload className="w-5 h-5" />
//                 Target Image (Body/Background)
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={targetImageUrl}
//                   onChange={(e) => setTargetImageUrl(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileSelect('target', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {targetImage && (
//                   <p className="text-green-400 text-sm">✓ {targetImage.name}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Video Swap Interface */}
//         {activeTab === 'video' && (
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             {/* Source Video */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Video className="w-5 h-5" />
//                 Source Video
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={sourceVideoUrl}
//                   onChange={(e) => setSourceVideoUrl(e.target.value)}
//                   placeholder="Enter video URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="video/*"
//                   onChange={(e) => handleFileSelect('video', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {sourceVideo && (
//                   <p className="text-green-400 text-sm">✓ {sourceVideo.name}</p>
//                 )}
//               </div>
//             </div>

//             {/* Target Face Image */}
//             <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//               <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
//                 <Image className="w-5 h-5" />
//                 Target Face Image
//               </h3>
              
//               <div className="space-y-4">
//                 <input
//                   type="url"
//                   value={targetVideoImageUrl}
//                   onChange={(e) => setTargetVideoImageUrl(e.target.value)}
//                   placeholder="Enter image URL"
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-blue-400 focus:outline-none"
//                 />
                
//                 <div className="text-center text-white/60">OR</div>
                
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => handleFileSelect('image', e.target.files[0])}
//                   className="w-full px-4 py-3 rounded-lg bg-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                 />
                
//                 {targetVideoImage && (
//                   <p className="text-green-400 text-sm">✓ {targetVideoImage.name}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Process Button */}
//         <div className="text-center mb-6">
//           <button
//             onClick={activeTab === 'image' ? performImageFaceSwap : performVideoFaceSwap}
//             disabled={loading || !apiKey}
//             className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
//                 Processing...
//               </>
//             ) : (
//               `Swap ${activeTab === 'image' ? 'Image' : 'Video'} Faces`
//             )}
//           </button>
//         </div>

//         {/* Status Display */}
//         {status && (
//           <div className={`text-center mb-6 p-4 rounded-lg ${
//             status === 'completed' ? 'bg-green-500/20 text-green-400' :
//             status === 'error' ? 'bg-red-500/20 text-red-400' :
//             'bg-yellow-500/20 text-yellow-400'
//           }`}>
//             {status === 'processing' && (
//               <div className="flex items-center justify-center gap-2">
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 Processing video... This may take several minutes.
//                 {jobId && <span className="text-sm">Job ID: {jobId}</span>}
//               </div>
//             )}
//             {status === 'completed' && (
//               <div className="flex items-center justify-center gap-2">
//                 <CheckCircle className="w-5 h-5" />
//                 Face swap completed successfully!
//               </div>
//             )}
//             {status === 'error' && (
//               <div className="flex items-center justify-center gap-2">
//                 <AlertCircle className="w-5 h-5" />
//                 Processing failed
//               </div>
//             )}
//           </div>
//         )}

//         {/* Error Display */}
//         {error && (
//           <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg mb-6">
//             <div className="flex items-center gap-2">
//               <AlertCircle className="w-5 h-5" />
//               <div>
//                 <strong>Error:</strong> {error}
//                 {error.includes('CORS') || error.includes('404') ? (
//                   <div className="mt-2 text-sm">
//                     <p>⚠️ <strong>CORS Issue Detected:</strong> This API may need to be called from a backend server due to browser security restrictions.</p>
//                     <p>Consider using a proxy server or implementing this in your backend instead of directly in the browser.</p>
//                   </div>
//                 ) : null}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Result Display */}
//         {result && (
//           <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-white font-semibold text-xl">Result</h3>
//               {(result.output_url || result.result_image) && (
//                 <button
//                   onClick={downloadResult}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//                 >
//                   <Download className="w-4 h-4" />
//                   Download
//                 </button>
//               )}
//             </div>

//             {activeTab === 'image' && result.result_image && (
//               <div className="text-center">
//                 <img
//                   src={result.result_image}
//                   alt="Face swap result"
//                   className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
//                 />
//               </div>
//             )}

//             {activeTab === 'video' && result.output_url && (
//               <div className="text-center">
//                 <video
//                   src={result.output_url}
//                   controls
//                   className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
//                 />
//               </div>
//             )}

//             {/* Processing Info */}
//             {result.processing_time && (
//               <div className="mt-4 text-white/70 text-sm text-center">
//                 Processing completed in {result.processing_time} seconds
//               </div>
//             )}
//           </div>
//         )}

//         {/* Instructions */}
//         <div className="mt-8 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
//           <h3 className="text-white font-semibold mb-4">How to Use</h3>
//           <div className="text-white/70 space-y-2">
//             <p><strong>Image Swap:</strong> Upload or provide URLs for a source image (face to extract) and target image (body/background to place the face on).</p>
//             <p><strong>Video Swap:</strong> Upload or provide URLs for a source video and a target face image. The face from the image will replace faces in the video.</p>
//             <p><strong>API Key:</strong> Get your API key from API.Market after subscribing to the MagicAPI Face Swap service.</p>
//             <p><strong>Content Policy:</strong> The API automatically filters NSFW content and will reject inappropriate images.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FaceSwapApp;