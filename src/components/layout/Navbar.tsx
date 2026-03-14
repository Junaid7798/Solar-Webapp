import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Menu, X, Phone, Mail, MessageCircle, Zap } from 'lucide-react';

export const Navbar = () => {
  const { t, language, setLanguage } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav', 'home') },
    { id: 'about', label: t('nav', 'about') },
    { id: 'services', label: t('nav', 'services') },
    { id: 'gallery', label: 'Gallery' },
    { id: 'calculator', label: t('nav', 'calculator') },
  ];

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className={`glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-500 ${
            isScrolled ? 'bg-sky-deep/80 border-white/10' : 'bg-transparent border-transparent'
          }`}>
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => scrollToSection('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-sun flex items-center justify-center shadow-[0_0_20px_rgba(255,179,71,0.3)] group-hover:scale-110 transition-transform">
                <Zap className="text-sky-deep" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl text-white tracking-tighter leading-none">
                  SOLAREDGE <span className="text-sun">PRO</span>
                </span>
                <span className="text-[8px] text-silver/40 font-bold uppercase tracking-[0.3em] leading-none mt-1">
                  Mission Control
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className="text-silver/60 hover:text-sun font-bold transition-colors text-[10px] uppercase tracking-widest relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sun transition-all group-hover:w-full" />
                  </button>
                ))}
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                {(['en', 'hi', 'mr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      language === lang ? 'bg-sun text-sky-deep shadow-lg' : 'text-silver/40 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'म'}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <button 
                onClick={() => scrollToSection('get-quote')}
                className="bg-sun hover:bg-sun-light text-sky-deep font-bold px-6 py-2.5 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,179,71,0.2)] text-[10px] uppercase tracking-widest"
              >
                {t('nav', 'getQuote')}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white p-2 glass rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100] bg-sky-deep/95 backdrop-blur-xl flex flex-col"
          >
            <div className="p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sun flex items-center justify-center">
                  <span className="text-sky-deep font-bold text-xl">S</span>
                </div>
                <span className="font-display font-bold text-2xl text-white">SolarEdge Pro</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/80 hover:text-white p-2 bg-white/10 rounded-full"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-6">
              {[...navLinks, { id: 'get-quote', label: t('nav', 'getQuote'), isGold: true }, { id: 'contact', label: t('nav', 'contact'), isGold: false }].map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-left font-display text-4xl font-bold uppercase tracking-wider ${
                    (link as any).isGold ? 'text-sun' : 'text-white hover:text-sun/80'
                  }`}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-8 border-t border-white/10 flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-sun hover:text-sky-deep transition-colors">
                    <MessageCircle size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-sun hover:text-sky-deep transition-colors">
                    <Phone size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-sun hover:text-sky-deep transition-colors">
                    <Mail size={20} />
                  </a>
                </div>
                
                {/* Mobile Language Switcher */}
                <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
                  {(['en', 'hi', 'mr'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all ${
                        language === lang ? 'bg-sun text-sky-deep' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'म'}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
