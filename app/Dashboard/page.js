"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Moon, 
  Sun, 
  Brain, 
  Target, 
  MessageSquare, 
  Users, 
  Star,
  ArrowRight,
  Play,
  BarChart3,
  Shield,
  Clock,
  Award,
  LogOut,
  Zap,
  TrendingUp
} from "lucide-react"

export default function Dashboard() {
  const [theme, setTheme] = useState("dark")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [trail, setTrail] = useState([])
  const [lightning, setLightning] = useState([])
  const containerRef = useRef(null)
  
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 100])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 200, 400], [1, 0.5, 0])

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 200 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Mouse trail effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
      
      setTrail(prev => [...prev.slice(-20), { 
        x: e.clientX, 
        y: e.clientY, 
        id: Date.now() 
      }])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Lightning effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (Math.random() > 0.95) {
        const newLightning = {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: 0
        }
        setLightning(prev => [...prev, newLightning])
        setTimeout(() => {
          setLightning(prev => prev.filter(l => l.id !== newLightning.id))
        }, 1000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const MagneticButton = ({ children, className, onClick }) => {
    const ref = useRef(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      setPosition({ x: x * 0.3, y: y * 0.3 })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
       
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        onMouseEnter={() => setCursorVariant("button")}
        onMouseLeave={() => {setCursorVariant("default") ; handleMouseLeave()}}
      >
        <Button className={className} onClick={onClick}>
          {children}
        </Button>
      </motion.div>
    )
  }

  const cursorVariants = {
    default: {
      scale: 1,
      backgroundColor: theme === "dark" ? "rgba(6, 182, 212, 0.5)" : "rgba(59, 130, 246, 0.5)",
    },
    button: {
      scale: 2,
      backgroundColor: theme === "dark" ? "rgba(34, 211, 238, 0.3)" : "rgba(96, 165, 250, 0.3)",
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${
        theme === "dark" 
          ? "bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950" 
          : "bg-gradient-to-br from-sky-100 via-blue-200 to-cyan-200"
      }`}
    >
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        variants={cursorVariants}
        animate={cursorVariant}
      />

      {/* Mouse Trail Glow */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className={`fixed w-2 h-2 rounded-full pointer-events-none ${
            theme === "dark" ? "bg-cyan-400" : "bg-blue-500"
          }`}
          style={{
            left: point.x,
            top: point.y,
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.02 }}
        />
      ))}

      {/* Lightning Effects */}
      {lightning.map((bolt) => (
        <motion.div
          key={bolt.id}
          className={`fixed w-1 ${theme === "dark" ? "bg-cyan-400" : "bg-blue-600"} pointer-events-none z-40`}
          style={{
            left: bolt.x,
            top: bolt.y,
            height: "100vh",
            boxShadow: `0 0 20px ${theme === "dark" ? "#22d3ee" : "#2563eb"}`,
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 0] }}
          transition={{ duration: 0.4 }}
        />
      ))}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              theme === "dark" ? "bg-cyan-400/30" : "bg-blue-400/30"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Orbs with Parallax */}
      <motion.div
        className={`absolute top-20 left-10 w-96 h-96 rounded-full opacity-20 blur-3xl ${
          theme === "dark" 
            ? "bg-gradient-to-r from-cyan-400 to-blue-600" 
            : "bg-gradient-to-r from-blue-300 to-cyan-400"
        }`}
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className={`absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl ${
          theme === "dark"
            ? "bg-gradient-to-r from-purple-600 to-cyan-500"
            : "bg-gradient-to-r from-blue-400 to-purple-400"
        }`}
        style={{ y: y2 }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* SVG Line Drawing Background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M0,100 Q250,50 500,100 T1000,100"
          stroke={theme === "dark" ? "#22d3ee" : "#3b82f6"}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M0,200 Q250,150 500,200 T1000,200"
          stroke={theme === "dark" ? "#06b6d4" : "#60a5fa"}
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
        />
      </svg>

      {/* Header */}
      <motion.header 
        className={`relative z-10 border-b backdrop-blur-xl ${
          theme === "dark"
            ? "border-cyan-900/50 bg-slate-950/50"
            : "border-blue-300/50 bg-white/30"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ opacity }}
      >
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ 
                rotate: 360,
                filter: [
                  "drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))",
                  "drop-shadow(0 0 16px rgba(6, 182, 212, 1))",
                  "drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))",
                ]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                filter: { duration: 2, repeat: Infinity }
              }}
            >
              <Brain className={`h-10 w-10 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`} />
            </motion.div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              theme === "dark"
                ? "from-cyan-400 to-blue-400"
                : "from-blue-600 to-cyan-600"
            }`}>
              AI Resume Interviewer
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <MagneticButton
              className={`rounded-full ${
                theme === "dark"
                  ? "bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50"
                  : "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50"
              } border backdrop-blur-sm`}
              onClick={() => {}}
            >
              <LogOut className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`} />
            </MagneticButton>
            
            <MagneticButton
              className={`rounded-full ${
                theme === "dark"
                  ? "bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50"
                  : "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50"
              } border backdrop-blur-sm`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <motion.div
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.5 }}
              >
                {theme === "dark" ? 
                  <Moon className="h-5 w-5 text-cyan-400" /> : 
                  <Sun className="h-5 w-5 text-blue-600" />
                }
              </motion.div>
            </MagneticButton>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.section
          className="py-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className={`text-7xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-8 ${
              theme === "dark"
                ? "from-cyan-400 via-blue-400 to-purple-400"
                : "from-blue-600 via-cyan-600 to-purple-600"
            }`}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.span
              animate={{
                textShadow: [
                  `0 0 20px ${theme === "dark" ? "rgba(6, 182, 212, 0.5)" : "rgba(37, 99, 235, 0.5)"}`,
                  `0 0 40px ${theme === "dark" ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)"}`,
                  `0 0 20px ${theme === "dark" ? "rgba(6, 182, 212, 0.5)" : "rgba(37, 99, 235, 0.5)"}`,
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Ace Your Next Interview
            </motion.span>
          </motion.h2>
          
          <motion.div
            className="flex items-center justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Star className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`} />
            </motion.div>
            <p className={`text-2xl font-medium ${
              theme === "dark" ? "text-cyan-100" : "text-blue-900"
            }`}>
              AI-Powered Interview Practice Platform
            </p>
            <motion.div
              animate={{ rotate: [0, -360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Star className={`h-6 w-6 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`} />
            </motion.div>
          </motion.div>

          <motion.p
            className={`text-xl max-w-4xl mx-auto leading-relaxed mb-12 ${
              theme === "dark" ? "text-cyan-200/80" : "text-blue-800/80"
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Transform your interview preparation with our advanced AI system. Get personalized questions, 
            real-time feedback, and detailed performance analytics to land your dream job.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <MagneticButton
              className={`relative overflow-hidden px-12 py-6 text-xl font-bold shadow-2xl ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 shadow-cyan-500/25"
                  : "bg-gradient-to-r from-blue-500 via-cyan-600 to-purple-600 hover:from-blue-600 hover:via-cyan-700 hover:to-purple-700 shadow-blue-500/25"
              } text-white`}
              onClick={() => {}}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 400] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <Play className="h-6 w-6" />
                Get Started Now
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="h-6 w-6" />
                </motion.div>
              </span>
            </MagneticButton>
            
            <MagneticButton
              className={`px-8 py-6 text-lg font-semibold backdrop-blur-sm border-2 ${
                theme === "dark"
                  ? "bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/50 hover:border-cyan-400 text-cyan-100"
                  : "bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 hover:border-blue-600 text-blue-900"
              }`}
              onClick={() => {}}
            >
              Watch Demo
            </MagneticButton>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={`text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-6 ${
              theme === "dark"
                ? "from-cyan-400 to-blue-400"
                : "from-blue-600 to-cyan-600"
            }`}>
              Why Choose Our Platform?
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Smart AI Analysis",
                description: "Advanced AI analyzes your resume and generates personalized questions.",
                gradient: theme === "dark" ? "from-cyan-500 to-blue-600" : "from-blue-500 to-cyan-500",
              },
              {
                icon: MessageSquare,
                title: "Real-Time Feedback",
                description: "Get instant, detailed feedback on your answers and communication skills.",
                gradient: theme === "dark" ? "from-blue-500 to-purple-600" : "from-cyan-500 to-purple-500",
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Track progress with comprehensive analytics and identify areas to improve.",
                gradient: theme === "dark" ? "from-purple-500 to-cyan-500" : "from-purple-500 to-blue-500",
              },
              {
                icon: Target,
                title: "Role-Specific Questions",
                description: "Practice with questions designed for your target position and industry.",
                gradient: theme === "dark" ? "from-cyan-600 to-teal-500" : "from-blue-600 to-teal-500",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Practice anytime, anywhere with our always-ready AI interviewer.",
                gradient: theme === "dark" ? "from-blue-600 to-cyan-600" : "from-cyan-600 to-blue-600",
              },
              {
                icon: Shield,
                title: "Privacy Focused",
                description: "Your data is secure and private. We never share your information.",
                gradient: theme === "dark" ? "from-teal-500 to-cyan-500" : "from-teal-600 to-cyan-600",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring"
                }}
                whileHover={{ 
                  y: -15,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ perspective: 1000 }}
              >
                <Card className={`h-full backdrop-blur-xl border ${
                  theme === "dark"
                    ? "bg-slate-900/40 border-cyan-500/30 hover:bg-slate-900/60 hover:border-cyan-400/50"
                    : "bg-white/40 border-blue-300/30 hover:bg-white/60 hover:border-blue-400/50"
                } transition-all duration-300`}>
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`inline-flex p-6 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.15,
                        boxShadow: `0 0 30px ${theme === "dark" ? "rgba(6, 182, 212, 0.6)" : "rgba(37, 99, 235, 0.6)"}`
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h4 className={`text-2xl font-bold mb-4 ${
                      theme === "dark" ? "text-cyan-100" : "text-blue-900"
                    }`}>{feature.title}</h4>
                    <p className={theme === "dark" ? "text-cyan-200/80" : "text-blue-800/80"}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section with Lightning */}
        <motion.section className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Interviews", icon: Users },
              { number: "95%", label: "Success Rate", icon: TrendingUp },
              { number: "4.9/5", label: "User Rating", icon: Star },
              { number: "24/7", label: "Available", icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <Card className={`backdrop-blur-xl border text-center ${
                  theme === "dark"
                    ? "bg-slate-900/50 border-cyan-500/40"
                    : "bg-white/50 border-blue-300/40"
                }`}>
                  <CardContent className="p-6">
                    <motion.div
                      animate={{
                        y: [-5, 5, -5],
                        filter: [
                          `drop-shadow(0 0 10px ${theme === "dark" ? "rgba(6, 182, 212, 0.5)" : "rgba(37, 99, 235, 0.5)"})`,
                          `drop-shadow(0 0 20px ${theme === "dark" ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)"})`,
                          `drop-shadow(0 0 10px ${theme === "dark" ? "rgba(6, 182, 212, 0.5)" : "rgba(37, 99, 235, 0.5)"})`,
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <stat.icon className={`h-8 w-8 mx-auto mb-3 ${
                        theme === "dark" ? "text-cyan-400" : "text-blue-600"
                      }`} />
                    </motion.div>
                    <motion.div
                      className={`text-4xl font-bold mb-2 ${
                        theme === "dark" ? "text-cyan-100" : "text-blue-900"
                      }`}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.div>
                    <p className={theme === "dark" ? "text-cyan-300" : "text-blue-700"}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Card className={`backdrop-blur-xl border p-12 ${
            theme === "dark"
              ? "bg-slate-900/50 border-cyan-500/40"
              : "bg-white/50 border-blue-300/40"
          }`}>
            <CardContent className="text-center space-y-8">
              <motion.div
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0],
                  filter: [
                    `drop-shadow(0 0 20px ${theme === "dark" ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)"})`,
                    `drop-shadow(0 0 40px ${theme === "dark" ? "rgba(6, 182, 212, 1)" : "rgba(37, 99, 235, 1)"})`,
                    `drop-shadow(0 0 20px ${theme === "dark" ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)"})`,
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Brain className={`h-20 w-20 mx-auto mb-6 ${
                  theme === "dark" ? "text-cyan-400" : "text-blue-600"
                }`} />
              </motion.div>
              
              <h3 className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                theme === "dark"
                  ? "from-cyan-400 to-blue-400"
                  : "from-blue-600 to-cyan-600"
              }`}>
                Ready to Transform Your Interview Skills?
              </h3>
              
              <p className={`text-xl max-w-2xl mx-auto ${
                theme === "dark" ? "text-cyan-200/80" : "text-blue-800/80"
              }`}>
                Join the revolution in interview preparation. Start practicing with AI-powered questions 
                and get the confidence you need to succeed.
              </p>
              
              <MagneticButton
                className={`relative overflow-hidden px-16 py-8 text-2xl font-bold shadow-2xl ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 shadow-cyan-500/25"
                    : "bg-gradient-to-r from-blue-500 via-cyan-600 to-purple-600 hover:from-blue-600 hover:via-cyan-700 hover:to-purple-700 shadow-blue-500/25"
                } text-white`}
                onClick={() => {}}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-200, 400] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center gap-4">
                  <Play className="h-8 w-8" />
                  Start Your Journey
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ArrowRight className="h-8 w-8" />
                  </motion.div>
                </span>
              </MagneticButton>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className={`relative z-10 border-t backdrop-blur-xl mt-20 ${
          theme === "dark"
            ? "border-cyan-900/50 bg-slate-950/50"
            : "border-blue-300/50 bg-white/30"
        }`}
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    filter: [
                      `drop-shadow(0 0 8px ${theme === "dark" ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)"})`,
                      `drop-shadow(0 0 16px ${theme === "dark" ? "rgba(6, 182, 212, 1)" : "rgba(37, 99, 235, 1)"})`,
                      `drop-shadow(0 0 8px ${theme === "dark" ? "rgba(6, 182, 212, 0.8)" : "rgba(37, 99, 235, 0.8)"})`,
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    filter: { duration: 2, repeat: Infinity }
                  }}
                >
                  <Brain className={`h-8 w-8 ${theme === "dark" ? "text-cyan-400" : "text-blue-600"}`} />
                </motion.div>
                <h5 className={`text-xl font-bold ${
                  theme === "dark" ? "text-cyan-100" : "text-blue-900"
                }`}>AI Resume Interviewer</h5>
              </div>
              <p className={`leading-relaxed ${
                theme === "dark" ? "text-cyan-300/70" : "text-blue-700/70"
              }`}>
                Empowering careers through intelligent interview practice and AI-driven feedback.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h6 className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-cyan-100" : "text-blue-900"
              }`}>Features</h6>
              <ul className="space-y-2">
                {["AI Interview Questions", "Real-time Feedback", "Performance Analytics", "Career Guidance"].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`cursor-pointer ${
                      theme === "dark" ? "text-cyan-300/70 hover:text-cyan-200" : "text-blue-700/70 hover:text-blue-900"
                    }`}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h6 className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-cyan-100" : "text-blue-900"
              }`}>Company</h6>
              <ul className="space-y-2">
                {["About Us", "Careers", "Contact", "Privacy Policy"].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`cursor-pointer ${
                      theme === "dark" ? "text-cyan-300/70 hover:text-cyan-200" : "text-blue-700/70 hover:text-blue-900"
                    }`}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h6 className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-cyan-100" : "text-blue-900"
              }`}>Support</h6>
              <ul className="space-y-2">
                {["Help Center", "Documentation", "Community", "Feedback"].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`cursor-pointer ${
                      theme === "dark" ? "text-cyan-300/70 hover:text-cyan-200" : "text-blue-700/70 hover:text-blue-900"
                    }`}
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            className={`border-t pt-8 text-center ${
              theme === "dark" ? "border-cyan-900/50" : "border-blue-300/50"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className={`text-lg mb-4 ${
              theme === "dark" ? "text-cyan-300/70" : "text-blue-700/70"
            }`}>
              © 2025 AI Resume Interviewer. Empowering your career journey with intelligent interview practice.
            </p>
            <div className="flex justify-center gap-6">
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                  }}
                  className={`transition-colors ${
                    theme === "dark" 
                      ? "text-cyan-400/60 hover:text-cyan-300" 
                      : "text-blue-600/60 hover:text-blue-800"
                  }`}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}



