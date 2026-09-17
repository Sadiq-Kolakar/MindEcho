import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: string
}

interface AIBotModalProps {
  isOpen: boolean
  onClose: () => void
}

const QUICK_PROMPTS = [
  'What is the Feynman Technique?',
  'How does Exam Mode work?',
  'Tips for high LECTOR score',
  'How is Retention Health calculated?',
]

export function AIBotModal({ isOpen, onClose }: AIBotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hello! I am your LECTOR AI Learning Assistant. Ask me anything about the Feynman technique, spaced repetition, or active recall strategy!",
      timestamp: 'Just now',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim()) return

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let botReply = "That's a great question! LECTOR AI uses your open-ended explanations to measure clarity, correctness, and completeness. Keep practicing to boost your retention health!"

      const lower = query.toLowerCase()
      if (lower.includes('feynman')) {
        botReply = "The Feynman Technique involves explaining a complex concept in simple, plain language as if teaching a beginner. If you hit a gap, revisit your notes and refine your explanation!"
      } else if (lower.includes('exam mode')) {
        botReply = "Exam Mode automatically compresses your review frequency so you revisit all weak topics before your set target exam date!"
      } else if (lower.includes('retention') || lower.includes('score')) {
        botReply = "Your Retention Health score increases every time you complete a Feynman practice test. High explanation accuracy extends review intervals (+3 to +7 days)."
      } else if (lower.includes('hello') || lower.includes('hi')) {
        botReply = "Hey there! Ready to practice active recall? Select a note from your workspace or ask me any question!"
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="flex h-[580px] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[#e8c89b]/40 bg-[#1e1917] shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-[#251e1b] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8c89b]/20 border border-[#e8c89b]/40 shadow-inner">
                  <Bot className="h-6 w-6 text-[#e8c89b]" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#1e1917] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    LECTOR AI Assistant
                    <span className="rounded-full bg-[#e8c89b]/20 px-2 py-0.5 text-[10px] text-[#e8c89b] font-bold">Active</span>
                  </h3>
                  <p className="text-[11px] text-white/60">Cognitive Active Recall Companion</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-[#e8c89b] text-[#1e1917] font-semibold rounded-tr-none'
                        : 'glass border border-white/15 text-white rounded-tl-none bg-[#2b2421]/90'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`mt-1.5 block text-[9.5px] ${
                        msg.sender === 'user' ? 'text-[#1e1917]/60' : 'text-white/40'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#e8c89b]">
                  <Bot className="h-4 w-4 animate-spin" />
                  <span className="animate-pulse text-[11px]">LECTOR AI is thinking...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="border-t border-white/10 bg-[#251e1b]/60 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-bar">
              <Sparkles className="h-3.5 w-3.5 text-[#e8c89b] shrink-0" />
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10.5px] text-white/80 transition hover:border-[#e8c89b]/50 hover:bg-[#e8c89b]/15 hover:text-[#e8c89b]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2 border-t border-white/10 bg-[#1e1917] p-4"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask LECTOR AI about your notes or study method..."
                className="glass flex-1 rounded-2xl border border-white/15 px-4 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#e8c89b]"
              />
              <button
                type="submit"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#e8c89b] text-[#1e1917] transition hover:bg-[#f5e4c6]"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AIBotModal;
