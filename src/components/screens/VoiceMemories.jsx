import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Upload, Music, Volume2, VolumeX, Mic, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useProposal } from '../../context/AppContext';
import { MusicVisualizer } from '../ui/MusicVisualizer';

export const VoiceMemories = () => {
  const { data, updateData } = useProposal();
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentVoice = data.voiceNotes[activeVoiceIndex] || data.voiceNotes[0];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log('Audio play error:', e));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const newNote = {
        id: `voice-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        audioUrl: uploadEvent.target.result,
        duration: '02:00',
        caption: 'Uploaded voice memory audio clip.',
        bgImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop'
      };

      updateData((prev) => ({
        ...prev,
        voiceNotes: [newNote, ...prev.voiceNotes]
      }));
      setActiveVoiceIndex(0);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteVoice = (id) => {
    updateData((prev) => ({
      ...prev,
      voiceNotes: prev.voiceNotes.filter((v) => v.id !== id)
    }));
    if (activeVoiceIndex >= data.voiceNotes.length - 1) {
      setActiveVoiceIndex(Math.max(0, data.voiceNotes.length - 2));
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Hidden HTML5 Audio element */}
      {currentVoice && (
        <audio
          ref={audioRef}
          src={currentVoice.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Main Luxury Player Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 sm:p-10 border border-rose-500/30 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        {/* Background Image Blur */}
        {currentVoice?.bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 blur-2xl pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${currentVoice.bgImage})` }}
          />
        )}

        <div className="relative z-10 space-y-6">
          {/* Header & Upload Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
              <Mic className="w-4 h-4" />
              <span>Voice Memories • Unlimited Audio</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-full glass-card hover:bg-rose-500/30 border border-rose-400/40 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-rose-300" />
              <span>Upload Voice Note</span>
            </button>
          </div>

          {/* Active Track Banner */}
          {currentVoice && (
            <div className="text-center space-y-2 py-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-400/30">
                {currentVoice.date}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cursive text-glow">
                {currentVoice.title}
              </h2>
              <p className="text-sm text-pink-200/80 max-w-lg mx-auto font-light">
                "{currentVoice.caption}"
              </p>
            </div>
          )}

          {/* Equalizer Visualizer */}
          <MusicVisualizer isPlaying={isPlaying} barCount={24} />

          {/* Seek Bar & Timers */}
          <div className="space-y-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs text-pink-300/70 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between pt-2">
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full glass-card text-pink-300 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-rose-500 hidden sm:block"
              />
            </div>

            {/* Play/Pause Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 border border-white/30 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              )}
            </motion.button>

            {/* Delete active track */}
            {data.voiceNotes.length > 1 && (
              <button
                onClick={() => handleDeleteVoice(currentVoice.id)}
                className="p-2 rounded-full glass-card text-pink-300 hover:text-rose-400"
                title="Delete voice note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Playlist Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider px-2">
          Voice Playlist ({data.voiceNotes.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.voiceNotes.map((note, index) => {
            const isSelected = index === activeVoiceIndex;
            return (
              <motion.div
                key={note.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setActiveVoiceIndex(index);
                  setIsPlaying(false);
                }}
                className={`p-4 rounded-2xl glass-card border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-500/20 shadow-lg shadow-rose-500/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className={`p-3 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-rose-500 text-white' : 'bg-white/10 text-pink-300'
                  }`}
                >
                  <Music className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{note.title}</h4>
                  <p className="text-[11px] text-pink-300/70">{note.date} • {note.duration}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
