import React from 'react';
import { PageLoader } from '../components/ui/PageLoader';
import { CustomCursor } from '../components/ui/CustomCursor';
import { PageProgress } from '../components/ui/PageProgress';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { Brands } from '../components/sections/Brands';
import { About } from '../components/sections/About';
import { Calculator } from '../components/sections/Calculator';
import { VisualProof } from '../components/sections/VisualProof';
import { Quote } from '../components/sections/Quote';
import { Footer } from '../components/layout/Footer';
import { WhatsAppButton } from '../components/ui/WhatsAppButton';

export const LandingPage = () => {
  return (
    <>
      <PageLoader />
      <CustomCursor />
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Brands />
        <About />
        <VisualProof />
        <Calculator />
        <Quote />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};
