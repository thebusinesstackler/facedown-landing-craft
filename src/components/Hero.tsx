
import React from 'react';
import { Button } from '@/components/ui/button';
import SpintexHeading from './SpintexHeading';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const headingSpintex = [
    "Face-Down Recovery Equipment Rentals",
    "Nationwide Face-Down Recovery Gear Rentals",
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

  return (
    <section className="relative h-screen flex items-center">
      {/* Full-screen background image */}
      <div 
        className="absolute inset-0 bg-[url('https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg')] bg-cover bg-center bg-no-repeat"
        style={{ zIndex: -2 }}
      ></div>
      
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 bg-black/60"
        style={{ zIndex: -1 }}
      ></div>
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="inline-block bg-medical-green/30 px-4 py-1.5 rounded-full text-white font-medium text-sm mb-2 backdrop-blur-sm">
              Medical Equipment for Post-Surgery Recovery
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Face-Down Recovery Equipment Rentals
            </h1>
            
            <SpintexHeading 
              options={subheadingSpintex}
              className="text-2xl md:text-3xl font-medium text-white bg-black/40 p-3 inline-block backdrop-blur-sm"
              interval={5000}
            />
            
            <p className="text-lg md:text-xl text-gray-200 max-w-xl backdrop-blur-sm bg-black/20 p-4 rounded-lg">
              <SpintexHeading 
                options={messageSpintex}
                className="inline"
                interval={6000}
              />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Button size="lg" className="bg-medical-green hover:bg-medical-green/90 text-white">
                Order Equipment
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Call For Support
              </Button>
            </div>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border-white/20 shadow-2xl max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Patient Recovery Support</h3>
            <ul className="space-y-3 text-white">
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
            <Button size="lg" className="w-full mt-6 bg-medical-green hover:bg-medical-green/90 text-white">
              Reserve Equipment Now
            </Button>
          </Card>
        </div>
      </div>
      
      {/* Down arrow indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white" />
      </div>
    </section>
  );
};

export default Hero;
