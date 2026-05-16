import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Project } from '../types';
import { Briefcase, ArrowDownRight } from 'lucide-react';

interface Props {
  project: Project;
  onClick: (project: Project) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  landing: '落地页设计',
  kv: '视觉海论/IP',
  branding: '品牌视觉规范',
  ai: 'AIGC 探索',
  personal: '个人创作',
  animation: '动态视觉',
  experience: '工作项目',
};

export default function BentoCard({ project, onClick }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for parallax tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set((mouseX / rect.width) - 0.5);
    y.set((mouseY / rect.height) - 0.5);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={`card-${project.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(project)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#121212] p-8 transition-all duration-500 w-full hover:border-white/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Top Banner: Category and Type */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <Briefcase className="h-5 w-5 text-white/70" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#60a5fa]">{CATEGORY_MAP[project.category] || project.category}</p>
        </div>
      </div>

      {/* Title and Description */}
      <div className="mb-8">
        <h3 className="mb-3 text-4xl font-bold text-white tracking-tight leading-tight">{project.title}</h3>
        <p className="text-lg text-white/40 leading-relaxed font-medium">
          {project.description}
        </p>
      </div>

      {/* Image Preview Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.5rem] bg-zinc-800 transition-transform duration-700 group-hover:scale-[1.02]">
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100"
        />
        {/* Subtle inner shadow/glow */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      {/* Footer: Learn More */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2 group/btn">
          <span className="text-sm font-bold text-white/30 transition-colors group-hover:text-white/80">查看作品</span>
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 transition-transform group-hover:translate-x-1 group-hover:bg-white/20">
            <ArrowDownRight className="h-3 w-3 text-white/50" />
          </div>
        </div>
      </div>

      {/* Hover Floating Glow */}
      <motion.div 
        animate={{ 
          opacity: isHovered ? 0.4 : 0,
          scale: isHovered ? 1.2 : 0.8
        }}
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[80px]"
      />

      {/* Breathing Border Light */}
      <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none border border-transparent group-hover:border-white/10 transition-colors duration-500" />
    </motion.div>
  );
}
