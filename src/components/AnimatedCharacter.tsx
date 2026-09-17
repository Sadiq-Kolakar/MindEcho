"use client";

import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AIBotModal } from './AIBotModal'
import { SplineScene } from '@/components/ui/splite'

const robotThoughts = [
  "Hi! I'm your 3D LECTOR AI Assistant. Click me anytime to chat!",
  "Analyzing your active recall explanations in real time...",
  "Adapting your spaced repetition calendar for 99.4% retention!",
  "Ready to test your concept understanding? Let's get started.",
  "AI Neural Engine active: Spaced memory curve synchronized.",
]

export function AnimatedCharacter() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Auto-change thoughts every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % robotThoughts.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const handleRobotClick = () => {
    setIsChatOpen(true)
  }

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center select-none">
      {/* Dynamic Floating Speech / Thought Bubble */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleRobotClick}
        className="glass-strong relative z-30 mb-2 flex items-center gap-3.5 rounded-2xl border border-[#e8c89b]/40 px-5 py-3 shadow-2xl backdrop-blur-xl transition hover:border-[#e8c89b] hover:bg-[#2b2421]/95 cursor-pointer max-w-md w-full"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8c89b]/20 border border-[#e8c89b]/50">
          <Bot className="h-5 w-5 text-[#e8c89b]" />
        </div>

        <div className="text-left flex-1 min-h-[42px] flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e8c89b] flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> LECTOR AI Bot
            </span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/40 ml-auto">(Click to Chat)</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="text-xs sm:text-sm font-medium leading-tight text-[#f5efe8]"
            >
              &ldquo;{robotThoughts[msgIndex]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Pointer Tail */}
        <div className="absolute -bottom-2 left-10 h-4 w-4 rotate-45 border-b border-r border-[#e8c89b]/30 bg-[#2b2421]" />
      </motion.div>

      {/* 3D Spline Robot Container (Perfect Fit from Head to Legs) */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        onClick={handleRobotClick}
        className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center group cursor-grab active:cursor-grabbing"
      >
        {/* Smooth Ambient Warm Studio Radial Glow - Intensifies on Hover */}
        <div className="absolute inset-0 mx-auto my-auto h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(232,200,155,0.25)_0%,rgba(232,200,155,0.08)_50%,transparent_75%)] pointer-events-none transition-all duration-500 group-hover:scale-115 group-hover:bg-[radial-gradient(circle,rgba(232,200,155,0.45)_0%,rgba(232,200,155,0.18)_55%,transparent_80%)] blur-3xl" />

        {/* Real Interactive 3D Spline Robot Scene - Scaled to fit 100% full body (head, torso, legs) */}
        <div className="w-full h-full relative z-10 scale-85 sm:scale-90 origin-center transition-transform duration-500">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </motion.div>

      {/* Interactive Voice & Chat Assistant Modal */}
      <AIBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default AnimatedCharacter;
