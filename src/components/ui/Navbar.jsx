import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  CloudRain,
  Share2,
  QrCode,
  FileDown,
  Settings,
  Volume2,
  VolumeX,
  Lock,
  ChevronDown,
  Upload,
  Repeat,
  Play,
  Pause
} from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const Navbar = ({ onOpenShare, onOpenQR, onExportPDF }) => {
  const {
    data,
    updateData,
    saveBgMusicUrl,
    activeTab,
    setActiveTab,
    setIsAdminOpen,
    lockApp,
    isPlayingMusic,
    setIsPlayingMusic,
    isMuted,
    setIsMuted,
    musicVolume,
    setMusicVolume,
    isMusicLoop,
    setIsMusicLoop
  } = useProposal();

  const [showWeatherMenu, setShowWeatherMenu] = useState(false);
  const [showMusicMenu, setShowMusicMenu] = useState(false);
  const musicFileInputRef = useRef(null);

  const tabs = [
    { id: 'hero', label: 'Home' },
    { id: 'slideshow', label: 'Memories Gallery' },
    { id: 'video', label: 'Video Memories' },
    { id: 'map', label: 'Love Map' },
    { id: 'bucket', label: 'Bucket List' },
    { id: 'letters', label: 'Open When' },
    { id: 'quiz', label: 'Love Quiz' }
  ];

  const weatherOptions = [
    { id: 'rose_rain', label: '🌹 Rose Rain' },
    { id: 'snow', label: '❄️ Snowfall' },
    { id: 'stars', label: '✨ Stargazing' },
    { id: 'fireflies', label: '🪲 Fireflies' },
    { id: 'butterflies', label: '🦋 Butterflies' },
    { id: 'sparkles', label: '❇️ Sparkles' },
    { id: 'hearts', label: '💖 Floating Hearts' }
  ];

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      saveBgMusicUrl(uploadEvent.target.result);
      setIsPlayingMusic(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-500/20 backdrop-blur-xl px-4 py-3 shadow-lg">
      <input
        type="file"
        ref={musicFileInputRef}
        onChange={handleAudioUpload}
        accept="audio/*"
        className="hidden"
      />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <motion.div
            whileHover={{ scale: 1.03 }}
            onClick={() => setActiveTab('hero')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 shadow-md shadow-rose-500/40">
              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-cursive tracking-wider text-glow leading-none">
                {data.names.coupleTitle}
              </h1>
            </div>
          </motion.div>

          {/* Mobile Music Toggle */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2 rounded-full glass-card text-pink-300 hover:text-white"
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 text-rose-400 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-2 rounded-full glass-card text-pink-300 hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full py-1 px-2 glass-card rounded-full border border-white/10 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive ? 'text-white shadow-md' : 'text-pink-200/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions (Weather, Custom MP3 Music Controls, PDF, Share, Admin) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Weather Selector */}
          <div className="relative">
            <button
              onClick={() => setShowWeatherMenu(!showWeatherMenu)}
              className="px-3 py-1.5 rounded-xl glass-card text-xs font-medium text-pink-200 hover:bg-white/15 flex items-center gap-1.5 border border-white/10"
            >
              <CloudRain className="w-3.5 h-3.5 text-rose-400" />
              <span className="capitalize">{data.weatherEffect.replace('_', ' ')}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <AnimatePresence>
              {showWeatherMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-44 glass-panel rounded-2xl p-2 shadow-2xl border border-rose-500/30 z-50"
                >
                  <p className="text-[10px] uppercase font-bold text-pink-400 px-2 py-1 tracking-wider">
                    Ambient Weather
                  </p>
                  {weatherOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        updateData({ weatherEffect: opt.id });
                        setShowWeatherMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        data.weatherEffect === opt.id
                          ? 'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                          : 'text-pink-100/80 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Background Music Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMusicMenu(!showMusicMenu)}
              className="px-3 py-1.5 rounded-xl glass-card text-xs font-medium text-pink-200 hover:bg-white/15 flex items-center gap-1.5 border border-white/10"
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
              <span>Music</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            <AnimatePresence>
              {showMusicMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-60 glass-panel rounded-2xl p-3 shadow-2xl border border-rose-500/30 z-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">
                      Background Song
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-1 rounded-full ${isMuted ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-pink-300'}`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                        className="p-1 rounded-full bg-rose-500/30 text-rose-300"
                        title={isPlayingMusic ? 'Pause' : 'Play'}
                      >
                        {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Upload MP3 File Button */}
                  <button
                    onClick={() => musicFileInputRef.current?.click()}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Custom MP3
                  </button>

                  {/* Volume Slider */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-pink-300 font-bold uppercase flex justify-between">
                      <span>Volume</span>
                      <span>{Math.round(musicVolume * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  {/* Loop Toggle */}
                  <div className="flex items-center justify-between text-xs text-pink-200">
                    <span>Loop Audio</span>
                    <button
                      onClick={() => setIsMusicLoop(!isMusicLoop)}
                      className={`p-1 rounded-lg border transition-colors ${
                        isMusicLoop ? 'border-rose-400 bg-rose-500/20 text-rose-300' : 'border-white/20 text-gray-400'
                      }`}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PDF Export */}
          <button
            onClick={onExportPDF}
            title="Download Memory Book PDF"
            className="p-2 rounded-xl glass-card text-pink-200 hover:bg-white/15 border border-white/10"
          >
            <FileDown className="w-4 h-4 text-amber-400" />
          </button>

          {/* QR Code */}
          <button
            onClick={onOpenQR}
            title="Generate QR Code"
            className="p-2 rounded-xl glass-card text-pink-200 hover:bg-white/15 border border-white/10"
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Share */}
          <button
            onClick={onOpenShare}
            title="Share Website"
            className="p-2 rounded-xl glass-card text-pink-200 hover:bg-white/15 border border-white/10"
          >
            <Share2 className="w-4 h-4 text-pink-400" />
          </button>

          {/* Admin Panel */}
          <button
            onClick={() => setIsAdminOpen(true)}
            title="Open Admin Panel"
            className="p-2 rounded-xl glass-card text-pink-200 hover:bg-rose-500/20 border border-white/10"
          >
            <Settings className="w-4 h-4 text-rose-400" />
          </button>

          {/* Lock App */}
          <button
            onClick={lockApp}
            title="Lock Website"
            className="p-2 rounded-xl glass-card text-pink-200 hover:bg-rose-500/20 border border-white/10"
          >
            <Lock className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
