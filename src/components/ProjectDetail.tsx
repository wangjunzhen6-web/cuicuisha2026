import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowDownRight } from 'lucide-react';
import { Project } from '../types';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: Props) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
        />

        {/* Content Container */}
        <motion.div
          layoutId={`card-${project.id}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="relative z-10 h-full w-full max-w-7xl overflow-y-auto rounded-none bg-neutral-100 text-black md:rounded-[3rem] md:h-[95vh]"
        >
          {/* Header Branding */}
          <div className="sticky top-0 z-20 flex items-center justify-between bg-neutral-100/80 px-8 py-6 backdrop-blur-md md:px-16">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                <ArrowDownRight className="h-5 w-5" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-black/40">Case Study 2026 // {project.category}</span>
            </div>
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
            >
              Close <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-8 md:p-16 pt-8">
            {/* Project Banner Style Header */}
            <div 
              className="relative mb-20 overflow-hidden rounded-[2.5rem] p-10 md:p-20 text-white min-h-[500px] flex flex-col justify-end"
              style={{ backgroundColor: project.themeColor || '#000' }}
            >
              {/* Background Asset (Abstract/Image) */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
              </div>
              
              <div className="relative z-10 grid gap-12 lg:grid-cols-2">
                <div>
                  <h4 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-white/60">{project.subtitle}</h4>
                  <h2 className="mb-8 text-5xl font-black leading-[1.1] tracking-tighter md:text-7xl lg:text-8xl">
                    {project.title}
                  </h2>
                  <p className="max-w-xl text-lg font-medium leading-relaxed text-white/80 md:text-xl">
                    {project.description}
                  </p>
                </div>
                
                <div className="flex flex-col justify-between lg:items-end">
                   <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-widest text-white/40">Design By:</span>
                      <p className="text-2xl font-black text-white">{project.designBy || '脆脆鲨'}</p>
                   </div>
                   
                   {project.themeColor && (
                     <div className="mt-8 flex gap-3">
                        <div className="flex flex-col items-center gap-2">
                           <div className="h-10 w-20 rounded-lg ring-2 ring-white/20" style={{ backgroundColor: project.themeColor }} />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{project.themeColor}</span>
                        </div>
                     </div>
                   )}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-10 right-10 opacity-20">
                <div className="text-8xl font-black leading-none tracking-tighter select-none">ZZTV</div>
              </div>
            </div>

            {/* Strategy and Primary Grid */}
            <div className="mb-20 grid gap-16 lg:grid-cols-[1fr_2fr]">
               <div>
                  <h3 className="mb-8 text-4xl font-black tracking-tighter text-black">设计策略:</h3>
                  <div className="space-y-6">
                    {(project.strategy || ['强调空间感与交互流畅度', '采用拟物化场景嵌入', '色彩心理学引导核心转化']).map((item, idx) => (
                      <div key={idx} className="flex gap-4 border-l-4 border-neutral-200 pl-6 transition-colors hover:border-black">
                        <p className="text-xl font-medium leading-relaxed text-neutral-600 italic">
                          "{item}"
                        </p>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="grid gap-8">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-200 md:aspect-[16/10]">
                    <img src={project.imageUrl} alt="Primary Showcase" className="h-full w-full object-cover transition-transform hover:scale-105 duration-700" />
                  </div>
               </div>
            </div>

            {/* Mockups Row */}
            {project.secondaryImages ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {project.secondaryImages.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-[9/19] overflow-hidden rounded-[2rem] border-8 border-neutral-50 bg-white shadow-xl"
                  >
                     <img src={img} alt={`View ${idx}`} className="h-full w-full object-cover" />
                  </motion.div>
                ))}
              </div>
            ) : (
                <div className="flex h-96 items-center justify-center rounded-[2rem] bg-neutral-200">
                    <p className="text-neutral-400 font-bold uppercase tracking-widest">Additional Views Placeholder</p>
                </div>
            )}

            {/* Footer space */}
            <div className="py-20 text-center">
              <button 
                onClick={onClose}
                className="rounded-full bg-black px-12 py-5 text-lg font-bold text-white transition-transform hover:scale-105 active:scale-95"
              >
                探索完毕 // 返回首页
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
