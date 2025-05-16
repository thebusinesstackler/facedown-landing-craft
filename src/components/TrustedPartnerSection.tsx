
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ZoomIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const TrustedPartnerSection: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Default location variables
  const defaultCity = "{location(city_name)}";
  const defaultRegion = "{location(region_name)}";
  
  return (
    <section className="py-28 bg-gradient-to-br from-slate-50 via-blue-50/30 to-medical-blue/5 text-medical-dark border-t border-b border-gray-100 overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNTQ4OTciIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHpNNDAgMzJoMXYyaC0xek0zMyAzM2gxdjJoLTF6TTM2IDMxaDF2MWgtMXpNMzQgMzFoMXYxaC0xek0zMiAzMGgxdjFoLTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <span className="inline-block py-1 px-3 bg-medical-blue/10 text-medical-blue rounded-full text-sm font-medium">Comfortable Recovery Solutions</span>
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
            <div className="pt-4">
              <HashLink smooth to="/#order-now" className="inline-block">
                <Button 
                  size="lg" 
                  className="bg-medical-green hover:bg-gradient-green text-white font-medium text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  PLACE YOUR ORDER <ArrowRight className="ml-2" />
                </Button>
              </HashLink>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end animate-slide-down relative">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-medical-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-medical-green/10 rounded-full blur-3xl"></div>
            
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
                    src="https://videos.openai.com/vg-assets/assets%2Ftask_01jvb41ft2fvrt1pey5b0cnaav%2F1747351366_img_3.webp?st=2025-05-15T21%3A55%3A28Z&se=2025-05-21T22%3A55%3A28Z&sks=b&skt=2025-05-15T21%3A55%3A28Z&ske=2025-05-21T22%3A55%3A28Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=DuVYi0DH89wLMwAAtkr%2BGcStNkyU2eYRcWdsCaXYjcY%3D&az=oaivgprodscus"
                    alt={`Face-down recovery positioning equipment in ${defaultCity}`}
                    className={`w-full h-auto object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-xl font-bold">Face-Down Recovery Solutions</h3>
                    <p className="text-sm mt-2">Professional medical equipment for optimal recovery</p>
                  </div>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 bg-white/95 backdrop-blur-md shadow-lg rounded-lg border border-medical-blue/20 animate-fade-in">
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
