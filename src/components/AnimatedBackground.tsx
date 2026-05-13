import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'dots' | 'gradient' | 'mesh' | 'blur';
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'gradient', 
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (variant === 'dots' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      const updateSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      // Create animated dots
      const dots: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        radius: number;
      }> = [];

      for (let i = 0; i < 50; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5,
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
        
        dots.forEach((dot) => {
          dot.x += dot.vx;
          dot.y += dot.vy;

          if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
          if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;

          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }
  }, [variant]);

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {variant === 'dots' && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
        />
      )}
      {variant === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 animate-pulse opacity-50" />
      )}
      {variant === 'mesh' && (
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      )}
      {variant === 'blur' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
      )}
    </div>
  );
};
