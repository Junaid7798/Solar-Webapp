import React, { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate, useSpring, useTransform } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowRight, ChevronDown, ShieldCheck, Zap, Users, TrendingUp, Sun, Leaf, Battery } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';

/* Cycling aurora colors for the hero gradient */
const AURORA_COLORS = ['#F59E0B', '#0EA5E9', '#10B981', '#F59E0B'];

/* Generate stable star positions */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 97.3)  % 100,
  size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
  delay: (i * 0.23) % 4,
  duration: 2.5 + (i % 3) * 1.2,
}));

export const Hero = () => {
  const { t } = useTranslation();
  const color = useMotionValue(AURORA_COLORS[0]);
  const backgroundImage = useMotionTemplate`radial-gradient(130% 130% at 60% 0%, #07090F 45%, ${color}28)`;

  // --- Parallax Setup ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const springConfig = { damping: 25, stiffness: 100, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const orb1X = useTransform(smoothX, [-1, 1], [-40, 40]);
  const orb1Y = useTransform(smoothY, [-1, 1], [-40, 40]);
  const orb2X = useTransform(smoothX, [-1, 1], [40, -40]);
  const orb2Y = useTransform(smoothY, [-1, 1], [40, -40]);
  const orb3X = useTransform(smoothX, [-1, 1], [-20, 20]);
  const orb3Y = useTransform(smoothY, [-1, 1], [-20, 20]);
  const bgX = useTransform(smoothX, [-1, 1], [15, -15]);
  const bgY = useTransform(smoothY, [-1, 1], [15, -15]);


  useEffect(() => {
    const ctrl = animate(color, AURORA_COLORS, {
      ease: 'easeInOut', duration: 12, repeat: Infinity, repeatType: 'mirror',
    });
    return ctrl.stop;
  }, [color]);

  const scrollToQuote    = () => document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToServices = () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.section
      id="home"
      onMouseMove={handleMouseMove}
      style={{ backgroundImage }}
      className="relative min-h-[85vh] flex flex-col-reverse lg:flex-row overflow-hidden bg-[#07090F] pt-32 lg:pt-40"
    >
      {/* ── Star Field ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {STARS.map(s => (
          <div
            key={s.id}
            className={`absolute rounded-full bg-white ${s.id % 2 === 0 ? 'max-lg:hidden' : ''}`}
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.size}px`, height: `${s.size}px`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Ambient Orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-visible">
        <motion.div
           style={{ x: orb1X, y: orb1Y, background: 'radial-gradient(circle, #F59E0B 0%, #FCD34D 30%, transparent 70%)' }}
          className="animate-orb1 absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full blur-[130px] opacity-15"
        />
        <motion.div
           style={{ x: orb2X, y: orb2Y, background: 'radial-gradient(circle, #0EA5E9 0%, #38BDF8 30%, transparent 70%)' }}
          className="animate-orb2 absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full blur-[110px] opacity-10"
        />
      </div>

      {/* ── [LEFT SIDE] CONTENT ── */}
      <div className="relative z-10 w-full lg:w-[48%] flex items-center justify-end h-auto lg:min-h-[85vh]">
        <div className="w-full max-w-[660px] px-6 md:px-12 py-20 lg:py-0 flex flex-col items-center text-center lg:items-start lg:text-left">
          
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full mb-8 lg:mb-10 glass border border-white/5 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#F59E0B' }} />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: '#F59E0B' }} />
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.25em]" style={{ color: '#F59E0B' }}>
              {t('hero', 'tag')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="font-display font-extrabold leading-[1.05] tracking-tight mb-6 lg:mb-8"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 4.8rem)' }}
          >
            <span className="block text-white drop-shadow-lg">{t('hero', 'title1')}</span>
            <span className="block text-white drop-shadow-lg">{t('hero', 'title2')}</span>
            <span className="block text-gradient-solar animate-gradient mt-2 lg:mt-3 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">{t('hero', 'title3')}</span>
          </motion.h1>

          {/* Sub + tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl leading-relaxed mb-4 max-w-xl font-light"
            style={{ color: '#94A3B8' }}
          >
            {t('hero', 'subtext')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="font-display text-xl md:text-2xl italic font-medium tracking-wide mb-10 lg:mb-12"
            style={{ color: 'rgba(245,158,11,0.9)' }}
          >
            {t('hero', 'tagline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto mb-12 lg:mb-16"
          >
            <MagneticButton
              onClick={scrollToQuote}
              className="group w-full sm:w-auto overflow-hidden px-8 lg:px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 text-black transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 0 30px rgba(245,158,11,0.35)' }}
            >
              <span className="relative z-10 text-[16px] tracking-wide">{t('hero', 'cta1')}</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </MagneticButton>

            <MagneticButton
              onClick={scrollToServices}
              className="w-full sm:w-auto px-8 lg:px-10 py-4 glass rounded-full font-bold text-white flex items-center justify-center gap-3 hover:border-amber/50 transition-all border border-white/10 hover:bg-white/10"
              style={{ color: '#F1F5F9' }}
            >
              <span className="text-[16px] tracking-wide">{t('hero', 'cta2')}</span>
              <ChevronDown size={18} className="opacity-70 group-hover:translate-y-1 transition-transform duration-300" />
            </MagneticButton>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6"
          >
            {[
              { icon: Users,       label: '500+ Families',     color: '#F59E0B' },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <Icon size={14} style={{ color }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#E2E8F0' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── [RIGHT SIDE] IMAGE ── */}
      <div className="relative w-full lg:w-[52%] h-[450px] lg:min-h-[85vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: bgY }}
        >
          <img 
            src="/images/hero-1.png" 
            alt="Happy family with rooftop solar panels"
            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
          />
          {/* Subtle Masking Gradient for Split Edge */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090F] via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-transparent to-transparent lg:hidden" />
        </motion.div>

        {/* Floating Stat Widgets removed per user request */}
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        onClick={scrollToServices}
        className="cursor-pointer absolute bottom-8 left-[24%] -translate-x-1/2 z-30 hidden lg:flex flex-col items-center gap-2"
      >
        <ChevronDown size={24} style={{ color: 'rgba(255,255,255,0.4)' }} className="hover:text-white transition-colors" />
      </motion.div>
    </motion.section>
  );
};
