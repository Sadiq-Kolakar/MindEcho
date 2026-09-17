"use client";

import { motion } from 'framer-motion'
import { useState } from 'react'
import { AIBotModal } from './AIBotModal'
import { SplineScene } from '@/components/ui/splite'

export function AnimatedCharacter() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleRobotClick = () => {
    setIsChatOpen(true)
  }

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center select-none">
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
