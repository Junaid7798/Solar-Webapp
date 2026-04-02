import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileDown, Send, Calculator, Loader2 } from 'lucide-react';
import { generateQuotationPDF } from '../../utils/generateQuotationPDF';
import { config } from '../../../config';

const BUSINESS_NAME = config.businessName;
const BUSINESS_PHONE = config.businessPhone;

interface QuotationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leadData?: any;
  onSave?: (quotation: any) => void;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
  systemSize?: string;
  baseCost?: string;
}

export const QuotationDrawer = ({ isOpen, onClose, leadData, onSave }: QuotationDrawerProps) => {
  const defaultFormState = {
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
    validDays: 30,
  };

  const [formData, setFormData] = useState(defaultFormState);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const finalCost = formData.baseCost - formData.centralSubsidy - formData.stateSubsidy;
  const monthlySavings = Math.round(formData.systemSize * 4.5 * 30 * 8);
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? Number((finalCost / annualSavings).toFixed(1)) : 0;

  useEffect(() => {
    if (leadData) {
      setFormData((prev) => ({
        ...prev,
        customerName: leadData.name || leadData.Name || leadData[1] || '',
        customerPhone: leadData.phone || leadData.Phone || leadData[2] || '',
        customerEmail: leadData.email || leadData.Email || leadData[3] || '',
        customerCity: leadData.city || leadData.City || leadData[4] || '',
        customerAddress: leadData.address || leadData.Address || leadData[5] || '',
        systemSize: leadData.system_size ? parseFloat(leadData.system_size) : 3,
      }));
      setErrors({});
    }
  }, [leadData]);

  // Reset form when drawer opens fresh without lead data
  useEffect(() => {
    if (isOpen && !leadData) {
      setErrors({});
      setFormData(defaultFormState);
    }
  }, [isOpen, leadData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Enter a valid 10-digit phone number';
    }
    if (formData.systemSize < 1) newErrors.systemSize = 'Minimum system size is 1 kW';
    if (formData.baseCost <= 0) newErrors.baseCost = 'Cost must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildQuotationData = () => ({
    ...formData,
    id: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toLocaleDateString('en-IN'),
    panelCount: Math.ceil((formData.systemSize * 1000) / 375),
    finalCost,
    monthlySavings,
    annualSavings,
    paybackYears,
  });

  const persistQuotation = (data: ReturnType<typeof buildQuotationData>) => {
    if (onSave) {
      onSave({
        id: data.id,
        customer: data.customerName,
        city: data.customerCity,
        size: `${data.systemSize}kW`,
        date: data.date,
        status: 'Sent',
        total: `₹${data.finalCost.toLocaleString()}`,
      });
    }
  };

  const sanitizePhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 ? `91${digits.slice(-10)}` : BUSINESS_PHONE;
  };

  const handleGeneratePDF = async (action: 'download' | 'share') => {
    if (!validate()) return;
    setIsGenerating(true);
    try {
      const data = buildQuotationData();
      const doc = await generateQuotationPDF(data);
      persistQuotation(data);

      if (action === 'download') {
        doc.save(`Solar_Quote_${data.customerName.replace(/\s+/g, '_')}.pdf`);
      } else {
        const pdfBlob = doc.output('blob');
        const file = new File([pdfBlob], 'Solar_Quotation.pdf', { type: 'application/pdf' });
        const message = `Namaste ${data.customerName} ji, please find your solar quotation from ${BUSINESS_NAME} attached. System: ${data.systemSize}kW. Final Cost: Rs. ${data.finalCost.toLocaleString()}.`;

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'Solar Quotation', text: message });
          } catch {
            doc.save(`Solar_Quote_${data.customerName.replace(/\s+/g, '_')}.pdf`);
            window.open(`https://wa.me/${sanitizePhone(data.customerPhone)}?text=${encodeURIComponent(message)}`);
          }
        } else {
          doc.save(`Solar_Quote_${data.customerName.replace(/\s+/g, '_')}.pdf`);
          window.open(`https://wa.me/${sanitizePhone(data.customerPhone)}?text=${encodeURIComponent(message)}`);
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const inputClass = (error?: string) =>
    `admin-input w-full px-4 py-2.5 rounded-xl ${error ? 'border-red-500/60' : ''}`;

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
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-surface shadow-2xl z-[301] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-depth text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center text-depth">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold">Create Quotation</h2>
                  <p className="text-xs text-white/40">Configure system and pricing details</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors" aria-label="Close">
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Section 1: Customer */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-dim text-amber flex items-center justify-center text-[10px]">01</span>
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Full Name *</label>
                    <input name="customerName" value={formData.customerName} onChange={handleInputChange} className={inputClass(errors.customerName)} />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Phone *</label>
                    <input name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} placeholder="10-digit number" className={inputClass(errors.customerPhone)} />
                    {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">City</label>
                    <input name="customerCity" value={formData.customerCity} onChange={handleInputChange} className={inputClass()} />
                  </div>
                </div>
              </section>

              {/* Section 2: System */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-dim text-amber flex items-center justify-center text-[10px]">02</span>
                  System Specification
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">System Size (kW) *</label>
                    <input type="number" min="1" name="systemSize" value={formData.systemSize} onChange={handleInputChange} className={inputClass(errors.systemSize)} />
                    {errors.systemSize && <p className="text-red-500 text-xs mt-1">{errors.systemSize}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Inverter Brand</label>
                    <input name="inverterBrand" value={formData.inverterBrand} onChange={handleInputChange} className={inputClass()} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Panel Brand & Model</label>
                    <input name="panelBrand" value={formData.panelBrand} onChange={handleInputChange} className={inputClass()} />
                  </div>
                </div>
              </section>

              {/* Section 3: Pricing */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-dim text-amber flex items-center justify-center text-[10px]">03</span>
                  Pricing & Subsidies
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Base Cost (₹) *</label>
                    <input type="number" min="1" name="baseCost" value={formData.baseCost} onChange={handleInputChange} className={inputClass(errors.baseCost)} />
                    {errors.baseCost && <p className="text-red-500 text-xs mt-1">{errors.baseCost}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/40 mb-1 uppercase">Central Subsidy (₹)</label>
                    <input type="number" min="0" name="centralSubsidy" value={formData.centralSubsidy} onChange={handleInputChange} className={inputClass()} />
                  </div>
                  <div className="col-span-2 bg-emerald-dim p-4 rounded-2xl border border-emerald/20 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald uppercase tracking-wider">Final Customer Cost</p>
                      <p className="text-2xl font-display font-bold text-emerald-light">₹{finalCost.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald uppercase tracking-wider">Payback Period</p>
                      <p className="text-xl font-display font-bold text-emerald-light">{paybackYears} Years</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Warranty */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-dim text-amber flex items-center justify-center text-[10px]">04</span>
                  Warranty & Terms
                </h3>
                <div className="space-y-3">
                  <input name="warrantyPanels" value={formData.warrantyPanels} onChange={handleInputChange} placeholder="Panel Warranty" className={`${inputClass()} text-sm`} />
                  <input name="warrantyInverter" value={formData.warrantyInverter} onChange={handleInputChange} placeholder="Inverter Warranty" className={`${inputClass()} text-sm`} />
                  <input name="warrantyInstallation" value={formData.warrantyInstallation} onChange={handleInputChange} placeholder="Installation Warranty" className={`${inputClass()} text-sm`} />
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-depth flex gap-3">
              <button
                onClick={() => handleGeneratePDF('download')}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 bg-sky-dim text-sky px-4 py-3 rounded-xl font-bold hover:bg-sky/20 transition-colors disabled:opacity-60"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={20} />}
                {isGenerating ? 'Generating…' : 'Download PDF'}
              </button>
              <button
                onClick={() => handleGeneratePDF('share')}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 bg-amber text-depth px-4 py-3 rounded-xl font-bold hover:bg-amber-light transition-colors shadow-lg disabled:opacity-60"
              >
                {isGenerating ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                {isGenerating ? 'Generating…' : 'Send WhatsApp'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
