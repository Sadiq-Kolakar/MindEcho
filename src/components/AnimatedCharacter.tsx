"use client";

import { motion } from 'framer-motion'
import { useState } from 'react'
import { AIBotModal } from './AIBotModal'
import { SplineScene } from '@/components/ui/splite'

export function AnimatedCharacter() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center justify-center select-none">
      {/* 3D Spline Robot Container (Clean Upper-Body Framing - Legs Hidden & Blended) */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        onClick={() => setIsChatOpen(true)}
        className="relative w-full h-[480px] sm:h-[520px] flex items-center justify-center group cursor-grab active:cursor-grabbing overflow-hidden rounded-b-3xl"
      >
        {/* Smooth Ambient Warm Studio Radial Glow - Intensifies on Hover */}
        <div className="absolute inset-0 mx-auto my-auto h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,rgba(232,200,155,0.25)_0%,rgba(232,200,155,0.08)_50%,transparent_75%)] pointer-events-none transition-all duration-500 group-hover:scale-115 group-hover:bg-[radial-gradient(circle,rgba(232,200,155,0.45)_0%,rgba(232,200,155,0.18)_55%,transparent_80%)] blur-3xl" />

        {/* Real Interactive 3D Spline Robot Scene (Scaled & Offset to Focus on Upper Body) */}
        <div className="w-full h-full relative z-10 scale-110 sm:scale-120 translate-y-6 sm:translate-y-8 transition-transform duration-500">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>

        {/* Soft Bottom Gradient Mask to Completely Blend & Hide Lower Legs */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#120e0d] via-[#120e0d]/80 to-transparent z-20 pointer-events-none" />
      </motion.div>

      {/* Interactive Voice & Chat Assistant Modal */}
      <AIBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

export default AnimatedCharacter;
