import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const skipTimer = window.setTimeout(() => setShowSkip(true), 600);

    const finish = () => setIsLoading(false);

    if (document.readyState === 'complete') {
      const quickTimer = window.setTimeout(finish, 1200);
      return () => {
        window.clearTimeout(quickTimer);
        window.clearTimeout(skipTimer);
      };
    }

    window.addEventListener('load', finish);
    const fallbackTimer = window.setTimeout(finish, 3000);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('load', finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[1000] bg-sky-deep flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-16 h-16 rounded-full bg-sun flex items-center justify-center shadow-[0_0_40px_rgba(255,179,71,0.5)]">
              <span className="text-sky-deep font-bold text-4xl">S</span>
            </div>
            <span className="font-display font-bold text-5xl tracking-wide text-white">
              SolarEdge <span className="text-sun">Pro</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl text-gray italic mb-12 h-8"
          >
            <Typewriter text="Suraj Sabka Hai - Apna Haq Lo." delay={400} />
          </motion.div>

          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 0.8, ease: 'easeInOut' }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sun to-teal"
            />
          </div>

          <AnimatePresence>
            {showSkip && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLoading(false)}
                className="absolute bottom-12 text-gray hover:text-white font-mono text-sm tracking-widest uppercase transition-colors"
              >
                Skip Intro
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Typewriter = ({ text, delay }: { text: string; delay: number }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    let intervalId: number | undefined;

    const timerId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        index += 1;
        setDisplayedText(text.substring(0, index));

        if (index >= text.length && intervalId) {
          window.clearInterval(intervalId);
        }
      }, 30);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};
