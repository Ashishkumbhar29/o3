import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProposal } from '../../context/AppContext';

export const FinalMessage = () => {
  const { data, isCinematicActive, setIsCinematicActive } = useProposal();

  const [step, setStep] = useState(0); // 0: Fade to black, 1: Stars & Photo fade in, 2: Beating heart & Typewriter 1, 3: Typewriter 2 & Button, 4: Grand Finale Explosion
  const [typedText1, setTypedText1] = useState('');
  const [typedText2, setTypedText2] = useState('');

  const line1 = "You are my today...\nYou are my tomorrow...\nYou are my forever.";
  const line2 = "I will choose you...\nAgain...\nAnd Again...\nForever.";

  useEffect(() => {
    if (!isCinematicActive) {
      setStep(0);
      setTypedText1('');
      setTypedText2('');
      return;
    }

    // Step 0 -> 1: Stars appear after 1.5s
    const timer1 = setTimeout(() => setStep(1), 1500);

    // Step 1 -> 2: Beating Heart & Typewriter 1 after 4s
    const timer2 = setTimeout(() => setStep(2), 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isCinematicActive]);

  // Typewriter effect for Line 1
  useEffect(() => {
    if (step !== 2) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < line1.length) {
        setTypedText1(line1.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep(3), 1000);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [step]);

  // Typewriter effect for Line 2
  useEffect(() => {
    if (step !== 3) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < line2.length) {
        setTypedText2(line2.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [step]);

  const handleForeverUsClick = () => {
    setStep(4);

    // Launch multiple bursts of fireworks and confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (!isCinematicActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 z-50 bg-[#05010a] text-white flex flex-col items-center justify-center p-6 overflow-hidden select-none"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsCinematicActive(false)}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-rose-500 z-50 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Floating Particle Stars & Petals */}
        {step >= 1 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: Math.random() * 800 }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  y: [Math.random() * 800, Math.random() * 800 - 100]
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 4 + 3,
                  ease: 'easeInOut'
                }}
                className="absolute w-1.5 h-1.5 bg-rose-300 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.9)]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-2xl text-center space-y-8 relative z-10">
          {/* Prachi's Photo with Glowing Aura */}
          {step >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="relative mx-auto w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden border-2 border-rose-400/60 shadow-[0_0_60px_rgba(244,63,94,0.8)]"
            >
              <img
                src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop"
                alt="Prachi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 via-transparent to-transparent" />
            </motion.div>
          )}

          {/* Giant Beating 3D Heart */}
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: [1, 1.2, 1] }}
              transition={{ scale: { repeat: Infinity, duration: 1.5 } }}
              className="flex justify-center"
            >
              <Heart className="w-16 h-16 text-rose-500 fill-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,1)]" />
            </motion.div>
          )}

          {/* Typewriter Text Section */}
          {step >= 2 && (
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black font-cursive text-glow text-rose-300">
                {data.names.partner2} ❤️
              </h2>
              <p className="text-lg sm:text-2xl font-light text-pink-100/90 whitespace-pre-line leading-relaxed font-serif tracking-wide">
                {typedText1}
              </p>
              {step >= 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-base sm:text-xl font-light text-rose-200/90 whitespace-pre-line leading-relaxed font-serif tracking-wide pt-2"
                >
                  {typedText2}
                </motion.p>
              )}
            </div>
          )}

          {/* Interactive Button: Forever Us */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 50px rgba(244,63,94,1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleForeverUsClick}
                className="px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 shadow-2xl shadow-rose-600/50 border border-rose-300/40 text-base uppercase tracking-widest cursor-pointer"
              >
                ❤️ Forever Us ❤️
              </motion.button>
            </motion.div>
          )}

          {/* Step 4: Final Banner Celebration */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="space-y-6 pt-4"
            >
              <div className="p-8 rounded-3xl glass-card border border-rose-400/60 shadow-[0_0_80px_rgba(244,63,94,0.6)] backdrop-blur-3xl space-y-4">
                <Sparkles className="w-10 h-10 text-amber-300 mx-auto animate-spin" style={{ animationDuration: '4s' }} />
                <h1 className="text-4xl sm:text-6xl font-black font-cursive text-glow text-white">
                  Happy Girlfriend's Day ❤️
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-pink-200">
                  Love You Forever {data.names.partner2}
                </p>
                <p className="text-sm font-semibold text-rose-300">
                  - {data.names.partner1} ❤️
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
