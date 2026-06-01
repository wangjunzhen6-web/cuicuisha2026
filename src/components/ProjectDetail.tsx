import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ArrowDownRight,
  ArrowLeft,
  Sparkles,
  Edit2,
  Upload,
  Link,
  Check,
  Compass,
  Palette,
  Cpu,
  Layers,
} from "lucide-react";
import { Project } from "../types";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  project: Project | null;
  onClose: () => void;
  onUpdateProject?: (updated: Project) => void;
}

// Component logic
export default function ProjectDetail({
  project,
  onClose,
  onUpdateProject,
}: Props) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

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
          className={`relative z-10 h-full w-full max-w-7xl overflow-y-auto rounded-none ${project.id === '12' ? 'bg-white' : 'bg-neutral-900'} text-black md:rounded-[3rem] md:h-[95vh] no-scrollbar`}
        >
          {/* Close Button - Floating */}
          <button
            onClick={onClose}
            className="fixed top-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-transform hover:scale-110 md:absolute"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Layout Switcher */}
          {project.layout === "art" ? (
            <ArtLayout project={project} onZoom={setZoomedImage} />
          ) : project.layout === "dynamic" ? (
            <DynamicLayout
              project={project}
              onZoom={setZoomedImage}
              onUpdateProject={onUpdateProject}
            />
          ) : project.layout === "cyber" ? (
            <CyberLayout
              project={project}
              onZoom={setZoomedImage}
              onClose={onClose}
              onUpdateProject={onUpdateProject}
            />
          ) : (
            <UILayout project={project} onZoom={setZoomedImage} />
          )}

          {/* Footer space */}
          <div className="mt-40 text-center pb-32">
            <h4 className="mb-8 text-sm font-bold uppercase tracking-[0.4em] text-zinc-400">
              END OF CASE STUDY
            </h4>
            <button
              onClick={onClose}
              className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-black px-12 py-6 text-xl font-black text-white hover:bg-zinc-900"
            >
              <span>探索完毕 / 返回首页</span>
              <ArrowDownRight className="h-6 w-6 transition-transform group-hover:rotate-45" />
            </button>
          </div>
        </motion.div>

        {/* Zoom Lightbox */}
        <AnimatePresence>
          {zoomedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedImage(null)}
              className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/98 p-4 md:p-12"
            >
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-8 right-8 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </button>
              {(zoomedImage.endsWith(".mp4") || zoomedImage.startsWith("data:video/") || zoomedImage.toLowerCase().endsWith(".webm") || zoomedImage.toLowerCase().endsWith(".mov")) ? (
                <motion.video
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={zoomedImage}
                  autoPlay
                  loop
                  controls
                  className="max-h-full max-w-full rounded-lg shadow-2xl"
                />
              ) : (
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={zoomedImage}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                  alt="Zoomed View"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

function UILayout({
  project,
  onZoom,
}: {
  project: Project;
  onZoom: (img: string) => void;
}) {
  return (
    <>
      <section className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 scale-105 blur-sm opacity-60">
          <img
            src={project.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative h-full w-full p-8 md:p-16 flex items-center">
          <div className="grid w-full gap-12 lg:grid-cols-2 items-center">
            <div className="flex justify-center lg:justify-start">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => onZoom(project.imageUrl)}
                className="group relative aspect-[1124/2350] w-full max-w-[280px] cursor-zoom-in overflow-hidden rounded-[35px] border-[8px] border-black bg-neutral-950 shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
              >
                {/* Scrollable Container */}
                <div className="absolute inset-0 pt-0 pb-0 overflow-y-auto scrollbar-none rounded-[27px]">
                  <img
                    src={project.imageUrl}
                    alt="Mockup"
                    className="w-full min-h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/60 rounded-full z-20 pointer-events-none" />
              </motion.div>
            </div>
            <div className="text-white">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="mb-4 text-5xl font-black italic tracking-tighter md:text-7xl lg:text-8xl flex flex-wrap items-center gap-x-4">
                  {project.title}
                  <span className="text-4xl text-[#00ffc3] italic">*</span>
                </h2>
                <h4 className="mb-8 text-xl font-bold uppercase tracking-widest text-[#00ffc3]">
                  {project.subtitle || "UI/UX DESIGN CASE STUDY"}
                </h4>
                <p className="max-w-xl text-lg font-medium leading-relaxed text-white/60">
                  {project.description}
                </p>
                <div className="mt-12 flex gap-4">
                  {(project.themeColor
                    ? [project.themeColor, "#84BF54", "#5EC3FF"]
                    : ["#FF572B", "#84BF54", "#5EC3FF"]
                  ).map((color, i) => (
                    <div
                      key={i}
                      className="group relative flex h-10 w-24 items-center justify-center overflow-hidden rounded-lg font-mono text-[10px] font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
                      style={{ backgroundColor: color }}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute top-12 right-24 pointer-events-none opacity-20 hidden lg:block">
          <span className="text-9xl font-black italic text-white leading-none tracking-tighter">
            CASE
          </span>
        </div>
      </section>

      <section className="relative z-20 -mt-16 rounded-t-[4rem] bg-neutral-100 px-8 pt-24 md:px-16 lg:px-24">
        <div className="mb-32 grid gap-16 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="sticky top-24 h-fit">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-[#00ffc3]">
              <ArrowDownRight className="h-6 w-6" />
            </div>
            <h3 className="mb-8 text-5xl font-black tracking-tighter text-black uppercase">
              设计策略 <br />
              <span className="text-zinc-400">STRATEGY</span>
            </h3>
            {project.description && (
              <p className="text-xl font-medium leading-relaxed text-zinc-500">
                {project.description}
              </p>
            )}
          </div>
          <div className="space-y-12">
            {(
              project.strategy || [
                "强调空间感与交互流畅度",
                "采用拟物化场景嵌入",
                "色彩心理学引导核心转化",
              ]
            ).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group flex gap-8 border-b border-zinc-200 pb-12 transition-colors hover:border-black"
              >
                <span className="text-sm font-black text-zinc-300">
                  0{idx + 1}
                </span>
                <p className="text-3xl font-bold leading-tight text-zinc-800 transition-colors group-hover:text-black">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-32">
          <h3 className="mb-12 text-2xl font-black uppercase tracking-widest text-zinc-900">
            // 视觉呈现 VISUALS
          </h3>
          <div
            onClick={() => onZoom(project.imageUrl)}
            className="group relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-[3rem] bg-zinc-200 shadow-2xl"
          >
            <img
              src={project.imageUrl}
              alt="Main Visual"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {project.secondaryImages && (
          <div className="mb-32">
            <h3 className="mb-12 text-2xl font-black uppercase tracking-widest text-zinc-900">
              // 视觉呈现 SHOWCASE
            </h3>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {project.secondaryImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  onClick={() => onZoom(img)}
                  className="group relative break-inside-avoid cursor-zoom-in overflow-hidden rounded-[2.5rem] border-[10px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]"
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full" />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function ArtLayout({
  project,
  onZoom,
}: {
  project: Project;
  onZoom: (img: string) => void;
}) {
  return (
    <div className="bg-white min-h-full">
      {/* Header Section */}
      <section className="relative px-8 pt-12 pb-6 md:px-12">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
          <span className="text-[12rem] font-black italic tracking-tighter text-black uppercase">
            DISANZHOU
          </span>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-black flex items-center gap-4">
            【{project.title}】
            <div className="flex items-center gap-1">
              <div className="h-4 w-4 bg-black rotate-45" />
            </div>
          </h2>
        </div>
      </section>

      {/* Main Hero Horizontal - Section 1 */}
      <section className="px-8 pb-12 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onZoom(project.imageUrl)}
          className="group relative cursor-zoom-in overflow-hidden rounded-2xl shadow-lg border border-zinc-100"
        >
          <img
            src={project.imageUrl}
            alt="Hero"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-102"
          />
        </motion.div>
      </section>

      {/* Main Content Grid - Section 2 & 3 Combined */}
      <div className="px-8 pb-24 md:px-12 space-y-12">
        {/* Top Row: Color Palette + Horizontal Image */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] items-center">
          <div className="flex flex-col justify-start space-y-10">
            <div>
              <h3 className="text-2xl font-black text-black">配色</h3>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] block mt-1">
                COLOUR
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              {(project.themeColor
                ? [project.themeColor, "#FFB321", "#B5E7F4", "#FF9F89"]
                : ["#0066FF", "#FFB321", "#B5E7F4", "#FF9F89"]
              ).map((color, i) => (
                <div
                  key={i}
                  className="h-16 w-16 rounded-xl shadow-sm border border-zinc-100 transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          {project.secondaryImages?.[0] && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onClick={() => onZoom(project.secondaryImages![0])}
              className="group relative cursor-zoom-in overflow-hidden rounded-2xl shadow-md border border-zinc-100"
            >
              <img
                src={project.secondaryImages[0]}
                alt="Detail"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-102"
              />
            </motion.div>
          )}
        </div>

        {/* Bottom Row: Tall Image + Two Stacked Items */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Tall vertical image */}
          {project.secondaryImages?.[1] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => onZoom(project.secondaryImages![1])}
              className="group relative cursor-zoom-in overflow-hidden rounded-3xl shadow-2xl h-full flex"
            >
              <img
                src={project.secondaryImages[1]}
                alt="Vertical Showcase"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
            </motion.div>
          )}

          {/* Right: Stacked horizontal + vertical (poster) */}
          <div className="grid gap-10">
            {project.secondaryImages?.[2] && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => onZoom(project.secondaryImages![2])}
                className="group relative cursor-zoom-in overflow-hidden rounded-3xl shadow-md border border-zinc-100"
              >
                <img
                  src={project.secondaryImages[2]}
                  alt="Detail Top"
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-102"
                />
              </motion.div>
            )}
            {project.secondaryImages?.[3] && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onClick={() => onZoom(project.secondaryImages![3])}
                className="group relative cursor-zoom-in overflow-hidden rounded-3xl shadow-2xl"
              >
                <img
                  src={project.secondaryImages[3]}
                  alt="Poster"
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-102"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Refining Process Section - Section 4 */}
      <section className="bg-zinc-50/50 px-8 py-24 md:px-12">
        <div className="mb-20">
          <h3 className="text-3xl font-black text-black">细化过程</h3>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] block mt-1">
            REFINING
          </span>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "3D建模",
              subtitle: "3D MODELING",
              img: project.processImages?.[0],
            },
            {
              title: "渲染合成",
              subtitle: "RENDER COMPOSITION",
              img: project.processImages?.[1],
            },
            {
              title: "神奇的后期",
              subtitle: "MAGICAL LATE PERIOD",
              img: project.processImages?.[2],
            },
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onClick={() => phase.img && onZoom(phase.img)}
              className="group flex flex-col items-center cursor-zoom-in"
            >
              <div className="mb-8 w-full aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-200 shadow-md transition-all duration-700 group-hover:shadow-2xl">
                <img
                  src={phase.img}
                  alt={phase.title}
                  className="w-full h-full object-cover block transition-all duration-700 group-hover:scale-[1.03]"
                />
              </div>
              <div className="text-center">
                <h4 className="text-xl font-black text-zinc-900 mb-1">
                  {phase.title}
                </h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  {phase.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ShuffleText({ text }: { text: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-default inline-block relative"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block relative"
          animate={{
            y: isHovered ? [0, -8, 0] : 0,
            color: isHovered ? ["#000", "#4A90E2", "#000"] : "#000",
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.05,
            ease: [0.22, 1, 0.36, 1],
            repeat: isHovered ? Infinity : 0,
            repeatDelay: 1.5,
          }}
        >
          {char === " " ? "\u00A0" : char}
          {isHovered && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400 blur-sm"
            />
          )}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Interactive3DCard({
  src,
  title,
  subtitle,
  phase,
  themeColor,
  onZoom,
  onImageChange,
  onTextChange,
  aspectRatio = "2:3",
}: {
  key?: any;
  src: string;
  title: string;
  subtitle: string;
  phase: string;
  themeColor: string;
  onZoom: (img: string) => void;
  onImageChange?: (newSrc: string) => void;
  onTextChange?: (newTitle: string, newSubtitle: string, newPhase: string) => void;
  aspectRatio?: "2:3" | "16:9";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "url">("url");
  const [tempImageSrc, setTempImageSrc] = useState<string>(src);
  const [imageError, setImageError] = useState<boolean>(false);

  // States for copy text editing
  const [tempTitle, setTempTitle] = useState(title);
  const [tempSubtitle, setTempSubtitle] = useState(subtitle);
  const [tempPhase, setTempPhase] = useState(phase);

  // Check if admin is active (本人登录账号)
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('sharks_portfolio_admin_active') === 'true';

  // Sync copy text when props change
  React.useEffect(() => {
    setTempTitle(title);
    setTempSubtitle(subtitle);
    setTempPhase(phase);
  }, [title, subtitle, phase]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showEdit) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Coordinates relative to the center of card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Tilt angle calculations (max 12 degrees for super subtle interactive feel)
    const rX = -((mouseY / height) - 0.5) * 15;
    const rY = ((mouseX / width) - 0.5) * 15;
    const limit = 12;
    
    setRotateX(Math.max(-limit, Math.min(limit, rX)));
    setRotateY(Math.max(-limit, Math.min(limit, rY)));
    
    // Light glare coordinates inside card
    setGlowX((mouseX / width) * 100);
    setGlowY((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!showEdit) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempImageSrc(src);
    setInputUrl(src.startsWith("http") ? src : "");
    setImageError(false);
    setTempTitle(title);
    setTempSubtitle(subtitle);
    setTempPhase(phase);
    setShowEdit(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempImageSrc(event.target.result as string);
          setImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSelectFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleUrlChange = (val: string) => {
    setInputUrl(val);
    if (val.trim()) {
      setTempImageSrc(val.trim());
      setImageError(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempImageSrc.trim() && !imageError) {
      if (onImageChange) {
        onImageChange(tempImageSrc.trim());
      }
      if (onTextChange) {
        onTextChange(tempTitle.trim(), tempSubtitle.trim(), tempPhase.trim());
      }
      setShowEdit(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (showEdit) {
      e.stopPropagation();
      return;
    }
    // Zoom in on artwork
    onZoom(src);
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        className={`group relative ${aspectRatio === "16:9" ? "aspect-video" : "aspect-[2/3]"} w-full overflow-hidden rounded-2xl bg-white/5 p-[6px] transition-all cursor-zoom-in select-none`}
        style={{
          boxShadow: isHovered
            ? "0 15px 35px -8px rgba(0, 0, 0, 0.12), 0 5px 12px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.06)"
            : "0 4px 10px -4px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0,0,0,0.03)",
          transform: isHovered
            ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`
            : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered ? "none" : "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {/* Holographic Laser Layer 1 - Rainbow gradient shifts with mouse coords inside card */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300 z-10"
          style={{
            backgroundImage: `linear-gradient(${115 + (glowX - 50) * 0.4}deg, 
              rgba(255, 0, 128, 0.08) 0%, 
              rgba(120, 0, 255, 0.12) 15%, 
              rgba(0, 190, 255, 0.12) 30%, 
              rgba(0, 255, 128, 0.08) 50%, 
              rgba(255, 230, 0, 0.12) 70%, 
              rgba(255, 0, 128, 0.08) 100%)`,
            backgroundSize: "200% 200%",
            backgroundPosition: `${glowX}% ${glowY}%`,
            mixBlendMode: "color-dodge",
            opacity: isHovered ? 0.65 : 0.1,
          }}
        />

        {/* Holographic Laser Layer 2 - Radial light sheen */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300 z-15"
          style={{
            background: `radial-gradient(circle 140px at ${glowX}% ${glowY}%, 
              rgba(255, 255, 255, 0.45) 0%, 
              rgba(240, 150, 255, 0.12) 40%, 
              transparent 100%)`,
            mixBlendMode: "overlay",
            opacity: isHovered ? 0.5 : 0.05,
          }}
        />

        {/* Minimalist Transparent Card Sleeve Outer Border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none border border-zinc-200/40"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.25) 100%)`,
            boxShadow: "inset 0 1px 1.5px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(0,0,0,0.02)",
          }}
        />

        {/* Actual Image container with 2:3 ratio (Fits nicely inside sleeve border padding, NO TEXT/COPY ON CARD) */}
        <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-zinc-50 border border-zinc-200/35 flex items-center justify-center z-20 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <img
            src={src}
            alt="Art toy piece"
            className="w-full h-full object-cover select-none transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          
          {/* Transparent glossy overlay inside the image container itself */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-22" />
        </div>

        {/* Show edit tools when update callbacks are present and user is admin */}
        {isAdmin && (onImageChange || onTextChange) && (
          <>
            {/* If NOT actively editing, show hover edit option */}
            {!showEdit && isHovered && (
              <div className="absolute inset-2 bg-black/40 backdrop-blur-[2px] rounded-[10px] opacity-100 transition-opacity duration-205 flex flex-col items-center justify-center gap-2 z-30 pointer-events-auto">
                <button
                  onClick={handleOpenEdit}
                  className="px-3 py-1.5 rounded-full bg-white text-zinc-90 w text-[10px] font-black font-mono tracking-widest shadow-md hover:bg-zinc-100 transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#FF4D4F]" />
                  EDIT CARD / 编辑文本与图
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Card projection container */}

      {/* Large Advanced Replacement Modal Viewport-Level Overlay */}
      <AnimatePresence>
        {showEdit && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEdit(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal layout center card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-zinc-90 w border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-[210] text-white"
            >
              {/* Left Column: Spacious Live Holographic Sleeve Projection */}
              <div className="w-full md:w-[45%] bg-zinc-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
                <div>
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-semibold font-mono tracking-widest uppercase mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF4D4F] animate-pulse" />
                    Interactive Card projection / 镭射渲染投影
                  </div>
                  <h3 className="text-lg font-black font-mono tracking-wide text-zinc-100 uppercase">
                    {tempTitle || "ART TOY EDITION"}
                  </h3>
                  <p className="text-xs text-zinc-500 font-mono tracking-wider mt-0.5">
                    {tempPhase || "PHASE_X"} // 2:3 VIRTUAL TILT CAP
                  </p>
                </div>

                {/* Simulated Interactive Card Preview Frame */}
                <div className={`my-6 ${aspectRatio === "16:9" ? "max-w-xs md:max-w-sm" : "max-w-[210px]"} mx-auto w-full relative group/projection cursor-default`}>
                  <div 
                    className={`relative ${aspectRatio === "16:9" ? "aspect-video" : "aspect-[2/3]"} w-full rounded-2xl bg-zinc-900 overflow-hidden p-[5px] border border-zinc-800 shadow-xl transition-all duration-300`}
                    style={{
                      boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1) inset"
                    }}
                  >
                    {/* Inner image frame */}
                    <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-zinc-950 flex items-center justify-center">
                      {!imageError ? (
                        <img
                          src={tempImageSrc}
                          alt="Projection Preview"
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
                          <X className="w-8 h-8 text-[#FF4D4F] mb-2" />
                          <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                            ERROR LOADING IMAGE
                          </span>
                        </div>
                      )}

                      {/* Holographic Laser Glow Layer on Projection Preview */}
                      <div
                        className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-50"
                        style={{
                          backgroundImage: "linear-gradient(135deg, rgba(255,0,128,0.15) 0%, rgba(0,190,255,0.15) 50%, rgba(255,230,0,0.15) 100%)",
                          backgroundSize: "200% 200%",
                        }}
                      />
                    </div>

                    {/* Standard Card Sleeve Border overlay */}
                    <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
                  </div>

                  {/* Indicator badge */}
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF4D4F] text-white text-[8px] font-black font-mono px-2 py-0.5 rounded tracking-widest shadow-lg">
                    LIVE PREVIEW
                  </span>
                </div>

                {/* Subtitle helper */}
                <div className="text-[10px] font-mono text-zinc-500 leading-relaxed text-center md:text-left">
                  {aspectRatio === "16:9"
                    ? "镭射卡套已自动适配 16:9 比例宽画幅构图，聚焦于宏大场景艺术细节。"
                    : "镭射卡套已自动适配 2:3 纵向构图，移除了一切文字，聚焦于角色雕琢细节。"}
                </div>
              </div>

              {/* Right Column: Advanced Configuration Editor Form */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between bg-zinc-900/60 backdrop-blur-md">
                
                {/* Header */}
                <div className="flex items-start justify-between border-b border-zinc-800 pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold font-mono tracking-wide text-zinc-100">IMAGE REPLACEMENT</h2>
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[#FF4D4F] uppercase">
                      Admin Control Panel // 管理员卡片控制
                    </span>
                  </div>
                  <button
                    onClick={() => setShowEdit(false)}
                    className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Tabs Select */}
                <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 mb-6 font-mono">
                  <button
                    type="button"
                    onClick={() => setActiveTab("url")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black tracking-widest transition-all ${
                      activeTab === "url"
                        ? "bg-[#FF4D4F] text-white shadow-lg shadow-[#FF4D4F]/20"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    PASTE URL / 网页链接
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("file")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black tracking-widest transition-all ${
                      activeTab === "file"
                        ? "bg-[#FF4D4F] text-white shadow-lg shadow-[#FF4D4F]/20"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    LOCAL FILE / 本地文件
                  </button>
                </div>

                {/* Tab Form Containers */}
                <form onSubmit={handleSave} className="flex-grow flex flex-col justify-center gap-4 mb-6">
                  {activeTab === "url" ? (
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        IMAGE WEB ADDRESS / 图片网页地址
                      </label>
                      <div className="relative">
                        <textarea
                          placeholder="Please paste the direct image URL here... (e.g. https://domain.com/toy.png)"
                          value={inputUrl}
                          onChange={(e) => handleUrlChange(e.target.value)}
                          className="w-full h-24 px-4 py-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4D4F] focus:ring-1 focus:ring-[#FF4D4F]/30 text-zinc-200 placeholder-zinc-600 resize-none transition-all leading-relaxed"
                          required
                        />
                        {inputUrl && (
                          <button
                            type="button"
                            onClick={() => handleUrlChange("")}
                            className="absolute bottom-3 right-3 text-[10px] font-mono tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
                          >
                            CLEAR
                          </button>
                        )}
                      </div>
                      <p className="text-[10.5px] text-zinc-500 font-sans leading-relaxed">
                        支持 jpg, png, webp 等直连艺术图源格式。粘贴后左侧卡套将会自动触发解析，验证加载渲染状态。
                      </p>
                      {imageError && inputUrl.trim() && (
                        <div className="bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 text-[#FF4D4F] p-3 rounded-lg text-[11px] font-mono leading-relaxed mt-1 flex items-start gap-2">
                          <span className="font-bold">⚠️ Warning:</span>
                          <span>此图片地址似乎无效或无法加载，请确认地址无误且支持跨域访问。</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                        SELECT LOCAL IMAGE FILE / 选择本地图像文件
                      </label>
                      <div 
                        onClick={triggerSelectFile}
                        className="py-12 border border-dashed border-zinc-700 hover:border-[#FF4D4F] rounded-2xl bg-zinc-950/60 hover:bg-zinc-950 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group/upload"
                      >
                        <div className="p-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover/upload:text-[#FF4D4F] group-hover/upload:border-[#FF4D4F]/30 transition-all">
                          <Upload className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="text-center">
                          <span className="text-xs font-black font-mono tracking-widest text-zinc-300 uppercase block">
                            SELECT LOCAL ARTWORK
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                            PNG, JPG, WEBP formats supported
                          </span>
                        </div>
                      </div>
                      <p className="text-[10.5px] text-zinc-500 font-sans leading-relaxed">
                        文件将进行本端数据流转换（Data URL）保存，保障数据完全保存在您的这台浏览器容器进程中。
                      </p>
                    </div>
                  )}

                  {/* CUSTOMIZE CARD TEXT / 卡片文案编辑 */}
                  <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-zinc-800">
                    <label className="text-xs font-mono font-bold tracking-widest text-[#FF4D4F] uppercase">
                      CARD COPYWRITING / 卡片文案内容
                    </label>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                          Card Title / 卡片主标题
                        </span>
                        <input
                          type="text"
                          placeholder="01 :: MODERN ART TOY"
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-[#FF4D4F] text-zinc-200"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                            Card Subtitle / 卡片副标题
                          </span>
                          <input
                            type="text"
                            placeholder="LIMITED VINYL FIGURINE"
                            value={tempSubtitle}
                            onChange={(e) => setTempSubtitle(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-[#FF4D4F] text-zinc-200"
                            required
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black">
                            Phase Tag / 阶段标识
                          </span>
                          <input
                            type="text"
                            placeholder="PHASE_01 // ARCHITECTURE"
                            value={tempPhase}
                            onChange={(e) => setTempPhase(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg focus:outline-none focus:border-[#FF4D4F] text-zinc-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit buttons block */}
                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowEdit(false)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 text-xs font-bold font-mono tracking-widest transition-all"
                    >
                      CANCEL / 取消
                    </button>
                    <button
                      type="submit"
                      disabled={imageError || !tempImageSrc || (tempImageSrc === src && tempTitle === title && tempSubtitle === subtitle && tempPhase === phase)}
                      className={`px-6 py-2.5 rounded-xl text-xs font-black font-mono tracking-widest transition-all flex items-center gap-2 ${
                        imageError || !tempImageSrc || (tempImageSrc === src && tempTitle === title && tempSubtitle === subtitle && tempPhase === phase)
                          ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/60"
                          : "bg-[#FF4D4F] hover:bg-[#FF4D4F]/90 text-white shadow-lg shadow-[#FF4D4F]/30 hover:scale-[1.02] active:scale-95"
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      SAVE CONFIG / 应用修改
                    </button>
                  </div>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DynamicLayout({
  project,
  onZoom,
  onUpdateProject,
}: {
  project: Project;
  onZoom: (img: string) => void;
  onUpdateProject?: (updated: Project) => void;
}) {
  const [showKVEdit, setShowKVEdit] = useState(false);
  const [tempKVImageSrc, setTempKVImageSrc] = useState(project.imageUrl);
  const [kvInputUrl, setKvInputUrl] = useState(project.imageUrl.startsWith("http") ? project.imageUrl : "");
  const [kvImageError, setKvImageError] = useState(false);
  const [kvActiveTab, setKvActiveTab] = useState<"file" | "url">("url");
  const kvFileInputRef = useRef<HTMLInputElement>(null);

  // Check if admin is active (本人登录账号)
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('sharks_portfolio_admin_active') === 'true';

  // States for general project details modification
  const [showProjectEdit, setShowProjectEdit] = useState(false);
  const [tempProjectTitle, setTempProjectTitle] = useState(project.title);
  const [tempProjectSubtitle, setTempProjectSubtitle] = useState(project.subtitle);
  const [tempProjectDesc, setTempProjectDesc] = useState(project.description);
  const [tempProjectTags, setTempProjectTags] = useState(project.tags.join(", "));

  // Sync state if project changes
  React.useEffect(() => {
    setTempKVImageSrc(project.imageUrl);
    setKvInputUrl(project.imageUrl.startsWith("http") ? project.imageUrl : "");
    setKvImageError(false);
    
    setTempProjectTitle(project.title);
    setTempProjectSubtitle(project.subtitle);
    setTempProjectDesc(project.description);
    setTempProjectTags(project.tags.join(", "));
  }, [project.imageUrl, project.title, project.subtitle, project.description, project.tags]);

  const handleKVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempKVImageSrc(event.target.result as string);
          setKvImageError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSelectKVFile = () => {
    kvFileInputRef.current?.click();
  };

  const handleKVUrlChange = (val: string) => {
    setKvInputUrl(val);
    if (val.trim()) {
      setTempKVImageSrc(val.trim());
      setKvImageError(false);
    }
  };

  const handleKVSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempKVImageSrc.trim() && !kvImageError && onUpdateProject) {
      onUpdateProject({
        ...project,
        imageUrl: tempKVImageSrc.trim(),
      });
      setShowKVEdit(false);
    }
  };

  if (project.title.includes("转转熊") || project.id === "11" || project.id === "12") {
    const themeColor = project.themeColor || "#FF4D4F";
    const isAdmin = typeof window !== 'undefined' && localStorage.getItem('sharks_portfolio_admin_active') === 'true';
    
    // Load state from local storage or default cards
    const defaultCards = project.id === "12" ? project.secondaryImages.slice(1, 9).map((src, i) => ({
      src,
      title: `0${i + 1} :: SECTION`,
      subtitle: "DESIGN PROCESS",
      phase: `STAGE_0${i + 1}`
    })) : [
      {
        src: "/images/bear-art-toy-1.png",
        title: "01 :: MODERN ART TOY",
        subtitle: "LIMITED VINYL FIGURINE",
        phase: "PHASE_01 // ARCHITECTURE"
      },
      {
        src: "/images/bear-skate-2.png",
        title: "02 :: STREET SKATE CRUISER",
        subtitle: "OUTDOOR ACTIVE WEAR",
        phase: "PHASE_02 // ACTION"
      },
      {
        src: "/images/bear-cyber-3.png",
        title: "03 :: VIRTUAL NEO VISOR",
        subtitle: "TECH GLOWING GLASSES",
        phase: "PHASE_03 // SCIENCE"
      },
      {
        src: "/images/bear-street-4.png",
        title: "04 :: HIP-HOP DOWNTOWN",
        subtitle: "OVERSIZED GRAFFITI STYLE",
        phase: "PHASE_04 // CULTURE"
      },
      {
        src: "/images/bear-cyber-3.png",
        title: "05 :: CYBERPUNK AURORA SPECIAL",
        subtitle: "LASER HEADPHONE VISOR",
        phase: "PHASE_05 // IMMERSIVE"
      },
      {
        src: "/images/bear-art-toy-1.png",
        title: "06 :: METALLIC CHROME EDITION",
        subtitle: "PLATINUM SERIES PLASTIC",
        phase: "PHASE_06 // PREMIUM"
      },
      {
        src: "/images/bear-street-4.png",
        title: "07 :: TOKYO POP-CULTURE WAVE",
        subtitle: "STREET CULTURE GANG",
        phase: "PHASE_07 // CORE"
      },
      {
        src: "/images/bear-skate-2.png",
        title: "08 :: CALIFORNIA SUNSET DRIFT",
        subtitle: "RETRO CASUAL LIFESTYLE",
        phase: "PHASE_08 // LEISURE"
      }
    ];

    const defaultWideCards = project.id === "12" ? project.secondaryImages.slice(9).map((src, i) => ({
      src,
      title: `MOBILE_0${i + 1} :: UI SHOWCASE`,
      subtitle: "INTERFACE",
      phase: `SCENE_0${i + 1} // MOBILE`
    })) : [
      {
        src: "/images/zhuanzhuan-bear-ip.png",
        title: "09 :: SHIBUYA OVERTAKE",
        subtitle: "URBAN BRAND INTEGRATION",
        phase: "SCENE_01 // ATMOSPHERE"
      },
      {
        src: "/images/spring-travel-campaign.png",
        title: "10 :: FUTURISTIC TECH LAB",
        subtitle: "HARD-SURFACE CYBERPUNK ASSEMBLY",
        phase: "SCENE_02 // ENVIRON"
      }
    ];

    const [cards, setCards] = useState(() => {
      const cached = localStorage.getItem("zhuanzhuan_bear_custom_cards");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error("Failed to parse cached cards:", e);
        }
      }
      return defaultCards;
    });

    const [wideCards, setWideCards] = useState(() => {
      const cached = localStorage.getItem("zhuanzhuan_bear_custom_wide_cards");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error("Failed to parse cached wide cards:", e);
        }
      }
      return defaultWideCards;
    });

    const handleReplaceImage = (index: number, newSrc: string) => {
      const updated = [...cards];
      updated[index] = { ...updated[index], src: newSrc };
      setCards(updated);
      try {
        localStorage.setItem("zhuanzhuan_bear_custom_cards", JSON.stringify(updated));
      } catch (err) {
        console.error("Local storage sync failed:", err);
      }
    };

    const handleReplaceWideImage = (index: number, newSrc: string) => {
      const updated = [...wideCards];
      updated[index] = { ...updated[index], src: newSrc };
      setWideCards(updated);
      try {
        localStorage.setItem("zhuanzhuan_bear_custom_wide_cards", JSON.stringify(updated));
      } catch (err) {
        console.error("Local storage wide cards sync failed:", err);
      }
    };

    const handleUpdateCardText = (index: number, newTitle: string, newSubtitle: string, newPhase: string) => {
      const updated = [...cards];
      updated[index] = { ...updated[index], title: newTitle, subtitle: newSubtitle, phase: newPhase };
      setCards(updated);
      try {
        localStorage.setItem("zhuanzhuan_bear_custom_cards", JSON.stringify(updated));
      } catch (err) {
        console.error("Local storage sync failed:", err);
      }
    };

    const handleUpdateWideCardText = (index: number, newTitle: string, newSubtitle: string, newPhase: string) => {
      const updated = [...wideCards];
      updated[index] = { ...updated[index], title: newTitle, subtitle: newSubtitle, phase: newPhase };
      setWideCards(updated);
      try {
        localStorage.setItem("zhuanzhuan_bear_custom_wide_cards", JSON.stringify(updated));
      } catch (err) {
        console.error("Local storage wide cards sync failed:", err);
      }
    };

    const handleResetCards = () => {
      if (window.confirm("确定要恢复默认作品展示图吗？")) {
        setCards(defaultCards);
        setWideCards(defaultWideCards);
        localStorage.removeItem("zhuanzhuan_bear_custom_cards");
        localStorage.removeItem("zhuanzhuan_bear_custom_wide_cards");
      }
    };

    return (
      <div className="bg-white text-zinc-900 min-h-full overflow-hidden relative">
        {/* Decorative Grid overlays */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Header Section */}
        <section className="relative px-8 pt-32 pb-20 md:px-16 lg:px-24">
          <motion.div
            animate={{ y: [0, -25, 0], rotate: 120 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[10%] w-16 h-16 border border-zinc-200 bg-zinc-50 rounded-2xl hidden lg:block shadow-sm"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: -45 }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 left-[8%] w-10 h-10 border border-[#FF4D4F]/20 rounded-full bg-[#FF4D4F]/5 hidden lg:block"
          />

          {/* Large dynamic glowing mesh behind header */}
          <div 
            className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-10 animate-pulse duration-5000"
            style={{ backgroundColor: themeColor }}
          />

          <div className="relative max-w-6xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    className="h-1 rounded-full bg-[#FF4D4F]"
                  />
                  <span className="text-xs font-mono font-black tracking-[0.4em] text-zinc-400 uppercase">
                    ACTIVE CASE STUDY • IP DESIGN
                  </span>
                </div>

                {isAdmin && onUpdateProject && (
                  <button
                    onClick={() => {
                      setTempProjectTitle(project.title);
                      setTempProjectSubtitle(project.subtitle);
                      setTempProjectDesc(project.description);
                      setTempProjectTags(project.tags.join(", "));
                      setShowProjectEdit(true);
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 hover:bg-[#FF4D4F]/5 text-zinc-650 hover:text-zinc-900 transition-all font-mono text-[10px] font-black tracking-widest uppercase shadow-xs hover:scale-105"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#FF4D4F]" />
                    EDIT PROJECT COPY / 编辑项目文案
                  </button>
                )}
              </div>

              <h2 className="text-6xl font-black tracking-tighter text-zinc-950 md:text-8xl lg:text-9xl mb-8 leading-[0.9] relative z-10">
                <ShuffleText text={project.title} />
              </h2>

              <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start mt-12 bg-white rounded-3xl p-8 border border-zinc-100 shadow-sm">
                <div className="space-y-4">
                  <p className="text-xl font-bold text-zinc-900 tracking-tight">
                    {project.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold rounded-full uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative pl-0 lg:pl-12 border-l-0 lg:border-l border-zinc-100">
                  <p className="text-base font-normal text-zinc-600 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 16:9 Master Key Visual (KV) */}
        <section className="px-8 pb-16 md:px-16 lg:px-24">
          {/* Decorative Pattern */}
          <div className="mb-8 flex justify-center gap-2 items-center opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-video overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-200"
          >
            <img
              src={project.imageUrl}
              alt="Mascot KV"
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 filter brightness-100 cursor-zoom-in"
              onClick={() => onZoom(project.imageUrl)}
              referrerPolicy="no-referrer"
            />
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Hover overlay with Edit & Zoom buttons */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 z-30 pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTempKVImageSrc(project.imageUrl);
                      setKvInputUrl(project.imageUrl.startsWith("http") ? project.imageUrl : "");
                      setKvImageError(false);
                      setShowKVEdit(true);
                    }}
                    className="px-4 py-2 rounded-full bg-white text-zinc-90 w text-xs font-black font-mono tracking-widest shadow-md hover:bg-zinc-100 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4 text-[#FF4D4F]" />
                    REPLACE KEY VISUAL / 替换主视觉图
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* 3:2 Vertical composition showcase in 2 rows of 4 cards */}
        <section className="px-8 pb-10 md:px-16 lg:px-24">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {cards.map((card, idx) => (
              <Interactive3DCard
                key={idx}
                src={card.src}
                title={card.title}
                subtitle={card.subtitle}
                phase={card.phase}
                themeColor={themeColor}
                onZoom={onZoom}
                onImageChange={(newSrc) => handleReplaceImage(idx, newSrc)}
                onTextChange={(newTitle, newSubtitle, newPhase) => handleUpdateCardText(idx, newTitle, newSubtitle, newPhase)}
              />
            ))}
          </div>
        </section>

        {/* 16:9 Widescreen Scenic Composition Section / 品牌宽屏三维场景展示 */}
        <section className="px-8 pb-32 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {wideCards.map((card, idx) => (
              <Interactive3DCard
                key={`wide-${idx}`}
                src={card.src}
                title={card.title}
                subtitle={card.subtitle}
                phase={card.phase}
                themeColor={themeColor}
                onZoom={onZoom}
                onImageChange={(newSrc) => handleReplaceWideImage(idx, newSrc)}
                onTextChange={(newTitle, newSubtitle, newPhase) => handleUpdateWideCardText(idx, newTitle, newSubtitle, newPhase)}
                aspectRatio="16:9"
              />
            ))}
          </div>
        </section>



        {/* Large Advanced Replacement Modal Viewport-Level Overlay for 16:9 Key Visual */}
        <AnimatePresence>
          {showKVEdit && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              {/* Dark blur backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowKVEdit(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              {/* Modal layout center card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-4xl bg-zinc-90 w border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-[210] text-white"
              >
                {/* Left Column: Spacious Live Holographic KV Projection */}
                <div className="w-full md:w-[45%] bg-zinc-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-semibold font-mono tracking-widest uppercase mb-3">
                      <span className="w-2 h-2 rounded-full bg-[#FF4D4F] animate-pulse" />
                      16:9 KV Projection / 16:9 主图渲染投影
                    </div>
                    <h3 className="text-lg font-black font-mono tracking-wide text-zinc-100 uppercase">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono tracking-wider mt-0.5">
                      {project.subtitle} // MASTER KEY VISUAL
                    </p>
                  </div>

                  {/* Simulated Interactive KV Preview Frame (16:9 aspect ratio) */}
                  <div className="my-6 max-w-sm mx-auto w-full relative group/projection cursor-default">
                    <div 
                      className="relative aspect-video w-full rounded-2xl bg-zinc-900 overflow-hidden p-[5px] border border-zinc-800 shadow-xl transition-all duration-300"
                      style={{
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.1) inset"
                      }}
                    >
                      {/* Inner image frame */}
                      <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-zinc-950 flex items-center justify-center">
                        {!kvImageError ? (
                          <img
                            src={tempKVImageSrc}
                            alt="Mascot KV Preview"
                            className="w-full h-full object-cover"
                            onError={() => setKvImageError(true)}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
                            <X className="w-8 h-8 text-[#FF4D4F] mb-2" />
                            <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
                              ERROR LOADING IMAGE
                            </span>
                          </div>
                        )}

                        {/* Holographic Laser Glow Layer on Projection Preview */}
                        <div
                          className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-50"
                          style={{
                            backgroundImage: "linear-gradient(135deg, rgba(255,0,128,0.15) 0%, rgba(0,190,255,0.15) 50%, rgba(255,230,0,0.15) 100%)",
                            backgroundSize: "200% 200%",
                          }}
                        />
                      </div>

                      {/* Standard Card Sleeve Border overlay */}
                      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
                    </div>

                    {/* Indicator badge */}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FF4D4F] text-white text-[8px] font-black font-mono px-2 py-0.5 rounded tracking-widest shadow-lg">
                      16:9 LIVE PREVIEW
                    </span>
                  </div>

                  {/* Subtitle helper */}
                  <div className="text-[10px] font-mono text-zinc-500 leading-relaxed text-center md:text-left">
                    主视觉展示幕为 16:9 的宽屏幕比例设计，用于在案例顶部展现高度沉浸的品牌宏观故事。
                  </div>
                </div>

                {/* Right Column: Advanced Configuration Editor Form */}
                <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between bg-zinc-900/60 backdrop-blur-md">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-zinc-800 pb-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold font-mono tracking-wide text-zinc-100">替换主视觉背景 / KEY VISUAL</h2>
                      <span className="text-[10px] font-bold font-mono tracking-widest text-[#FF4D4F] uppercase">
                        Admin Control Panel // 16:9 主图配置面板
                      </span>
                    </div>
                    <button
                      onClick={() => setShowKVEdit(false)}
                      className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tabs Select */}
                  <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 mb-6 font-mono">
                    <button
                      type="button"
                      onClick={() => setKvActiveTab("url")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black tracking-widest transition-all ${
                        kvActiveTab === "url"
                          ? "bg-[#FF4D4F] text-white shadow-lg shadow-[#FF4D4F]/20"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      }`}
                    >
                      <Link className="w-3.5 h-3.5" />
                      PASTE URL / 网页链接
                    </button>
                    <button
                      type="button"
                      onClick={() => setKvActiveTab("file")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black tracking-widest transition-all ${
                        kvActiveTab === "file"
                          ? "bg-[#FF4D4F] text-white shadow-lg shadow-[#FF4D4F]/20"
                          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      LOCAL FILE / 本地文件
                    </button>
                  </div>

                  {/* Tab Form Containers */}
                  <form onSubmit={handleKVSave} className="flex-grow flex flex-col justify-center gap-4 mb-6">
                    {kvActiveTab === "url" ? (
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                          IMAGE WEB ADDRESS / 图片网页地址
                        </label>
                        <div className="relative">
                          <textarea
                            placeholder="Please paste the 16:9 direct image URL here..."
                            value={kvInputUrl}
                            onChange={(e) => handleKVUrlChange(e.target.value)}
                            className="w-full h-24 px-4 py-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4D4F] focus:ring-1 focus:ring-[#FF4D4F]/30 text-zinc-200 placeholder-zinc-600 resize-none transition-all leading-relaxed"
                            required
                          />
                          {kvInputUrl && (
                            <button
                              type="button"
                              onClick={() => handleKVUrlChange("")}
                              className="absolute bottom-3 right-3 text-[10px] font-mono tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                              CLEAR
                            </button>
                          )}
                        </div>
                        <p className="text-[10.5px] text-zinc-500 font-sans leading-relaxed">
                          支持 jpg, png, webp 等 16:9 高清比例直连艺术图源格式。粘贴后左侧卡套将会自动触发解析和缩放适配。
                        </p>
                        {kvImageError && kvInputUrl.trim() && (
                          <div className="bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 text-[#FF4D4F] p-3 rounded-lg text-[11px] font-mono leading-relaxed mt-1 flex items-start gap-2">
                            <span className="font-bold">⚠️ Warning:</span>
                            <span>此图片地址似乎无效或无法加载，请确认地址无误且支持跨域访问。</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <label className="text-xs font-mono font-bold tracking-widest text-zinc-400 uppercase">
                          SELECT LOCAL IMAGE FILE / 选择本地图像文件
                        </label>
                        <div 
                          onClick={triggerSelectKVFile}
                          className="py-12 border border-dashed border-zinc-700 hover:border-[#FF4D4F] rounded-2xl bg-zinc-950/60 hover:bg-zinc-950 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group/upload"
                        >
                          <div className="p-3.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover/upload:text-[#FF4D4F] group-hover/upload:border-[#FF4D4F]/30 transition-all">
                            <Upload className="w-6 h-6 animate-pulse" />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-black font-mono tracking-widest text-zinc-300 uppercase block">
                              SELECT LOCAL KV ARTWORK
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                              PNG, JPG, WEBP formats supported (16:9 recommended)
                            </span>
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={kvFileInputRef}
                          onChange={handleKVFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <p className="text-[10.5px] text-zinc-500 font-sans leading-relaxed">
                          文件将进行本端数据流转换（Data URL）保存，保障数据完全保存在您的这台浏览器容器进程中。
                        </p>
                      </div>
                    )}

                    {/* Submit buttons block */}
                    <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowKVEdit(false)}
                        className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 text-xs font-bold font-mono tracking-widest transition-all"
                      >
                        CANCEL / 取消
                      </button>
                      <button
                        type="submit"
                        disabled={kvImageError || !tempKVImageSrc || tempKVImageSrc === project.imageUrl}
                        className={`px-6 py-2.5 rounded-xl text-xs font-black font-mono tracking-widest transition-all flex items-center gap-2 ${
                          kvImageError || !tempKVImageSrc || tempKVImageSrc === project.imageUrl
                            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/60"
                            : "bg-[#FF4D4F] hover:bg-[#FF4D4F]/90 text-white shadow-lg shadow-[#FF4D4F]/30 hover:scale-[1.02] active:scale-95"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        SAVE CONFIG / 应用修改
                      </button>
                    </div>
                  </form>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Project Copywriting Editor Modal / 项目文案全域编辑器 */}
        <AnimatePresence>
          {showProjectEdit && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
              {/* Dark blur backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProjectEdit(false)}
                className="fixed inset-0 bg-black/85 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-2xl bg-zinc-90 w border border-zinc-805 rounded-3xl overflow-hidden shadow-2xl z-[210] text-white p-6 md:p-8"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-zinc-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold font-mono tracking-wide text-zinc-100">编辑项目基本信息 / PROJECT INFO EDIT</h2>
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[#FF4D4F] uppercase">
                      ACTIVE WRITING CORNER // 实时文案定制
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowProjectEdit(false)}
                    className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form fields */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (onUpdateProject) {
                      onUpdateProject({
                        ...project,
                        title: tempProjectTitle.trim(),
                        subtitle: tempProjectSubtitle.trim(),
                        description: tempProjectDesc.trim(),
                        tags: tempProjectTags.split(",").map(t => t.trim()).filter(Boolean),
                      });
                      setShowProjectEdit(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                      Project Title / 项目主标题
                    </label>
                    <input
                      type="text"
                      value={tempProjectTitle}
                      onChange={(e) => setTempProjectTitle(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4D4F] text-zinc-105"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                      Project Subtitle / 项目副标题
                    </label>
                    <input
                      type="text"
                      value={tempProjectSubtitle}
                      onChange={(e) => setTempProjectSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4D4F] text-zinc-105"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                      Project Tags / 项目标签 (英文逗号分隔)
                    </label>
                    <input
                      type="text"
                      value={tempProjectTags}
                      onChange={(e) => setTempProjectTags(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4D4F] text-zinc-105"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest">
                      Project Description / 项目详描
                    </label>
                    <textarea
                      value={tempProjectDesc}
                      onChange={(e) => setTempProjectDesc(e.target.value)}
                      className="w-full h-32 px-4 py-3 text-xs bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:border-[#FF4D4F] text-zinc-105 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowProjectEdit(false)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 text-xs font-bold font-mono tracking-widest transition-all"
                    >
                      CANCEL / 取消
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-xs font-black font-mono tracking-widest bg-[#FF4D4F] hover:bg-[#FF4D4F]/90 text-white shadow-lg shadow-[#FF4D4F]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      SAVE DETAILS / 确认修改
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-full overflow-hidden">
      {/* Header Section */}
      <section className="relative px-8 pt-32 pb-20 md:px-16 lg:px-24">
        {/* Floating geometric decorations */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: 45 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-[15%] w-12 h-12 border-4 border-zinc-100 rounded-lg hidden lg:block"
        />
        <motion.div
          animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[10%] w-6 h-6 bg-zinc-50 rounded-full hidden lg:block"
        />

        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-[0.03] pointer-events-none select-none">
          <span className="text-[30rem] font-black tracking-tighter leading-none">
            IP
          </span>
        </div>

        {/* Animated accent blob */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
          style={{ backgroundColor: project.themeColor || "#4A90E2" }}
        />

        <div className="relative max-w-6xl">
          {/* Scanline decoration */}
          <motion.div
            animate={{ left: ["-100%", "100%"] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 5,
            }}
            className="absolute top-1/3 left-0 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: 60 }}
                className="h-1 rounded-full"
                style={{ backgroundColor: project.themeColor || "#4A90E2" }}
              />
              <span className="text-sm font-black tracking-[0.4em] text-zinc-400 uppercase">
                Case Study • Character
              </span>
            </div>

            <h2 className="text-7xl font-black tracking-tighter text-black md:text-9xl lg:text-[11rem] mb-12 leading-[0.85] relative z-10">
              <ShuffleText text={project.title} />
            </h2>

            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
              <div className="space-y-6">
                <p className="text-2xl font-bold text-zinc-800 tracking-tight leading-tight">
                  {project.subtitle}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-full uppercase tracking-wider transition-colors hover:bg-zinc-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  className="absolute -left-6 top-0 w-[px] bg-zinc-100"
                  style={{ width: "2px" }}
                />
                <p className="text-xl font-medium text-zinc-500 leading-relaxed whitespace-pre-line first-letter:text-4xl first-letter:font-black first-letter:text-zinc-900 first-letter:mr-1">
                  {project.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Hero Horizontal - 16:9 */}
      <section className="px-8 pb-12 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onZoom(project.imageUrl)}
          className="group relative aspect-video cursor-zoom-in overflow-hidden rounded-3xl shadow-2xl border border-zinc-100"
        >
          <img
            src={project.imageUrl}
            alt="Hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>
      </section>

      {/* Draft & Concept Showcase - REPLACING Section 3 */}
      <section className="px-8 pb-32 md:px-16 lg:px-24">
        <div className="relative p-8 md:p-12 bg-zinc-50/50 rounded-[4rem] border border-zinc-100/80 overflow-hidden">
          <div className="grid gap-12 lg:grid-cols-3 relative z-10">
            {project.secondaryImages?.slice(1, 4).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col"
              >
                {/* Image Container with Labeling */}
                <div className="relative mb-6">
                  <div className="absolute -top-3 -left-3 w-6 h-6 border-l border-t border-zinc-300 pointer-events-none" />
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r border-b border-zinc-300 pointer-events-none" />

                  <div
                    onClick={() => onZoom(img)}
                    className="relative aspect-video cursor-zoom-in overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-zinc-200 border border-zinc-100"
                  >
                    <img
                      src={img}
                      alt={`Draft ${i}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                </div>

                {/* Sub-labels */}
                <div className="px-1 flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-black text-zinc-900 uppercase">
                      Phase_0{i + 1}
                    </span>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {["草图", "白膜", "彩绘"][i]}
                    </span>
                  </div>
                  <div className="h-8 w-8 flex items-center justify-center rounded-full border border-zinc-100 text-[10px] font-mono font-bold text-zinc-800 bg-white">
                    {i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Coordinate Decor */}
          <div className="mt-20 flex items-center gap-6">
            <div className="h-[1px] flex-grow bg-zinc-200/50" />
            <div className="flex gap-4">
              <span className="text-[9px] font-mono text-zinc-300 uppercase leading-none mt-1">
                X: 1920px
              </span>
              <span className="text-[9px] font-mono text-zinc-300 uppercase leading-none mt-1">
                Y: 1080px
              </span>
              <span className="text-[9px] font-mono text-zinc-300 uppercase leading-none mt-1">
                Z: 001pt
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* IP Showcase Lineup - NEW SECTION */}
      {project.secondaryImages?.[5] && (
        <section className="px-8 pb-32 md:px-16 lg:px-24">
          <div className="relative w-full aspect-[2/1] md:aspect-[1.8/1] bg-white rounded-[3rem] overflow-hidden shadow-[inset_0_0_150px_rgba(0,0,0,0.03)] border border-zinc-100 group">
            {/* Background Line-Art / Blueprint Pattern - FULL AREA */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.img
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.08, 0.12, 0.08],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                src={project.secondaryImages[4]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-200 brightness-150"
              />

              {/* Grid Lines Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />
            </div>

            {/* Tech UI Elements */}
            <div className="absolute top-12 left-12 z-20 hidden md:block">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">
                    System Check: Optimal
                  </span>
                </div>
                <div className="h-[1px] w-32 bg-zinc-200 mt-2" />
                <span className="text-[10px] font-bold text-zinc-400">
                  DATA_SYNC_ID: {project.id}-LINEUP
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => onZoom(project.secondaryImages![5])}
              className="relative h-full w-full flex items-center justify-center cursor-zoom-in group/img z-10 p-8 md:p-12"
            >
              {/* Central Large image - Scaled up */}
              <img
                src={project.secondaryImages[5]}
                alt="IP Lineup Showcase"
                className="max-h-[140%] md:max-h-[160%] w-auto object-contain transition-all duration-700 group-hover:scale-[1.05] drop-shadow-[0_40px_100px_rgba(0,0,0,0.2)]"
              />

              {/* Interactive scanning line on hover */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent opacity-0 group-hover/img:animate-scan pointer-events-none" />
            </motion.div>
          </div>

          <div className="mt-8 flex justify-between items-center px-4">
            <div className="flex items-center gap-4 flex-grow">
              <div className="h-[1px] flex-grow bg-zinc-200" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-200"
                  />
                ))}
              </div>
            </div>
            <div className="mx-8 text-center shrink-0">
              <span className="text-[11px] font-black text-zinc-300 uppercase tracking-[1em] block mb-2">
                Character Profile Lineup
              </span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-zinc-900 font-black text-sm">
                  DESIGN_ID: YJ-001
                </span>
                <span className="text-zinc-300">|</span>
                <span className="text-zinc-900 font-black text-sm uppercase tracking-wider">
                  {project.title}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-grow">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-200"
                  />
                ))}
              </div>
              <div className="h-[1px] flex-grow bg-zinc-200" />
            </div>
          </div>
        </section>
      )}

      {/* Bottom Grid - Image + Story */}
      <section className="px-8 pb-32 md:px-16 lg:px-24">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* Left: The 3:4 story vertical video */}
          {project.secondaryImages?.[6] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              onClick={() => onZoom(project.secondaryImages![6])}
              className="group relative aspect-[3/4] overflow-hidden rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.2)] border border-zinc-100 bg-black cursor-zoom-in"
            >
              <video
                src={project.secondaryImages[6]}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </motion.div>
          )}

          {/* Right: The Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-start py-8 lg:py-12"
          >
            <div className="relative">
              <div className="flex items-center gap-4 mb-16">
                <span
                  className="w-8 h-1 rounded-full"
                  style={{ backgroundColor: project.themeColor || "#4A90E2" }}
                />
                <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">
                  羊角角的夜间神秘行动🌘
                </h3>
              </div>

              <div className="space-y-12 text-lg font-medium text-zinc-500 leading-relaxed max-w-xl">
                <div>
                  <p className="text-zinc-900 mb-2">早上8:21。</p>
                  <p>羊角角还叼着牙刷发呆，手机忽然亮了一下。</p>
                </div>

                <div className="py-4">
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    Message Received
                  </p>
                  <p className="text-2xl font-black text-zinc-900 leading-tight">
                    「今晚21点，
                    <span style={{ color: project.themeColor || "#4A90E2" }}>
                      老地方行动
                    </span>
                    。」
                  </p>
                </div>

                <p>
                  它盯着屏幕沉默了几秒，
                  <br />
                  慢慢把手机扣回洗手台边。
                </p>

                <p>
                  没人知道“老地方”到底是哪。
                  <br />
                  也没人知道，羊角角每天晚上到底在执行什么任务。
                  <br />
                  <br />
                  白天的它总是一副没睡醒的样子，像对世界提不起兴趣。
                  <br />
                  可一到夜里，它就会消失在城市的灯光里。
                </p>

                <div
                  className="space-y-2 border-l-2 pl-6"
                  style={{ borderColor: project.themeColor || "#e4e4e7" }}
                >
                  <p>有人在凌晨的便利店见过它。</p>
                  <p>有人在下雨的天桥见过它。</p>
                  <p className="text-zinc-900 font-bold">
                    还有人说，自己最难熬的那个晚上，好像被一只卷角小羊偷偷救过一次。
                  </p>
                </div>

                <p className="text-zinc-800 leading-relaxed">
                  它会穿过没人的小巷、便利店门口、凌晨的天桥。
                  <br />
                  专门接那些奇怪的任务：
                  <br />
                  <span className="text-zinc-900 font-bold italic">
                    回收被丢掉的梦想、寻找失踪的快乐、或者偷偷暗杀掉人类今天的坏情绪。
                  </span>
                </p>

                <div className="pt-12">
                  <p className="text-2xl font-black text-zinc-900 mb-4">
                    晚上21:00。
                  </p>
                  <p className="text-xl font-medium leading-relaxed">
                    城市开始安静。
                    <br />
                    羊角角戴上耳机，关掉房间的灯。
                    <br />
                    <span
                      className="inline-block px-1 mt-2"
                      style={{
                        backgroundColor: `${project.themeColor}15` || "#f4f4f5",
                      }}
                    >
                      今晚的神秘行动，开始了。🌙
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function EditableImage({
  src,
  onUpdate,
  onZoom,
  aspectClass = "aspect-video",
  className = "",
  alt = "Editable Image",
  innerDecor = false,
  imgClass = "w-full h-full object-cover",
}: {
  src: string;
  onUpdate?: (newSrc: string) => void;
  onZoom: (src: string) => void;
  aspectClass?: string;
  className?: string;
  alt?: string;
  innerDecor?: boolean;
  imgClass?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");

  // Admin login integration inside component
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== "undefined" && localStorage.getItem("sharks_portfolio_admin_active") === "true";
  });
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Synchronize admin login status across different component instances
  useEffect(() => {
    const handleAdminSync = () => {
      const active = typeof window !== "undefined" && localStorage.getItem("sharks_portfolio_admin_active") === "true";
      setIsAdmin(active);
    };
    window.addEventListener("storage", handleAdminSync);
    window.addEventListener("admin-state-changed", handleAdminSync);
    return () => {
      window.removeEventListener("storage", handleAdminSync);
      window.removeEventListener("admin-state-changed", handleAdminSync);
    };
  }, []);

  const isVideo = src?.endsWith(".mp4") || src?.startsWith("data:video/") || src?.includes("mobile-landing-animation") || src?.includes("input_file_11");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string" && onUpdate) {
          onUpdate(reader.result);
          setIsEditing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim() && onUpdate) {
      onUpdate(urlInput.trim());
      setIsEditing(false);
      setUrlInput("");
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === "232323.Aike") {
      setLoginSuccess(true);
      setLoginError("");
      setTimeout(() => {
        localStorage.setItem("sharks_portfolio_admin_active", "true");
        setIsAdmin(true);
        setLoginSuccess(false);
        setAdminPassword("");
        // Notify other widgets
        window.dispatchEvent(new Event("admin-state-changed"));
      }, 1000);
    } else {
      setLoginError("钥匙不匹配，请重新输入 // ACCREDITATION FAILED");
    }
  };

  return (
    <div
      className={`relative overflow-hidden group/editimg ${aspectClass} ${className}`}
    >
      {/* 4 Corners Cyber Decor */}
      {innerDecor && (
        <>
          <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-purple-500/60 pointer-events-none z-10" />
          <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-purple-500/60 pointer-events-none z-10" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-purple-500/60 pointer-events-none z-10" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-purple-500/60 pointer-events-none z-10" />
        </>
      )}

      {/* Actual Image or Video */}
      {isVideo ? (
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            if (!isEditing) onZoom(src);
          }}
          className={`${imgClass} cursor-zoom-in`}
        />
      ) : (
        <img
          src={src}
          alt={alt}
          onClick={(e) => {
            e.stopPropagation();
            if (!isEditing) onZoom(src);
          }}
          className={`${imgClass} transition-transform duration-700 hover:scale-[1.02] cursor-zoom-in`}
        />
      )}

      {/* Floating Replace Button */}
      {isAdmin && onUpdate && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
          className="absolute top-4 right-4 z-20 flex h-10 px-3 items-center gap-1.5 rounded-xl border border-white/20 bg-black/80 text-xs font-semibold text-zinc-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-900/40 backdrop-blur-md opacity-100 md:opacity-0 md:group-hover/editimg:opacity-100 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] cursor-pointer"
          title="替换媒体素材 / Replace Media"
        >
          <Edit2 className="h-3.5 w-3.5 text-purple-400" />
          <span>替换 / Replace</span>
        </button>
      )}

      {/* Elegant Cyberpop Image Input Overlay (Viewport Fixed Modal with Portal) */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex justify-center items-center p-4 text-white"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-950 border border-purple-500/20 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col gap-6"
              >
                <button
                  onClick={() => setIsEditing(false)}
                  className="absolute top-5 right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </button>

                {!isAdmin ? (
                  /* Secure Admin Authentication Gate */
                  <form onSubmit={handleAdminSubmit} className="space-y-6 text-center py-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-rose-500 font-bold uppercase tracking-[0.2em] block">
                        // SECURITY AUTHENTICATION REQUIRED
                      </span>
                      <h5 className="text-base font-black text-white uppercase tracking-widest">
                        管理员授权验证
                      </h5>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                        请输入管理员钥匙进行授权验证，验证通过后即可永久激活媒体上传与自定义功能。
                      </p>
                    </div>

                    {loginSuccess ? (
                      <div className="flex flex-col items-center justify-center py-6 space-y-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center animate-bounce">
                          <Check className="h-5 w-5 text-emerald-400" />
                        </div>
                        <span className="text-xs text-emerald-400 font-mono font-bold uppercase tracking-wider animate-pulse">
                          ACCESS SECURED // 验证成功，正在进入定制面板...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <input
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-4 text-center text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-600 font-mono"
                          placeholder="请输入验证密码 // ENTER PASSWORD"
                          autoFocus
                        />
                        {loginError && (
                          <p className="text-[11px] font-mono text-rose-500 font-bold tracking-wide">
                            {loginError}
                          </p>
                        )}
                        <button
                          type="submit"
                          className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-black tracking-widest uppercase transition-all shadow-lg hover:shadow-purple-500/25 active:scale-[0.98] cursor-pointer"
                        >
                          确认钥匙 / AUTHENTICATE KEY
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  /* Customization Tab Interface for logged-in user */
                  <>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-[0.2em] block mb-1">
                        MEDIA CUSTOMIZATION ENGINE
                      </span>
                      <h5 className="text-lg font-black text-white tracking-widest uppercase mb-1">
                        媒体素材自定义面板
                      </h5>
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
                        您已开启管理员定制权限，现在可以通过本地拖拽，或输入网络媒体视频、图片永久更改此展位。
                      </p>
                    </div>

                    {/* Tab Selector Buttons */}
                    <div className="flex rounded-xl bg-zinc-900 p-1 border border-white/5">
                      <button
                        type="button"
                        onClick={() => setActiveTab("file")}
                        className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                          activeTab === "file"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        本地上传 / LOCAL FILE
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("url")}
                        className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                          activeTab === "url"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        网络链接 / WEB URL
                      </button>
                    </div>

                    {/* Tab 1: Local File Uploader */}
                    {activeTab === "file" && (
                      <label className="group/upl h-32 border border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl flex flex-col justify-center items-center gap-2.5 cursor-pointer hover:bg-white/5 transition-all text-zinc-400 hover:text-white py-4 px-6">
                        <Upload className="h-6 w-6 text-purple-400 group-hover/upl:scale-110 transition-transform" />
                        <span className="text-xs font-semibold">
                          点击选择本地图片或视频 (.mp4, .png, .jpg)
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider text-center">
                          Drag & Drop or Click to upload local media file
                        </span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,video/*"
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Tab 2: Web URL input */}
                    {activeTab === "url" && (
                      <form
                        onSubmit={handleUrlSubmit}
                        className="flex flex-col sm:flex-row gap-2 w-full mt-2"
                      >
                        <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="粘贴网络图片或视频直链 (如 .jpg, .png, .mp4)"
                          className="flex-grow bg-zinc-900 border border-white/5 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:bg-zinc-800 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!urlInput.trim()}
                          className="shrink-0 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white border border-purple-500/30 rounded-xl px-5 py-3 text-xs font-black tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                          <span>应用 / APPLY</span>
                        </button>
                      </form>
                    )}

                    {/* Live Asset Preview Bubble */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 flex items-center justify-center">
                      {isVideo ? (
                        <video
                          src={src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-60"
                        />
                      ) : (
                        <img
                          src={src}
                          className="w-full h-full object-cover opacity-60"
                          alt="Current Asset Preview"
                        />
                      )}
                      <span className="absolute text-[9px] font-mono text-[#a78bfa] bg-purple-950/70 px-2 rounded-full border border-purple-500/20 uppercase tracking-widest font-extrabold backdrop-blur-md shadow-md">
                        当前预览 / LIVE PREVIEW
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

function CyberLayout({
  project,
  onZoom,
  onClose,
  onUpdateProject,
}: {
  project: Project;
  onZoom: (img: string) => void;
  onClose?: () => void;
  onUpdateProject?: (updated: Project) => void;
}) {
  const [displayMode, setDisplayMode] = useState<"stack" | "grid">("stack");
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  const getMobileLabels = () => {
    if (project.id === "3") {
      return [
        {
          title: "摄影出行·秋季",
          desc: "金秋出游，每帧如电影。温暖橙黄落叶树林场景及机型选购",
        },
        {
          title: "摄影出行·冬季",
          desc: "冬日寻趣，每帧如电影。浪漫冰雪底色与大促高额优惠券包",
        },
        {
          title: "摄影出行·日常",
          desc: "拍照神器，每帧如电影。记录旅途日常生活画面与互动晒单",
        }
      ];
    }
    if (project.title.includes("氢弹大促") || project.id === "10" || project.id === "9") {
      return [
        {
          title: "主会场动态",
          desc: "动态展示活动主站，电视机破屏创意，氛围感与戏剧性拉满",
        },
        {
          title: "兴趣生活",
          desc: "深度融合春节传统视觉符号，将居家过年大促场景精致还原",
        },
        {
          title: "手机数码",
          desc: "以『冲破画幅』和亲友互动的生动视觉点燃热闹抢购年货的氛围",
        },
        {
          title: "影音娱乐",
          desc: "主次分明，并结合 AIGC 智能设计工具快速延展多渠道物料",
        }
      ];
    }
    if (
      project.title.includes("出游季") ||
      project.id === "1" ||
      project.id === "2" ||
      project.id === "3"
    ) {
      return [
        {
          title: "春季分会场 (动态视频)",
          desc: "春日踏青，活力无限。满屏春色与清新色调打造生动的自然出游场景",
        },
        {
          title: "摄影出行·秋季",
          desc: "金秋出游，每帧如电影。温暖橙黄落叶树林场景及机型选购",
        },
        {
          title: "摄影出行·冬季",
          desc: "冬日寻趣，每帧如电影。浪漫冰雪底色与大促高额优惠券包",
        },
        {
          title: "摄影出行·日常",
          desc: "拍照神器，每帧如电影。记录旅途日常生活画面与互动晒单",
        }
      ];
    }
    if (project.title.includes("打工人")) {
      return [
        { title: "活动入口 (动态展示)", desc: "震撼交互光彩耀眼，引导全屏快速进入测试" },
        { title: "一键匹配打工身份", desc: "性格测试配对契合的未来机械工种" },
        {
          title: "职业成就卡展示",
          desc: "支持UGC一键拼图生成与社交圈裂变分享",
        },
        {
          title: "全民大促抽奖落地页",
          desc: "绑定专属任务快速解锁隐藏科技奖品",
        }
      ];
    }
    if (project.id === "11") {
      return [
        { title: "沉浸式三维成果", desc: "数字场景全方位运镜动效以及动态反馈" },
        { title: "视觉主页概念设计", desc: "前沿扁平极简布局与沉浸式体验" },
        { title: "核心转化交互细节", desc: "以高对比度界面元素提升产品转化" },
        { title: "IP场景化", desc: "IP模型的AI场景优化与延展" }
      ];
    }
    return [
      { title: "沉浸式三维成果 (视频 demonstration)", desc: "数字场景全方位运镜动效以及动态反馈" },
      { title: "视觉主页概念设计", desc: "前沿扁平极简布局与沉浸式体验" },
      { title: "核心转化交互细节", desc: "以高对比度界面元素提升产品转化" },
      { title: "IP场景化", desc: "IP模型的AI场景优化与延展" }
    ];
  };

  const topKvImage = project.secondaryImages?.[0] || project.imageUrl;
  const moodboardImage = project.secondaryImages?.[1] || project.imageUrl;
  const mobileVideo = project.secondaryImages?.find((img) => {
    const lower = img?.toLowerCase();
    return lower?.endsWith(".mp4") || lower?.endsWith(".webm") || lower?.endsWith(".mov") || img?.startsWith("data:video/");
  }) || project.secondaryImages?.[6] || "/images/input-file-11.mp4";
  const mobile1 = project.secondaryImages?.[3] || project.imageUrl;
  const mobile2 = project.secondaryImages?.[4] || project.imageUrl;
  const mobile3 = project.secondaryImages?.[5] || project.imageUrl;

  const isPhotographyOuting = project.id === "3";
  const mobileList = isPhotographyOuting
    ? [mobile1, mobile2, mobile3]
    : [mobileVideo, mobile1, mobile2, mobile3];

  const handleUpdateImage = (index: number, newSrc: string) => {
    if (!onUpdateProject) return;
    const currentImgs = project.secondaryImages
      ? [...project.secondaryImages]
      : [];
    while (currentImgs.length <= index) {
      currentImgs.push("");
    }
    currentImgs[index] = newSrc;
    const updatedProject = {
      ...project,
      secondaryImages: currentImgs,
    };
    if (index === 0) {
      updatedProject.imageUrl = newSrc;
    }
    onUpdateProject(updatedProject);
  };

  return (
    <div className="bg-neutral-950 text-white min-h-full pb-20 font-sans selection:bg-purple-500 selection:text-white relative">
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 opacity-[0.03] select-none pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Cyberpunk Top Header - Similar to design screenshot */}
      <header className={`relative z-10 px-8 pt-12 pb-8 md:px-12 flex flex-col md:flex-row md:items-end justify-between border-b ${project.id === '12' ? 'border-zinc-200 bg-white/40' : 'border-white/5 bg-black/40'} backdrop-blur-md gap-6 group/header`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 flex-grow">
          {onClose && (
            <button
              onClick={onClose}
              className={`group/btn flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${project.id === '12' ? 'border-zinc-300 bg-zinc-100 text-zinc-600 hover:text-zinc-900' : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'} hover:bg-white/10 hover:border-white/20 transition-all shadow-lg active:scale-95 duration-300 relative overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-tr ${project.id === '12' ? 'from-zinc-200' : 'from-white/10'} to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity`} />
              <ArrowLeft className="h-5 w-5 relative z-10 transition-transform group-hover/btn:-translate-x-1" />
            </button>
          )}

          <div className="flex flex-col gap-3 flex-1">
            {/* Top category label matching the reference screenshot */}
            <div className="flex items-center gap-3">
              <span 
                className="w-10 h-1 rounded-full transition-all duration-300 group-hover/header:w-16"
                style={{ backgroundColor: project.themeColor || "#2b82f6" }}
              />
              <span className={`text-[10px] font-mono font-black ${project.id === '12' ? 'text-zinc-600' : 'text-zinc-400'} uppercase tracking-[0.34em]`}>
                {project.category === "landing" ? "CASE STUDY • LANDING" : project.category === "personal" ? "CASE STUDY • CHARACTER" : "CASE STUDY • UI & BRAND"}
              </span>
            </div>

            {/* Giant Title based on the visual screenshot */}
            <div className="relative overflow-hidden py-1">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight cursor-default select-none flex flex-wrap gap-x-1.5"
                style={{ 
                  color: project.id === '12' ? '#18181b' : (project.themeColor || "#fff"),
                  textShadow: project.id === '12' ? 'none' : `0 0 40px ${(project.themeColor || "#2b82f6")}20`
                }}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
              >
                {project.title.split("").map((char, index) => (
                  <motion.span
                    key={index}
                    className="inline-block relative"
                    animate={isTitleHovered ? {
                      y: -6,
                      scale: 1.05,
                      filter: "brightness(1.25)",
                      textShadow: `0 0 20px ${project.themeColor || "#2b82f6"}80`
                    } : {
                      y: 0,
                      scale: 1,
                      filter: "brightness(1)",
                      textShadow: "none"
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: index * 0.03
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h2>
            </div>

            {/* Subtitle / Tags row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1 text-xs">
              <span className="font-mono text-zinc-500 font-bold uppercase tracking-widest">
                {project.subtitle || "WORK / CASE STUDY"}
              </span>
              <span className="text-zinc-700 hidden sm:inline">•</span>
              {project.tags && project.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className={`px-3 py-1 rounded-full ${project.id === '12' ? 'bg-zinc-200 border-zinc-300 text-zinc-700' : 'bg-white/5 border-white/10 text-zinc-400'} border text-[10px] font-bold tracking-wider uppercase`}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={`text-[11px] font-mono ${project.id === '12' ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  2024 - 2026
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subtle status indicator */}
        <div className="hidden md:flex items-center gap-3 shrink-0 self-end md:mb-1">
          <div 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${project.id === '12' ? 'bg-zinc-100 border-zinc-200 text-zinc-600' : 'bg-white/5 border-white/10 text-zinc-400'} border text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-300 hover:border-white/20`}
            style={{
              boxShadow: project.id === '12' ? 'none' : `inset 0 0 12px ${(project.themeColor || "#2b82f6")}05`
            }}
          >
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: project.themeColor || "#2b82f6" }}
            />
            Case Layout :: Active
          </div>
        </div>
      </header>

      {/* 1. TOP SECTION - 16:9 KV Showcase Image */}
      <section className="px-8 pt-12 pb-10 md:px-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`rounded-3xl border ${project.id === '12' ? 'border-zinc-200 shadow-xl' : 'border-white/10 shadow-[0_30px_100px_rgba(167,139,250,0.15)] bg-zinc-900'} overflow-hidden`}
        >
          <EditableImage
            src={topKvImage}
            onUpdate={
              onUpdateProject
                ? (newSrc) => handleUpdateImage(0, newSrc)
                : undefined
            }
            onZoom={onZoom}
            aspectClass="aspect-[1920/1220]"
            alt="Top Key Visual"
            innerDecor={project.id !== '12'}
          />
        </motion.div>
      </section>

      {/* 2. PROJECT INTRODUCTION & STRATEGY COMPONENT */}
      <section className="px-8 py-10 md:px-12 max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1fr_2.2fr] items-stretch">
          {/* Left Column: Prelude / Project Introduction Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`relative rounded-[2rem] p-8 overflow-hidden ${project.id === '12' ? 'bg-zinc-100 border-zinc-200 shadow-xl' : 'bg-gradient-to-b from-zinc-900/90 to-black border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]'} flex flex-col justify-between`}
          >
            {/* Subtle light effects */}
            <div className={`absolute top-0 left-0 w-32 h-32 ${project.id === '12' ? 'bg-zinc-300' : 'bg-purple-500/5'} blur-[60px] rounded-full pointer-events-none`} />

            <div>
              {/* Category tag */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`w-1.5 h-1.5 rounded-full ${project.id === '12' ? 'bg-zinc-400' : 'bg-purple-500'} animate-pulse`} />
                <span className={`text-[10px] font-mono font-black ${project.id === '12' ? 'text-zinc-500' : 'text-purple-400'} tracking-[0.3em] uppercase`}>
                  项目开篇 PRELUDE
                </span>
              </div>

              <h3 className={`text-3xl font-black ${project.id === '12' ? 'text-zinc-950' : 'text-white'} tracking-tight leading-tight mb-6`}>
                {project.title}
                <span className={`block text-xs font-mono font-medium ${project.id === '12' ? 'text-zinc-600' : 'text-zinc-500'} tracking-wider uppercase mt-1`}>
                  {project.subtitle || "UI DESIGN CASE"}
                </span>
              </h3>

              <div className={`text-sm font-medium ${project.id === '12' ? 'text-zinc-700' : 'text-zinc-300'} leading-relaxed italic ${project.id === '12' ? 'border-zinc-400' : 'border-purple-500/40'} border-l-2 pl-4 py-1 mb-8 whitespace-pre-line`}>
                {project.description}
              </div>
            </div>

            {/* Sub-info layout */}
            <div className={`pt-6 border-t ${project.id === '12' ? 'border-zinc-300' : 'border-white/5'} grid grid-cols-2 gap-4 text-xs`}>
              <div>
                <span className={`${project.id === '12' ? 'text-zinc-500' : 'text-zinc-500'} block font-mono mb-0.5`}>
                  DESIGNED BY
                </span>
                <span className={`${project.id === '12' ? 'text-zinc-950' : 'text-white'} font-bold`}>
                  {project.designBy || "王军震"}
                </span>
              </div>
              <div>
                <span className={`${project.id === '12' ? 'text-zinc-500' : 'text-zinc-500'} block font-mono mb-0.5`}>
                  CATEGORY / ROLE
                </span>
                <span className={`${project.id === '12' ? 'text-zinc-950' : 'text-white'} font-bold uppercase`}>
                  {project.category || "LANDING PAGE"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Strategic Framework with Beautiful Interactive Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between space-y-6"
          >
            {project.id === "10" ? (
              <>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      核心创意设定 / CREATIVE CONCEPT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">
                    // STAGE_A_CONCEPT
                  </span>
                </div>

                <div className="relative rounded-[2rem] p-8 overflow-hidden bg-gradient-to-b from-zinc-900/40 to-black/80 border border-white/10 flex-1 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                  {/* Subtle light effects */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-400 mb-4 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      核心关键词
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {["春日踏青", "一拍封神", "手持防抖摄影", "装备轻出行", "清新春色"].map(
                        (kw) => (
                          <span
                            key={kw}
                            className="px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-100 text-sm font-medium tracking-wide shadow-[0_4px_12px_rgba(59,130,246,0.15)] flex items-center justify-center"
                          >
                            {kw}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 relative">
                    <div className="absolute -top-[1px] left-0 w-12 h-[2px] bg-blue-500/50" />
                    <h4 className="text-xs font-mono font-bold text-zinc-400 mb-4 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      画面创意构思
                    </h4>
                    <p className="text-zinc-300 leading-relaxed text-[15px] font-medium tracking-wide">
                      开春踏青出行，好物相伴一拍封神。画面以高热大疆 Pocket 3 及手持云台运动相机为主置于温润高雅的林间年轮圆木墩上，右侧点缀带有老花纹理的高端随行皮革收纳包，完美调和野趣与轻奢风。画面底层有清澈活泼的小溪在绿茵丛中缓缓趟过，伴随精致的白黄雏菊。配合高逼真 3D 光影重塑，勾勒出如童话般的“春江水暖”场景，极具踏青出游转化心智。
                    </p>
                  </div>
                </div>
              </>
            ) : project.id === "9" || project.title.includes("氢弹大促") ? (
              <>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      核心创意设定 / CREATIVE CONCEPT
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">
                    // STAGE_A_CONCEPT
                  </span>
                </div>

                <div className="relative rounded-[2rem] p-8 overflow-hidden bg-gradient-to-b from-zinc-900/40 to-black/80 border border-white/10 flex-1 flex flex-col gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                  {/* Subtle light effects */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-400 mb-4 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                      核心关键词
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {["新春年味", "劲爆促销", "居家团圆场景", "趣味抢购"].map(
                        (kw) => (
                          <span
                            key={kw}
                            className="px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-100 text-sm font-medium tracking-wide shadow-[0_4px_12px_rgba(168,85,247,0.15)] flex items-center justify-center"
                          >
                            {kw}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 relative">
                    <div className="absolute -top-[1px] left-0 w-12 h-[2px] bg-purple-500/50" />
                    <h4 className="text-xs font-mono font-bold text-zinc-400 mb-4 tracking-widest uppercase flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
                      画面创意构思
                    </h4>
                    <p className="text-zinc-300 leading-relaxed text-[15px] font-medium tracking-wide">
                      转转 TV 年货狂欢，好物破屏迎新春。以电视机为画面主体，商品从电视机中发散出来，通过前中后景的物体来营造空间感，场景故事是新春佳节，亲朋好友围坐客厅紧盯 “转转 TV”，电视屏幕里的商品冲破边框向外发散，众人伸手欢呼、抢优惠选好物，春节元素点缀年味，传递团圆相聚薅羊毛的欢乐氛围。
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Header description for Strategy */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
                      核心设计策略 / STRATEGY FRAMEWORK
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-600">
                    // STAGE_A_STRATEGY
                  </span>
                </div>

                {/* Strategic Responsive Cards Grid */}
                <div className="grid gap-6 sm:grid-cols-3 h-full">
                  {(project.strategy && project.strategy.length > 0
                    ? project.strategy
                    : [
                        "强调空间感与交互流畅度",
                        "采用拟物化场景嵌入",
                        "色彩心理学引导核心转化",
                      ]
                  ).map((strat, i) => {
                    // Determine icon & color schemes dynamically based on content keywords
                    let strategyTitle = "核心突破策略";
                    let strategyIcon = <Layers className="h-5 w-5" />;
                    let colorTheme =
                      "from-purple-500/10 to-indigo-500/5 hover:border-purple-500/30";
                    let textTheme = "text-purple-400";
                    let tagTheme = "bg-purple-500/10 border-purple-500/20";

                    if (
                      strat.includes("出行") ||
                      strat.includes("背景") ||
                      strat.includes("交通") ||
                      strat.includes("空间")
                    ) {
                      strategyTitle = "场景氛围构建";
                      strategyIcon = <Compass className="h-5 w-5" />;
                      colorTheme =
                        "from-blue-500/10 to-cyan-500/5 hover:border-blue-500/30";
                      textTheme = "text-blue-400";
                      tagTheme = "bg-blue-500/10 border-blue-500/20";
                    } else if (
                      strat.includes("颜色") ||
                      strat.includes("色调") ||
                      strat.includes("色彩") ||
                      strat.includes("拟物") ||
                      strat.includes("季节")
                    ) {
                      strategyTitle = "季节美学定调";
                      strategyIcon = <Palette className="h-5 w-5" />;
                      colorTheme =
                        "from-orange-500/10 to-amber-500/5 hover:border-orange-500/30";
                      textTheme = "text-orange-400";
                      tagTheme = "bg-orange-500/10 border-orange-500/20";
                    } else if (
                      strat.includes("AI") ||
                      strat.includes("AIGC") ||
                      strat.includes("生成") ||
                      strat.includes("素材")
                    ) {
                      strategyTitle = "AIGC 智能解法";
                      strategyIcon = <Cpu className="h-5 w-5" />;
                      colorTheme =
                        "from-pink-500/10 to-fuchsia-500/5 hover:border-pink-500/30";
                      textTheme = "text-pink-400";
                      tagTheme = "bg-pink-500/10 border-pink-500/20";
                    }

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ y: -4, scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className={`relative overflow-hidden rounded-2xl border border-white/5 p-6 bg-gradient-to-br ${colorTheme} transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-black/20`}
                      >
                        {/* Corner accent glow */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 blur-[30px] rounded-full pointer-events-none group-hover:bg-white/10 transition-colors" />

                        <div>
                          {/* Title & Icon bar */}
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-xl ${tagTheme} border ${textTheme}`}
                            >
                              {strategyIcon}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                              0{i + 1}
                            </span>
                          </div>

                          <h4 className="text-md font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                            {strategyTitle}
                          </h4>

                          <p className="text-xs font-medium text-zinc-300 leading-relaxed">
                            {strat}
                          </p>
                        </div>

                        {/* Highly polished border indicator indicator */}
                        <div className="h-[2px] w-0 bg-gradient-to-r from-purple-500 to-pink-500 mt-6 group-hover:w-full transition-all duration-500" />
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* 4. THREE VERTICAL MOBILE LANDING PAGE SHOWCASE */}
      {project.id === "10" ? (
        <section className="px-8 py-12 md:px-12 max-w-6xl mx-auto text-white">
          {/* Header */}
          <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-4 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#2b82f6] font-black text-xs font-mono">// 02</span>
              <h4 className="text-sm font-black uppercase tracking-widest text-[#7cd8fd]">
                出游季排版矩阵 & 视觉大片呈现 • MOBILE DESIGN SYSTEM
              </h4>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2b82f6]/10 border border-[#2b82f6]/30 text-[10px] font-mono font-bold text-[#7cd8fd] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2b82f6] animate-pulse" />
                排版参考与配色规范 // BRAND MATRIX
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Left Column (5/12 spec): Color Swatch and Promos */}
            <div className="md:col-span-5 flex flex-col gap-8 justify-between">
              
              {/* Color Swatch Card */}
              <div className="bg-gradient-to-b from-zinc-900/60 to-black/80 border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between flex-1">
                {/* Accent glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h5 className="text-lg font-black tracking-wider text-white">配色 COLOUR</h5>
                      <span className="text-[10px] text-zinc-500 font-mono tracking-widest block uppercase mt-0.5">// Brand Palette</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">60-30-10 System</span>
                  </div>

                  {/* Swatches Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { hex: "#2b82f6", name: "天空蓝 Sky Blue", text: "text-blue-100" },
                      { hex: "#7cd8fd", name: "晴空蓝 Pale Cyan", text: "text-cyan-950" },
                      { hex: "#b3df84", name: "薄荷绿 Mint Green", text: "text-emerald-950" },
                      { hex: "#eb9542", name: "暖阳橙 Warm Amber", text: "text-amber-950" }
                    ].map((col) => (
                      <div key={col.hex} className="flex flex-col gap-2">
                        <div 
                          className="h-16 rounded-xl relative shadow-md transition-transform hover:scale-105 duration-300 overflow-hidden flex items-end p-2 cursor-pointer border border-white/5"
                          style={{ backgroundColor: col.hex }}
                          onClick={() => onZoom(col.hex)}
                        >
                          <span className={`text-[10px] font-mono font-bold ${col.text}`}>{col.hex}</span>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-400">{col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-600">
                  <span>HEX CODES VERIFIED</span>
                  <span>OPACITY_100%</span>
                </div>
              </div>

              {/* Spring Promos Block (春日出游 一拍封神) */}
              <div className="bg-gradient-to-br from-blue-600 to-sky-400 p-8 rounded-[2rem] flex flex-col justify-between aspect-[4/3] md:aspect-square lg:aspect-[4/3] relative overflow-hidden shadow-2xl group border border-blue-400/30">
                {/* Diagonal background stream decor */}
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none group-hover:scale-120 transition-transform duration-700" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-white mb-4 shadow-sm">
                    租售转化卡 // CARD_PREVIEW
                  </span>
                  <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                    春日出游 一拍封神
                  </h3>
                  <p className="text-sm font-bold text-white/95 mt-1">
                    大疆pocket3日租低至10元起
                  </p>
                </div>

                {/* Camera close up asset float */}
                <div className="absolute bottom-4 right-4 w-40 h-40 pointer-events-none select-none z-10">
                  <motion.img 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                    src="/images/camera-gear-detail.png" 
                    alt="DJI Camera Mockup" 
                    className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105 duration-500"
                  />
                </div>

                <div className="relative z-10 self-start">
                  <button 
                    onClick={() => onZoom("/images/camera-gear-detail.png")}
                    className="flex items-center gap-1.5 bg-black px-6 py-2.5 rounded-full text-white text-xs font-black shadow-md md:shadow-lg transition-all duration-300 hover:bg-neutral-900 group-hover:px-7 active:scale-95"
                  >
                    <span>点击查看</span>
                    <ArrowDownRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column (7/12 spec): iPhone Simulator Mockup */}
            <div className="md:col-span-7 flex items-center justify-center bg-zinc-950/40 border border-white/5 p-8 rounded-[3rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 via-transparent to-transparent opacity-40 pointer-events-none" />
              
              {/* iPhone Mockup Container */}
              <div className="relative w-full max-w-[320px] aspect-[1124/2350] border-[9px] border-zinc-900 bg-black rounded-[42px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col group/phone cursor-pointer"
                   onClick={() => onZoom("/images/spring-travel-campaign.png")}
              >
                {/* Dynamic island notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[90px] h-[25px] bg-black rounded-full z-40 flex items-center justify-end px-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
                </div>

                {/* Simulated status bar */}
                <div className="h-10 px-6 flex justify-between items-end pb-0.5 text-[10px] font-bold text-white z-20 select-none relative bg-neutral-950/60 backdrop-blur-sm">
                  <span>13:50</span>
                  <div className="flex gap-1 items-center">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-white rounded-sm p-[1px] flex">
                      <div className="w-full bg-white rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* iPhone Frame Content Viewport */}
                <div className="flex-1 overflow-hidden relative flex flex-col bg-slate-900">
                  <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10" />
                  
                  {/* Background green park image */}
                  <img src="/images/spring-travel-campaign.png" alt="Spring Field Preview" className="absolute inset-0 w-full h-full object-cover grayscale-[15%] brightness-105 group-hover/phone:scale-105 transition-transform duration-1000" />
                  
                  {/* Floating particles color wash overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#265330]/80 via-[#265330]/20 to-[#2b82f6]/10" />

                  {/* App Header overlay */}
                  <div className="absolute inset-x-0 top-6 p-5 text-white z-10 leading-none">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/80 rounded px-1.5 py-0.5 select-none shadow">
                      转转租赁 • OUTING
                    </span>
                    <h3 className="text-xl font-black mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                      春日出游 一拍封神
                    </h3>
                    <p className="text-[10px] font-bold text-white/90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                      大疆Pocket3日租低至10元起
                    </p>
                  </div>

                  {/* Simulated App Card controls bottom */}
                  <div className="absolute inset-x-0 bottom-4 px-4 flex flex-col gap-2 z-10">
                    <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md p-3 flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 p-1 flex">
                          <img src="/images/camera-gear-detail.png" className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-black leading-tight text-white">大疆 Pocket3 云台</span>
                          <span className="block text-[8px] text-zinc-400">旗舰画质 · 智能追踪</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-blue-400">¥10 /天起</span>
                    </div>

                    <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md p-3 flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 p-1 flex">
                          <img src="/images/camera-gear-detail.png" className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-black leading-tight text-white">潮流复古相机包</span>
                          <span className="block text-[8px] text-zinc-400">防水抗震 · 轻奢出行</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-blue-400">¥1.5 /天起</span>
                    </div>

                    <span className="text-[8px] text-zinc-400 text-center uppercase tracking-widest mt-1 block font-mono select-none">
                      往滑动体验更多装备 // SWIPE FOR MORE
                    </span>
                  </div>
                </div>

                {/* iPhone indicator bar */}
                <div className="h-6 flex items-center justify-center bg-black select-none">
                  <div className="w-32 h-1 bg-white/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Wide banner */}
          <div className="mt-8 max-w-6xl mx-auto rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-sky-500 to-teal-400 border border-white/15 p-8 md:p-12 shadow-2xl relative overflow-hidden group min-h-[180px] md:min-h-[220px] flex items-center justify-between">
            {/* Ambient visual overlay */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-white/10 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-wider mb-4 shadow-sm">// WIDESCREEN BANNER</span>
              <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                春日出游 一拍封神
              </h2>
              <p className="text-sm md:text-base font-bold text-white/95 uppercase mt-3 tracking-widest">
                大疆 POCKET 3 租售转化专区 · 开启探索
              </p>
            </div>

            {/* Giant camera on right */}
            <div 
              onClick={() => onZoom("/images/spring-travel-campaign.png")}
              className="absolute right-0 top-0 bottom-0 w-1/3 min-w-[200px] h-full hidden md:block cursor-zoom-in filter group-hover:brightness-105 duration-300"
            >
              <img src="/images/spring-travel-campaign.png" alt="Big camera" className="w-full h-full object-cover rounded-l-[10rem] border-l border-white/20 transition-all group-hover:scale-105 duration-700" />
            </div>
          </div>
        </section>
      ) : (
        <section className="px-8 py-12 md:px-12 max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-4 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-purple-500 font-black text-xs font-mono">
              // 02
            </span>
            <h4 className="text-sm font-black uppercase tracking-widest text-zinc-400">
              移动端落地页呈现 • MOBILE LANDING PAGES
            </h4>
          </div>

          {/* Interactive Mode Toggles */}
          <div className="flex bg-neutral-900 border border-white/5 rounded-xl p-1 text-[10px] font-mono font-bold uppercase tracking-wider self-stretch md:self-auto select-none">
            <button
              onClick={() => setDisplayMode("stack")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                displayMode === "stack"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              层叠视差 // STACK
            </button>
            <button
              onClick={() => setDisplayMode("grid")}
              className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                displayMode === "grid"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded bg-current" />
              平铺画廊 // GRID
            </button>
          </div>
        </div>

        <div className="relative mt-12">
          {displayMode === "stack" ? (
            /* Premium 3D Stack / Overlapping Interactive Gallery */
            <div 
              onClick={() => setDisplayMode("grid")}
              className="relative w-full py-12 flex flex-col items-center justify-center overflow-hidden md:overflow-visible min-h-[500px] md:min-h-[640px] bg-zinc-950/40 border border-white/5 rounded-[3rem] p-6 cursor-pointer hover:bg-zinc-900/10 transition-colors duration-500"
              title="点击空白区域切换为平铺画廊 / Click background to switch to gallery grid"
            >
              {/* Ambient Background Grid & Neon Beam */}
              <div className="absolute inset-0 pointer-events-none rounded-[3rem] overflow-hidden opacity-20">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full" />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              {/* Stack container with desktop 3D effects, falls back nicely to interactive rows on tiny screens if needed */}
              <motion.div
                className="relative w-full max-w-[800px] h-[380px] md:h-[500px] flex items-center justify-center overflow-visible cursor-pointer group/stackcontainer"
                whileHover="hovered"
                animate="initial"
                onClick={(e) => e.stopPropagation()}
              >
                {mobileList.map((img, i) => {
                  // Precise layout calculations for 3-item or 4-item 3D stacks
                  let initialAnimate = {};
                  let hoverAnimate = {};

                  if (mobileList.length === 3) {
                    if (i === 0) {
                      initialAnimate = {
                        x: -80,
                        y: 15,
                        rotate: -8,
                        scale: 0.88,
                        zIndex: 10,
                      };
                      hoverAnimate = {
                        x: -180,
                        y: 0,
                        rotate: -3,
                        scale: 0.94,
                        zIndex: 10,
                      };
                    } else if (i === 1) {
                      initialAnimate = {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                        zIndex: 30,
                      };
                      hoverAnimate = {
                        x: 0,
                        y: -20,
                        rotate: 0,
                        scale: 1.02,
                        zIndex: 30,
                      };
                    } else {
                      initialAnimate = {
                        x: 80,
                        y: 15,
                        rotate: 8,
                        scale: 0.88,
                        zIndex: 20,
                      };
                      hoverAnimate = {
                        x: 180,
                        y: 0,
                        rotate: 3,
                        scale: 0.94,
                        zIndex: 20,
                      };
                    }
                  } else {
                    if (i === 0) {
                      initialAnimate = {
                        x: -120,
                        y: 20,
                        rotate: -12,
                        scale: 0.82,
                        zIndex: 10,
                      };
                      hoverAnimate = {
                        x: -240,
                        y: 0,
                        rotate: -5,
                        scale: 0.9,
                        zIndex: 10,
                      };
                    } else if (i === 1) {
                      initialAnimate = {
                        x: -40,
                        y: 5,
                        rotate: -4,
                        scale: 0.92,
                        zIndex: 20,
                      };
                      hoverAnimate = {
                        x: -80,
                        y: -15,
                        rotate: -1,
                        scale: 0.96,
                        zIndex: 20,
                      };
                    } else if (i === 2) {
                      initialAnimate = {
                        x: 40,
                        y: 5,
                        rotate: 4,
                        scale: 0.92,
                        zIndex: 35,
                      };
                      hoverAnimate = {
                        x: 80,
                        y: -15,
                        rotate: 1,
                        scale: 0.96,
                        zIndex: 35,
                      };
                    } else {
                      initialAnimate = {
                        x: 120,
                        y: 20,
                        rotate: 12,
                        scale: 0.82,
                        zIndex: 30,
                      };
                      hoverAnimate = {
                        x: 240,
                        y: 0,
                        rotate: 5,
                        scale: 0.9,
                        zIndex: 30,
                      };
                    }
                  }

                  const labels = getMobileLabels();

                  return (
                    <motion.div
                      key={i}
                      variants={{
                        initial: initialAnimate,
                        hovered: hoverAnimate,
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute w-[180px] sm:w-[220px] md:w-[260px] flex flex-col items-center cursor-default"
                    >
                      {/* Phone frame mock-up (iPhone iOS model) */}
                      <div className="relative aspect-[1124/2350] w-full overflow-hidden rounded-[35px] border-[7.5px] border-neutral-900 bg-neutral-950 shadow-[0_30px_70px_rgba(0,0,0,0.7)] transition-all duration-300 hover:border-purple-500/50">
                        {/* Scrollable Viewport */}
                        <div className="absolute inset-0 pt-0 pb-0 overflow-y-auto scrollbar-none rounded-[27px]">
                          <EditableImage
                            src={img}
                            onUpdate={
                              onUpdateProject
                                ? (newSrc) => {
                                    const targetIndex = isPhotographyOuting ? 3 + i : (i === 0 ? 6 : 2 + i);
                                    handleUpdateImage(targetIndex, newSrc);
                                  }
                                : undefined
                            }
                            onZoom={onZoom}
                            aspectClass="w-full min-h-full"
                            imgClass="w-full min-h-full object-cover"
                            alt={`Mobile Showcase Stack ${i + 1}`}
                          />
                        </div>

                        {/* iOS Home Indicator Bar */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/60 rounded-full z-20 pointer-events-none" />

                        {/* Metallic gloss reflection effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                      </div>

                      {/* Floating title badges */}
                      <div className="mt-4 text-center select-none bg-neutral-950/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5 max-w-[160px] md:max-w-[200px]">
                        <span className="text-[8px] font-mono text-purple-400 font-black tracking-widest block uppercase">
                          M_PAGE_0{i + 1}
                        </span>
                        <span className="block text-[10px] font-bold text-zinc-300 truncate mt-0.5">
                          {labels[i]?.title}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Interaction Guideline Badge */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="mt-12 text-center flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono text-purple-400 tracking-wider uppercase animate-pulse cursor-default"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                鼠标悬停展开移动端设计细节 // Hover to unfold adaptive mockup layout
              </div>
            </div>
          ) : (
            /* Flat Grid Gallery View for full granular details and description walkthroughs */
            <div 
              onClick={() => setDisplayMode("stack")}
              className="relative w-full py-12 flex flex-col items-center justify-center bg-zinc-950/40 border border-white/5 rounded-[3rem] p-6 cursor-pointer hover:bg-zinc-900/10 transition-colors duration-500"
              title="点击空白区域切换为层叠视差 / Click background to switch back to overlapping stack"
            >
              {/* Outer ambient container background decor to match the stack view style */}
              <div className="absolute inset-0 pointer-events-none rounded-[3rem] overflow-hidden opacity-10">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "radial-gradient(#fff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              <div 
                onClick={(e) => e.stopPropagation()}
                className={`grid gap-8 grid-cols-1 sm:grid-cols-2 w-full max-w-5xl mx-auto position-relative z-10 cursor-default ${isPhotographyOuting ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}
              >
                {mobileList.map((img, i) => {
                  const labels = getMobileLabels();
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 45 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className="group flex flex-col justify-start items-center"
                    >
                       {/* Balanced phone mockup bezel (iPhone iOS model) */}
                      <div className="relative aspect-[1124/2350] w-full max-w-[310px] overflow-hidden rounded-[35px] border-[7.5px] border-neutral-900 bg-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-500 group-hover:border-purple-500/50 group-hover:translate-y-[-8px]">
                        {/* Scrollable Viewport */}
                        <div className="absolute inset-0 pt-0 pb-0 overflow-y-auto scrollbar-none rounded-[27px]">
                          <EditableImage
                            src={img}
                            onUpdate={
                              onUpdateProject
                                ? (newSrc) => {
                                    const targetIndex = isPhotographyOuting ? 3 + i : (i === 0 ? 6 : 2 + i);
                                    handleUpdateImage(targetIndex, newSrc);
                                  }
                                : undefined
                            }
                            onZoom={onZoom}
                            aspectClass="w-full min-h-full"
                            imgClass="w-full min-h-full object-cover"
                            alt={`Mobile Page Grid ${i + 1}`}
                          />
                        </div>

                        {/* iOS Home Indicator Bar */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/60 rounded-full z-20 pointer-events-none" />

                        {/* Deep lighting shadow gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>

                      {/* Highly descriptive captions */}
                      <div className="mt-4 text-center max-w-[275px]">
                        <div className="flex justify-center gap-1.5 mb-2.5 opacity-30">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        </div>
                        <span className="block text-sm font-bold text-white mt-1">
                          {labels[i]?.title}
                        </span>
                        {!(project.title.includes("氢弹大促") || project.id === "10" || project.id === "9") && labels[i]?.desc && (
                          <p className="block text-[11px] text-zinc-500 mt-2.5 leading-relaxed font-semibold">
                            {labels[i]?.desc}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Grid view empty bottom helper text */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="mt-8 text-center flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono text-purple-400 tracking-wider uppercase animate-pulse cursor-default"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                点击图像放大观赏详细像素 // Click images to view full high-res details
              </div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Dedicated 4 Mobile Landing Pages Section for Project 9 */}
      {project.id === "9" && (
        <>
          {/* New Section 03: Hydrogen Bomb Extension Pages */}
          <section className="px-8 py-20 md:px-12 max-w-6xl mx-auto border-t border-white/5 mt-16 text-white text-center">
            <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/5 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[#a78bfa] font-mono font-black text-xs">// 03</span>
                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300">
                  氢弹大促其他物料延展 • MOBILE LANDING PAGES EXTENSION
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {[
                { src: project.secondaryImages?.[13] || project.imageUrl, title: "01 // 开屏", subtitle: "SPLASH SCREEN // APP OPENING", index: 13 },
                { src: project.secondaryImages?.[14] || project.imageUrl, title: "02 // feed", subtitle: "NATIVE FEED ADVERTISEMENT", index: 14 },
                { src: project.secondaryImages?.[15] || project.imageUrl, title: "03 // 首页顶通主会场", subtitle: "HOME TOP HERO MAIN ARENA", index: 15 },
                { src: project.secondaryImages?.[16] || project.imageUrl, title: "04 // 首页顶通数码会场", subtitle: "HOME TOP HERO DIGITAL ARENA", index: 16 }
              ].map((item, idx) => (
                <div key={idx} className="group flex flex-col justify-start items-center">
                  {/* Phone frame mock-up (iPhone iOS model) */}
                  <div className="relative aspect-[1124/2350] w-full overflow-hidden rounded-[30px] border-[6px] border-neutral-900 bg-neutral-950 shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-purple-500/50 hover:translate-y-[-6px] mb-4">
                    <div className="absolute inset-0 pt-0 pb-0 overflow-y-auto scrollbar-none rounded-[24px]">
                      <EditableImage
                        src={item.src}
                        onUpdate={
                          onUpdateProject
                            ? (newSrc) => handleUpdateImage(item.index, newSrc)
                            : undefined
                        }
                        onZoom={onZoom}
                        aspectClass="w-full min-h-full"
                        imgClass="w-full min-h-full object-cover"
                        alt={item.title}
                      />
                    </div>
                    {/* iOS Home Indicator Bar */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/40 rounded-full z-20 pointer-events-none" />
                  </div>
                  {/* Cap/Title text */}
                  <div className="text-center">
                    <span className="block text-xs font-black text-white">{item.title}</span>
                    <span className="block text-[9px] font-mono font-bold text-zinc-500 mt-0.5 tracking-wider uppercase">{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 04: Restructured Landing Pages Matrix for Project 9 */}
          <section className="px-8 py-20 md:px-12 max-w-6xl mx-auto border-t border-white/5 mt-16 text-white text-center">
            <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-white/5 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-mono font-black text-xs">// 04</span>
                <h4 className="text-sm font-black uppercase tracking-widest text-zinc-300">
                  开年返工时期视觉设计 • MOBILE LANDING PAGES MATRIX
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
              {[
                { src: project.secondaryImages?.[9] || project.imageUrl, title: "01 // 会场设计", subtitle: "PROMO ARENA VISUAL SYSTEM", index: 9 },
                { src: project.secondaryImages?.[10] || project.imageUrl, title: "02 // 开屏", subtitle: "SPLASH SCREEN // APP OPENING", index: 10 },
                { src: project.secondaryImages?.[11] || project.imageUrl, title: "03 // 首页顶通设计", subtitle: "HOME TOP HERO VISUALS", index: 11 },
                { src: project.secondaryImages?.[12] || project.imageUrl, title: "04 // 微信分享图", subtitle: "WECHAT DYNAMIC SHARE CARD", index: 12 }
              ].map((item, idx) => (
                <div key={idx} className="group flex flex-col justify-start items-center">
                  {/* Phone frame mock-up (iPhone iOS model) */}
                  <div className="relative aspect-[1124/2350] w-full overflow-hidden rounded-[30px] border-[6px] border-neutral-900 bg-neutral-950 shadow-[0_25px_60px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-rose-500/50 hover:translate-y-[-6px] mb-4">
                    <div className="absolute inset-0 pt-0 pb-0 overflow-y-auto scrollbar-none rounded-[24px]">
                      <EditableImage
                        src={item.src}
                        onUpdate={
                          onUpdateProject
                            ? (newSrc) => handleUpdateImage(item.index, newSrc)
                            : undefined
                        }
                        onZoom={onZoom}
                        aspectClass="w-full min-h-full"
                        imgClass="w-full min-h-full object-cover"
                        alt={item.title}
                      />
                    </div>
                    {/* iOS Home Indicator Bar */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/40 rounded-full z-20 pointer-events-none" />
                  </div>
                  {/* Cap/Title text */}
                  <div className="text-center">
                    <span className="block text-xs font-black text-white">{item.title}</span>
                    <span className="block text-[9px] font-mono font-bold text-zinc-500 mt-0.5 tracking-wider uppercase">{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Futuristic footer tech decoration */}
      <div className="mt-16 border-t border-white/5 py-8 max-w-6xl mx-auto px-12 flex flex-col md:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-4">
        <span>LAYOUT_MODEL // SYSTEM-CYBER_ACTIVATED</span>
        <div className="flex gap-4">
          <span>X: 1920_Y: 1080_GRID</span>
          <span>&copy; WANGJUNZHEN VISUALS</span>
        </div>
      </div>
    </div>
  );
}
