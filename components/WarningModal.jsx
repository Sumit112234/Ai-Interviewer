"use client"

import { motion, AnimatePresence } from "framer-motion"


export default function WarningModal({ isOpen, count }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="max-w-md w-full rounded-2xl bg-gray-900 border border-red-500/40 shadow-2xl p-6 text-center"
          >
            <h2 className="text-red-500 text-xl font-semibold mb-2">
              Interview Warning
            </h2>

            <p className="text-gray-300 text-sm mb-4">
              You are not allowed to leave fullscreen or switch tabs during the interview.
            </p>

            <div className="text-sm text-gray-400">
              Warning <span className="text-red-400 font-semibold">{count}</span> / 2
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
