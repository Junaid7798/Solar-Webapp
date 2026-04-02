import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, Search, Filter, Upload, Eye, Star, Camera, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BeforeAfterSlider } from '../../../components/ui/BeforeAfterSlider';
import { usePersistedData } from '../../hooks/usePersistedData';
import { useConfirm } from '../../hooks/useConfirm';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 200 } },
};

export const GalleryManager = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'before-after'>('grid');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { openConfirm, ConfirmDialogWrapper } = useConfirm();

  const [images, setImages] = usePersistedData('gallery_images', [
    { id: 1, url: '/images/house-rooftop.jpg', category: 'Residential', title: '3kW Nashik Project' },
    { id: 2, url: '/images/panels-arrangement.webp', category: 'Commercial', title: '10kW Pune Factory' },
    { id: 3, url: '/images/engineers-inspecting.webp', category: 'Maintenance', title: 'Panel Cleaning Service' },
    { id: 4, url: '/images/panels-sunset.webp', category: 'Residential', title: '5kW Rooftop Solar' },
  ]);

  const [beforeAfterProjects, setBeforeAfterProjects] = usePersistedData('gallery_before_after', [
    {
      id: 1,
      title: 'Residential Rooftop Transformation',
      location: 'Nashik, MH',
      before: '/images/house-rooftop.jpg',
      after: '/images/panels-arrangement.webp',
    }
  ]);

  const tabs = ['all', 'Residential', 'Commercial', 'Maintenance'];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const newImage = {
        id: Date.now(),
        url: reader.result as string,
        category: 'Residential',
        title: file.name.replace(/\.[^/.]+$/, ''),
      };
      setImages((prev: any) => [newImage, ...prev]);
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteImage = async (id: number) => {
    const confirmed = await openConfirm({
      title: 'Delete Image',
      message: 'Are you sure? This cannot be undone.',
    });
    if (confirmed) {
      setImages((prev: any) => prev.filter((img: any) => img.id !== id));
    }
  };

  return (
    <>
      <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Gallery Manager</h1>
          <p className="text-xs md:text-sm text-white/40">Visual proof of work and customer testimonies.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber text-depth px-4 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-amber/20 active:scale-95 disabled:opacity-60"
          >
            <Upload size={18} />
            <span className="text-sm">{uploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex p-1 admin-card w-fit">
        <button
          onClick={() => setViewMode('grid')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'grid' ? 'bg-amber text-depth shadow-md' : 'text-white/40 hover:text-white'
          }`}
        >
          <Camera size={14} />
          Photo Grid
        </button>
        <button
          onClick={() => setViewMode('before-after')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            viewMode === 'before-after' ? 'bg-amber text-depth shadow-md' : 'text-white/40 hover:text-white'
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
                    ? 'bg-amber text-depth border-amber shadow-lg shadow-amber/10'
                    : 'bg-card text-white/40 border-white/5 hover:border-white/20 hover:text-white'
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
                className="admin-card overflow-hidden group relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={img.url} 
                    alt={img.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex gap-2 w-full">
                      <button className="flex-1 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold hover:bg-white/40 transition-colors">
                        View
                      </button>
                      <button onClick={() => handleDeleteImage(img.id)} className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-200 hover:bg-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">{img.category}</span>
                      <h3 className="font-bold text-white text-sm mt-0.5">{img.title}</h3>
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
                  <h3 className="font-bold text-white text-lg">{project.title}</h3>
                  <p className="text-xs text-white/40">{project.location}</p>
                </div>
                <button className="text-xs font-bold text-amber hover:text-amber-light transition-colors">Edit Comparison</button>
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
            className="aspect-video rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 text-white/30 hover:border-amber/50 hover:text-amber transition-all"
          >
            <div className="p-4 bg-sky/5 rounded-full">
              <Plus size={32} />
            </div>
            <span className="font-bold text-sm">Create New Comparison</span>
          </motion.button>
        </motion.div>
      )}
      </div>
    </>
  );
};
