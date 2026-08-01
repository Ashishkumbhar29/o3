import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Plus, Trash2, Edit3, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProposal } from '../../context/AppContext';

export const BucketList = () => {
  const { data, updateData } = useProposal();
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Romance');

  const completedCount = data.bucketList.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / (data.bucketList.length || 1)) * 100);

  const toggleItem = (id) => {
    updateData((prev) => {
      const updated = prev.bucketList.map((item) => {
        if (item.id === id) {
          const nextState = !item.completed;
          if (nextState) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
          return { ...item, completed: nextState };
        }
        return item;
      });
      return { ...prev, bucketList: updated };
    });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem = {
      id: `b-${Date.now()}`,
      title: newItemTitle.trim(),
      completed: false,
      category: newItemCategory
    };

    updateData((prev) => ({
      ...prev,
      bucketList: [...prev.bucketList, newItem]
    }));

    setNewItemTitle('');
  };

  const handleDeleteItem = (id) => {
    updateData((prev) => ({
      ...prev,
      bucketList: prev.bucketList.filter((i) => i.id !== id)
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Header & Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl backdrop-blur-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
            <CheckSquare className="w-4 h-4" />
            <span>Our Bucket List • Dreams Together</span>
          </div>
          <span className="text-xs font-bold text-rose-300">{progressPercent}% Completed</span>
        </div>

        <h2 className="text-3xl font-extrabold text-white font-cursive text-glow">
          Adventures & Dreams Left To Conquer
        </h2>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-300 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.8)]"
          />
        </div>
      </motion.div>

      {/* Add New Bucket Item Input */}
      <form onSubmit={handleAddItem} className="glass-card p-4 rounded-2xl border border-white/10 flex items-center gap-2">
        <input
          type="text"
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          placeholder="Add a new dream (e.g. Visit Paris together...)"
          className="flex-1 px-4 py-2.5 glass-input rounded-xl text-xs placeholder:text-pink-300/40"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="px-3 py-2.5 glass-input rounded-xl text-xs bg-slate-900 text-white border border-white/20 hidden sm:block"
        >
          <option value="Romance">Romance</option>
          <option value="Travel">Travel</option>
          <option value="Adventure">Adventure</option>
          <option value="Life Goal">Life Goal</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs flex items-center gap-1 shadow-md hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.bucketList.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-2xl glass-card border transition-all flex items-center justify-between gap-3 ${
              item.completed
                ? 'border-rose-500/40 bg-rose-500/10 opacity-75'
                : 'border-white/10 hover:border-rose-400/40'
            }`}
          >
            <div
              onClick={() => toggleItem(item.id)}
              className="flex items-center gap-3 flex-1 cursor-pointer select-none"
            >
              <div className="text-rose-400">
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-rose-500 fill-rose-500/20" />
                ) : (
                  <Square className="w-5 h-5 text-pink-300/60" />
                )}
              </div>

              <div>
                <h4
                  className={`text-sm font-semibold text-white transition-all ${
                    item.completed ? 'line-through text-pink-200/50' : ''
                  }`}
                >
                  {item.title}
                </h4>
                <span className="text-[10px] text-pink-300/60 uppercase font-medium">
                  {item.category}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDeleteItem(item.id)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-pink-300/50 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
