
import React from 'react';
import { Button } from '@/components/ui/button';
import SpintexHeading from './SpintexHeading';
import { Card } from '@/components/ui/card';

const Hero: React.FC = () => {
  const spintexOptions = [
    "Face-Down Recovery Equipment Rentals",
    "Face-Down Recovery Gear Rentals",
    "Nationwide Face-Down Recovery Equipment Rentals",
    "Nationwide Face-Down Recovery Gear Rentals"
  ];

  const locationSpintex = [
    "{recovery} in {location(city_name)}, {location(region_name)}",
    "Get {recovery} in {location(city_name)} – Your Path to a Smooth Healing Journey"
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
        className="absolute inset-0 bg-black/50"
        style={{ zIndex: -1 }}
      ></div>
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="inline-block bg-medical-green/30 px-4 py-1.5 rounded-full text-white font-medium text-sm mb-2 backdrop-blur-sm">
              Supporting Your Recovery
            </div>
            
            <SpintexHeading 
              options={spintexOptions}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white"
            />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white bg-black/70 p-3 inline-block backdrop-blur-sm">
              {locationSpintex[0]}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-xl">
              {"{Receive|Get} the recovery equipment you need, delivered {quickly|swiftly|promptly} to your doorstep with Express UPS shipping. We offer {flexible|convenient} rental periods of 7 to 14 days for a stress-free recovery."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Button size="lg" className="bg-medical-green hover:bg-medical-green/90 text-white">
                {"{Reserve|Order} Equipment"}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Call Now
              </Button>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-md md:ml-auto">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white/90 backdrop-blur-sm">
              <img 
                src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg" 
                alt="Face-down recovery equipment in use" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-xl">
              <div className="text-medical-green font-bold text-xl">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Down arrow indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
