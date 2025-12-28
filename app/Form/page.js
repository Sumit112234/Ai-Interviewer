"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Moon, Sun, User, Briefcase, GraduationCap, Code, Target, Sparkles, 
  Zap, Brain, Upload, FileText, Edit3, CheckCircle2, AlertCircle 
} from "lucide-react"
import { getUser } from "../context/auth"
import { useRouter } from "next/navigation"
import Instructions from "@/components/Instruction"
import InterviewMode from "../interview/Full-screen-modal"

export default function EnhancedResumeForm() {
  const [theme, setTheme] = useState("light")
  const [inputMode, setInputMode] = useState("manual") // "manual" or "upload"
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [insOpen, setInsOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    education: "",
    workExperience: "",
    projects: "",
    skills: "",
    roleAppliedFor: "",
    otherDetails: "",
  })

  const router = useRouter()

    const [user, setUser] = useState(null)
    async function fetchUser() {
      try {
        const userData = await getUser()
        setUser(userData?.user || null)
        if(!userData) throw new Error('Not authenticated')
        // console.log({userData})
      } catch (error) {
        // console.log('Error fetching user:', error)
         router.push('/login?redirect=/Form')
      }
    }
  
    useEffect(() => {
      fetchUser()
    },[])

    useEffect(()=>{
      if(!user) 
        {
          return ;
        }

     // console.log('coming here : ',user.name, user?.user?.name)
      setFormData({
        fullName:  user.name || "",
        email: user.email || "",
        phone: user.phone || "",
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

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  const handleFileSelect = (selectedFile) => {
   // console.log("Selected file:", selectedFile)
    if (!selectedFile) return
    setFile(selectedFile)
    setUploadSuccess(false)
    // setTimeout(() => extractResumeData(), 1000)
    
  }

  const extractResumeData = async () => {
    if (!file) return alert("Please upload a file first.")

    const formDataUpload = new FormData()
    formDataUpload.append("file", file)

    setUploading(true)
    setUploadSuccess(false)

    try {
      const response = await fetch("https://permanent-ai.vercel.app/extract-resume", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await response.json()
      
    //  console.log(data)
      // Parse the raw_output JSON string
      let parsedData = {}
      try {
        parsedData = data
      } catch (e) {
        console.error("JSON parsing error:", e)
        parsedData = data
      }

      // Map API response to form fields
      setFormData({
        fullName: parsedData.name || "",
        email: parsedData.email || "",
        phone: parsedData.phone || "",
        education: Array.isArray(parsedData.education) 
          ? parsedData.education.map(edu => 
              `${edu.degree} from ${edu.institution} (${edu.end_date || 'Ongoing'})`
            ).join("\n\n")
          : parsedData.education || "",
        workExperience: Array.isArray(parsedData.experience)
          ? parsedData.experience.map(exp => 
              `${exp?.title} at ${exp?.company} (${exp?.start_date} - ${exp?.end_date})\n${exp?.description}`
            ).join("\n\n")
          : parsedData.workExperience || "",
        projects: Array.isArray(parsedData.projects)
          ? parsedData.projects.map(proj => 
              `${proj?.name}`).join("\n\n")
          : parsedData.projects || "",
        skills: Array.isArray(parsedData.skills)
          ? parsedData?.skills.join(", ")
          : parsedData?.skills || "",
        roleAppliedFor: "",
        otherDetails: parsedData?.summary || parsedData?.extras?.raw_text_excerpt || "",
      })

      // Mark all filled fields as completed
      const filled = new Set()
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.trim()) filled.add(key)
      })
      setCompletedFields(filled)

      setUploadSuccess(true)
      // setInputMode("manual")
      setTimeout(() => setInputMode("manual"), 1500)

    } catch (err) {
      console.error(err)
      alert("Failed to extract resume data. Please try again.")
    }

    setUploading(false)
  }

  const handleStartInterview = async () => {
 //console.log("Form Data Submitted:", formData, user)
 
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
    //  console.log('User updated:',data.user)

      localStorage.setItem("resumeData", JSON.stringify(formData))
      setInsOpen(true)
    
     // console.log("Interview started with data:", formData)
    }
    catch(e){
      alert('something went wrong')
    }
  }

  const isFormValid = formData.fullName && formData.education && 
                      formData.workExperience && formData.skills && formData.roleAppliedFor

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  }

  return (
    <div className="bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.18),transparent_60%)]"/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.12),transparent_60%)]"/>

     {insOpen &&  <Instructions isOpen={insOpen} setIsOpen={setInsOpen} />}
      {/* <InterviewMode/> */}
      {/* Header */}
      <motion.header 
        className="relative z-10 border-b border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Brain className="h-10 w-10 text-yellow-300" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              AI Resume Interviewer
            </h1>
          </motion.div>
          {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
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
          </motion.div> */}
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
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.h2
              className="text-6xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              Practice Your Interview Skills
            </motion.h2>
            <motion.p
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Upload your resume or fill the form manually to get AI-powered personalized interview questions
            </motion.p>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="flex justify-center gap-4">
              <motion.div
              
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                  inputMode === "upload"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-purple-500/50"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                }`}
              >
               

                 {uploading ? (
                          <span className="flex items-center justify-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Brain className="h-5 w-5" />
                            </motion.div>
                            Extracting Data...
                          </span>
                        ) : uploadSuccess ? (
                          <span className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="h-5 w-5" />
                            Data Extracted Successfully!
                          </span>
                        ) : (
                          <>
                          {
                            file ? (
                       <motion.div
                      whileHover={{ scale: file && !uploading ? 1.02 : 1 }}
                      whileTap={{ scale: file && !uploading ? 0.98 : 1 }}
                    >
                      <Button
                        onClick={extractResumeData}
                        disabled={!file || uploading}
                        className={`w-full py-6 rounded-xl text-lg font-semibold transition-all ${
                          uploadSuccess
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        } disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg`}
                      >
                        {uploading ? (
                          <span className="flex items-center justify-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Brain className="h-5 w-5" />
                            </motion.div>
                            Extracting Data...
                          </span>
                        ) : uploadSuccess ? (
                          <span className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="h-5 w-5" />
                            Data Extracted Successfully!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3">
                            <Sparkles className="h-5 w-5" />
                            Extract Resume Data
                          </span>
                        )}
                      </Button>
                    </motion.div>
                            ) : (
                          <label
                          htmlFor="uploadInput"
                          className="text-white  cursor-pointer flex  hover:text-gray-400 transition"
                          >
                          <Upload className="h-6 w-6 mr-2" />
                            Upload Resume
                          </label>)
}
                          </>
                        )}
 
               
                      <input
                        type="file"
                        accept=".pdf,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="hidden"
                        id="uploadInput"
                      />
              </motion.div>
              
              <motion.button
                onClick={() => setInputMode("manual")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                  inputMode === "manual"
                    ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-2xl shadow-green-500/50"
                    : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                }`}
              >
                <Edit3 className="h-6 w-6" />
                Fill Manually
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {inputMode === "upload" ? (
              /* Upload Section */
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_0_80px_rgba(124,58,237,0.15)] rounded-3xl">
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      <Upload className="h-8 w-8 text-blue-600" />
                      Upload Your Resume
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                      Upload PDF, DOCX, or image file and we'll extract your information automatically
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 p-8">
                    {/* Upload Box */}
                    <motion.div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                        dragActive 
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105" 
                          : "border-gray-300 dark:border-gray-600 hover:border-purple-400"
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragActive(true)
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* <input
                        type="file"
                        accept=".pdf,.docx,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="hidden"
                        id="uploadInput"
                      /> */}

                      {/* {file ? (
                        <motion.div 
                          className="flex flex-col items-center gap-4"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <FileText size={60} className="text-purple-500" />
                          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                          <label
                            htmlFor="uploadInput"
                            className="text-purple-500 underline cursor-pointer hover:text-purple-700 transition"
                          >
                            Change file
                          </label>
                        </motion.div>
                      ) : (
                        <label htmlFor="uploadInput" className="cursor-pointer">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Upload size={60} className="mx-auto text-gray-400 mb-4" />
                          </motion.div>
                          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-2">
                            Drag & drop your resume here
                          </p>
                          <p className="text-gray-500 dark:text-gray-400">or click to browse files</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                            Supports PDF, DOCX, PNG, JPG, JPEG
                          </p>
                        </label>
                      )} */}
                    </motion.div>

                    {/* Extract Button */}
                    <motion.div
                      whileHover={{ scale: file && !uploading ? 1.02 : 1 }}
                      whileTap={{ scale: file && !uploading ? 0.98 : 1 }}
                    >
                      <Button
                        onClick={extractResumeData}
                        disabled={!file || uploading}
                        className={`w-full py-6 rounded-xl text-lg font-semibold transition-all ${
                          uploadSuccess
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        } disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg`}
                      >
                        {uploading ? (
                          <span className="flex items-center justify-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Brain className="h-5 w-5" />
                            </motion.div>
                            Extracting Data...
                          </span>
                        ) : uploadSuccess ? (
                          <span className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="h-5 w-5" />
                            Data Extracted Successfully!
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3">
                            <Sparkles className="h-5 w-5" />
                            Extract Resume Data
                          </span>
                        )}
                      </Button>
                    </motion.div>

                    {uploadSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center"
                      >
                        <p className="text-green-700 dark:text-green-300 font-medium">
                          ✓ Your resume has been processed! Switching to form view...
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (

              
              /* Manual Form Section */
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {/* Progress Indicator */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm border border-white/30">
                    <motion.div 
                      className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-end pr-2"
                      initial={{ width: "0%" }}
                      animate={{ width: `${(completedFields.size / 6) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    >
                      {completedFields.size > 2 && (
                        <span className="text-xs text-white font-bold">
                          {Math.round((completedFields.size / 6) * 100)}%
                        </span>
                      )}
                    </motion.div>
                  </div>
                  <p className="text-center text-white/70 mt-2 text-sm">
                    {completedFields.size}/6 required fields completed
                  </p>
                </motion.div>
{/* {console.log({formData, completedFields})} */}
                <Card
  className="
    relative overflow-hidden rounded-[2.5rem]
    bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,0.12),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.12),transparent_60%)]
    backdrop-blur-2xl border border-white/10
    shadow-[0_0_120px_rgba(124,58,237,.25)]
  "
