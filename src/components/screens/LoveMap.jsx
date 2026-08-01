import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Heart, Edit3, X, Check, Navigation, Sparkles } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const LoveMap = () => {
  const { data, updateData } = useProposal();
  const [selectedPin, setSelectedPin] = useState(null);
  const [isEditingPin, setIsEditingPin] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    location: '',
    category: '',
    date: '',
    story: ''
  });

  const handleOpenPin = (pin) => {
    setSelectedPin(pin);
    setEditForm(pin);
    setIsEditingPin(false);
  };

  const handleSavePin = () => {
    updateData((prev) => ({
      ...prev,
      mapPins: prev.mapPins.map((p) => (p.id === editForm.id ? editForm : p))
    }));
    setSelectedPin(editForm);
    setIsEditingPin(false);
  };

  const handleAddPin = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPin = {
      id: `pin-${Date.now()}`,
      title: 'New Memory Spot',
      location: 'Custom Location',
      category: 'Favorite Place',
      x,
      y,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      story: 'Click edit to write the memory story for this pin!'
    };

    updateData((prev) => ({
      ...prev,
      mapPins: [...prev.mapPins, newPin]
    }));

    handleOpenPin(newPin);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
          <Navigation className="w-4 h-4" />
          <span>Love Map • Interactive Pins</span>
        </div>
        <span className="text-xs text-pink-300/70">Click anywhere on the map to add a new pin!</span>
      </div>

      {/* Map Canvas Frame */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 border border-rose-500/30 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        <div
          onClick={handleAddPin}
          className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-[#0d071b] border border-white/10 cursor-crosshair group shadow-inner"
        >
          {/* Custom Stylized Vector Map Backdrop */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-rose-900/40 via-purple-900/20 to-pink-900/40" />

          {/* Map Grid SVG Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-15 stroke-pink-400/40">
            <line x1="0" y1="25%" x2="100%" y2="25%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="75%" x2="100%" y2="75%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="25%" y1="0" x2="25%" y2="100%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="75%" y1="0" x2="75%" y2="100%" strokeWidth="1" strokeDasharray="4 4" />
          </svg>

          {/* Map Pins */}
          {data.mapPins.map((pin) => (
            <div
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenPin(pin);
              }}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group/pin"
            >
              {/* Glowing Pulse Rings */}
              <div className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping pointer-events-none" />
              <div className="relative p-2.5 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.9)] border border-white/50 group-hover/pin:scale-125 transition-transform">
                <MapPin className="w-5 h-5 fill-white text-rose-500" />
              </div>

              {/* Hover Badge */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-full glass-card border border-rose-400/30 text-[10px] font-bold text-white shadow-lg pointer-events-none opacity-0 group-hover/pin:opacity-100 transition-opacity">
                {pin.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pin Detail / Edit Modal */}
      <AnimatePresence>
        {selectedPin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-rose-500/40 shadow-2xl relative space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white">{isEditingPin ? 'Edit Pin' : selectedPin.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-pink-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isEditingPin ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-pink-300 font-bold uppercase">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full p-2 glass-input rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-pink-300 font-bold uppercase">Location Name</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full p-2 glass-input rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-pink-300 font-bold uppercase">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full p-2 glass-input rounded-xl text-xs bg-slate-900 text-white"
                    >
                      <option value="First Meet">First Meet</option>
                      <option value="First Date">First Date</option>
                      <option value="Favorite Place">Favorite Place</option>
                      <option value="Future Destination">Future Destination</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-pink-300 font-bold uppercase">Memory Story</label>
                    <textarea
                      value={editForm.story}
                      onChange={(e) => setEditForm({ ...editForm, story: e.target.value })}
                      className="w-full p-2 glass-input rounded-xl text-xs"
                      rows={3}
                    />
                  </div>
                  <button
                    onClick={handleSavePin}
                    className="w-full py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-400/30">
                      {selectedPin.category}
                    </span>
                    <span className="text-pink-300/70">{selectedPin.date}</span>
                  </div>

                  <div>
                    <p className="text-xs text-pink-300/70 font-semibold uppercase">Location</p>
                    <p className="text-base font-bold text-white">{selectedPin.location}</p>
                  </div>

                  <div>
                    <p className="text-xs text-pink-300/70 font-semibold uppercase">Our Story</p>
                    <p className="text-sm text-pink-100/90 leading-relaxed font-light mt-1">
                      "{selectedPin.story}"
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditingPin(true)}
                    className="w-full py-2.5 glass-card border border-rose-400/40 text-pink-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4 text-rose-400" /> Edit Memory Pin
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
