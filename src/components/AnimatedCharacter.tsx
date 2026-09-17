"use client";

import { motion } from 'framer-motion'
import { useState } from 'react'
import { AIBotModal } from './AIBotModal'
import { SplineScene } from '@/components/ui/splite'

export function AnimatedCharacter() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center select-none">
      {/* 3D Spline Robot Container (Clean, Borderless with Interactive Hover Glow) */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        onClick={() => setIsChatOpen(true)}
        className="relative w-full h-[540px] flex items-center justify-center group cursor-grab active:cursor-grabbing"
      >
        {/* Smooth Ambient Warm Studio Radial Glow - Intensifies on Hover */}
        <div className="absolute inset-0 mx-auto my-auto h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(232,200,155,0.25)_0%,rgba(232,200,155,0.08)_50%,transparent_75%)] pointer-events-none transition-all duration-500 group-hover:scale-115 group-hover:bg-[radial-gradient(circle,rgba(232,200,155,0.45)_0%,rgba(232,200,155,0.18)_55%,transparent_80%)] blur-3xl" />

        {/* Real Interactive 3D Spline Robot Scene */}
        <div className="w-full h-full relative z-10">
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
