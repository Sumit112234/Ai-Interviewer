"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, Mail, Lock, User, ArrowLeft, Sparkles } from "lucide-react"
import { register } from "../context/auth"

// Rocket Illustration Component
const RocketIllustration = ({ isFormValid }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative w-40 h-40 mx-auto mb-4"
    >
      {/* Stars in background */}
      <motion.div
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-5 left-5 w-2 h-2 bg-yellow-300 rounded-full"
      />
      <motion.div
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="absolute top-10 right-8 w-2 h-2 bg-blue-300 rounded-full"
      />
      <motion.div
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-16 left-12 w-2 h-2 bg-pink-300 rounded-full"
      />

      {/* Rocket */}
      <motion.div
        animate={{
          y: isFormValid ? [-5, 5, -5] : [0, 2, 0],
          rotate: isFormValid ? [-2, 2, -2] : 0
        }}
        transition={{
          duration: isFormValid ? 1.5 : 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        {/* Rocket Body */}
        <div className="relative">
          {/* Nose Cone */}
          <div className="w-16 h-20 mx-auto bg-gradient-to-b from-red-400 to-red-500 rounded-t-full relative z-10" />
          
          {/* Window */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full border-4 border-red-500 z-20">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-white/60 rounded-full absolute top-1 left-1"
            />
          </div>

          {/* Main Body */}
          <div className="w-20 h-24 mx-auto bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 relative -mt-1">
            {/* Side Fins */}
            <div className="absolute -left-6 bottom-4 w-8 h-16 bg-gradient-to-br from-blue-400 to-blue-600 transform -skew-y-12 rounded-l-lg" />
            <div className="absolute -right-6 bottom-4 w-8 h-16 bg-gradient-to-bl from-blue-400 to-blue-600 transform skew-y-12 rounded-r-lg" />
          </div>

          {/* Flame Animation */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 flex gap-1">
            <motion.div
              animate={{
                scaleY: isFormValid ? [1, 1.5, 1] : [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
              className="w-4 h-8 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full"
            />
            <motion.div
              animate={{
                scaleY: isFormValid ? [1, 1.6, 1] : [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.1 }}
              className="w-5 h-12 bg-gradient-to-b from-orange-300 via-orange-500 to-red-500 rounded-b-full"
            />
            <motion.div
              animate={{
                scaleY: isFormValid ? [1, 1.5, 1] : [1, 1.2, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ duration: 0.3, repeat: Infinity, delay: 0.05 }}
              className="w-4 h-8 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full"
            />
          </div>

          {/* Sparkle particles when form is valid */}
          <AnimatePresence>
            {isFormValid && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 60],
                      y: [0, -30 - Math.random() * 30],
                      opacity: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="absolute bottom-0 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Success message when form is valid */}
      <AnimatePresence>
        {isFormValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-green-400 text-sm font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4" />
            Ready to launch!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const isFormValid = formData.name && 
                      formData.email && 
                      formData.password && 
                      formData.confirmPassword && 
                      formData.password === formData.confirmPassword &&
                      formData.password.length >= 6

  const handleSubmit = async () => {
    setError("")

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {


      const data = await register(formData.name, formData.email, formData.password, false)

      if (data.error) {
        throw new Error(data.msg || "Something went wrong")
      }

      // console.log(data)

      window.location.href = "/"
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 0],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -180, 0],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{ duration: 20, repeat: Infinity, delay: 3 }}
          className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 100, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 22, repeat: Infinity, delay: 1.5 }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500 rounded-full blur-3xl"
        />
        
        {/* Floating stars */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 z-10"
      >
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardHeader className="text-center space-y-4 pb-2">
            {/* Rocket Illustration */}
            <RocketIllustration isFormValid={isFormValid} />
            
            {/* <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <UserPlus className="h-7 w-7 text-white" />
            </motion.div> */}
            <CardTitle className="text-4xl mt-5 font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Join the Journey
            </CardTitle>
            <CardDescription className="text-blue-200">
              Create your account and start your interview prep adventure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4" onKeyPress={handleKeyPress}>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/20 border border-red-400/50 text-red-200 p-3 rounded-lg text-sm backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-200">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Ram Kumar"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-blue-300/50 focus:border-blue-400 focus:ring-blue-400/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ramkumar@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-blue-300/50 focus:border-purple-400 focus:ring-purple-400/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-blue-300/50 focus:border-pink-400 focus:ring-pink-400/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-blue-200">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-blue-300/50 focus:border-pink-400 focus:ring-pink-400/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-6 shadow-lg shadow-purple-500/50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Sign Up
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="text-center text-sm text-blue-200">
                Already have an account?{" "}
                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-pink-400 hover:text-pink-300 font-semibold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { UserPlus, Loader2, Mail, Lock, User } from "lucide-react"
// import Link from "next/link"

// export default function SignupPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState("")

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//     setError("")
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError("")

//     // Validation
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError("Please fill in all fields")
//       return
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match")
//       return
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password
//         })
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Something went wrong")
//       }

//       // Redirect to dashboard or home
//       router.push("/")
//       router.refresh()
//     } catch (err) {
//       setError(err.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <Card className="shadow-2xl">
//           <CardHeader className="text-center space-y-2">
//             <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
//               <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//             </div>
//             <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
//             <CardDescription>Sign up to start your interview practice</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
//                   {error}
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label htmlFor="name">Full Name</Label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="name"
//                     name="name"
//                     type="text"
//                     placeholder="John Doe"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="pl-10"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="john@example.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="pl-10"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type="password"
//                     placeholder="••••••••"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="pl-10"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="••••••••"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="pl-10"
//                     disabled={isLoading}
//                   />
//                 </div>
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating account...
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="mr-2 h-4 w-4" />
//                     Sign Up
//                   </>
//                 )}
//               </Button>

//               <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//                 Already have an account?{" "}
//                 <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">
//                   Login here
//                 </Link>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }