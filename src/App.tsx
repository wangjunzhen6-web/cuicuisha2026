import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Mail, ArrowDownRight, Briefcase, Hand, Lock, Unlock, Check, X, LogOut, Sparkles, Edit2, Plus, Trash2, Image, ArrowUpRight, ExternalLink, Upload } from 'lucide-react';
import { projects, experiences } from './projects';
import { Project, PracticeWork } from './types';
import BentoCard from './components/BentoCard';
import ProjectDetail from './components/ProjectDetail';
import Navbar from './components/Navbar';
import ResumeSection from './components/ResumeSection';
import LiquidBackground from './components/LiquidBackground';
import Footer from './components/Footer';
import { ConfettiLetter } from './components/ConfettiLetter';
import { CustomCursor } from './components/CustomCursor';
import { saveProjectsToDB, loadProjectsFromDB, savePracticeWorksToDB, loadPracticeWorksFromDB, saveLibraryImagesToDB, loadLibraryImagesFromDB } from './utils/db';
import { LibraryImage, PRACTICE_ASSETS_LIBRARY } from './data/practice_assets';

function mergeProjectsWithStatic(loaded: Project[]): Project[] {
  const merged = loaded
    .filter(loadedProj => projects.some(p => p.id === loadedProj.id))
    .map(loadedProj => {
      const staticProj = projects.find(p => p.id === loadedProj.id)!;
      
      // Merge secondaryImages: if static has more or newer items, use static items as fallback,
      // otherwise preserve user changes.
      const mergedSecondary = [...(staticProj.secondaryImages || [])];
      if (loadedProj.secondaryImages) {
        loadedProj.secondaryImages.forEach((img, i) => {
          if (img) {
            mergedSecondary[i] = img;
          }
        });
      }
      
      return {
        ...loadedProj,
        title: staticProj.title,
        subtitle: staticProj.subtitle,
        description: staticProj.description,
        strategy: staticProj.strategy,
        secondaryImages: mergedSecondary.length > 0 ? mergedSecondary : undefined
      };
    });

  // Find any static projects not present in loaded projects
  const missing = projects.filter(staticProj => !loaded.some(lp => lp.id === staticProj.id));
  return [...merged, ...missing];
}

function safeSetLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.warn('[LocalStorage] Quota limit hit or storage blocked:', err);
  }
}

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    url.startsWith('data:video/')
  );
};

const generateParticles = () => Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  angle: i * 36 + (Math.random() * 20 - 10),
  distance: 80 + Math.random() * 60,
  duration: 0.5 + Math.random() * 0.5,
}));

