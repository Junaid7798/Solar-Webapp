import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <section id="brands" className="py-20 bg-sky-deep border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Tier 1 - Luminous */}
        <motion.div 
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative bg-void border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(255,179,71,0.05)] overflow-hidden group cursor-pointer"
        >
          {/* Spotlight Hover */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  800px circle at ${mouseX}px ${mouseY}px,
                  rgba(255,179,71,0.1),
                  transparent 80%
                )
              `,
            }}
          />

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
            <div className="w-full md:w-1/3 aspect-video bg-white/95 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden ring-4 ring-white/10 shadow-[0_0_40px_rgba(255,255,255,0.05)] group hover:shadow-[0_0_60px_rgba(245,158,11,0.2)] transition-all duration-500">
               <img 
                 src="/images/luminous-ecowatt.webp" 
                 alt="Luminous EcoWatt Inverter & Battery Combo"
                 loading="lazy"
                 decoding="async"
                 className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                 style={{ mixBlendMode: 'multiply' }}
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
                  className="w-44 h-24 glass border border-white/5 rounded-2xl flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:bg-white/10 hover:border-white/20 cursor-pointer relative overflow-hidden group transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,179,71,0.15)]"
                >
                  {/* Subtle shine inside logo box */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <span className="font-display font-bold text-2xl text-white/40 group-hover:text-white transition-colors duration-500 relative z-10">{brand.logo}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
