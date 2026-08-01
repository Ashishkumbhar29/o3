import React, { useState, useRef, useEffect } from 'react';
import { ProposalProvider, useProposal } from './context/AppContext';

import { PasswordLock } from './components/screens/PasswordLock';
import { WeatherCanvas } from './components/background/WeatherCanvas';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/ui/Navbar';
import { AILoveAssistant } from './components/ui/AILoveAssistant';

import { HeroCard } from './components/screens/HeroCard';
import { VideoMemories } from './components/screens/VideoMemories';
import { LoveMap } from './components/screens/LoveMap';
import { BucketList } from './components/screens/BucketList';
import { OpenWhenLetters } from './components/screens/OpenWhenLetters';
import { LoveQuiz } from './components/screens/LoveQuiz';
import { MemorySlideshow } from './components/screens/MemorySlideshow';

import { ShareModal } from './components/ui/ShareModal';
import { QRCodeModal } from './components/ui/QRCodeModal';
import { exportMemoryBookPDF } from './components/ui/MemoryBookPDF';
import { AdminPanel } from './components/screens/AdminPanel';
import { FinalMessage } from './components/screens/FinalMessage';
import { Music } from 'lucide-react';

const MainAppContent = () => {
  const {
    data,
    isUnlocked,
    activeTab,
    isPlayingMusic,
    setIsPlayingMusic,
    isMuted,
    musicVolume,
    isMusicLoop
  } = useProposal();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [showPlaySongBtn, setShowPlaySongBtn] = useState(false);

  const audioRef = useRef(null);

  // Sync background audio player settings
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = musicVolume;
    audioRef.current.loop = isMusicLoop;
    audioRef.current.muted = isMuted;
  }, [musicVolume, isMusicLoop, isMuted]);

  useEffect(() => {
    if (!audioRef.current || !data.bgMusicUrl) return;
    if (isPlayingMusic) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setShowPlaySongBtn(false);
          })
          .catch((e) => {
            console.log('Audio autoplay blocked by browser:', e);
            setShowPlaySongBtn(true);
          });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlayingMusic, data.bgMusicUrl]);

  const handleStartSong = () => {
    if (!audioRef.current) return;
    audioRef.current.play().then(() => {
      setIsPlayingMusic(true);
      setShowPlaySongBtn(false);
    }).catch(e => console.log('Play error:', e));
  };

  if (!isUnlocked) {
    return <PasswordLock />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'hero':
        return <HeroCard key="tab-hero" />;
      case 'slideshow':
        return <MemorySlideshow key="tab-slideshow" />;
      case 'video':
        return <VideoMemories key="tab-video" />;
      case 'map':
        return <LoveMap key="tab-map" />;
      case 'bucket':
        return <BucketList key="tab-bucket" />;
      case 'letters':
        return <OpenWhenLetters key="tab-letters" />;
      case 'quiz':
        return <LoveQuiz key="tab-quiz" />;
      default:
        return <HeroCard key="tab-hero" />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Background Weather Canvas */}
      <WeatherCanvas />

      {/* Custom Heart Cursor & Particle Trail */}
      <CustomCursor />

      {/* Background MP3 Audio Player */}
      {data.bgMusicUrl && (
        <audio ref={audioRef} src={data.bgMusicUrl} loop={isMusicLoop} />
      )}

      {/* Top Navbar Header */}
      <Navbar
        onOpenShare={() => setIsShareOpen(true)}
        onOpenQR={() => setIsQROpen(true)}
        onExportPDF={() => exportMemoryBookPDF(data)}
      />

      {/* Main Screen Content Container */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 py-6 z-10">
        {renderActiveScreen()}
      </main>

      {/* Elegant Autoplay Banner Button */}
      {(showPlaySongBtn || (data.bgMusicUrl && !isPlayingMusic)) && (
        <button
          onClick={handleStartSong}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/30 hover:scale-105 transition-all cursor-pointer animate-bounce"
        >
          <Music className="w-4 h-4 fill-white" />
          <span>Play Our Song ❤️</span>
        </button>
      )}

      {/* Floating AI Love Assistant */}
      <AILoveAssistant />

      {/* Modals & Overlay Screens */}
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
      <QRCodeModal isOpen={isQROpen} onClose={() => setIsQROpen(false)} />
      <AdminPanel />
      <FinalMessage />

      {/* Footer Credit */}
      <footer className="w-full py-6 text-center text-xs font-semibold text-pink-200/60 z-10">
        Made with infinite ❤️ for Girlfriend's Day • Ashish & Prachi (Since 8 March 2026)
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ProposalProvider>
      <MainAppContent />
    </ProposalProvider>
  );
}
