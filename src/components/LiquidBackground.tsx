import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from 'motion/react';

export default function LiquidBackground() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });

  // Smooth mouse coordinates with dynamic spring-like dampening to prevent flickering
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let currentX = 0.5;
    let currentY = 0.5;

    const smoothLoop = () => {
      // Linear interpolation (lerp) for premium buttery transition
      currentX += (targetRef.current.x - currentX) * 0.08;
      currentY += (targetRef.current.y - currentY) * 0.08;
      setMousePos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(smoothLoop);
    };

    animationFrameId = requestAnimationFrame(smoothLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Generate 54 vertical lines with a highly polished bell-curve, breathing motion, and dynamic hover responsiveness
  const totalLines = 54;
  const lineData = Array.from({ length: totalLines }).map((_, i) => {
    const angle = (i / (totalLines - 1)) * Math.PI;
    // Bell curve distribution (taller in the middle, fading beautifully at the screen edges)
    const baseHeight = Math.sin(angle) * 75;
    // Normalized position of this specific wave column
    const colX = i / (totalLines - 1);

    return {
      index: i,
      baseHeight,
      colX,
    };
  });

  // Calculate parallax offsets for the gorgeous 3D liquid chrome pods and cute decorations
  const topPodX = (mousePos.x - 0.5) * -28;
  const topPodY = (mousePos.y - 0.5) * -28;
  const bottomPodX = (mousePos.x - 0.5) * 36;
  const bottomPodY = (mousePos.y - 0.5) * 36;

  // Interactive micro offset for the cute elements
  const cuteParaX = (mousePos.x - 0.5) * 35;
  const cuteParaY = (mousePos.y - 0.5) * 35;

  // Cosmic Starry Background Memoization
  const cosmicStars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 3,
      opacityMin: Math.random() * 0.2,
      opacityMax: Math.random() * 0.7 + 0.3,
      scaleMax: Math.random() * 1.2 + 1
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#020008]">
      
      {/* 0. Cosmic Starry Background */}
      <div className="absolute inset-0 z-0">
        {cosmicStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white/90"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.6)`
            }}
            animate={{
              opacity: [star.opacityMin, star.opacityMax, star.opacityMin],
              scale: [1, star.scaleMax, 1]
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: star.delay
            }}
          />
        ))}
      </div>

      {/* Dynamic Color Gradients and Patterns for Cute Elements */}
      <svg className="absolute w-0 h-0 hidden">
        <defs>
          <linearGradient id="cute-shark-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ffc3" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#7c3ded" />
          </linearGradient>
          <linearGradient id="cute-star-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
          <linearGradient id="cute-heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <linearGradient id="cute-bubble-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Cinematic Ambient Dynamic Lighting */}
      <div className="absolute inset-0 flex items-center justify-center opacity-85">
        {/* Dynamic purple/blue center glow moving slightly with mouse interaction */}
        <div 
          className="absolute w-[800px] h-[550px] rounded-full bg-indigo-950/20 blur-[140px] transition-transform duration-500 ease-out"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * 15}px, ${(mousePos.y - 0.5) * 15}px)`,
          }}
        />
        <div 
          className="absolute w-[600px] h-[450px] rounded-full bg-blue-900/10 blur-[110px] transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -25}px, ${(mousePos.y - 0.5) * -25}px)`,
          }}
        />
      </div>

      {/* 2. Interactive Soundwave / Cyber Frequency Spectrum (Middle Pillar) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
        <div className="relative w-full max-w-6xl h-96 flex items-center justify-center gap-[5px] sm:gap-[7px] md:gap-[9.5px] px-8 opacity-90">
          {lineData.map((line) => {
            // Distance from cursor X position
            const distance = Math.abs(line.colX - mousePos.x);
            // Dynamic proximity swell factor - peaks near the reader's cursor
            const hoverInfluence = Math.max(0, 1 - distance * 3.2);

            // Dynamic height combining baseline center weight, cursor pull, and breathing wave
            const scaleYMultiplier = 1.0 + hoverInfluence * 0.45;
            
            // Alternating premium cyber gradient spectrum based on interactions
            const isNearCursor = hoverInfluence > 0.35;
            const gradientColors = isNearCursor
              ? 'linear-gradient(180deg, rgba(37, 99, 235, 0) 0%, rgba(0, 255, 195, 0.45) 20%, rgba(139, 92, 246, 0.8) 50%, rgba(244, 63, 94, 0.45) 80%, rgba(30, 27, 75, 0) 100%)'
              : 'linear-gradient(180deg, rgba(30, 27, 75, 0) 0%, rgba(37, 99, 235, 0.35) 30%, rgba(124, 58, 237, 0.55) 60%, rgba(99, 102, 241, 0.2) 85%, rgba(30, 27, 75, 0) 100%)';

            return (
              <motion.div
                key={line.index}
                className="w-[1.5px] sm:w-[2.5px] md:w-[3.2px] rounded-full transform origin-center transition-all duration-300"
                style={{
                  height: `${line.baseHeight + 14}%`,
                  background: gradientColors,
                  transform: `scaleY(${scaleYMultiplier})`,
                  boxShadow: isNearCursor 
                    ? '0 0 14px rgba(0, 255, 195, 0.25), 0 0 4px rgba(139, 92, 246, 0.2)' 
                    : 'none',
                }}
                animate={{
                  // Natural biological organic breathing waves
                  scaleY: [scaleYMultiplier, scaleYMultiplier * 1.18, scaleYMultiplier * 0.82, scaleYMultiplier],
                  opacity: [0.35, 0.95, 0.5, 0.35],
                }}
                transition={{
                  duration: 2.5 + (line.index % 5) * 0.45,
                  repeat: Infinity,
                  ease: "easeInOut",
                  // Sequence phase offsets to create a constant wave of energy from left to right
                  delay: (line.index % 12) * 0.15,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 4. Cute Floating Dynamic Decorative Elements (Bobbing, Swinging, Adorable Expressions) */}
      
      {/* Element A: Cute Little Shark "脆脆鲨" (Upper left quadrant) */}
      <div 
        className="absolute top-[18%] left-[10%] sm:left-[15%] z-20 transition-transform duration-500 ease-out"
        style={{ transform: `translate(${cuteParaX * -1.2}px, ${cuteParaY * -1.2}px)` }}
      >
        <motion.div
          animate={{
            y: [0, -14, 0],
            rotate: [-6, 8, -6],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex flex-col items-center gap-1 cursor-pointer"
        >
          <svg viewBox="0 0 100 80" className="w-14 h-12 select-none filter drop-shadow-[0_6px_15px_rgba(0,255,195,0.45)]">
            {/* Body */}
            <path d="M10,40 C10,15 50,10 75,30 C85,38 95,40 100,35 C95,48 85,55 70,55 C40,55 10,50 10,40 Z" fill="url(#cute-shark-grad)" />
            {/* Fin on back */}
            <path d="M45,22 C48,5 57,10 60,18" fill="url(#cute-shark-grad)" />
            {/* Tail Fin */}
            <path d="M10,40 C0,30 2,25 0,18 C3,28 8,35 10,40 C8,45 3,52 0,62 C2,55 0,50 10,40 Z" fill="url(#cute-shark-grad)" />
            {/* Pectoral Fin */}
            <path d="M48,51 C52,65 60,65 58,52 Z" fill="#00ffc3" />
            {/* Cute Eye */}
            <circle cx="72" cy="34" r="4.5" fill="#ffffff" />
            <circle cx="73" cy="33.5" r="2" fill="#020008" />
            {/* Tiny Blush */}
            <ellipse cx="76" cy="40" r="3.5" rx="4.5" ry="2.2" fill="#ec4899" opacity="0.85" />
            {/* Tiny happy mouth */}
            <path d="M68,41 Q70,44 72,41" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-[10px] font-bold text-[#00ffc3] bg-black/40 px-2 py-0.5 rounded-md border border-neutral-800 scale-90 sm:scale-100 opacity-90 transition-opacity hover:opacity-100">
            🦈 脆小鲨
          </span>
        </motion.div>
      </div>

      {/* Element B: Cute Twinkling Sleeping Star (Middle left quadrant near wave start) */}
      <div 
        className="absolute top-[55%] left-[5%] sm:left-[8%] z-20 transition-transform duration-700 ease-out"
        style={{ transform: `translate(${cuteParaX * 0.8}px, ${cuteParaY * 0.8}px)` }}
      >
        <motion.div
          animate={{
            y: [0, 10, -8, 0],
            rotate: [15, -15, 15],
            scale: [0.9, 1.05, 0.9],
          }}
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-12 h-12 select-none filter drop-shadow-[0_5px_15px_rgba(250,204,21,0.45)]">
            <path d="M50 10 L62 38 L92 38 L68 56 L78 86 L50 68 L22 86 L32 56 L8 38 L38 38 Z" fill="url(#cute-star-grad)" />
            {/* Sleeping eyes */}
            <path d="M37 48 Q41 52 45 48" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M55 48 Q59 52 63 48" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Cute rosy cheeks */}
            <circle cx="33" cy="54" r="3.5" fill="#f43f5e" />
            <circle cx="67" cy="54" r="3.5" fill="#f43f5e" />
            {/* Little smiley mouth */}
            <path d="M48 55 Q50 58 52 55" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        </motion.div>
      </div>

      {/* Element C: Cute Pink Winged Heart (Lower right quadrant, balanced) */}
      <div 
        className="absolute bottom-[25%] right-[10%] sm:right-[15%] z-20 transition-transform duration-500 ease-out"
        style={{ transform: `translate(${cuteParaX * 1.5}px, ${cuteParaY * -1.5}px)` }}
      >
        <motion.div
          animate={{
            y: [0, -12, 12, 0],
            rotate: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="flex flex-col items-center gap-1"
        >
          <svg viewBox="0 0 120 100" className="w-14 h-12 select-none filter drop-shadow-[0_6px_14px_rgba(244,114,182,0.5)]">
            {/* Left Wing */}
            <path d="M25 45 C10 40 5 25 22 28 C28 29 32 35 34 38" stroke="#fff" strokeWidth="1.5" fill="#fff" opacity="0.65" />
            {/* Right Wing */}
            <path d="M95 45 C110 40 115 25 98 28 C92 29 88 35 86 38" stroke="#fff" strokeWidth="1.5" fill="#fff" opacity="0.65" />
            {/* Heart Body */}
            <path d="M60 82 C60 82 25 56 25 35 C25 18 41 15 60 32 C79 15 95 18 95 35 C95 56 60 82 60 82 Z" fill="url(#cute-heart-grad)" />
            {/* Smiling eyes */}
            <circle cx="48" cy="38" r="3" fill="#ffffff" />
            <circle cx="72" cy="38" r="3" fill="#ffffff" />
            {/* Happy mouth */}
            <path d="M57 45 Q60 48 63 45" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        </motion.div>
      </div>

      {/* Element D: Floating Gradient Bubbles (Bottom left & center right) */}
      <div 
        className="absolute bottom-[18%] left-[25%] z-15 opacity-60"
        style={{ transform: `translate(${cuteParaX * -0.5}px, ${cuteParaY * 0.5}px)` }}
      >
        <motion.div
          animate={{
            y: [0, -32, 0],
            scale: [0.8, 1.05, 0.8],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-10 h-10 select-none">
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cute-bubble-grad)" strokeWidth="3" />
            <ellipse cx="32" cy="32" rx="10" ry="5" fill="#ffffff" transform="rotate(-30 32 32)" opacity="0.75" />
          </svg>
        </motion.div>
      </div>

      <div 
        className="absolute top-[25%] right-[25%] z-15 opacity-55"
        style={{ transform: `translate(${cuteParaX * -0.4}px, ${cuteParaY * -0.4}px)` }}
      >
        <motion.div
          animate={{
            y: [0, 25, 0],
            scale: [1, 0.75, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-8 h-8 select-none">
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cute-bubble-grad)" strokeWidth="2.5" />
            <ellipse cx="32" cy="32" rx="10" ry="5" fill="#ffffff" transform="rotate(-30 32 32)" opacity="0.7" />
          </svg>
        </motion.div>
      </div>

      {/* Element E: Extra tiny bubble cluster (Top Center) */}
      <div 
        className="absolute top-[12%] right-[45%] z-15 opacity-40"
        style={{ transform: `translate(${cuteParaX * 0.9}px, ${cuteParaY * 0.9}px)` }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [0.6, 0.9, 0.6],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-6 h-6 select-none">
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#cute-bubble-grad)" strokeWidth="2" />
            <ellipse cx="32" cy="32" rx="10" ry="5" fill="#ffffff" transform="rotate(-30 32 32)" opacity="0.8" />
          </svg>
        </motion.div>
      </div>

      {/* 3. Floating Premium Fluid 3D Liquid Chrome Pods */}
      {/* Top-Right Pod (Depth interactive displacement) */}
      <div
        className="absolute top-[-5%] right-[-14%] sm:right-[-8%] md:right-[-4%] w-[280px] sm:w-[460px] md:w-[540px] aspect-square select-none mix-blend-lighten z-1 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${topPodX}px, ${topPodY}px) rotate(${(mousePos.x - 0.5) * 4}deg)`,
        }}
      >
        <motion.div
          animate={{
            y: [0, -20, 10, 0],
            rotate: [0, 5, -3, 0],
            scale: [1, 1.02, 0.98, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full"
        >
          <img
            src="/src/assets/images/chrome_cyber_pod_1779626552718.png"
            alt="Top Chrome Pod"
            className="w-full h-full object-contain opacity-95 drop-shadow-[0_20px_50px_rgba(139,92,246,0.25)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Bottom-Left Pod (Flipped chromatic anchor with symmetric lagging movement) */}
      <div
        className="absolute bottom-[-11%] left-[-18%] sm:left-[-12%] md:left-[-6%] w-[250px] sm:w-[420px] md:w-[480px] aspect-square select-none mix-blend-lighten z-1 pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${bottomPodX}px, ${bottomPodY}px) rotate(${(mousePos.y - 0.5) * -6}deg)`,
        }}
      >
        <motion.div
          animate={{
            y: [0, 16, -12, 0],
            rotate: [180, 185, 175, 180],
            scale: [0.93, 0.95, 0.91, 0.93],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="w-full h-full"
        >
          <img
            src="/src/assets/images/chrome_cyber_pod_1779626552718.png"
            alt="Bottom Chrome Pod"
            className="w-full h-full object-contain opacity-85 scale-x-[-1] drop-shadow-[0_-20px_45px_rgba(59,130,246,0.2)]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Ambient vignettes to guarantee legibility of main text contents */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020008] via-transparent to-[#020008] opacity-90 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020008] to-transparent opacity-60 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020008] to-transparent opacity-60 pointer-events-none" />
    </div>
  );
}
