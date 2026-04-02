import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { config } from '../../config';
import { X } from 'lucide-react';

export const WhatsAppButton = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bubbleHideRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const btnTimer = setTimeout(() => setIsVisible(true), 10000);
    
    const bubbleTimer = setTimeout(() => {
      if (!sessionStorage.getItem('waBubbleShown')) {
        setShowBubble(true);
        sessionStorage.setItem('waBubbleShown', 'true');
        bubbleHideRef.current = setTimeout(() => setShowBubble(false), 5000);
      }
    }, 12000);

    return () => {
      clearTimeout(btnTimer);
      clearTimeout(bubbleTimer);
      if (bubbleHideRef.current) clearTimeout(bubbleHideRef.current);
    };
  }, []);

  const handleClick = () => {
    window.open(config.whatsappUrl, '_blank');
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
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                fill="currentColor" 
                className="shrink-0 group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
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
