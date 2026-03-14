import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const PageProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sun to-teal origin-left z-[1000]"
      style={{ scaleX }}
    />
  );
};
