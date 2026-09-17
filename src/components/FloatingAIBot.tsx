import { motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AIBotModal } from './AIBotModal'

export function FloatingAIBot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Bot Button at Bottom Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full border border-[#e8c89b]/50 bg-[#251e1b] p-3 shadow-2xl transition hover:border-[#e8c89b] hover:bg-[#2b2421]"
          aria-label="Open LECTOR AI Bot"
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-[#e8c89b]/20 blur-md transition group-hover:bg-[#e8c89b]/40" />

          {/* Bot Icon */}
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e8c89b] text-[#1e1917] shadow-lg transition group-hover:scale-105">
            <Bot className="h-6 w-6" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#1e1917] animate-pulse" />
          </div>

          <div className="relative hidden pr-2 text-left sm:block">
            <span className="block text-xs font-bold text-white flex items-center gap-1">
              LECTOR AI <Sparkles className="h-3 w-3 text-[#e8c89b]" />
            </span>
            <span className="block text-[10px] text-[#e8c89b]">Click to Ask Assistant</span>
          </div>
        </button>
      </motion.div>

      {/* Interactive AI Chat Modal */}
      <AIBotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default FloatingAIBot;
