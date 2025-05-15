
import React from 'react';
import { Card } from '@/components/ui/card';
import SpintexHeading from './SpintexHeading';

const RecoveryImageGallery: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SpintexHeading 
            options={[
              "Face-Down Recovery Solutions in Boca Raton",
              "Specialized Recovery Equipment for Post-Surgery Healing",
              "Professional Face-Down Recovery Support in South Florida"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6 text-medical-dark"
            interval={5000}
          />
          <p className="text-gray-600 text-lg">
            {"{Explore|Discover|View}"} our {"{professional|specialized|high-quality}"} face-down recovery equipment, designed to {"{support|enhance|optimize}"} your healing journey after vitrectomy surgery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-square relative">
                <img 
                  src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-positioning.jpg"
                  alt="{recovery} in {location(city_name)} made easy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-medical-dark mb-2">
                  {index === 1 ? "{Professional|Quality|Premium} Face-Down Recovery Chair" : 
                   index === 2 ? "{Comfortable|Ergonomic|Supportive} Recovery Equipment" : 
                   "{Specialized|Advanced|Expert} Vitrectomy Recovery Support"}
                </h3>
                <p className="text-gray-600">
                  {index === 1 ? "Designed for optimal comfort during extended face-down periods required after vitrectomy surgery." : 
                   index === 2 ? "Our equipment allows for comfortable socializing and daily activities while maintaining proper healing position." : 
                   "Professional equipment that supports proper healing while minimizing strain on your neck, shoulders, and back."}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-medical-dark mb-4">This Facedown Comfort Kit features:</h2>
          <p className="text-gray-600 mb-4">
            Find the <span className="font-semibold">ultimate comfort solution</span> for your <span className="font-semibold">vitrectomy recovery</span> with our comfort-focused chair. Perfect for daily activities like spending time with loved ones, reading, watching TV, or relaxing, this chair is engineered to provide superior support and minimize strain on your shoulders, back, and neck. Created to enhance your <span className="font-semibold">recovery experience</span>, it ensures lasting comfort during prolonged use.
          </p>
          <p className="text-gray-600 mb-4">
            We proudly deliver <span className="font-semibold">vitrectomy recovery</span> equipment to <span className="font-semibold">Boca Raton, Florida</span> and neighboring communities, making your recovery more hassle-free.
          </p>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold text-medical-dark mb-2">What is Vitrectomy Surgery?</h3>
            <p className="text-gray-600">
              Vitrectomy is a surgical procedure to take out the vitreous gel from the eye, typically to treat retinal problems such as retinal detachment, diabetic retinopathy, or macular holes. After the surgery, patients often need to stay in a face-down position to ensure proper healing. For more information on vitrectomy surgery, visit the AAO website.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecoveryImageGallery;
