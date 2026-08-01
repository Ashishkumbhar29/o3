import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Bot, X, Send, Edit3, Check, Sparkles, MessageCircle } from 'lucide-react';
import { useProposal } from '../../context/AppContext';

export const AILoveAssistant = () => {
  const { data, updateData } = useProposal();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${data.names.partner2}! I am your AI Love Assistant. Ask me anything about ${data.names.partner1}'s feelings, your special memories, or your future together! ❤️`,
      isEditable: false
    }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const samplePrompts = [
    "What does Ashish love about Prachi?",
    "Why is she special?",
    "Favorite Memory",
    "Future Dreams"
  ];

  const handleAsk = (queryText) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), sender: 'user', text: q };
    
    // Find matched response or fallback intelligent response
    let answerText = data.aiResponses[q];
    if (!answerText) {
      // Check partial match
      const key = Object.keys(data.aiResponses).find(k => k.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(k.toLowerCase()));
      if (key) {
        answerText = data.aiResponses[key];
      } else {
        answerText = `${data.names.partner1} cherishes every single detail about ${data.names.partner2}. Every smile, every laugh, and every quiet moment together is a treasure beyond words. You are his whole world! ❤️`;
      }
    }

    const aiMsg = { id: (Date.now() + 1).toString(), sender: 'ai', text: answerText, isEditable: true, questionKey: q };

    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    setInputQuery('');
  };

  const handleSaveEdit = (msgId, key) => {
    setChatHistory((prev) =>
      prev.map((msg) => (msg.id === msgId ? { ...msg, text: editText } : msg))
    );

    if (key) {
      updateData((prev) => ({
        ...prev,
        aiResponses: {
          ...prev.aiResponses,
          [key]: editText
        }
      }));
    }

    setEditingId(null);
  };

  return (
    <>
      {/* Floating Heart Button */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(244, 63, 94, 0.8)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 text-white shadow-2xl border border-rose-300/40 flex items-center justify-center cursor-pointer group"
      >
        <div className="relative">
          <Heart className="w-7 h-7 fill-white text-white animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
          AI Love Assistant
        </span>
      </motion.button>

      {/* Chat Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[520px] z-50 glass-panel rounded-3xl p-4 shadow-2xl border border-rose-500/30 flex flex-col backdrop-blur-2xl"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1 font-cursive text-glow text-lg">
                    AI Love Assistant ❤️
                  </h3>
                  <p className="text-[10px] text-pink-300/70">Ask romantic questions • Responses editable</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-pink-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Chips */}
            <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-rose-500/10">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/20 text-pink-200 border border-rose-400/30 hover:bg-rose-500/40 whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed relative group ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-br-none shadow-md'
                        : 'glass-card border border-rose-400/20 text-pink-50 rounded-bl-none'
                    }`}
                  >
                    {editingId === msg.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 bg-black/40 text-white text-xs rounded-lg border border-rose-400 focus:outline-none"
                          rows={3}
                        />
                        <button
                          onClick={() => handleSaveEdit(msg.id, msg.questionKey)}
                          className="px-2.5 py-1 bg-rose-500 text-white rounded-md text-[10px] font-bold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save Edit
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>{msg.text}</p>
                        {msg.isEditable && (
                          <button
                            onClick={() => {
                              setEditingId(msg.id);
                              setEditText(msg.text);
                            }}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-pink-300 hover:text-white transition-opacity"
                            title="Edit AI Response"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="pt-2 border-t border-rose-500/20 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="Ask something romantic..."
                className="flex-1 px-3 py-2 glass-input rounded-xl text-xs placeholder:text-pink-300/40"
              />
              <button
                onClick={() => handleAsk()}
                className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md hover:scale-105 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
