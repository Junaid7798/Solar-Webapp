import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppButton = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Show button after 10s
    const btnTimer = setTimeout(() => setIsVisible(true), 10000);
    
    // Show bubble after 12s
    const bubbleTimer = setTimeout(() => {
      if (!sessionStorage.getItem('waBubbleShown')) {
        setShowBubble(true);
        sessionStorage.setItem('waBubbleShown', 'true');
        
        // Hide bubble after 5s
        setTimeout(() => setShowBubble(false), 5000);
      }
    }, 12000);

    return () => {
      clearTimeout(btnTimer);
      clearTimeout(bubbleTimer);
    };
  }, []);

  const handleClick = () => {
    window.open('https://wa.me/918237655610', '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="fixed bottom-8 right-8 z-[90] flex flex-col items-end gap-4"
        >
          {/* Bubble */}
          <AnimatePresence>
            {showBubble && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white text-sky-deep px-6 py-4 rounded-2xl rounded-br-none shadow-2xl border border-sky/10 relative max-w-[250px]"
              >
                <button 
                  onClick={() => setShowBubble(false)}
                  className="absolute top-2 right-2 text-gray hover:text-sky-deep transition-colors"
                  aria-label="Close message"
                >
                  <X size={14} />
                </button>
                <p className="font-bold text-sm leading-relaxed pr-4">
                  {t('whatsapp', 'hello')}
                </p>
                {/* Triangle tail */}
                <div className="absolute -bottom-3 right-4 w-6 h-6 bg-white border-b border-r border-sky/10 transform rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
            aria-label="Chat on WhatsApp"
            className="bg-teal hover:bg-teal/90 text-white rounded-full shadow-[0_10px_30px_rgba(0,200,150,0.4)] flex items-center justify-center transition-all overflow-hidden group"
            style={{ width: isHovered ? 'auto' : '64px', height: '64px' }}
          >
            <div className="flex items-center px-5 gap-3">
              <MessageCircle size={32} className="shrink-0 group-hover:scale-110 transition-transform" />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="font-bold whitespace-nowrap overflow-hidden uppercase tracking-wider text-sm"
                  >
                    {t('whatsapp', 'chat')}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
