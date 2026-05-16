import { motion } from 'motion/react';

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Dynamic Aurora Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -left-[10%] h-[80%] w-[80%] rounded-full bg-purple-600/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -150, 150, 0],
          y: [0, 100, -100, 0],
          scale: [1, 1.1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[10%] -right-[10%] h-[70%] w-[70%] rounded-full bg-blue-600/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, 200, -200, 0],
          y: [0, 150, -150, 0],
          scale: [1, 1.5, 0.8, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -bottom-[20%] left-[20%] h-[60%] w-[60%] rounded-full bg-cyan-600/10 blur-[120px]"
      />
      
      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
