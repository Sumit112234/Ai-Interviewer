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
import AIAvatar from "@/components/AIAvatar"
import CodeIDETestModal from "@/components/CodeIDETestModal"

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
  const [showIde, setShowIde] = useState(false)
  const [ideData, setIdeData] = useState({ideStatus : false, question: "Implement a function to reverse a linked list.", codeType : "write"})

  const onIdeSubmit = async (codeSnippet, language, skip=false) => {
    if(skip)
    {
      await handleUserResponse(`I am skipping the coding question because it is so difficult.`, 1.0)
      // setShowIde(false)
    }
    else{
      await handleUserResponse(`Here is my code submission for the coding challenge:\n\n${codeSnippet}\n\nLanguage: ${language}`, 1.0,true)
      // setShowIde(false)
    } 
    // alert("Code IDE Submission Received:\n\n" + codeSnippet + language)
  }

  
  useEffect(()=>{
    if(ideData.ideStatus === false)
    {
      setShowIde(false)
    }
  },[ideData])

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
    // console.log("Available voices:", speechSynthesis.getVoices())
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
        console.log("Available voices:", voices)
        // const selectedVoice =
        //   voices.find(
        //     (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("male"),
        //   ) || voices[0]
        const selectedVoice = voices[2] ? voices[2] : 'Microsoft Neerja Online (Natural) - English (India)';  //voices.find((voice) => voice.name === 'Microsoft Neerja Online (Natural) - English (India)') || voices[2]

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



  const generateQuestion = async (context = "", currentConversation = null) => {
    setIsLoading(true)
    // setAvatarState((prev) => ({ ...prev, emotion: "neutral" }))

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
      console.log(data)
      if (data.question) {
        const newQuestion = data.question
        setCurrentQuestion(newQuestion)

        if(data.ide)
        {

          console.log(data.ide,data.question,data.codeType,data.codeSnippet)
          setShowIde(true)
          setIdeData({
            ideStatus : data.ide,
            question : data.codeSnippet || data.question,
            codeType : data.codeType
          })
        }

        const nextConversation = [...conversationToSend, { type: "ai", content: newQuestion, timestamp: Date.now() }]


        conversationRef.current = nextConversation
        setConversation(nextConversation)
        if(data.questionCountShouldIncrement) {
          setQuestionCount((prev) => {
            const newCount = prev + 1
            localStorage.setItem("questionCount", String(newCount))
            return newCount
          })
       }
      if (data.scores) {
        setAllScores((prev) => [...prev, data.scores])
      }

        setAvatarState((prev) => ({ ...prev, emotion: data.emotion || "neutral" }))
        setTimeout(() => {
          speakText(newQuestion)
        }, 500)
      }
    } catch (error) {
      console.error("Error generating question:", error)
    } finally {
      setIsLoading(false)
      // setAvatarState((prev) => ({ ...prev, emotion: "neutral" }))
    }
  }

  const handleUserResponse = async (response, confidence = 1.0, isIde = false) => {
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

    if(isIde)
    {
      // setIdeData({ideStatus : false, question: "", codeType : ""})
      setConversation([...next, { type: "user", content: "Your submitted code has been recorded.", timestamp: Date.now(), confidence: 1.0 }])
    }
    else{
      setConversation(next)
    }

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
    setAvatarState((prev) => ({ ...prev, emotion: "neutral" }))

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
    setAvatarState((prev) => ({ ...prev, emotion: "happy" }))

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
              <InterviewProgress current={questionCount} total={5} isActive={isInterviewStarted} />

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
       { showIde && <div className="absolute top-20 right-8 z-50">
           <CodeIDETestModal onIdeSubmit={onIdeSubmit} data={ideData}  setIdeData={setIdeData} />
        </div>}
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
                    speechRate={speechRate}
                    personality={selectedPersonality}
                    isSpeaking={isSpeaking}
                    isLoading={isLoading}
                    emotion={avatarState.emotion}
                    eyeDirection={avatarState.eyeDirection}
                    currentText={currentQuestion}
                  />
                  {/* <AIAvatar
                    personality={selectedPersonality}
                    isSpeaking={true}
                    isLoading={isLoading}
                    emotion={avatarState.emotion}
                    eyeDirection={avatarState.eyeDirection}
                    currentText={currentQuestion}
                  /> */}
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


// ---------------------

// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Mic, MicOff, Video, VideoOff, Play, Pause, Square, Bot, User, ArrowLeft, Volume2, VolumeX, Settings, Zap, Brain, Eye, MessageCircle } from 'lucide-react'
// import { useRouter } from "next/navigation"
// import AIAvatar from "@/components/AIAvatar"
// import RealisticAIAvatar from "@/components/RealisticAiAvatar"
// import EnhancedSpeechRecognition from "@/components/EnhancedSpeechRecognition"
// import InterviewProgress from "@/components/InterviewProgress"

// export default function InterviewPage() {
//   const router = useRouter()
//   const videoRef = useRef(null)
//   const mediaStreamRef = useRef(null)
//   const audioContextRef = useRef(null)
//   const analyserRef = useRef(null)

//   const [resumeData, setResumeData] = useState(null)
//   const [isInterviewStarted, setIsInterviewStarted] = useState(false)
//   const [currentQuestion, setCurrentQuestion] = useState("")
//   // const [conversation, setConversation] = useState([{ type: "instruction", content: "hello ji", timestamp: Date.now() }])
//   const [conversation, setConversation] = useState([])
//   const [isListening, setIsListening] = useState(false)
//   const [isMicOn, setIsMicOn] = useState(true)
//   const [isCameraOn, setIsCameraOn] = useState(true)
//   const [isSpeaking, setIsSpeaking] = useState(false)
//   const [selectedPersonality, setSelectedPersonality] = useState("professional")
//   const [isLoading, setIsLoading] = useState(false)
//   // const [questionCount, setQuestionCount] = useState(0)


//   const [userResponse, setUserResponse] = useState("")
//   const [interimTranscript, setInterimTranscript] = useState("")
//   const [speechVolume, setSpeechVolume] = useState([0.8])
//   const [speechRate, setSpeechRate] = useState([0.9])
//   const [voiceActivityLevel, setVoiceActivityLevel] = useState(0)
//   const [isProcessingResponse, setIsProcessingResponse] = useState(false)
//   const [avatarState, setAvatarState] = useState({
//     isSpeaking: false,
//     emotion: 'neutral',
//     eyeDirection: 'center'
//   })
//   const [questionCount, setQuestionCount] = useState(0)


// // useEffect(() => {
// //   const savedCount = localStorage.getItem("questionCount")
// //   if (savedCount) {
// //     setQuestionCount(parseInt(savedCount, 10))
// //   } else {
// //     localStorage.setItem("questionCount", "0")
// //     setQuestionCount(0)
// //   }
// // }, [])


//   const interviewerPersonalities = [
//     { 
//       value: "professional", 
//       label: "Professional & Formal", 
//       avatar: { emotion: 'serious', eyePattern: 'focused' },
//       voice: { pitch: 1.0, rate: 0.8 }
//     },
//     { 
//       value: "friendly", 
//       label: "Friendly & Approachable", 
//       avatar: { emotion: 'happy', eyePattern: 'warm' },
//       voice: { pitch: 1.2, rate: 0.9 }
//     },
//     { 
//       value: "technical", 
//       label: "Technical Expert", 
//       avatar: { emotion: 'focused', eyePattern: 'analytical' },
//       voice: { pitch: 0.9, rate: 0.85 }
//     },
//     { 
//       value: "senior", 
//       label: "Senior Manager", 
//       avatar: { emotion: 'confident', eyePattern: 'authoritative' },
//       voice: { pitch: 0.95, rate: 0.75 }
//     },
//   ]

//   useEffect(() => {
//   const savedData = localStorage.getItem("resumeData")
//   if (savedData) {
//     setResumeData(JSON.parse(savedData))
//   } else {
//     router.push("/")
//   }

//   // Initialize question count from localStorage
//   const savedCount = localStorage.getItem("questionCount")
//   if (savedCount) {
//     setQuestionCount(parseInt(savedCount, 10))
//   } else {
//     localStorage.setItem("questionCount", "0")
//     setQuestionCount(0)
//   }

//   initializeMedia()
//   initializeAudioAnalysis()

//   return () => {
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach((track) => track.stop())
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close()
//     }
//   }
// }, [])
//   // useEffect(() => {
//   //   const savedData = localStorage.getItem("resumeData")
//   //   if (savedData) {
//   //     setResumeData(JSON.parse(savedData))
//   //   } else {
//   //     router.push("/")
//   //   }

//   //   initializeMedia()
//   //   initializeAudioAnalysis()

//   //   return () => {
//   //     if (mediaStreamRef.current) {
//   //       mediaStreamRef.current.getTracks().forEach((track) => track.stop())
//   //     }
//   //     if (audioContextRef.current) {
//   //       audioContextRef.current.close()
//   //     }
//   //   }
//   // }, [])

//   const initializeMedia = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { width: 1280, height: 720, facingMode: 'user' },
//         audio: { 
//           echoCancellation: true, 
//           noiseSuppression: true, 
//           autoGainControl: true,
//           sampleRate: 44100
//         },
//       })
//       mediaStreamRef.current = stream
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//       }
//     } catch (error) {
//       console.error("Error accessing media devices:", error)
//     }
//   }

//   const initializeAudioAnalysis = async () => {
//     try {
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
//       analyserRef.current = audioContextRef.current.createAnalyser()
//       analyserRef.current.fftSize = 256
//     } catch (error) {
//       console.error("Error initializing audio analysis:", error)
//     }
//   }

//   const speakText = useCallback((text) => {

//     if ("speechSynthesis" in window) {
//       // Stop any ongoing speech
//       speechSynthesis.cancel()
      
//       const utterance = new SpeechSynthesisUtterance(text)
//       const voices = speechSynthesis.getVoices()
//       const personality = interviewerPersonalities.find(p => p.value === selectedPersonality)
      
//       // Select appropriate voice
//       let selectedVoice = voices.find(voice => 
//         voice.name.toLowerCase().includes('female') || 
//         voice.name.toLowerCase().includes('male')
//       ) || voices[0]

//       if (personality) {
//         utterance.pitch = personality.voice.pitch
//         utterance.rate = speechRate[0]
//         utterance.volume = speechVolume[0]
//       }

//       utterance.voice = selectedVoice

//       // Avatar synchronization
//       utterance.onstart = () => {
//         setIsSpeaking(true)
//         setAvatarState(prev => ({
//           ...prev,
//           isSpeaking: true,
//           emotion: personality?.avatar.emotion || 'neutral'
//         }))
//       }

//       utterance.onend = () => {
//         setIsSpeaking(false)
//         setAvatarState(prev => ({
//           ...prev,
//           isSpeaking: false,
//           emotion: 'neutral'
//         }))
//       }

//       utterance.onerror = () => {
//         setIsSpeaking(false)
//         setAvatarState(prev => ({
//           ...prev,
//           isSpeaking: false
//         }))
//       }

//       speechSynthesis.speak(utterance)
//     }
//   }, [selectedPersonality, speechVolume, speechRate])

//   const generateQuestion = async (context = "",currentConversation = null ) => {
//     setIsLoading(true)
//     setAvatarState(prev => ({ ...prev, emotion: 'thinking' }))

//     console.log("conversation in generateQuestion", conversation)
    
//       const conversationToSend = currentConversation || conversation
//     try {
//       const response = await fetch("/api/generate-question", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           resumeData,
//           conversation : conversationToSend,
//           conver : conversationToSend,
//           questionCount : parseInt(localStorage.getItem("questionCount")) || 0,
//           context,
//           count: questionCount,
//           personality: selectedPersonality,
//         }),
//       })

//       const data = await response.json()
//       if (data.question) {
//         const newQuestion = data.question
//         setCurrentQuestion(newQuestion)
//         console.log("Generated Question:", newQuestion)
//         console.log("count " , questionCount)

//         const newConversation = [...conversationToSend, { 
//           type: "ai", 
//           content: newQuestion, 
//           timestamp: Date.now() 
//         }]
//         console.log("newConversation", newConversation)
//       setConversation([...conversationToSend, { 
//           type: "ai", 
//           content: newQuestion, 
//           timestamp: Date.now() 
//         }])
      
//         // setConversation((prev) => [...prev, { type: "ai", content: newQuestion, timestamp: Date.now() }])
//         // setQuestionCount(questionCount + 1)
        
//         setQuestionCount(prev => {
//           const newCount = prev + 1
//           localStorage.setItem("questionCount", newCount.toString())
//           console.log("newCount", newCount )
//           return newCount
//         })
            
//         // Delay speech to allow for smooth transition
//         setTimeout(() => {
//           speakText(newQuestion)
//         }, 500)
        
//       }
//     } catch (error) {
//       console.error("Error generating question:", error)
//     } finally {
//       setIsLoading(false)
//       setAvatarState(prev => ({ ...prev, emotion: 'neutral' }))
//     }
//   }

//   const handleUserResponse = async (response, confidence = 1.0) => {

//      console.log("conversation from handler", conversation)
//     if (!response.trim()) return
    
//     setIsProcessingResponse(true)

//      const newConversation = [...conversation, { 
//       type: "user", 
//       content: response, 
//       timestamp: Date.now(),
//       confidence 
//     }]
//     console.log("newConversation in handler", newConversation)
//     // setConversation([...conversation, { 
//     //   type: "user", 
//     //   content: response, 
//     //   timestamp: Date.now(),
//     //   confidence 
//     // }])
  
//     setConversation((prev) => [...prev, { 
//       type: "user", 
//       content: response, 
//       timestamp: Date.now(),
//       confidence 
//     }])

//     // Simulate processing time
//     setTimeout(() => {
//       setIsProcessingResponse(false)
//       if (questionCount < 8) {
//         generateQuestion(response, newConversation)
//       } else {
//         endInterview()
//       }
//     }, 2000)
//   }

//   const startInterview = () => {
//     setIsInterviewStarted(true)
//     setAvatarState(prev => ({ ...prev, emotion: 'welcoming' }))
    
//     // Welcome message
//     const welcomeMessage = `Hello ${resumeData?.fullName || 'there'}! I'm excited to interview you for the ${resumeData?.roleAppliedFor} position. Let's begin with our first question.`
    
//     setTimeout(() => {
//       speakText(welcomeMessage)
//       setTimeout(() => {
//         generateQuestion()
//       }, 3000)
//     }, 1000)
//   }

//   const endInterview = () => {
//     setIsInterviewStarted(false)
//     setAvatarState(prev => ({ ...prev, emotion: 'satisfied' }))
    
//     const closingMessage = "Thank you for your time today. I'll now prepare your detailed feedback report."
//     speakText(closingMessage)
    
//     setTimeout(() => {
//       localStorage.setItem(
//         "interviewData",
//         JSON.stringify({
//           conversation,
//           resumeData,
//           completedAt: new Date().toISOString(),
//           duration: Date.now() - (conversation[0]?.timestamp || Date.now()),
//         }),
//       )
//       router.push("/report")
//     }, 4000)
//   }

//   const toggleMic = () => {
//     setIsMicOn(!isMicOn)
//     if (mediaStreamRef.current) {
//       const audioTrack = mediaStreamRef.current.getAudioTracks()[0]
//       if (audioTrack) {
//         audioTrack.enabled = !isMicOn
//       }
//     }
//   }

//   const toggleCamera = () => {
//     setIsCameraOn(!isCameraOn)
//     if (mediaStreamRef.current) {
//       const videoTrack = mediaStreamRef.current.getVideoTracks()[0]
//       if (videoTrack) {
//         videoTrack.enabled = !isCameraOn
//       }
//     }
//   }

//   const handlePersonalityChange = (value) => {
//     setSelectedPersonality(value)
//     const personality = interviewerPersonalities.find(p => p.value === value)
//     if (personality) {
//       setAvatarState(prev => ({
//         ...prev,
//         emotion: personality.avatar.emotion,
//         eyeDirection: 'center'
//       }))
//     }
//   }

//   if (!resumeData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-center text-white">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
//           <p>Loading interview environment...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 ">
//       {/* Enhanced Header */}
//       <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex justify-between items-center">
//             <Button 
//               variant="ghost" 
//               onClick={() => router.push("/")} 
//               className="text-white hover:bg-white/10 transition-all duration-200"
//             >
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Exit Interview
//             </Button>
            
//             <div className="flex items-center space-x-4">
//               <InterviewProgress 
//                 current={questionCount} 
//                 total={8} 
//                 isActive={isInterviewStarted}
//               />
              
//               <Select value={selectedPersonality} onValueChange={handlePersonalityChange}>
//                 <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white backdrop-blur-sm">
//                   <Bot className="h-4 w-4 mr-2" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-800 border-gray-600">
//                   {interviewerPersonalities.map((personality, i) => (
//                     <SelectItem key={i} value={personality.value} className="text-white">
//                       {personality.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full max-w-7xl mx-auto">
          
//           {/* User Video Feed - Left Side */}
//           <motion.div 
//             initial={{ opacity: 0, x: -50 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             className="flex flex-col space-y-4"
//           >
//             {/* User Video Card */}
//             <Card className="bg-black/40 border-white/10 backdrop-blur-md flex-1">
//               <CardContent className="p-4 h-full flex flex-col">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center space-x-2">
//                     <User className="h-5 w-5 text-blue-400" />
//                     <span className="text-white font-medium">You</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {isListening && (
//                       <motion.div
//                         animate={{ scale: [1, 1.2, 1] }}
//                         transition={{ repeat: Infinity, duration: 1 }}
//                         className="flex items-center text-red-400"
//                       >
//                         <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
//                         <span className="text-sm">Listening</span>
//                       </motion.div>
//                     )}
//                     {voiceActivityLevel > 0 && (
//                       <div className="flex items-center space-x-1">
//                         {[...Array(5)].map((_, i) => (
//                           <div
//                             key={i}
//                             className={`w-1 h-4 rounded-full transition-all duration-100 ${
//                               i < voiceActivityLevel ? 'bg-green-400' : 'bg-gray-600'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Video Container */}
//                 <div className="relative flex-1 bg-gray-800 rounded-lg overflow-hidden">
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     muted
//                     playsInline
//                     className={`w-full h-full object-cover ${!isCameraOn ? "hidden" : ""}`}
//                   />
//                   {!isCameraOn && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                       <div className="text-center text-gray-400">
//                         <VideoOff className="h-16 w-16 mx-auto mb-2" />
//                         <p>Camera Off</p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Enhanced Controls Overlay */}
//                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//                     <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
//                       <Button
//                         size="sm"
//                         variant={isMicOn ? "default" : "destructive"}
//                         onClick={toggleMic}
//                         className="rounded-full w-10 h-10 p-0"
//                       >
//                         {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant={isCameraOn ? "default" : "destructive"}
//                         onClick={toggleCamera}
//                         className="rounded-full w-10 h-10 p-0"
//                       >
//                         {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Enhanced Speech Recognition Component */}
//                 <div className="mt-4">
//                   <EnhancedSpeechRecognition
//                     isListening={isListening}
//                     setIsListening={setIsListening}
//                     onTranscript={handleUserResponse}
//                     onInterimTranscript={setInterimTranscript}
//                     onVoiceActivity={setVoiceActivityLevel}
//                     isMicOn={isMicOn}
//                     isInterviewStarted={isInterviewStarted}
//                   />
//                 </div>

//                 {/* Interim Transcript Display */}
//                 {interimTranscript && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mt-2 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30"
//                   >
//                     <p className="text-blue-200 text-sm italic">"{interimTranscript}"</p>
//                   </motion.div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Audio Controls */}
//             <Card className="bg-black/40 border-white/10 backdrop-blur-md">
//               <CardContent className="p-4">
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Volume2 className="h-4 w-4 text-white" />
//                       <span className="text-white text-sm">AI Voice Volume</span>
//                     </div>
//                     <span className="text-white text-sm">{Math.round(speechVolume[0] * 100)}%</span>
//                   </div>
//                   <Slider
//                     value={speechVolume}
//                     onValueChange={setSpeechVolume}
//                     max={1}
//                     min={0.1}
//                     step={0.1}
//                     className="w-full"
//                   />
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Zap className="h-4 w-4 text-white" />
//                       <span className="text-white text-sm">Speech Rate</span>
//                     </div>
//                     <span className="text-white text-sm">{speechRate[0].toFixed(1)}x</span>
//                   </div>
//                   <Slider
//                     value={speechRate}
//                     onValueChange={setSpeechRate}
//                     max={1.5}
//                     min={0.5}
//                     step={0.1}
//                     className="w-full"
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* AI Avatar and Conversation - Right Side */}
//           <motion.div 
//             initial={{ opacity: 0, x: 50 }} 
//             animate={{ opacity: 1, x: 0 }} 
//             className="flex flex-col space-y-4"
//           >
//             {/* AI Avatar Card */}
//             <Card className="bg-black/40 border-white/10 backdrop-blur-md">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center space-x-2">
//                     <Brain className="h-5 w-5 text-purple-400" />
//                     <span className="text-white font-medium">AI Interviewer</span>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     {isSpeaking && (
//                       <motion.div
//                         animate={{ scale: [1, 1.1, 1] }}
//                         transition={{ repeat: Infinity, duration: 0.8 }}
//                         className="flex items-center text-purple-400"
//                       >
//                         <MessageCircle className="h-4 w-4 mr-1" />
//                         <span className="text-sm">Speaking</span>
//                       </motion.div>
//                     )}
//                     {isLoading && (
//                       <div className="flex items-center text-blue-400">
//                         <Brain className="h-4 w-4 mr-1 animate-pulse" />
//                         <span className="text-sm">Thinking</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* AI Avatar Component */}
//                 <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg overflow-hidden">
//                   <RealisticAIAvatar
//                     personality={selectedPersonality}
//                     isSpeaking={isSpeaking}
//                     isLoading={isLoading}
//                     emotion={avatarState.emotion}
//                     eyeDirection={avatarState.eyeDirection}
//                     currentText={currentQuestion}
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Conversation Area */}
//             <Card className="bg-black/40 border-white/10 backdrop-blur-md flex-1">
//               <CardContent className="p-4 h-full flex flex-col">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-white font-semibold">Interview Conversation</h3>
//                   {!isInterviewStarted ? (
//                     <Button 
//                       onClick={startInterview} 
//                       className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-6"
//                       size="sm"
//                     >
//                       <Play className="h-4 w-4 mr-2" />
//                       Start Interview
//                     </Button>
//                   ) : (
//                     <Button 
//                       onClick={endInterview} 
//                       variant="destructive" 
//                       size="sm"
//                       className="px-6"
//                     >
//                       <Square className="h-4 w-4 mr-2" />
//                       End Interview
//                     </Button>
//                   )}
//                 </div>

