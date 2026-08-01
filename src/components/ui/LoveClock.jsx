import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const LoveClock = () => {
  const { data } = useProposal();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startDate = new Date(data.relationshipStartDate || '2026-03-08T00:00:00');
  const diffMs = Math.max(0, now.getTime() - startDate.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const years = (days / 365.25).toFixed(1);
  const months = Math.floor(days / 30.43);

  return (
    <div className="w-full glass-card rounded-3xl p-6 border border-rose-500/30 shadow-2xl backdrop-blur-2xl text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <Sparkles className="w-24 h-24 text-rose-400" />
      </div>

      <div className="flex items-center justify-center gap-2 mb-4 text-rose-400 font-bold uppercase tracking-wider text-xs">
        <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
        <span>Love Clock • Since 8 March 2026</span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-cursive text-glow mb-6">
        Together for {days} Magical Days
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-2xl glass-card border border-rose-400/20">
          <p className="text-2xl font-black text-rose-300">{years}</p>
          <p className="text-[10px] text-pink-200/60 uppercase font-semibold">Years Together</p>
        </div>
        <div className="p-3 rounded-2xl glass-card border border-rose-400/20">
          <p className="text-2xl font-black text-pink-300">{months}</p>
          <p className="text-[10px] text-pink-200/60 uppercase font-semibold">Months Together</p>
        </div>
        <div className="p-3 rounded-2xl glass-card border border-rose-400/20">
          <p className="text-2xl font-black text-rose-400">{hours}</p>
          <p className="text-[10px] text-pink-200/60 uppercase font-semibold">Hours Today</p>
        </div>
        <div className="p-3 rounded-2xl glass-card border border-rose-400/20">
          <p className="text-2xl font-black text-amber-300">{seconds}s</p>
          <p className="text-[10px] text-pink-200/60 uppercase font-semibold">Live Seconds</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-pink-300/80">
        <Calendar className="w-3.5 h-3.5 text-rose-400" />
        <span>Current Time: {now.toLocaleTimeString()} • Started 8 March 2026</span>
      </div>
    </div>
  );
};
