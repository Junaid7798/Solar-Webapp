import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Facebook, Instagram, Youtube, Linkedin, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gunmetal text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-deep/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-sun flex items-center justify-center">
                <span className="text-sky-deep font-bold text-2xl">S</span>
              </div>
              <span className="font-display font-bold text-3xl tracking-wide">
                SolarEdge <span className="text-sun">Pro</span>
              </span>
            </div>
            <p className="text-gray text-lg mb-4 max-w-sm leading-relaxed">
              {t('footer', 'tagline')}
            </p>
            <p className="font-mono text-sm text-silver/60 uppercase tracking-widest mb-8">
              {t('footer', 'est')}
            </p>
            
            <div className="flex gap-4">
              <SocialIcon icon={Facebook} hoverColor="hover:text-blue-500 hover:border-blue-500" label="Facebook" />
              <SocialIcon icon={Instagram} hoverColor="hover:text-pink-500 hover:border-pink-500" label="Instagram" />
              <SocialIcon icon={Youtube} hoverColor="hover:text-red-500 hover:border-red-500" label="YouTube" />
              <SocialIcon icon={Linkedin} hoverColor="hover:text-blue-400 hover:border-blue-400" label="LinkedIn" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-xl mb-6 uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-4">
              {['home', 'services', 'calculator', 'getQuote', 'about', 'contact'].map(link => (
                <li key={link}>
                  <button 
                    onClick={() => document.getElementById(link === 'getQuote' ? 'get-quote' : link)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray hover:text-sun transition-colors uppercase tracking-wider text-sm font-bold"
                  >
                    {t('nav', link)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-xl mb-6 uppercase tracking-wider text-white">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray">
                <Phone size={20} className="text-sun shrink-0 mt-1" />
                <div>
                  <a href="tel:+918237655610" className="hover:text-white transition-colors block mb-1">+91 82376 55610</a>
                  <span className="text-xs uppercase tracking-widest opacity-60">Mon-Sat, 9am-7pm</span>
                </div>
              </li>
              <li className="flex items-start gap-4 text-gray">
                <Mail size={20} className="text-sun shrink-0 mt-1" />
                <a href="mailto:Junaidk5610@gmail.com" className="hover:text-white transition-colors">Junaidk5610@gmail.com</a>
              </li>
              <li className="flex items-start gap-4 text-gray">
                <MapPin size={20} className="text-sun shrink-0 mt-1" />
                <span>{t('footer', 'serving')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 w-full mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-gray text-sm font-bold uppercase tracking-wider">
            {t('footer', 'rights')}
          </p>
          <p className="text-gray text-sm font-bold uppercase tracking-wider">
            {t('footer', 'made')}
          </p>
        </div>

        {/* Developer Credit */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray/60 font-mono uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="text-sun">🛠️</span> Website by Junaid Khan
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="tel:+918237655610" className="hover:text-white transition-colors">📞 8237655610</a>
            <a href="mailto:Junaidk5610@gmail.com" className="hover:text-white transition-colors">✉️ Junaidk5610@gmail.com</a>
            <a href="https://wa.me/918237655610" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">💬 WhatsApp</a>
            <a href="https://linkedin.com/in/junaid-khan-b96b2a246" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">in LinkedIn</a>
            <a href="https://automation-website-testimonial.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">🌐 Portfolio</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

const SocialIcon = ({ icon: Icon, hoverColor, label }: { icon: any, hoverColor: string, label: string }) => (
  <a 
    href="#" 
    aria-label={label}
    className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-silver transition-all duration-300 hover:scale-110 ${hoverColor} bg-white/5`}
  >
    <Icon size={20} />
  </a>
);
