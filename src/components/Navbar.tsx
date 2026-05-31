import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: '首页', href: '#home' },
  { name: '简历', href: '#resume' },
  { name: '作品', href: '#works' },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto relative flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl"
      >
        {NAV_ITEMS.map((item, idx) => (
          <a
            key={item.name}
            href={item.href}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative px-6 py-2"
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="nav-bg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-0 rounded-full bg-white/20 blur-[2px]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>
            
            <motion.span 
              animate={{ 
                scale: hoveredIndex === idx ? 1.1 : 1,
                color: hoveredIndex === idx ? "#ffffff" : "rgba(255, 255, 255, 0.6)"
              }}
              className="relative z-10 text-sm font-bold tracking-widest transition-colors duration-200"
            >
              {item.name}
            </motion.span>

            {/* Micro-dot indicator */}
            <motion.div 
              initial={false}
              animate={{ 
                opacity: hoveredIndex === idx ? 1 : 0,
                y: hoveredIndex === idx ? 4 : 8
              }}
              className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
            />
          </a>
        ))}
      </motion.nav>
    </div>
  );
}

