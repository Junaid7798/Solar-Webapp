import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 600);
    const endTimer = setTimeout(() => setIsLoading(false), 2000); // Intro duration

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(endTimer);
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
          {/* Logo */}
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

          {/* Tagline Typing Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display text-2xl text-gray italic mb-12 h-8"
          >
            <Typewriter text="Suraj Sabka Hai — Apna Haq Lo." delay={400} />
          </motion.div>

          {/* Progress Line */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sun to-teal"
            />
          </div>

          {/* Skip Button */}
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

const Typewriter = ({ text, delay }: { text: string, delay: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length && intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, 30);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, delay]);

  return <span>{displayedText}</span>;
};
