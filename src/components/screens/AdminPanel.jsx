import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Save, RotateCcw, Download, Upload, Heart, User, Music, Video, MapPin, Mail, Sparkles } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const AdminPanel = () => {
  const { data, updateData, saveBgMusicUrl, resetDataToDefault, isAdminOpen, setIsAdminOpen } = useProposal();
  const [activeTab, setActiveTab] = useState('names');

  if (!isAdminOpen) return null;

  const handleJSONExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `love_story_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleJSONImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        updateData(imported);
        alert('Data successfully imported!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 border border-rose-500/40 shadow-2xl relative max-h-[90vh] flex flex-col backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-cursive text-glow">
                  Admin Master Control
                </h3>
                <p className="text-[11px] text-pink-300/70">
                  Edit all website content without touching code! Saved live to browser memory.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-pink-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Admin Navigation Sub-tabs */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto border-b border-rose-500/10 no-scrollbar">
            {[
              { id: 'names', label: 'Names & Password' },
              { id: 'weather', label: 'Weather & Music' },
              { id: 'letters', label: 'Letters' },
              { id: 'map', label: 'Map Pins' },
              { id: 'backup', label: 'Backup & Reset' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'glass-card text-pink-200/70 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-left">
            {activeTab === 'names' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-pink-300 font-bold uppercase">Your Name (Partner 1)</label>
                    <input
                      type="text"
                      value={data.names.partner1}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          names: { ...prev.names, partner1: e.target.value, coupleTitle: `${e.target.value} ❤️ ${prev.names.partner2}` }
                        }))
                      }
                      className="w-full p-3 glass-input rounded-xl text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-pink-300 font-bold uppercase">Her Name (Partner 2)</label>
                    <input
                      type="text"
                      value={data.names.partner2}
                      onChange={(e) =>
                        updateData((prev) => ({
                          ...prev,
                          names: { ...prev.names, partner2: e.target.value, coupleTitle: `${prev.names.partner1} ❤️ ${e.target.value}` }
                        }))
                      }
                      className="w-full p-3 glass-input rounded-xl text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-pink-300 font-bold uppercase">Password Lock Key</label>
                  <input
                    type="text"
                    value={data.password}
                    onChange={(e) => updateData({ password: e.target.value })}
                    className="w-full p-3 glass-input rounded-xl text-xs mt-1"
                  />
                  <p className="text-[10px] text-pink-300/50 mt-1">Default password used to unlock the website.</p>
                </div>

                <div>
                  <label className="text-xs text-pink-300 font-bold uppercase">Relationship Start Date</label>
                  <input
                    type="datetime-local"
                    value={data.relationshipStartDate ? data.relationshipStartDate.slice(0, 16) : ''}
                    onChange={(e) => updateData({ relationshipStartDate: e.target.value })}
                    className="w-full p-3 glass-input rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
            )}

            {activeTab === 'weather' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-pink-300 font-bold uppercase">Active Weather Particles</label>
                  <select
                    value={data.weatherEffect}
                    onChange={(e) => updateData({ weatherEffect: e.target.value })}
                    className="w-full p-3 glass-input rounded-xl text-xs mt-1 bg-slate-900 text-white"
                  >
                    <option value="rose_rain">🌹 Rose Rain</option>
                    <option value="snow">❄️ Snowfall</option>
                    <option value="stars">✨ Stargazing</option>
                    <option value="fireflies">🪲 Fireflies</option>
                    <option value="butterflies">🦋 Butterflies</option>
                    <option value="sparkles">❇️ Sparkles</option>
                    <option value="hearts">💖 Floating Hearts</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-pink-300 font-bold uppercase">Background Music Audio URL</label>
                  <input
                    type="text"
                    value={data.bgMusicUrl}
                    onChange={(e) => saveBgMusicUrl(e.target.value)}
                    className="w-full p-3 glass-input rounded-xl text-xs mt-1"
                  />
                </div>
              </div>
            )}

            {activeTab === 'letters' && (
              <div className="space-y-4">
                {data.letters.map((letter, idx) => (
                  <div key={letter.id} className="p-3 rounded-2xl glass-card border border-white/10 space-y-2">
                    <input
                      type="text"
                      value={letter.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          letters: prev.letters.map((l, i) => (i === idx ? { ...l, title: val } : l))
                        }));
                      }}
                      className="w-full p-2 glass-input rounded-xl text-xs font-bold"
                    />
                    <textarea
                      value={letter.content}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateData((prev) => ({
                          ...prev,
                          letters: prev.letters.map((l, i) => (i === idx ? { ...l, content: val } : l))
                        }));
                      }}
                      className="w-full p-2 glass-input rounded-xl text-xs"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="space-y-4 text-center py-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleJSONExport}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Export Backup JSON
                  </button>

                  <label className="px-6 py-3 rounded-xl glass-card border border-rose-400/40 text-pink-200 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-rose-400" />
                    <span>Import Backup JSON</span>
                    <input type="file" onChange={handleJSONImport} accept=".json" className="hidden" />
                  </label>
                </div>

                <div className="pt-6 border-t border-rose-500/20">
                  <button
                    onClick={() => {
                      if (confirm('Reset all custom settings back to factory default?')) {
                        resetDataToDefault();
                        alert('Factory defaults restored!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 mx-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Restore Defaults
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
