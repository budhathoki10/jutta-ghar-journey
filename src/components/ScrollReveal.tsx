import React, { useEffect, useRef } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Animate each child div individually with stagger
          const childDivs = element.querySelectorAll(':scope > div');
          childDivs.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('reveal-visible');
            }, delay + index * 150);
          });
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  return (
    <div
      ref={elementRef}
      className={`reveal-container ${className}`}
    >
      {React.Children.map(children, (child) => (
        <div className="reveal-element">
          {child}
        </div>
      ))}
      <style>{`
        .reveal-element {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .reveal-element.reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};
