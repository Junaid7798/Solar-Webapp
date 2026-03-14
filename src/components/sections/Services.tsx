import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Sun, Wrench, Zap, Battery, BarChart3, CalendarCheck, ArrowRight } from 'lucide-react';

export const Services = () => {
  const { t } = useTranslation();

  const services = [
    { id: 's1', icon: Sun, color: 'text-sun' },
    { id: 's2', icon: Wrench, color: 'text-silver' },
    { id: 's3', icon: Zap, color: 'text-teal' },
    { id: 's4', icon: Battery, color: 'text-sun-light' },
    { id: 's5', icon: BarChart3, color: 'text-blue-400' },
    { id: 's6', icon: CalendarCheck, color: 'text-gray' },
  ];

  return (
    <section id="services" className="py-24 bg-sky-deep relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sun/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white uppercase tracking-tight">
            {t('services', 'title')}
          </h2>
          <div className="w-24 h-1 bg-sun mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(255,179,71,0.5)]" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass rounded-[2rem] p-8 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-sun/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                  <Icon size={32} className={`${service.color} drop-shadow-[0_0_10px_currentColor]`} />
                </div>
                
                <h3 className="font-display font-bold text-2xl text-white mb-3 relative z-10">
                  {t('services', service.id)}
                </h3>
                
                <p className="text-gray leading-relaxed mb-6 relative z-10 min-h-[60px] opacity-80">
                  {t('services', `${service.id}d`)}
                </p>
                
                <button 
                  onClick={() => document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-sun font-bold uppercase tracking-widest text-xs flex items-center gap-2 group-hover:gap-3 transition-all relative z-10"
                >
                  {t('services', 'getQuote')}
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 bg-gradient-to-r from-sky-deep to-sky-mid border border-sun/20 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(255,179,71,0.1)]"
        >
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-2xl text-white mb-2">{t('services', 'banner')}</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a href="tel:+918237655610" className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-full transition-colors text-center whitespace-nowrap">
              {t('services', 'callNow')}
            </a>
            <a href="https://wa.me/918237655610" target="_blank" rel="noreferrer" className="bg-teal hover:bg-teal/90 text-sky-deep font-bold px-6 py-3 rounded-full transition-colors text-center whitespace-nowrap shadow-[0_0_20px_rgba(0,200,150,0.3)]">
              {t('services', 'whatsappUs')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
