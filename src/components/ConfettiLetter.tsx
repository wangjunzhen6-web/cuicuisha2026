import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface ConfettiLetterProps {
  char: string;
  className?: string;
  delay?: number;
}

export const ConfettiLetter: React.FC<ConfettiLetterProps> = ({ char, className, delay = 0 }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x, y },
      colors: ['#60a5fa', '#a78bfa', '#f472b6', '#fbbf24', '#4ade80'],
      ticks: 200,
      gravity: 1.2,
      scalar: 0.7,
      shapes: ['circle', 'square']
    });
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      onMouseEnter={handleMouseEnter}
      whileHover={{ 
        scale: 1.2, 
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      }}
      className={`inline-block cursor-default select-none ${className}`}
    >
      {char}
    </motion.span>
  );
};