>
  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,.08),transparent)] animate-[scan_3.5s_linear_infinite]" />

  <CardHeader className="text-center pb-8">
    <CardTitle className="text-3xl flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
      <User className="h-8 w-8 text-green-600" />
      Resume Information
    </CardTitle>
    <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-4">
      Fill in your details to get personalized interview questions
    </CardDescription>
  </CardHeader>
  
  <CardContent className="space-y-8 p-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Full Name */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="space-y-3">
        <Label htmlFor="fullName" className="flex items-center gap-2 text-lg font-semibold">
          <User className={`h-5 w-5 ${completedFields.has("fullName") ? "text-green-500" : "text-purple-500"}`} />
          Full Name *
          {completedFields.has("fullName") && <span className="text-green-500 text-sm">✓</span>}
        </Label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          onFocus={() => setFocusedField("fullName")}
          onBlur={() => setFocusedField(null)}
          className="
            bg-white/5 border border-white/10 text-white placeholder-white/40
            focus:border-purple-400 focus:ring-0
            shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
            rounded-xl
          "
        />
      </motion.div>

      {/* Email */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="space-y-3">
        <Label htmlFor="email" className="flex items-center gap-2 text-lg font-semibold">
          <User className={`h-5 w-5 ${completedFields.has("email") ? "text-green-500" : "text-blue-500"}`} />
          Email
          {completedFields.has("email") && <span className="text-green-500 text-sm">✓</span>}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
          className="
            bg-white/5 border border-white/10 text-white placeholder-white/40
            focus:border-purple-400 focus:ring-0
            shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
            rounded-xl
          "
        />
      </motion.div>

      {/* Phone */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="space-y-3">
        <Label htmlFor="phone" className="flex items-center gap-2 text-lg font-semibold">
          <User className={`h-5 w-5 ${completedFields.has("phone") ? "text-green-500" : "text-cyan-500"}`} />
          Phone
          {completedFields.has("phone") && <span className="text-green-500 text-sm">✓</span>}
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+91 9876543210"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          onFocus={() => setFocusedField("phone")}
          onBlur={() => setFocusedField(null)}
          className="
            bg-white/5 border border-white/10 text-white placeholder-white/40
            focus:border-purple-400 focus:ring-0
            shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
            rounded-xl
          "
        />
      </motion.div>

      {/* Role Applied For */}
      <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="space-y-3">
        <Label htmlFor="roleAppliedFor" className="flex items-center gap-2 text-lg font-semibold">
          <Target className={`h-5 w-5 ${completedFields.has("roleAppliedFor") ? "text-green-500" : "text-orange-500"}`} />
          Role Applied For *
          {completedFields.has("roleAppliedFor") && <span className="text-green-500 text-sm">✓</span>}
        </Label>
        <Select 
          onValueChange={(value) => handleInputChange("roleAppliedFor", value)}
          value={formData.roleAppliedFor}
        >
          <SelectTrigger className="
            bg-white/5 border border-white/10 text-white placeholder-white/40
            focus:border-purple-400 focus:ring-0
            shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
            rounded-xl
          ">
            <SelectValue placeholder="Select your target role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white">
            <SelectItem value="software-engineer">🚀 Software Engineer</SelectItem>
            <SelectItem value="frontend-developer">🎨 Frontend Developer</SelectItem>
            <SelectItem value="backend-developer">⚙️ Backend Developer</SelectItem>
            <SelectItem value="fullstack-developer">🌟 Full Stack Developer</SelectItem>
            <SelectItem value="data-scientist">📊 Data Scientist</SelectItem>
            <SelectItem value="product-manager">📋 Product Manager</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </div>

    {/* Education */}
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="space-y-3">
      <Label htmlFor="education" className="flex items-center gap-2 text-lg font-semibold">
        <GraduationCap className={`h-5 w-5 ${completedFields.has("education") ? "text-green-500" : "text-blue-500"}`} />
        Education *
        {completedFields.has("education") && <span className="text-green-500 text-sm">✓</span>}
      </Label>
      <Textarea
        id="education"
        placeholder="🎓 e.g., Bachelor's in Computer Science from XYZ University (2020-2024)"
        value={formData.education}
        onChange={(e) => handleInputChange("education", e.target.value)}
        className="
          bg-white/5 border border-white/10 text-white placeholder-white/40
          focus:border-purple-400 focus:ring-0
          shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
          rounded-xl
        "
      />
    </motion.div>

    {/* Work Experience */}
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="space-y-3">
      <Label htmlFor="workExperience" className="flex items-center gap-2 text-lg font-semibold">
        <Briefcase className={`h-5 w-5 ${completedFields.has("workExperience") ? "text-green-500" : "text-indigo-500"}`} />
        Work Experience *
        {completedFields.has("workExperience") && <span className="text-green-500 text-sm">✓</span>}
      </Label>
      <Textarea
        id="workExperience"
        placeholder="💼 Describe your work experience, internships, or relevant positions"
        value={formData.workExperience}
        onChange={(e) => handleInputChange("workExperience", e.target.value)}
        className="
          bg-white/5 border border-white/10 text-white placeholder-white/40
          focus:border-purple-400 focus:ring-0
          shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
          rounded-xl
        "
      />
    </motion.div>

    {/* Projects */}
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="space-y-3">
      <Label htmlFor="projects" className="flex items-center gap-2 text-lg font-semibold">
        <Code className={`h-5 w-5 ${completedFields.has("projects") ? "text-green-500" : "text-pink-500"}`} />
        Projects
        {completedFields.has("projects") && <span className="text-green-500 text-sm">✓</span>}
      </Label>
      <Textarea
        id="projects"
        placeholder="🚀 Describe your key projects and technologies used"
        value={formData.projects}
        onChange={(e) => handleInputChange("projects", e.target.value)}
        className="
          bg-white/5 border border-white/10 text-white placeholder-white/40
          focus:border-purple-400 focus:ring-0
          shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
          rounded-xl
        "
      />
    </motion.div>

    {/* Skills */}
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="space-y-3">
      <Label htmlFor="skills" className="flex items-center gap-2 text-lg font-semibold">
        <Zap className={`h-5 w-5 ${completedFields.has("skills") ? "text-green-500" : "text-yellow-500"}`} />
        Skills *
        {completedFields.has("skills") && <span className="text-green-500 text-sm">✓</span>}
      </Label>
      <Textarea
        id="skills"
        placeholder="⚡ List your technical and soft skills (e.g., JavaScript, React, Python, Communication)"
        value={formData.skills}
        onChange={(e) => handleInputChange("skills", e.target.value)}
        className="
          bg-white/5 border border-white/10 text-white placeholder-white/40
          focus:border-purple-400 focus:ring-0
          shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
          rounded-xl
        "
      />
    </motion.div>

    {/* Other Details */}
    <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="space-y-3">
      <Label htmlFor="otherDetails" className="flex items-center gap-2 text-lg font-semibold">
        <Sparkles className={`h-5 w-5 ${completedFields.has("otherDetails") ? "text-green-500" : "text-cyan-500"}`} />
        Additional Information
        {completedFields.has("otherDetails") && <span className="text-green-500 text-sm">✓</span>}
      </Label>
      <Textarea
        id="otherDetails"
        placeholder="✨ Any other relevant information (certifications, achievements, awards)"
        value={formData.otherDetails}
        onChange={(e) => handleInputChange("otherDetails", e.target.value)}
        className="
          bg-white/5 border border-white/10 text-white placeholder-white/40
          focus:border-purple-400 focus:ring-0
          shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
          rounded-xl
        "
      />
    </motion.div>

    {/* Start Interview Button */}
    <motion.div className="pt-8" variants={itemVariants}>
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
                <AlertCircle className="h-6 w-6" />
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
            )}
          </AnimatePresence>

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
                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(124,58,237,.15)] hover:scale-[1.04] transition">
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
        transition={{ duration: 0.8, delay: 1 }}
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

