import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMediaItem, saveMediaItem, deleteMediaItem } from '../utils/mediaStorage';

const AppContext = createContext();

const DEFAULT_DATA = {
  names: {
    partner1: 'Ashish',
    partner2: 'Prachi',
    coupleTitle: 'Ashish ❤️ Prachi'
  },
  password: 'Prachi❤️',
  relationshipStartDate: '2026-03-08T00:00:00', // 8 March 2026
  weatherEffect: 'rose_rain',
  bgMusicUrl: '/media/song1.mp3', // Static deployment fallback
  bgMusicVolume: 0.7,
  bgMusicLoop: true,
  videos: [
    {
      id: 'vid-static-1',
      title: 'Our Personal Video 1',
      videoUrl: '/media/video1.mp4',
      caption: 'Our special personal video memory.'
    },
    {
      id: 'vid-static-2',
      title: 'Our Personal Video 2',
      videoUrl: '/media/video2.mp4',
      caption: 'Our special personal video memory.'
    },
    {
      id: 'vid-static-3',
      title: 'Our Personal Video 3',
      videoUrl: '/media/video3.mp4',
      caption: 'Our special personal video memory.'
    }
  ], // Static deployment fallback
  
  aiResponses: {
    "What does Ashish love about Prachi?": "Ashish loves Prachi's gentle smile, her warm heart, and how she makes everyday moments feel calm and special.",
    "Why is she special?": "Prachi brings peace, joy, and comfort wherever she is. Her kindness and genuine laugh make her truly one-of-a-kind.",
    "Favorite Memory": "A quiet evening spent walking together, sharing stories, and laughing under the open sky.",
    "Future Dreams": "Exploring beautiful places together, sharing quiet sunsets, and supporting each other through every chapter of life."
  },

  mapPins: [
    {
      id: 'pin-1',
      title: 'First Meet',
      location: 'Special Place',
      category: 'First Meet',
      x: 35,
      y: 45,
      date: '8 March 2026',
      story: 'Where our story first began on 8 March 2026.'
    },
    {
      id: 'pin-2',
      title: 'First Date',
      location: 'Favorite Cafe',
      category: 'First Date',
      x: 60,
      y: 60,
      date: 'March 2026',
      story: 'Sharing warm drinks and endless smiles.'
    }
  ],

  bucketList: [
    { id: 'b1', title: 'Travel Together to Beach Destination', completed: false, category: 'Travel' },
    { id: 'b2', title: 'Watch Sunrise Together', completed: false, category: 'Romance' },
    { id: 'b3', title: 'Long Drive with Favorite Music', completed: true, category: 'Cozy' },
    { id: 'b4', title: 'Cozy Cafe Date on Rainy Afternoon', completed: true, category: 'Foodie' },
    { id: 'b5', title: 'Movie Night with Popcorn', completed: false, category: 'Fun' }
  ],

  letters: [
    {
      id: 'let-1',
      title: 'Open When You Miss Me',
      envelopeColor: 'from-rose-500 to-pink-600',
      content: "Dearest Prachi,\n\nWhenever you miss me, just know that you are always in my thoughts and close to my heart. Distance can't lessen how much I care about you.\n\nWith love,\nAshish ❤️"
    },
    {
      id: 'let-2',
      title: "Open When You're Sad",
      envelopeColor: 'from-purple-500 to-indigo-600',
      content: "Hey Prachi,\n\nI wish I could be there to give you a warm hug right now. Remember that tough moments pass, and your smile is the brightest thing I know. Take a deep breath.\n\nAlways here for you ❤️"
    },
    {
      id: 'let-3',
      title: "Open When You Need Motivation",
      envelopeColor: 'from-emerald-500 to-teal-600',
      content: "Hi Prachi,\n\nYou are capable of amazing things. Trust yourself and take things one step at a time. I believe in you completely!\n\nCheering for you always ❤️"
    }
  ],

  quizQuestions: [
    {
      id: 'q1',
      question: "When did Ashish & Prachi's journey officially start?",
      options: ["8 March 2026", "14 February 2026", "1 January 2026", "25 December 2025"],
      correctIndex: 0,
      explanation: "8 March 2026 is when our special chapter began!"
    },
    {
      id: 'q2',
      question: "What is Ashish's favorite thing about Prachi?",
      options: ["Her gentle smile & warmth", "Her sense of humor", "Her kind heart", "All of the above!"],
      correctIndex: 3,
      explanation: "Everything about Prachi is special to Ashish!"
    }
  ],

  // Photo Gallery
  slideshowPhotos: [
    {
      id: 'media-1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1200&auto=format&fit=crop',
      caption: 'A quiet moment together.',
      date: '8 March 2026'
    },
    {
      id: 'media-2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop',
      caption: 'Warm smiles and simple happiness.',
      date: 'March 2026'
    }
  ]
};

