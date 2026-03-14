import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { ArrowRight, ChevronDown, ShieldCheck, Zap, Users, TrendingUp, Sun, Leaf, Battery } from 'lucide-react';

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
      style={{ backgroundImage }}
      className="relative min-h-screen flex items-center pt-28 pb-32 overflow-hidden"
    >
      {/* ── Star Field ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {STARS.map(s => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`, top: `${s.y}%`,
              width: `${s.size}px`, height: `${s.size}px`,
              animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Scan Line ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="animate-scan absolute left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.5),rgba(14,165,233,0.4),transparent)' }}
        />
      </div>

      {/* ── Dot Grid ── */}
      <div className="absolute inset-0 z-0 dot-pattern opacity-30" />

      {/* ── Ambient Orbs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Primary amber orb — top-right (the sun) */}
        <div
          className="animate-orb1 absolute -top-32 right-[-8%] w-[650px] h-[650px] rounded-full blur-[130px] opacity-25"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, #FCD34D 30%, transparent 70%)' }}
        />
        {/* Sky blue orb — bottom-left */}
        <div
          className="animate-orb2 absolute bottom-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[110px] opacity-20"
          style={{ background: 'radial-gradient(circle, #0EA5E9 0%, #38BDF8 30%, transparent 70%)' }}
        />
        {/* Emerald orb — mid */}
        <div
          className="animate-orb3 absolute top-[40%] right-[25%] w-[300px] h-[300px] rounded-full blur-[90px] opacity-12"
          style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 glass-amber"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-amber opacity-75" style={{ background: '#F59E0B' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#F59E0B' }} />
              </span>
              <span className="text-amber text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: '#F59E0B' }}>
                {t('hero', 'tag')}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1 }}
              className="font-display font-extrabold leading-[0.88] tracking-tighter mb-8"
              style={{ fontSize: 'clamp(3.2rem, 7.5vw, 6.2rem)' }}
            >
              <span className="block text-white">{t('hero', 'title1')}</span>
              <span className="block text-white">{t('hero', 'title2')}</span>
              <span className="block text-gradient-amber">{t('hero', 'title3')}</span>
            </motion.h1>

            {/* Sub + tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg leading-relaxed mb-3 max-w-lg font-light"
              style={{ color: '#94A3B8' }}
            >
              {t('hero', 'subtext')}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="font-display text-xl italic font-medium tracking-wide mb-10"
              style={{ color: 'rgba(245,158,11,0.75)' }}
            >
              {t('hero', 'tagline')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={scrollToQuote}
                className="cursor-pointer relative group overflow-hidden px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2.5"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', color: '#07090F', boxShadow: '0 0 30px rgba(245,158,11,0.35)' }}
              >
                {/* Shine sweep */}
                <span
                  className="absolute top-0 h-full w-[45%] skew-x-[-20deg] bg-white/25 pointer-events-none"
                  style={{ animation: 'shine-sweep 2.5s ease-in-out infinite', left: '-150%' }}
                />
                <span className="relative z-10">{t('hero', 'cta1')}</span>
                <ArrowRight size={17} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={scrollToServices}
                className="cursor-pointer px-8 py-4 glass rounded-2xl font-bold text-white text-sm flex items-center gap-2.5 hover:border-amber/30 transition-all border border-white/10"
                style={{ color: '#CBD5E1' }}
              >
                {t('hero', 'cta2')}
                <ChevronDown size={15} className="opacity-50" />
              </motion.button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 items-center border-t pt-8"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              {[
                { icon: ShieldCheck, label: 'Certified Partner', color: '#10B981' },
                { icon: Users,       label: '500+ Families',    color: '#F59E0B' },
                { icon: Zap,         label: '24/7 Support',     color: '#0EA5E9' },
              ].map(({ icon: Icon, label, color }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon size={15} style={{ color }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Solar Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 70 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            {/* Orbiting rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[460px] h-[460px] rounded-full border border-amber/8 animate-spin-slow" style={{ borderColor: 'rgba(245,158,11,0.08)' }} />
              <div className="absolute w-[370px] h-[370px] rounded-full border border-sky/8 animate-spin-slow-rev" style={{ borderColor: 'rgba(14,165,233,0.08)' }} />
              <div className="absolute w-[280px] h-[280px] rounded-full border border-white/4" />
            </div>

            {/* Sun orb centre */}
            <div className="absolute w-20 h-20 rounded-full animate-float pointer-events-none z-0"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, transparent 70%)', filter: 'blur(16px)' }} />

            {/* Main card */}
            <div className="relative z-10 w-[360px] flex flex-col gap-4">

              {/* Energy output */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="glass rounded-[1.75rem] p-6 border"
                style={{ borderColor: 'rgba(245,158,11,0.15)', boxShadow: '0 0 40px rgba(245,158,11,0.1)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>Live Energy Output</p>
                    <p className="font-display font-extrabold text-3xl text-white">
                      8.4 <span className="text-xl" style={{ color: '#F59E0B' }}>kWh</span>
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Sun size={26} style={{ color: '#F59E0B' }} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mb-4">
                  <TrendingUp size={13} style={{ color: '#10B981' }} />
                  <span className="text-xs font-bold" style={{ color: '#10B981' }}>+14% vs yesterday</span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-10">
                  {[38, 60, 48, 75, 68, 88, 82].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: i === 6
                          ? 'linear-gradient(to top, #F59E0B, #FCD34D)'
                          : 'rgba(245,158,11,0.18)',
                      }} />
                  ))}
                </div>
              </motion.div>

              {/* Two bottom cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="glass rounded-[1.25rem] p-5 border"
                  style={{ borderColor: 'rgba(16,185,129,0.18)', boxShadow: '0 0 20px rgba(16,185,129,0.08)' }}
                >
                  <Leaf size={20} className="mb-3" style={{ color: '#10B981' }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>CO₂ Saved</p>
                  <p className="font-display font-bold text-xl text-white">12.4 <span className="text-sm" style={{ color: '#10B981' }}>Tons</span></p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="glass-amber rounded-[1.25rem] p-5"
                >
                  <Battery size={20} className="mb-3" style={{ color: '#0EA5E9' }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Annual Saving</p>
                  <p className="font-display font-bold text-xl text-white">₹45K</p>
                </motion.div>
              </div>
            </div>

            {/* Decorative blurs */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-30"
              style={{ background: '#F59E0B' }} />
            <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full blur-[70px] pointer-events-none opacity-20"
              style={{ background: '#0EA5E9' }} />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        onClick={scrollToServices}
        className="cursor-pointer absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5"
      >
        <div className="w-px h-14 bg-gradient-to-b from-amber-400 to-transparent" style={{ background: 'linear-gradient(to bottom, #F59E0B, transparent)' }} />
        <ChevronDown size={15} style={{ color: 'rgba(245,158,11,0.5)' }} />
      </motion.div>

      {/* ── Marquee Strip ── */}
      <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden py-3"
        style={{ background: 'linear-gradient(90deg, #F59E0B, #FCD34D, #0EA5E9, #F59E0B)', backgroundSize: '300% auto', animation: 'gradient-shift 8s ease infinite' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, o) => (
            <div key={o} className="flex items-center shrink-0">
              {['Solar Installation', 'Battery Storage', 'Net Metering', 'EV Charging', 'Smart Monitoring', 'AMC Service', 'PM Surya Ghar 2024'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-8">
                  <Sun size={11} className="opacity-60 shrink-0" style={{ color: '#07090F' }} />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.22em]" style={{ color: '#07090F' }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
