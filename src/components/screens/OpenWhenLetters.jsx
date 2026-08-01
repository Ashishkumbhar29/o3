import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, X, Edit3, Sparkles } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const OpenWhenLetters = () => {
  const { data, updateData } = useProposal();
  const [activeLetter, setActiveLetter] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const handleOpenLetter = (letter) => {
    setActiveLetter(letter);
    setEditedContent(letter.content);
    setIsEditing(false);
  };

  const handleSaveLetter = () => {
    updateData((prev) => ({
      ...prev,
      letters: prev.letters.map((l) => (l.id === activeLetter.id ? { ...l, content: editedContent } : l))
    }));
    setActiveLetter((prev) => ({ ...prev, content: editedContent }));
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
        <Mail className="w-4 h-4" />
        <span>Open When Letters • Sealed With Love</span>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cursive text-glow">
          Letters For Every Emotion
        </h2>
        <p className="text-sm text-pink-200/80 max-w-xl mx-auto font-light">
          Click an envelope to unseal and unfold the paper when you feel that emotion.
        </p>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
        {data.letters.map((letter, index) => (
          <motion.div
            key={letter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => handleOpenLetter(letter)}
            className="cursor-pointer group"
          >
            {/* 3D Envelope Card */}
            <div className="glass-card rounded-3xl p-6 border border-rose-500/30 shadow-xl backdrop-blur-2xl text-center relative overflow-hidden flex flex-col items-center justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles className="w-12 h-12 text-rose-300" />
              </div>

              {/* Envelope Flap Icon */}
              <div className="relative my-auto">
                <div className="w-20 h-14 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-xl shadow-lg border border-white/30 flex items-center justify-center relative">
                  <Mail className="w-8 h-8 text-white" />
                  <div className="absolute -top-2 -right-2 bg-white text-rose-600 p-1.5 rounded-full shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-rose-600" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-extrabold text-white group-hover:text-rose-300 transition-colors">
                  {letter.title}
                </h3>
                <span className="text-[10px] text-pink-300/60 uppercase font-semibold mt-1 inline-block">
                  Click to Unseal
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Letter Reading Modal with Paper Unfold Animation */}
      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.7, rotateX: 90 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.7, rotateX: -90 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-rose-400/50 shadow-2xl relative space-y-4 text-left backdrop-blur-2xl"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h3 className="text-lg font-bold text-white">{activeLetter.title}</h3>
                </div>
                <button
                  onClick={() => setActiveLetter(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-pink-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Letter Paper Content */}
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 glass-input rounded-xl text-xs font-serif leading-relaxed"
                    rows={8}
                  />
                  <button
                    onClick={handleSaveLetter}
                    className="w-full py-2 bg-rose-500 text-white rounded-xl text-xs font-bold"
                  >
                    Save Letter Text
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-6 rounded-2xl bg-amber-50/10 border border-amber-200/20 text-rose-50 font-serif leading-relaxed text-sm whitespace-pre-line relative shadow-inner">
                  {activeLetter.content}
                </div>
              )}

              {/* Edit Toggle */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-2 glass-card border border-rose-400/30 text-pink-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-rose-400" /> Edit Letter
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
