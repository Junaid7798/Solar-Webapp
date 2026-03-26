import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckCircle2, ShieldCheck, Zap, HandCoins, Users, Star, Clock, Leaf } from 'lucide-react';

const STATS = [
  { id: 'stat1', value: 500,  suffix: '+', icon: Users,        color: '#F59E0B', label: 'Happy Families' },
  { id: 'stat2', value: 98,   suffix: '%', icon: Star,         color: '#0EA5E9', label: 'Satisfaction'   },
  { id: 'stat3', value: 3,    suffix: '+', icon: Clock,        color: '#10B981', label: 'Years Active'   },
  { id: 'stat4', value: 2500, suffix: '+', icon: Leaf,         color: '#8B5CF6', label: 'kW Installed'   },
];

const FEATURES = [
  { id: 'w1', icon: CheckCircle2, color: '#F59E0B', glow: 'rgba(245,158,11,0.15)' },
  { id: 'w2', icon: ShieldCheck,  color: '#0EA5E9', glow: 'rgba(14,165,233,0.15)' },
  { id: 'w3', icon: Zap,          color: '#10B981', glow: 'rgba(16,185,129,0.15)' },
  { id: 'w4', icon: HandCoins,    color: '#8B5CF6', glow: 'rgba(139,92,246,0.15)' },
];

const CERTS = [
  'MNRE Approved','MSEDCL Empanelled','ISO 9001:2015',
  'MEDA Registered','PM Surya Ghar 2024','MNRE Approved',
  'MSEDCL Empanelled','ISO 9001:2015','MEDA Registered','PM Surya Ghar 2024',
];

export const About = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="relative overflow-hidden" style={{ background: '#07090F' }}>

      {/* ── Background ── */}
      <div className="absolute inset-0 grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] blur-[120px] opacity-10 pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(ellipse,#F59E0B,transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 lg:py-32 relative z-10">

        {/* Section tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border text-[11px] font-bold tracking-[0.2em] uppercase"
          style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.06)', color: '#F59E0B' }}
        >
          {t('about', 'tag')}
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* ── Founder Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 70 }}
            className="lg:col-span-4 flex flex-col items-center text-center"
          >
            {/* Photo with conic border */}
            {/* Quote Icon instead of Photo */}
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/20 to-sky-deep border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)]" />
              <svg className="w-12 h-12 text-amber-500 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            <h3 className="font-display font-extrabold text-2xl text-white mb-1">{t('about', 'founder')}</h3>
            <p className="font-bold uppercase tracking-widest text-xs mb-5" style={{ color: '#64748B' }}>{t('about', 'title')}</p>
            <p className="font-display text-base italic leading-relaxed max-w-xs" style={{ color: 'rgba(245,158,11,0.7)' }}>
              "{t('about', 'quote')}"
            </p>
          </motion.div>

          {/* ── Story + Features ── */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="font-display font-extrabold leading-tight text-white mb-5"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.4rem)' }}>
                {t('about', 'story').split('—')[0]}
                {t('about', 'story').includes('—') && (
                  <>— <span style={{ color: '#F59E0B' }}>{t('about', 'story').split('—')[1]}</span></>
                )}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#64748B' }}>
                {t('about', 'story')}
              </p>
            </motion.div>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl p-6 flex items-start gap-4 cursor-pointer group card-hover"
                    style={{ background: f.glow, border: `1px solid ${f.color}20` }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                      <Icon size={20} style={{ color: f.color }} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg text-white mb-1">{t('about', f.id)}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{t('about', `${f.id}d`)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Visual Banner ── */}
        <div className="relative mt-24 lg:mt-32 rounded-[2.5rem] overflow-hidden h-[300px] md:h-[500px] group shadow-2xl">
          <img
            src="/images/family-solar.jpg"
            alt="Family Solar Innovation"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-sky-deep/5" />
          
          {/* Subtle logo/watermark overlay */}
          <div className="absolute bottom-8 left-8">
            <div className="flex items-center gap-3 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-70 transition-all duration-500">
              <ShieldCheck size={24} className="text-amber-500" />
              <span className="font-display font-black text-white tracking-widest text-sm uppercase">Asrar Solar</span>
            </div>
          </div>
        </div>

        {/* ── Stats Row (Below Image) ── */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="relative rounded-[1.5rem] p-8 text-center overflow-hidden group card-hover cursor-default bg-slate-800/20 border border-slate-700/30"
                style={{ borderBottom: `2px solid ${s.color}40` }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110"
                  style={{ background: `${s.color}14`, border: `1px solid ${s.color}22` }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>

                <div className="font-display font-extrabold text-4xl md:text-5xl text-white mb-2 flex items-center justify-center">
                  <AnimatedCounter value={s.value} />
                  <span className="ml-1" style={{ color: s.color }}>{s.suffix}</span>
                </div>
                <p className="font-bold uppercase tracking-widest text-xs" style={{ color: '#64748B' }}>
                  {t('about', s.id)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Certifications strip ── */}
        <div className="mt-24 border-y py-7 overflow-hidden relative" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right,#07090F,transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left,#07090F,transparent)' }} />
          <motion.div
            animate={{ x: [0, -1300] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-10 whitespace-nowrap"
          >
            {CERTS.map((cert, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <ShieldCheck size={16} style={{ color: '#10B981' }} className="shrink-0" />
                <span className="font-display font-bold uppercase tracking-widest text-sm" style={{ color: '#64748B' }}>{cert}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* Animated counter */
const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const springValue = useSpring(0, { stiffness: 45, damping: 15, mass: 0.8 });
  
  useEffect(() => {
    if (inView) springValue.set(value);
  }, [inView, value, springValue]);

  const output = useTransform(springValue, (current) => Math.floor(current));

  return <motion.span ref={ref}>{output}</motion.span>;
};