//                 {/* Messages Container */}
//                 <div className="flex-1 min-h-[5rem] max-h-[17rem]  overflow-y-scroll space-y-3 pr-2">
//                   <AnimatePresence>
//                     {/* {console.log("Conversation: ", conversation)} */}
//                     {conversation.map((message, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -20, scale: 0.95 }}
//                         transition={{ duration: 0.3 }}
//                         className={`flex ${message.type === "user" ? "justify-end" : message.type === "instruction" ? "hidden" : "justify-start"}`}
//                       >
//                         <div
//                           className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm ${
//                             message.type === "user" 
//                               ? "bg-gradient-to-r from-blue-500/80 to-cyan-500/80 text-white ml-4" 
//                               : "bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white mr-4"
//                           }`}
//                         >
//                           <div className="flex items-center mb-2">
//                             {message.type === "user" ? (
//                               <User className="h-4 w-4 mr-2" />
//                             ) : (
//                               <Bot className="h-4 w-4 mr-2" />
//                             )}
//                             <span className="font-medium text-sm opacity-90">
//                               {message.type === "user" ? "You" : "AI Interviewer"}
//                             </span>
//                             {message.confidence && message.confidence < 0.8 && (
//                               <span className="ml-2 text-xs opacity-70">(Low confidence)</span>
//                             )}
//                           </div>
//                           <p className="text-sm leading-relaxed">{message.content}</p>
//                           <div className="text-xs opacity-60 mt-2">
//                             {new Date(message.timestamp).toLocaleTimeString()}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>

