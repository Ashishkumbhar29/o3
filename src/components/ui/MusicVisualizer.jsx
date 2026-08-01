import React from 'react';
import { motion } from 'framer-motion';

export const MusicVisualizer = ({ isPlaying = false, barCount = 16 }) => {
  return (
    <div className="flex items-end justify-center gap-1.5 h-16 w-full px-4 py-2 glass-card rounded-2xl border border-rose-500/20">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          animate={
            isPlaying
              ? {
                  height: [
                    `${Math.random() * 40 + 15}%`,
                    `${Math.random() * 85 + 15}%`,
                    `${Math.random() * 30 + 10}%`
                  ]
                }
              : { height: '15%' }
          }
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.4 + (i % 5) * 0.1,
            ease: 'easeInOut'
          }}
          className="w-1.5 rounded-full bg-gradient-to-t from-rose-500 via-pink-400 to-amber-300 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
        />
      ))}
    </div>
  );
};
