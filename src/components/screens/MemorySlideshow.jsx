import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Play, Pause, ChevronLeft, ChevronRight, Upload, Maximize2, X, Image as ImageIcon, Video as VideoIcon, Trash2 } from 'lucide-react';
import { useProposal } from '../../context/AppContext';
import { generateVideoThumbnail } from '../../utils/mediaStorage';

export const MemorySlideshow = () => {
  const { data, updateData, addPersonalVideo } = useProposal();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [fullscreenItem, setFullscreenItem] = useState(null);

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const videoElemRef = useRef(null);

  // Construct combined media gallery list: user photos + all user personal videos
  const userVideoItems = (data.videos || []).map((v) => ({
    id: v.id,
    type: 'video',
    url: v.videoUrl,
    poster: v.videoThumbnail,
    caption: v.title || 'Personal Video Memory',
    date: 'Video Memory'
  }));

  const mediaList = [
    ...(data.slideshowPhotos || []).filter((p) => p.type === 'image'),
    ...userVideoItems
  ];

  const currentMedia = mediaList[currentIndex] || mediaList[0];

  // Auto-advance slideshow if current item is an image or video finishes
  useEffect(() => {
    if (!isPlayingSlideshow || mediaList.length <= 1) return;
    
    const duration = currentMedia?.type === 'video' ? 12000 : 6000;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }, duration);
    return () => clearInterval(interval);
  }, [isPlayingSlideshow, mediaList.length, currentIndex, currentMedia]);

  const handleUploadPhoto = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newItem = {
          id: `photo-${Date.now()}-${Math.random()}`,
          type: 'image',
          url: event.target.result,
          caption: file.name.replace(/\.[^/.]+$/, ''),
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        };
        updateData((prev) => ({
          ...prev,
          slideshowPhotos: [newItem, ...(prev.slideshowPhotos || [])]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUploadVideo = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onload = async (event) => {
          const videoUrl = event.target.result;
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

  const handleDeleteMedia = (id) => {
    updateData((prev) => ({
      ...prev,
      slideshowPhotos: prev.slideshowPhotos.filter((m) => m.id !== id)
    }));
    setCurrentIndex(0);
  };

  const toggleVideoPlay = () => {
    if (!videoElemRef.current) return;
    if (isVideoPlaying) {
      videoElemRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoElemRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handleUploadPhoto}
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleUploadVideo}
        accept="video/mp4,video/*"
        multiple
        className="hidden"
      />

      {/* Header & Upload Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
          <Film className="w-4 h-4" />
          <span>Memories Gallery & Slideshow</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload Photo */}
          <button
            onClick={() => photoInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-full glass-card border border-rose-400/40 text-xs font-semibold text-white hover:bg-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-300" />
            <span>Upload Photo</span>
          </button>

          {/* Upload Video */}
          <button
            onClick={() => videoInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-full glass-card border border-rose-400/40 text-xs font-semibold text-white hover:bg-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <VideoIcon className="w-3.5 h-3.5 text-pink-300" />
            <span>Upload Video</span>
          </button>

          {/* Pause/Play Slideshow */}
          <button
            onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
            className="p-2 rounded-full glass-card border border-white/10 text-pink-200 hover:text-white"
            title={isPlayingSlideshow ? 'Pause Auto Slideshow' : 'Play Auto Slideshow'}
          >
            {isPlayingSlideshow ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Display Frame */}
      {currentMedia && (
        <div className="glass-card rounded-3xl p-4 sm:p-6 border border-rose-500/30 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black shadow-2xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMedia.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Media Renderer: Photo vs MP4 Video */}
                {currentMedia.type === 'video' ? (
                  <video
                    ref={videoElemRef}
                    src={currentMedia.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setFullscreenItem(currentMedia)}
                  />
                ) : (
                  <div
                    className="w-full h-full bg-cover bg-center ken-burns cursor-pointer"
                    style={{ backgroundImage: `url(${currentMedia.url})` }}
                    onClick={() => setFullscreenItem(currentMedia)}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              </motion.div>
            </AnimatePresence>

            {/* Video Play/Pause Overlay Controls */}
            {currentMedia.type === 'video' && (
              <button
                onClick={toggleVideoPlay}
                className="absolute top-4 right-16 p-2.5 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md transition-all cursor-pointer z-30"
                title={isVideoPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            )}

            {/* Fullscreen Button */}
            <button
              onClick={() => setFullscreenItem(currentMedia)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md transition-all cursor-pointer z-30"
              title="Fullscreen View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Caption & Navigation Controls */}
            <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-20 pointer-events-none">
              <div className="text-left space-y-1 max-w-xl pointer-events-auto">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-500/80 text-white backdrop-blur-md inline-flex items-center gap-1.5">
                  {currentMedia.type === 'video' ? <VideoIcon className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                  <span>{currentMedia.date}</span>
                </span>
                <h3 className="text-xl font-bold text-white leading-snug drop-shadow-md">
                  {currentMedia.caption}
                </h3>
              </div>

              {/* Navigation Arrows & Delete */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {mediaList.length > 1 && (
                  <button
                    onClick={() => handleDeleteMedia(currentMedia.id)}
                    className="p-3 rounded-full bg-black/50 text-pink-300 hover:text-rose-400 backdrop-blur-md transition-colors"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length)}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % mediaList.length)}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-rose-500 backdrop-blur-md transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Thumbnails List with Small Play Icon for Videos */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider text-left px-1">
          Gallery Memories ({mediaList.length})
        </h4>
        <div className="flex items-center gap-3 overflow-x-auto py-2 no-scrollbar">
          {mediaList.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative min-w-[80px] h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex-shrink-0 ${
                  isSelected
                    ? 'border-rose-400 scale-105 shadow-lg shadow-rose-500/30'
                    : 'border-white/20 opacity-70 hover:opacity-100'
                }`}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                    {item.poster ? (
                      <img src={item.poster} alt={item.caption} className="w-full h-full object-cover opacity-85" />
                    ) : (
                      <video src={item.url} className="w-full h-full object-cover opacity-80" />
                    )}
                    {/* Small Play Icon for Video Thumbnail */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-5 h-5 text-white fill-white drop-shadow-md" />
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Preview Modal */}
      <AnimatePresence>
        {fullscreenItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setFullscreenItem(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-rose-500 transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-full max-h-full flex flex-col items-center justify-center">
              {fullscreenItem.type === 'video' ? (
                <video src={fullscreenItem.url} controls autoPlay className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
              ) : (
                <img src={fullscreenItem.url} alt={fullscreenItem.caption} className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
              )}
              <p className="mt-4 text-sm font-semibold text-pink-100">{fullscreenItem.caption}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
