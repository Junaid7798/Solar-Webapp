import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin, Sun, ArrowRight, Zap } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden" style={{ background: '#07090F' }}>

      {/* ── Pre-footer Glow CTA ── */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-25 pointer-events-none" />

        {/* Ambient orbs */}
        <div className="absolute left-[-15%] top-[-40%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-18 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#F59E0B,transparent 70%)' }} />
        <div className="absolute right-[-10%] bottom-[-40%] w-[400px] h-[400px] rounded-full blur-[110px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle,#0EA5E9,transparent 70%)' }} />

        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.5),rgba(14,165,233,0.3),rgba(16,185,129,0.3),transparent)' }} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.06)', color: '#F59E0B' }}>
              Start Your Solar Journey
            </div>

            <h2 className="font-display font-extrabold text-white leading-tight mb-4 tracking-tight"
              style={{ fontSize: 'clamp(2.4rem,5vw,4rem)' }}>
              Power Your Home.<br />
              <span className="text-gradient-amber">Save More. Live Better.</span>
            </h2>

            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#64748B' }}>
              Join 500+ Maharashtra families already saving with clean solar energy.
              Get your free consultation today — no commitment needed.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' })}
                className="cursor-pointer group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2.5"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#FCD34D)', color: '#07090F', boxShadow: '0 0 32px rgba(245,158,11,0.30)' }}
              >
                <span className="absolute top-0 h-full w-[40%] skew-x-[-20deg] bg-white/25 pointer-events-none"
                  style={{ animation: 'shine-sweep 2.5s ease-in-out infinite', left: '-150%' }} />
                <span className="relative z-10">Get Free Quote</span>
                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <a href="https://wa.me/918237655610" target="_blank" rel="noreferrer"
                className="cursor-pointer px-8 py-4 rounded-2xl font-bold text-white text-sm flex items-center gap-2.5 glass border hover:opacity-80 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
                <Phone size={15} style={{ color: '#10B981' }} />
                +91 82376 55610
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="border-t pt-20 pb-12 relative" style={{ borderColor: 'rgba(255,255,255,0.04)', background: 'rgba(7,9,15,0.98)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[160px] blur-[90px] opacity-8 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,#F59E0B,transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#FCD34D)' }}>
                  <Sun size={19} style={{ color: '#07090F' }} strokeWidth={2.5} />
                </div>
                <span className="font-display font-extrabold text-2xl text-white tracking-tighter">
                  SOLAR<span style={{ color: '#F59E0B' }}>EDGE</span>
                  <span className="font-normal text-base ml-1" style={{ color: '#64748B' }}>Pro</span>
                </span>
              </div>
              <p className="text-base leading-relaxed mb-5 max-w-sm" style={{ color: '#64748B' }}>
                {t('footer', 'tagline')}
              </p>
              <p className="font-mono text-xs mb-8 uppercase tracking-[0.25em]" style={{ color: '#1E2D4A' }}>
                {t('footer', 'est')}
              </p>
              <div className="flex gap-3">
                <SocialBtn icon={Facebook} label="Facebook"  hoverColor="#3B82F6" />
                <SocialBtn icon={Instagram} label="Instagram" hoverColor="#EC4899" />
                <SocialBtn icon={Youtube}   label="YouTube"   hoverColor="#EF4444" />
                <SocialBtn icon={Linkedin}  label="LinkedIn"  hoverColor="#60A5FA" />
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['home','services','calculator','getQuote','about','contact'].map(link => (
                  <li key={link}>
                    <button
                      onClick={() => document.getElementById(link === 'getQuote' ? 'get-quote' : link)?.scrollIntoView({ behavior: 'smooth' })}
                      className="cursor-pointer group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-colors duration-200 hover:text-white"
                      style={{ color: '#64748B' }}
                    >
                      <span className="w-0 group-hover:w-3 h-px rounded transition-all duration-200" style={{ background: '#F59E0B' }} />
                      {t('nav', link)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-white mb-6">Contact Us</h4>
              <ul className="space-y-5">
                {[
                  { icon: Phone,  href: 'tel:+918237655610',          label: '+91 82376 55610',        sub: 'Mon–Sat, 9am–7pm', color: '#F59E0B' },
                  { icon: Mail,   href: 'mailto:Junaidk5610@gmail.com', label: 'Junaidk5610@gmail.com', sub: '',                 color: '#0EA5E9' },
                ].map(({ icon: Icon, href, label, sub, color }, i) => (
                  <li key={i}>
                    <a href={href} className="cursor-pointer flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                        <Icon size={14} style={{ color }} />
                      </div>
                      <div>
                        <span className="text-sm block group-hover:text-white transition-colors" style={{ color: '#94A3B8' }}>{label}</span>
                        {sub && <span className="text-[10px] uppercase tracking-widest" style={{ color: '#1E2D4A' }}>{sub}</span>}
                      </div>
                    </a>
                  </li>
                ))}
                <li>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.20)' }}>
                      <MapPin size={14} style={{ color: '#10B981' }} />
                    </div>
                    <span className="text-sm" style={{ color: '#64748B' }}>{t('footer', 'serving')}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-8"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.2),rgba(14,165,233,0.15),rgba(16,185,129,0.12),transparent)' }} />

          {/* Bottom row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1E2D4A' }}>{t('footer', 'rights')}</p>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#1E2D4A' }}>{t('footer', 'made')}</p>
          </div>

          {/* Dev credit */}
          <div className="mt-10 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-mono uppercase tracking-widest"
            style={{ borderColor: 'rgba(255,255,255,0.03)', color: '#1E2D4A' }}>
            <div className="flex items-center gap-2">
              <Zap size={11} style={{ color: 'rgba(245,158,11,0.3)' }} />
              Website by Junaid Khan
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {[
                { href:'tel:+918237655610', label:'8237655610' },
                { href:'mailto:Junaidk5610@gmail.com', label:'Junaidk5610@gmail.com' },
                { href:'https://wa.me/918237655610', label:'WhatsApp' },
                { href:'https://linkedin.com/in/junaid-khan-b96b2a246', label:'LinkedIn' },
                { href:'https://automation-website-testimonial.vercel.app', label:'Portfolio' },
              ].map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="cursor-pointer hover:text-amber transition-colors duration-200"
                  onMouseEnter={e => (e.currentTarget.style.color = '#F59E0B')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialBtn = ({ icon: Icon, label, hoverColor }: { icon: any; label: string; hoverColor: string }) => (
  <a
    href="#"
    aria-label={label}
    className="cursor-pointer w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748B' }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.color = hoverColor;
      el.style.borderColor = `${hoverColor}35`;
      el.style.background = `${hoverColor}10`;
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLElement;
      el.style.color = '#64748B';
      el.style.borderColor = 'rgba(255,255,255,0.07)';
      el.style.background = 'rgba(255,255,255,0.04)';
    }}
  >
    <Icon size={17} />
  </a>
);
