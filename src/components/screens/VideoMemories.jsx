import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Upload, ChevronLeft, ChevronRight, Maximize2, X, Play, Pause, Trash2 } from 'lucide-react';
import { useProposal } from '../../context/AppContext';
import { generateVideoThumbnail } from '../../utils/mediaStorage';

export const VideoMemories = () => {
  const { data, addPersonalVideo, deletePersonalVideo } = useProposal();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const videos = data.videos || [];
  const currentVideo = videos[activeVideoIndex] || videos[0];

  const handleNext = () => {
    setActiveVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setActiveVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = async (uploadEvent) => {
          const videoUrl = uploadEvent.target.result;
          const thumbnail = await generateVideoThumbnail(videoUrl);
          
          const newVid = {
            id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            videoUrl,
            videoThumbnail: thumbnail,
            caption: 'Our special personal video memory.'
          };

          await addPersonalVideo(newVid);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDeleteVideo = async (id) => {
    await deletePersonalVideo(id);
    setActiveVideoIndex(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(e => console.log('Video play error:', e));
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        multiple
        className="hidden"
      />

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
          <Video className="w-4 h-4" />
          <span>Personal Video Memories ({videos.length})</span>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-full glass-card hover:bg-rose-500/30 border border-rose-400/40 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5 text-rose-300" />
          <span>{videos.length > 0 ? 'Upload More Videos' : 'Upload Videos'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      {videos.length === 0 ? (
        /* Clean Upload State when no videos exist */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-12 text-center border border-rose-500/30 shadow-2xl backdrop-blur-2xl space-y-6 relative overflow-hidden"
        >
          <div className="mx-auto w-24 h-24 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-inner">
            <Video className="w-12 h-12 text-rose-400 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white font-cursive text-glow">
              Upload Your Personal Video Memories
            </h3>
            <p className="text-xs text-pink-200/70 font-light leading-relaxed">
              Add 2–3 of your special MP4 videos here. They will appear cleanly in Video Memories, the Gallery Slideshow, and Fullscreen viewer.
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3.5 rounded-full font-bold text-white bg-gradient-to-r from-rose-600 to-pink-600 shadow-xl shadow-rose-600/30 border border-rose-400/30 inline-flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer hover:scale-105 transition-transform"
          >
            <Upload className="w-4 h-4 text-amber-300" />
            <span>Select Personal Videos</span>
          </button>
        </motion.div>
      ) : (
        /* Main Video Player Frame */
        currentVideo && (
          <motion.div
            key={currentVideo.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl p-4 sm:p-6 border border-rose-500/30 shadow-2xl backdrop-blur-2xl relative overflow-hidden space-y-4"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl group cursor-pointer" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={currentVideo.videoUrl}
                poster={currentVideo.videoThumbnail}
                loop
                playsInline
                className="w-full h-full object-cover"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Centered Play Icon Overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-20 h-20 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-2xl shadow-rose-600/60 border-2 border-white/40 cursor-pointer"
                  >
                    <Play className="w-10 h-10 fill-white translate-x-0.5" />
                  </motion.button>
                </div>
              )}

              {/* Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/80 text-white backdrop-blur-md">
                    {activeVideoIndex + 1} / {videos.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFullscreen(true);
                      }}
                      className="p-2.5 rounded-full bg-black/60 text-white hover:bg-rose-500 backdrop-blur-md transition-colors"
                      title="Fullscreen Preview"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVideo(currentVideo.id);
                      }}
                      className="p-2.5 rounded-full bg-black/60 text-pink-300 hover:bg-rose-600 hover:text-white backdrop-blur-md transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pointer-events-auto">
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">{currentVideo.title}</h3>
                    <p className="text-xs text-pink-200/80 drop-shadow">{currentVideo.caption}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="p-3 rounded-full bg-rose-500 text-white hover:scale-110 transition-transform shadow-lg cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white translate-x-0.5" />}
                  </button>
                </div>
              </div>

              {/* Carousel Navigation Arrows */}
              {videos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md transition-all cursor-pointer z-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md transition-all cursor-pointer z-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )
      )}

      {/* Video Thumbnails Selection Bar */}
      {videos.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider text-left px-1">
            Uploaded Videos ({videos.length})
          </h4>
          <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
            {videos.map((vid, idx) => {
              const isSelected = idx === activeVideoIndex;
              return (
                <div
                  key={vid.id}
                  onClick={() => {
                    setActiveVideoIndex(idx);
                    setIsPlaying(false);
                  }}
                  className={`relative min-w-[120px] h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 ${
                    isSelected
                      ? 'border-rose-400 scale-105 shadow-lg shadow-rose-500/30'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                    {vid.videoThumbnail ? (
                      <img src={vid.videoThumbnail} alt={vid.title} className="w-full h-full object-cover opacity-85" />
                    ) : (
                      <video src={vid.videoUrl} className="w-full h-full object-cover opacity-80" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-5 h-5 text-white fill-white drop-shadow-md" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isFullscreen && currentVideo?.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-rose-500 transition-colors z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <video
              src={currentVideo.videoUrl}
              controls
              autoPlay
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

