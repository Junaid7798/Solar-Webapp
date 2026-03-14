import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Sun, Wrench, Zap, Battery, BarChart3, CalendarCheck, ArrowRight, Phone, MessageCircle } from 'lucide-react';

const SERVICES = [
  {
    id: 's1', icon: Sun,
    gradient: 'linear-gradient(135deg,#F59E0B,#FCD34D)',
    glow: 'rgba(245,158,11,0.35)',
    border: 'rgba(245,158,11,0.2)',
    bg: 'rgba(245,158,11,0.06)',
    accent: '#F59E0B',
    span: 'md:col-span-2',
  },
  {
    id: 's2', icon: Wrench,
    gradient: 'linear-gradient(135deg,#64748B,#94A3B8)',
    glow: 'rgba(100,116,139,0.30)',
    border: 'rgba(100,116,139,0.2)',
    bg: 'rgba(100,116,139,0.06)',
    accent: '#94A3B8',
    span: '',
  },
  {
    id: 's3', icon: Zap,
    gradient: 'linear-gradient(135deg,#0EA5E9,#38BDF8)',
    glow: 'rgba(14,165,233,0.35)',
    border: 'rgba(14,165,233,0.2)',
    bg: 'rgba(14,165,233,0.06)',
    accent: '#0EA5E9',
    span: '',
  },
  {
    id: 's4', icon: Battery,
    gradient: 'linear-gradient(135deg,#10B981,#34D399)',
    glow: 'rgba(16,185,129,0.35)',
    border: 'rgba(16,185,129,0.2)',
    bg: 'rgba(16,185,129,0.06)',
    accent: '#10B981',
    span: '',
  },
  {
    id: 's5', icon: BarChart3,
    gradient: 'linear-gradient(135deg,#8B5CF6,#A78BFA)',
    glow: 'rgba(139,92,246,0.35)',
    border: 'rgba(139,92,246,0.2)',
    bg: 'rgba(139,92,246,0.06)',
    accent: '#8B5CF6',
    span: 'md:col-span-2',
  },
  {
    id: 's6', icon: CalendarCheck,
    gradient: 'linear-gradient(135deg,#F43F5E,#FB7185)',
    glow: 'rgba(244,63,94,0.35)',
    border: 'rgba(244,63,94,0.2)',
    bg: 'rgba(244,63,94,0.06)',
    accent: '#F43F5E',
    span: '',
  },
];

export const Services = () => {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-28 relative overflow-hidden" style={{ background: '#07090F' }}>

      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-100" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="animate-orb1 absolute -top-20 right-[-5%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-15"
          style={{ background: 'radial-gradient(circle,#F59E0B,transparent 70%)' }} />
        <div className="animate-orb2 absolute bottom-0 left-[-5%] w-[400px] h-[400px] rounded-full blur-[110px] opacity-12"
          style={{ background: 'radial-gradient(circle,#0EA5E9,transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: '#F59E0B' }}>What We Offer</p>
          <h2 className="font-display font-extrabold text-white uppercase tracking-tight leading-none" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)' }}>
            {t('services', 'title')}
          </h2>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px w-14 rounded-full" style={{ background: '#F59E0B' }} />
            <div className="h-px flex-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className={`group relative rounded-[1.75rem] p-8 overflow-hidden cursor-pointer card-hover ${s.span}`}
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-8 right-8 h-px"
                  style={{ background: `linear-gradient(90deg,transparent,${s.accent},transparent)` }} />

                {/* Hover radial fill */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.75rem]"
                  style={{ background: `radial-gradient(circle at 50% 0%,${s.accent}12 0%,transparent 65%)` }} />

                {/* Shine sweep on hover */}
                <div className="absolute top-0 h-full w-[40%] skew-x-[-20deg] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                  style={{ background: `linear-gradient(90deg,transparent,${s.accent}18,transparent)`, animation: 'shine-sweep 1.2s ease forwards' }} />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${s.accent}15`, border: `1px solid ${s.accent}28`, boxShadow: `0 0 20px ${s.accent}20` }}
                >
                  <Icon size={26} style={{ color: s.accent, filter: `drop-shadow(0 0 6px ${s.accent}90)` }} />
                </div>

                {/* Text */}
                <h3 className="font-display font-bold text-[1.35rem] text-white mb-3 relative z-10">
                  {t('services', s.id)}
                </h3>
                <p className="text-sm leading-relaxed mb-8 relative z-10 transition-colors duration-300"
                  style={{ color: '#64748B', lineHeight: '1.7' }}>
                  {t('services', `${s.id}d`)}
                </p>

                {/* CTA */}
                <button
                  onClick={() => document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' })}
                  className="cursor-pointer relative z-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all group-hover:gap-3"
                  style={{ color: s.accent }}
                >
                  {t('services', 'getQuote')}
                  <ArrowRight size={13} />
                </button>

                {/* BG number */}
                <div className="absolute bottom-5 right-7 font-mono font-black text-7xl select-none pointer-events-none opacity-[0.04]" style={{ color: s.accent }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 relative rounded-[2rem] overflow-hidden p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: 'linear-gradient(135deg,rgba(245,158,11,0.07) 0%,rgba(14,165,233,0.05) 50%,rgba(16,185,129,0.06) 100%)',
            border: '1px solid rgba(245,158,11,0.14)',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.6),rgba(14,165,233,0.4),rgba(16,185,129,0.4),transparent)' }} />

          <div className="text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] mb-2" style={{ color: '#F59E0B' }}>Ready to switch?</p>
            <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white">{t('services', 'banner')}</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <a href="tel:+918237655610"
              className="cursor-pointer flex items-center gap-2 px-6 py-3.5 rounded-xl glass text-white font-bold text-sm border hover:opacity-80 transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.10)' }}>
              <Phone size={15} style={{ color: '#F59E0B' }} />
              {t('services', 'callNow')}
            </a>
            <a href="https://wa.me/918237655610" target="_blank" rel="noreferrer"
              className="cursor-pointer flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#10B981,#34D399)', boxShadow: '0 0 24px rgba(16,185,129,0.30)' }}>
              <MessageCircle size={15} />
              {t('services', 'whatsappUs')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
