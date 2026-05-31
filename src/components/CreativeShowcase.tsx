import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const CREATIVE_WORKS = [
  { id: 1, title: 'Visual 2026', color: '#8b5cf6', imageUrl: '/images/bear_street_4_1779894288795.png' },
  { id: 2, title: 'Spark Design', color: '#ec4899', imageUrl: '/images/unsplash_1618005182384.jpg' },
  { id: 3, title: 'AI Exploration', color: '#3b82f6', imageUrl: '/images/unsplash_1620641788421.jpg' },
  { id: 4, title: 'Concept Art', color: '#10b981', imageUrl: '/images/bear_cyber_3_1779894269826.png' },
  { id: 5, title: 'Future UI', color: '#f59e0b', imageUrl: '/images/unsplash_1550745165_1.jpg' },
  { id: 6, title: 'Digital World', color: '#ef4444', imageUrl: '/images/unsplash_1614850523296.jpg' },
  { id: 7, title: 'Motion Graphics', color: '#6366f1', imageUrl: '/images/unsplash_1550745165_1.jpg' },
  { id: 8, title: 'Brand Identity', color: '#14b8a6', imageUrl: '/images/regenerated_image_1778957990481.png' },
];

export const CreativeShowcase: React.FC = () => {
  return (
    <section className="relative min-h-[900px] bg-black py-24">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="relative z-10 mb-20 flex flex-col items-center justify-center text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-wrap justify-center gap-x-[0.3em] text-6xl font-black italic tracking-tighter md:text-8xl"
          >
            {["CREATIVE", "AI"].map((word, wordIdx) => (
              <div key={wordIdx} className="flex">
                {word.split('').map((char, charIdx) => {
                  const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#4ade80', '#fbbf24', '#f87171'];
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
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-black shadow-xl"
          >
            查看更多 <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Circular Card Layout */}
        <div className="relative mx-auto h-[400px] w-full max-w-5xl md:h-[600px]">
          {CREATIVE_WORKS.map((work, idx) => {
            // Calculate position in an oval/arch
            // On mobile, we use smaller radii
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            const rx = isMobile ? window.innerWidth * 0.35 : 400; 
            const ry = isMobile ? 150 : 250;
            
            const total = CREATIVE_WORKS.length;
            const angle = (idx / total) * Math.PI * 2;
            const x = Math.cos(angle) * rx;
            const y = Math.sin(angle) * ry;
            
            const duration = 4 + Math.random() * 2;
            const delay = Math.random() * 2;

            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{
                  y: [y, y - 15, y],
                  rotate: [idx % 2 === 0 ? 8 : -8, idx % 2 === 0 ? -4 : 4, idx % 2 === 0 ? 8 : -8]
                }}
                transition={{
                  y: { duration, repeat: Infinity, ease: "easeInOut", delay },
                  rotate: { duration: duration * 1.5, repeat: Infinity, ease: "easeInOut", delay },
                  opacity: { duration: 0.5, delay: idx * 0.1 }
                }}
                whileHover={{ 
                  scale: 1.25, 
                  zIndex: 50,
                  rotate: 0,
                  transition: { duration: 0.2, type: "spring", stiffness: 300 }
                }}
                className="absolute left-1/2 top-1/2 h-40 w-32 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-2xl border-2 border-white/20 p-1.5 shadow-2xl backdrop-blur-xl md:h-56 md:w-44"
                style={{
                  x,
                  backgroundColor: work.color + '20',
                  borderColor: work.color + '40',
                }}
              >
                <img 
                  src={work.imageUrl} 
                  alt={work.title} 
                  className="h-full w-full rounded-xl object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background Glows - Adaptive */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80vw] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[180px]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/4 -z-10 h-[50vw] w-[50vw] rounded-full bg-purple-500/5 blur-[150px]" />
    </section>
  );
};
