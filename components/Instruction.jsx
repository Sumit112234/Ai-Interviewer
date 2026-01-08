import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Camera, Mic, Wifi, Eye, Lock, Shield, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Instructions = ({isOpen, setIsOpen}) => {
  // const [isOpen, setIsOpen] = useState(insOpen || true);
  const [isAgreed, setIsAgreed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const contentRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Scroll animation when content changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }

  }, [currentStep]);

  const howItWorksSteps = [
    {
      step: 1,
      title: "Grant Permissions",
      description: "Allow camera and microphone access when prompted by your browser. These are essential for the interview.",
      image: "/instruction/permissions.png"
    },
   
    {
      step: 2,
      title: "Enter Full Screen",
      description: "The interview will automatically enter full-screen mode. Do not exit full screen during the interview.",
      image: "/instruction/full-screen-pop-up.png"
    },
    {
      step: 3,
      title: "To Start Interview",
      description: "First you need to click on Start Interview button. Once clicked then click on mic Icon to unmute yourself and begin. When it is of Red color only then it will listen you",
      image: "/instruction/interview-start.png"
    },
    {
      step: 4,
      title: "Answer Questions",
      description: "Read each question carefully and provide your answers. You can navigate between questions using the navigation buttons.",
      image: "/instruction/answer-question.png"
    },
    {
      step: 5,
      title: "Submit Interview",
      description: "Once completed, click the submit button. Your responses will be saved and sent for evaluation.",
      image: "/instruction/end-interview.png"
    }
  ];

  const instructions = [
    {
      icon: <Camera className="w-6 h-6 text-purple-400" />,
      title: "Camera Setup",
      description: "Ensure your camera is positioned at eye level with good lighting. Your face should be clearly visible throughout the interview.",
      image: "/instruction/camera.jpg"
    },
    {
      icon: <Mic className="w-6 h-6 text-blue-400" />,
      title: "Audio Check",
      description: "Test your microphone before starting. Speak clearly and eliminate background noise. Use headphones if possible.",
      image: "/instruction/sound.jpg"
    },
    {
      icon: <Wifi className="w-6 h-6 text-purple-400" />,
      title: "Stable Internet Connection",
      description: "Connect to a reliable internet network. Close unnecessary applications to ensure smooth video streaming.",
      image: "/instruction/internet.png"
    }
  ];

  const guidelines = [
    "Dress professionally as you would for an in-person interview",
    "Choose a quiet, well-lit location with a neutral background",
    "Keep yourself ready and look straight into the camera while answering",
    "Ensure you are alone in the room with no one else visible in the camera frame",
    "Position yourself centrally in the camera view with your full face visible",
    "Do not look away from the screen for extended periods",
  ];

  const proctoring = [
    {
      icon: <Eye className="w-5 h-5 text-red-400" />,
      rule: "Continuous Monitoring",
      description: "Your camera captures images every 3 seconds and sends them to our server for AI-powered proctoring analysis"
    },
    {
      icon: <Lock className="w-5 h-5 text-red-400" />,
      rule: "No Exit Allowed",
      description: "Once you enter the interview page, you cannot leave. Any attempt to exit, minimize, or switch tabs will result in automatic submission"
    },
    {
      icon: <Shield className="w-5 h-5 text-red-400" />,
      rule: "Browser Console Disabled",
      description: "Opening developer tools, browser console, or attempting to inspect elements will trigger immediate disqualification"
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      rule: "Full Screen Mode Required",
      description: "The interview must be conducted in full-screen mode. Resizing, minimizing, or shrinking the window will auto-submit your interview"
    }
  ];

  const violations = [
    "Looking away from the screen for extended periods",
    "Multiple faces detected in the camera frame",
    "Using mobile phones or secondary devices",
    "Switching tabs or opening other applications",
    "Attempting to copy-paste questions or use external AI tools",
    "Taking screenshots or recording the interview",
    "Having unauthorized materials or notes visible"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-purple-500/30"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-6 rounded-t-xl z-10">
          <div className="flex justify-between items-start">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-2">Interview Instructions & Proctoring Guidelines</h2>
              <p className="text-blue-100">Please read all instructions carefully before proceeding</p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* How It Works Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-6 flex items-center justify-center"
            >
              <Play className="w-6 h-6 mr-2 text-green-400" />
              How The Interview Works - Step by Step
            </motion.h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-5 hover:border-blue-500/60 transition-all"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-lg mb-2">{step.title}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={step.image}
                    alt={step.title}
                    className="w-full  object-cover rounded-lg border border-purple-500/30 mt-3"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* General Guidelines */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl font-semibold text-white mb-4 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2 text-blue-400" />
              General Guidelines
            </motion.h3>
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-lg p-5"
            >
              <ul className="space-y-3">
                {guidelines.map((guideline, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start text-gray-200"
                  >
                    <span className="text-purple-400 mr-3 font-bold text-lg leading-6">•</span>
                    <span className="leading-6">{guideline}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Technical Requirements */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-4 flex justify-center items-center"
            >
              Technical Requirements
            </motion.h3>
            <div className="space-y-6">
              {instructions.map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="flex-shrink-0 mt-1 bg-gray-800 p-2 rounded-lg"
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-xl text-white mb-2">{item.title}</h4>
                      <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={item.image}
                        alt={item.title}
                        className="w-full object-cover rounded-lg border border-blue-500/30"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Proctoring Rules - CRITICAL */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-2xl font-bold text-red-400 mb-4 flex items-center"
            >
              <Shield className="w-6 h-6 mr-2" />
              AI Proctoring & Security Rules
            </motion.h3>
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border-2 border-red-500/50 rounded-lg p-5"
            >
              <div className="space-y-4">
                {proctoring.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-3 bg-black/30 p-4 rounded-lg border border-red-500/20"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="flex-shrink-0 mt-0.5 bg-red-900/50 p-2 rounded"
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-300 mb-1 text-lg">{item.rule}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Violations Leading to Disqualification */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <motion.h3 
              variants={itemVariants}
              className="text-xl font-semibold text-orange-400 mb-4 flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Actions That Will Lead to Automatic Disqualification
            </motion.h3>
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/40 rounded-lg p-5"
            >
              <ul className="space-y-3">
                {violations.map((violation, index) => (
                  <motion.li 
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-start text-gray-200"
                  >
                    <span className="text-orange-400 mr-3 font-bold text-lg leading-6">✖</span>
                    <span className="leading-6">{violation}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Critical Warning */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border-l-4 border-red-500 p-5 mb-6 rounded-r-lg"
          >
            <div className="flex items-start">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              </motion.div>
              <div>
                <h4 className="font-bold text-red-300 mb-2 text-lg">⚠️ CRITICAL WARNING</h4>
                <p className="text-gray-200 text-sm leading-relaxed mb-2">
                  Once you start the interview, you CANNOT pause, exit, or restart. Any violation of the proctoring rules will result in immediate auto-submission and potential disqualification.
                </p>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Our AI system continuously monitors your behavior. Ensure you have completed all technical checks, are in a secure environment, and are ready to proceed without interruption.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Acknowledgment Checkbox */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-black/40 border border-purple-500/30 rounded-lg p-4 mb-6"
          >
            <label className="flex items-start cursor-pointer group">
              <motion.input 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="checkbox" 
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 mr-3 w-5 h-5 accent-purple-600 cursor-pointer"
              />
              <span className="text-gray-200 text-sm leading-relaxed group-hover:text-white transition-colors">
                I have read and understood all the instructions, technical requirements, and proctoring guidelines. I acknowledge that any violation will lead to automatic submission and disqualification. I am ready to begin the interview under continuous AI monitoring.
              </span>
            </label>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-500 transition-colors font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: isAgreed ? 1.05 : 1 }}
              whileTap={{ scale: isAgreed ? 0.95 : 1 }}
              onClick={() => {
                if (isAgreed) {
                  setIsOpen(false);
                  localStorage.setItem("interviewData", "")
                  router.push("/interview")
                }
              }}
              disabled={!isAgreed}
              className={`px-8 py-3 rounded-lg font-bold shadow-lg text-lg flex items-center gap-2 transition-all ${
                isAgreed 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-purple-500/30 cursor-pointer' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              I Understand, Start Interview
              {isAgreed && <ChevronRight className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Instructions;