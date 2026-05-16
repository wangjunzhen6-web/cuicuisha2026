import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Mail, ArrowDownRight, Briefcase, Hand } from 'lucide-react';
import { projects, experiences } from './data/portfolio';
import { Project } from './types';
import BentoCard from './components/BentoCard';
import ProjectDetail from './components/ProjectDetail';
import Navbar from './components/Navbar';
import ResumeSection from './components/ResumeSection';
import { CreativeShowcase } from './components/CreativeShowcase';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0.95]), { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#f1f1f1]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 spatial-grid">
        <div className="absolute top-10 left-10 flex items-center gap-2 opacity-50">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => <div key={i} className="h-4 w-4 rounded-full bg-black" />)}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-black">#运营视觉设计</span>
        </div>
        
        <div className="absolute top-10 right-10 text-right opacity-50">
          <span className="text-xs font-bold uppercase tracking-widest text-black">DESIGN PORTFOLIO<br/>2024-2026</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="rounded-full bg-[#00ffc3] px-6 py-2 text-2xl font-black text-black shadow-xl ring-4 ring-white">2026</div>
            <h3 className="text-3xl font-black italic tracking-tighter text-black">创意视觉设计 / AIGC / 古法3D</h3>
          </div>
          
          <h1 className="relative text-[clamp(4rem,15vw,12rem)] font-black leading-[0.8] tracking-tighter text-[#3a2082]">
            DESIGN<br />
            PORTFOLIO
          </h1>

          {/* Floating Balls - Simplified representation */}
          <div className="absolute -bottom-20 left-1/2 flex -translate-x-1/2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <motion.div
                key={i}
                animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2 + i, repeat: Infinity }}
                className={`h-${8 + i} w-${8 + i} rounded-full bg-gradient-to-br from-white to-gray-300 shadow-lg ring-1 ring-black/5 flex items-center justify-center text-xs`}
              >
                {i % 2 === 0 ? '⚽' : '🎨'}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Resume Section */}
      <ResumeSection />

      {/* Creative AI Showcase Section */}
      <CreativeShowcase />

      {/* Portfolio Section Header */}
      <section className="relative bg-black py-32 px-6 overflow-hidden">
        {/* Background Diffusion Glows */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-x-4 text-7xl font-black italic tracking-tighter md:text-9xl mb-6"
            >
              {["CREATIVE", "WORK"].map((word, wordIdx) => (
                <div key={wordIdx} className="flex">
                  {word.split('').map((char, charIdx) => {
                    const colors = ['#4ade80', '#60a5fa', '#a78bfa', '#f472b6', '#fbbf24'];
                    const color = colors[(wordIdx * 8 + charIdx) % colors.length];
                    return (
                      <motion.span
                        key={charIdx}
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2, rotate: [-5, 5, -5] }}
                        style={{ color }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </div>
              ))}
            </motion.h2>
            <p className="text-xl font-medium text-white/40 tracking-wider">一些有趣的创意化内容探索</p>
          </div>
 
          <motion.div style={{ scale }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <BentoCard 
                    project={project} 
                    onClick={(p) => setSelectedProject(p)} 
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-black px-4 py-40 text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="mb-6 inline-block text-xs font-bold uppercase tracking-[0.4em] text-white/30">Connect</span>
          <h2 className="mb-12 text-6xl font-medium tracking-tighter text-white md:text-8xl">期待与优秀的项目相遇</h2>
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
            <a 
              href="mailto:wangjunzhen6@gmail.com"
              className="flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-bold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <Mail className="h-5 w-5" />
              发送邮件
            </a>
          </div>
        </motion.div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetail 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {/* Footer */}
      <footer className="bg-black p-8 text-center text-xs font-medium uppercase tracking-widest text-white/20 border-t border-white/5">
        &copy; 2026 脆脆鲨的作品集 &bull; 设计版权所有
      </footer>
    </div>
  );
}

