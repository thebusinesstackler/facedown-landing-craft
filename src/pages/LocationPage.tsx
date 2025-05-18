
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import ContactCTA from '@/components/ContactCTA';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import RecoveryImageGallery from '@/components/RecoveryImageGallery';
import TrustedPartnerSection from '@/components/TrustedPartnerSection';
import OrderNow from '@/components/OrderNow';
import { getLocationById, LocationData } from '@/utils/locationUtils';

const LocationPage: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!locationId) {
      navigate('/');
      return;
    }

    const location = getLocationById(locationId);
    if (!location) {
      navigate('/');
      return;
    }

    setLocationData(location);
    // Update the page title with the location
    document.title = `Face Down Recovery Equipment Rentals in ${location.city_name}, ${location.region_name}`;
  }, [locationId, navigate]);

  if (!locationData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative">
        <Navbar />
        <Hero locationData={locationData} />
      </div>
      <main className="flex-grow">
        <HowItWorks />
        <OrderNow locationData={locationData} />
        <Testimonials />
        <TrustedPartnerSection locationData={locationData} />
        <RecoveryImageGallery locationData={locationData} />
        <ContactForm locationData={locationData} />
        <FAQ />
        <ContactCTA locationData={locationData} />
      </main>
      <Footer />
    </div>
  );
};

export default LocationPage;