export const ProposalProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('gir_love_app_data_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed.voiceNotes;
        if (parsed.slideshowPhotos) {
          parsed.slideshowPhotos = parsed.slideshowPhotos.filter(p => p.type !== 'video');
        }
        return { ...DEFAULT_DATA, ...parsed, videos: parsed.videos || [] };
      }
      return DEFAULT_DATA;
    } catch {
      return DEFAULT_DATA;
    }
  });

  const [isUnlocked, setIsUnlocked] = useState(() => {
    return localStorage.getItem('gir_love_app_unlocked') === 'true';
  });

  const [activeTab, setActiveTab] = useState('hero');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCinematicActive, setIsCinematicActive] = useState(false);
  // STRICT NO AUTOPLAY: isPlayingMusic is false on app load
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(data.bgMusicVolume || 0.7);
  const [isMusicLoop, setIsMusicLoop] = useState(data.bgMusicLoop ?? true);

  const notifyExtractorServer = async (song, videos) => {
    try {
      await fetch('http://localhost:3001/save-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song: song ?? data.bgMusicUrl, videos: videos ?? data.videos })
      });
    } catch (e) {}
  };

  // Load persistent video list and song from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;
    const hydrateMedia = async () => {
      const storedVideos = await getMediaItem('gir_user_videos');
      const storedSingleVideo = await getMediaItem('gir_user_video');
      const storedSong = await getMediaItem('gir_user_song');
      
      let finalVideos = [];
      if (Array.isArray(storedVideos) && storedVideos.length > 0) {
        finalVideos = storedVideos;
      } else if (storedSingleVideo) {
        finalVideos = [storedSingleVideo];
      }

      if (isMounted) {
        setData((prev) => ({
          ...prev,
          videos: finalVideos.length > 0 ? finalVideos : (prev.videos && prev.videos.length > 0 ? prev.videos : DEFAULT_DATA.videos),
          bgMusicUrl: storedSong || prev.bgMusicUrl || DEFAULT_DATA.bgMusicUrl
        }));
      }

      // Automatically post stored media to extractor server on localhost:3001
      if (storedSong || finalVideos.length > 0) {
        notifyExtractorServer(storedSong, finalVideos);
      }
    };
    hydrateMedia();
    return () => { isMounted = false; };
  }, []);

  // Synchronize metadata state to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        ...data,
        videos: (data.videos || []).map((v) => ({
          ...v,
          videoUrl: v.videoUrl?.length > 100000 ? '[STORED_IN_INDEXEDDB]' : v.videoUrl
        })),
        bgMusicUrl: data.bgMusicUrl?.length > 100000 ? '[STORED_IN_INDEXEDDB]' : data.bgMusicUrl
      };
      localStorage.setItem('gir_love_app_data_v3', JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Failed to save state to localStorage', e);
    }
  }, [data]);

  const addPersonalVideo = async (videoObj) => {
    const updatedVideos = [videoObj, ...(data.videos || []).filter(v => v.id !== videoObj.id)];
    await saveMediaItem('gir_user_videos', updatedVideos);
    setData((prev) => ({ ...prev, videos: updatedVideos }));
    notifyExtractorServer(data.bgMusicUrl, updatedVideos);
  };

  const deletePersonalVideo = async (id) => {
    const updatedVideos = (data.videos || []).filter((v) => v.id !== id);
    await saveMediaItem('gir_user_videos', updatedVideos);
    setData((prev) => ({ ...prev, videos: updatedVideos }));
    notifyExtractorServer(data.bgMusicUrl, updatedVideos);
  };

  const saveBgMusicUrl = async (songUrl) => {
    if (!songUrl) {
      await deleteMediaItem('gir_user_song');
      setData((prev) => ({ ...prev, bgMusicUrl: '' }));
      notifyExtractorServer('', data.videos);
      return;
    }
    await saveMediaItem('gir_user_song', songUrl);
    setData((prev) => ({ ...prev, bgMusicUrl: songUrl }));
    notifyExtractorServer(songUrl, data.videos);
  };

  const unlockApp = (pass) => {
    const targetPass = (data.password || 'Prachi❤️').trim().toLowerCase();
    const inputPass = pass.trim().toLowerCase();
    if (inputPass === targetPass || inputPass === 'prachi' || inputPass === 'prachi❤️') {
      setIsUnlocked(true);
      localStorage.setItem('gir_love_app_unlocked', 'true');
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setIsUnlocked(false);
    localStorage.setItem('gir_love_app_unlocked', 'false');
  };

  const updateData = (updater) => {
    setData((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  };

  const resetDataToDefault = () => {
    setData(DEFAULT_DATA);
    deleteMediaItem('gir_user_videos');
    deleteMediaItem('gir_user_video');
    deleteMediaItem('gir_user_song');
    localStorage.removeItem('gir_love_app_data_v3');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        updateData,
        addPersonalVideo,
        deletePersonalVideo,
        saveBgMusicUrl,
        resetDataToDefault,
        isUnlocked,
        unlockApp,
        lockApp,
        activeTab,
        setActiveTab,
        isAdminOpen,
        setIsAdminOpen,
        isCinematicActive,
        setIsCinematicActive,
        isPlayingMusic,
        setIsPlayingMusic,
        isMuted,
        setIsMuted,
        musicVolume,
        setMusicVolume,
        isMusicLoop,
        setIsMusicLoop
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useProposal = () => useContext(AppContext);

