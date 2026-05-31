import { motion } from 'motion/react';
import { experiences } from '../data/portfolio';
import { Zap, Pin, Scissors, Star } from 'lucide-react';

export default function ResumeSection() {
  return (
    <section className="relative w-full bg-black py-24 text-white">
      {/* Decorative Background Glows - Adjusted for breathability */}
      <div className="absolute top-[10%] -left-[10%] h-[60vw] w-[60vw] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 grid gap-16 lg:grid-cols-[1.2fr_1.8fr] items-start">
        
        {/* Left Profile Area: Scrapbook style */}
        <div className="relative flex flex-col items-center">
          {/* Tilted Image Container */}
          <motion.div 
            initial={{ rotate: -5, y: 20, opacity: 0 }}
            whileInView={{ rotate: -2, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-20 aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-zinc-900 border-[12px] border-white shadow-[20px_20px_60px_rgba(0,0,0,0.5)]"
          >
            <img 
              src="/src/assets/images/regenerated_image_1778936603936.png" 
              alt="Profile"
              className="h-full w-full object-cover grayscale-[0.3] contrast-125"
            />
            {/* Inner shadow */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" />
          </motion.div>

          {/* Name and Contact Info - New in this turn */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <h3 className="text-5xl font-black tracking-tight text-white mb-2">王军震</h3>
            <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
              WeChat: <span className="text-[#00ffc3]">17736004262</span>
            </p>
          </motion.div>

          {/* Decorative Pin */}
          <motion.div 
            initial={{ scale: 0, rotate: 20 }}
            whileInView={{ scale: 1, rotate: -15 }}
            className="absolute top-0 -right-4 z-30 drop-shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-inner">
              <Pin className="h-6 w-6" />
            </div>
          </motion.div>

          {/* Decorative Tape */}
          <div className="absolute top-1/2 -left-8 z-30 h-10 w-32 rotate-[-15deg] bg-white/10 backdrop-blur-md border border-white/10 shadow-sm opacity-40" />
        </div>

        {/* Right Content Area */}
        <div className="relative">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
              工作经历
            </h2>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            >
              <Zap size={48} fill="currentColor" />
            </motion.div>
          </div>

          {/* Education & Major Badges - Moved from bottom and simplified */}
          <div className="mb-16 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white/80 tracking-tight">重庆邮电大学 (24届)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-[#60a5fa] shadow-[0_0_10px_#60a5fa]" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white/80 tracking-tight">产品设计专业</span>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            {experiences.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <div className="flex flex-col gap-6">
                  {/* Company Header */}
                  <div className="flex items-center gap-4">
                    {exp.logo ? (
                      <img src={exp.logo} className="h-12 w-auto" alt={exp.company} />
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#00ffc3] text-black font-black text-xl">
                          {exp.company[0]}
                        </div>
                        <h3 className="text-4xl font-black tracking-tight text-white uppercase">{exp.company}</h3>
                      </div>
                    )}
                  </div>

                  {/* Role Title Line - Matching the reference image proportion */}
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-xl font-bold text-white/90">{exp.role}</span>
                    <span className="text-white/40 font-medium">|</span>
                    <span className="text-lg font-medium text-white/70">{exp.company}设计</span>
                    <span className="ml-2 text-base font-normal text-white/30 tracking-wide">({exp.period})</span>
                  </div>

                  {/* Details List */}
                  <ul className="grid gap-4 mt-2">
                    {exp.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex gap-4 text-lg font-medium leading-relaxed text-white/50 hover:text-white/90 transition-colors">
                        <span className="text-[#00ffc3]/60 flex-shrink-0">{dIdx + 1}.</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