// "use client"

// import { use, useEffect, useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Moon, Sun, User, Briefcase, GraduationCap, Code, Target, Sparkles, Zap, Brain } from "lucide-react"
// import { useRouter } from "next/navigation"
// import { getUser } from "../context/auth"


// export default function Form() {
//   const router = useRouter()
//   const [theme, setTheme] = useState("light")
//   const [formData, setFormData] = useState({
//     fullName: "",
//     education: "",
//     workExperience: "",
//     projects: "",
//     skills: "",
//     roleAppliedFor: "",
//     otherDetails: "",
//   })

//   const [user, setUser] = useState(null)
  
//     useEffect(() => {
//       async function fetchUser() {
//         const userData = await getUser()
//         setUser(userData?.user || null)
//       }
//       fetchUser()
//     },[])

//     useEffect(()=>{
//       if(!user) return ;

//       console.log('coming here : ',user.name, user?.user?.name)
//       setFormData({
//         fullName:  user.name || "",
//         education: Array.isArray(user.education) ? user.education.join(", ") : user.education || "",
//         workExperience: Array.isArray(user.workExperience) ? user.workExperience.join(", ") : user.workExperience || "",
//         projects: Array.isArray(user.projects) ? user.projects.join(", ") : user.projects || "",
//         skills: Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
//         roleAppliedFor: Array.isArray(user.role) ? user.role.join(", ") : user.role || "",
//         otherDetails: Array.isArray(user.additionalInfo) ? user.additionalInfo.join(", ") : user.additionalInfo || "",
//       })


//     },[user])
  
  
//   const [focusedField, setFocusedField] = useState(null)
//   const [completedFields, setCompletedFields] = useState(new Set())

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
    
//     // Mark field as completed if it has content
//     if (value.trim()) {
//       setCompletedFields(prev => new Set([...prev, field]))
//     } else {
//       setCompletedFields(prev => {
//         const newSet = new Set(prev)
//         newSet.delete(field)
//         return newSet
//       })
//     }
//   }

//   const handleStartInterview = async () => {
//     console.log("Form Data Submitted:", formData, user)
 
//     if(!isFormValid) alert("Please fill in all required fields")
//     try{
//       const res = await fetch('/api/auth/update',{
//         method:'PUT',
//         headers:{
//           'Content-Type':'application/json'
//         },
//         body:JSON.stringify(formData)
//       })

//       if(!res.ok) throw new Error('Failed to update user')
//       const data = await res.json()
//       console.log('User updated:',data.user)

//       localStorage.setItem("resumeData", JSON.stringify(formData))
//       router.push("/interview")
//       console.log("Interview started with data:", formData)
//    }
//     catch(e){
//       alert('unable to update user!')
//     }

//   }

//   const isFormValid =
//     formData.fullName && formData.education && formData.workExperience && formData.skills && formData.roleAppliedFor

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
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
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

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(20)].map((_, i) => (
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
//         variants={floatingVariants}
//         animate="animate"
//       />
//       <motion.div
//         className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-20 blur-3xl"
//         variants={floatingVariants}
//         animate="animate"
//         style={{ animationDelay: "2s" }}
//       />

//       {/* Header */}
//       <motion.header 
//         className="relative z-10 border-b border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
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
//           <motion.div
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className="bg-white/20 hover:bg-white/30 border border-white/30"
//             >
//               {theme === "dark" ? 
//                 <Sun className="h-5 w-5 text-yellow-300" /> : 
//                 <Moon className="h-5 w-5 text-purple-200" />
//               }
//             </Button>
//           </motion.div>
//         </div>
//       </motion.header>

//       <main className="container mx-auto px-4 py-8 relative z-10">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="max-w-5xl mx-auto"
//         >
//           {/* Hero Section */}
//           <motion.div className="text-center mb-16" variants={itemVariants}>
//             <motion.h2
//               className="text-6xl font-bold bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent mb-6"
//               initial={{ opacity: 0, scale: 0.5 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//             >
//               Practice Your Interview Skills
//             </motion.h2>
//             <motion.div
//               className="flex items-center justify-center gap-2 mb-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <Sparkles className="h-6 w-6 text-yellow-300" />
//               <p className="text-2xl text-white/90 font-medium">
//                 Powered by Advanced AI
//               </p>
//               <Sparkles className="h-6 w-6 text-yellow-300" />
//             </motion.div>
//             <motion.p
//               className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//             >
//               Get personalized interview questions based on your resume and receive detailed feedback to ace your next interview.
//             </motion.p>
//           </motion.div>

//           {/* Progress Indicator */}
//           <motion.div 
//             className="mb-8"
//             variants={itemVariants}
//           >
//             <div className="bg-white/20 rounded-full p-1 backdrop-blur-sm border border-white/30">
//               <motion.div 
//                 className="h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-end pr-2"
//                 initial={{ width: "0%" }}
//                 animate={{ 
//                   width: `${(completedFields.size / 5) * 100}%` 
//                 }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//               >
//                 {completedFields.size > 2 && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="text-xs text-white font-bold"
//                   >
//                     {Math.round((completedFields.size / 5) * 100)}%
//                   </motion.div>
//                 )}
//               </motion.div>
//             </div>
//             <p className="text-center text-white/70 mt-2 text-sm">
//               {completedFields.size}/5 required fields completed
//             </p>
//           </motion.div>

//           {/* Resume Form */}
//           <motion.div variants={itemVariants}>
//             <Card className="shadow-2xl  bg-gradient-to-br from-white/95 to-white/85 dark:from-gray-800/95 dark:to-gray-900/85 backdrop-blur-xl border border-white/20">
//               <CardHeader className="text-center pb-8">
//                 <motion.div
//                   variants={pulseVariants}
//                   animate="animate"
//                 >
//                   <CardTitle className="text-3xl flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
//                     <User className="h-8 w-8 text-purple-600" />
//                     Resume Information
//                   </CardTitle>
//                 </motion.div>
//                 <CardDescription className="text-lg text-gray-600 dark:text-gray-300 mt-4">
//                   Fill in your details to get personalized interview questions
//                 </CardDescription>
//               </CardHeader>
              
//               <CardContent className="space-y-8 p-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   {/* Full Name */}
//                   <motion.div 
//                     variants={itemVariants}
//                     whileHover={{ scale: 1.02 }}
//                     className="space-y-3"
//                   >
//                     <Label htmlFor="fullName" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                       <motion.div
//                         animate={{ 
//                           rotate: focusedField === "fullName" ? 360 : 0,
//                           scale: focusedField === "fullName" ? 1.2 : 1 
//                         }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <User className={`h-5 w-5 ${completedFields.has("fullName") ? "text-green-500" : "text-purple-500"}`} />
//                       </motion.div>
//                       Full Name *
//                       {completedFields.has("fullName") && (
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="text-green-500 text-sm"
//                         >
//                           ✓
//                         </motion.span>
//                       )}
//                     </Label>
//                     <motion.div
//                       whileFocus={{ scale: 1.02 }}
//                       transition={{ type: "spring", stiffness: 300 }}
//                     >
//                       <Input
//                         id="fullName"
//                         placeholder="Enter your full name"
//                         value={formData.fullName}
//                         onChange={(e) => handleInputChange("fullName", e.target.value)}
//                         onFocus={() => setFocusedField("fullName")}
//                         onBlur={() => setFocusedField(null)}
//                         className="
//                           bg-white/5 border border-white/10 text-white placeholder-white/40
//                           focus:border-purple-400 focus:ring-0
//                           shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                           rounded-xl
//                         "
//                       />
//                     </motion.div>
//                   </motion.div>

//                   {/* Role Applied For */}
//                   <motion.div 
//                     variants={itemVariants}
//                     whileHover={{ scale: 1.02 }}
//                     className="space-y-3"
//                   >
//                     <Label htmlFor="roleAppliedFor" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                       <motion.div
//                         animate={{ 
//                           rotate: focusedField === "roleAppliedFor" ? 360 : 0,
//                           scale: focusedField === "roleAppliedFor" ? 1.2 : 1 
//                         }}
//                         transition={{ duration: 0.3 }}
//                       >
//                         <Target className={`h-5 w-5 ${completedFields.has("roleAppliedFor") ? "text-green-500" : "text-orange-500"}`} />
//                       </motion.div>
//                       Role Applied For *
//                       {completedFields.has("roleAppliedFor") && (
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="text-green-500 text-sm"
//                         >
//                           ✓
//                         </motion.span>
//                       )}
//                     </Label>
//                     <Select 
//                       onValueChange={(value) => handleInputChange("roleAppliedFor", value)}
//                       onOpenChange={(open) => setFocusedField(open ? "roleAppliedFor" : null)}
//                     >
//                       <SelectTrigger className="
//                         bg-white/5 border border-white/10 text-white placeholder-white/40
//                         focus:border-purple-400 focus:ring-0
//                         shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                         rounded-xl
//                       ">
//                         <SelectValue placeholder="Select your target role" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20">
//                         <SelectItem value="software-engineer">🚀 Software Engineer</SelectItem>
//                         <SelectItem value="frontend-developer">🎨 Frontend Developer</SelectItem>
//                         <SelectItem value="backend-developer">⚙️ Backend Developer</SelectItem>
//                         <SelectItem value="fullstack-developer">🌟 Full Stack Developer</SelectItem>
//                         <SelectItem value="data-scientist">📊 Data Scientist</SelectItem>
//                         <SelectItem value="product-manager">📋 Product Manager</SelectItem>
//                         <SelectItem value="ui-ux-designer">🎭 UI/UX Designer</SelectItem>
//                         <SelectItem value="devops-engineer">☁️ DevOps Engineer</SelectItem>
//                         <SelectItem value="other">💼 Other</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </motion.div>
//                 </div>

//                 {/* Education */}
//                 <motion.div 
//                   variants={itemVariants}
//                   whileHover={{ scale: 1.01 }}
//                   className="space-y-3"
//                 >
//                   <Label htmlFor="education" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     <motion.div
//                       animate={{ 
//                         rotate: focusedField === "education" ? 360 : 0,
//                         scale: focusedField === "education" ? 1.2 : 1 
//                       }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <GraduationCap className={`h-5 w-5 ${completedFields.has("education") ? "text-green-500" : "text-blue-500"}`} />
//                     </motion.div>
//                     Education *
//                     {completedFields.has("education") && (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-green-500 text-sm"
//                       >
//                         ✓
//                       </motion.span>
//                     )}
//                   </Label>
//                   <motion.div
//                     whileFocus={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <Textarea
//                       id="education"
//                       placeholder="🎓 e.g., Bachelor's in Computer Science from XYZ University (2020-2024), Master's degree, certifications..."
//                       value={formData.education}
//                       onChange={(e) => handleInputChange("education", e.target.value)}
//                       onFocus={() => setFocusedField("education")}
//                       onBlur={() => setFocusedField(null)}
//                       className="
//                         bg-white/5 border border-white/10 text-white placeholder-white/40
//                         focus:border-purple-400 focus:ring-0
//                         shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                         rounded-xl
//                       "
//                     />
//                   </motion.div>
//                 </motion.div>

//                 {/* Work Experience */}
//                 <motion.div 
//                   variants={itemVariants}
//                   whileHover={{ scale: 1.01 }}
//                   className="space-y-3"
//                 >
//                   <Label htmlFor="workExperience" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     <motion.div
//                       animate={{ 
//                         rotate: focusedField === "workExperience" ? 360 : 0,
//                         scale: focusedField === "workExperience" ? 1.2 : 1 
//                       }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Briefcase className={`h-5 w-5 ${completedFields.has("workExperience") ? "text-green-500" : "text-indigo-500"}`} />
//                     </motion.div>
//                     Work Experience *
//                     {completedFields.has("workExperience") && (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-green-500 text-sm"
//                       >
//                         ✓
//                       </motion.span>
//                     )}
//                   </Label>
//                   <motion.div
//                     whileFocus={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <Textarea
//                       id="workExperience"
//                       placeholder="💼 Describe your work experience, internships, or relevant positions. Include company names, roles, and key achievements..."
//                       value={formData.workExperience}
//                       onChange={(e) => handleInputChange("workExperience", e.target.value)}
//                       onFocus={() => setFocusedField("workExperience")}
//                       onBlur={() => setFocusedField(null)}
//                       className="
//                         bg-white/5 border border-white/10 text-white placeholder-white/40
//                         focus:border-purple-400 focus:ring-0
//                         shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                         rounded-xl
//                       "
//                     />
//                   </motion.div>
//                 </motion.div>

//                 {/* Projects */}
//                 <motion.div 
//                   variants={itemVariants}
//                   whileHover={{ scale: 1.01 }}
//                   className="space-y-3"
//                 >
//                   <Label htmlFor="projects" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     <motion.div
//                       animate={{ 
//                         rotate: focusedField === "projects" ? 360 : 0,
//                         scale: focusedField === "projects" ? 1.2 : 1 
//                       }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Code className={`h-5 w-5 ${completedFields.has("projects") ? "text-green-500" : "text-pink-500"}`} />
//                     </motion.div>
//                     Projects
//                     {completedFields.has("projects") && (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-green-500 text-sm"
//                       >
//                         ✓
//                       </motion.span>
//                     )}
//                   </Label>
//                   <motion.div
//                     whileFocus={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <Textarea
//                       id="projects"
//                       placeholder="🚀 Describe your key projects, technologies used, and achievements. Include GitHub links, live demos, or portfolio pieces..."
//                       value={formData.projects}
//                       onChange={(e) => handleInputChange("projects", e.target.value)}
//                       onFocus={() => setFocusedField("projects")}
//                       onBlur={() => setFocusedField(null)}
//                       className="
//                         bg-white/5 border border-white/10 text-white placeholder-white/40
//                         focus:border-purple-400 focus:ring-0
//                         shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                         rounded-xl
//                       "
//                     />
//                   </motion.div>
//                 </motion.div>

//                 {/* Skills */}
//                 <motion.div 
//                   variants={itemVariants}
//                   whileHover={{ scale: 1.01 }}
//                   className="space-y-3"
//                 >
//                   <Label htmlFor="skills" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     <motion.div
//                       animate={{ 
//                         rotate: focusedField === "skills" ? 360 : 0,
//                         scale: focusedField === "skills" ? 1.2 : 1 
//                       }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Zap className={`h-5 w-5 ${completedFields.has("skills") ? "text-green-500" : "text-yellow-500"}`} />
//                     </motion.div>
//                     Skills *
//                     {completedFields.has("skills") && (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-green-500 text-sm"
//                       >
//                         ✓
//                       </motion.span>
//                     )}
//                   </Label>
//                   <motion.div
//                     whileFocus={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <Textarea
//                       id="skills"
//                       placeholder="⚡ List your technical and soft skills (e.g., JavaScript, React, Python, Communication, Leadership, Problem Solving...)"
//                       value={formData.skills}
//                       onChange={(e) => handleInputChange("skills", e.target.value)}
//                       onFocus={() => setFocusedField("skills")}
//                       onBlur={() => setFocusedField(null)}
//                       className="
//                         bg-white/5 border border-white/10 text-white placeholder-white/40
//                         focus:border-purple-400 focus:ring-0
//                         shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                         rounded-xl
//                       "
//                     />
//                   </motion.div>
//                 </motion.div>

//                 {/* Other Details */}
//                 <motion.div 
//                   variants={itemVariants}
//                   whileHover={{ scale: 1.01 }}
//                   className="space-y-3"
//                 >
//                   <Label htmlFor="otherDetails" className="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
//                     <motion.div
//                       animate={{ 
//                         rotate: focusedField === "otherDetails" ? 360 : 0,
//                         scale: focusedField === "otherDetails" ? 1.2 : 1 
//                       }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       <Sparkles className={`h-5 w-5 ${completedFields.has("otherDetails") ? "text-green-500" : "text-cyan-500"}`} />
//                     </motion.div>
//                     Additional Information
//                     {completedFields.has("otherDetails") && (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="text-green-500 text-sm"
//                       >
//                         ✓
//                       </motion.span>
//                     )}
//                   </Label>
//                   <motion.div
//                     whileFocus={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                   >
//                     <Textarea
//                       id="otherDetails"
//                       placeholder="✨ Any other relevant information (certifications, achievements, awards, languages, volunteer work...)"
//                       value={formData.otherDetails}
//                       onChange={(e) => handleInputChange("otherDetails", e.target.value)}
//                       onFocus={() => setFocusedField("otherDetails")}
//                       onBlur={() => setFocusedField(null)}
//                       className="
//                         bg-white/5 border border-white/10 text-white placeholder-white/40
//                         focus:border-purple-400 focus:ring-0
//                         shadow-[inset_0_0_20px_rgba(124,58,237,.25)]
//                         rounded-xl
//                       "
//                     />
//                   </motion.div>
//                 </motion.div>

//                 {/* Start Interview Button */}
//                 <motion.div
//                   className="pt-8"
//                   variants={itemVariants}
//                 >
//                   <motion.div
//                     whileHover={{ scale: isFormValid ? 1.05 : 1 }}
//                     whileTap={{ scale: isFormValid ? 0.95 : 1 }}
//                     transition={{ type: "spring", stiffness: 400 }}
//                   >
//                     <Button
//                       onClick={handleStartInterview}
//                       disabled={!isFormValid}
//                       className={`w-full py-8 text-xl font-bold relative overflow-hidden transition-all duration-500 ${
//                         isFormValid 
//                           ? "bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 hover:from-green-600 hover:via-blue-700 hover:to-purple-700 shadow-2xl shadow-purple-500/25" 
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                       size="lg"
//                     >
//                       {isFormValid && (
//                         <motion.div
//                           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                           animate={{ x: [-100, 300] }}
//                           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                         />
//                       )}
//                       <span className="relative z-10 flex items-center justify-center gap-3">
//                         {isFormValid ? (
//                           <>
//                             <Brain className="h-6 w-6" />
//                             Start AI Interview
//                             <motion.div
//                               animate={{ rotate: 360 }}
//                               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                             >
//                               <Sparkles className="h-6 w-6" />
//                             </motion.div>
//                           </>
//                         ) : (
//                           <>
//                             <User className="h-6 w-6" />
//                             Complete Required Fields
//                           </>
//                         )}
//                       </span>
//                     </Button>
//                   </motion.div>
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Features Section */}
//           <motion.div 
//             className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
//             variants={itemVariants}
//           >
//             {[
//               {
//                 icon: Brain,
//                 title: "AI-Powered Questions",
//                 description: "Get personalized questions based on your resume and target role",
//                 gradient: "from-purple-500 to-pink-500"
//               },
//               {
//                 icon: Target,
//                 title: "Real-Time Feedback",
//                 description: "Receive instant feedback on your answers to improve performance",
//                 gradient: "from-blue-500 to-cyan-500"
//               },
//               {
//                 icon: Zap,
//                 title: "Practice Anytime",
//                 description: "Available 24/7 to help you prepare for your next big opportunity",
//                 gradient: "from-green-500 to-yellow-500"
//               }
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ scale: 1.05, y: -5 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(124,58,237,.15)] hover:scale-[1.04] transition">
//                   <CardContent className="p-6 text-center">
//                     <motion.div
//                       className={`inline-flex p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-4`}
//                       whileHover={{ rotate: 360 }}
//                       transition={{ duration: 0.6 }}
//                     >
//                       <feature.icon className="h-8 w-8 text-white" />
//                     </motion.div>
//                     <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
//                     <p className="text-white/80">{feature.description}</p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </main>

//       {/* Footer */}
//       <motion.footer 
//         className="relative z-10 mt-20 border-t border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl"
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
//       >
//         <div className="container mx-auto px-4 py-8 text-center">
//           <p className="text-white/70">
//             © 2025 AI Resume Interviewer. Empowering your career journey with intelligent interview practice.
//           </p>
//         </div>
//       </motion.footer>
//     </div>
//   )
// }
