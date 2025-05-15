
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpintexHeading from './SpintexHeading';

const TrustedPartnerSection: React.FC = () => {
  return (
    <section className="py-16 bg-medical-dark text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <SpintexHeading 
              options={[
                "Your Trusted Partner for {city_name} Recovery Equipment Rentals",
                "The Leading Provider of Face-Down Recovery Solutions in {city_name}",
                "Expert Post-Surgery Equipment Rental in {region_name}"
              ]}
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              interval={7000}
            />
            <div className="text-lg md:text-xl">
              {"{Whether you're|If you're|For patients who are}"} healing after eye surgery in {"{city_name}"}, FaceDown Recovery Equipment provides the {"{necessary|essential|critical}"} 
              recovery tools to help you heal {"{effectively|properly|successfully}"}. Our {"{hassle-free|convenient|streamlined}"} rental process and {"{exceptional|outstanding|superior}"} support will ensure 
              your {"{face-down|post-operative|recovery}"} process in {"{city_name}"} and {"{region_name}"} goes as {"{smoothly|comfortably|effectively}"} as possible.
            </div>
            <div>
              <span className="text-medical-green">Follow </span>
              <a 
                href="https://www.aao.org/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-medical-green underline hover:text-medical-green/80 transition-colors"
              >
                American Academy of Ophthalmology (AAO)
              </a>
              <span className="text-medical-green"> guidelines for optimal recovery.</span>
            </div>
            <Link to="/pricing">
              <Button 
                size="lg" 
                className="bg-medical-green hover:bg-medical-green/90 text-white font-medium text-lg px-8 py-6 h-auto"
              >
                {"{PLACE YOUR ORDER|GET STARTED TODAY|RESERVE EQUIPMENT NOW}"} <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <div className="border-4 border-white rounded-lg overflow-hidden max-w-md">
              <img 
                src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-positioning.jpg"
                alt="Face-down recovery positioning equipment in {city_name}"
                className="w-full object-cover h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnerSection;
