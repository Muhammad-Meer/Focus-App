import React, { useEffect, useRef } from 'react';

interface RevealProps {
  children: React.ReactNode;
  /** Delay in ms before the reveal transition starts (for staggering). */
  delay?: number;
  className?: string;
}

/**
 * Fades content in as it scrolls into view. Respects prefers-reduced-motion
 * by revealing immediately without animation.
 */
export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};
