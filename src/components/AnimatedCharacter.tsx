"use client";

import { motion } from 'framer-motion'
import { Bot, Brain, Cpu, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'
import { AIBotModal } from './AIBotModal'
import { SplineScene } from '@/components/ui/splite'

const robotMessages = [
  "Hi! I'm your 3D LECTOR AI Robot. Click me to chat & test active recall!",
  "I analyze your explanations for clarity, completeness & long-term retention.",
  "Ready to supercharge your memory schedule? Let's get started!",
  "AI Neural Engine active: 99.4% retention tracking accuracy.",
]

export function AnimatedCharacter() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleRobotClick = () => {
    setIsChatOpen(true)
    setMsgIndex((prev) => (prev + 1) % robotMessages.length)
  }

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center py-2 select-none">
      {/* Speech Bubble — Interactive LECTOR Robot Message */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onClick={handleRobotClick}
        className="glass-strong relative z-30 mb-2 flex items-start gap-3 rounded-2xl border border-[#e8c89b]/40 px-5 py-3.5 shadow-2xl backdrop-blur-xl transition hover:border-[#e8c89b] hover:bg-[#2b2421]/90 cursor-pointer"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8c89b]/20 border border-[#e8c89b]/50">
          <Bot className="h-5 w-5 text-[#e8c89b]" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#e8c89b]">
              LECTOR 3D Spline Robot AI
            </span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/40">(Click Robot to Chat)</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-[#f5efe8]">
            &ldquo;{robotMessages[msgIndex]}&rdquo;
          </p>
        </div>
        {/* Pointer Tail */}
        <div className="absolute -bottom-2 left-12 h-4 w-4 rotate-45 border-b border-r border-[#e8c89b]/30 bg-[#2b2421]" />
      </motion.div>

      {/* Main 3D Spline Robot Container */}
      <div className="relative w-full h-[480px] flex items-center justify-center overflow-hidden rounded-3xl border border-[#e8c89b]/20 bg-[#1e1917]/60 backdrop-blur-md shadow-2xl">
        {/* Dynamic Warm Studio Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(232,200,155,0.18),transparent_70%)] pointer-events-none" />

        {/* Outer Floating Feature Badges */}
        <div className="absolute left-3 top-4 z-20 hidden sm:block pointer-events-none">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="glass flex items-center gap-2 rounded-full border border-[#e8c89b]/30 px-3.5 py-1.5 text-xs font-semibold text-[#f5efe8] shadow-xl backdrop-blur-md bg-[#251e1b]/80"
          >
            <Cpu className="h-4 w-4 text-[#e8c89b]" />
            3D Neural Engine
          </motion.div>
        </div>

        <div className="absolute right-3 top-4 z-20 hidden sm:block pointer-events-none">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="glass flex items-center gap-2 rounded-full border border-[#e8c89b]/30 px-3.5 py-1.5 text-xs font-semibold text-[#f5efe8] shadow-xl backdrop-blur-md bg-[#251e1b]/80"
          >
            <Sparkles className="h-4 w-4 text-[#e8c89b]" />
            Interactive Spline 3D
          </motion.div>
        </div>

        <div className="absolute left-3 bottom-4 z-20 hidden sm:block pointer-events-none">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="glass flex items-center gap-2 rounded-full border border-[#e8c89b]/30 px-3.5 py-1.5 text-xs font-semibold text-[#f5efe8] shadow-xl backdrop-blur-md bg-[#251e1b]/80"
          >
            <Brain className="h-4 w-4 text-[#e8c89b]" />
            Spaced Retention
          </motion.div>
        </div>

        <div className="absolute right-3 bottom-4 z-20 hidden sm:block pointer-events-none">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="glass flex items-center gap-2 rounded-full border border-[#e8c89b]/30 px-3.5 py-1.5 text-xs font-semibold text-[#f5efe8] shadow-xl backdrop-blur-md bg-[#251e1b]/80"
          >
            <Zap className="h-4 w-4 text-emerald-400" />
            Adaptive AI Active
          </motion.div>
        </div>

        {/* Real Spline 3D Scene */}
        <div className="w-full h-full cursor-grab active:cursor-grabbing">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Control tip */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleRobotClick}
          className="text-xs font-bold text-[#e8c89b] hover:underline bg-[#e8c89b]/10 px-3 py-1.5 rounded-full border border-[#e8c89b]/30 transition"
        >
          Open AI Voice & Chat Assistant &rarr;
        </button>
      </div>

      {/* Interactive Chat Modal */}
      <AIBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default AnimatedCharacter;
