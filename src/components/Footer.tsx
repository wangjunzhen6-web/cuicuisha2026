import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, BookOpen, X } from 'lucide-react';

export default function Footer() {
  const [links] = useState({
    wechatQr: 'https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=300',
    xiaohongshu: 'https://www.xiaohongshu.com'
  });
  const [showWechatModal, setShowWechatModal] = useState(false);

  return (
    <footer className="bg-black text-white py-16 border-t border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Contact Links */}
        <div className="flex gap-8">
          <button 
            type="button"
            onClick={() => setShowWechatModal(true)}
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-green-600 group-hover:shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all">
              <MessageSquare className="h-4 w-4" />
            </div>
            <span className="font-mono text-xs tracking-wider uppercase underline">微信联系</span>
          </button>
          
          <a 
            href={links.xiaohongshu} 
            target="_blank" 
            rel="noreferrer" 
            className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-rose-600 group-hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-mono text-xs tracking-wider uppercase underline">小红书主页</span>
          </a>
        </div>
      </div>

      {/* WeChat QR Preview Modal */}
      <AnimatePresence>
        {showWechatModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setShowWechatModal(false)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-white"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-950 border border-white/15 p-8 rounded-3xl w-full max-w-sm text-center relative shadow-2xl flex flex-col items-center gap-6"
            >
              <button 
                onClick={() => setShowWechatModal(false)} 
                className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer p-1.5 rounded-lg hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-mono font-black text-green-500 tracking-[0.2em] uppercase">// 微信联系 //</span>
                <h3 className="text-base font-black tracking-widest uppercase">扫描二维码添加微信</h3>
              </div>

              {/* Minimal Clean QR Frame */}
              <div className="p-4 bg-white rounded-2xl shadow-xl w-48 h-48 flex items-center justify-center border border-white/10 relative overflow-hidden">
                <img 
                  src={links.wechatQr} 
                  alt="WeChat QR Code" 
                  className="w-full h-full object-contain"
                />
              </div>

              <span className="text-xs text-zinc-500 font-mono tracking-wide leading-relaxed">
                扫一扫添加，支持商务合作与视觉概念咨询
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