// import { motion, useMotionValue, useTransform } from "framer-motion";
// import React, { useState, useEffect, useRef } from 'react';
// import { useEffect, useState } from "react";

/* ------------------ CONFIG ------------------ */
// const COLORS = {
//   bg: "#0B1020",
//   card: "#0F172A",
//   cyan: "#22D3EE",
//   purple: "#7C7CFF",
//   white: "#F8FAFC",
// };

// import { Mic, Brain, Zap, Target, TrendingUp, Eye, Activity } from 'lucide-react';

// const AIInterviewerDashboard = () => {
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [scrollY, setScrollY] = useState(0);
//   const [isHoveringCTA, setIsHoveringCTA] = useState(false);
//   const [showInterview, setShowInterview] = useState(false);
//   const [pulseIntensity, setPulseIntensity] = useState(1);
//   const [aiState, setAiState] = useState('idle');
//   const [confidence, setConfidence] = useState(0);
//   const [clarity, setClarity] = useState(0);
//   const canvasRef = useRef(null);
//   const ctaRef = useRef(null);

//   // Canvas Neural Network Animation
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const particles = [];
//     const particleCount = 100;
    
//     class Particle {
//       constructor() {
//         this.x = Math.random() * canvas.width;
//         this.y = Math.random() * canvas.height;
//         this.vx = (Math.random() - 0.5) * 0.5;
//         this.vy = (Math.random() - 0.5) * 0.5;
//         this.radius = Math.random() * 2;
//       }
      
//       update() {
//         this.x += this.vx;
//         this.y += this.vy;
        
//         if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
//         if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
//       }
      
//       draw() {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//         ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
//         ctx.fill();
//       }
//     }
    
//     for (let i = 0; i < particleCount; i++) {
//       particles.push(new Particle());
//     }
    
//     function connectParticles() {
//       for (let i = 0; i < particles.length; i++) {
//         for (let j = i + 1; j < particles.length; j++) {
//           const dx = particles[i].x - particles[j].x;
//           const dy = particles[i].y - particles[j].y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
          
//           if (distance < 150) {
//             ctx.beginPath();
//             ctx.strokeStyle = `rgba(34, 211, 238, ${0.2 * (1 - distance / 150)})`;
//             ctx.lineWidth = 0.5;
//             ctx.moveTo(particles[i].x, particles[i].y);
//             ctx.lineTo(particles[j].x, particles[j].y);
//             ctx.stroke();
//           }
//         }
//       }
//     }
    
//     function animate() {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
      
//       particles.forEach(particle => {
//         particle.update();
//         particle.draw();
//       });
      
//       connectParticles();
//       requestAnimationFrame(animate);
//     }
    
//     animate();
    
//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
      
//       if (ctaRef.current) {
//         const rect = ctaRef.current.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;
//         const distance = Math.sqrt(
//           Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
//         );
        
//         if (distance < 200) {
//           setPulseIntensity(1 + (200 - distance) / 200);
//         } else {
//           setPulseIntensity(1);
//         }
//       }
//     };

//     const handleScroll = () => setScrollY(window.scrollY);

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('scroll', handleScroll);
    
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     if (showInterview) {
//       setAiState('analyzing');
//       setTimeout(() => setAiState('speaking'), 1000);
      
//       let confInterval = setInterval(() => {
//         setConfidence(prev => {
//           if (prev >= 87) {
//             clearInterval(confInterval);
//             return 87;
//           }
//           return prev + 1;
//         });
//       }, 30);
      
//       let clarInterval = setInterval(() => {
//         setClarity(prev => {
//           if (prev >= 92) {
//             clearInterval(clarInterval);
//             return 92;
//           }
//           return prev + 1;
//         });
//       }, 30);
//     }
//   }, [showInterview]);

//   const handleStartInterview = () => {
//     setShowInterview(true);
//     setTimeout(() => {
//       document.getElementById('interview-section')?.scrollIntoView({ 
//         behavior: 'smooth' 
//       });
//     }, 100);
//   };

//   return (
//     <div className="relative min-h-screen bg-[#0A0E1A] text-white overflow-hidden">
//       {/* Animated Neural Network Canvas */}
//       <canvas 
//         ref={canvasRef}
//         className="fixed inset-0 pointer-events-none opacity-40"
//         style={{ zIndex: 1 }}
//       />

//       {/* Gradient Orbs Background */}
//       <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
//         <div 
//           className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
//           style={{
//             background: 'radial-gradient(circle, #22D3EE, transparent)',
//             top: '10%',
//             left: '20%',
//             animation: 'float 20s ease-in-out infinite'
//           }}
//         />
//         <div 
//           className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-15"
//           style={{
//             background: 'radial-gradient(circle, #7C3AED, transparent)',
//             bottom: '10%',
//             right: '10%',
//             animation: 'float 25s ease-in-out infinite reverse'
//           }}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10">
//         {/* Hero Section */}
//         <section className="min-h-screen flex items-center justify-center px-6 relative">
//           {/* 3D Holographic AI Core */}
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="relative w-[500px] h-[500px]">
//               {/* Outer Rings */}
//               {[0, 1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="absolute inset-0 border-2 rounded-full"
//                   style={{
//                     borderColor: `rgba(34, 211, 238, ${0.3 - i * 0.05})`,
//                     transform: `scale(${1 - i * 0.15}) rotateX(60deg)`,
//                     animation: `spin ${10 + i * 5}s linear infinite`,
//                     transformStyle: 'preserve-3d'
//                   }}
//                 />
//               ))}
              
//               {/* Central Core */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative">
//                   <div 
//                     className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 blur-2xl animate-pulse"
//                     style={{
//                       animation: 'pulse 3s ease-in-out infinite',
//                       transform: `scale(${pulseIntensity})`
//                     }}
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Brain className="w-20 h-20 text-cyan-300 animate-pulse" />
//                   </div>
//                 </div>
//               </div>

//               {/* Orbiting Data Points */}
//               {[...Array(12)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="absolute w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400"
//                   style={{
//                     top: '50%',
//                     left: '50%',
//                     animation: `orbit ${8 + i}s linear infinite`,
//                     animationDelay: `${i * 0.5}s`,
//                     transform: `rotate(${i * 30}deg) translateX(200px) rotate(-${i * 30}deg)`
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Hero Content */}
//           <div className="relative z-20 text-center max-w-6xl">
//             {/* Glitch Effect Title */}
//             <div className="mb-8 relative">
//               <h1 
//                 className="text-7xl md:text-8xl font-black mb-4 tracking-tight"
//                 style={{
//                   transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.005}px, ${(mousePos.y - window.innerHeight / 2) * 0.005}px)`
//                 }}
//               >
//                 <span className="relative inline-block">
//                   <span className="absolute inset-0 text-cyan-400 blur-sm opacity-50">
//                     AI INTERVIEWER
//                   </span>
//                   <span className="relative bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                     AI INTERVIEWER
//                   </span>
//                 </span>
//               </h1>
              
//               {/* Animated Waveform */}
//               <div className="flex justify-center gap-2 h-16 items-center mb-8">
//                 {[...Array(15)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="w-2 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full transition-all duration-300"
//                     style={{
//                       height: isHoveringCTA ? `${Math.random() * 100}%` : '30%',
//                       animation: `wave ${0.8 + Math.random() * 0.4}s ease-in-out infinite`,
//                       animationDelay: `${i * 0.1}s`
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
//               Experience Real Interview Pressure
//             </p>
//             <p className="text-xl text-cyan-400 mb-16 font-semibold">
//               Train Your Mind • Build Confidence • Master Responses
//             </p>

