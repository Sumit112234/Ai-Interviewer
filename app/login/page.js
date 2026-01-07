"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock, LogIn, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { GoogleLoginButton } from "@/components/GoogleButton"
import { GoogleLogin } from "@react-oauth/google"
import { login, register } from "../context/auth"

// Cute Owl Component
// const OwlIllustration = ({ isPasswordFocused }) => {
//   return (
//     <motion.div
//       initial={{ scale: 0, rotate: -180 }}
//       animate={{ scale: 1, rotate: 0 }}
//       transition={{ type: "spring", stiffness: 260, damping: 20 }}
//       className="relative w-32 h-32 mx-auto mb-4"
//     >
//       {/* Owl Body */}
//       <motion.div
//         animate={{ rotate: isPasswordFocused ? [0, -5, 5, -5, 0] : 0 }}
//         transition={{ duration: 0.5 }}
//         className="absolute inset-0"
//       >
//         {/* Main body */}
//         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-purple-400 to-purple-500 rounded-[60%_60%_50%_50%]" />
        
//         {/* Head */}
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-[50%_50%_45%_45%]" />
        
//         {/* Ears */}
//         <div className="absolute top-0 left-3 w-6 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-full transform -rotate-12" />
//         <div className="absolute top-0 right-3 w-6 h-10 bg-gradient-to-bl from-indigo-500 to-purple-600 rounded-t-full transform rotate-12" />
        
//         {/* Belly */}
//         <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-14 bg-gradient-to-b from-pink-200 to-pink-300 rounded-[50%_50%_40%_40%]" />
        
//         {/* Eyes Container */}
//         <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3">
//           {/* Left Eye */}
//           <motion.div
//             animate={{
//               scaleY: isPasswordFocused ? 0 : 1,
//               y: isPasswordFocused ? 4 : 0
//             }}
//             transition={{ duration: 0.3 }}
//             className="relative w-8 h-10 bg-white rounded-full overflow-hidden"
//           >
//             <motion.div
//               animate={{ y: isPasswordFocused ? 0 : [0, 2, 0] }}
//               transition={{ duration: 2, repeat: Infinity }}
//               className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"
//             >
//               <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
//             </motion.div>
//           </motion.div>
          
//           {/* Right Eye */}
//           <motion.div
//             animate={{
//               scaleY: isPasswordFocused ? 0 : 1,
//               y: isPasswordFocused ? 4 : 0
//             }}
//             transition={{ duration: 0.3 }}
//             className="relative w-8 h-10 bg-white rounded-full overflow-hidden"
//           >
//             <motion.div
//               animate={{ y: isPasswordFocused ? 0 : [0, 2, 0] }}
//               transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
//               className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full"
//             >
//               <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full" />
//             </motion.div>
//           </motion.div>
//         </div>

//         {/* Wings covering eyes when password focused */}
//         <AnimatePresence>
//           {isPasswordFocused && (
//             <>
//               <motion.div
//                 initial={{ x: -20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: -20, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute top-10 left-4 w-10 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-[50%_0%_50%_50%] transform -rotate-12"
//               />
//               <motion.div
//                 initial={{ x: 20, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 exit={{ x: 20, opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//                 className="absolute top-10 right-4 w-10 h-12 bg-gradient-to-bl from-purple-400 to-purple-600 rounded-[0%_50%_50%_50%] transform rotate-12"
//               />
//             </>
//           )}
//         </AnimatePresence>
        
//         {/* Beak */}
//         <div className="absolute top-16 left-1/2 -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-orange-400 to-orange-500 rounded-b-full" />
        
//         {/* Feet */}
//         <div className="absolute -bottom-2 left-8 flex gap-1">
//           <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
//           <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
//         </div>
//         <div className="absolute -bottom-2 right-8 flex gap-1">
//           <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
//           <div className="w-2 h-3 bg-orange-500 rounded-b-md" />
//         </div>
//       </motion.div>
//     </motion.div>
//   )
// }

