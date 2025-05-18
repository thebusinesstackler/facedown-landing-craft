
import React from 'react';
import { Button } from '@/components/ui/button';
import SpintexHeading from './SpintexHeading';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { LocationData } from '@/utils/locationUtils';

interface HeroProps {
  locationData?: LocationData;
}

const Hero: React.FC<HeroProps> = ({ locationData }) => {
  const headingSpintex = [
    "{keyword}",
    "Nationwide {keyword}",
    "Post-Surgery Recovery Equipment Solutions"
  ];

  const subheadingSpintex = [
    "Supporting your recovery journey in {location(city_name)}, {location(region_name)}",
    "Expert equipment delivery in {location(city_name)} for a smoother healing process",
    "Specialized recovery solutions for {location(city_name)} patients"
  ];

  const messageSpintex = [
    "{Receive|Get} medical-grade recovery equipment delivered {quickly|promptly} to your doorstep with nationwide shipping.",
    "{Need|Require} post-surgery equipment? We offer {convenient|flexible} 7-14 day rental periods with easy setup.",
    "Recovering from eye surgery? Our specialized equipment {ensures|guarantees} proper positioning during your healing journey."
  ];

  const defaultKeyword = "{keyword}"; // Changed from "Face-Down Recovery Equipment Rentals" to "{keyword}"
  const pageTitle = locationData 
    ? `${locationData.keyword || defaultKeyword} in ${locationData.city_name}, ${locationData.region_name}`
    : defaultKeyword;

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Full-screen background image with increased brightness */}
      <div 
        className="absolute inset-0 bg-[url('https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg')] bg-cover bg-center bg-no-repeat"
        style={{ zIndex: -2, filter: "brightness(1.5)" }} // Added brightness filter
      ></div>
      
      {/* Overlay with reduced opacity for better visibility */}
      <div 
        className="absolute inset-0 bg-black/40" // Reduced from 60% to 40% opacity
        style={{ zIndex: -1 }}
      ></div>
      
      <div className="container relative z-10 mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left space-y-4 md:space-y-6">
            <div className="inline-block bg-medical-green/30 px-4 py-1.5 rounded-full text-white font-medium text-xs md:text-sm mb-2 backdrop-blur-sm">
              {locationData ? `Medical Equipment for ${locationData.city_name}` : "Medical Equipment for Post-Surgery Recovery"}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight text-white">
              {pageTitle}
            </h1>
            
            <SpintexHeading 
              options={subheadingSpintex}
              className="text-xl md:text-2xl lg:text-3xl font-medium text-white bg-black/40 p-2 md:p-3 inline-block backdrop-blur-sm"
              interval={5000}
              locationData={locationData}
              showRawSpintex={!locationData} // Show raw spintex when not on a location page
            />
            
            <p className="text-base md:text-lg lg:text-xl text-gray-200 max-w-xl backdrop-blur-sm bg-black/20 p-3 md:p-4 rounded-lg">
              <SpintexHeading 
                options={messageSpintex}
                className="inline"
                interval={6000}
                locationData={locationData}
                showRawSpintex={!locationData} // Show raw spintex when not on a location page
              />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start pt-4">
              <HashLink smooth to="/#order-now">
                <Button size="lg" className="bg-medical-green hover:bg-medical-green/90 text-white text-sm md:text-base">
                  Order Equipment
                </Button>
              </HashLink>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-sm md:text-base mt-2 sm:mt-0">
                Call For Support
              </Button>
            </div>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-lg p-4 md:p-6 rounded-2xl border-white/20 shadow-2xl max-w-md mx-auto mt-6 md:mt-0">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Patient Recovery Support</h3>
            <ul className="space-y-2 md:space-y-3 text-white text-sm md:text-base">
              <li className="flex items-center gap-2">
                <div className="bg-medical-green/80 p-1 rounded-full">✓</div>
                <span>Express UPS shipping nationwide</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-medical-green/80 p-1 rounded-full">✓</div>
                <span>Flexible 7-14 day rental periods</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-medical-green/80 p-1 rounded-full">✓</div>
                <span>Medical-grade equipment</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="bg-medical-green/80 p-1 rounded-full">✓</div>
                <span>24/7 patient support available</span>
              </li>
            </ul>
            <HashLink smooth to="/#order-now">
              <Button size="lg" className="w-full mt-4 md:mt-6 bg-medical-green hover:bg-medical-green/90 text-white text-sm md:text-base">
                Reserve Equipment Now
              </Button>
            </HashLink>
          </Card>
        </div>
      </div>
      
      {/* Down arrow indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 md:h-8 md:w-8 text-white" />
      </div>
    </section>
  );
};

export default Hero;
