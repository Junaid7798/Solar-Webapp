import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowRight, ChevronDown, ShieldCheck, Zap, Users } from 'lucide-react';

export const Hero = () => {
  const { t } = useTranslation();

  const scrollToQuote = () => {
    document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-sky-deep">
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1509391366360-fe5bb6583e2c?auto=format&fit=crop&q=80&w=2000"
          alt="Solar Panels"
          className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-deep/80 via-sky-deep/40 to-sky-deep" />
      </div>

      {/* Dynamic Energy Grid Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,179,71,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,150,0.1),transparent_50%)]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-sun/20 text-sun text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Zap size={14} className="animate-pulse" />
              {t('hero', 'tag')}
            </motion.div>

            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] mb-8 tracking-tighter uppercase">
              {t('hero', 'title1')} <br />
              {t('hero', 'title2')} <br />
              <span className="text-sun text-shadow-glow">{t('hero', 'title3')}</span>
            </h1>

            <p className="text-xl text-silver/80 leading-relaxed mb-10 max-w-lg font-light">
              {t('hero', 'subtext')}
              <span className="block mt-4 text-sun font-display text-2xl italic font-medium tracking-wide">{t('hero', 'tagline')}</span>
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToQuote}
                className="px-8 py-4 bg-sun text-sky-deep font-bold rounded-2xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,179,71,0.3)] hover:shadow-[0_0_30px_rgba(255,179,71,0.5)] transition-all"
              >
                {t('hero', 'cta1')}
                <ArrowRight size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToServices}
                className="px-8 py-4 glass text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                {t('hero', 'cta2')}
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap gap-6 items-center border-t border-white/5 pt-8">
              <div className="flex items-center gap-2 text-silver/60 text-sm">
                <ShieldCheck size={18} className="text-teal" />
                <span className="uppercase tracking-widest font-bold text-[10px]">Certified Partner</span>
              </div>
              <div className="flex items-center gap-2 text-silver/60 text-sm">
                <Users size={18} className="text-sun" />
                <span className="uppercase tracking-widest font-bold text-[10px]">500+ Happy Families</span>
              </div>
              <div className="flex items-center gap-2 text-silver/60 text-sm">
                <Zap size={18} className="text-teal" />
                <span className="uppercase tracking-widest font-bold text-[10px]">24/7 Support</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Visual Energy Grid */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 aspect-square glass rounded-[3rem] p-8 flex items-center justify-center overflow-hidden group">
              {/* Animated Core */}
              <div className="absolute inset-0 bg-gradient-to-br from-sun/10 via-transparent to-teal/10 animate-pulse-slow" />
              
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 border-2 border-dashed border-sun/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-48 h-48 border-2 border-dashed border-teal/20 rounded-full"
                />
                
                <div className="relative z-20 text-center">
                  <Zap size={80} className="text-sun mx-auto mb-4 animate-float drop-shadow-[0_0_20px_rgba(255,179,71,0.5)]" />
                  <div className="font-display font-bold text-4xl text-white">100%</div>
                  <div className="text-sun text-xs font-bold uppercase tracking-widest">Clean Energy</div>
                </div>

                {/* Floating Data Cards */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-10 right-10 glass p-4 rounded-2xl border-sun/20"
                >
                  <div className="text-[10px] text-silver/60 uppercase font-bold mb-1">Live Savings</div>
                  <div className="text-sun font-bold">₹45K <span className="text-white/40 text-[8px]">/yr</span></div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-10 left-10 glass p-4 rounded-2xl border-teal/20"
                >
                  <div className="text-[10px] text-silver/60 uppercase font-bold mb-1">CO2 Saved</div>
                  <div className="text-teal font-bold">12.4 <span className="text-white/40 text-[8px]">Tons</span></div>
                </motion.div>
              </div>
            </div>

            {/* Decorative Rings */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-sun/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal/10 blur-3xl rounded-full" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-sun to-transparent" />
        <span className="text-[10px] text-silver/40 uppercase tracking-widest font-bold">Explore</span>
      </motion.div>

      {/* Marquee Strip */}
      <div className="absolute bottom-0 left-0 w-full bg-sun border-t border-sun/20 py-3 overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              <span className="text-sky-deep text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} className="text-sky-deep/50" /> Solar Installation
              </span>
              <span className="text-sky-deep text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} className="text-sky-deep/50" /> Battery Storage
              </span>
              <span className="text-sky-deep text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} className="text-sky-deep/50" /> EV Charging
              </span>
              <span className="text-sky-deep text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} className="text-sky-deep/50" /> Smart Monitoring
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
