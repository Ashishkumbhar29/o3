import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const ShareModal = ({ isOpen, onClose }) => {
  const { data } = useProposal();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `Check out our special love story created by ${data.names.partner1} for ${data.names.partner2}! ❤️`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-rose-500/40 shadow-2xl relative text-center space-y-5"
        >
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white">Share Our Story</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-pink-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={shareWhatsApp}
              className="p-3.5 rounded-2xl glass-card hover:bg-emerald-500/20 border border-emerald-400/30 flex flex-col items-center gap-2 text-xs font-semibold text-emerald-300"
            >
              <MessageCircle className="w-6 h-6 text-emerald-400" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareTelegram}
              className="p-3.5 rounded-2xl glass-card hover:bg-cyan-500/20 border border-cyan-400/30 flex flex-col items-center gap-2 text-xs font-semibold text-cyan-300"
            >
              <Send className="w-6 h-6 text-cyan-400" />
              <span>Telegram</span>
            </button>
            <button
              onClick={handleCopy}
              className="p-3.5 rounded-2xl glass-card hover:bg-rose-500/20 border border-rose-400/30 flex flex-col items-center gap-2 text-xs font-semibold text-rose-300"
            >
              {copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6 text-rose-400" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-pink-200/80 truncate">
            {currentUrl}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
