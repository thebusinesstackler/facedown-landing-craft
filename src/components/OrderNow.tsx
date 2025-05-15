
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderNow: React.FC = () => {
  const rentalOptions = [
    {
      id: '1week',
      title: 'Standard Recovery Package',
      period: '1 Week Rental',
      price: 259,
      description: '{Ideal for|Perfect for|Best suited for} shorter recovery periods'
    },
    {
      id: '2weeks',
      title: 'Extended Recovery Package',
      period: '2 Week Rental',
      price: 320,
      description: '{Most popular option|Recommended choice|Preferred option} for typical recovery needs'
    },
    {
      id: '3weeks',
      title: 'Complete Recovery Package',
      period: '3 Week Rental',
      price: 380,
      description: '{Comprehensive support|Full recovery support|Maximum healing time} for longer recoveries'
    }
  ];

  return (
    <section id="order-now" className="py-20 bg-gradient-to-b from-background to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-medical-green font-medium">Ready for Recovery</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
            {"{Choose Your|Select Your|Pick Your}"} Recovery Equipment Package
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {"{All packages include|Every option includes|Each rental comes with}"} free delivery, setup instructions, 
            and {"{24/7 support|round-the-clock assistance|continuous customer care}"} throughout your recovery journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {rentalOptions.map((option) => (
            <div 
              key={option.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold">{option.title}</h3>
                <p className="text-gray-600 mt-1">{option.period}</p>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4 bg-gray-50 rounded-lg p-2">
                  <img 
                    src="https://facedownrecoveryequipment.com/wp-content/uploads/2025/02/Premium-Vitrectomy-Set-1.png" 
                    alt="Face-down recovery equipment" 
                    className="w-full h-48 object-contain rounded"
                  />
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-medical-green">${option.price}</span>
                </div>
                
                <p className="text-gray-600 mb-6">{option.description}</p>
                
                <ul className="mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-green mr-2">✓</span>
                    <span>Complete equipment set</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-green mr-2">✓</span>
                    <span>{"{Free|Included|Complimentary}"} delivery in {"{location(city_name)|location(city_name)}"}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-green mr-2">✓</span>
                    <span>{"{Professional|Expert|Detailed}"} setup instructions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-green mr-2">✓</span>
                    <span>24/7 customer support</span>
                  </li>
                </ul>
                
                <Link to="/pricing" className="mt-auto">
                  <Button className="w-full bg-medical-green hover:bg-medical-green/90 text-white font-medium">
                    {"{Order Now|Rent Now|Reserve Now}"} <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            {"{Serving patients in|Delivery available to|Recovery solutions for}"} {"{location(city_name)}, {location(region_name)}|{location(city_name)} and surrounding areas}"} and beyond.
          </p>
          <Link to="/pricing">
            <Button variant="outline" className="border-medical-green text-medical-green hover:bg-medical-green/10">
              View Full Pricing Details
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderNow;