//             {/* Magnetic CTA Button */}
//             <div className="relative inline-block" ref={ctaRef}>
//               <button
//                 onClick={handleStartInterview}
//                 onMouseEnter={() => setIsHoveringCTA(true)}
//                 onMouseLeave={() => setIsHoveringCTA(false)}
//                 className="group relative px-16 py-8 text-2xl font-bold rounded-2xl overflow-hidden transition-all duration-500"
//                 style={{
//                   background: 'linear-gradient(135deg, #06B6D4, #8B5CF6, #EC4899)',
//                   boxShadow: isHoveringCTA 
//                     ? '0 0 100px rgba(34, 211, 238, 0.8), 0 0 50px rgba(139, 92, 246, 0.6)' 
//                     : '0 0 40px rgba(34, 211, 238, 0.4)',
//                   transform: `scale(${pulseIntensity})`,
//                   border: '2px solid rgba(255, 255, 255, 0.3)'
//                 }}
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" 
//                      style={{ animation: 'shimmer 2s infinite' }} />
                
//                 <span className="relative flex items-center justify-center gap-4">
//                   <Mic className={`w-8 h-8 ${isHoveringCTA ? 'animate-pulse' : ''}`} />
//                   <span>START AI INTERVIEW</span>
//                   <Zap className={`w-8 h-8 ${isHoveringCTA ? 'animate-pulse' : ''}`} />
//                 </span>
//               </button>
              
//               {isHoveringCTA && (
//                 <div className="absolute -bottom-8 left-0 right-0 text-center">
//                   <span className="text-sm text-cyan-400 animate-pulse">
//                     🎤 AI is ready to analyze you...
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Interview Simulation Section */}
//         {showInterview && (
//           <section id="interview-section" className="min-h-screen py-20 px-6">
//             <div className="max-w-7xl mx-auto">
//               <h2 className="text-6xl font-black text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                 LIVE AI ANALYSIS
//               </h2>

//               <div className="grid lg:grid-cols-2 gap-12">
//                 {/* AI Avatar */}
//                 <div className="relative">
//                   <div className="sticky top-20">
//                     <div className="relative w-full aspect-square rounded-3xl overflow-hidden border-4 border-cyan-500/30 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
//                       {/* AI Face */}
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="relative">
//                           <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 blur-3xl opacity-50 animate-pulse" />
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <Eye className="w-32 h-32 text-cyan-300" />
//                           </div>
//                         </div>
//                       </div>

//                       {/* Scanning Effect */}
//                       <div 
//                         className="absolute inset-0 border-t-4 border-cyan-400 opacity-50"
//                         style={{
//                           animation: 'scan 3s ease-in-out infinite'
//                         }}
//                       />

//                       {/* AI State */}
//                       <div className="absolute bottom-8 left-0 right-0 text-center">
//                         <div className="inline-block px-8 py-4 bg-black/50 backdrop-blur-xl rounded-full border border-cyan-500/50">
//                           <span className="text-2xl font-bold text-cyan-400">
//                             {aiState === 'analyzing' && '🧠 ANALYZING...'}
//                             {aiState === 'speaking' && '💬 INTERVIEWING...'}
//                             {aiState === 'idle' && '⚡ READY'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Metrics Dashboard */}
//                 <div className="space-y-8">
//                   {/* Real-time Scores */}
//                   <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-2 border-cyan-500/30">
//                     <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
//                       <Activity className="w-8 h-8 text-cyan-400" />
//                       Performance Metrics
//                     </h3>

//                     {/* Confidence */}
//                     <div className="mb-8">
//                       <div className="flex justify-between items-center mb-4">
//                         <span className="text-xl font-semibold text-gray-300">Confidence Level</span>
//                         <span className="text-4xl font-black text-cyan-400">{confidence}%</span>
//                       </div>
//                       <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
//                         <div 
//                           className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 rounded-full"
//                           style={{ 
//                             width: `${confidence}%`,
//                             boxShadow: '0 0 20px rgba(34, 211, 238, 0.8)'
//                           }}
//                         />
//                       </div>
//                     </div>

//                     {/* Clarity */}
//                     <div>
//                       <div className="flex justify-between items-center mb-4">
//                         <span className="text-xl font-semibold text-gray-300">Response Clarity</span>
//                         <span className="text-4xl font-black text-purple-400">{clarity}%</span>
//                       </div>
//                       <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
//                         <div 
//                           className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-300 rounded-full"
//                           style={{ 
//                             width: `${clarity}%`,
//                             boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)'
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Skills Analysis */}
//                   <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-2 border-purple-500/30">
//                     <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
//                       <Target className="w-8 h-8 text-purple-400" />
//                       Skill Detection
//                     </h3>
//                     <div className="flex flex-wrap gap-4">
//                       {['React.js', 'Node.js', 'System Design', 'SQL', 'DSA', 'Leadership'].map((skill, i) => (
//                         <div 
//                           key={i}
//                           className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 font-semibold text-lg animate-pulse"
//                           style={{ animationDelay: `${i * 0.2}s` }}
//                         >
//                           {skill}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Live Feedback */}
//                   <div className="p-8 rounded-3xl bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/30">
//                     <div className="flex items-start gap-4">
//                       <TrendingUp className="w-8 h-8 text-green-400 flex-shrink-0" />
//                       <div>
//                         <h4 className="text-2xl font-bold text-green-400 mb-2">Excellent Progress!</h4>
//                         <p className="text-gray-300 text-lg">
//                           Your responses show strong technical depth. Consider adding more specific examples from your experience.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) translateX(0px); }
//           33% { transform: translateY(-30px) translateX(20px); }
//           66% { transform: translateY(20px) translateX(-20px); }
//         }
//         @keyframes spin {
//           from { transform: rotateZ(0deg) rotateY(0deg); }
//           to { transform: rotateZ(360deg) rotateY(360deg); }
//         }
//         @keyframes orbit {
//           from { transform: rotate(0deg) translateX(200px) rotate(0deg); }
//           to { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
//         }
//         @keyframes wave {
//           0%, 100% { transform: scaleY(0.3); }
//           50% { transform: scaleY(1); }
//         }
//         @keyframes shimmer {
//           0% { transform: translateX(-100%); }
//           100% { transform: translateX(100%); }
//         }
//         @keyframes scan {
//           0% { top: 0%; opacity: 0; }
//           50% { opacity: 1; }
//           100% { top: 100%; opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AIInterviewerDashboard;
/* ------------------ MAIN PAGE ------------------ */
// export default function Dashboard() {
//   return (
//     <div
//       style={{ background: COLORS.bg, color: COLORS.white }}
//       className="min-h-screen overflow-hidden"
//     >
//       <BackgroundGrid />
//       <Particles />

//       <Hero />
//       <StartInterviewCTA />
//       <HowItWorks />
//       <LiveSimulation />
//       <IntelligenceShowcase />
//       <FeedbackSection />
//     </div>
//   );
// }

/* ------------------ HERO ------------------ */
function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const tx = useTransform(mx, [-300, 300], [-3, 3]);
  const ty = useTransform(my, [-300, 300], [-3, 3]);

  return (
    <section
      onMouseMove={(e) => {
        mx.set(e.clientX - window.innerWidth / 2);
        my.set(e.clientY - window.innerHeight / 2);
      }}
      className="relative h-screen flex items-center justify-center text-center"
    >
      <NeuralLines />

      <motion.div style={{ x: tx, y: ty }} className="z-10 max-w-3xl">
        <h1 className="text-5xl font-semibold leading-tight">
          Experience Interviews Before They Happen
        </h1>

        <p className="mt-4 text-slate-300">
          AI-driven interviews that train your confidence, clarity, and thinking.
        </p>

        <Waveform />
      </motion.div>

      <AICore />
    </section>
  );
}

/* ------------------ AI CORE ------------------ */
function AICore() {
  return (
    <motion.div
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      className="absolute w-72 h-72 rounded-full"
      style={{
        background: `radial-gradient(circle, ${COLORS.cyan}33, transparent 70%)`,
        boxShadow: `0 0 120px ${COLORS.cyan}66`,
      }}
    />
  );
}

/* ------------------ NEURAL LINES ------------------ */
function NeuralLines() {
  return (
    <svg className="absolute inset-0 opacity-20">
      <line x1="20%" y1="30%" x2="80%" y2="60%" stroke={COLORS.cyan} />
      <line x1="30%" y1="70%" x2="60%" y2="20%" stroke={COLORS.purple} />
    </svg>
  );
}

/* ------------------ WAVEFORM ------------------ */
function Waveform() {
  return (
    <div className="flex justify-center gap-1 mt-6">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ height: [6, 20, 6] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
          className="w-1 bg-cyan-400 rounded"
        />
      ))}
    </div>
  );
}

/* ------------------ CTA ------------------ */
function StartInterviewCTA() {
  return (
    <div className="flex justify-center my-24">
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        className="relative px-12 py-5 rounded-xl font-medium"
        style={{
          background: COLORS.cyan,
          color: "#020617",
          boxShadow: `0 0 40px ${COLORS.cyan}`,
        }}
      >
        🎙 Start Interview
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-cyan-200"
        >
          AI is listening…
        </motion.div>
      </motion.button>
    </div>
  );
}

/* ------------------ HOW IT WORKS ------------------ */
function HowItWorks() {
  const steps = ["Resume Upload", "AI Analysis", "Interview Begins"];

  return (
    <section className="max-w-6xl mx-auto py-24 grid grid-cols-3 gap-10">
      {steps.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="p-6 rounded-xl"
          style={{ background: COLORS.card }}
        >
          <h3 className="text-lg font-semibold">{step}</h3>
          <p className="text-slate-400 mt-2">
            Intelligent automation designed to mirror real interviews.
          </p>
        </motion.div>
      ))}
    </section>
  );
}