const EmittingChar = ({ char, index, gradient }: { key?: any, char: string, index: number, gradient: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState(() => generateParticles());

  return (
    <div 
      className="relative flex items-center justify-center p-2 sm:p-4 -m-2 sm:-m-4"
      onMouseEnter={() => {
        setParticles(generateParticles());
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        {isHovered && particles.map(p => {
           const rad = (p.angle * Math.PI) / 180;
           const x = Math.cos(rad) * p.distance;
           const y = Math.sin(rad) * p.distance;
           return (
             <motion.div
               key={p.id}
               initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
               animate={{ opacity: [0, 1, 0], scale: [0, Math.random() * 1.5 + 0.8, 0], x: [0, x], y: [0, y] }}
               transition={{ duration: p.duration, ease: "easeOut" }}
               className="absolute text-[1.5rem] sm:text-[2.2rem]"
             >
               <span className="text-yellow-200 filter drop-shadow-[0_0_12px_rgba(250,204,21,1)]">✦</span>
             </motion.div>
           );
        })}
      </div>

      <motion.span
        className={`relative z-10 inline-block bg-gradient-to-br ${gradient} bg-clip-text text-transparent cursor-pointer`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.1 + index * 0.15 }}
        whileHover={{
          y: -15, scale: 1.1,
          rotateZ: index % 2 === 0 ? -4 : 4,
          filter: [
            'drop-shadow(0 0 15px rgba(0,255,197,0.4))',
            'drop-shadow(0 0 35px rgba(139,92,246,0.85))',
            'drop-shadow(0 0 20px rgba(0,255,197,0.7))'
          ][index % 3]
        }}
      >
        {char}
      </motion.span>
    </div>
  );
};

export default function App() {
  const [portfolioProjects, setPortfolioProjects] = useState<Project[]>(() => {
    const cached = localStorage.getItem('sharks_portfolio_projects');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return mergeProjectsWithStatic(parsed);
        }
      } catch (err) {
        console.error('Failed to parse portfolio projects from cache:', err);
      }
    }
    return projects;
  });
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const [practiceWorks, setPracticeWorks] = useState<PracticeWork[]>(() => {
    const cached = localStorage.getItem('sharks_portfolio_practice_works');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => ({
            id: item.id || Math.random().toString(36).substring(7),
            title: item.title || '',
            category: item.category || '',
            tags: Array.isArray(item.tags) ? item.tags : [],
            description: item.description || '',
            imageUrl: item.imageUrl || ''
          }));
        }
      } catch (_) {}
    }
    return [
      {
        id: 'p1',
        title: '冬日寻趣 C4D 三维大促质感实验',
        category: '三维渲染 / AIGC创意',
        tags: ['C4D + Octane', 'AIGC 情感化', '2026作品'],
        description: '探索冰雪奇缘式流光渐变在手机大促会场的融合，利用精细拟物化玻璃质感建立冬日寻趣分会场的视觉底色。',
        imageUrl: '/images/practice-winter-render.jpg'
      },
      {
        id: 'p2',
        title: '金秋出游季微立体插画重排',
        category: '视觉探索 / 排版',
        tags: ['大促插画', '色彩实验', '大促练习'],
        description: '秋季明媚与丰收主基调的插图色彩映射，尝试金黄枫树与探索出行的大开排版，凸显金秋出行活动氛围。',
        imageUrl: '/images/practice-autumn-illustration.jpg'
      },
      {
        id: 'p3',
        title: '拍照神器高转化组件化看板',
        category: 'UI/UX / 运营大促',
        tags: ['组件化看板', '日常视觉', '交互引导'],
        description: '利用严谨的栅格系统 and 拟物化组件设计，在拍照神器日常分会场重构用户利益点卡片 and 晒单引导交互流。',
        imageUrl: '/images/practice-camera-board.jpg'
      },
      {
        id: 'p4',
        title: '沉浸灰紫渐变情绪板设计',
        category: '色彩实验 / 灵感定调',
        tags: ['情绪板', '配色演练', '视觉重构'],
        description: '利用高级暗夜紫与拉丝金属的高对比度，为下一个世代的大促运营设计重构视觉情绪触点与品质定调。',
        imageUrl: '/images/travel-photo-season.jpg'
      }
    ];
  });

  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>(() => {
    const cached = localStorage.getItem('sharks_portfolio_library_assets');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
    }
    return PRACTICE_ASSETS_LIBRARY;
  });
  
  const [zoomedPracticeImage, setZoomedPracticeImage] = useState<string | null>(null);
  const [editingPracticeWork, setEditingPracticeWork] = useState<PracticeWork | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    const local = localStorage.getItem('sharks_portfolio_admin_active');
    return local === 'true';
  });
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [contactLinks, setContactLinks] = useState(() => {
    const saved = localStorage.getItem('sharks_footer_links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          wechatQr: parsed.wechatQr || 'https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=300',
          xiaohongshuQr: parsed.xiaohongshuQr || 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=300',
          xiaohongshu: parsed.xiaohongshu || 'https://www.xiaohongshu.com',
          title: (!parsed.title || parsed.title === '联系方式 // CONTACT') ? '联系方式' : parsed.title,
          description: parsed.description || '工作与商务合作请添加微信，或点击、扫描关注我的小红书主页'
        };
      } catch (e) {}
    }
    return {
      wechatQr: 'https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=300',
      xiaohongshuQr: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=300',
      xiaohongshu: 'https://www.xiaohongshu.com',
      title: '联系方式',
      description: '工作与商务合作请添加微信，或点击、扫描关注我的小红书主页'
    };
  });
  const [showContactEditModal, setShowContactEditModal] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sharks_footer_links');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setContactLinks(prev => ({
            ...prev,
            ...parsed
          }));
        } catch (_) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('contact-links-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('contact-links-changed', handleStorageChange);
    };
  }, []);

  // Ashynchronous mount-load from IndexedDB to recover massive base64 images perfectly
  useEffect(() => {
    async function initDBProjects() {
      try {
        const dbProjects = await loadProjectsFromDB();
        if (dbProjects && dbProjects.length > 0) {
          setPortfolioProjects(mergeProjectsWithStatic(dbProjects));
        }
      } catch (err) {
        console.error('Failed async initialization from IndexedDB:', err);
      }
    }

    async function initDBPractice() {
      try {
        const dbPractice = await loadPracticeWorksFromDB();
        if (dbPractice !== null) {
          setPracticeWorks(dbPractice);
        }
      } catch (err) {
        console.error('Failed async initialization of practice works from IndexedDB:', err);
      }
    }

    async function initDBLibrary() {
      try {
        const dbLibrary = await loadLibraryImagesFromDB();
        if (dbLibrary !== null) {
          setLibraryImages(dbLibrary);
        }
      } catch (err) {
        console.error('Failed async initialization of library images from IndexedDB:', err);
      }
    }

    initDBProjects();
    initDBPractice();
    initDBLibrary();
  }, []);

  useEffect(() => {
    // Scan URL query parameter for frictionless access
    const params = new URLSearchParams(window.location.search);
    const keyParam = params.get('admin') || params.get('key');
    if (keyParam === 'wangjunzhen' || keyParam === 'true' || keyParam === '666') {
      setIsAdmin(true);
      safeSetLocalStorage('sharks_portfolio_admin_active', 'true');
    }
  }, []);

  const handleUpdateProject = async (updated: Project) => {
    const nextList = portfolioProjects.map(p => p.id === updated.id ? updated : p);
    setPortfolioProjects(nextList);
    
    // Save to IndexedDB (Primary strategy - unlimited size constraint)
    try {
      await saveProjectsToDB(nextList);
    } catch (err) {
      console.error('IndexedDB save failed for image updates:', err);
    }

    // Secondary fallback (attempts lightweight save, handles quota restriction safely)
    safeSetLocalStorage('sharks_portfolio_projects', JSON.stringify(nextList));
    setSelectedProject(updated);
  };
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0.95]), { stiffness: 100, damping: 30 });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black">
      <CustomCursor />
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 overflow-hidden bg-black select-none">
        {/* Dynamic Liquid Background with soundwaves & 3D chrome pods */}
        <LiquidBackground />
        
        {/* Dark Spatial Cosmic Grid Overlay */}
        <div className="absolute inset-0 spatial-grid opacity-15 invert pointer-events-none" />
        
        {/* 1. Left Vertical Tech Rail - Precision Details */}
        <div className="absolute bottom-12 left-10 hidden xl:flex flex-col gap-6 z-20 font-mono text-[10px] tracking-wider text-white/35">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ffc3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ffc3]"></span>
            </span>
            <span className="text-white/60 font-bold uppercase tracking-widest">SHARKS CORE // SYSTEM ACTIVE</span>
          </div>
          
          <div className="h-[1px] w-24 bg-white/10" />
          
          <div className="flex flex-col gap-1.5">
            <div>LOCATIONCODE: [ SHG-2026 ]</div>
            <div>COORDINATES: [ 31.2304 / 121.4737 ]</div>
            <div>STATUS: CONNECTED // SECURE</div>
          </div>
        </div>

        {/* 2. Right Vertical Tech Rail - Live Metrics & Real-time Clock */}
        <div className="absolute bottom-12 right-10 hidden xl:flex flex-col items-end gap-6 z-20 font-mono text-[10px] tracking-wider text-white/35">
          <div className="text-right">
            <div className="text-white/60 font-bold tracking-widest uppercase mb-1">LOCAL OPERATING TIME</div>
            <div className="text-sm font-semibold text-[#00ffc3] tracking-normal tabular-nums">{timeStr || '12:00:00'}</div>
          </div>
          
          <div className="h-[1px] w-24 bg-white/10" />
          
          <div className="flex flex-col items-end gap-1.5 text-right">
            <div>FRAME RATE: [ 60.0 FPS ]</div>
            <div>RENDERER: WEBGL SECURE</div>
            <div>PORTFOLIO VER. 4.8.2</div>
          </div>
        </div>

        {/* 3. Top Eyebrow Tag Bar */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00ffc3] animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-white/70">WANG JUNZHEN // CREATIVE DESIGNER</span>
        </div>

        {/* 4. Elegant Central Composition Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center flex flex-col items-center max-w-4xl px-4 -mt-16"
        >
          {/* Subtle upper badge */}
          <div className="mb-4">
            <span className="text-[11px] md:text-xs font-mono tracking-[0.3em] uppercase text-indigo-400">
              [ AIGC • DESIGN DESIGNER • INTERACTIVE ART ]
            </span>
          </div>

          {/* Main Display Heading */}
          {/* Main Display Heading Layout */}
          <h1 className="relative flex flex-col items-center justify-center tracking-tight text-white mb-6 mt-8 select-none w-full max-w-5xl mx-auto">
            {/* Cute Floating Decorative Elements Around the Title Container */}
            
            {/* Twinkly Star */}
            <motion.div 
              animate={{ y: [-12, 12, -12], rotate: [0, 15, -15, 0], scale: [0.9, 1.1, 0.9] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute -top-16 left-[5%] md:-top-24 md:-left-[5%] opacity-80 z-0 cursor-pointer"
            >
               <span className="text-4xl md:text-5xl filter drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]">⭐</span>
            </motion.div>
            
            {/* Bouncing Heart */}
            <motion.div 
              animate={{ y: [15, -15, 15], scale: [0.95, 1.15, 0.95] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} 
              className="absolute -bottom-16 right-[5%] md:-bottom-24 md:-right-[5%] opacity-90 z-0 cursor-pointer"
            >
               <span className="text-5xl md:text-6xl filter drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">💖</span>
            </motion.div>
            
            {/* Bubbles */}
            <motion.div 
              animate={{ x: [-10, 10, -10], y: [-5, 5, -5], rotate: [0, 10, 0] }} 
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute top-[20%] -left-[10%] md:-left-[15%] opacity-85 z-0 cursor-pointer"
            >
               <span className="text-4xl filter drop-shadow-[0_0_12px_rgba(0,255,195,0.8)]">🫧</span>
            </motion.div>

            {/* Sparkles / Magic */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.25, 1] }} 
              transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }} 
              className="absolute -top-12 -right-[5%] md:-top-20 md:-right-[10%] z-0 cursor-pointer"
            >
               <Sparkles className="h-10 w-10 md:h-14 md:w-14 text-[#00ffc3] fill-[#00ffc3]/60 filter drop-shadow-[0_0_15px_rgba(0,255,195,0.8)]" />
            </motion.div>

            {/* Center Lockup Container */}
            <div className="relative flex flex-col items-center justify-center z-10 w-full">
              
              {/* Row 1: 脆脆鲨 */}
              <div className="flex justify-center gap-2 sm:gap-4 md:gap-6 text-[6.5rem] sm:text-[8rem] md:text-[10rem] leading-none font-artistic-zh font-normal filter drop-shadow-2xl">
                {['脆', '脆', '鲨'].map((char, index) => {
                  const gradientColors = [
                    'from-[#ffffff] via-[#e2e8f0] to-[#94a3b8]',
                    'from-white via-[#f8fafc] to-[#cbd5e1]',
                    'from-white via-[#00ffc3] to-[#a855f7]'
                  ];
                  return (
                    <EmittingChar key={index} char={char} index={index} gradient={gradientColors[index]} />
                  );
                })}
              </div>

              {/* Row 2: 运营视觉作品集 */}
              <div className="flex justify-center gap-[2px] sm:gap-[6px] md:gap-[12px] mt-3 sm:mt-5 text-[2.4rem] sm:text-[3.5rem] md:text-[4.2rem] font-artistic-zh tracking-widest leading-tight w-full">
                {['运', '营', '视', '觉', '作', '品', '集'].map((char, index) => {
                  const colors = [
                    'from-[#00ffc3] to-[#3b82f6]',
                    'from-[#3b82f6] to-[#6366f1]',
                    'from-[#6366f1] to-[#8b5cf6]',
                    'from-[#8b5cf6] to-[#a855f7]',
                    'from-[#a855f7] to-[#d946ef]',
                    'from-[#d946ef] to-[#ec4899]',
                    'from-[#ec4899] to-[#f43f5e]',
                  ];
                  return (
                    <motion.span
                      key={index}
                      className={`inline-block font-normal bg-gradient-to-r ${colors[index]} bg-clip-text text-transparent cursor-pointer`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 160, damping: 15, delay: 0.5 + index * 0.1 }}
                      whileHover={{
                        y: -12, scale: 1.2,
                        filter: 'drop-shadow(0 6px 15px rgba(0, 255, 195, 0.5))',
                      }}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          </h1>

          {/* Luxury CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const worksSection = document.getElementById('works') || document.getElementById('bento-grid');
              if (worksSection) {
                worksSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
            className="group relative flex items-center gap-3 bg-white/5 border border-white/15 px-8 py-3.5 rounded-full backdrop-blur-md shadow-[0_15px_30px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden transition-all duration-300 hover:border-[#00ffc3]/40"
          >
            {/* Inside sliding glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-sky-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Pulsing Backlight */}
            <div className="absolute -inset-px rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-15 blur-sm transition-opacity duration-300" />

            <span className="text-sm font-semibold tracking-[0.15em] text-white group-hover:text-[#00ffc3] transition-colors duration-300">
              了解更多
            </span>
            <span className="text-xs font-mono text-white/50 group-hover:text-[#00ffc3] group-hover:translate-x-1 transition-all duration-300">
              // DISCOVER ARCHIVE
            </span>
            <ArrowDownRight className="h-4 w-4 text-white/70 group-hover:text-[#00ffc3] group-hover:rotate-45 transition-transform duration-300" />
          </motion.button>
        </motion.div>

        {/* 5. Custom Floating Specialized Chips */}
        <div className="absolute bottom-20 left-12 right-12 z-20 hidden md:flex items-center justify-center gap-8">
          {[
            { tag: "运营视觉", spec: "Campaign Visual Design", delay: 0 },
            { tag: "AIGC", spec: "Midjourney & SD Workflows", delay: 1.2 },
            { tag: "古法3D", spec: "Cinema 4D & Spline Render", delay: 2.4 },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 5 + idx,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
              className="px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-sm flex flex-col items-start gap-1 p shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:border-[#00ffc3]/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="text-[11px] tracking-widest text-[#00ffc3] font-bold">{item.tag}</span>
              </div>
              <span className="text-[10px] text-white/40 tracking-wider font-mono">{item.spec}</span>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Subtle Cinematic Bottom Rim Fade Glow */}
        <div className="absolute bottom-[-15%] left-1/2 -z-10 h-[50vh] w-[130vw] -translate-x-1/2 bg-gradient-to-t from-[#020008] via-transparent to-transparent opacity-95 pointer-events-none" />
      </section>

      {/* Resume Section */}
      <div id="resume">
        <ResumeSection />
      </div>

      {/* Portfolio Section Header */}
      <section id="works" className="relative bg-black py-32 px-6">
        {/* Background Diffusion Glows - High adaptive sizes and centering */}
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-blue-600/5 rounded-full blur-[200px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-purple-600/5 rounded-full blur-[200px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center mb-32">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-wrap justify-center gap-x-[0.4em] text-7xl font-black italic tracking-tighter md:text-9xl mb-6"
            >
              {["WELCOME", "TO", "WATCH"].map((word, wordIdx) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {portfolioProjects.map((project, index) => (
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

      {/* 其他个人作品展示 // PERSONAL WORKS EXHIBITION */}
      <section className="relative bg-black pb-32 px-6">
        {/* Cyber aesthetic indicators or decorative backgrounds */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-white/5 pb-6 mb-12 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00ffc3] animate-pulse" />
                <span className="text-[11px] font-mono text-[#00ffc3] font-bold uppercase tracking-[0.3em]">
                  Personal // Visual Experiments
                </span>
              </div>
              <h3 className="text-4xl font-black text-white tracking-tight uppercase">
                其他个人作品展示 <span className="text-zinc-500 font-light">• PERSONAL WORKS</span>
              </h3>
              <p className="text-sm text-zinc-400 font-medium">
                日常三维建模演练、AIGC素材融合及视觉美学探索（竖版 3:4 沉淀）
              </p>
              
              {isAdmin && (
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newWork: PracticeWork = {
                        id: 'p_new_' + Date.now(),
                        title: '新上传个人作品',
                        category: '双模渲染 / 独立设计',
                        tags: ['大促', 'AIGC', '2026'],
                        description: '自定义作品说明及物料介绍。',
                        imageUrl: ''
                      };
                      const nextWorks = [...practiceWorks, newWork];
                      setPracticeWorks(nextWorks);
                      savePracticeWorksToDB(nextWorks);
                      safeSetLocalStorage('sharks_portfolio_practice_works', JSON.stringify(nextWorks));
                      setEditingPracticeWork(newWork);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 active:scale-95 text-xs text-white font-bold transition-all border border-purple-500 shadow-[0_4px_12px_rgba(168,85,247,0.3)] cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>添加新卡片 // Add Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setPracticeWorks([]);
                      await savePracticeWorksToDB([]);
                      safeSetLocalStorage('sharks_portfolio_practice_works', JSON.stringify([]));
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/40 hover:bg-rose-900 border border-rose-500/30 text-rose-400 hover:text-white active:scale-95 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>清空所有素材 // Clear All</span>
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const defaults = [
                        {
                          id: 'p1',
                          title: '冬日寻趣 C4D 三维大促质感实验',
                          category: '三维渲染 / AIGC创意',
                          tags: ['C4D + Octane', 'AIGC 情感化', '2026作品'],
                          description: '探索冰雪奇缘式流光渐变在手机大促会场的融合，利用精细拟物化玻璃质感建立冬日寻趣分会场的视觉底色。',
                          imageUrl: '/images/practice-winter-render.jpg'
                        },
                        {
                          id: 'p2',
                          title: '金秋出游季微立体插画重排',
                          category: '视觉探索 / 排版',
                          tags: ['大促插画', '色彩实验', '大促练习'],
                          description: '秋季明媚与丰收主基调 of 插图色彩映射，尝试金黄枫树与探索出行的大开排版，凸显金秋出行活动氛围。',
                          imageUrl: '/images/practice-autumn-illustration.jpg'
                        },
                        {
                          id: 'p3',
                          title: '拍照神器高转化组件化看板',
                          category: 'UI/UX / 运营大促',
                          tags: ['组件化看板', '日常视觉', '交互引导'],
                          description: '利用严谨的栅格系统和拟物化组件设计，在拍照神器日常分会场重构用户利益点卡片和晒单引导交互流。',
                          imageUrl: '/images/practice-camera-board.jpg'
                        },
                        {
                          id: 'p4',
                          title: '沉浸灰紫渐变情绪板 design',
                          category: '色彩实验 / 灵感定调',
                          tags: ['情绪板', '配色演练', '视觉重构'],
                          description: '利用高级暗夜紫与拉丝金属的高对比度，为下一个世代的大促运营设计重构视觉情绪触点与品质定调。',
                          imageUrl: '/images/travel-photo-season.jpg'
                        }
                      ];
                      setPracticeWorks(defaults);
                      await savePracticeWorksToDB(defaults);
                      safeSetLocalStorage('sharks_portfolio_practice_works', JSON.stringify(defaults));
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white active:scale-95 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>恢复预装模版 // Restore</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 bg-neutral-900/40 rounded-full px-4 py-1.5 border border-white/5 select-none self-start md:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CYBER_RATIO: 3:4_VERTICAL_4:3</span>
            </div>
          </div>

          {/* Practice Works Grid / Display Container */}
          {practiceWorks.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-3xl py-16 px-6 text-center bg-zinc-950/40">
              <Image className="h-12 w-12 text-zinc-600 mb-4 animate-pulse" />
              <h4 className="text-base font-bold text-zinc-300">暂无个人作品内容 / Materials Gallery is Empty</h4>
              <p className="text-xs text-zinc-500 mt-2 max-w-sm">
                当前板块中已没有任何图片素材。如果您是超级管理员，可以使用上方【添加新卡片】按钮上传并重新构建您的个人作品。
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    const newWork: PracticeWork = {
                      id: 'p_new_' + Date.now(),
                      title: '新上传个人作品',
                      category: '双模渲染 / 独立设计',
                      tags: ['大促', 'AIGC', '2026'],
                      description: '自定义作品说明及物料介绍。',
                      imageUrl: ''
                    };
                    const nextWorks = [...practiceWorks, newWork];
                    setPracticeWorks(nextWorks);
                    savePracticeWorksToDB(nextWorks);
                    safeSetLocalStorage('sharks_portfolio_practice_works', JSON.stringify(nextWorks));
                    setEditingPracticeWork(newWork);
                  }}
                  className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs text-white font-bold transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>立即创建第一个作品卡片</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {practiceWorks.map((work, idx) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative aspect-[3/4] w-full bg-zinc-950 rounded-3xl cursor-zoom-in select-none"
                  onClick={() => work.imageUrl && setZoomedPracticeImage(work.imageUrl)}
                >
                  {/* 1. Rotational conic flux gradient border flow wrapping around the card perimeter */}
                  <div className="absolute -inset-[1.5px] rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                    <div className="absolute top-1/2 left-1/2 w-[350%] h-[350%] bg-[conic-gradient(from_0deg,transparent_15%,#c084fc_35%,#00ffc3_50%,#818cf8_65%,transparent_85%)] animate-rotate-flux" />
                  </div>

                  {/* 2. Inner container acting as mask and content wrapper */}
                  <div className="absolute inset-[1.5px] rounded-[22px] overflow-hidden bg-zinc-950 z-10">
                    {/* Pure Practice Image/Video without blurring */}
                    {work.imageUrl ? (
                      isVideoUrl(work.imageUrl) ? (
                        <video
                          src={work.imageUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center p-6 text-center">
                        <Image className="h-8 w-8 text-neutral-600 mb-2" />
                        <span className="text-[10px] text-zinc-500 font-mono">NO IMAGE/VIDEO</span>
                        <span className="text-[9px] text-zinc-650 mt-1">点击编辑并指定或上传图片/视频</span>
                      </div>
                    )}

                    {/* High Contrast Hover Overlay for Pure Image Experiencing */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-6 z-15">
                      
                      {/* Top bar with ratio & optional admin action */}
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[9px] font-mono text-[#00ffc3]/90 font-bold uppercase tracking-wider bg-black/60 border border-[#00ffc3]/20 px-2.5 py-1 rounded-md">
                          {work.category || 'RATIO // 3:4'}
                        </span>
                        
                        {isAdmin && (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPracticeWork(work);
                              }}
                              className="flex h-8 px-2.5 items-center gap-1 hover:scale-105 rounded-xl border border-white/20 bg-black/80 text-xs font-bold text-zinc-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-900/40 cursor-pointer transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                              title="编辑作品"
                            >
                              <Edit2 className="h-3 w-3 text-purple-400" />
                              <span>编辑</span>
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const nextWorks = practiceWorks.filter(w => w.id !== work.id);
                                setPracticeWorks(nextWorks);
                                await savePracticeWorksToDB(nextWorks);
                                safeSetLocalStorage('sharks_portfolio_practice_works', JSON.stringify(nextWorks));
                              }}
                              className="flex h-8 px-2 items-center justify-center rounded-xl border border-rose-950 bg-rose-950/20 text-rose-400 hover:text-rose-100 hover:bg-rose-900/40 hover:border-rose-500 cursor-pointer transition-all shadow-[0_4px_10px_rgba(244,63,94,0.1)]"
                              title="删除作品"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Bottom metadata - slides up slightly on hover */}
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-sm font-bold text-white tracking-wide leading-snug font-sans">
                          {work.title}
                        </h4>
                        {work.description && (
                          <p className="text-[9px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {work.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Aesthetic idle indicators on pure image */}
                    {work.imageUrl && (
                      <div className="absolute top-4 right-4 bg-black/40 border border-white/10 text-[9px] font-mono text-zinc-400 px-3 py-1.5 rounded-md group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                        TAP TO VIEW
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-black px-4 py-32 text-center border-t border-white/5 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.4em] text-purple-400 font-mono">// 建立合作 //</span>
          
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl">
            {contactLinks.title}
          </h2>
          
          <p className="max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed font-sans px-4">
            {contactLinks.description}
          </p>

          {/* Interactive QR Display Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 max-w-2xl mx-auto px-4">
            {/* WeChat Card */}
            <div 
              onClick={() => {
                if (contactLinks.wechatQr) {
                  setZoomedPracticeImage(contactLinks.wechatQr);
                }
              }}
              className="relative group/card aspect-square bg-zinc-950/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.12)] transition-all duration-500 cursor-zoom-in"
            >
              <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase self-center">// 微信二维码 //</span>
              <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/card:scale-105">
                <img 
                  src={contactLinks.wechatQr} 
                  alt="微信二维码" 
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <div className="text-center w-full mt-2">
                <h4 className="text-sm font-black text-white tracking-widest">微信二维码</h4>
                <p className="text-[10px] text-zinc-500 mt-1 tracking-wider">点击或扫码放大添加微信</p>
              </div>
            </div>

            {/* Xiaohongshu Card */}
            <div 
              onClick={() => {
                if (contactLinks.xiaohongshu) {
                  window.open(contactLinks.xiaohongshu, '_blank');
                }
              }}
              className="relative group/card aspect-square bg-zinc-950/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-rose-500/50 hover:shadow-[0_0_40px_rgba(244,63,94,0.12)] transition-all duration-500 cursor-pointer text-center overflow-hidden"
            >
              {/* Outer top-right redirect icon */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (contactLinks.xiaohongshu) {
                    window.open(contactLinks.xiaohongshu, '_blank');
                  }
                }}
                className="absolute top-4 right-4 z-20 h-9 w-9 bg-black/80 hover:bg-rose-600 hover:border-rose-500 hover:text-white hover:scale-110 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 transition-all shadow-md cursor-pointer"
                title="点击跳转至小红书主页"
              >
                <ArrowUpRight className="h-4.5 w-4.5" />
              </button>

              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-500 uppercase self-center">// 小红书个人主页 //</span>
              
              <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/card:scale-105">
                <img 
                  src={contactLinks.xiaohongshuQr} 
                  alt="小红书二维码" 
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>

              <div className="w-full mt-2">
                <h4 className="text-sm font-black text-white tracking-widest">
                  小红书主页
                </h4>
                <p className="text-[10px] text-zinc-500 mt-1 tracking-wider">点击跳转或扫码关注</p>
              </div>
            </div>
          </div>

          {/* Admin editing access button */}
          {isAdmin && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShowContactEditModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-400 hover:bg-purple-950/40 hover:border-purple-500/50 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-purple-500/10"
              >
                <Edit2 className="h-4 w-4" />
                <span>编辑页尾与联系方式</span>
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetail 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onUpdateProject={handleUpdateProject}
      />

      {/* Practice Work Zoom Lightbox */}
      <AnimatePresence>
        {zoomedPracticeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedPracticeImage(null)}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/98 p-4 md:p-12 select-none"
          >
            <button
              onClick={() => setZoomedPracticeImage(null)}
              className="absolute top-8 right-8 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300 pointer-events-auto"
            >
              <X className="h-6 w-6" />
            </button>

            {isVideoUrl(zoomedPracticeImage) ? (
              <motion.video
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                src={zoomedPracticeImage}
                controls
                autoPlay
                loop
                muted={false}
                playsInline
                className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain selection:bg-transparent pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                src={zoomedPracticeImage}
                alt="Practice Work Zoom View"
                className="max-h-[90vh] max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain selection:bg-transparent pointer-events-auto"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Practice Work Dialogue Modal */}
      <AnimatePresence>
        {isAdmin && editingPracticeWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditingPracticeWork(null)}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex justify-center items-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-[0_0_50px_rgba(167,139,250,0.2)] flex flex-col gap-6 my-8"
            >
              <button
                onClick={() => setEditingPracticeWork(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-[0.2em] block mb-1">
                  EDIT PERSONAL WORK // 个人作品物料修改
                </span>
                <h4 className="text-xl font-black text-white tracking-widest uppercase mb-1">编辑其他个人作品</h4>
                <p className="text-xs text-zinc-400">
                  自定义本栏目的标题、分类标签、细节描述及高画质视觉物料。可在下方素材库快速选用高精度图片，亦可直接本地上传。
                </p>
              </div>

              {/* Form elements */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const nextWorks = practiceWorks.map(w => w.id === editingPracticeWork.id ? editingPracticeWork : w);
                  setPracticeWorks(nextWorks);
                  savePracticeWorksToDB(nextWorks);
                  safeSetLocalStorage('sharks_portfolio_practice_works', JSON.stringify(nextWorks));
                  
                  // Automatically save any new custom/pasted image into the system material library as well
                  if (editingPracticeWork.imageUrl) {
                    const exists = libraryImages.some(lib => lib.path === editingPracticeWork.imageUrl);
                    if (!exists) {
                      const newAsset: LibraryImage = {
                        id: 'lib_auto_' + Date.now(),
                        name: `保存物料・${editingPracticeWork.title || '自定义图片'}`,
                        category: "个人作品",
                        path: editingPracticeWork.imageUrl,
                        ratio: "3:4",
                        description: "保存作品时自动加入素材库的作品主图"
                      };
                      const nextLib = [newAsset, ...libraryImages];
                      setLibraryImages(nextLib);
                      saveLibraryImagesToDB(nextLib);
                      safeSetLocalStorage('sharks_portfolio_library_assets', JSON.stringify(nextLib));
                    }
                  }

                  setEditingPracticeWork(null);
                }}
                className="space-y-4 text-left"
              >
                {/* Visual Material Library Grid / 独立素材库 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">
                      🖼️ System Material Library // 系统素材主库
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-purple-400 font-bold">
                        {libraryImages.length} 个模版素材
                      </span>
                      <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-500/40 bg-purple-950/20 hover:bg-purple-900/40 text-[9px] font-mono font-bold text-purple-300 hover:text-white cursor-pointer transition-all">
                        <Plus className="h-3 w-3 text-purple-400" />
                        <span>增设新素材</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  const rawName = file.name.replace(/\.[^/.]+$/, "");
                                  const name = prompt("请为上传的系统素材单独命名 / Set Name:", rawName) || rawName;
                                  const newAsset: LibraryImage = {
                                    id: 'lib_' + Date.now(),
                                    name: name,
                                    category: "独立素材库",
                                    path: reader.result,
                                    ratio: "3:4",
                                    description: "用户上传保存的独立素材库图片/视频"
                                  };
                                  const nextLib = [newAsset, ...libraryImages];
                                  setLibraryImages(nextLib);
                                  saveLibraryImagesToDB(nextLib);
                                  safeSetLocalStorage('sharks_portfolio_library_assets', JSON.stringify(nextLib));
                                  
                                  // Select instantly
                                  setEditingPracticeWork({
                                    ...editingPracticeWork,
                                    imageUrl: reader.result
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Grid or micro scroll container */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-h-[190px] overflow-y-auto p-1.5 bg-neutral-900/40 rounded-2xl border border-white/5">
                    {libraryImages.map((asset) => {
                      const isSelected = editingPracticeWork.imageUrl === asset.path;
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setEditingPracticeWork({
                            ...editingPracticeWork,
                            imageUrl: asset.path
                          })}
                          className={`group relative cursor-pointer rounded-xl border p-1 transition-all duration-300 ${
                            isSelected 
                              ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.35)]' 
                              : 'bg-zinc-950/60 border-white/5 hover:border-purple-500/30 hover:bg-zinc-900/90'
                          }`}
                        >
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900">
                            {asset.path ? (
                              isVideoUrl(asset.path) ? (
                                <video
                                  src={asset.path}
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src={asset.path}
                                  alt={asset.name}
                                  className="w-full h-full object-cover"
                                />
                              )
                            ) : (
                              <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
                                <Image className="h-4 w-4 text-zinc-650" />
                              </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-black/80 text-[7px] font-mono text-[#00ffc3] px-1 rounded border border-white/5 z-10">
                              {asset.ratio}
                            </div>

                            {/* Floating Delete from Library Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextLib = libraryImages.filter(item => item.id !== asset.id);
                                setLibraryImages(nextLib);
                                saveLibraryImagesToDB(nextLib);
                                safeSetLocalStorage('sharks_portfolio_library_assets', JSON.stringify(nextLib));
                                
                                // If the deleted image was selected, clean it up
                                if (editingPracticeWork.imageUrl === asset.path) {
                                  setEditingPracticeWork({
                                    ...editingPracticeWork,
                                    imageUrl: ''
                                  });
                                }
                              }}
                              className="absolute top-1 right-1 h-5 w-5 rounded bg-black/95 hover:bg-rose-950 hover:border-rose-500 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer pointer-events-auto"
                              title="删除此素材"
                            >
                              <Trash2 className="h-2.5 w-2.5 text-rose-400 group-hover:text-rose-200" />
                            </button>
                          </div>
                          
                          {/* Inner title and description */}
                          <div className="mt-1 px-1">
                            <h5 className="text-[8px] text-white font-bold truncate leading-tight" title={asset.name}>
                              {asset.name}
                            </h5>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* File Image/Video Selector & Dropzone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    Custom Image/Video Upload & Link // 本地上传或粘贴外部链接
                  </label>
                  <div className="flex items-center gap-4 bg-neutral-900 border border-white/10 rounded-2xl p-4">
                    <div className="w-16 h-20 bg-zinc-850 rounded-xl overflow-hidden border border-white/5 flex-shrink-0 flex items-center justify-center relative">
                      {editingPracticeWork.imageUrl ? (
                        isVideoUrl(editingPracticeWork.imageUrl) ? (
                          <video
                            src={editingPracticeWork.imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={editingPracticeWork.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <Image className="h-5 w-5 text-zinc-650" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-2">
                        <label className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors duration-200 uppercase inline-block">
                          选择本地文件 / Upload File
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setEditingPracticeWork({
                                      ...editingPracticeWork,
                                      imageUrl: reader.result
                                    });

                                    // Automatically save new local uploads into the system material library
                                    const rawName = file.name.replace(/\.[^/.]+$/, "");
                                    const nextImgName = `上传・${rawName}`;
                                    const exists = libraryImages.some(lib => lib.path === reader.result);
                                    if (!exists) {
                                      const newAsset: LibraryImage = {
                                        id: 'lib_upload_' + Date.now(),
                                        name: nextImgName,
                                        category: "本地上传",
                                        path: reader.result,
                                        ratio: "3:4",
                                        description: "通过本地上传自动备份的素材/视频"
                                      };
                                      const nextLib = [newAsset, ...libraryImages];
                                      setLibraryImages(nextLib);
                                      saveLibraryImagesToDB(nextLib);
                                      safeSetLocalStorage('sharks_portfolio_library_assets', JSON.stringify(nextLib));
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        支持上传本地 PNG、JPG、WEBP 格式图片，或 MP4、WebM 格式视频，自动转存。
                      </p>
                    </div>
                  </div>
                  {/* Text Input for URL fallback */}
                  <input
                    type="text"
                    value={editingPracticeWork.imageUrl || ''}
                    onChange={(e) => setEditingPracticeWork({
                      ...editingPracticeWork,
                      imageUrl: e.target.value
                    })}
                    placeholder="或者此处会自动同步当前所选素材的对应路径 / 亦可在此直接填入自定义外部 URL"
                    className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-2.5 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Form input fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                       Work Title // 作品名称
                    </label>
                    <input
                      type="text"
                      value={editingPracticeWork.title || ''}
                      onChange={(e) => setEditingPracticeWork({
                        ...editingPracticeWork,
                        title: e.target.value
                      })}
                      className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                      Category // 核心分类
                    </label>
                    <input
                      type="text"
                      value={editingPracticeWork.category || ''}
                      onChange={(e) => setEditingPracticeWork({
                        ...editingPracticeWork,
                        category: e.target.value
                      })}
                      className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    Sub-Tags // 细分标签 (逗号分隔)
                  </label>
                  <input
                    type="text"
                    value={editingPracticeWork.tags?.join(', ') || ''}
                    onChange={(e) => setEditingPracticeWork({
                      ...editingPracticeWork,
                      tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    Description // 创作说明
                  </label>
                  <textarea
                    rows={3}
                    value={editingPracticeWork.description || ''}
                    onChange={(e) => setEditingPracticeWork({
                      ...editingPracticeWork,
                      description: e.target.value
                    })}
                    className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/30 rounded-xl py-3.5 text-xs font-black tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase shadow-lg shadow-purple-950/40"
                >
                  <Check className="h-4 w-4" />
                  <span>SAVE CHANGES // 保存更改</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-neutral-950 py-12 px-8 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="text-left">
            <p className="text-xs text-white/40 tracking-wider transition-colors hover:text-white/60">
              &copy; 2026 SHARKS DESIGN STUDIO &bull; 脆脆鲨的作品集 &bull; 设计版权所有
            </p>
            <p className="text-[10px] font-mono text-white/20 mt-1 uppercase tracking-widest">
              Built with precision and high-contrast digital craftsmanship
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
              <span className={`inline-block w-2 h-2 rounded-full ${isAdmin ? 'bg-emerald-400 animate-pulse' : 'bg-white/10'}`} />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/50">
                {isAdmin ? 'ADMIN AUTH ACTIVE' : 'SECURE GUEST MODE'}
              </span>
            </div>

            {isAdmin ? (
              <button
                onClick={() => {
                  setIsAdmin(false);
                  localStorage.removeItem('sharks_portfolio_admin_active');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 hover:border-rose-500/50 text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
                <span>Exit Portal // 退出</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setLoginError('');
                  setShowAdminModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/20 text-purple-400 hover:bg-purple-950/40 hover:border-purple-500/50 text-[10px] font-mono font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                <Lock className="h-3 w-3" />
                <span>Designer portal // 登录</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Admin Verification Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAdminModal(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-center items-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(167,139,250,0.15)] text-center flex flex-col gap-6"
            >
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-[0.2em] block mb-1">
                  DESIGNER AUTHENTICATION
                </span>
                <h4 className="text-xl font-black text-white tracking-widest uppercase mb-1">设计师后台验证</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  请输入设计师凭证进入内容管理面板，解锁作品集的高级设计物料替换功能。
                </p>
              </div>

              {loginSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 space-y-3 flex flex-col items-center"
                >
                  <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </div>
                  <span className="text-sm font-bold text-emerald-400 font-mono tracking-widest uppercase">ACCESS GRANTED // 验证成功</span>
                  <p className="text-[11px] text-zinc-400">欢迎回来，设计师王军震。素材替换功能已全面开启。</p>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (adminPasswordInput === '232323.Aike') {
                      setLoginSuccess(true);
                      setLoginError('');
                      setTimeout(() => {
                        setIsAdmin(true);
                        safeSetLocalStorage('sharks_portfolio_admin_active', 'true');
                        setShowAdminModal(false);
                        setLoginSuccess(false);
                        setAdminPasswordInput('');
                      }, 1500);
                    } else {
                      setLoginError('认证钥匙不匹配，请重新输入');
                    }
                  }}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Access Key // 验证密钥</label>
                    <input
                      type="password"
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="请输入认证密码"
                      className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:bg-neutral-800 transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  {loginError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-rose-500 bg-rose-950/10 border border-rose-500/20 px-3 py-2 rounded-xl text-center font-bold"
                    >
                      {loginError}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/30 rounded-xl py-3.5 text-xs font-black tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer uppercase shadow-lg shadow-purple-950/40"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>VERIFY ACCESS // 安全登录</span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Info Edit Modal */}
      <AnimatePresence>
        {showContactEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactEditModal(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-center items-center p-4 text-white"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(167,139,250,0.15)] flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowContactEditModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1 text-center">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-[0.2em] block mb-1">
                  // 联系方式配置 //
                </span>
                <h4 className="text-xl font-black text-white tracking-widest uppercase mb-1">设计联系方式修改</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  更新页尾尾页的内容文字、小红书跳转链接以及上传、替换您的联系二维码。
                </p>
              </div>

              <div className="space-y-4 text-left">
                {/* 1. Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    页尾标题
                  </label>
                  <input
                    type="text"
                    value={contactLinks.title}
                    onChange={(e) => setContactLinks({ ...contactLinks, title: e.target.value })}
                    placeholder="例如: 联系方式"
                    className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* 2. Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    页尾描述文案
                  </label>
                  <textarea
                    rows={2}
                    value={contactLinks.description}
                    onChange={(e) => setContactLinks({ ...contactLinks, description: e.target.value })}
                    placeholder="业务合作、咨询请扫码..."
                    className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 resize-none transition-colors"
                  />
                </div>

                {/* 3. WeChat QR Code */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    微信二维码图片
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contactLinks.wechatQr}
                      onChange={(e) => setContactLinks({ ...contactLinks, wechatQr: e.target.value })}
                      placeholder="图片网络地址/粘贴链接"
                      className="flex-1 bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                    />
                    <label className="shrink-0 flex items-center justify-center gap-1.5 bg-neutral-900 border border-white/10 hover:border-purple-500 hover:bg-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold cursor-pointer text-zinc-300 hover:text-white transition-all">
                      <Upload className="h-3.5 w-3.5" />
                      <span>上传二维码</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => {
                              if (typeof r.result === 'string') {
                                setContactLinks(prev => ({ ...prev, wechatQr: r.result as string }));
                              }
                            };
                            r.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 4. Xiaohongshu QR Code */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    小红书二维码图片
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={contactLinks.xiaohongshuQr}
                      onChange={(e) => setContactLinks({ ...contactLinks, xiaohongshuQr: e.target.value })}
                      placeholder="图片网络地址/粘贴链接"
                      className="flex-1 bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                    />
                    <label className="shrink-0 flex items-center justify-center gap-1.5 bg-neutral-900 border border-white/10 hover:border-purple-500 hover:bg-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold cursor-pointer text-zinc-300 hover:text-white transition-all">
                      <Upload className="h-3.5 w-3.5" />
                      <span>上传二维码</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onloadend = () => {
                              if (typeof r.result === 'string') {
                                setContactLinks(prev => ({ ...prev, xiaohongshuQr: r.result as string }));
                              }
                            };
                            r.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 5. Xiaohongshu Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                    小红书跳转地址
                  </label>
                  <input
                    type="text"
                    value={contactLinks.xiaohongshu}
                    onChange={(e) => setContactLinks({ ...contactLinks, xiaohongshu: e.target.value })}
                    placeholder="https://www.xiaohongshu.com/user/profile/..."
                    className="w-full bg-neutral-900 border border-white/10 text-xs text-white rounded-xl px-4 py-3 outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('sharks_footer_links', JSON.stringify(contactLinks));
                    // Dispatch cross-component change trigger for high-fidelity sync
                    window.dispatchEvent(new Event('storage'));
                    window.dispatchEvent(new Event('contact-links-changed'));
                    setShowContactEditModal(false);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white border border-purple-500/30 rounded-xl py-3.5 text-xs font-black tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase shadow-lg shadow-purple-950/40 mt-4"
                >
                  <Check className="h-4 w-4" />
                  <span>保存基本设置</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer isAdmin={isAdmin} />
    </div>
  );
}

