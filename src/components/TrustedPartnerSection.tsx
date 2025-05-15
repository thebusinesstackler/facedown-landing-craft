
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const TrustedPartnerSection: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Replace fixed city name with dynamic variable
  const cityName = "{location(city_name)}"; 
  
  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50 text-medical-dark border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-medical-blue">
              Your Trusted Partner for {cityName} Rent Face-Down Recovery Equipment
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p>
                Whether {"{healing after eye surgery|recovering from retinal surgery|needing post-operative support}"} in {cityName}, 
                FaceDown Recovery Equipment provides the {"{necessary|essential|vital}"} recovery tools to help you 
                heal {"{effectively|properly|comfortably}"}.
              </p>
              <p className="mt-4">
                Our {"{hassle-free|simple|convenient}"} rental process and {"{exceptional|outstanding|superior}"} support 
                will ensure your recovery experience in {cityName} and {"{location(region_name)}"} County goes as 
                {"{smoothly|comfortably|seamlessly}"} as possible.
              </p>
            </div>
            <Link to="/pricing" className="inline-block">
              <Button 
                size="lg" 
                className="bg-medical-green hover:bg-medical-green/90 text-white font-medium text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
              >
                PLACE YOUR ORDER <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div 
                  className="relative group rounded-lg overflow-hidden shadow-xl border-2 border-medical-amber/20 max-w-md cursor-pointer"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-medical-blue/40 to-medical-burgundy/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <ZoomIn className="text-white h-12 w-12" />
                  </div>
                  <img 
                    src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-positioning.jpg"
                    alt="Face-down recovery positioning equipment in {location(city_name)}"
                    className={`w-full h-auto object-cover transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 bg-white shadow-lg rounded-lg border border-medical-amber/10">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-medical-burgundy">Face-Down Recovery Equipment</h3>
                  <p className="text-sm text-gray-600">Click for detailed information about our equipment rental options in {cityName}.</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartnerSection;
