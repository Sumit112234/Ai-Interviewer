"use client"

import { motion } from "framer-motion"
import { CheckCircle, Circle, Clock } from 'lucide-react'

export default function InterviewProgress({ current, total, isActive }) {
  const progress = (current / total) * 100

  return (
    <div className="flex items-center space-x-4">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-white/70" />
        <div className="w-32 bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question Counter */}
      <div className="flex items-center space-x-1">
        {[...Array(total)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index < current ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <Circle className={`h-4 w-4 ${
                index === current && isActive 
                  ? "text-blue-400 animate-pulse" 
                  : "text-white/30"
              }`} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Text Counter */}
      <span className="text-white/70 text-sm font-medium">
        {current}/{total}
      </span>
    </div>
  )
}
