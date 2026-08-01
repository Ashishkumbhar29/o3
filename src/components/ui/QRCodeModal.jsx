import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, Heart } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const QRCodeModal = ({ isOpen, onClose }) => {
  const { data } = useProposal();

  if (!isOpen) return null;

  const currentUrl = window.location.href;

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
              <QrCode className="w-5 h-5 text-rose-400" />
              <h3 className="text-lg font-bold text-white">Instant QR Code</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-pink-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white flex items-center justify-center mx-auto w-fit shadow-2xl">
            <QRCodeSVG value={currentUrl} size={180} fgColor="#0b0314" bgColor="#ffffff" level="H" />
          </div>

          <div>
            <h4 className="text-base font-extrabold text-white font-cursive text-glow">
              {data.names.coupleTitle}
            </h4>
            <p className="text-xs text-pink-200/80 font-light mt-1">
              Scan with your smartphone camera to open our love story instantly!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
