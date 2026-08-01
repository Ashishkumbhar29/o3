import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Film, Music, MapPin, CheckSquare, Mail, Play, Volume2 } from 'lucide-react';
import { useProposal } from '../../context/AppContext';
import { LoveClock } from '../ui/LoveClock';

export const HeroCard = () => {
  const { data, setActiveTab, setIsCinematicActive, isPlayingMusic, setIsPlayingMusic } = useProposal();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 25;
    const y = -(e.clientY - rect.top - rect.height / 2) / 25;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto py-4">
      {/* Main 3D Interactive Hero Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ perspective: 1000 }}
        className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/40 shadow-2xl backdrop-blur-2xl text-center relative overflow-hidden group"
      >
        {/* Ambient background aura */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-500/20 rounded-full blur-[90px] pointer-events-none" />

        {/* 3D Rotating Heart Hero */}
        <div className="relative mx-auto w-32 h-32 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-pulse" />
          <motion.div
            animate={{ rotateY: 360, scale: [1, 1.08, 1] }}
            transition={{ rotateY: { duration: 10, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
            className="relative z-10 p-5 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 shadow-[0_0_50px_rgba(244,63,94,0.7)] border border-white/30 cursor-pointer"
          >
            <Heart className="w-16 h-16 text-white fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
          </motion.div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute top-0 right-0 animate-bounce" />
        </div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-400/30 inline-block mb-3">
            Happy Girlfriend's Day
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white font-cursive text-glow mb-4 leading-tight">
            {data.names.partner2}, You Are My Whole Universe
          </h1>
          <p className="text-base sm:text-lg text-pink-200/80 max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Created with infinite love by <span className="text-rose-300 font-semibold">{data.names.partner1}</span>. Explore our interactive memories, secret letters, love quiz, video memories, and 3D experiences!
          </p>
        </motion.div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab('slideshow')}
            className="p-3.5 rounded-2xl glass-card hover:bg-rose-500/20 border border-white/10 flex flex-col items-center gap-2 text-xs font-semibold text-pink-100 transition-all cursor-pointer"
          >
            <Film className="w-5 h-5 text-rose-400" />
            <span>Memories Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className="p-3.5 rounded-2xl glass-card hover:bg-rose-500/20 border border-white/10 flex flex-col items-center gap-2 text-xs font-semibold text-pink-100 transition-all cursor-pointer"
          >
            <Film className="w-5 h-5 text-pink-400" />
            <span>Video Memories</span>
          </button>
          <button
            onClick={() => setActiveTab('letters')}
            className="p-3.5 rounded-2xl glass-card hover:bg-rose-500/20 border border-white/10 flex flex-col items-center gap-2 text-xs font-semibold text-pink-100 transition-all cursor-pointer"
          >
            <Mail className="w-5 h-5 text-amber-400" />
            <span>Open When</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="p-3.5 rounded-2xl glass-card hover:bg-rose-500/20 border border-white/10 flex flex-col items-center gap-2 text-xs font-semibold text-pink-100 transition-all cursor-pointer"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>Love Map</span>
          </button>
        </div>

        {/* Cinematic Grand Finale Trigger */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(244,63,94,0.9)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCinematicActive(true)}
            className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 shadow-xl shadow-rose-600/40 border border-rose-300/40 flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Launch Final Cinematic Ending ❤️</span>
          </motion.button>

          <button
            onClick={() => setIsPlayingMusic(!isPlayingMusic)}
            className="px-4 py-3 rounded-full glass-card text-xs font-medium text-pink-200 hover:text-white flex items-center gap-2 border border-white/10"
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>{isPlayingMusic ? 'Mute Background Music' : 'Play Background Music'}</span>
          </button>
        </div>
      </motion.div>

      {/* Love Clock Section */}
      <LoveClock />
    </div>
  );
};
