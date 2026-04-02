import { useState, useEffect } from 'react';

export const useCountUp = (target: number, duration = 1200) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    const start = performance.now();
    const raf = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration]);
  return count;
};