//                   {isProcessingResponse && (
//                     <motion.div 
//                       initial={{ opacity: 0 }} 
//                       animate={{ opacity: 1 }} 
//                       className="flex justify-start"
//                     >
//                       <div className="bg-gradient-to-r from-purple-500/60 to-pink-500/60 text-white p-4 rounded-2xl max-w-[85%] mr-4 backdrop-blur-sm">
//                         <div className="flex items-center">
//                           <Bot className="h-4 w-4 mr-2" />
//                           <span className="font-medium text-sm opacity-90">AI Interviewer</span>
//                         </div>
//                         <div className="flex items-center mt-2">
//                           <div className="flex space-x-1">
//                             {[...Array(3)].map((_, i) => (
//                               <div
//                                 key={i}
//                                 className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
//                                 style={{ animationDelay: `${i * 0.2}s` }}
//                               />
//                             ))}
//                           </div>
//                           <span className="ml-3 text-sm opacity-80">Processing your response...</span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* Welcome Message */}
//                   {!isInterviewStarted && conversation.length === 0 && (
//                     <div className="text-center text-white/70 py-12">
//                       <motion.div
//                         animate={{ 
//                           scale: [1, 1.05, 1],
//                           rotate: [0, 5, -5, 0]
//                         }}
//                         transition={{ 
//                           duration: 4,
//                           repeat: Infinity,
//                           ease: "easeInOut"
//                         }}
//                       >
//                         <Brain className="h-16 w-16 mx-auto mb-4 text-purple-400" />
//                       </motion.div>
//                       <h3 className="text-xl font-semibold mb-3">Ready for Your AI Interview?</h3>
//                       <p className="text-sm max-w-md mx-auto leading-relaxed">
//                         I'll conduct a personalized interview based on your resume for the{" "}
//                         <span className="text-blue-400 font-medium">{resumeData.roleAppliedFor}</span> position. 
//                         Click "Start Interview" when you're ready to begin.
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Mic, MicOff, Video, VideoOff, Play, Pause, Square, Bot, User, ArrowLeft } from "lucide-react"
// import { useRouter } from "next/navigation"

