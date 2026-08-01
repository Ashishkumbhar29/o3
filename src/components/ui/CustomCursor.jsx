import React, { useEffect, useState, useRef } from 'react';
import { Heart } from 'lucide-react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState([]);
  const requestRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });

      if (Math.random() < 0.3) {
        setTrail((prev) => [
          ...prev.slice(-15),
          {
            id: Math.random(),
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10,
            size: Math.random() * 12 + 8,
            opacity: 0.9
          }
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Fade trail over time
    const interval = setInterval(() => {
      setTrail((prev) =>
        prev
          .map((t) => ({ ...t, opacity: t.opacity - 0.05, y: t.y - 0.8 }))
          .filter((t) => t.opacity > 0)
      );
    }, 40);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Trail particles */}
      {trail.map((t) => (
        <div
          key={t.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-rose-400 transition-opacity"
          style={{
            left: `${t.x}px`,
            top: `${t.y}px`,
            opacity: t.opacity
          }}
        >
          <Heart style={{ width: t.size, height: t.size }} className="fill-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
        </div>
      ))}

      {/* Main Cursor Icon */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`
        }}
      >
        <div className="relative flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,1)] animate-pulse" />
          <div className="absolute w-8 h-8 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
