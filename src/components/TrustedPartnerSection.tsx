
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrustedPartnerSection: React.FC = () => {
  return (
    <section className="py-16 bg-medical-dark text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Your Trusted Partner for Boca Raton Rent face-down recovery equipment near you!
            </h2>
            <p className="text-lg md:text-xl">
              Whether healing after eye surgery in Boca Raton, FaceDown Recovery Equipment provides the necessary 
              recovery tools to help you heal effectively. Our hassle-free rental process and exceptional support will ensure 
              your Rent face-down recovery equipment in Boca Raton and Palm Beach County goes as smoothly as possible.
            </p>
            <Link to="/pricing">
              <Button 
                size="lg" 
                className="bg-medical-green hover:bg-medical-green/90 text-white font-medium text-lg px-8 py-6 h-auto"
              >
                PLACE YOUR ORDER <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <div className="border-4 border-white rounded-lg overflow-hidden max-w-md">
              <img 
                src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-positioning.jpg"
                alt="Face-down recovery positioning equipment in Boca Raton"
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
