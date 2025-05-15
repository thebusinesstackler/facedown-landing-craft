
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const TrustedPartnerSection: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Default location variables
  const defaultCity = "{location(city_name)}";
  const defaultRegion = "{location(region_name)}";
  
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50/50 text-medical-dark border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="gradient-text">Your Trusted Partner</span>
              <span className="block mt-3 text-medical-dark">for {defaultCity} Rent Face-Down Recovery Equipment</span>
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="text-lg">
                Whether {"{healing after eye surgery|recovering from retinal surgery|needing post-operative support}"} in {defaultCity}, 
                FaceDown Recovery Equipment provides the {"{necessary|essential|vital}"} recovery tools to help you 
                heal {"{effectively|properly|comfortably}"}.
              </p>
              <p className="mt-4 text-lg">
                Our {"{hassle-free|simple|convenient}"} rental process and {"{exceptional|outstanding|superior}"} support 
                will ensure your recovery experience in {defaultCity} and {defaultRegion} County goes as 
                {"{smoothly|comfortably|seamlessly}"} as possible.
              </p>
            </div>
            <Link to="/pricing" className="inline-block">
              <Button 
                size="lg" 
                className="bg-medical-green hover:bg-gradient-green text-white font-medium text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                PLACE YOUR ORDER <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center md:justify-end animate-slide-down">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div 
                  className="relative group rounded-2xl overflow-hidden shadow-xl border-2 border-medical-blue/10 max-w-md cursor-pointer neo-morph"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-medical-blue/50 to-medical-green/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <ZoomIn className="text-white h-12 w-12" />
                  </div>
                  <img 
                    src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-positioning.jpg"
                    alt={`Face-down recovery positioning equipment in ${defaultCity}`}
                    className={`w-full h-auto object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-bold">Face-Down Recovery Solutions</h3>
                    <p className="text-sm mt-2">Professional medical equipment for optimal recovery</p>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 bg-white/90 backdrop-blur-md shadow-lg rounded-lg border border-medical-blue/20 animate-fade-in">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-medical-blue">Face-Down Recovery Equipment</h3>
                  <p className="text-sm text-gray-600">Our specialized equipment is designed for maximum comfort and effectiveness during your face-down recovery period in {defaultCity}.</p>
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
