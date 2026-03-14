import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 relative z-10">

        {/* Section tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-14 border text-[11px] font-bold tracking-[0.2em] uppercase"
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
            <div className="relative w-52 h-52 mb-8">
              <div className="absolute inset-[-3px] rounded-full"
                style={{ background: 'conic-gradient(from 0deg,#F59E0B,#0EA5E9,#10B981,#F59E0B)', padding: '3px', borderRadius: '50%' }}>
                <div className="w-full h-full rounded-full" style={{ background: '#07090F' }} />
              </div>
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <motion.div
                  initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                  whileInView={{ clipPath: 'circle(50% at 50% 50%)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="w-full h-full"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"
                    alt="Founder"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
              {/* Glow ring */}
              <div className="absolute inset-[-12px] rounded-full blur-[20px] opacity-30 pointer-events-none"
                style={{ background: 'conic-gradient(from 0deg,#F59E0B,#0EA5E9,#10B981,#F59E0B)' }} />
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
                style={{ fontSize: 'clamp(2rem,4vw,3.2rem)' }}>
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

        {/* ── Stats ── */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                className="relative rounded-[1.5rem] p-8 text-center overflow-hidden group card-hover cursor-default"
                style={{ background: `${s.color}07`, border: `1px solid ${s.color}18` }}
              >
                <div className="absolute top-0 left-4 right-4 h-px"
                  style={{ background: `linear-gradient(90deg,transparent,${s.color}55,transparent)` }} />

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
        <div className="mt-16 border-y py-7 overflow-hidden relative" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
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
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
};
