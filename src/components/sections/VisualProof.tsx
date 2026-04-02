import React, { useState } from 'react';
import { motion } from 'motion/react';

import { Camera, History, Star, ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const VisualProof = () => {
  const [activeTab, setActiveTab] = useState('all');

  const galleryImages = [
    { id: 1, url: '/images/house-rooftop.jpg', category: 'Residential', title: 'Nashik Villa' },
    { id: 2, url: '/images/engineers-inspecting.webp', category: 'Commercial', title: 'Pune Factory' },
    { id: 3, url: '/images/happy-customer.jpeg', category: 'Testimonial', title: 'Happy Client' },
    { id: 4, url: '/images/livguard-battery.jpeg', category: 'Residential', title: 'Mumbai Apartment' },
    { id: 5, url: '/images/engineer-farmer.jpg', category: 'Testimonial', title: 'Satisfied Customer' },
    { id: 6, url: '/images/panel-cleaning.png', category: 'Commercial', title: 'Warehouse Solar' },
  ];

  const tabs = ['all', 'Residential', 'Commercial', 'Testimonial'];

  return (
    <section id="gallery" className="py-24 bg-sky-deep relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sun/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 uppercase tracking-tighter">
            Visual <span className="text-sun text-shadow-glow">Proof</span>
          </h2>
          <p className="text-silver/60 text-lg font-light">
            Real-world transformations delivered across Maharashtra. See the impact of clean energy.
          </p>
          <div className="w-24 h-1 bg-sun mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(255,179,71,0.5)]" />
        </motion.div>

        {/* Before & After Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 glass rounded-2xl text-sun">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Featured Installation</h3>
                <p className="text-xs text-silver/40 uppercase tracking-widest font-bold">Premium Solar Solutions</p>
              </div>
            </div>
            <div className="relative glass p-2 rounded-[2.5rem] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-sun/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              <img 
                src="/images/worker-installing.webp" 
                alt="Solar Installation"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover rounded-[2rem] aspect-video transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sun/10 border border-sun/20 text-sun text-[10px] font-bold uppercase tracking-widest">
                Impact Analysis
              </div>
              <h4 className="text-4xl md:text-5xl font-display font-bold text-white leading-none uppercase tracking-tighter">
                From Wasted Space to <br />
                <span className="text-sun text-shadow-glow">Energy Independence</span>
              </h4>
              <p className="text-silver/60 leading-relaxed font-light text-lg">
                We specialize in maximizing your rooftop potential. Our installations are engineered for durability, aesthetics, and peak performance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-8 glass rounded-[2rem] border-white/5 group hover:border-sun/20 transition-colors">
                <p className="text-4xl font-display font-bold text-sun mb-1">500+</p>
                <p className="text-[10px] font-bold text-silver/40 uppercase tracking-widest">Projects Done</p>
              </div>
              <div className="p-8 glass rounded-[2rem] border-white/5 group hover:border-teal/20 transition-colors">
                <p className="text-4xl font-display font-bold text-teal mb-1">15MW+</p>
                <p className="text-[10px] font-bold text-silver/40 uppercase tracking-widest">Total Capacity</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 glass rounded-2xl text-sun">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Project Gallery</h3>
                <p className="text-xs text-silver/40 uppercase tracking-widest font-bold">Browse our latest installations</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                    activeTab === tab 
                      ? 'bg-sun text-sky-deep border-sun shadow-[0_0_20px_rgba(255,179,71,0.3)]' 
                      : 'bg-white/5 text-silver/60 border-white/10 hover:border-sun/50 hover:text-sun'
                  }`}
                >
                  {tab === 'all' ? 'All Work' : tab}
                </button>
              ))}
            </div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {galleryImages.filter(img => activeTab === 'all' || img.category === activeTab).map((img) => (
              <motion.div 
                key={img.id} 
                variants={itemAnim}
                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass border-white/5"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <span className="text-sun text-[10px] font-bold uppercase tracking-widest mb-2 block">{img.category}</span>
                    <h4 className="text-white text-2xl font-display font-bold leading-tight">{img.title}</h4>
                    
                    {img.category === 'Testimonial' && (
                      <div className="mt-4 flex gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-sun fill-sun" />)}
                      </div>
                    )}
                  </motion.div>
                </div>

                {img.category === 'Testimonial' && (
                  <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full border border-sun/20 flex items-center gap-2 z-20">
                    <div className="w-2 h-2 rounded-full bg-sun animate-pulse" />
                    <span className="text-[10px] font-bold text-sun uppercase tracking-widest">Verified Testimonial</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
