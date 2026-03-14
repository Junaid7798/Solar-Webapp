import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, FileDown, Send, Calculator, ShieldCheck, Zap } from 'lucide-react';
import { generateQuotationPDF } from '../../utils/generateQuotationPDF';

interface QuotationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: any;
}

export const QuotationDrawer = ({ isOpen, onClose, leadData }: QuotationDrawerProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerCity: '',
    customerAddress: '',
    systemSize: 3,
    panelBrand: 'Luminous 375W Mono PERC',
    inverterBrand: 'Luminous NXT+ 3kW',
    batteryIncluded: false,
    batterySpecs: '',
    baseCost: 180000,
    centralSubsidy: 78000,
    stateSubsidy: 10000,
    warrantyPanels: '25 Year Performance Warranty',
    warrantyInverter: '5 Year Manufacturer Warranty',
    warrantyInstallation: '2 Year Workmanship Warranty',
    validDays: 30
  });

  // Auto-calculate costs and savings
  const finalCost = formData.baseCost - formData.centralSubsidy - formData.stateSubsidy;
  const monthlySavings = Math.round(formData.systemSize * 4.5 * 30 * 8); // Approx logic
  const annualSavings = monthlySavings * 12;
  const paybackYears = Number((finalCost / annualSavings).toFixed(1));

  useEffect(() => {
    if (leadData) {
      setFormData(prev => ({
        ...prev,
        customerName: leadData.name || '',
        customerPhone: leadData.phone || '',
        customerEmail: leadData.email || '',
        customerCity: leadData.city || '',
        customerAddress: leadData.address || '',
        systemSize: leadData.system_size ? parseFloat(leadData.system_size) : 3
      }));
    }
  }, [leadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleGeneratePDF = async (action: 'download' | 'share') => {
    const data = {
      ...formData,
      id: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      panelCount: Math.ceil((formData.systemSize * 1000) / 375),
      finalCost,
      monthlySavings,
      annualSavings,
      paybackYears
    };

    const doc = await generateQuotationPDF(data);
    
    if (action === 'download') {
      doc.save(`Solar_Quote_${data.customerName.replace(/\s+/g, '_')}.pdf`);
    } else {
      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], 'Solar_Quotation.pdf', { type: 'application/pdf' });
      
      const message = `Namaste ${data.customerName} ji, please find your solar quotation from SolarEdge Pro attached. Total System: ${data.systemSize}kW. Final Cost: Rs. ${data.finalCost.toLocaleString()}.`;
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Solar Quotation',
            text: message
          });
        } catch (err) {
          console.error('Share failed', err);
          window.open(`https://wa.me/91${data.customerPhone}?text=${encodeURIComponent(message)}`);
        }
      } else {
        doc.save(`Solar_Quote_${data.customerName.replace(/\s+/g, '_')}.pdf`);
        window.open(`https://wa.me/91${data.customerPhone}?text=${encodeURIComponent(message)}`);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-sky-deep/40 backdrop-blur-sm z-[300]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[301] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-sky/5 flex justify-between items-center bg-sky-deep text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sun flex items-center justify-center text-sky-deep">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Create Quotation</h2>
                  <p className="text-xs text-gray-400">Configure system and pricing details</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Section 1: Customer */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky/10 text-sky-deep flex items-center justify-center text-[10px]">01</span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name</label>
                    <input name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone</label>
                    <input name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">City</label>
                    <input name="customerCity" value={formData.customerCity} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                </div>
              </section>

              {/* Section 2: System */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky/10 text-sky-deep flex items-center justify-center text-[10px]">02</span>
                  System Specification
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">System Size (kW)</label>
                    <input type="number" name="systemSize" value={formData.systemSize} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Inverter Brand</label>
                    <input name="inverterBrand" value={formData.inverterBrand} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Panel Brand & Model</label>
                    <input name="panelBrand" value={formData.panelBrand} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                </div>
              </section>

              {/* Section 3: Pricing */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky/10 text-sky-deep flex items-center justify-center text-[10px]">03</span>
                  Pricing & Subsidies
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Base Cost (₹)</label>
                    <input type="number" name="baseCost" value={formData.baseCost} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Central Subsidy (₹)</label>
                    <input type="number" name="centralSubsidy" value={formData.centralSubsidy} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun" />
                  </div>
                  <div className="col-span-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Final Customer Cost</p>
                      <p className="text-2xl font-display font-bold text-emerald-700">₹{finalCost.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Payback Period</p>
                      <p className="text-xl font-display font-bold text-emerald-700">{paybackYears} Years</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Warranty */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky/10 text-sky-deep flex items-center justify-center text-[10px]">04</span>
                  Warranty & Terms
                </h3>
                <div className="space-y-3">
                  <input name="warrantyPanels" value={formData.warrantyPanels} onChange={handleInputChange} placeholder="Panel Warranty" className="w-full px-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun text-sm" />
                  <input name="warrantyInverter" value={formData.warrantyInverter} onChange={handleInputChange} placeholder="Inverter Warranty" className="w-full px-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun text-sm" />
                  <input name="warrantyInstallation" value={formData.warrantyInstallation} onChange={handleInputChange} placeholder="Installation Warranty" className="w-full px-4 py-2 bg-light-bg border border-sky/10 rounded-xl focus:outline-none focus:border-sun text-sm" />
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-sky/5 bg-light-bg flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-sky/10 px-4 py-3 rounded-xl text-sky-deep font-bold hover:bg-sky/5 transition-colors">
                <Save size={20} />
                Save Draft
              </button>
              <button 
                onClick={() => handleGeneratePDF('download')}
                className="flex-1 flex items-center justify-center gap-2 bg-sky-deep text-white px-4 py-3 rounded-xl font-bold hover:bg-sky transition-colors"
              >
                <FileDown size={20} />
                Download
              </button>
              <button 
                onClick={() => handleGeneratePDF('share')}
                className="flex-1 flex items-center justify-center gap-2 bg-sun text-sky-deep px-4 py-3 rounded-xl font-bold hover:bg-sun-light transition-colors shadow-lg"
              >
                <Send size={20} />
                Send WhatsApp
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
