'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedCount({ target = 0, suffix = '', duration = 1200 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(typeof target === 'number' ? target : parseInt(target, 10) || 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const targetNum = typeof target === 'number' ? target : parseInt(target, 10) || 0;

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.floor(easeProgress * targetNum);

            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              setCount(targetNum);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={elementRef} className="tabular-nums font-display font-bold">
      {count}{suffix}
    </span>
  );
}
