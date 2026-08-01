import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, KeyRound, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const PasswordLock = () => {
  const { unlockApp, data } = useProposal();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = unlockApp(passcode);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090212] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/20 shadow-2xl relative z-10 text-center backdrop-blur-2xl"
      >
        {/* Lock Header Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500/20 to-pink-500/30 border border-rose-400/40 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <Lock className="w-10 h-10 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
          </motion.div>
          <div className="absolute -top-1 -right-1 bg-rose-500 p-1.5 rounded-full text-white shadow-md">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white tracking-wide font-cursive mb-2 text-glow">
          {data.names.coupleTitle}
        </h1>
        <p className="text-sm text-pink-200/80 mb-6 font-light">
          Enter the secret passcode to enter our private love story.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-300/60">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Passcode..."
              className="w-full pl-10 pr-4 py-3.5 glass-input rounded-xl text-center tracking-widest text-lg font-medium text-white placeholder:text-pink-300/40 border border-white/20 focus:border-rose-400 focus:outline-none transition-all"
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-1.5 text-xs text-rose-300 bg-rose-950/60 border border-rose-500/30 py-2 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Incorrect passcode. Try again! ❤️</span>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(244,63,94,0.6)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-lg shadow-rose-600/30 border border-rose-300/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlock Our World</span>
          </motion.button>
        </form>

        <p className="mt-6 text-xs text-pink-300/50">
          Hint: Default Passcode is <span className="text-pink-300 font-semibold">{data.password}</span>
        </p>
      </motion.div>
    </div>
  );
};
