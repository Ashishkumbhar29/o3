import React, { useEffect, useRef } from 'react';
import { useProposal } from '../../context/AppContext';

export const WeatherCanvas = () => {
  const { data } = useProposal();
  const weatherType = data.weatherEffect || 'rose_rain';
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool setup
    const particleCount = weatherType === 'stars' ? 120 : weatherType === 'snow' ? 90 : 50;
    const particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.03;
        this.pulse = Math.random() * Math.PI;

        if (weatherType === 'stars') {
          this.size = Math.random() * 2.5 + 0.5;
          this.speedY = 0;
          this.speedX = 0;
        } else if (weatherType === 'fireflies') {
          this.size = Math.random() * 4 + 2;
          this.speedY = (Math.random() - 0.5) * 0.6;
          this.speedX = (Math.random() - 0.5) * 0.6;
        } else if (weatherType === 'hearts') {
          this.speedY = -(Math.random() * 1.2 + 0.4); // float upwards
          this.y = initial ? Math.random() * height : height + 20;
        }
      }

      update() {
        this.rotation += this.rotSpeed;
        this.pulse += 0.04;

        if (weatherType === 'rose_rain') {
          this.y += this.speedY * 1.2;
          this.x += Math.sin(this.pulse) * 0.8;
          if (this.y > height + 20) this.reset();
        } else if (weatherType === 'snow') {
          this.y += this.speedY;
          this.x += Math.sin(this.pulse * 0.5) * 0.5;
          if (this.y > height + 20) this.reset();
        } else if (weatherType === 'stars') {
          this.opacity = 0.3 + Math.abs(Math.sin(this.pulse)) * 0.7;
        } else if (weatherType === 'fireflies') {
          this.x += Math.sin(this.pulse) * 0.5;
          this.y += Math.cos(this.pulse) * 0.5;
          this.opacity = 0.4 + Math.abs(Math.sin(this.pulse)) * 0.6;
          if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
        } else if (weatherType === 'butterflies') {
          this.y += Math.sin(this.pulse * 0.8) * 0.8;
          this.x += Math.cos(this.pulse * 0.4) * 1.2;
          if (this.x > width + 30) this.x = -30;
          if (this.y > height || this.y < -30) this.y = Math.random() * height;
        } else if (weatherType === 'sparkles') {
          this.opacity -= 0.008;
          this.size += 0.02;
          if (this.opacity <= 0) this.reset();
        } else if (weatherType === 'hearts') {
          this.y += this.speedY;
          this.x += Math.sin(this.pulse) * 0.6;
          if (this.y < -30) this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (weatherType === 'rose_rain') {
          // Draw Rose Petal shape
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (weatherType === 'snow') {
          // Draw Soft Snowflake
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        } else if (weatherType === 'stars') {
          // Draw Twinkling Star
          ctx.fillStyle = '#fde68a';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#fde68a';
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (weatherType === 'fireflies') {
          // Draw Glowing Firefly
          ctx.fillStyle = '#a3e635';
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#84cc16';
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (weatherType === 'butterflies') {
          // Draw Butterfly
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.ellipse(-this.size * 0.4, 0, this.size * 0.6, this.size * 0.4, Math.sin(this.pulse) * 0.5, 0, Math.PI * 2);
          ctx.ellipse(this.size * 0.4, 0, this.size * 0.6, this.size * 0.4, -Math.sin(this.pulse) * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (weatherType === 'sparkles') {
          // Draw Glittering Sparkle
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (weatherType === 'hearts') {
          // Draw Heart
          ctx.fillStyle = '#fb7185';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#e11d48';
          ctx.beginPath();
          const hSize = this.size * 0.6;
          ctx.moveTo(0, hSize / 4);
          ctx.quadraticCurveTo(0, 0, -hSize / 2, 0);
          ctx.quadraticCurveTo(-hSize, 0, -hSize, hSize / 2);
          ctx.quadraticCurveTo(-hSize, hSize, 0, hSize * 1.3);
          ctx.quadraticCurveTo(hSize, hSize, hSize, hSize / 2);
          ctx.quadraticCurveTo(hSize, 0, hSize / 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, hSize / 4);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