export default function LoginPage() {
  const router = useRouter()
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      let user = await login(formData.email, formData.password);
      if(user.error){
        throw new Error(user.msg)
      }
     
      router.push("/Form")

    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }

  }


    const handleSubmitGoogle = async (credentialResponse) => {
 
    console.log("GoogleAuthButton rendered ");

      const tokenId = credentialResponse?.credential;
      

      if (!tokenId) {
        console.error("No tokenId found in credentialResponse");
        return;
      }
    //  try {
     // Simulate Google login
      let data  = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenId}`)
      data = await data.json();
      // console.log(data)
      const { email, name, picture, email_verified } = data
      console.log("Google login successful:", email, name, picture, email_verified);

      try {
        const user = await register(name,email,"",true)
        if(user.error){
          throw new Error(user.msg)
        }

        window.location.href = "/"
      } catch (error) {
        setError(error.message || "Google signup failed. Please try again.");
      }
      // console.log(email, name , picture, email_verified)
    //   try {

    //     const result = await signup(name, email, "google-auth-password",true,  picture, email_verified);

    //     console.log("Signup result:", result);
      
      
    //     // const response = await fetch("/api/auth/signup", {
    //   //   method: "POST",
    //   //   headers: { "Content-Type": "application/json" },
    //   //   body: JSON.stringify({
    //   //     name,
    //   //     email ,
    //   //     avatar : picture,
    //   //     password: "google-auth-password",
    //   //     isVerified: email_verified,
    //   //   }),
    //   //   credentials: "include"
    //   // })

    //   // const data = await response.json()

    //   // if (!response.ok) {
    //   //   throw new Error(data.message || "Signup failed")
    //   // }

    //   // // Redirect to dashboard after successful signup
    //   // router.push("/dashboard")
    //   // router.refresh()
    // } catch (err) {
    //   console.error("Signup failed:", err)
    // }

    //   setIsLoading(false)
    //  }
    //  catch (error) {
    //   console.error("Google login failed", error);
    //   setErrors({ email: 'Google login failed. Please try again.' });
    //   setIsLoading(false);
    //   return;
    //  }
}

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
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
            <div className="space-y-5" onKeyUp={handleKeyPress}>
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
                  <div className="text-center  text-purple-300 font-semibold">or</div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >

            <GoogleLogin
              type="button"
              
              initial="idle"
               onSuccess={handleSubmitGoogle}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </GoogleLogin>

               

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



const OwlIllustration = ({ isPasswordFocused }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, y: -50 }}
      animate={{ scale: 1, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="relative w-40 h-40 mx-auto mb-4"
    >
      {/* Owl Body */}
      <motion.div
        animate={{ 
          rotate: isPasswordFocused ? [0, -3, 3, -3, 0] : [0, -1, 1, -1, 0],
          y: isPasswordFocused ? 0 : [0, -2, 0]
        }}
        transition={{ 
          rotate: { duration: 0.6 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        className="absolute inset-0"
      >
        {/* Shadow */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/20 rounded-full blur-sm"
        />
        
        {/* Main body with feather texture */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-24 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-[60%_60%_50%_50%] shadow-lg">
          {/* Feather details */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-2 left-3 w-4 h-6 bg-amber-900/50 rounded-full transform -rotate-12" />
            <div className="absolute top-2 right-3 w-4 h-6 bg-amber-900/50 rounded-full transform rotate-12" />
            <div className="absolute top-6 left-4 w-3 h-5 bg-amber-900/50 rounded-full transform -rotate-6" />
            <div className="absolute top-6 right-4 w-3 h-5 bg-amber-900/50 rounded-full transform rotate-6" />
          </div>
        </div>
        
        {/* Head with texture */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-28 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-[50%_50%_45%_45%] shadow-xl">
          {/* Head feather pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-3 left-6 w-5 h-7 bg-amber-900/60 rounded-full" />
            <div className="absolute top-3 right-6 w-5 h-7 bg-amber-900/60 rounded-full" />
            <div className="absolute top-8 left-8 w-4 h-6 bg-amber-900/60 rounded-full" />
            <div className="absolute top-8 right-8 w-4 h-6 bg-amber-900/60 rounded-full" />
          </div>
        </div>
        
        {/* Ear tufts with animation */}
        <motion.div
          animate={{ rotate: isPasswordFocused ? -20 : [-12, -8, -12] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-0 left-4 w-7 h-14 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-t-full shadow-md"
        >
          <div className="absolute top-1 left-1 w-5 h-10 bg-gradient-to-br from-amber-500/50 to-transparent rounded-t-full" />
        </motion.div>
        <motion.div
          animate={{ rotate: isPasswordFocused ? 20 : [12, 8, 12] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="absolute top-0 right-4 w-7 h-14 bg-gradient-to-bl from-amber-600 via-amber-700 to-amber-900 rounded-t-full shadow-md"
        >
          <div className="absolute top-1 right-1 w-5 h-10 bg-gradient-to-bl from-amber-500/50 to-transparent rounded-t-full" />
        </motion.div>
        
        {/* Belly with detailed feathers */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-18 h-16 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 rounded-[50%_50%_40%_40%] shadow-inner">
          {/* Belly feather lines */}
          <div className="absolute inset-2 flex flex-col gap-1 items-center opacity-50">
            <div className="w-10 h-0.5 bg-amber-600/40 rounded-full" />
            <div className="w-8 h-0.5 bg-amber-600/40 rounded-full" />
            <div className="w-10 h-0.5 bg-amber-600/40 rounded-full" />
            <div className="w-8 h-0.5 bg-amber-600/40 rounded-full" />
          </div>
        </div>
        
        {/* Eyes Container with facial disc */}
        <div className="absolute top-9 left-1/2 -translate-x-1/2">
          {/* Facial disc - characteristic owl feature */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-20 bg-gradient-radial from-amber-300/30 to-transparent rounded-full" />
          
          <div className="relative flex gap-4">
            {/* Left Eye */}
            <div className="relative">
              {/* Eye socket shadow */}
              <div className="absolute -inset-1 bg-amber-900/40 rounded-full blur-sm" />
              
              <motion.div
                animate={{
                  scaleY: isPasswordFocused ? 0.1 : 1,
                  y: isPasswordFocused ? 5 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative w-10 h-12 bg-gradient-to-b from-yellow-100 to-white rounded-full overflow-hidden shadow-inner border-2 border-amber-800/30"
              >
                {/* Iris */}
                <motion.div
                  animate={{ 
                    y: isPasswordFocused ? 0 : [0, 1, 0],
                    scale: isPasswordFocused ? 0 : 1
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-b from-orange-600 to-amber-700 rounded-full shadow-md"
                >
                  {/* Pupil */}
                  <motion.div
                    animate={{ scale: [1, 0.9, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full"
                  >
                    {/* Light reflection */}
                    <div className="absolute top-1 left-1.5 w-2 h-2 bg-white rounded-full opacity-90" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/50 rounded-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Right Eye */}
            <div className="relative">
              {/* Eye socket shadow */}
              <div className="absolute -inset-1 bg-amber-900/40 rounded-full blur-sm" />
              
              <motion.div
                animate={{
                  scaleY: isPasswordFocused ? 0.1 : 1,
                  y: isPasswordFocused ? 5 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut", delay: 0.05 }}
                className="relative w-10 h-12 bg-gradient-to-b from-yellow-100 to-white rounded-full overflow-hidden shadow-inner border-2 border-amber-800/30"
              >
                {/* Iris */}
                <motion.div
                  animate={{ 
                    y: isPasswordFocused ? 0 : [0, 1, 0],
                    scale: isPasswordFocused ? 0 : 1
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                  className="absolute top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gradient-to-b from-orange-600 to-amber-700 rounded-full shadow-md"
                >
                  {/* Pupil */}
                  <motion.div
                    animate={{ scale: [1, 0.9, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-900 rounded-full"
                  >
                    {/* Light reflection */}
                    <div className="absolute top-1 left-1.5 w-2 h-2 bg-white rounded-full opacity-90" />
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/50 rounded-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Wings covering eyes when password focused - more realistic */}
        <AnimatePresence>
          {isPasswordFocused && (
            <>
              {/* Left wing */}
              <motion.div
                initial={{ x: -30, opacity: 0, rotate: -20 }}
                animate={{ x: 0, opacity: 1, rotate: -15 }}
                exit={{ x: -30, opacity: 0, rotate: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-11 left-2 w-14 h-16 bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 rounded-[60%_20%_70%_40%] shadow-xl"
              >
                {/* Wing feather details */}
                <div className="absolute inset-1 opacity-40">
                  <div className="absolute top-2 left-2 w-3 h-8 bg-amber-900/60 rounded-full" />
                  <div className="absolute top-3 left-5 w-2 h-7 bg-amber-900/60 rounded-full" />
                  <div className="absolute top-4 left-8 w-2 h-6 bg-amber-900/60 rounded-full" />
                </div>
              </motion.div>
              
              {/* Right wing */}
              <motion.div
                initial={{ x: 30, opacity: 0, rotate: 20 }}
                animate={{ x: 0, opacity: 1, rotate: 15 }}
                exit={{ x: 30, opacity: 0, rotate: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute top-11 right-2 w-14 h-16 bg-gradient-to-bl from-amber-600 via-amber-700 to-amber-800 rounded-[20%_60%_40%_70%] shadow-xl"
              >
                {/* Wing feather details */}
                <div className="absolute inset-1 opacity-40">
                  <div className="absolute top-2 right-2 w-3 h-8 bg-amber-900/60 rounded-full" />
                  <div className="absolute top-3 right-5 w-2 h-7 bg-amber-900/60 rounded-full" />
                  <div className="absolute top-4 right-8 w-2 h-6 bg-amber-900/60 rounded-full" />
                </div>
              </motion.div>
              
              {/* Closed eye slits */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-4"
              >
                <div className="w-10 h-1 bg-amber-900 rounded-full" />
                <div className="w-10 h-1 bg-amber-900 rounded-full" />
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Beak - more detailed */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
          <div className="relative w-4 h-5 bg-gradient-to-b from-orange-500 to-orange-600 rounded-b-full shadow-md">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-orange-400" />
            <div className="absolute top-1 left-0 w-1 h-2 bg-orange-700/40 rounded-l-full" />
          </div>
        </div>
        
        {/* Talons - more realistic */}
        <motion.div
          animate={{ y: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-6"
        >
          {/* Left foot */}
          <div className="relative">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md shadow-sm" />
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md shadow-sm" />
              <div className="w-1.5 h-3.5 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md shadow-sm" />
            </div>
            {/* Claws */}
            <div className="absolute -bottom-0.5 left-0 w-1.5 h-1 bg-gray-800 rounded-b-full" />
            <div className="absolute -bottom-0.5 left-2 w-1.5 h-1 bg-gray-800 rounded-b-full" />
            <div className="absolute -bottom-0.5 right-0 w-1.5 h-1 bg-gray-800 rounded-b-full" />
          </div>
          
          {/* Right foot */}
          <div className="relative">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-3.5 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md shadow-sm" />
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md shadow-sm" />
              <div className="w-1.5 h-4 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-md shadow-sm" />
            </div>
            {/* Claws */}
            <div className="absolute -bottom-0.5 left-0 w-1.5 h-1 bg-gray-800 rounded-b-full" />
            <div className="absolute -bottom-0.5 left-2 w-1.5 h-1 bg-gray-800 rounded-b-full" />
            <div className="absolute -bottom-0.5 right-0 w-1.5 h-1 bg-gray-800 rounded-b-full" />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// export default function OwlLoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Login attempt:', { email, password });
//     // Add your login logic here
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-md"
//       >
//         <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
//           {/* Owl Illustration */}
//           <OwlIllustration isPasswordFocused={isPasswordFocused} />

//           {/* Title */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-center mb-8"
//           >
//             <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
//             <p className="text-gray-300">Sign in to continue</p>
//           </motion.div>

//           {/* Login Form */}
//           <div className="space-y-6">
//             {/* Email Field */}
//             <div className="relative">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   placeholder="your@email.com"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password Field */}
//             <div className="relative">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   onFocus={() => setIsPasswordFocused(true)}
//                   onBlur={() => setIsPasswordFocused(false)}
//                   className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center text-gray-300 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 mr-2"
//                 />
//                 Remember me
//               </label>
//               <button
//                 type="button"
//                 onClick={() => alert('Password reset functionality')}
//                 className="text-purple-400 hover:text-purple-300 transition-colors"
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Submit Button */}
//             <motion.button
//               type="button"
//               onClick={handleSubmit}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
//             >
//               Sign In
//             </motion.button>
//           </div>

//           {/* Sign Up Link */}
//           <p className="text-center text-gray-300 mt-6">
//             Don't have an account?{' '}
//             <button
//               type="button"
//               onClick={() => alert('Sign up functionality')}
//               className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
//             >
//               Sign up
//             </button>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
















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
