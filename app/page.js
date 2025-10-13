import DynamicFaceAvatar from "@/components/RealisticAiAvatar";
import Dashboard from "./Dashboard/page";
import Temporary from "./temporary/page";
export default function Home() {
  return (
    <div>
      <Dashboard/>
      {/* <DynamicFaceAvatar
        personality="professional" 
        isSpeaking={false} 
        isLoading={false} 
        emotion="neutral" 
        eyeDirection="center" 
        currentText="" 
        speechProgress={0} 
        imageBasePath="/images/avatar" 
      />
       */}

       {/* <Temporary/> */}
       
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useRouter } from "next/navigation"
// import { Moon, Sun, User, Briefcase, GraduationCap, Code, Target } from "lucide-react"
// import { useTheme } from "next-themes"

// export default function HomePage() {
//   const router = useRouter()
//   const { theme, setTheme } = useTheme()
//   const [formData, setFormData] = useState({
//     fullName: "",
//     education: "",
//     workExperience: "",
//     projects: "",
//     skills: "",
//     roleAppliedFor: "",
//     otherDetails: "",
//   })

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleStartInterview = () => {
//     // Save form data to localStorage
//     localStorage.setItem("resumeData", JSON.stringify(formData))
//     router.push("/interview")
//   }

//   const isFormValid =
//     formData.fullName && formData.education && formData.workExperience && formData.skills && formData.roleAppliedFor

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       {/* Header */}
//       <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <Briefcase className="h-8 w-8 text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Resume Interviewer</h1>
//           </div>
//           <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
//             {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//           </Button>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="max-w-4xl mx-auto"
//         >
//           {/* Hero Section */}
//           <div className="text-center mb-12">
//             <motion.h2
//               className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//             >
//               Practice Your Interview Skills with AI
//             </motion.h2>
//             <motion.p
//               className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//             >
//               Get personalized interview questions based on your resume and receive detailed feedback to improve your
//               performance.
//             </motion.p>
//           </div>

//           {/* Resume Form */}
//           <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
//             <CardHeader className="text-center">
//               <CardTitle className="text-2xl flex items-center justify-center gap-2">
//                 <User className="h-6 w-6 text-blue-600" />
//                 Resume Information
//               </CardTitle>
//               <CardDescription>Fill in your details to get personalized interview questions</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Full Name */}
//                 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
//                   <Label htmlFor="fullName" className="flex items-center gap-2">
//                     <User className="h-4 w-4" />
//                     Full Name *
//                   </Label>
//                   <Input
//                     id="fullName"
//                     placeholder="Enter your full name"
//                     value={formData.fullName}
//                     onChange={(e) => handleInputChange("fullName", e.target.value)}
//                     className="mt-2"
//                   />
//                 </motion.div>

//                 {/* Role Applied For */}
//                 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
//                   <Label htmlFor="roleAppliedFor" className="flex items-center gap-2">
//                     <Target className="h-4 w-4" />
//                     Role Applied For *
//                   </Label>
//                   <Select onValueChange={(value) => handleInputChange("roleAppliedFor", value)}>
//                     <SelectTrigger className="mt-2">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="software-engineer">Software Engineer</SelectItem>
//                       <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
//                       <SelectItem value="backend-developer">Backend Developer</SelectItem>
//                       <SelectItem value="fullstack-developer">Full Stack Developer</SelectItem>
//                       <SelectItem value="data-scientist">Data Scientist</SelectItem>
//                       <SelectItem value="product-manager">Product Manager</SelectItem>
//                       <SelectItem value="ui-ux-designer">UI/UX Designer</SelectItem>
//                       <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
//                       <SelectItem value="other">Other</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </motion.div>
//               </div>

//               {/* Education */}
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
//                 <Label htmlFor="education" className="flex items-center gap-2">
//                   <GraduationCap className="h-4 w-4" />
//                   Education *
//                 </Label>
//                 <Textarea
//                   id="education"
//                   placeholder="e.g., Bachelor's in Computer Science from XYZ University (2020-2024)"
//                   value={formData.education}
//                   onChange={(e) => handleInputChange("education", e.target.value)}
//                   className="mt-2 min-h-[80px]"
//                 />
//               </motion.div>

//               {/* Work Experience */}
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
//                 <Label htmlFor="workExperience" className="flex items-center gap-2">
//                   <Briefcase className="h-4 w-4" />
//                   Work Experience *
//                 </Label>
//                 <Textarea
//                   id="workExperience"
//                   placeholder="Describe your work experience, internships, or relevant positions..."
//                   value={formData.workExperience}
//                   onChange={(e) => handleInputChange("workExperience", e.target.value)}
//                   className="mt-2 min-h-[100px]"
//                 />
//               </motion.div>

//               {/* Projects */}
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
//                 <Label htmlFor="projects" className="flex items-center gap-2">
//                   <Code className="h-4 w-4" />
//                   Projects
//                 </Label>
//                 <Textarea
//                   id="projects"
//                   placeholder="Describe your key projects, technologies used, and achievements..."
//                   value={formData.projects}
//                   onChange={(e) => handleInputChange("projects", e.target.value)}
//                   className="mt-2 min-h-[100px]"
//                 />
//               </motion.div>

//               {/* Skills */}
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
//                 <Label htmlFor="skills" className="flex items-center gap-2">
//                   <Code className="h-4 w-4" />
//                   Skills *
//                 </Label>
//                 <Textarea
//                   id="skills"
//                   placeholder="List your technical and soft skills (e.g., JavaScript, React, Python, Communication, Leadership...)"
//                   value={formData.skills}
//                   onChange={(e) => handleInputChange("skills", e.target.value)}
//                   className="mt-2 min-h-[80px]"
//                 />
//               </motion.div>

//               {/* Other Details */}
//               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
//                 <Label htmlFor="otherDetails">Additional Information</Label>
//                 <Textarea
//                   id="otherDetails"
//                   placeholder="Any other relevant information (certifications, achievements, etc.)"
//                   value={formData.otherDetails}
//                   onChange={(e) => handleInputChange("otherDetails", e.target.value)}
//                   className="mt-2 min-h-[80px]"
//                 />
//               </motion.div>

//               {/* Start Interview Button */}
//               <motion.div
//                 className="pt-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 1.3 }}
//               >
//                 <Button
//                   onClick={handleStartInterview}
//                   disabled={!isFormValid}
//                   className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
//                   size="lg"
//                 >
//                   Start AI Interview
//                 </Button>
//                 {!isFormValid && (
//                   <p className="text-sm text-red-500 mt-2 text-center">Please fill in all required fields (*)</p>
//                 )}
//               </motion.div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </main>
//     </div>
//   )
// }
