"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, LogIn, ArrowLeft } from "lucide-react"

// Cute Owl Component
const OwlIllustration = ({ isPasswordFocused }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative w-32 h-32 mx-auto mb-4"
    >
      {/* Owl Body */}
      <motion.div
        animate={{ rotate: isPasswordFocused ? [0, -5, 5, -5, 0] : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        {/* Main body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-purple-400 to-purple-500 rounded-[60%_60%_50%_50%]" />
        
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-[50%_50%_45%_45%]" />
        
        {/* Ears */}
        <div className="absolute top-0 left-3 w-6 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-full transform -rotate-12" />
        <div className="absolute top-0 right-3 w-6 h-10 bg-gradient-to-bl from-indigo-500 to-purple-600 rounded-t-full transform rotate-12" />
        
        {/* Belly */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-14 bg-gradient-to-b from-pink-200 to-pink-300 rounded-[50%_50%_40%_40%]" />
        
        {/* Eyes Container */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
          {/* Left Eye */}
          <motion.div
            animate={{
              scaleY: isPasswordFocused ? 0 : 1,
              y: isPasswordFocused ? 4 : 0
            }}
            transition={{ duration: 0.3 }}
            className="relative w-8 h-10 bg-white rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ y: isPasswordFocused ? 0 : [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
            </motion.div>
          </motion.div>
          
          {/* Right Eye */}
          <motion.div
            animate={{
              scaleY: isPasswordFocused ? 0 : 1,
              y: isPasswordFocused ? 4 : 0
            }}
            transition={{ duration: 0.3 }}
            className="relative w-8 h-10 bg-white rounded-full overflow-hidden"
          >
            <motion.div
              animate={{ y: isPasswordFocused ? 0 : [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </div>

        {/* Wings covering eyes when password focused */}
        <AnimatePresence>
          {isPasswordFocused && (
            <>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-10 left-4 w-10 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-[50%_0%_50%_50%] transform -rotate-12"
              />
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-10 right-4 w-10 h-12 bg-gradient-to-bl from-purple-400 to-purple-600 rounded-[0%_50%_50%_50%] transform rotate-12"
              />
            </>
          )}
        </AnimatePresence>
        
        {/* Beak */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-orange-400 to-orange-500 rounded-b-full" />
        
        {/* Feet */}
        <div className="absolute -bottom-2 left-8 flex gap-1">
          <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
          <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
        </div>
        <div className="absolute -bottom-2 right-8 flex gap-1">
          <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
          <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError("")
  }

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true)
  }

  const handlePasswordBlur = () => {
    if (!formData.password) {
      setIsPasswordFocused(false)
    }
  }

  const handleSubmit = async () => {
    setError("")

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials")
      }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500 rounded-full blur-3xl"
        />
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
            {/* Owl Illustration */}
            <OwlIllustration isPasswordFocused={isPasswordFocused} />
            
            {/* <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mx-auto w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <LogIn className="h-7 w-7 text-white" />
            </motion.div> */}
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-purple-200">
              Log in to continue your interview practice journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5" onKeyPress={handleKeyPress}>
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
                <Label htmlFor="email" className="text-purple-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-purple-300" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="ramkumar@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-purple-400 focus:ring-purple-400/50 backdrop-blur-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-purple-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-300" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handlePasswordFocus}
                    onBlur={handlePasswordBlur}
                    className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 focus:border-pink-400 focus:ring-pink-400/50 backdrop-blur-sm"
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
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold py-6 shadow-lg shadow-purple-500/50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </>
                  )}
                </Button>
              </motion.div>

              <div className="text-center text-sm text-purple-200">
                Don't have an account?{" "}
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="text-pink-400 hover:text-pink-300 font-semibold hover:underline cursor-pointer"
                >
                  Sign up here
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
// import { Loader2, Mail, Lock, LogIn } from "lucide-react"
// import Link from "next/link"

// export default function LoginPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
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
//     if (!formData.email || !formData.password) {
//       setError("Please fill in all fields")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const response = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password
//         })
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Invalid credentials")
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
//               <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400" />
//             </div>
//             <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
//             <CardDescription>Log in to continue your interview practice</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && (
//                 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
//                   {error}
//                 </div>
//               )}

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

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   <>
//                     <LogIn className="mr-2 h-4 w-4" />
//                     Login
//                   </>
//                 )}
//               </Button>

//               <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//                 Don't have an account?{" "}
//                 <Link href="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
//                   Sign up here
//                 </Link>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }
