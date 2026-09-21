'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedCount({ target = 0, suffix = '', duration = 1000 }) {
  const targetNum = typeof target === 'number' ? target : parseInt(target, 10) || 0;
  // Initialize count to targetNum so server-side rendered HTML contains the real live value, not 0
  const [count, setCount] = useState(targetNum);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.IntersectionObserver || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(targetNum);
      hasAnimated.current = true;
      return;
    }

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      const startTime = performance.now();

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
    };

    // Check if already visible in viewport
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Briefly set to 0 and animate up
        setCount(0);
        animate();
        return;
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting && !hasAnimated.current) {
          setCount(0);
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Safety timeout: ensure count is targetNum even if observer didn't trigger
    const safetyTimeout = setTimeout(() => {
      if (!hasAnimated.current) {
        setCount(targetNum);
        hasAnimated.current = true;
      }
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimeout);
    };
  }, [targetNum, duration]);

  return (
    <span ref={elementRef} className="tabular-nums font-display font-bold" suppressHydrationWarning>
      {count}{suffix}
    </span>
  );
}
