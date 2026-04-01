import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckCircle2, Phone, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { BUSINESS_PHONE, BUSINESS_PHONE_DISPLAY, GOOGLE_SHEETS_URL, WHATSAPP_URL } from '../../lib/constants';

type FormData = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  services: string[];
  bill: number;
  size: string;
  roof: string;
  time: string;
  message: string;
};

export const Quote = () => {
  const { t, language } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const timersRef = useRef<number[]>([]);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, trigger } = useForm<FormData>({
    defaultValues: {
      services: [],
      bill: 3000,
      size: 'Not Sure',
      roof: 'Not Sure',
      time: 'Anytime'
    }
  });

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const nextStep = async () => {
    const valid = await trigger(['name', 'phone', 'email', 'city', 'address']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    setIsSubmitted(true);

    if (GOOGLE_SHEETS_URL) {
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: 'POST',
          mode: 'no-cors', // Required for Google Apps Script
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            name: data.name,
            phone: data.phone,
            email: data.email,
            city: data.city,
            address: data.address,
            services: data.services.join(', '),
            bill: data.bill,
            size: data.size,
            roof: data.roof,
            time: data.time,
            message: data.message,
          }),
        });
      } catch (err: unknown) {
        console.error('Error saving to Google Sheets:', err);
        setSubmitError('We could not save your enquiry to our dashboard, but we can still continue on WhatsApp.');
      }
    }

    const msg = encodeURIComponent(`NEW SOLAR QUOTE REQUEST
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
City: ${data.city}
Address: ${data.address}
Service: ${data.services.join(', ')}
Monthly Bill: Rs.${data.bill}
System Size: ${data.size}
Roof Type: ${data.roof}
Best Time: ${data.time}
Message: ${data.message}`);

    const whatsappTimer = setTimeout(() => {
      window.open(`${WHATSAPP_URL}?text=${msg}`, '_blank', 'noopener,noreferrer');
    }, 1500);

    const resetTimer = setTimeout(() => {
      setIsSubmitted(false);
      setStep(1);
      reset();
    }, 6500);

    timersRef.current.push(whatsappTimer, resetTimer);
  };

  const trustPoints = [
    { id: 'trust1', icon: CheckCircle2 },
    { id: 'trust2', icon: CheckCircle2 },
    { id: 'trust3', icon: CheckCircle2 },
    { id: 'trust4', icon: CheckCircle2 },
  ];

  return (
    <section id="get-quote" className="py-24 bg-light-bg text-sky-deep relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left - Form */}
          <div className="lg:col-span-7 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mb-12"
            >
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 uppercase tracking-wide">
                {t('quote', 'title')}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-2 bg-sky/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '50%' }}
                    animate={{ width: step === 1 ? '50%' : '100%' }}
                    className="h-full bg-sun"
                  />
                </div>
                <span className="font-mono text-sm font-bold text-gray uppercase tracking-widest">
                  Step {step}/2
                </span>
              </div>
            </motion.div>

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-sky/5 relative overflow-hidden min-h-[600px]">
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-sky-deep flex flex-col items-center justify-center text-center p-8 z-50"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-sun flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,179,71,0.5)]"
                    >
                      <CheckCircle2 size={48} className="text-sky-deep" />
                    </motion.div>
                    <h3 className="font-display font-bold text-4xl text-white mb-4">{t('quote', 'thanks1')}</h3>
                    <p className="text-gray text-lg">{t('quote', 'thanks2')}<br/>{t('quote', 'thanks3')}</p>
                    {submitError && <p className="mt-4 text-sm text-amber-light">{submitError}</p>}
                    
                    {/* Confetti placeholder */}
                    <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(circle, var(--color-sun) 2px, transparent 2px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }} />
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
                    
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex-1 space-y-6"
                      >
                        <h3 className="font-display font-bold text-2xl text-sky-deep mb-8 border-b border-sky/10 pb-4">
                          {t('quote', 'step1')}
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'name')} *</label>
                            <input
                              id="name"
                              maxLength={100}
                              {...register('name', { required: true, minLength: 2, maxLength: 100 })}
                              className={`w-full bg-light-bg border ${errors.name ? 'border-red-500' : 'border-sky/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors`}
                            />
                            {errors.name && <span className="text-red-500 text-xs mt-1">{t('quote', 'errName')}</span>}
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'phone')} *</label>
                            <input 
                              id="phone"
                              type="tel"
                              maxLength={10}
                              {...register('phone', { required: true, pattern: /^[0-9]{10}$/ })}
                              className={`w-full bg-light-bg border ${errors.phone ? 'border-red-500' : 'border-sky/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors`}
                            />
                            {errors.phone && <span className="text-red-500 text-xs mt-1">{t('quote', 'errPhone')}</span>}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'email')} *</label>
                            <input 
                              id="email"
                              type="email"
                              maxLength={254}
                              {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                              className={`w-full bg-light-bg border ${errors.email ? 'border-red-500' : 'border-sky/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors`}
                            />
                            {errors.email && <span className="text-red-500 text-xs mt-1">{t('quote', 'errEmail')}</span>}
                          </div>
                          <div>
                            <label htmlFor="city" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'city')} *</label>
                            <select 
                              id="city"
                              {...register('city', { required: true })}
                              className="w-full bg-light-bg border border-sky/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors appearance-none"
                            >
                              <option value="">Select City</option>
                              <option value="Mumbai">Mumbai</option>
                              <option value="Pune">Pune</option>
                              <option value="Nagpur">Nagpur</option>
                              <option value="Nashik">Nashik</option>
                              <option value="Aurangabad">Aurangabad</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="address" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'address')} *</label>
                          <textarea 
                            id="address"
                            maxLength={500}
                            {...register('address', { required: true })}
                            rows={3}
                            className={`w-full bg-light-bg border ${errors.address ? 'border-red-500' : 'border-sky/10'} rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors resize-none`}
                          />
                          {errors.address && <span className="text-red-500 text-xs mt-1">{t('quote', 'errAddress')}</span>}
                        </div>

                        <div className="pt-8 mt-auto">
                          <button 
                            type="button"
                            onClick={nextStep}
                            disabled={isSubmitting}
                            className="w-full bg-sky-deep hover:bg-sky text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                          >
                            {t('quote', 'next')} <ArrowRight size={20} />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex-1 space-y-6"
                      >
                        <div className="flex items-center gap-4 mb-8 border-b border-sky/10 pb-4">
                          <button type="button" onClick={() => setStep(1)} className="p-2 hover:bg-light-bg rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-gray" />
                          </button>
                          <h3 className="font-display font-bold text-2xl text-sky-deep">
                            {t('quote', 'step2')}
                          </h3>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray uppercase tracking-wider mb-4">{t('quote', 'serviceType')} *</label>
                          <div className="flex flex-wrap gap-3">
                            {['Installation', 'Maintenance', 'Inverter', 'Battery', 'AMC'].map(service => (
                              <label key={service} className="cursor-pointer">
                                <input type="checkbox" value={service} {...register('services', { required: true })} className="hidden peer" />
                                <div className="px-4 py-2 rounded-full border border-sky/10 bg-light-bg text-sky-mid font-bold text-sm peer-checked:bg-sun peer-checked:border-sun peer-checked:text-sky-deep transition-all">
                                  {service}
                                </div>
                              </label>
                            ))}
                          </div>
                          {errors.services && <span className="text-red-500 text-xs mt-2 block">{t('quote', 'errService')}</span>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="sysSize" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'sysSize')}</label>
                            <select id="sysSize" {...register('size')} className="w-full bg-light-bg border border-sky/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors appearance-none">
                              <option value="Not Sure">Not Sure</option>
                              <option value="1kW - 3kW">1kW - 3kW</option>
                              <option value="4kW - 5kW">4kW - 5kW</option>
                              <option value="6kW - 10kW">6kW - 10kW</option>
                              <option value="10kW+">10kW+</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="roofType" className="block text-sm font-bold text-gray uppercase tracking-wider mb-2">{t('quote', 'roofType')}</label>
                            <select id="roofType" {...register('roof')} className="w-full bg-light-bg border border-sky/10 rounded-xl px-4 py-3 focus:outline-none focus:border-sun transition-colors appearance-none">
                              <option value="Not Sure">Not Sure</option>
                              <option value="Flat RCC">Flat RCC</option>
                              <option value="Sloped">Sloped</option>
                              <option value="Tin Metal">Tin Metal</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray uppercase tracking-wider mb-4">{t('quote', 'bestTime')}</label>
                          <div className="flex flex-wrap gap-3">
                            {['Morning', 'Afternoon', 'Evening', 'Anytime'].map(time => (
                              <label key={time} className="cursor-pointer">
                                <input type="radio" value={time} {...register('time')} className="hidden peer" />
                                <div className="px-4 py-2 rounded-full border border-sky/10 bg-light-bg text-sky-mid font-bold text-sm peer-checked:bg-sky-deep peer-checked:border-sky-deep peer-checked:text-white transition-all">
                                  {time}
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="pt-8 mt-auto">
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-sun hover:bg-sun-light text-sky-deep font-bold py-4 rounded-xl transition-all shadow-[0_10px_30px_rgba(255,179,71,0.3)] transform hover:-translate-y-1 uppercase tracking-wider disabled:opacity-70 disabled:transform-none"
                          >
                            {isSubmitting ? 'Submitting...' : t('quote', 'submit')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right - Trust Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 lg:pt-24"
          >
            <div className="bg-sky-deep rounded-3xl p-8 md:p-10 shadow-2xl border border-white/5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sun/10 rounded-full blur-3xl" />
              
              <h3 className="font-display font-bold text-3xl mb-8 uppercase tracking-wide">
                Why Choose Us?
              </h3>
              
              <ul className="space-y-6 mb-12">
                {trustPoints.map((point, i) => {
                  const Icon = point.icon;
                  return (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-sun/10 flex items-center justify-center text-sun shrink-0">
                        <Icon size={20} />
                      </div>
                      <span className="font-bold text-lg">{t('quote', point.id)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t border-white/10 pt-8">
                <p className="text-gray text-sm font-bold uppercase tracking-wider mb-4">Direct Contact</p>
                <div className="flex flex-col gap-4">
                  <a href={`tel:+${BUSINESS_PHONE}`} className="flex items-center gap-4 hover:text-sun transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-xl">{BUSINESS_PHONE_DISPLAY}</p>
                      <p className="text-gray text-sm">Call us anytime</p>
                    </div>
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-4 hover:text-teal transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-xl">{BUSINESS_PHONE_DISPLAY}</p>
                      <p className="text-gray text-sm">WhatsApp available</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
