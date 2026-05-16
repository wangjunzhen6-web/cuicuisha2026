import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6 pointer-events-none"
    >
      <div className="flex w-full max-w-7xl items-center justify-between px-10 pointer-events-auto">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
             {[1, 2, 3].map(i => <div key={i} className="h-4 w-4 rounded-full bg-black/80" />)}
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-black/80">#运营视觉设计</span>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden items-center gap-8 md:flex">
            {['首页', '作品', '简历', '动态'].map((item) => (
              <a 
                key={item}
                href="#"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 transition-colors hover:text-black"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="text-right">
             <span className="text-[10px] font-black uppercase tracking-[0.1em] text-black/60">DESIGN PORTFOLIO<br/>2024-2026</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

