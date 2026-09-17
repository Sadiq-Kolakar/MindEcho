import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  FileText,
  Heart,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { GlassCard } from './GlassCard'

export function HowItWorks() {
  const navigate = useNavigate()

  const avatarLetters = ['A', 'M', 'S', 'R']

  const steppedCards = [
    {
      num: '01/',
      title: 'Convert Notes Into Explanations Fast',
      desc: 'Transform simple highlights into meaningful vocal explanations that drive long-term active recall.',
      isFeatured: false,
    },
    {
      num: '02/',
      title: 'Instant LECTOR AI Evaluation',
      desc: 'Instantly analyze your open-ended explanation for clarity, correctness, and completeness with real-time feedback.',
      isFeatured: true,
      tasks: [
        'Explanation clarity analyzed',
        'Factual correctness verified',
        'Missing sub-concepts flagged',
        'Spaced review scheduled',
      ],
    },
    {
      num: '03/',
      title: 'Master Your Exam Performance',
      desc: 'Take your study schedule to the next level by compressing revision frequencies before major exam deadlines.',
      isFeatured: false,
    },
  ]

  return (
    <section id="how-it-works" className="relative px-4 py-24 sm:px-6 bg-[#161210] overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-grid-lines opacity-40 pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 h-[500px] w-[500px] rounded-full bg-[#e8c89b]/10 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl space-y-24">

        {/* ================= SECTION 1: TOP HERO SHOWCASE CARD (MATCHING USER SCREENSHOT TOP) ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-[#e8c89b]/30 bg-[#221c19] p-8 sm:p-12 shadow-2xl"
        >
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            {/* Left Column Text & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Avatar Social Proof Pill */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {avatarLetters.map((letter, i) => (
                    <div
                      key={letter}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#e8c89b]/20 text-[10px] font-bold text-[#e8c89b]"
                      style={{ zIndex: avatarLetters.length - i }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-white/70">
                  Loved by 10,000+ students worldwide &bull; ★ 5.0
                </span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl leading-tight">
                Get the Most From Every Study Session
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-[#f5efe8]/75 max-w-md">
                Master complex subjects, evaluate open-ended explanations, and conquer exams with powerful LECTOR AI active recall tools in one place.
              </p>

              {/* CTA Buttons (Matching screenshot pill button style) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/login')}
                  className="group inline-flex items-center gap-3 rounded-full bg-[#1e1917] border border-[#e8c89b]/50 px-6 py-3.5 text-xs font-bold text-white transition hover:border-[#e8c89b] hover:bg-[#2b2421] shadow-xl"
                >
                  <span>Get Started</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8c89b] text-[#1e1917] transition group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>

                <Link
                  to="/workspace"
                  className="text-xs font-semibold text-[#e8c89b] transition hover:underline hover:text-white"
                >
                  Try Live Workspace Demo
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Interactive Chat UI Mockup (Matching Screenshot Top Right) */}
            <div className="lg:col-span-6 relative">
              {/* Floating Reaction & Feature Pills over Mockup */}
              <div className="absolute -top-3 right-6 z-30">
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-[#d97706] px-3.5 py-1 text-[11px] font-bold text-white shadow-xl backdrop-blur-md">
                  <Sparkles className="h-3.5 w-3.5" /> Important highlights
                </span>
              </div>

              <div className="absolute bottom-16 -left-4 z-30">
                <span className="flex items-center gap-1.5 rounded-full border border-black/40 bg-[#1e1917] px-3.5 py-1 text-[11px] font-bold text-[#e8c89b] shadow-xl backdrop-blur-md">
                  <Brain className="h-3.5 w-3.5 text-[#e8c89b]" /> Auto summary
                </span>
              </div>

              <div className="absolute -bottom-3 right-8 z-30">
                <span className="flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-[#ea580c] px-3 py-1 text-[11px] font-bold text-white shadow-xl backdrop-blur-md">
                  <Zap className="h-3.5 w-3.5" /> Task detection
                </span>
              </div>

              <div className="absolute top-1/2 -right-4 z-30 -translate-y-1/2">
                <span className="flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-950/80 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 shadow-lg backdrop-blur-md">
                  <Heart className="h-3 w-3 fill-rose-400 text-rose-400" /> Liked
                </span>
              </div>

              {/* Chat Window Mockup Box */}
              <div className="rounded-3xl border border-white/20 bg-white p-6 text-slate-900 shadow-2xl relative z-10">
                <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Chat Studio</span>
                  <span className="text-[10px] text-slate-400">Yesterday, 15:24</span>
                </div>

                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs">
                    SM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Message from Samuel</h4>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      We&apos;ve reviewed the latest <span className="bg-blue-100 text-blue-800 font-semibold px-1 rounded">explanation update</span> for Binary Search Trees — overall logic looks clear. Sharing a <span className="bg-[#e8c89b]/40 font-semibold px-1 rounded">document with key notes</span> and suggested tweaks.
                    </p>
                  </div>
                </div>

                <div className="mb-4 rounded-xl bg-slate-100 p-2.5 text-[11px] font-medium text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-slate-500" /> Attached: BST_Notes_Review.md</span>
                  <span className="text-[10px] font-bold text-blue-600">Attached file</span>
                </div>

                {/* Chat Input Bar inside Mockup */}
                <div className="flex items-center gap-2 rounded-xl bg-slate-900 p-2 text-white">
                  <input
                    disabled
                    value="Type your explanation..."
                    className="w-full bg-transparent px-2 text-xs text-slate-300 outline-none"
                  />
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e8c89b] text-slate-900">
                    <Send className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>


        {/* ================= SECTION 2: STEPPED 01 / 02 / 03 CARDS (MATCHING USER SCREENSHOT BOTTOM) ================= */}
        <div className="space-y-12">
          {/* Centered Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="mb-2 inline-block rounded-full bg-[#e8c89b]/15 border border-[#e8c89b]/30 px-3.5 py-1 text-xs font-bold text-[#e8c89b] uppercase tracking-wider">
              Core features
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Transform Good Notes Into Great Recall
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[#f5efe8]/70 leading-relaxed">
              Turn ordinary static notes into truly active recall by adding clarity, context, and smart guidance that helps you retain concepts forever.
            </p>
          </motion.div>

          {/* 3 Cards Grid (01 / 02 / 03) */}
          <div className="grid gap-8 sm:grid-cols-3 items-stretch">
            {steppedCards.map((card, i) => (
              <motion.div
                key={card.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex h-full flex-col"
              >
                {card.isFeatured ? (
                  /* Center Featured Orange/Gold Card (Matching Screenshot 02 Card) */
                  <div className="relative flex h-full flex-col justify-between rounded-3xl border-2 border-[#e8c89b] bg-gradient-to-b from-[#e8c89b]/25 via-[#2b2421] to-[#1e1917] p-7 shadow-2xl scale-[1.03] z-10">
                    <div>
                      <span className="text-xs font-bold text-[#e8c89b] block mb-2">{card.num}</span>
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-xs text-[#f5efe8]/75 leading-relaxed mb-6">{card.desc}</p>

                      {/* Mockup Task List Inside Featured Card */}
                      <div className="space-y-2.5 rounded-2xl bg-[#14100e]/90 p-4 border border-[#e8c89b]/30">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#e8c89b] border-b border-white/10 pb-2 mb-2">
                          <span>Evaluation tasks</span>
                          <span>4/4</span>
                        </div>
                        {card.tasks?.map((task) => (
                          <div key={task} className="flex items-center gap-2.5 text-xs text-white">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                            <span className="text-[11.5px] font-medium">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/concept/new')}
                      className="mt-6 w-full rounded-2xl bg-[#e8c89b] py-3 text-xs font-bold text-[#1e1917] transition hover:bg-[#f5e4c6] shadow-lg flex items-center justify-center gap-2"
                    >
                      <Bot className="h-4 w-4" /> Generate AI Practice Test
                    </button>
                  </div>
                ) : (
                  /* Standard Card 01 and 03 (Matching Screenshot White/Dark Cards) */
                  <GlassCard dark className="flex h-full flex-col justify-between p-7 text-left border border-white/15 shadow-xl hover:border-[#e8c89b]/40 transition">
                    <div>
                      <span className="text-xs font-bold text-[#e8c89b] block mb-2">{card.num}</span>
                      <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-xs text-[#f5efe8]/70 leading-relaxed">{card.desc}</p>
                    </div>

                    <div className="pt-8 flex items-center gap-1.5 text-xs font-semibold text-[#e8c89b] group cursor-pointer" onClick={() => navigate('/workspace')}>
                      <span>Learn more</span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks;
