import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, XCircle, Award, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProposal } from '../../context/AppContext';

export const LoveQuiz = () => {
  const { data } = useProposal();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = data.quizQuestions || [];
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optIndex) => {
    if (selectedAnswers[currentQIndex] !== undefined) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      const correctCount = Object.keys(selectedAnswers).reduce((acc, idx) => {
        return acc + (selectedAnswers[idx] === questions[idx].correctIndex ? 1 : 0);
      }, 0);

      if (correctCount === questions.length) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) score++;
    });
    return Math.round((score / (questions.length || 1)) * 100);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
        <HelpCircle className="w-4 h-4" />
        <span>Love Quiz • How Well Do You Know Us?</span>
      </div>

      {!isCompleted && currentQ ? (
        <motion.div
          key={currentQIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl backdrop-blur-2xl space-y-6 text-left"
        >
          {/* Question Index Progress */}
          <div className="flex items-center justify-between text-xs text-pink-300 font-semibold">
            <span>Question {currentQIndex + 1} of {questions.length}</span>
            <span>{Math.round(((currentQIndex + 1) / questions.length) * 100)}%</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQIndex] === optIdx;
              const hasAnswered = selectedAnswers[currentQIndex] !== undefined;
              const isCorrect = optIdx === currentQ.correctIndex;

              let btnStyle = 'border-white/10 hover:border-rose-400/40 text-pink-100';
              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-400 bg-emerald-500/20 text-emerald-200';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-500/20 text-rose-200';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={hasAnswered}
                  className={`w-full p-4 rounded-2xl glass-card border transition-all text-left text-sm font-medium flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {selectedAnswers[currentQIndex] !== undefined && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-xs text-pink-200 font-light"
            >
              💡 {currentQ.explanation}
            </motion.div>
          )}

          {/* Next Button */}
          {selectedAnswers[currentQIndex] !== undefined && (
            <button
              onClick={handleNext}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              {currentQIndex < questions.length - 1 ? 'Next Question →' : 'See Final Score 🏆'}
            </button>
          )}
        </motion.div>
      ) : (
        /* Completed Score Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-8 border border-rose-500/30 shadow-2xl backdrop-blur-2xl text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-600/50">
            <Award className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-extrabold text-white font-cursive text-glow">
            Quiz Completed!
          </h2>

          <div className="text-5xl font-black text-rose-400">
            {calculateScore()}%
          </div>

          <p className="text-sm text-pink-200/80 max-w-sm mx-auto font-light">
            {calculateScore() === 100
              ? "Perfect 100%! You know our love story inside and out! ❤️"
              : "Great job! You two are an extraordinary match! ❤️"}
          </p>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-full glass-card border border-rose-400/40 text-xs font-bold text-white hover:bg-rose-500/20 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Try Quiz Again
          </button>
        </motion.div>
      )}
    </div>
  );
};
