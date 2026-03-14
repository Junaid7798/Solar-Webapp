import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';

export const Brands = () => {
  const { t } = useTranslation();

  const partnerBrands = [
    { name: "Tata Solar", logo: "TATA" },
    { name: "Havells", logo: "HAVELLS" },
    { name: "Livguard", logo: "LIVGUARD" },
    { name: "Waaree", logo: "WAAREE" },
    { name: "Vikram Solar", logo: "VIKRAM" },
    { name: "Adani Solar", logo: "ADANI" },
  ];

  return (
    <section id="brands" className="py-20 bg-sky-deep border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Tier 1 - Luminous */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-gradient-to-br from-sky-mid to-sky-deep border border-sun/30 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,179,71,0.15)] overflow-hidden group"
        >
          {/* Gold Sweep Animation */}
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-sun/10 to-transparent skew-x-12 pointer-events-none"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sun/10 border border-sun/20 text-sun text-sm font-bold tracking-wide mb-6">
                {t('brands', 'authDist')}
              </div>
              <h3 className="font-display font-bold text-4xl md:text-5xl text-white mb-6 uppercase tracking-wider">
                Luminous Solar
              </h3>
              <ul className="space-y-4 text-gray text-lg">
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-5 h-5 rounded-full bg-teal/20 text-teal flex items-center justify-center text-xs">✓</span>
                  {t('brands', 't1')}
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-5 h-5 rounded-full bg-teal/20 text-teal flex items-center justify-center text-xs">✓</span>
                  {t('brands', 't2')}
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="w-5 h-5 rounded-full bg-teal/20 text-teal flex items-center justify-center text-xs">✓</span>
                  {t('brands', 't3')}
                </li>
              </ul>
            </div>
            
            <div className="w-full md:w-1/3 aspect-video bg-white rounded-2xl flex items-center justify-center p-8 shadow-inner relative overflow-hidden">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Luminous_Power_Technologies_logo.svg/1200px-Luminous_Power_Technologies_logo.svg.png" 
                 alt="Luminous Solar" 
                 className="w-full h-full object-contain"
                 referrerPolicy="no-referrer"
               />
            </div>
          </div>
        </motion.div>

        {/* Tier 2 - Partners */}
        <div className="mt-24">
          <h4 className="text-center font-mono text-silver text-sm tracking-widest uppercase mb-12">
            {t('brands', 'title')}
          </h4>
          
          <div className="relative flex overflow-x-hidden">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-sky-deep to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-sky-deep to-transparent z-10 pointer-events-none" />
            
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-16 whitespace-nowrap"
            >
              {[...partnerBrands, ...partnerBrands, ...partnerBrands].map((brand, i) => (
                <div 
                  key={i} 
                  className="w-40 h-20 bg-sky-mid/50 border border-white/5 rounded-xl flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:bg-white/5 hover:border-white/20 cursor-pointer"
                >
                  <span className="font-display font-bold text-xl text-white/50 hover:text-white transition-colors">{brand.logo}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