/* ------------------ LIVE SIMULATION ------------------ */
function LiveSimulation() {
  const [confidence, setConfidence] = useState(40);

  useEffect(() => {
    const id = setInterval(
      () => setConfidence((c) => Math.min(c + 1, 87)),
      120
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="max-w-4xl mx-auto py-24">
      <h2 className="text-3xl font-semibold mb-10">Live Interview Simulation</h2>

      <div className="space-y-4">
        <ChatBubble from="AI" text="Explain closures in JavaScript." />
        <ChatBubble from="You" text="Closures allow functions to access outer scope." />
      </div>

      <div className="mt-10">
        <p className="text-sm mb-2">Confidence</p>
        <div className="h-2 bg-slate-700 rounded">
          <motion.div
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded bg-cyan-400"
          />
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ from, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === "AI" ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl max-w-md ${
        from === "AI" ? "bg-purple-500/20" : "bg-cyan-500/20 ml-auto"
      }`}
    >
      {text}
    </motion.div>
  );
}

/* ------------------ INTELLIGENCE ------------------ */
function IntelligenceShowcase() {
  const skills = ["DSA", "React", "SQL", "System Design", "HR"];

  return (
    <section className="py-24 text-center">
      <h2 className="text-3xl font-semibold mb-12">AI Intelligence</h2>
      <div className="flex justify-center gap-6 flex-wrap">
        {skills.map((s) => (
          <motion.div
            key={s}
            whileHover={{ scale: 1.15 }}
            className="px-5 py-2 rounded-full"
            style={{
              border: `1px solid ${COLORS.cyan}`,
              boxShadow: `0 0 20px ${COLORS.cyan}66`,
            }}
          >
            {s}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------ FEEDBACK ------------------ */
function FeedbackSection() {
  return (
    <section className="max-w-6xl mx-auto py-24 grid grid-cols-2 gap-10">
      <FeedbackCard title="Confidence Low" color="#EF4444" />
      <FeedbackCard title="Excellent Answer" color="#22C55E" />
    </section>
  );
}

function FeedbackCard({ title, color }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity }}
      className="p-6 rounded-xl backdrop-blur-md"
      style={{
        background: "rgba(15,23,42,0.6)",
        border: `1px solid ${color}55`,
        boxShadow: `0 0 20px ${color}55`,
      }}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-slate-400 mt-2">
        AI-generated behavioral feedback based on responses.
      </p>
    </motion.div>
  );
}

/* ------------------ BACKGROUND ------------------ */
function Particles() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-10">
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
          }}
        />
      ))}
    </div>
  );
}

function BackgroundGrid() {
  return (
    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
}


// import React, { useEffect, useRef, useState } from "react";
// import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";

const BG = {
  page: "min-h-screen bg-[#0B1020] text-[#F8FAFC] overflow-x-hidden relative",
  grid: "pointer-events-none fixed inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top,_#22D3EE_0,_transparent_55%),radial-gradient(circle_at_bottom,_#7C7CFF_0,_transparent_55%)]",
};

const springConfig = { stiffness: 120, damping: 20, mass: 0.4 };

// export default function AiInterviewDashboard() {
//   // Cursor-driven headline + orb tilt
//   const [cursor, setCursor] = useState({ x: 0, y: 0 });
//   const containerRef = useRef(null);

//   const tiltX = useMotionValue(0);
//   const tiltY = useMotionValue(0);
//   const tiltXSpring = useSpring(tiltX, springConfig);
//   const tiltYSpring = useSpring(tiltY, springConfig);

//   const headlineX = useMotionValue(0);
//   const headlineY = useMotionValue(0);
//   const headlineXSpring = useSpring(headlineX, { stiffness: 70, damping: 20 });
//   const headlineYSpring = useSpring(headlineY, { stiffness: 70, damping: 20 });

//   useEffect(() => {
//     const handler = (e) => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const x = e.clientX - rect.left - rect.width / 2;
//       const y = e.clientY - rect.top - rect.height / 2;

//       // slight tilt
//       tiltX.set((y / rect.height) * -10);
//       tiltY.set((x / rect.width) * 10);

//       // cursor-aware headline (2–3px max)
//       headlineX.set((x / rect.width) * 6);
//       headlineY.set((y / rect.height) * 6);

//       setCursor({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", handler);
//     return () => window.removeEventListener("mousemove", handler);
//   }, [tiltX, tiltY, headlineX, headlineY]);

//   // Magnetic CTA
//   const ctaRef = useRef(null);
//   const ctaX = useMotionValue(0);
//   const ctaY = useMotionValue(0);
//   const ctaXSpring = useSpring(ctaX, springConfig);
//   const ctaYSpring = useSpring(ctaY, springConfig);
//   const [ctaActive, setCtaActive] = useState(false);
//   const [ctaListening, setCtaListening] = useState(false);

//   useEffect(() => {
//     const handler = (e) => {
//       if (!ctaRef.current) return;
//       const rect = ctaRef.current.getBoundingClientRect();
//       const distX = e.clientX - (rect.left + rect.width / 2);
//       const distY = e.clientY - (rect.top + rect.height / 2);
//       const radius = 140; // subtle pull radius

//       const distance = Math.sqrt(distX * distX + distY * distY);
//       if (distance < radius) {
//         setCtaActive(true);
//         const strength = 0.22; // magnetic pull strength (low for calm feel)
//         ctaX.set(distX * strength);
//         ctaY.set(distY * strength);
//       } else {
//         setCtaActive(false);
//         ctaX.set(0);
//         ctaY.set(0);
//       }
//     };

//     window.addEventListener("mousemove", handler);
//     return () => window.removeEventListener("mousemove", handler);
//   }, [ctaX, ctaY]);

//   // Scroll visibility hooks for sections
//   const howRef = useRef(null);
//   const howInView = useInView(howRef, { amount: 0.2, once: false });

//   const liveRef = useRef(null);
//   const liveInView = useInView(liveRef, { amount: 0.2, once: false });

//   const insightRef = useRef(null);
//   const insightInView = useInView(insightRef, { amount: 0.2, once: false });

//   const feedbackRef = useRef(null);
//   const feedbackInView = useInView(feedbackRef, { amount: 0.2, once: false });

//   // CTA click ripple
//   const [ripple, setRipple] = useState(false);
//   const handleStartInterview = () => {
//     setRipple(true);
//     setCtaListening(true);
//     setTimeout(() => {
//       setRipple(false);
//       // navigate to /interview or /form
//       // router.push("/form")
//     }, 900);
//   };

//   return (
//     <div className={BG.page}>
//       {/* Cyber grid + ambient particles */}
//       <AmbientBackground cursor={cursor} />

//       <div
//         ref={containerRef}
//         className="relative max-w-6xl mx-auto px-6 pt-12 pb-24 flex flex-col gap-24"
//       >
//         {/* HERO */}
//         <section className="relative flex flex-col md:flex-row items-center gap-12 md:gap-16">
//           {/* AI Core */}
//           <motion.div
//             style={{
//               rotateX: tiltXSpring,
//               rotateY: tiltYSpring,
//               transformStyle: "preserve-3d",
//             }}
//             className="relative w-full md:w-1/2 flex items-center justify-center"
//           >
//             <FloatingAICore />
//           </motion.div>

//           {/* Text + CTA */}
//           <div className="w-full md:w-1/2 space-y-8">
//             <motion.div
//               style={{
//                 x: headlineXSpring,
//                 y: headlineYSpring,
//               }}
//               className="space-y-4"
//             >
//               <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
//                 Experience Interviews Before They Happen
//               </h1>
//               <p className="text-sm md:text-base text-slate-300 max-w-md">
//                 AI-driven interviews that train your confidence, clarity, and thinking
//                 under the same pressure you&apos;ll face in real interviews.
//               </p>

//               {/* Voice waveform under headline */}
//               <CalmWaveform />
//             </motion.div>

//             {/* CTA + micro copy */}
//             <div className="space-y-3">
//               <motion.button
//                 ref={ctaRef}
//                 onClick={handleStartInterview}
//                 style={{
//                   x: ctaXSpring,
//                   y: ctaYSpring,
//                 }}
//                 className={`
//                   relative inline-flex items-center gap-3 px-7 py-3 rounded-full
//                   bg-cyan-500/10 border border-cyan-400/50
//                   text-sm md:text-base text-cyan-100
//                   shadow-[0_0_30px_rgba(34,211,238,0.25)]
//                   overflow-hidden
//                 `}
//               >
//                 {/* Glow aura */}
//                 <motion.span
//                   animate={{
//                     opacity: ctaActive ? [0.4, 0.9, 0.4] : 0.5,
//                     scale: ctaActive ? [1.02, 1.06, 1.02] : 1,
//                   }}
//                   transition={{
//                     duration: ctaActive ? 1.8 : 2.6,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                   className="absolute inset-0 bg-cyan-400/10 blur-2xl"
//                 />

//                 {/* Ripple on click */}
//                 {ripple && (
//                   <motion.span
//                     initial={{ scale: 0, opacity: 0.8 }}
//                     animate={{ scale: 3, opacity: 0 }}
//                     transition={{ duration: 0.9, ease: "easeOut" }}
//                     className="absolute inset-0 rounded-full bg-cyan-400/30"
//                   />
//                 )}

//                 {/* Mic icon */}
//                 <motion.span
//                   animate={{
//                     scale: ctaActive ? [1, 1.05, 1] : 1,
//                     opacity: 1,
//                   }}
//                   transition={{
//                     duration: 1.6,
//                     repeat: Infinity,
//                     ease: "easeInOut",
//                   }}
//                   className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/15 border border-cyan-300/60"
//                 >
//                   <span className="block w-1.5 h-5 rounded-full bg-cyan-300 relative overflow-hidden">
//                     <motion.span
//                       animate={{ y: ["0%", "60%", "0%"] }}
//                       transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
//                       className="absolute inset-0 bg-cyan-100/80"
//                     />
//                   </span>
//                 </motion.span>

//                 <span className="relative z-10 font-medium tracking-wide">
//                   Start Interview
//                 </span>
//               </motion.button>

//               <motion.p
//                 animate={{
//                   opacity: ctaListening ? [0, 1, 1, 0] : 0.6,
//                 }}
//                 transition={{
//                   duration: 2.5,
//                   repeat: ctaListening ? Infinity : 0,
//                   ease: "easeInOut",
//                 }}
//                 className="text-xs text-slate-400"
//               >
//                 {ctaListening ? "AI is listening…" : "Click to simulate a real interview environment."}
//               </motion.p>
//             </div>
//           </div>
//         </section>

//         {/* HOW IT WORKS + sticky avatar */}
//         <section ref={howRef} className="relative">
//           <div className="flex flex-col md:flex-row gap-10">
//             <div className="md:w-1/3 relative">
//               <StickyAIAvatar activeStep={howInView ? "interview" : "neutral"} />
//             </div>
//             <div className="md:w-2/3 space-y-8">
//               <SectionTitle label="How it works" />
//               <HowItWorksSteps inView={howInView} />
//             </div>
//           </div>
//         </section>

//         {/* LIVE INTERVIEW SIMULATION */}
//         <section ref={liveRef} className="relative">
//           <SectionTitle label="Live interview simulation" />
//           <LiveInterviewSimulation inView={liveInView} />
//         </section>

//         {/* INTELLIGENCE SHOWCASE */}
//         <section className="relative">
//           <SectionTitle label="Understands real skills" />
//           <IntelligenceShowcase />
//         </section>

//         {/* SCROLL TRIGGERED INSIGHTS */}
//         <section ref={insightRef} className="relative">
//           <SectionTitle label="Deep performance insights" />
//           <InsightSection inView={insightInView} />
//         </section>

//         {/* FEEDBACK SECTION */}
//         <section ref={feedbackRef} className="relative">
//           <SectionTitle label="Feedback that feels human" />
//           <FeedbackSection inView={feedbackInView} />
//         </section>

//         {/* Error / system states preview */}
//         <section className="relative">
//           <SectionTitle label="System clarity you can trust" />
//           <SystemStatesPreview />
//         </section>

//         {/* Optional sound toggle */}
//         <SoundToggle />
//       </div>
//     </div>
//   );
// }

/* ------------------ Reusable Pieces ------------------ */

const SectionTitle = ({ label }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="h-px w-7 bg-cyan-400/60" />
    <h2 className="text-sm tracking-[0.25em] uppercase text-slate-400">{label}</h2>
  </div>
);

/* HERO AI CORE */
const FloatingAICore = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-10, 10, -10] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="relative h-64 w-64 md:h-80 md:w-80 rounded-full bg-[#0F172A] border border-cyan-300/30 shadow-[0_0_80px_rgba(34,211,238,0.25)] flex items-center justify-center overflow-hidden"
    >
      {/* Pulsing halo */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-6 rounded-full bg-gradient-to-tr from-cyan-400/25 via-transparent to-indigo-400/25 blur-xl"
      />

      {/* Neural network lines */}
      <svg className="absolute inset-10 opacity-70" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="nnLines" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#7C7CFF" />
          </linearGradient>
        </defs>
        <motion.path
          d="M20 40 Q100 10 180 40 T180 160 Q100 190 20 160 Z"
          stroke="url(#nnLines)"
          strokeWidth="0.8"
          fill="none"
          animate={{ pathLength: [0.4, 1, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        {[40, 80, 120, 160].map((x, i) => (
          <motion.circle
            key={x}
            cx={x}
            cy={i % 2 === 0 ? 70 : 130}
            r={3}
            fill="#22D3EE"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}
      </svg>

      {/* Particles flowing node-to-node */}
      <NeuralParticles />
    </motion.div>
  );
};

const NeuralParticles = () => {
  const dots = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="absolute inset-0">
      {dots.map((i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-cyan-200/90"
          style={{ top: "20%", left: "10%" }}
          animate={{
            top: ["20%", "80%", "50%", "20%"],
            left: ["10%", "60%", "90%", "10%"],
            opacity: [0.1, 0.7, 0.4, 0.1],
          }}
          transition={{
            duration: 12 + i,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
};

/* Calm waveform under hero copy */
const CalmWaveform = () => {
  const bars = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="flex items-end gap-1 h-6">
      {bars.map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-cyan-300/70"
          animate={{
            height: [
              "25%",
              i % 3 === 0 ? "70%" : "40%",
              "20%",
              i % 2 === 0 ? "55%" : "35%",
              "25%",
            ],
          }}
          transition={{
            duration: 3.5 + (i % 4) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
};

/* Sticky AI avatar for how-it-works */
const StickyAIAvatar = ({ activeStep }) => {
  const mood = {
    neutral: { border: "border-slate-500/60", glow: "shadow-[0_0_40px_rgba(148,163,184,0.4)]" },
    analyzing: { border: "border-cyan-400/70", glow: "shadow-[0_0_60px_rgba(34,211,238,0.5)]" },
    interview: { border: "border-indigo-400/70", glow: "shadow-[0_0_60px_rgba(129,140,248,0.5)]" },
  }[activeStep];

  return (
    <div className="sticky top-24">
      <motion.div
        animate={{
          boxShadow: mood.glow.includes("rgba(34,211,238") // just to vary subtly
            ? [
                "0 0 25px rgba(34,211,238,0.35)",
                "0 0 55px rgba(129,140,248,0.45)",
                "0 0 25px rgba(34,211,238,0.35)",
              ]
            : "0 0 35px rgba(148,163,184,0.35)",
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={`relative h-40 w-40 rounded-3xl bg-[#0F172A]/90 border ${mood.border} overflow-hidden`}
      >
        {/* Head */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <motion.div
            animate={{
              scale: activeStep === "interview" ? 1.03 : 1,
              opacity: 1,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400/80 to-indigo-400/80 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-[6px] rounded-full bg-[#0B1020]" />
            <div className="relative flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="h-2 w-2 rounded-full bg-indigo-300" />
            </div>
          </motion.div>
          <motion.span
            animate={{
              opacity: activeStep === "neutral" ? 0.7 : 1,
              scale: activeStep === "analyzing" ? [1, 1.03, 1] : 1,
            }}
            transition={{
              duration: activeStep === "analyzing" ? 2 : 0.4,
              repeat: activeStep === "analyzing" ? Infinity : 0,
            }}
            className="text-xs text-slate-300"
          >
            {activeStep === "neutral"
              ? "Waiting for your resume"
              : activeStep === "analyzing"
              ? "Analyzing your profile…"
              : "Interview in progress"}
          </motion.span>
        </div>

        {/* Subtle brain scan sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
          animate={{ y: ["100%", "-100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

/* HOW IT WORKS STEPS */
const HowItWorksSteps = ({ inView }) => {
  const steps = [
    {
      label: "Upload resume",
      desc: "Import your resume or LinkedIn profile in seconds.",
    },
    {
      label: "AI analysis",
      desc: "The system maps skills, gaps, and role expectations.",
    },
    {
      label: "Interview simulation",
      desc: "You face adaptive questions under realistic pressure.",
    },
  ];

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 10 }}
          transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
          className="relative pl-10"
        >
          <div className="absolute left-0 top-1.5">
            <motion.div
              className="h-6 w-6 rounded-full border border-cyan-300/70 bg-[#0B1020]"
              animate={{
                boxShadow:
                  index === 1 && inView
                    ? [
                        "0 0 0px rgba(34,211,238,0.0)",
                        "0 0 12px rgba(34,211,238,0.7)",
                        "0 0 0px rgba(34,211,238,0.0)",
                      ]
                    : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{
                duration: index === 1 ? 2.5 : 0.6,
                repeat: index === 1 && inView ? Infinity : 0,
              }}
            >
              <span className="flex h-full w-full items-center justify-center text-[10px] text-cyan-100">
                0{index + 1}
              </span>
            </motion.div>
          </div>
          <h3 className="text-sm font-medium text-slate-100">{step.label}</h3>
          <p className="text-xs text-slate-400 max-w-sm">{step.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

/* LIVE INTERVIEW SIMULATION */
const LiveInterviewSimulation = ({ inView }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const seq = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 2600);
    return () => clearInterval(seq);
  }, [inView]);

  const bubbles = [
    { from: "ai", text: "Tell me about a time you handled a high-pressure deadline." },
    { from: "user", text: "In my last role, I…" },
    { from: "ai", text: "How did you measure success in that situation?" },
    { from: "user", text: "Success was clear when…" },
  ];

  return (
    <div className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
      {/* Chat playback */}
      <div className="bg-[#0F172A]/80 border border-slate-700/60 rounded-3xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Interview playback</span>
          <span className="text-slate-500">Product Engineer • 24 min</span>
        </div>

        <div className="space-y-3 mt-2">
          {bubbles.map((b, index) => {
            const isVisible = index <= step;
            const isTyping = index === step;
            const side = b.from === "ai" ? "left" : "right";
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`flex ${side === "left" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                    side === "left"
                      ? "bg-slate-900/70 border border-slate-700/80"
                      : "bg-cyan-500/15 border border-cyan-400/60"
                  }`}
                >
                  {isTyping && side === "ai" ? (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <motion.span
                          key={d}
                          className={`h-1.5 w-1.5 rounded-full ${
                            side === "left" ? "bg-slate-400" : "bg-cyan-300"
                          }`}
                          animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                          transition={{ duration: 1, repeat: Infinity, delay: d * 0.12 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <span>{b.text}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cursor highlight strip */}
        <motion.div
          animate={{
            x: [0, 6, -3, 0],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="mt-4 h-8 rounded-xl bg-slate-900/50 border border-slate-700/60 flex items-center px-3 gap-2"
        >
          <div className="h-5 w-5 rounded-full bg-cyan-500/20 border border-cyan-400/70" />
          <p className="text-[11px] text-slate-400">
            AI cursor is highlighting areas that changed your score the most.
          </p>
        </motion.div>
      </div>

      {/* Emotion meter */}
      <div className="bg-[#0F172A]/80 border border-slate-700/60 rounded-3xl p-4 space-y-4">
        <p className="text-xs text-slate-400">Real-time emotion meter</p>
        <EmotionBar
          label="Confidence"
          value={step === 0 ? 0.42 : step === 1 ? 0.58 : step === 2 ? 0.71 : 0.82}
          accent="#22D3EE"
        />
        <EmotionBar
          label="Clarity"
          value={step === 0 ? 0.38 : step === 1 ? 0.63 : step === 2 ? 0.7 : 0.84}
          accent="#7C7CFF"
        />
        <EmotionBar label="Pace" value={0.64} accent="#38BDF8" />
      </div>
    </div>
  );
};

const EmotionBar = ({
  label,
  value,
  accent,
}) => {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ background: `linear-gradient(90deg, ${accent}, #22D3EE)` }}
          className="h-full"
        />
      </div>
    </div>
  );
};

/* INTELLIGENCE SHOWCASE */
const IntelligenceShowcase1 = () => {
  const skills = ["DSA", "React", "SQL", "System Design", "HR", "Behavioral"];
  return (
    <div className="grid md:grid-cols-[3fr,2fr] gap-10 items-center">
      {/* Orbiting skill tags */}
      <div className="relative h-64">
        <div className="absolute inset-0 rounded-full border border-slate-700/60" />
        {skills.map((skill, i) => {
          const radius = 90 + (i % 2) * 18;
          const angle = (i / skills.length) * Math.PI * 2;
          const x = 50 + Math.cos(angle) * radius * 0.8;
          const y = 50 + Math.sin(angle) * radius * 0.8;
          return (
            <motion.div
              key={skill}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(34,211,238,0.55)",
                }}
                className="px-3 py-1.5 rounded-full text-xs bg-slate-900/80 border border-cyan-300/60 text-cyan-100 backdrop-blur-md"
                animate={{
                  boxShadow: ["0 0 0 rgba(34,211,238,0.2)", "0 0 16px rgba(34,211,238,0.4)", "0 0 0 rgba(34,211,238,0.2)"],
                }}
                transition={{ duration: 5 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              >
                {skill}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Brain scan animation */}
      <div className="bg-[#0F172A]/80 border border-slate-700/60 rounded-3xl p-6 space-y-4">
        <p className="text-xs text-slate-400">Skill-aware brain scan</p>
        <div className="relative h-40 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/40 to-cyan-400/40 blur-xl" />
          <div className="absolute h-24 w-24 rounded-full border border-cyan-300/70" />
          <div className="absolute h-16 w-16 rounded-full border border-indigo-300/60" />

          {/* radar sweep */}
          <motion.div
            className="absolute h-24 w-24 rounded-full border border-cyan-200/60"
            style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%)" }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* data points */}
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200"
              animate={{
                opacity: [0.1, 1, 0.1],
                scale: [0.8, 1.4, 0.8],
              }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              style={{
                top: `${30 + i * 12}%`,
                left: `${42 + i * 9}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* INSIGHT SECTION: graphs + score reveal */
const InsightSection = ({ inView }) => {
  const scores = [
    { label: "Confidence", value: 0.87, color: "#22D3EE" },
    { label: "Clarity", value: 0.82, color: "#7C7CFF" },
    { label: "Depth", value: 0.76, color: "#38BDF8" },
  ];

  return (
    <div className="bg-[#0F172A]/80 border border-slate-700/60 rounded-3xl p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Line graph */}
        <div className="h-40 bg-slate-950/70 rounded-2xl border border-slate-800/80 relative overflow-hidden">
          <svg className="absolute inset-0 opacity-30" viewBox="0 0 200 100">
            <polyline
              points="0,80 40,60 80,65 120,40 160,30 200,25"
              fill="none"
              stroke="#64748B"
              strokeWidth="0.5"
            />
          </svg>
          <motion.svg
            viewBox="0 0 200 100"
            className="absolute inset-0"
          >
            <motion.polyline
              points="0,80 40,60 80,65 120,40 160,30 200,25"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.svg>
        </div>

        {/* Score cards */}
        <div className="space-y-3">
          {scores.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 8 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.15 }}
              className="flex items-center justify-between text-xs bg-slate-950/60 rounded-xl px-3 py-2 border border-slate-800/70"
            >
              <span className="text-slate-300">{s.label}</span>
              <motion.span
                key={inView ? "visible-" + s.label : "hidden-" + s.label}
                initial={{ opacity: 0.3, scale: 0.98 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0.4 }}
                transition={{ duration: 0.4 }}
                className="font-semibold"
                style={{ color: s.color }}
              >
                {inView ? `${Math.round(s.value * 100)}%` : "0%"}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* FEEDBACK SECTION */
const FeedbackSection1 = ({ inView }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Glassy cards */}
      <GlassFeedbackCard
        title="AI feedback"
        body="Specific, actionable notes tied to each answer."
        inView={inView}
      />
      <GlassFeedbackCard
        title="Human tone"
        body="Language that feels like a calm mentor, not a judge."
        inView={inView}
      />
      <GlassFeedbackCard
        title="Next steps"
        body="Practice prompts that match your next real interview."
        inView={inView}
      />

      {/* Emotion feedback badges */}
      <div className="md:col-span-3 flex flex-wrap gap-4 mt-3">
        <FeedbackBadge
          label="Confidence low"
          tone="low"
          inView={inView}
        />
        <FeedbackBadge
          label="Excellent answer"
          tone="high"
          inView={inView}
        />
        <FeedbackBadge
          label="Clarify impact"
          tone="neutral"
          inView={inView}
        />
      </div>
    </div>
  );
};

const GlassFeedbackCard = ({
  title,
  body,
  inView,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 10 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative rounded-3xl bg-slate-900/40 border border-slate-700/70 backdrop-blur-xl p-5 overflow-hidden"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10"
      animate={{
        opacity: [0.06, 0.15, 0.06],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="relative space-y-2">
      <h3 className="text-sm font-medium text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400">{body}</p>
    </div>
  </motion.div>
);

const FeedbackBadge = ({
  label,
  tone,
  inView,
}) => {
  const base = "px-3 py-1.5 text-xs rounded-full border backdrop-blur-md";
  const styles =
    tone === "low"
      ? "border-red-400/60 text-red-200 bg-red-500/10"
      : tone === "high"
      ? "border-emerald-400/60 text-emerald-200 bg-emerald-500/10"
      : "border-slate-500/60 text-slate-200 bg-slate-600/10";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={
        inView
          ? {
              opacity: 1,
              scale: 1,
              boxShadow:
                tone === "low"
                  ? [
                      "0 0 0 rgba(248,113,113,0.0)",
                      "0 0 20px rgba(248,113,113,0.7)",
                      "0 0 0 rgba(248,113,113,0.0)",
                    ]
                  : tone === "high"
                  ? [
                      "0 0 0 rgba(52,211,153,0.0)",
                      "0 0 20px rgba(52,211,153,0.7)",
                      "0 0 0 rgba(52,211,153,0.0)",
                    ]
                  : "0 0 0 rgba(148,163,184,0.0)",
            }
          : { opacity: 0.6, scale: 0.96 }
      }
      transition={{
        duration: tone === "neutral" ? 0.7 : 2.2,
        repeat: tone === "neutral" ? 0 : Infinity,
        ease: "easeInOut",
      }}
      className={`${base} ${styles}`}
    >
      {label}
    </motion.div>
  );
};

/* System states preview (thinking, reconnecting) */
const SystemStatesPreview = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6 text-xs">
      {/* AI Thinking */}
      <div className="rounded-2xl bg-slate-950/60 border border-slate-700/70 p-4 space-y-3">
        <p className="text-slate-400">AI thinking</p>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-cyan-300/80"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              }}
            />
          ))}
        </div>
        <CalmWaveform />
      </div>

      {/* Connection issue */}
      <div className="rounded-2xl bg-slate-950/60 border border-slate-700/70 p-4 space-y-3">
        <p className="text-slate-400">Connection stability</p>
        <motion.div
          animate={{
            x: [-1, 1, -1],
          }}
          transition={{ repeat: Infinity, duration: 0.3, ease: "easeInOut" }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/70 bg-amber-500/10"
        >
          <span className="h-1.5 w-3 bg-amber-300/90" />
          <span className="text-amber-100 text-[11px]">Reconnecting…</span>
        </motion.div>
        <motion.div
          className="h-10 rounded-lg bg-slate-900 overflow-hidden relative"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-[repeating-linear-gradient(90deg,#22D3EE,#22D3EE_4px,transparent_4px,transparent_8px)] opacity-40"
            animate={{ x: ["0%", "30%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>

      {/* Page transition hint */}
      <div className="rounded-2xl bg-slate-950/60 border border-slate-700/70 p-4 space-y-3">
        <p className="text-slate-400">Page transitions</p>
        <motion.div
          initial={{ borderRadius: 9999 }}
          animate={{
            borderRadius: ["9999px", "18px", "9999px"],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30"
        />
        <p className="text-[11px] text-slate-500">
          Buttons morph into the next view instead of hard reloads.
        </p>
      </div>
    </div>
  );
};

/* Ambient background particles + grid */
const AmbientBackground = ({ cursor }) => {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY || 0);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const drift = (base) => base + scrollY * 0.01;

  const dots = Array.from({ length: 30 }, (_, i) => i);

  return (
    <>
      <div className={BG.grid} />
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {dots.map((i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] rounded-full bg-cyan-300/40"
            style={{
              top: `${(i * 13) % 100}%`,
              left: `${(i * 29) % 100}%`,
            }}
            animate={{
              y: [drift(-10 - i), drift(10 + i)],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}

        {/* subtle cursor glow */}
        <motion.div
          animate={{
            x: cursor.x,
            y: cursor.y,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25, mass: 0.4 }}
          className="h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl"
        />
      </div>
    </>
  );
};

/* Optional sound toggle */
const SoundToggle = () => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="mt-10 flex items-center justify-end gap-2 text-[11px] text-slate-500">
      <span>Sound</span>
      <button
        onClick={() => setEnabled((v) => !v)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          enabled ? "bg-cyan-500/60" : "bg-slate-600/70"
        }`}
      >
        <motion.span
          layout
          className="h-4 w-4 rounded-full bg-slate-950 shadow"
          transition={{ type: "spring", stiffness: 250, damping: 22 }}
          style={{ marginLeft: enabled ? "18px" : "2px" }}
        />
      </button>
    </div>
  );
};



// import { useState, useEffect } from "react"
// import { motion, useScroll, useTransform } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { 
//   Moon, 
//   Sun, 
//   Brain, 
//   Target, 
//   Zap, 
//   CheckCircle, 
//   MessageSquare, 
//   TrendingUp, 
//   Users, 
//   Star,
//   ArrowRight,
//   Play,
//   BarChart3,
//   Shield,
//   Clock,
//   Award,
//   LogOut
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { getUser } from "../context/auth"

// export default function Dashboard() {


//   const [theme, setTheme] = useState("light")
//   const { scrollY } = useScroll()
//   const y1 = useTransform(scrollY, [0, 300], [0, 50])
//   const y2 = useTransform(scrollY, [0, 300], [0, -50])

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2
//       }
//     }
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 30, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     }
//   }

//   const floatingVariants = {
//     animate: {
//       y: [-10, 10, -10],
//       rotate: [-2, 2, -2],
//       transition: {
//         duration: 6,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   }

//   const pulseVariants = {
//     animate: {
//       scale: [1, 1.05, 1],
//       transition: {
//         duration: 2,
//         repeat: Infinity,
//         ease: "easeInOut"
//       }
//     }
//   }
//   const router = useRouter()
//   const [user, setUser] = useState(null)

//   useEffect(() => {
//     async function fetchUser() {
//       const userData = await getUser()
//       setUser(userData)
//     }
//     fetchUser()
//   },[])

//   const handelLogOut = async()=>{
//     router.push("/login")
//     await fetch('/api/auth/logout',{ method: 'POST' })
//   }

//   const handleGetStarted = () => {
//     console.log(user)
//     if(!user)
//     {
//       router.push("/login")
//     }
//     else{
//       localStorage.removeItem('questionCount')
//       router.push("/Form")
//       console.log("Navigating to /form")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(30)].map((_, i) => (
//           <motion.div
//             key={i}
//             className={`absolute w-2 h-2 bg-white/20 rounded-full`}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               y: [-20, 20, -20],
//               opacity: [0.3, 0.8, 0.3],
//             }}
//             transition={{
//               duration: 3 + Math.random() * 2,
//               repeat: Infinity,
//               delay: Math.random() * 2,
//             }}
//           />
//         ))}
//       </div>

//       {/* Floating gradient orbs */}
//       <motion.div
//         className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-20 blur-3xl"
//         style={{ y: y1 }}
//         variants={floatingVariants}
//         animate="animate"
//       />
//       <motion.div
//         className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"
//         style={{ y: y2,animationDelay: "2s"  }}
//         variants={floatingVariants}
//         animate="animate"
        
//       />

//       {/* Header */}
//       <motion.header 
//         className="relative z-10 border-b border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 1, ease: "easeOut" }}
//       >
//         <div className="container mx-auto px-4 py-6 flex justify-between items-center">
//           <motion.div 
//             className="flex items-center space-x-3"
//             whileHover={{ scale: 1.05 }}
//             transition={{ type: "spring", stiffness: 400 }}
//           >
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             >
//               <Brain className="h-10 w-10 text-yellow-300" />
//             </motion.div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
//               AI Resume Interviewer
//             </h1>
//           </motion.div>
          
//           <motion.div className="flex items-center gap-4">
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={() => handelLogOut()}
//                 className="bg-white/20 hover:bg-white/30 border border-white/30"
//               >
//                   <LogOut className="h-5 w-5 text-yellow-300" /> 
               
//               </Button>
//             </motion.div>
//             {/* <motion.div
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//                 className="bg-white/20 hover:bg-white/30 border border-white/30"
//               >
//                 {theme === "dark" ? 
//                   <Sun className="h-5 w-5 text-yellow-300" /> : 
//                   <Moon className="h-5 w-5 text-purple-200" />
//                 }
//               </Button>
//             </motion.div> */}
//           </motion.div>
//         </div>
//       </motion.header>

//       <main className="container mx-auto px-4 relative z-10">
//         {/* Hero Section */}
//         <motion.section
//           className="py-20 text-center"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//         >
//           <motion.div variants={itemVariants}>
//             <motion.h2
//               className="text-7xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent mb-8"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 1, ease: "easeOut" }}
//             >
//               Ace Your Next Interview
//             </motion.h2>
//           </motion.div>
          
//           <motion.div variants={itemVariants}>
//             <motion.div
//               className="flex items-center justify-center gap-3 mb-8"
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <Star className="h-6 w-6 text-yellow-300" />
//               <p className="text-2xl text-white/90 font-medium">
//                 AI-Powered Interview Practice Platform
//               </p>
//               <Star className="h-6 w-6 text-yellow-300" />
//             </motion.div>
//           </motion.div>

//           <motion.div variants={itemVariants}>
//             <motion.p
//               className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12"
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//             >
//               Transform your interview preparation with our advanced AI system. Get personalized questions, 
//               real-time feedback, and detailed performance analytics to land your dream job.
//             </motion.p>
//           </motion.div>

//           <motion.div 
//             variants={itemVariants}
//             className="flex flex-col sm:flex-row gap-6 justify-center items-center"
//           >
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               transition={{ type: "spring", stiffness: 400 }}
//             >
//               <Button
//                 onClick={handleGetStarted}
//                 className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-2xl shadow-purple-500/25 relative overflow-hidden"
//                 size="lg"
//               >
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                   animate={{ x: [-100, 300] }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                 />
//                 <span className="relative z-10 flex items-center gap-3">
//                   <Play className="h-6 w-6" />
//                   Get Started Now
//                   <ArrowRight className="h-6 w-6" />
//                 </span>
//               </Button>
//             </motion.div>
            
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Button
//                 variant="outline"
//                 className="bg-white/20 hover:bg-white/30 border-2 border-white/50 hover:border-white/70 text-white px-8 py-6 text-lg font-semibold backdrop-blur-sm"
//                 size="lg"
//                 onClick={() => {
//                   window.open('https://sumitbaghelportfolio.netlify.app', '_blank');
//                 }}
//                 onContextMenu={(e) => {
//                   e.preventDefault();
//                   navigator.clipboard.writeText('https://sumitbaghelportfolio.netlify.app');
//                   alert('Link copied to clipboard!');
//                 }}
//               >
//                 Watch Demo
//               </Button>
//             </motion.div>
//           </motion.div>
//         </motion.section>

//         {/* Features Section */}
//         <motion.section
//           className="py-20"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.8 }}
//         >
//           <motion.div 
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//           >
//             <h3 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mb-6">
//               Why Choose Our Platform?
//             </h3>
//             <p className="text-xl text-white/80 max-w-3xl mx-auto">
//               Experience the future of interview preparation with cutting-edge AI technology
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//             {[
//               {
//                 icon: Brain,
//                 title: "Smart AI Analysis",
//                 description: "Our advanced AI analyzes your resume and generates personalized interview questions tailored to your experience and target role.",
//                 gradient: "from-purple-500 to-pink-500",
//                 delay: 0.1
//               },
//               {
//                 icon: MessageSquare,
//                 title: "Real-Time Feedback",
//                 description: "Get instant, detailed feedback on your answers including communication skills, technical accuracy, and areas for improvement.",
//                 gradient: "from-blue-500 to-cyan-500",
//                 delay: 0.2
//               },
//               {
//                 icon: BarChart3,
//                 title: "Performance Analytics",
//                 description: "Track your progress with comprehensive analytics, identify strengths and weaknesses, and monitor improvement over time.",
//                 gradient: "from-green-500 to-yellow-500",
//                 delay: 0.3
//               },
//               {
//                 icon: Target,
//                 title: "Role-Specific Questions",
//                 description: "Practice with questions specifically designed for your target position, from technical challenges to behavioral scenarios.",
//                 gradient: "from-orange-500 to-red-500",
//                 delay: 0.4
//               },
//               {
//                 icon: Clock,
//                 title: "24/7 Availability",
//                 description: "Practice anytime, anywhere. Our AI interviewer is always ready to help you prepare for your next big opportunity.",
//                 gradient: "from-indigo-500 to-purple-500",
//                 delay: 0.5
//               },
//               {
//                 icon: Shield,
//                 title: "Privacy Focused",
//                 description: "Your data is completely secure and private. We never share your information and you control your interview history.",
//                 gradient: "from-teal-500 to-green-500",
//                 delay: 0.6
//               }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 50, scale: 0.9 }}
//                 whileInView={{ opacity: 1, y: 0, scale: 1 }}
//                 viewport={{ once: true, margin: "-50px" }}
//                 transition={{ 
//                   duration: 0.8, 
//                   delay: feature.delay,
//                   type: "spring",
//                   stiffness: 100 
//                 }}
//                 whileHover={{ 
//                   scale: 1.05, 
//                   y: -10,
//                   transition: { type: "spring", stiffness: 300 }
//                 }}
//               >
//                 <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 h-full hover:bg-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
//                   <CardContent className="p-8 text-center">
//                     <motion.div
//                       className={`inline-flex p-6 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
//                       whileHover={{ 
//                         rotate: 360,
//                         scale: 1.1
//                       }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       <feature.icon className="h-8 w-8 text-white" />
//                     </motion.div>
//                     <h4 className="text-2xl font-bold text-white mb-4">{feature.title}</h4>
//                     <p className="text-white/80 leading-relaxed">{feature.description}</p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </motion.section>

//         {/* Stats Section */}
//         <motion.section
//           className="py-20"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.8 }}
//         >
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             {[
//               { number: "10K+", label: "Interviews Conducted", icon: Users },
//               { number: "95%", label: "Success Rate", icon: TrendingUp },
//               { number: "4.9/5", label: "User Rating", icon: Star },
//               { number: "24/7", label: "AI Availability", icon: Clock }
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ scale: 1.1, y: -5 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Card className="bg-white/25 dark:bg-black/25 backdrop-blur-xl border border-white/40 text-center hover:bg-white/35 transition-all duration-300">
//                   <CardContent className="p-6">
//                     <motion.div
//                       variants={pulseVariants}
//                       animate="animate"
//                     >
//                       <stat.icon className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
//                     </motion.div>
//                     <motion.div
//                       className="text-4xl font-bold text-white mb-2"
//                       initial={{ opacity: 0, scale: 0 }}
//                       whileInView={{ opacity: 1, scale: 1 }}
//                       viewport={{ once: true }}
//                       transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
//                     >
//                       {stat.number}
//                     </motion.div>
//                     <p className="text-white/80 font-medium">{stat.label}</p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.section>

//         {/* About Section */}
//         <motion.section
//           className="py-20"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="max-w-6xl mx-auto">
//             <motion.div
//               className="text-center mb-16"
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//             >
//               <h3 className="text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-6">
//                 About Our Platform
//               </h3>
//               <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
//                 Built by industry experts and powered by cutting-edge AI, our platform revolutionizes interview preparation
//               </p>
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//               <motion.div
//                 initial={{ opacity: 0, x: -50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.8 }}
//               >
//                 <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 p-8">
//                   <CardContent className="space-y-6">
//                     <h4 className="text-3xl font-bold text-white mb-6">How It Works</h4>
//                     {[
//                       { step: 1, text: "Upload your resume and select your target role", icon: Target },
//                       { step: 2, text: "Our AI generates personalized interview questions", icon: Brain },
//                       { step: 3, text: "Practice with realistic interview scenarios", icon: MessageSquare },
//                       { step: 4, text: "Receive detailed feedback and improve", icon: TrendingUp }
//                     ].map((item, index) => (
//                       <motion.div
//                         key={index}
//                         className="flex items-center gap-4"
//                         initial={{ opacity: 0, x: -30 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         viewport={{ once: true }}
//                         transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
//                         whileHover={{ x: 10, transition: { duration: 0.2 } }}
//                       >
//                         <motion.div
//                           className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white"
//                           whileHover={{ rotate: 360, scale: 1.1 }}
//                           transition={{ duration: 0.5 }}
//                         >
//                           {item.step}
//                         </motion.div>
//                         <item.icon className="h-6 w-6 text-yellow-300 flex-shrink-0" />
//                         <p className="text-white/90 text-lg">{item.text}</p>
//                       </motion.div>
//                     ))}
//                   </CardContent>
//                 </Card>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: 50 }}
//                 whileInView={{ opacity: 1, x: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ duration: 0.8 }}
//                 className="space-y-8"
//               >
//                 <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 p-8">
//                   <CardContent className="text-center">
//                     <motion.div
//                       variants={pulseVariants}
//                       animate="animate"
//                     >
//                       <Award className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
//                     </motion.div>
//                     <h4 className="text-2xl font-bold text-white mb-4">Proven Results</h4>
//                     <p className="text-white/80 text-lg leading-relaxed">
//                       Join thousands of successful candidates who improved their interview performance by an average of 40% using our platform.
//                     </p>
//                   </CardContent>
//                 </Card>

//                 <motion.div
//                   className="grid grid-cols-2 gap-4"
//                   variants={containerVariants}
//                   initial="hidden"
//                   whileInView="visible"
//                   viewport={{ once: true }}
//                 >
//                   {[
//                     { label: "Questions Generated", value: "50K+" },
//                     { label: "Companies Supported", value: "500+" },
//                     { label: "Success Stories", value: "2K+" },
//                     { label: "Industry Coverage", value: "100%" }
//                   ].map((metric, index) => (
//                     <motion.div
//                       key={index}
//                       variants={itemVariants}
//                       whileHover={{ scale: 1.05 }}
//                     >
//                       <Card className="bg-white/15 backdrop-blur-xl border border-white/30 text-center p-4">
//                         <CardContent className="p-2">
//                           <div className="text-2xl font-bold text-white">{metric.value}</div>
//                           <div className="text-white/70 text-sm">{metric.label}</div>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               </motion.div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Call to Action Section */}
//         <motion.section
//           className="py-20"
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.8 }}
//         >
//           <motion.div
//             className="max-w-4xl mx-auto text-center"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             <motion.div variants={itemVariants}>
//               <Card className="bg-gradient-to-br from-white/25 to-white/15 dark:from-black/25 dark:to-black/15 backdrop-blur-xl border border-white/40 p-12 shadow-2xl">
//                 <CardContent className="space-y-8">
//                   <motion.div
//                     variants={pulseVariants}
//                     animate="animate"
//                   >
//                     <Brain className="h-20 w-20 text-yellow-300 mx-auto mb-6" />
//                   </motion.div>
                  
//                   <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
//                     Ready to Transform Your Interview Skills?
//                   </h3>
                  
//                   <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
//                     Join the revolution in interview preparation. Start practicing with AI-powered questions 
//                     and get the confidence you need to succeed.
//                   </p>
                  
//                   <motion.div
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     transition={{ type: "spring", stiffness: 400 }}
//                   >
//                     <Button
//                       onClick={handleGetStarted}
//                       className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 text-white px-16 py-8 text-2xl font-bold shadow-2xl shadow-purple-500/25 relative overflow-hidden"
//                       size="lg"
//                     >
//                       <motion.div
//                         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                         animate={{ x: [-200, 400] }}
//                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
//                       />
//                       <span className="relative z-10 flex items-center gap-4">
//                         <Play className="h-8 w-8" />
//                         Start Your Journey
//                         <motion.div
//                           animate={{ x: [0, 5, 0] }}
//                           transition={{ duration: 1, repeat: Infinity }}
//                         >
//                           <ArrowRight className="h-8 w-8" />
//                         </motion.div>
//                       </span>
//                     </Button>
//                   </motion.div>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </motion.div>
//         </motion.section>
//       </main>

//       {/* Footer */}
//       <motion.footer 
//         className="relative z-10 border-t border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl mt-20"
//         initial={{ y: 100, opacity: 0 }}
//         whileInView={{ y: 0, opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//       >
//         <div className="container mx-auto px-4 py-12">
//           <motion.div 
//             className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
//             variants={containerVariants}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true }}
//           >
//             <motion.div variants={itemVariants}>
//               <div className="flex items-center space-x-3 mb-4">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                 >
//                   <Brain className="h-8 w-8 text-yellow-300" />
//                 </motion.div>
//                 <h5 className="text-xl font-bold text-white">AI Resume Interviewer</h5>
//               </div>
//               <p className="text-white/70 leading-relaxed">
//                 Empowering careers through intelligent interview practice and AI-driven feedback.
//               </p>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <h6 className="text-lg font-semibold text-white mb-4">Features</h6>
//               <ul className="space-y-2 text-white/70">
//                 {["AI Interview Questions", "Real-time Feedback", "Performance Analytics", "Career Guidance"].map((item, index) => (
//                   <motion.li 
//                     key={index}
//                     whileHover={{ x: 5, color: "#ffffff" }}
//                     transition={{ duration: 0.2 }}
//                     className="cursor-pointer"
//                   >
//                     {item}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <h6 className="text-lg font-semibold text-white mb-4">Company</h6>
//               <ul className="space-y-2 text-white/70">
//                 {["About Us", "Careers", "Contact", "Privacy Policy"].map((item, index) => (
//                   <motion.li 
//                     key={index}
//                     whileHover={{ x: 5, color: "#ffffff" }}
//                     transition={{ duration: 0.2 }}
//                     className="cursor-pointer"
//                   >
//                     {item}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <h6 className="text-lg font-semibold text-white mb-4">Support</h6>
//               <ul className="space-y-2 text-white/70">
//                 {["Help Center", "Documentation", "Community", "Feedback"].map((item, index) => (
//                   <motion.li 
//                     key={index}
//                     whileHover={{ x: 5, color: "#ffffff" }}
//                     transition={{ duration: 0.2 }}
//                     className="cursor-pointer"
//                   >
//                     {item}
//                   </motion.li>
//                 ))}
//               </ul>
//             </motion.div>
//           </motion.div>

//           <motion.div 
//             className="border-t border-white/20 pt-8 text-center"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//           >
//             <p className="text-white/70 text-lg">
//               © 2025 AI Resume Interviewer. Empowering your career journey with intelligent interview practice.
//             </p>
//             <motion.div 
//               className="flex justify-center gap-6 mt-4"
//               variants={containerVariants}
//               initial="hidden"
//               whileInView="visible"
//               viewport={{ once: true }}
//             >
//               {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link, index) => (
//                 <motion.a
//                   key={index}
//                   href="#"
//                   variants={itemVariants}
//                   whileHover={{ 
//                     scale: 1.05,
//                     color: "#ffffff",
//                     transition: { duration: 0.2 }
//                   }}
//                   className="text-white/60 hover:text-white transition-colors"
//                 >
//                   {link}
//                 </motion.a>
//               ))}
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.footer>
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'

// export default function Dashboard() {
//   const router = useRouter()
//   const [activeSection, setActiveSection] = useState('features')
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
//   const [isLoaded, setIsLoaded] = useState(false)
//   const { scrollY } = useScroll()
//   const heroRef = useRef(null)
//   const featuresRef = useRef(null)
//   const aboutRef = useRef(null)
  
//   const isHeroInView = useInView(heroRef)
//   const isFeaturesInView = useInView(featuresRef, { threshold: 0.3 })
//   const isAboutInView = useInView(aboutRef, { threshold: 0.3 })

//   // Parallax effects
//   const backgroundY = useTransform(scrollY, [0, 1000], [0, -200])
//   const textY = useTransform(scrollY, [0, 1000], [0, -100])

//   const features = [
//     {
//       icon: "🎯",
//       title: "Smart Question Generation",
//       description: "AI analyzes your resume and generates role-specific questions tailored to your experience and target position.",
//       stats: "10,000+ Questions",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: "📊",
//       title: "Real-time Analytics",
//       description: "Get instant feedback on your performance with detailed metrics on communication, confidence, and technical skills.",
//       stats: "95% Accuracy",
//       color: "from-purple-500 to-pink-500"
//     },
//     {
//       icon: "🧠",
//       title: "AI-Powered Coaching",
//       description: "Receive personalized improvement suggestions and practice recommendations based on your interview performance.",
//       stats: "500+ Tips",
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: "🏆",
//       title: "Industry Scenarios",
//       description: "Practice with real-world scenarios from top companies across various industries and job roles.",
//       stats: "200+ Companies",
//       color: "from-orange-500 to-red-500"
//     },
//     {
//       icon: "📈",
//       title: "Progress Tracking",
//       description: "Monitor your improvement over time with detailed analytics and performance trends.",
//       stats: "Advanced Metrics",
//       color: "from-indigo-500 to-blue-500"
//     },
//     {
//       icon: "🎥",
//       title: "Video Analysis",
//       description: "AI analyzes your body language, facial expressions, and speaking patterns for comprehensive feedback.",
//       stats: "Multi-modal AI",
//       color: "from-pink-500 to-rose-500"
//     }
//   ]

//   const testimonials = [
//     {
//       name: "Sarah Johnson",
//       role: "Software Engineer at Google",
//       content: "This platform helped me land my dream job! The AI feedback was incredibly accurate and helpful.",
//       avatar: "🧑‍💻"
//     },
//     {
//       name: "Michael Chen",
//       role: "Product Manager at Meta",
//       content: "The real-time analytics gave me insights I never knew I needed. Highly recommend!",
//       avatar: "👨‍💼"
//     },
//     {
//       name: "Emily Davis",
//       role: "Data Scientist at Netflix",
//       content: "The industry-specific scenarios were spot on. I felt completely prepared for my interviews.",
//       avatar: "👩‍🔬"
//     }
//   ]

//   useEffect(() => {
//     setIsLoaded(true)
    
//     const handleMouseMove = (e) => {
//       setMousePosition({ x: e.clientX, y: e.clientY })
//     }

//     const handleScroll = () => {
//       const sections = ['features', 'about']
//       const scrollPosition = window.scrollY + 200

//       sections.forEach((section) => {
//         const element = document.getElementById(section)
//         if (element) {
//           const { offsetTop, offsetHeight } = element
//           if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
//             setActiveSection(section)
//           }
//         }
//       })
//     }

//     window.addEventListener('mousemove', handleMouseMove)
//     window.addEventListener('scroll', handleScroll)
    
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove)
//       window.removeEventListener('scroll', handleScroll)
//     }
//   }, [])

//   const handleGetStarted = () => {
//     router.push('/form')
//   }

//   const scrollToSection = (sectionId) => {
//     const element = document.getElementById(sectionId)
//     element?.scrollIntoView({ behavior: 'smooth' })
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Animated Cursor */}
//       <motion.div
//         className="fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full pointer-events-none z-50 mix-blend-difference"
//         animate={{
//           x: mousePosition.x - 12,
//           y: mousePosition.y - 12,
//         }}
//         transition={{ type: "spring", stiffness: 500, damping: 28 }}
//       />

//       {/* Dynamic Background */}
//       <motion.div 
//         className="fixed inset-0"
//         style={{ y: backgroundY }}
//       >
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute bg-white/5 rounded-full blur-xl"
//             style={{
//               width: Math.random() * 300 + 50,
//               height: Math.random() * 300 + 50,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               x: [0, Math.random() * 100 - 50],
//               y: [0, Math.random() * 100 - 50],
//               scale: [1, 1.2, 1],
//               opacity: [0.1, 0.3, 0.1],
//             }}
//             transition={{
//               duration: Math.random() * 10 + 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         ))}
//       </motion.div>

//       {/* Header */}
//       <motion.header
//         className="fixed top-0 w-full z-40 backdrop-blur-xl bg-black/20 border-b border-white/10"
//         initial={{ y: -100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//       >
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <motion.div
//               className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
//               whileHover={{ scale: 1.05 }}
//             >
//               AI Interview Pro
//             </motion.div>
            
//             <nav className="hidden md:flex space-x-8">
//               {[
//                 { name: 'Features', id: 'features' },
//                 { name: 'About', id: 'about' },
//                 { name: 'Contact', id: 'contact' }
//               ].map((item) => (
//                 <motion.button
//                   key={item.id}
//                   onClick={() => scrollToSection(item.id)}
//                   className={`relative px-4 py-2 text-sm font-medium transition-colors ${
//                     activeSection === item.id ? 'text-white' : 'text-white/60 hover:text-white'
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   {item.name}
//                   {activeSection === item.id && (
//                     <motion.div
//                       className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400"
//                       layoutId="activeSection"
//                       initial={false}
//                       transition={{ type: "spring", stiffness: 380, damping: 30 }}
//                     />
//                   )}
//                 </motion.button>
//               ))}
//             </nav>

//             <motion.button
//               onClick={handleGetStarted}
//               className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-lg"
//               whileHover={{
//                 scale: 1.05,
//                 boxShadow: "0 20px 40px -12px rgba(139, 92, 246, 0.4)"
//               }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Get Started
//             </motion.button>
//           </div>
//         </div>
//       </motion.header>

//       {/* Hero Section */}
//       <section ref={heroRef} className="relative pt-32 pb-20 px-6">
//         <motion.div 
//           className="container mx-auto text-center"
//           style={{ y: textY }}
//         >
//           <motion.div
//             className="mb-8"
//             initial={{ scale: 0, rotate: -180 }}
//             animate={{ scale: 1, rotate: 0 }}
//             transition={{ duration: 1.2, ease: "easeOut" }}
//           >
//             <motion.div
//               className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
//               animate={{
//                 boxShadow: [
//                   "0 0 50px rgba(139, 92, 246, 0.3)",
//                   "0 0 80px rgba(59, 130, 246, 0.4)",
//                   "0 0 50px rgba(139, 92, 246, 0.3)"
//                 ]
//               }}
//               transition={{ duration: 3, repeat: Infinity }}
//             >
//               <motion.span
//                 className="text-6xl"
//                 animate={{ rotate: [0, 360] }}
//                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//               >
//                 🚀
//               </motion.span>
//             </motion.div>
//           </motion.div>

//           <motion.h1
//             className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
//             initial={{ y: 100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.3, duration: 0.8 }}
//           >
//             <motion.span
//               className="block"
//               animate={{
//                 background: [
//                   "linear-gradient(45deg, #8B5CF6, #3B82F6)",
//                   "linear-gradient(45deg, #3B82F6, #8B5CF6)",
//                   "linear-gradient(45deg, #8B5CF6, #3B82F6)"
//                 ]
//               }}
//               transition={{ duration: 4, repeat: Infinity }}
//               style={{ backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
//             >
//               Master Every
//             </motion.span>
//             <span className="text-white">Interview</span>
//           </motion.h1>

//           <motion.p
//             className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto"
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.6, duration: 0.8 }}
//           >
//             Transform your interview skills with AI-powered practice sessions, real-time feedback,
//             and personalized coaching that adapts to your unique strengths and areas for improvement.
//           </motion.p>

//           <motion.button
//             onClick={handleGetStarted}
//             className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-semibold rounded-full shadow-2xl overflow-hidden"
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ delay: 0.9, duration: 0.8 }}
//             whileHover={{
//               scale: 1.05,
//               boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.5)"
//             }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <motion.div
//               className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400"
//               initial={{ x: "-100%" }}
//               whileHover={{ x: "0%" }}
//               transition={{ duration: 0.6 }}
//             />
//             <span className="relative z-10 flex items-center">
//               Start Your Journey
//               <motion.svg
//                 className="ml-3 w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 animate={{ x: [0, 5, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </motion.svg>
//             </span>
//           </motion.button>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//       <section id="features" ref={featuresRef} className="py-20 px-6 relative">
//         <div className="container mx-auto">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 50 }}
//             animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
//               Revolutionary Features
//             </h2>
//             <p className="text-xl text-white/70 max-w-3xl mx-auto">
//               Experience the future of interview preparation with cutting-edge AI technology
//               designed to maximize your success rate.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
//                 initial={{ opacity: 0, y: 50 }}
//                 animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
//                 transition={{ delay: index * 0.1, duration: 0.8 }}
//                 whileHover={{
//                   scale: 1.02,
//                   backgroundColor: "rgba(255, 255, 255, 0.08)"
//                 }}
//               >
//                 <motion.div
//                   className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
//                 />
                
//                 <motion.div
//                   className="text-6xl mb-6"
//                   animate={{
//                     rotate: [0, 10, -10, 0],
//                     scale: [1, 1.1, 1]
//                   }}
//                   transition={{
//                     duration: 4,
//                     repeat: Infinity,
//                     delay: index * 0.5
//                   }}
//                 >
//                   {feature.icon}
//                 </motion.div>

//                 <h3 className="text-2xl font-bold text-white mb-4">
//                   {feature.title}
//                 </h3>
                
//                 <p className="text-white/70 mb-6 leading-relaxed">
//                   {feature.description}
//                 </p>

//                 <motion.div
//                   className={`inline-block px-4 py-2 bg-gradient-to-r ${feature.color} text-white text-sm font-semibold rounded-full`}
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   {feature.stats}
//                 </motion.div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" ref={aboutRef} className="py-20 px-6">
//         <div className="container mx-auto">
//           <motion.div
//             className="text-center mb-16"
//             initial={{ opacity: 0, y: 50 }}
//             animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.8 }}
//           >
//             <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
//               Why Choose Us?
//             </h2>
//             <p className="text-xl text-white/70 max-w-3xl mx-auto">
//               Join thousands of professionals who have transformed their careers with our platform.
//             </p>
//           </motion.div>

//           {/* Statistics */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
//             {[
//               { number: "50K+", label: "Interviews Completed", icon: "📊" },
//               { number: "98%", label: "Success Rate", icon: "🎯" },
//               { number: "500+", label: "Partner Companies", icon: "🏢" },
//               { number: "24/7", label: "AI Support", icon: "🤖" }
//             ].map((stat, index) => (
//               <motion.div
//                 key={index}
//                 className="text-center p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={isAboutInView ? { opacity: 1, scale: 1 } : {}}
//                 transition={{ delay: index * 0.1, duration: 0.8 }}
//                 whileHover={{
//                   scale: 1.05,
//                   backgroundColor: "rgba(255, 255, 255, 0.08)"
//                 }}
//               >
//                 <motion.div
//                   className="text-4xl mb-3"
//                   animate={{
//                     y: [0, -10, 0],
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                     delay: index * 0.2
//                   }}
//                 >
//                   {stat.icon}
//                 </motion.div>
//                 <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
//                 <div className="text-white/60">{stat.label}</div>
//               </motion.div>
//             ))}
//           </div>

//           {/* Testimonials */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {testimonials.map((testimonial, index) => (
//               <motion.div
//                 key={index}
//                 className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
//                 initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
//                 animate={isAboutInView ? { opacity: 1, x: 0 } : {}}
//                 transition={{ delay: index * 0.2, duration: 0.8 }}
//                 whileHover={{
//                   scale: 1.02,
//                   backgroundColor: "rgba(255, 255, 255, 0.08)"
//                 }}
//               >
//                 <div className="flex items-center mb-4">
//                   <motion.div
//                     className="text-3xl mr-3"
//                     animate={{ rotate: [0, 10, -10, 0] }}
//                     transition={{ duration: 3, repeat: Infinity, delay: index }}
//                   >
//                     {testimonial.avatar}
//                   </motion.div>
//                   <div>
//                     <div className="font-semibold text-white">{testimonial.name}</div>
//                     <div className="text-sm text-white/60">{testimonial.role}</div>
//                   </div>
//                 </div>
//                 <p className="text-white/80 italic">"{testimonial.content}"</p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer id="contact" className="py-16 px-6 bg-black/20 backdrop-blur-xl border-t border-white/10">
//         <div className="container mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h3 className="text-2xl font-bold text-white mb-4">AI Interview Pro</h3>
//               <p className="text-white/60 mb-4">
//                 Revolutionizing interview preparation with cutting-edge AI technology.
//               </p>
//               <div className="flex space-x-4">
//                 {['📧', '🐦', '💼', '📱'].map((icon, index) => (
//                   <motion.div
//                     key={index}
//                     className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer"
//                     whileHover={{ 
//                       scale: 1.2, 
//                       backgroundColor: "rgba(139, 92, 246, 0.3)",
//                       rotate: 360 
//                     }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     {icon}
//                   </motion.div>
//                 ))}
//               </div>
//             </div>

//             {[
//               {
//                 title: 'Product',
//                 links: ['Features', 'Pricing', 'API', 'Integrations']
//               },
//               {
//                 title: 'Company',
//                 links: ['About', 'Careers', 'Press', 'Partners']
//               },
//               {
//                 title: 'Support',
//                 links: ['Help Center', 'Documentation', 'Contact', 'Status']
//               }
//             ].map((column, index) => (
//               <div key={index}>
//                 <h4 className="text-lg font-semibold text-white mb-4">{column.title}</h4>
//                 <ul className="space-y-2">
//                   {column.links.map((link, linkIndex) => (
//                     <motion.li
//                       key={linkIndex}
//                       whileHover={{ x: 5 }}
//                       transition={{ duration: 0.2 }}
//                     >
//                       <a href="#" className="text-white/60 hover:text-white transition-colors">
//                         {link}
//                       </a>
//                     </motion.li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           <motion.div
//             className="border-t border-white/10 pt-8 text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1, duration: 0.8 }}
//           >
//             <p className="text-white/60">
//               © 2025 AI Interview Pro. All rights reserved. Built with ❤️ and AI.
//             </p>
//           </motion.div>
//         </div>
//       </footer>

//       {/* Scroll to Top Button */}
//       <AnimatePresence>
//         {scrollY.get() > 300 && (
//           <motion.button
//             className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg z-40"
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0 }}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           >
//             ↑
//           </motion.button>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }
