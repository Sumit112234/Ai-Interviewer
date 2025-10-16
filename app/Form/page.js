"use client"

import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Moon, Sun, User, Briefcase, GraduationCap, Code, Target, Sparkles, Zap, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUser } from "../context/auth"

export default function Form() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [formData, setFormData] = useState({
    fullName: "",
    education: "",
    workExperience: "",
    projects: "",
    skills: "",
    roleAppliedFor: "",
    otherDetails: "",
  })

  const [user, setUser] = useState(null)
  
    useEffect(() => {
      async function fetchUser() {
        const userData = await getUser()
        setUser(userData?.user || null)
      }
      fetchUser()
    },[])

    useEffect(()=>{
      if(!user) return ;

      console.log('coming here : ',user.name, user?.user?.name)
      setFormData({
        fullName:  user.name || "",
        education: Array.isArray(user.education) ? user.education.join(", ") : user.education || "",
        workExperience: Array.isArray(user.workExperience) ? user.workExperience.join(", ") : user.workExperience || "",
        projects: Array.isArray(user.projects) ? user.projects.join(", ") : user.projects || "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
        roleAppliedFor: Array.isArray(user.role) ? user.role.join(", ") : user.role || "",
        otherDetails: Array.isArray(user.additionalInfo) ? user.additionalInfo.join(", ") : user.additionalInfo || "",
      })


    },[user])
  
  
  const [focusedField, setFocusedField] = useState(null)
  const [completedFields, setCompletedFields] = useState(new Set())

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    
    // Mark field as completed if it has content
    if (value.trim()) {
      setCompletedFields(prev => new Set([...prev, field]))
    } else {
      setCompletedFields(prev => {
        const newSet = new Set(prev)
        newSet.delete(field)
        return newSet
      })
    }
  }

  const handleStartInterview = async () => {
    console.log("Form Data Submitted:", formData, user)
 
    if(!isFormValid) alert("Please fill in all required fields")
    try{
      const res = await fetch('/api/auth/update',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })

      if(!res.ok) throw new Error('Failed to update user')
      const data = await res.json()
      console.log('User updated:',data.user)

      localStorage.setItem("resumeData", JSON.stringify(formData))
      router.push("/interview")
      console.log("Interview started with data:", formData)
    }
    catch(e){
      alert('unable to update user!')
    }

  }

  const isFormValid =
    formData.fullName && formData.education && formData.workExperience && formData.skills && formData.roleAppliedFor

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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
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
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.h2
              className="text-6xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Practice Your Interview Skills
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <p className="text-2xl text-white/90 font-medium">
                Powered by Advanced AI
              </p>
              <Sparkles className="h-6 w-6 text-yellow-300" />
            </motion.div>
            <motion.p
              className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Get personalized interview questions based on your resume and receive detailed feedback to ace your next interview.
            </motion.p>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm border border-white/30">
              <motion.div 
                className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-end pr-2"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${(completedFields.size / 5) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {completedFields.size > 2 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-white font-bold"
                  >
                    {Math.round((completedFields.size / 5) * 100)}%
                  </motion.div>
                )}
              </motion.div>
            </div>
            <p className="text-center text-white/70 mt-2 text-sm">
              {completedFields.size}/5 required fields completed
            </p>
          </motion.div>

          {/* Resume Form */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-2xl  bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl border border-white/20">
              <CardHeader className="text-center pb-8">
                <motion.div
                  variants={pulseVariants}
                  animate="animate"
                >
                  <CardTitle className="text-3xl flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    <User className="h-8 w-8 text-purple-600" />
                    Resume Information
                  </CardTitle>
                </motion.div>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                  Fill in your details to get personalized interview questions
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="fullName" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                      <motion.div
                        animate={{ 
                          rotate: focusedField === "fullName" ? 360 : 0,
                          scale: focusedField === "fullName" ? 1.2 : 1 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <User className={`h-5 w-5 ${completedFields.has("fullName") ? "text-green-500" : "text-purple-500"}`} />
                      </motion.div>
                      Full Name *
                      {completedFields.has("fullName") && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-green-500 text-sm"
                        >
                          ✓
                        </motion.span>
                      )}
                    </Label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        className={`transition-all duration-300 ${
                          focusedField === "fullName" 
                            ? "ring-2 ring-purple-400 border-purple-400 bg-purple-50 dark:bg-purple-900/20" 
                            : completedFields.has("fullName")
                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Role Applied For */}
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="roleAppliedFor" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                      <motion.div
                        animate={{ 
                          rotate: focusedField === "roleAppliedFor" ? 360 : 0,
                          scale: focusedField === "roleAppliedFor" ? 1.2 : 1 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Target className={`h-5 w-5 ${completedFields.has("roleAppliedFor") ? "text-green-500" : "text-orange-500"}`} />
                      </motion.div>
                      Role Applied For *
                      {completedFields.has("roleAppliedFor") && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-green-500 text-sm"
                        >
                          ✓
                        </motion.span>
                      )}
                    </Label>
                    <Select 
                      onValueChange={(value) => handleInputChange("roleAppliedFor", value)}
                      onOpenChange={(open) => setFocusedField(open ? "roleAppliedFor" : null)}
                    >
                      <SelectTrigger className={`transition-all duration-300 ${
                        focusedField === "roleAppliedFor" 
                          ? "ring-2 ring-orange-400 border-orange-400 bg-orange-50 dark:bg-orange-900/20" 
                          : completedFields.has("roleAppliedFor")
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-orange-300"
                      }`}>
                        <SelectValue placeholder="Select your target role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20">
                        <SelectItem value="software-engineer">🚀 Software Engineer</SelectItem>
                        <SelectItem value="frontend-developer">🎨 Frontend Developer</SelectItem>
                        <SelectItem value="backend-developer">⚙️ Backend Developer</SelectItem>
                        <SelectItem value="fullstack-developer">🌟 Full Stack Developer</SelectItem>
                        <SelectItem value="data-scientist">📊 Data Scientist</SelectItem>
                        <SelectItem value="product-manager">📋 Product Manager</SelectItem>
                        <SelectItem value="ui-ux-designer">🎭 UI/UX Designer</SelectItem>
                        <SelectItem value="devops-engineer">☁️ DevOps Engineer</SelectItem>
                        <SelectItem value="other">💼 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>

                {/* Education */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="space-y-3"
                >
                  <Label htmlFor="education" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    <motion.div
                      animate={{ 
                        rotate: focusedField === "education" ? 360 : 0,
                        scale: focusedField === "education" ? 1.2 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <GraduationCap className={`h-5 w-5 ${completedFields.has("education") ? "text-green-500" : "text-blue-500"}`} />
                    </motion.div>
                    Education *
                    {completedFields.has("education") && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-500 text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Textarea
                      id="education"
                      placeholder="🎓 e.g., Bachelor's in Computer Science from XYZ University (2020-2024), Master's degree, certifications..."
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      onFocus={() => setFocusedField("education")}
                      onBlur={() => setFocusedField(null)}
                      className={`min-h-[100px] transition-all duration-300 ${
                        focusedField === "education" 
                          ? "ring-2 ring-blue-400 border-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                          : completedFields.has("education")
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    />
                  </motion.div>
                </motion.div>

                {/* Work Experience */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="space-y-3"
                >
                  <Label htmlFor="workExperience" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    <motion.div
                      animate={{ 
                        rotate: focusedField === "workExperience" ? 360 : 0,
                        scale: focusedField === "workExperience" ? 1.2 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Briefcase className={`h-5 w-5 ${completedFields.has("workExperience") ? "text-green-500" : "text-indigo-500"}`} />
                    </motion.div>
                    Work Experience *
                    {completedFields.has("workExperience") && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-500 text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Textarea
                      id="workExperience"
                      placeholder="💼 Describe your work experience, internships, or relevant positions. Include company names, roles, and key achievements..."
                      value={formData.workExperience}
                      onChange={(e) => handleInputChange("workExperience", e.target.value)}
                      onFocus={() => setFocusedField("workExperience")}
                      onBlur={() => setFocusedField(null)}
                      className={`min-h-[120px] transition-all duration-300 ${
                        focusedField === "workExperience" 
                          ? "ring-2 ring-indigo-400 border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" 
                          : completedFields.has("workExperience")
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    />
                  </motion.div>
                </motion.div>

                {/* Projects */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="space-y-3"
                >
                  <Label htmlFor="projects" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    <motion.div
                      animate={{ 
                        rotate: focusedField === "projects" ? 360 : 0,
                        scale: focusedField === "projects" ? 1.2 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Code className={`h-5 w-5 ${completedFields.has("projects") ? "text-green-500" : "text-pink-500"}`} />
                    </motion.div>
                    Projects
                    {completedFields.has("projects") && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-500 text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Textarea
                      id="projects"
                      placeholder="🚀 Describe your key projects, technologies used, and achievements. Include GitHub links, live demos, or portfolio pieces..."
                      value={formData.projects}
                      onChange={(e) => handleInputChange("projects", e.target.value)}
                      onFocus={() => setFocusedField("projects")}
                      onBlur={() => setFocusedField(null)}
                      className={`min-h-[120px] transition-all duration-300 ${
                        focusedField === "projects" 
                          ? "ring-2 ring-pink-400 border-pink-400 bg-pink-50 dark:bg-pink-900/20" 
                          : completedFields.has("projects")
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    />
                  </motion.div>
                </motion.div>

                {/* Skills */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="space-y-3"
                >
                  <Label htmlFor="skills" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    <motion.div
                      animate={{ 
                        rotate: focusedField === "skills" ? 360 : 0,
                        scale: focusedField === "skills" ? 1.2 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Zap className={`h-5 w-5 ${completedFields.has("skills") ? "text-green-500" : "text-yellow-500"}`} />
                    </motion.div>
                    Skills *
                    {completedFields.has("skills") && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-500 text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Textarea
                      id="skills"
                      placeholder="⚡ List your technical and soft skills (e.g., JavaScript, React, Python, Communication, Leadership, Problem Solving...)"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      onFocus={() => setFocusedField("skills")}
                      onBlur={() => setFocusedField(null)}
                      className={`min-h-[100px] transition-all duration-300 ${
                        focusedField === "skills" 
                          ? "ring-2 ring-yellow-400 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" 
                          : completedFields.has("skills")
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-yellow-300"
                      }`}
                    />
                  </motion.div>
                </motion.div>

                {/* Other Details */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="space-y-3"
                >
                  <Label htmlFor="otherDetails" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    <motion.div
                      animate={{ 
                        rotate: focusedField === "otherDetails" ? 360 : 0,
                        scale: focusedField === "otherDetails" ? 1.2 : 1 
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sparkles className={`h-5 w-5 ${completedFields.has("otherDetails") ? "text-green-500" : "text-cyan-500"}`} />
                    </motion.div>
                    Additional Information
                    {completedFields.has("otherDetails") && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-green-500 text-sm"
                      >
                        ✓
                      </motion.span>
                    )}
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Textarea
                      id="otherDetails"
                      placeholder="✨ Any other relevant information (certifications, achievements, awards, languages, volunteer work...)"
                      value={formData.otherDetails}
                      onChange={(e) => handleInputChange("otherDetails", e.target.value)}
                      onFocus={() => setFocusedField("otherDetails")}
                      onBlur={() => setFocusedField(null)}
                      className={`min-h-[100px] transition-all duration-300 ${
                        focusedField === "otherDetails" 
                          ? "ring-2 ring-cyan-400 border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                          : completedFields.has("otherDetails")
                          ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 hover:border-cyan-300"
                      }`}
                    />
                  </motion.div>
                </motion.div>

                {/* Start Interview Button */}
                <motion.div
                  className="pt-8"
                  variants={itemVariants}
                >
                  <motion.div
                    whileHover={{ scale: isFormValid ? 1.05 : 1 }}
                    whileTap={{ scale: isFormValid ? 0.95 : 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      onClick={handleStartInterview}
                      disabled={!isFormValid}
                      className={`w-full py-8 text-xl font-bold relative overflow-hidden transition-all duration-500 ${
                        isFormValid 
                          ? "bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 shadow-2xl shadow-purple-500/25" 
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      size="lg"
                    >
                      {isFormValid && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: [-100, 300] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {isFormValid ? (
                          <>
                            <Brain className="h-6 w-6" />
                            Start AI Interview
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="h-6 w-6" />
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <User className="h-6 w-6" />
                            Complete Required Fields
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={itemVariants}
          >
            {[
              {
                icon: Brain,
                title: "AI-Powered Questions",
                description: "Get personalized questions based on your resume and target role",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Target,
                title: "Real-Time Feedback",
                description: "Receive instant feedback on your answers to improve performance",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Practice Anytime",
                description: "Available 24/7 to help you prepare for your next big opportunity",
                gradient: "from-green-500 to-yellow-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="bg-white/20 dark:bg-black/20 backdrop-blur-xl border border-white/30 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="relative z-10 mt-20 border-t border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-white/70">
            © 2025 AI Resume Interviewer. Empowering your career journey with intelligent interview practice.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
