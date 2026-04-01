import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Menu, X, Phone, Mail, MessageCircle, Sun, Zap } from 'lucide-react';
import { BUSINESS_EMAIL, BUSINESS_PHONE, WHATSAPP_URL } from '../../lib/constants';

export const Navbar = () => {
  const { t, language, setLanguage } = useTranslation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const currentScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const scrolled = documentHeight > 0 ? (currentScroll / documentHeight) * 100 : 0;
          setScrollProgress(scrolled);

          setIsScrolled(window.scrollY > 60);

          const ids = ['home', 'about', 'services', 'gallery', 'calculator', 'get-quote'];
          for (const id of [...ids].reverse()) {
            const element = document.getElementById(id);
            if (element && window.scrollY >= element.offsetTop - 130) {
              setActiveSection(id);
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav', 'home') },
    { id: 'about', label: t('nav', 'about') },
    { id: 'services', label: t('nav', 'services') },
    { id: 'gallery', label: 'Gallery' },
    { id: 'calculator', label: t('nav', 'calculator') },
  ];

  const go = (id: string) => {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{ paddingTop: isScrolled ? '10px' : '18px', transition: 'padding 0.4s ease' }}
      >
        <div
          className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-sun via-amber-light to-sun-light z-50 transition-all duration-150"
          style={{ width: `${scrollProgress}%`, boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}
        />

        <div
          className="flex items-center gap-6 px-5 py-3 rounded-2xl transition-all duration-500 pointer-events-auto"
          style={{
            background: isScrolled ? 'rgba(7,9,15,0.98)' : 'rgba(7,9,15,0.35)',
            backdropFilter: 'blur(28px)',
            border: isScrolled ? '1px solid rgba(245,158,11,0.18)' : '1px solid rgba(255,255,255,0.06)',
            boxShadow: isScrolled ? '0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.1) inset' : 'none',
            maxWidth: '1120px',
            width: 'calc(100vw - 40px)',
          }}
        >
          <button onClick={() => go('home')} className="cursor-pointer flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}
            >
              <Sun size={17} style={{ color: '#07090F' }} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-extrabold text-[17px] text-white tracking-tighter">
                SOLAR<span style={{ color: '#F59E0B' }}>EDGE</span>
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.35em]" style={{ color: '#64748B' }}>
                Maharashtra · Pro
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className="cursor-pointer relative px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200"
                  style={{ color: isActive ? '#F59E0B' : '#64748B' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.18)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div
              className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {(['en', 'hi', 'mr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="cursor-pointer px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200"
                  style={{
                    background: language === lang ? '#F59E0B' : 'transparent',
                    color: language === lang ? '#07090F' : '#64748B',
                  }}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'म'}
                </button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => go('get-quote')}
              className="cursor-pointer hidden lg:flex px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #FCD34D)',
                color: '#07090F',
                boxShadow: '0 0 20px rgba(245,158,11,0.25)',
              }}
            >
              <Zap size={13} />
              {t('nav', 'getQuote')}
            </motion.button>

            <button
              onClick={() => setMobileMenu(true)}
              className="cursor-pointer lg:hidden p-2 rounded-xl text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[100] flex flex-col"
            style={{ background: 'rgba(7,9,15,0.97)', backdropFilter: 'blur(28px)' }}
          >
            <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)' }}>
                  <Sun size={17} style={{ color: '#07090F' }} strokeWidth={2.5} />
                </div>
                <span className="font-display font-extrabold text-xl text-white">
                  SOLAR<span style={{ color: '#F59E0B' }}>EDGE</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenu(false)}
                className="cursor-pointer p-2.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#64748B' }}
                aria-label="Close menu"
              >
                <X size={21} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {[...navLinks, { id: 'get-quote', label: t('nav', 'getQuote') }].map((link, index) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 + index * 0.07 }}
                  onClick={() => go(link.id)}
                  className="cursor-pointer text-left font-display font-extrabold text-4xl uppercase tracking-tight py-2 border-b transition-colors"
                  style={{
                    borderColor: 'rgba(255,255,255,0.04)',
                    color: link.id === 'get-quote' ? '#F59E0B' : 'rgba(255,255,255,0.75)',
                  }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 border-t flex items-center justify-between"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex gap-3">
                {[
                  { href: WHATSAPP_URL, icon: MessageCircle, label: 'WhatsApp' },
                  { href: `tel:+${BUSINESS_PHONE}`, icon: Phone, label: 'Call' },
                  { href: `mailto:${BUSINESS_EMAIL}`, icon: Mail, label: 'Email' },
                ].map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="cursor-pointer w-11 h-11 rounded-full flex items-center justify-center transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }}
                    aria-label={label}
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {(['en', 'hi', 'mr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className="cursor-pointer px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                    style={{ background: language === lang ? '#F59E0B' : 'transparent', color: language === lang ? '#07090F' : '#64748B' }}
                  >
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'म'}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
