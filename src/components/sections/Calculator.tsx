import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Calculator as CalcIcon, Zap, Home, Building2, BarChart3, Leaf } from 'lucide-react';

// Solar estimation constants (Maharashtra, 2024)
const UNITS_PER_KW_PER_MONTH = 115;   // Average solar yield for Maharashtra
const SQFT_PER_KW = 90;               // Shadow-free roof area required per kW
const COST_PER_KW = 60_000;           // Approx installed cost per kW (₹)
const CO2_KG_PER_UNIT = 0.82;        // kg CO₂ offset per kWh (India grid factor)
const TREES_PER_TONNE_CO2 = 45;      // Equivalent trees per tonne CO₂ offset
const MIN_SYSTEM_KW = 1;             // Minimum viable system size
const COMMERCIAL_RATE = 11.5;        // MSEDCL LT-II average tariff (₹/unit)
const MIN_ROOF_FOR_MIN_SYSTEM = SQFT_PER_KW * MIN_SYSTEM_KW; // 90 sq ft

export const Calculator = () => {
  const { t } = useTranslation();

  const [type, setType] = useState<'residential' | 'commercial'>('residential');
  const [bill, setBill] = useState(3000);
  const [roof, setRoof] = useState(500);
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [isCalculated, setIsCalculated] = useState(false);
  const [roofWarning, setRoofWarning] = useState(false);
  
  const [results, setResults] = useState({
    systemSize: 0,
    monthlySavings: 0,
    panels: 0,
    roofNeeded: 0,
    baseCost: 0,
    subsidy: 0,
    finalCost: 0,
    annualSavings: 0,
    payback: 0,
    co2: 0,
    trees: 0
  });

  const calculateEstimate = () => {
    setRoofWarning(roof < MIN_ROOF_FOR_MIN_SYSTEM);
    setIsCalculated(false);

    setTimeout(() => {
      // MSEDCL Approximate Slab Rates (2024) — derive monthly units from bill
      let units = 0;
      if (type === 'residential') {
        if (bill <= 536)       units = bill / 5.36;
        else if (bill <= 2448) units = 100 + (bill - 536) / 9.56;
        else if (bill <= 5192) units = 300 + (bill - 2448) / 13.72;
        else                   units = 500 + (bill - 5192) / 15.57;
      } else {
        units = bill / COMMERCIAL_RATE;
      }

      let sysKw = units / UNITS_PER_KW_PER_MONTH;
      const maxKwByRoof = roof / SQFT_PER_KW;
      sysKw = Math.min(sysKw, maxKwByRoof);
      sysKw = Math.max(MIN_SYSTEM_KW, Math.round(sysKw * 10) / 10);

      const baseCost = sysKw * COST_PER_KW;
      let subsidy = 0;

      // PM Surya Ghar Muft Bijli Yojana subsidy rules
      if (type === 'residential') {
        if (sysKw <= 2)      subsidy = sysKw * 30_000;
        else if (sysKw <= 3) subsidy = 60_000 + (sysKw - 2) * 18_000;
        else                 subsidy = 78_000;
      }

      const finalCost = baseCost - subsidy;
      const monthlySavings = bill * 0.80; // ~80% of bill offset by solar
      const annualSavings = monthlySavings * 12;
      const payback = finalCost / annualSavings;

      const annualUnits = sysKw * UNITS_PER_KW_PER_MONTH * 12;
      const co2 = (annualUnits * CO2_KG_PER_UNIT) / 1000; // tonnes
      const trees = co2 * TREES_PER_TONNE_CO2;

      setResults({
        systemSize: sysKw,
        monthlySavings: Math.round(monthlySavings),
        panels: Math.ceil(sysKw * 2), // ~500W–540W panels
        roofNeeded: Math.ceil(sysKw * SQFT_PER_KW),
        baseCost: Math.round(baseCost),
        subsidy: Math.round(subsidy),
        finalCost: Math.round(finalCost),
        annualSavings: Math.round(annualSavings),
        payback: Math.round(payback * 10) / 10,
        co2: Math.round(co2 * 10) / 10,
        trees: Math.round(trees),
      });

      setIsCalculated(true);
    }, 100);
  };

  return (
    <section id="calculator" className="py-24 bg-sky-deep relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-sun) 1px, transparent 1px), linear-gradient(90deg, var(--color-sun) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sun/10 border border-sun/20 text-sun mb-6 shadow-[0_0_30px_rgba(255,179,71,0.2)]"
          >
            <CalcIcon size={32} />
          </motion.div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white uppercase tracking-wide">
            {t('calculator', 'title')}
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left - Tactile Input Device (Mission Control) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 bg-gradient-to-b from-sky-mid to-sky-deep border border-white/10 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative"
          >
            {/* Device Screws/Details */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-white/10 shadow-inner" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white/10 shadow-inner" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-white/10 shadow-inner" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-white/10 shadow-inner" />

            {/* Type Selector */}
            <div className="flex bg-gunmetal/50 rounded-xl p-1.5 mb-8 border border-black/20 shadow-inner">
              <button 
                onClick={() => setType('residential')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${type === 'residential' ? 'bg-sun text-sky-deep shadow-md' : 'text-gray hover:text-white'}`}
              >
                <Home size={18} /> {t('calculator', 'residential')}
              </button>
              <button 
                onClick={() => setType('commercial')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${type === 'commercial' ? 'bg-sun text-sky-deep shadow-md' : 'text-gray hover:text-white'}`}
              >
                <Building2 size={18} /> {t('calculator', 'commercial')}
              </button>
            </div>

            {/* Bill Slider (Tactile) */}
            <div className="mb-8 bg-sky-deep/50 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-end mb-6">
                <label htmlFor="bill-slider" className="text-white font-bold tracking-wide uppercase text-sm">{t('calculator', 'bill')}</label>
                <div className="bg-gunmetal px-4 py-1 rounded-md border border-white/10 shadow-inner">
                  <span className="font-mono text-2xl text-sun font-bold">₹{bill.toLocaleString()}</span>
                </div>
              </div>
              <input 
                id="bill-slider"
                type="range" 
                min="1000" 
                max="50000" 
                step="500"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                className="w-full h-3 bg-gunmetal rounded-full appearance-none cursor-pointer accent-sun shadow-inner"
              />
              <div className="flex justify-between text-gray text-xs font-mono mt-3">
                <span>₹1K</span>
                <span>₹50K+</span>
              </div>
            </div>

            {/* Roof Slider (Tactile) */}
            <div className="mb-8 bg-sky-deep/50 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-end mb-6">
                <label htmlFor="roof-slider" className="text-white font-bold tracking-wide uppercase text-sm">{t('calculator', 'roof')}</label>
                <div className="bg-gunmetal px-4 py-1 rounded-md border border-white/10 shadow-inner">
                  <span className="font-mono text-2xl text-teal font-bold">{roof} <span className="text-sm">sq.ft</span></span>
                </div>
              </div>
              <input 
                id="roof-slider"
                type="range" 
                min="100" 
                max="5000" 
                step="50"
                value={roof}
                onChange={(e) => setRoof(Number(e.target.value))}
                className="w-full h-3 bg-gunmetal rounded-full appearance-none cursor-pointer accent-teal shadow-inner"
              />
              <div className="flex justify-between text-gray text-xs font-mono mt-3">
                <span>100 sq.ft</span>
                <span>5K+ sq.ft</span>
              </div>
              {roof < MIN_ROOF_FOR_MIN_SYSTEM && (
                <p className="mt-3 text-xs text-amber-400 font-bold">
                  ⚠ Minimum {MIN_ROOF_FOR_MIN_SYSTEM} sq.ft needed for a 1 kW system. Results will be capped.
                </p>
              )}
            </div>

            {/* Phase Toggle */}
            <div className="mb-10">
              <label className="text-white font-bold tracking-wide block mb-4 uppercase text-sm">{t('calculator', 'phase')}</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setPhase('single')}
                  className={`py-3 rounded-xl border font-bold transition-all ${phase === 'single' ? 'bg-white/10 border-white text-white shadow-inner' : 'border-white/10 text-gray hover:border-white/30 bg-gunmetal/30'}`}
                >
                  {t('calculator', 'singlePhase')}
                </button>
                <button 
                  onClick={() => setPhase('three')}
                  className={`py-3 rounded-xl border font-bold transition-all ${phase === 'three' ? 'bg-white/10 border-white text-white shadow-inner' : 'border-white/10 text-gray hover:border-white/30 bg-gunmetal/30'}`}
                >
                  {t('calculator', 'threePhase')}
                </button>
              </div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={calculateEstimate}
              className="w-full bg-sun hover:bg-sun-light text-sky-deep font-bold py-5 rounded-xl transition-colors shadow-[0_10px_20px_rgba(255,179,71,0.3),inset_0_-4px_0_rgba(0,0,0,0.2)] text-lg uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <CalcIcon size={20} /> {t('calculator', 'calculate')}
            </motion.button>
          </motion.div>

          {/* Right - Receipt Printer */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-7 h-full flex flex-col"
          >
            {/* Printer Slot */}
            <div className="h-6 bg-gunmetal rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] border-b border-white/10 relative z-20 mx-4 md:mx-12 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
            </div>

            <AnimatePresence mode="wait">
              {!isCalculated ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-sky-mid/30 mx-4 md:mx-12"
                >
                  <Zap size={48} className="text-white/20 mb-6" />
                  <p className="text-gray text-xl font-display uppercase tracking-widest">
                    Enter your details to print<br/>your solar estimate
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ height: 0, opacity: 0, y: -50 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                  className="bg-[#F8F9FA] text-sky-deep mx-6 md:mx-16 relative z-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] scan-line"
                  style={{ filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.5))' }}
                >
                  {/* Receipt Content */}
                  <div className="p-8 md:p-12 font-mono">
                    <div className="text-center border-b-2 border-dashed border-gray/30 pb-6 mb-8">
                      <h3 className="font-bold text-2xl uppercase tracking-widest">Estimate Receipt</h3>
                      <p className="text-xs text-gray mt-2">SolarEdge Pro // {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Top Highlights */}
                    <div className="grid sm:grid-cols-2 gap-8 mb-8">
                      <div>
                        <p className="text-gray text-xs font-bold uppercase tracking-wider mb-1">{t('calculator', 'recSize')}</p>
                        <div className="text-4xl font-bold">
                          {results.systemSize} <span className="text-xl">kW</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray text-xs font-bold uppercase tracking-wider mb-1">{t('calculator', 'estSavings')}</p>
                        <div className="text-4xl font-bold flex items-center">
                          <span className="text-2xl mr-1">₹</span>{results.monthlySavings.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown Grid */}
                    <div className="border-t-2 border-dashed border-gray/30 pt-8 mb-8">
                      <div className="space-y-4">
                        <ReceiptRow label={t('calculator', 'baseCost')} value={`₹${results.baseCost.toLocaleString()}`} />
                        <ReceiptRow label={t('calculator', 'centralSub')} value={`-₹${results.subsidy.toLocaleString()}`} />
                        <div className="h-px bg-gray/30 my-2" />
                        <ReceiptRow label={t('calculator', 'finalCost')} value={`₹${results.finalCost.toLocaleString()}`} isBold />
                        <ReceiptRow label={t('calculator', 'payback')} value={`${results.payback} Years`} isBold />
                        <div className="h-px bg-gray/30 my-2" />
                        <ReceiptRow label={t('calculator', 'panels')} value={`${results.panels} Units`} />
                        <ReceiptRow label={t('calculator', 'roofNeeded')} value={`${results.roofNeeded} sq.ft`} />
                      </div>
                    </div>

                    {/* Environment Impact */}
                    <div className="bg-teal/10 border border-teal/20 rounded-xl p-6 flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <Leaf size={24} className="text-teal" />
                        <div>
                          <p className="text-teal font-bold uppercase tracking-wider text-xs">{t('calculator', 'co2')}</p>
                          <p className="text-xl font-bold">{results.co2} <span className="text-xs text-gray">Tonnes/yr</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-teal font-bold uppercase tracking-wider text-xs">{t('calculator', 'trees')}</p>
                        <p className="text-xl font-bold">{results.trees} <span className="text-xs text-gray">Trees</span></p>
                      </div>
                    </div>

                    <button 
                      onClick={() => document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full bg-sky-deep hover:bg-sky text-white font-bold py-4 rounded-xl transition-all uppercase tracking-wider font-sans"
                    >
                      {t('calculator', 'getExact')}
                    </button>
                  </div>

                  {/* Jagged Bottom Edge */}
                  <svg className="w-full h-4 text-[#F8F9FA] block" preserveAspectRatio="none" viewBox="0 0 100 10" fill="currentColor">
                    <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 100,0 0,0" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <p className="text-center text-gray/60 text-xs mt-12 max-w-3xl mx-auto leading-relaxed">
          {t('calculator', 'disclaimer')}
        </p>
      </div>
    </section>
  );
};

const ReceiptRow = ({ label, value, isBold = false }: { label: string, value: string, isBold?: boolean }) => (
  <div className="flex justify-between items-end">
    <p className={`text-sm uppercase tracking-wider ${isBold ? 'font-bold' : 'text-gray'}`}>{label}</p>
    <p className={`text-lg ${isBold ? 'font-bold' : ''}`}>{value}</p>
  </div>
);
