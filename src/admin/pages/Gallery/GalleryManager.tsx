import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Search, Filter, Upload, Eye, Star, Camera, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BeforeAfterSlider } from '../../../components/ui/BeforeAfterSlider';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { opacity: 1, scale: 1, y: 0 }
};

export const GalleryManager = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'before-after'>('grid');

  const images = [
    { id: 1, url: 'https://picsum.photos/seed/solar1/800/600', category: 'Residential', title: '3kW Nashik Project' },
    { id: 2, url: 'https://picsum.photos/seed/solar2/800/600', category: 'Commercial', title: '10kW Pune Factory' },
    { id: 3, url: 'https://picsum.photos/seed/solar3/800/600', category: 'Maintenance', title: 'Panel Cleaning Service' },
    { id: 4, url: 'https://picsum.photos/seed/customer1/800/600', category: 'Testimonials', title: 'Happy Customer - Mr. Patil' },
    { id: 5, url: 'https://picsum.photos/seed/customer2/800/600', category: 'Testimonials', title: 'Industrial Client - MSME' },
    { id: 6, url: 'https://picsum.photos/seed/solar4/800/600', category: 'Residential', title: '5kW Rooftop Solar' },
  ];

  const beforeAfterProjects = [
    {
      id: 1,
      title: 'Residential Rooftop Transformation',
      location: 'Nashik, MH',
      before: 'https://picsum.photos/seed/before1/800/600?grayscale',
      after: 'https://picsum.photos/seed/after1/800/600',
    },
    {
      id: 2,
      title: 'Commercial Shed Installation',
      location: 'Pune, MH',
      before: 'https://picsum.photos/seed/before2/800/600?grayscale',
      after: 'https://picsum.photos/seed/after2/800/600',
    }
  ];

  const tabs = ['all', 'Residential', 'Commercial', 'Testimonials', 'Maintenance'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-sky-deep mb-1">Gallery Manager</h1>
          <p className="text-xs md:text-sm text-gray-500">Visual proof of work and customer testimonies.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-sun text-sky-deep px-4 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-sun/20 active:scale-95">
            <Upload size={18} />
            <span className="text-sm">Upload</span>
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex p-1 bg-white rounded-xl border border-sky/5 w-fit shadow-sm">
        <button 
          onClick={() => setViewMode('grid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'grid' ? 'bg-sky-deep text-white shadow-md' : 'text-gray-400 hover:text-sky-deep'
          }`}
        >
          <Camera size={14} />
          Photo Grid
        </button>
        <button 
          onClick={() => setViewMode('before-after')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'before-after' ? 'bg-sky-deep text-white shadow-md' : 'text-gray-400 hover:text-sky-deep'
          }`}
        >
          <History size={14} />
          Before & After
        </button>
      </div>

      {viewMode === 'grid' ? (
        <>
          {/* Tabs */}
          <div className="flex overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 gap-2">
            {tabs.map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === tab 
                    ? 'bg-sky-deep text-white border-sky-deep shadow-lg shadow-sky-deep/10' 
                    : 'bg-white text-gray-400 border-sky/5 hover:border-sky/20'
                }`}
              >
                {tab === 'all' ? 'All Photos' : tab}
              </button>
            ))}
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {images.filter(img => activeTab === 'all' || img.category === activeTab).map((img) => (
              <motion.div 
                key={img.id} 
                variants={itemAnim}
                className="bg-white rounded-2xl overflow-hidden border border-sky/5 shadow-sm group relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <button className="flex-1 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold hover:bg-white/40 transition-colors">
                        View
                      </button>
                      <button className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-200 hover:bg-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {img.category === 'Testimonials' && (
                    <div className="absolute top-3 left-3 bg-sun text-sky-deep px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black">TESTIMONY</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{img.category}</span>
                      <h3 className="font-bold text-sky-deep text-sm mt-0.5">{img.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {beforeAfterProjects.map((project) => (
            <motion.div key={project.id} variants={itemAnim} className="space-y-4">
              <div className="flex justify-between items-end px-1">
                <div>
                  <h3 className="font-bold text-sky-deep text-lg">{project.title}</h3>
                  <p className="text-xs text-gray-400">{project.location}</p>
                </div>
                <button className="text-xs font-bold text-sun hover:underline">Edit Comparison</button>
              </div>
              <BeforeAfterSlider 
                before={project.before} 
                after={project.after} 
                labelBefore="Empty Roof" 
                labelAfter="Solar Powered" 
              />
            </motion.div>
          ))}
          
          {/* Add New Comparison Placeholder */}
          <motion.button 
            variants={itemAnim}
            className="aspect-video rounded-2xl border-2 border-dashed border-sky/10 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-sun hover:text-sun transition-all bg-white/50"
          >
            <div className="p-4 bg-sky/5 rounded-full">
              <Plus size={32} />
            </div>
            <span className="font-bold text-sm">Create New Comparison</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
