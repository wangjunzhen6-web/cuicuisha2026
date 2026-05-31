import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Save, X, MessageSquare, BookOpen, Upload, Check } from 'lucide-react';

export default function Footer({ isAdmin }: { isAdmin: boolean }) {
  const [links, setLinks] = useState({
    wechatQr: 'https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=300',
    xiaohongshu: 'https://xiaohongshu.com/user/profile/...'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showWechatModal, setShowWechatModal] = useState(false);
  const [editForm, setEditForm] = useState(links);
  const [localIsAdmin, setLocalIsAdmin] = useState(isAdmin);

  useEffect(() => {
    setLocalIsAdmin(isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    const saved = localStorage.getItem('sharks_footer_links');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLinks(parsed);
      setEditForm(parsed);
    }
  }, []);

  // Reactive synchronizations for administrator active session
  useEffect(() => {
    const checkState = () => {
      setLocalIsAdmin(typeof window !== 'undefined' && localStorage.getItem('sharks_portfolio_admin_active') === 'true');
      const saved = localStorage.getItem('sharks_footer_links');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setLinks(parsed);
          setEditForm(parsed);
        } catch (_) {}
      }
    };
    window.addEventListener('storage', checkState);
    window.addEventListener('admin-state-changed', checkState);
    window.addEventListener('contact-links-changed', checkState);
    return () => {
      window.removeEventListener('storage', checkState);
      window.removeEventListener('admin-state-changed', checkState);
      window.removeEventListener('contact-links-changed', checkState);
    };
  }, []);

  const handleSave = () => {
    setLinks(editForm);
    localStorage.setItem('sharks_footer_links', JSON.stringify(editForm));
    setIsEditing(false);
  };

  const handleWechatQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename: file.name, base64: reader.result })
            });
            const data = await res.json();
            if (data.success && data.url) {
              setEditForm(prev => ({ ...prev, wechatQr: data.url }));
            } else {
              setEditForm(prev => ({ ...prev, wechatQr: reader.result as string }));
            }
          } catch (err) {
            setEditForm(prev => ({ ...prev, wechatQr: reader.result as string }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

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

        {/* Dynamic Edit Anchor */}
        {localIsAdmin && (
          <button 
            onClick={() => {
              setEditForm(links);
              setIsEditing(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 hover:border-purple-500/50 text-[10px] font-mono tracking-widest uppercase text-zinc-400 hover:text-white transition-all border border-white/5 cursor-pointer"
          >
            <Edit2 className="h-3 w-3 text-purple-400" />
            编辑联系方式
          </button>
        )}
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
                  referrerPolicy="no-referrer"
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

      {/* Editor Modal */}
      <AnimatePresence>
        {localIsAdmin && isEditing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(false)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 text-white"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-zinc-950 border border-purple-500/20 p-8 rounded-3xl w-full max-w-md space-y-6 shadow-[0_0_50px_rgba(168,85,247,0.15)]"
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="text-base font-black uppercase tracking-widest">编辑个人跳转与二维码</h3>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* WeChat section */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-black text-purple-400 uppercase tracking-wider">// 微信二维码</label>
                
                {/* File selection trigger */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={editForm.wechatQr}
                    onChange={e => setEditForm({ ...editForm, wechatQr: e.target.value })}
                    className="flex-grow bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-purple-500"
                    placeholder="输入微信二维码图片链接"
                  />
                  <label className="relative shrink-0 flex items-center justify-center gap-1.5 bg-zinc-900 border border-white/10 hover:border-purple-500 hover:bg-neutral-800 rounded-xl px-4 py-3 text-xs font-semibold cursor-pointer text-zinc-300 hover:text-white transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>本地上传</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleWechatQrUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* Xiaohongshu section */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-black text-purple-400 uppercase tracking-wider">// 小红书个人主页</label>
                <input 
                  value={editForm.xiaohongshu}
                  onChange={e => setEditForm({ ...editForm, xiaohongshu: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-purple-500"
                  placeholder="https://xiaohongshu.com/user/profile/..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)} 
                  className="px-4 py-2 border border-white/10 text-zinc-400 hover:text-white rounded-xl text-xs font-mono uppercase cursor-pointer"
                >
                  取消
                </button>
                <button 
                  type="button"
                  onClick={handleSave} 
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-purple-500/20"
                >
                  <Save className="h-4 w-4" /> 保存修改
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
