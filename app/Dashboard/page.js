"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Moon, 
  Sun, 
  Brain, 
  Target, 
  Zap, 
  CheckCircle, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Star,
  ArrowRight,
  Play,
  BarChart3,
  Shield,
  Clock,
  Award,
  LogOut
} from "lucide-react"
import { useRouter } from "next/navigation"
import { getUser } from "../context/auth"

export default function Dashboard() {


  const [theme, setTheme] = useState("light")
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, 50])
  const y2 = useTransform(scrollY, [0, 300], [0, -50])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUser()
      setUser(userData)
    }
    fetchUser()
  },[])

  const handelLogOut = async()=>{
    await fetch('/api/auth/logout',{ method: 'POST' })
    router.push("/login")
  }

  const handleGetStarted = () => {
    console.log(user)
    if(!user)
    {
      router.push("/login")
    }
    else{
      localStorage.removeItem('questionCount')
      router.push("/Form")
      console.log("Navigating to /form")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-white/20 rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-20 blur-3xl"
        style={{ y: y1 }}
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"
        style={{ y: y2,animationDelay: "2s"  }}
        variants={floatingVariants}
        animate="animate"
        
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-10 w-10 text-yellow-300" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              AI Resume Interviewer
            </h1>
          </motion.div>
          
          <motion.div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handelLogOut()}
                className="bg-white/20 hover:bg-white/30 border border-white/30"
              >
                  <LogOut className="h-5 w-5 text-yellow-300" /> : 
               
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-white/20 hover:bg-white/30 border border-white/30"
              >
                {theme === "dark" ? 
                  <Sun className="h-5 w-5 text-yellow-300" /> : 
                  <Moon className="h-5 w-5 text-purple-200" />
                }
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <motion.section
          className="py-20 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-7xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Ace Your Next Interview
            </motion.h2>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.div
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Star className="h-6 w-6 text-yellow-300" />
              <p className="text-2xl text-white/90 font-medium">
                AI-Powered Interview Practice Platform
              </p>
              <Star className="h-6 w-6 text-yellow-300" />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.p
              className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Transform your interview preparation with our advanced AI system. Get personalized questions, 
              real-time feedback, and detailed performance analytics to land your dream job.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold shadow-2xl shadow-purple-500/25 relative overflow-hidden"
                size="lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  <Play className="h-6 w-6" />
                  Get Started Now
                  <ArrowRight className="h-6 w-6" />
                </span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 border-2 border-white/50 hover:border-white/70 text-white px-8 py-6 text-lg font-semibold backdrop-blur-sm"
                size="lg"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
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
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent mb-6">
              Why Choose Our Platform?
            </h3>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the future of interview preparation with cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Brain,
                title: "Smart AI Analysis",
                description: "Our advanced AI analyzes your resume and generates personalized interview questions tailored to your experience and target role.",
                gradient: "from-purple-500 to-pink-500",
                delay: 0.1
              },
              {
                icon: MessageSquare,
                title: "Real-Time Feedback",
                description: "Get instant, detailed feedback on your answers including communication skills, technical accuracy, and areas for improvement.",
                gradient: "from-blue-500 to-cyan-500",
                delay: 0.2
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Track your progress with comprehensive analytics, identify strengths and weaknesses, and monitor improvement over time.",
                gradient: "from-green-500 to-yellow-500",
                delay: 0.3
              },
              {
                icon: Target,
                title: "Role-Specific Questions",
                description: "Practice with questions specifically designed for your target position, from technical challenges to behavioral scenarios.",
                gradient: "from-orange-500 to-red-500",
                delay: 0.4
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Practice anytime, anywhere. Our AI interviewer is always ready to help you prepare for your next big opportunity.",
                gradient: "from-indigo-500 to-purple-500",
                delay: 0.5
              },
              {
                icon: Shield,
                title: "Privacy Focused",
                description: "Your data is completely secure and private. We never share your information and you control your interview history.",
                gradient: "from-teal-500 to-green-500",
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: feature.delay,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 h-full hover:bg-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`inline-flex p-6 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-white mb-4">{feature.title}</h4>
                    <p className="text-white/80 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Interviews Conducted", icon: Users },
              { number: "95%", label: "Success Rate", icon: TrendingUp },
              { number: "4.9/5", label: "User Rating", icon: Star },
              { number: "24/7", label: "AI Availability", icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/25 dark:bg-black/25 backdrop-blur-xl border border-white/40 text-center hover:bg-white/35 transition-all duration-300">
                  <CardContent className="p-6">
                    <motion.div
                      variants={pulseVariants}
                      animate="animate"
                    >
                      <stat.icon className="h-8 w-8 text-yellow-300 mx-auto mb-3" />
                    </motion.div>
                    <motion.div
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    >
                      {stat.number}
                    </motion.div>
                    <p className="text-white/80 font-medium">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent mb-6">
                About Our Platform
              </h3>
              <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
                Built by industry experts and powered by cutting-edge AI, our platform revolutionizes interview preparation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 p-8">
                  <CardContent className="space-y-6">
                    <h4 className="text-3xl font-bold text-white mb-6">How It Works</h4>
                    {[
                      { step: 1, text: "Upload your resume and select your target role", icon: Target },
                      { step: 2, text: "Our AI generates personalized interview questions", icon: Brain },
                      { step: 3, text: "Practice with realistic interview scenarios", icon: MessageSquare },
                      { step: 4, text: "Receive detailed feedback and improve", icon: TrendingUp }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                        whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      >
                        <motion.div
                          className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.step}
                        </motion.div>
                        <item.icon className="h-6 w-6 text-yellow-300 flex-shrink-0" />
                        <p className="text-white/90 text-lg">{item.text}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/30 p-8">
                  <CardContent className="text-center">
                    <motion.div
                      variants={pulseVariants}
                      animate="animate"
                    >
                      <Award className="h-16 w-16 text-yellow-300 mx-auto mb-4" />
                    </motion.div>
                    <h4 className="text-2xl font-bold text-white mb-4">Proven Results</h4>
                    <p className="text-white/80 text-lg leading-relaxed">
                      Join thousands of successful candidates who improved their interview performance by an average of 40% using our platform.
                    </p>
                  </CardContent>
                </Card>

                <motion.div
                  className="grid grid-cols-2 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    { label: "Questions Generated", value: "50K+" },
                    { label: "Companies Supported", value: "500+" },
                    { label: "Success Stories", value: "2K+" },
                    { label: "Industry Coverage", value: "100%" }
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Card className="bg-white/15 backdrop-blur-xl border border-white/30 text-center p-4">
                        <CardContent className="p-2">
                          <div className="text-2xl font-bold text-white">{metric.value}</div>
                          <div className="text-white/70 text-sm">{metric.label}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action Section */}
        <motion.section
          className="py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white/25 to-white/15 dark:from-black/25 dark:to-black/15 backdrop-blur-xl border border-white/40 p-12 shadow-2xl">
                <CardContent className="space-y-8">
                  <motion.div
                    variants={pulseVariants}
                    animate="animate"
                  >
                    <Brain className="h-20 w-20 text-yellow-300 mx-auto mb-6" />
                  </motion.div>
                  
                  <h3 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    Ready to Transform Your Interview Skills?
                  </h3>
                  
                  <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
                    Join the revolution in interview preparation. Start practicing with AI-powered questions 
                    and get the confidence you need to succeed.
                  </p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      onClick={handleGetStarted}
                      className="bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 text-white px-16 py-8 text-2xl font-bold shadow-2xl shadow-purple-500/25 relative overflow-hidden"
                      size="lg"
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
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 border-t border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl mt-20"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="h-8 w-8 text-yellow-300" />
                </motion.div>
                <h5 className="text-xl font-bold text-white">AI Resume Interviewer</h5>
              </div>
              <p className="text-white/70 leading-relaxed">
                Empowering careers through intelligent interview practice and AI-driven feedback.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h6 className="text-lg font-semibold text-white mb-4">Features</h6>
              <ul className="space-y-2 text-white/70">
                {["AI Interview Questions", "Real-time Feedback", "Performance Analytics", "Career Guidance"].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h6 className="text-lg font-semibold text-white mb-4">Company</h6>
              <ul className="space-y-2 text-white/70">
                {["About Us", "Careers", "Contact", "Privacy Policy"].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h6 className="text-lg font-semibold text-white mb-4">Support</h6>
              <ul className="space-y-2 text-white/70">
                {["Help Center", "Documentation", "Community", "Feedback"].map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div 
            className="border-t border-white/20 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-white/70 text-lg">
              © 2025 AI Resume Interviewer. Empowering your career journey with intelligent interview practice.
            </p>
            <motion.div 
              className="flex justify-center gap-6 mt-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((link, index) => (
                <motion.a
                  key={index}
                  href="#"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    color: "#ffffff",
                    transition: { duration: 0.2 }
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  {link}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  )
}

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