// export default function InterviewPage() {
//   const router = useRouter()
//   const videoRef = useRef(null)
//   const mediaStreamRef = useRef(null)
//   const recognitionRef = useRef(null)
//   const synthRef = useRef(null)

//   const [resumeData, setResumeData] = useState(null)
//   const [isInterviewStarted, setIsInterviewStarted] = useState(false)
//   const [currentQuestion, setCurrentQuestion] = useState("")
//   const [conversation, setConversation] = useState([])
//   const [isListening, setIsListening] = useState(false)
//   const [isMicOn, setIsMicOn] = useState(true)
//   const [isCameraOn, setIsCameraOn] = useState(true)
//   const [selectedVoice, setSelectedVoice] = useState("default")
//   const [isLoading, setIsLoading] = useState(false)
//   var questionCount;
//   const [userResponse, setUserResponse] = useState("")

//   const interviewerPersonalities = [
//     { value: "professional", label: "Professional & Formal", voice: "professional" },
//     { value: "friendly", label: "Friendly & Approachable", voice: "friendly" },
//     { value: "technical", label: "Technical Expert", voice: "technical" },
//     { value: "senior", label: "Senior Manager", voice: "senior" },
//   ]

//   useEffect(() => {
//     // Load resume data from localStorage
//     const savedData = localStorage.getItem("resumeData")
//     console.log("local from useeffect : ", savedData)
//     if (savedData) {
//       setResumeData(JSON.parse(savedData))
//     } else {
//       router.push("/")
//     }
//     questionCount = 0;

