import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckCircle2, ShieldCheck, Zap, HandCoins } from 'lucide-react';

export const About = () => {
  const { t } = useTranslation();
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const stats = [
    { id: 'stat1', value: 500, suffix: '+', icon: '⚡' },
    { id: 'stat2', value: 98, suffix: '%', icon: '😊' },
    { id: 'stat3', value: 3, suffix: '+', icon: '📅' },
    { id: 'stat4', value: 2500, suffix: '+', icon: '🌱' },
  ];

  const features = [
    { id: 'w1', icon: CheckCircle2 },
    { id: 'w2', icon: ShieldCheck },
    { id: 'w3', icon: Zap },
    { id: 'w4', icon: HandCoins },
  ];

  return (
    <section id="about" className="py-24 bg-light-bg text-sky-deep relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Tag */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky/10 border border-sky/20 text-sky-deep text-sm font-bold tracking-wide mb-12 uppercase"
        >
          {t('about', 'tag')}
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left - Owner Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="lg:col-span-4 flex flex-col items-center text-center"
          >
            <div className="relative w-64 h-64 mb-8">
              {/* Circular Clip Path Reveal */}
              <motion.div 
                initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                whileInView={{ clipPath: 'circle(50% at 50% 50%)' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="absolute inset-0 bg-sky-mid rounded-full border-4 border-sun overflow-hidden shadow-[0_0_40px_rgba(255,179,71,0.3)]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop" 
                  alt="Rajesh Sharma - Founder" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
            
            <h3 className="font-display font-bold text-3xl text-sky-deep mb-1">
              {t('about', 'founder')}
            </h3>
            <p className="text-gray font-medium uppercase tracking-widest text-sm mb-6">
              {t('about', 'title')}
            </p>
            <p className="font-display text-xl italic text-sky-mid leading-relaxed">
              {t('about', 'quote')}
            </p>
          </motion.div>

          {/* Right - Story & Features */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-16"
            >
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-8 leading-tight">
                {t('about', 'story').split('—')[0]} — <span className="text-sun">{t('about', 'story').split('—')[1]}</span>
              </h2>
              <p className="text-sky-mid/80 text-lg leading-relaxed">
                {t('about', 'story')}
              </p>
            </motion.div>

            {/* Why Choose Us Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-sky/5 flex items-start gap-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky/5 flex items-center justify-center shrink-0">
                      <Icon className="text-sun" size={24} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xl mb-1">{t('about', feature.id)}</h4>
                      <p className="text-gray text-sm">{t('about', `${feature.id}d`)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="bg-white rounded-3xl p-8 text-center shadow-sm border border-sky/5 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform duration-500">
                {stat.icon}
              </div>
              <div className="font-mono font-bold text-4xl md:text-5xl text-sky-deep mb-2 flex items-center justify-center">
                <Counter value={stat.value} />
                <span className="text-sun ml-1">{stat.suffix}</span>
              </div>
              <p className="font-display font-bold text-gray uppercase tracking-wider text-sm">
                {t('about', stat.id)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certifications Strip */}
        <div className="mt-24 border-y border-sky/10 py-8 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-light-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-light-bg to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-12 whitespace-nowrap"
          >
            {['MNRE Approved', 'MSEDCL Empanelled', 'ISO 9001:2015', 'MEDA Registered', 'PM Surya Ghar Authorized Vendor 2024', 'MNRE Approved', 'MSEDCL Empanelled', 'ISO 9001:2015'].map((cert, i) => (
              <div key={i} className="flex items-center gap-3">
                <ShieldCheck className="text-teal" size={20} />
                <span className="font-display font-bold text-sky-mid uppercase tracking-widest">{cert}</span>
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

// Simple Counter Component
const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};
