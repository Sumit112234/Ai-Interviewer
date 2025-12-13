"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Code, Play, Clock, AlertCircle } from "lucide-react"

export default function CodeIDETestModal({ onIdeSubmit, ideStatus, onIdeTimeout }) {
  const [isOpen, setIsOpen] = useState(false)
  const [code, setCode] = useState(`// Write your code here
function solution() {
  // Your implementation
  
}

solution();`)
  
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false)

  // Sync with ideStatus prop
  useEffect(() => {
    if (ideStatus && !isOpen) {
      setIsOpen(true)
      setTimeRemaining(600) // Reset to 10 minutes
      setIsTimerActive(true)
      setCode(`// Write your code here
function solution() {
  // Your implementation
  
}

solution();`)
    }
  }, [ideStatus])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsTimerActive(false)
            handleTimeout()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, timeRemaining])

  const closeModal = () => {
    setIsOpen(false)
    setIsTimerActive(false)
  }

  const handleTimeout = () => {
    console.log("⏰ Timer expired!")
    closeModal()
    // Call the timeout handler from parent to send "I don't know"
    if (onIdeTimeout) {
      onIdeTimeout()
    }
  }

  const handleSubmit = () => {
    console.log("Code submitted:", code)
    setIsTimerActive(false)
    closeModal()
    // Call the submit handler from parent
    if (onIdeSubmit) {
      onIdeSubmit(code, "javascript")
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    const percentage = (timeRemaining / 600) * 100
    if (percentage > 50) return "text-green-400"
    if (percentage > 25) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="p-8">
      {/* Trigger Button */}
      {/* <button
        onClick={openModal}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
      >
        <Code className="h-5 w-5" />
        <span>Open Code IDE</span>
      </button> */}

      {/* Modal Overlay and Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Darkened Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
              onClick={closeModal}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="pointer-events-auto bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-[90vw] max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg">
                      <Code className="h-5 w-5 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Coding Challenge</h2>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Timer Display */}
                    <div className={`flex items-center space-x-2 px-4 py-2 bg-gray-900/50 rounded-lg border ${
                      timeRemaining < 60 ? 'border-red-500/50 animate-pulse' : 'border-gray-600'
                    }`}>
                      <Clock className={`h-5 w-5 ${getTimerColor()}`} />
                      <span className={`font-mono text-lg font-bold ${getTimerColor()}`}>
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    
                    {/* Close Button */}
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
                      aria-label="Close modal"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">
                      Code Editor
                    </label>
                    <div className="relative">
                      {/* Line Numbers (decorative) */}
                      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-950 border-r border-gray-700 pt-3 pb-3 text-right pr-3 select-none">
                        {code.split('\n').map((_, index) => (
                          <div key={index} className="text-gray-500 text-sm font-mono leading-6">
                            {index + 1}
                          </div>
                        ))}
                      </div>
                      
                      {/* Code Textarea */}
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-[300px] bg-gray-950 text-gray-100 font-mono text-sm leading-6 p-3 pl-16 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                        placeholder="Write your code here..."
                        spellCheck="false"
                        style={{
                          tabSize: 2,
                        }}
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <p className="text-sm text-blue-200">
                      <strong>Instructions:</strong> Write your solution in the editor above. 
                      Click "Submit Code" when you're ready to submit your answer.
                    </p>
                  </div>

                  {/* Time Warning */}
                  {timeRemaining < 60 && timeRemaining > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center space-x-2"
                    >
                      <Clock className="h-5 w-5 text-red-400 animate-pulse" />
                      <p className="text-sm text-red-200 font-medium">
                        Less than 1 minute remaining! Your response will be submitted as "I don't know" when time runs out.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Footer with Actions */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700 bg-gray-800">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Submit Code</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
