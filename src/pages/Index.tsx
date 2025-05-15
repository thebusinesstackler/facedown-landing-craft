
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RecoveryImageGallery from '@/components/RecoveryImageGallery';
import TrustedPartnerSection from '@/components/TrustedPartnerSection';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <main className="flex-grow">
        <Features />
        <HowItWorks />
        <Testimonials />
        <TrustedPartnerSection />
        <RecoveryImageGallery />
        <ContactForm />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