//     // Initialize camera and microphone
//     initializeMedia()

//     // Initialize speech recognition
//     initializeSpeechRecognition()

//     return () => {
//       if (mediaStreamRef.current) {
//         mediaStreamRef.current.getTracks().forEach((track) => track.stop())
//       }
//     }
//   }, [])

//   const initializeMedia = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       })
//       mediaStreamRef.current = stream
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//       }
//     } catch (error) {
//       console.error("Error accessing media devices:", error)
//     }
//   }

//   const initializeSpeechRecognition = () => {
//     if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
//       recognitionRef.current = new SpeechRecognition()
//       recognitionRef.current.continuous = true
//       recognitionRef.current.interimResults = true
//       recognitionRef.current.lang = "en-US"

//       recognitionRef.current.onresult = (event) => {
//         let finalTranscript = ""
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           if (event.results[i].isFinal) {
//             finalTranscript += event.results[i][0].transcript
//           }
//         }
//         if (finalTranscript) {
//           setUserResponse(finalTranscript)
//           handleUserResponse(finalTranscript)
//         }
//       }

//       recognitionRef.current.onerror = (event) => {
//         console.error("Speech recognition error:", event.error)
//         setIsListening(false)
//       }
//     }
//   }

//   const speakText = (text) => {
//     if ("speechSynthesis" in window) {
//       const utterance = new SpeechSynthesisUtterance(text)
//       const voices = speechSynthesis.getVoices()

//       // Select voice based on personality
//       let selectedVoiceObj =
//         voices.find(
//           (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("male"),
//         ) || voices[0]

//       if (selectedVoice === "friendly") {
//         selectedVoiceObj = voices.find((voice) => voice.name.toLowerCase().includes("female")) || selectedVoiceObj
//         utterance.pitch = 1.2
//         utterance.rate = 0.9
//       } else if (selectedVoice === "professional") {
//         utterance.pitch = 1.0
//         utterance.rate = 0.8
//       } else if (selectedVoice === "technical") {
//         selectedVoiceObj = voices.find((voice) => voice.name.toLowerCase().includes("male")) || selectedVoiceObj
//         utterance.pitch = 0.9
//         utterance.rate = 0.85
//       }

//       utterance.voice = selectedVoiceObj
//       utterance.volume = 0.8

//       speechSynthesis.speak(utterance)
//     }
//   }

//   const generateQuestion = async (context = "") => {
//     setIsLoading(true)
//     try {
//       setResumeData( JSON.parse(localStorage.getItem("resumeData")))

//       console.log("local from generate : ", JSON.parse(localStorage.getItem("resumeData")))
//       console.log("----------------------------------");
//       const response = await fetch("/api/generate-question", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           resumeData :  JSON.parse(localStorage.getItem("resumeData")),
//           conversation,
//           questionCount,
//           context,
//           personality: selectedVoice,
//         }),
//       })
//       console.log("++++++++++++++++++++++++++++");

//       const data = await response.json()
//       console.log("this is data " ,data)
//       if (data.question) {
//         const newQuestion = data.question
//         setCurrentQuestion(newQuestion)
//         setConversation((prev) => [...prev, { type: "ai", content: newQuestion }])
//         speakText(newQuestion)
//         questionCount = questionCount + 1;
//         console.log("Coming here with question count : ", questionCount)
//       }
//     } catch (error) {
//       console.error("Error generating question:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleUserResponse = async (response) => {
//     setIsListening(false)
//     setConversation((prev) => [...prev, { type: "user", content: response }])

//     // Generate next question after a short delay
//     setTimeout(() => {
//       if (questionCount < 8) {
//         // Limit to 8 questions
//         generateQuestion(response)
//       } else {
//         endInterview()
//       }
//     }, 2000)
//   }

//   const startInterview = () => {
//     setIsInterviewStarted(true)
//     generateQuestion()
//   }

//   const endInterview = () => {
//     setIsInterviewStarted(false)
//     if (recognitionRef.current) {
//       recognitionRef.current.stop()
//     }
//     // Save interview data and redirect to report
//     localStorage.setItem(
//       "interviewData",
//       JSON.stringify({
//         conversation,
//         resumeData,
//         completedAt: new Date().toISOString(),
//       }),
//     )
//     router.push("/report")
//   }

//   const toggleMic = () => {
//     setIsMicOn(!isMicOn)
//     if (mediaStreamRef.current) {
//       const audioTrack = mediaStreamRef.current.getAudioTracks()[0]
//       if (audioTrack) {
//         audioTrack.enabled = !isMicOn
//       }
//     }
//   }

//   const toggleCamera = () => {
//     setIsCameraOn(!isCameraOn)
//     if (mediaStreamRef.current) {
//       const videoTrack = mediaStreamRef.current.getVideoTracks()[0]
//       if (videoTrack) {
//         videoTrack.enabled = !isCameraOn
//       }
//     }
//   }

//   const startListening = () => {
//     if (recognitionRef.current && isMicOn) {
//       setIsListening(true)
//       recognitionRef.current.start()
//     }
//   }

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       setIsListening(false)
//       recognitionRef.current.stop()
//     }
//   }

//   if (!resumeData) {
//     return <div>Loading...</div>
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//       {/* Header */}
//       <header className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <Button variant="ghost" onClick={() => router.push("/")} className="text-white hover:bg-white/10">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Resume
//           </Button>
//           <h1 className="text-xl font-bold text-white">AI Interview Session</h1>
//           <div className="flex items-center space-x-2">
//             <Select value={selectedVoice} onValueChange={setSelectedVoice}>
//               <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {interviewerPersonalities.map((personality) => (
//                   <SelectItem key={personality.value} value={personality.value}>
//                     {personality.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//           {/* Video Feed */}
//           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-1">
//             <Card className="bg-black/40 border-gray-600 backdrop-blur-sm">
//               <CardContent className="p-4">
//                 <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     muted
//                     playsInline
//                     className={`w-full h-full object-cover ${!isCameraOn ? "hidden" : ""}`}
//                   />
//                   {!isCameraOn && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                       <VideoOff className="h-12 w-12 text-gray-400" />
//                     </div>
//                   )}

//                   {/* Controls Overlay */}
//                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//                     <Button
//                       size="sm"
//                       variant={isMicOn ? "default" : "destructive"}
//                       onClick={toggleMic}
//                       className="rounded-full"
//                     >
//                       {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant={isCameraOn ? "default" : "destructive"}
//                       onClick={toggleCamera}
//                       className="rounded-full"
//                     >
//                       {isCameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Interview Controls */}
//                 <div className="mt-4 space-y-3">
//                   {!isInterviewStarted ? (
//                     <Button onClick={startInterview} className="w-full bg-green-600 hover:bg-green-700" size="lg">
//                       <Play className="h-4 w-4 mr-2" />
//                       Start Interview
//                     </Button>
//                   ) : (
//                     <div className="space-y-2">
//                       <div className="flex space-x-2">
//                         <Button
//                           onClick={isListening ? stopListening : startListening}
//                           variant={isListening ? "destructive" : "default"}
//                           className="flex-1"
//                           disabled={!isMicOn}
//                         >
//                           {isListening ? (
//                             <>
//                               <Pause className="h-4 w-4 mr-2" />
//                               Stop Speaking
//                             </>
//                           ) : (
//                             <>
//                               <Mic className="h-4 w-4 mr-2" />
//                               Start Speaking
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                       <Button onClick={endInterview} variant="destructive" className="w-full">
//                         <Square className="h-4 w-4 mr-2" />
//                         End Interview
//                       </Button>
//                     </div>
//                   )}

//                   {isListening && (
//                     <div className="text-center">
//                       <motion.div
//                         animate={{ scale: [1, 1.1, 1] }}
//                         transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
//                         className="inline-flex items-center text-red-400"
//                       >
//                         <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
//                         Listening...
//                       </motion.div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Conversation */}
//           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
//             <Card className="bg-black/40 border-gray-600 backdrop-blur-sm h-[600px] flex flex-col">
//               <CardContent className="p-6 flex-1 flex flex-col">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-bold text-white">Interview Conversation</h2>
//                   <div className="text-sm text-gray-300">Question {questionCount}/8</div>
//                 </div>

//                 {/* Conversation Area */}
//                 <div className="flex-1 overflow-y-auto space-y-4 mb-4">
//                   <AnimatePresence>
//                     {conversation.map((message, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
//                       >
//                         <div
//                           className={`max-w-[80%] p-4 rounded-lg ${
//                             message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
//                           }`}
//                         >
//                           <div className="flex items-center mb-2">
//                             {message.type === "user" ? (
//                               <User className="h-4 w-4 mr-2" />
//                             ) : (
//                               <Bot className="h-4 w-4 mr-2" />
//                             )}
//                             <span className="font-semibold">{message.type === "user" ? "You" : "AI Interviewer"}</span>
//                           </div>
//                           <p className="text-sm leading-relaxed">{message.content}</p>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>

//                   {isLoading && (
//                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
//                       <div className="bg-gray-700 text-gray-100 p-4 rounded-lg max-w-[80%]">
//                         <div className="flex items-center">
//                           <Bot className="h-4 w-4 mr-2" />
//                           <span className="font-semibold">AI Interviewer</span>
//                         </div>
//                         <div className="flex items-center mt-2">
//                           <div className="flex space-x-1">
//                             <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                             <div
//                               className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                               style={{ animationDelay: "0.1s" }}
//                             ></div>
//                             <div
//                               className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
//                               style={{ animationDelay: "0.2s" }}
//                             ></div>
//                           </div>
//                           <span className="ml-2 text-sm">Thinking...</span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </div>

//                 {/* Welcome Message */}
//                 {!isInterviewStarted && conversation.length === 0 && (
//                   <div className="text-center text-gray-300 py-8">
//                     <Bot className="h-12 w-12 mx-auto mb-4 text-blue-400" />
//                     <h3 className="text-lg font-semibold mb-2">Ready to start your interview?</h3>
//                     <p className="text-sm">
//                       Click "Start Interview" to begin. I'll ask you questions based on your resume for the{" "}
//                       {resumeData.roleAppliedFor} position.
//                     </p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   )
// }