"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Code, Play, SkipForward, Sparkles, Zap, CheckCircle } from "lucide-react"

export default function CodeIDETestModal({ onIdeSubmit, data }) {
  const [isOpen, setIsOpen] = useState(data.ideStatus)
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const languages = [
    { value: "javascript", label: "JavaScript", color: "text-yellow-400" },
    { value: "python", label: "Python", color: "text-blue-400" },
    { value: "java", label: "Java", color: "text-red-400" },
    { value: "cpp", label: "C++", color: "text-purple-400" },
    { value: "csharp", label: "C#", color: "text-green-400" },
  ]

  const codeTemplates = {
    javascript: `// Write your solution here\nfunction solution() {\n  // Your implementation\n  \n}\n\nsolution();`,
    python: `# Write your solution here\ndef solution():\n    # Your implementation\n    pass\n\nsolution()`,
    java: `// Write your solution here\npublic class Solution {\n    public void solution() {\n        // Your implementation\n        \n    }\n}`,
    cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    // Your implementation\n    \n}\n\nint main() {\n    solution();\n    return 0;\n}`,
    csharp: `// Write your solution here\nusing System;\n\nclass Solution {\n    static void Main() {\n        // Your implementation\n        \n    }\n}`,
  }

  const outputTemplate = `// Predict the output of this code\n// Write your prediction below:\n\n/*\nYour prediction:\n\n*/`

  useEffect(() => {
    if (data.codeType === "predict") {
      setCode(outputTemplate)
    } else {
      setCode(codeTemplates[language])
    }
  }, [language, data.codeType])

  const closeModal = () => setIsOpen(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    await onIdeSubmit(code, language, false)
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      closeModal()
    }, 1500)
  }

  const handleSkip = async () => {
    await onIdeSubmit("", language, true)
    closeModal()
  }

  const getLineNumbers = () => {
    return code.split('\n').map((_, index) => index + 1)
  }

  return (
    <div className="p-8">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Animated Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999]"
              onClick={closeModal}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.34, 1.56, 0.64, 1],
                  scale: { type: "spring", stiffness: 260, damping: 20 }
                }}
                className="pointer-events-auto bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
                
                {/* Success Overlay */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-green-600/90 z-50 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                      >
                        <CheckCircle className="h-20 w-20 text-white mb-4" />
                        <p className="text-2xl font-bold text-white">Code Submitted!</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm relative z-10"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                      }}
                      className="p-2 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-lg border border-blue-500/30"
                    >
                      <Code className="h-6 w-6 text-blue-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        {data.codeType === "predict" ? "Predict Output" : "Coding Challenge"}
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                        </motion.div>
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {data.codeType === "predict" ? "Analyze and predict" : "Write your solution"}
                      </p>
                    </div>
                  </div>
                  
                  {/* <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:rotate-90 transform"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button> */}
                </motion.div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto relative z-10">
                  <div className="p-6 space-y-5">
                    {/* Question Section */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-700/30 rounded-xl p-5 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Zap className="h-5 w-5 text-blue-400 mt-1" />
                          </motion.div>
                          <div>
                            <h3 className="text-sm font-semibold text-blue-300 mb-2">Question</h3>
                            <p className="text-white text-lg leading-relaxed">{data.question}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Language Selector - Only show for "write" type */}
                    {data.codeType === "write" && (
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <label className="text-sm font-semibold text-gray-300 mb-3 block">
                          Choose Language
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {languages.map((lang, index) => (
                            <motion.button
                              key={lang.value}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setLanguage(lang.value)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                language === lang.value
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                              }`}
                            >
                              <span className={language === lang.value ? 'text-white' : lang.color}>
                                {lang.label}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Code Editor */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <label className="text-sm font-semibold text-gray-300 mb-3 block">
                        {data.codeType === "predict" ? "Prediction Area" : "Code Editor"}
                      </label>
                      <div className="relative group">
                        {/* Glow effect on focus */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-focus-within:opacity-30 blur transition duration-300" />
                        
                        <div className="relative bg-gray-950 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                          {/* Line Numbers */}
                          <div className="absolute left-0 top-0 bottom-0 w-14 bg-gray-900 border-r border-gray-800 pt-4 pb-4 text-right pr-4 select-none overflow-hidden">
                            {getLineNumbers().map((num) => (
                              <motion.div
                                key={num}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + num * 0.01 }}
                                className="text-gray-600 text-sm font-mono leading-6 hover:text-gray-400 transition-colors"
                              >
                                {num}
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Code Textarea */}
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-[350px] bg-transparent text-gray-100 font-mono text-sm leading-6 p-4 pl-20 focus:outline-none resize-none overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                            placeholder={data.codeType === "predict" ? "Write your prediction here..." : "Write your code here..."}
                            spellCheck="false"
                            style={{ tabSize: 2 }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Instructions */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="relative overflow-hidden rounded-xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10" />
                      <div className="relative p-4 border border-green-700/30 rounded-xl backdrop-blur-sm">
                        <p className="text-sm text-green-200 leading-relaxed">
                          <strong className="text-green-300">💡 Instructions:</strong>{" "}
                          {data.codeType === "predict" 
                            ? "Analyze the code and predict its output. Write your prediction in the editor above."
                            : "Write your solution in the editor above. Choose your preferred language and implement the solution."}
                          {" "}Click <strong>"Submit Code"</strong> when ready or <strong>"Skip"</strong> to move forward.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Footer with Actions */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between px-6 py-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm relative z-10"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSkip}
                    className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <SkipForward className="h-4 w-4" />
                    <span>Skip</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Play className="h-4 w-4" />
                        </motion.div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Submit Code</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}