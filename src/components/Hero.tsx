
import React from 'react';
import { Button } from '@/components/ui/button';
import SpintexHeading from './SpintexHeading';

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
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-medical-light to-white">
      <div className="absolute inset-0 bg-[url('https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg')] bg-cover bg-center opacity-20"></div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <div className="inline-block bg-medical-green/10 px-4 py-1.5 rounded-full text-medical-green font-medium text-sm mb-2">
              Supporting Your Recovery
            </div>
            
            <SpintexHeading 
              options={spintexOptions}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-medical-dark"
            />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white bg-black/70 p-3 inline-block">
              {locationSpintex[0]}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              {"{Receive|Get} the recovery equipment you need, delivered {quickly|swiftly|promptly} to your doorstep with Express UPS shipping. We offer {flexible|convenient} rental periods of 7 to 14 days for a stress-free recovery."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <Button size="lg" className="bg-medical-blue hover:bg-medical-blue/90 text-white">
                {"{Reserve|Order} Equipment"}
              </Button>
              <Button size="lg" variant="outline" className="border-medical-blue text-medical-blue hover:bg-medical-blue/10">
                Call Now
              </Button>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-md">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg" 
                alt="Face-down recovery equipment in use" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-xl">
              <div className="text-medical-green font-bold text-xl">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
