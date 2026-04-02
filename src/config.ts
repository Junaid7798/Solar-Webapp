const BUSINESS_PHONE = import.meta.env.VITE_BUSINESS_PHONE || '918237655610';

export const config = {
  googleSheetsUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined,
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD as string | undefined,
  businessName: import.meta.env.VITE_BUSINESS_NAME || 'Asrar Solar',
  businessPhone: BUSINESS_PHONE,
  businessEmail: import.meta.env.VITE_BUSINESS_EMAIL || 'Junaidk5610@gmail.com',
  businessTagline: import.meta.env.VITE_BUSINESS_TAGLINE || 'Maharashtra Solar Specialists',
  whatsappUrl: `https://wa.me/${BUSINESS_PHONE}`,
} as const;
