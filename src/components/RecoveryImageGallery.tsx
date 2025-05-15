
import React from 'react';
import { Card } from '@/components/ui/card';
import SpintexHeading from './SpintexHeading';
import { Bed, Table } from 'lucide-react';

const RecoveryImageGallery: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SpintexHeading 
            options={[
              "Versatile Face-Down Recovery Support in {city_name}",
              "Comfortable Face-Down Recovery Solutions for Daily Activities",
              "Professional Face-Down Recovery Support for Your Needs"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6 text-medical-dark"
            interval={5000}
          />
          <p className="text-gray-600 text-lg">
            {"{Discover|Explore|Experience}"} our specialized Tabletop {"{support system|recovery equipment|comfort solution}"} designed for both dining and sleeping during your recovery period.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
            <img 
              src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-positioning.jpg"
              alt="Tabletop facedown support for eating and sleeping"
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div className="space-y-8">
            <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-l-4 border-medical-green">
              <h2 className="text-2xl md:text-3xl font-bold text-medical-dark mb-6">
                Multi-Purpose Tabletop Facedown Support
              </h2>
              
              <p className="text-gray-600 text-lg mb-8">
                Our innovative Tabletop Facedown Support provides exceptional comfort and versatility during your {"{vitrectomy|eye surgery|recovery}"} period, allowing you to {"{maintain proper healing position|stay comfortable|follow medical instructions}"} while enjoying everyday activities.
              </p>
              
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-medical-light p-3">
                    <Table className="h-6 w-6 text-medical-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-medical-dark mb-2">Comfortable Dining Experience</h3>
                    <p className="text-gray-600">
                      Enjoy meals with family and friends while maintaining the proper face-down position. Our ergonomic design allows for comfortable dining without compromising your recovery process.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-medical-light p-3">
                    <Bed className="h-6 w-6 text-medical-blue" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-medical-dark mb-2">Restful Sleep Support</h3>
                    <p className="text-gray-600">
                      Transform your sleeping arrangement with our adaptable support system. Designed to provide proper alignment and pressure distribution for restful sleep in the required face-down position.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="bg-medical-light/50 p-6 rounded-lg border border-medical-blue/10">
              <h3 className="text-xl font-semibold text-medical-dark mb-3">
                Customized To Your Needs
              </h3>
              <p className="text-gray-600">
                Our equipment is {"{fully adjustable|easily customizable|perfectly adaptable}"} to accommodate different {"{tables|surfaces|heights}"} and {"{sleeping arrangements|beds|recovery needs}"}, ensuring maximum comfort during your entire recovery period.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-medical-dark mb-4">{"{Our Complete|This Comprehensive|The Ultimate}"} Facedown Comfort Kit features:</h2>
          <p className="text-gray-600 mb-4">
            {"{Find|Discover|Experience}"} the <span className="font-semibold">{"{ultimate|perfect|complete}"} comfort solution</span> for your <span className="font-semibold">vitrectomy recovery</span> with our {"{comfort-focused|ergonomic|specially designed}"} support system. {"{Perfect|Ideal|Excellent}"} for daily activities like {"{dining with family|enjoying meals|eating comfortably}"}, {"{sleeping|resting|relaxing}"}, this equipment is engineered to {"{provide|deliver|ensure}"} superior support and {"{minimize|reduce|prevent}"} strain on your neck, shoulders, and back.
          </p>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-xl font-bold text-medical-dark mb-2">{"{What is|Understanding|About}"} Vitrectomy Surgery</h3>
            <p className="text-gray-600">
              Vitrectomy is a {"{surgical procedure|medical operation|specialized surgery}"} to {"{remove|take out|extract}"} the vitreous gel from the eye, typically to treat {"{retinal problems|eye conditions|ocular issues}"} such as retinal detachment, diabetic retinopathy, or macular holes. After the surgery, patients often need to {"{maintain|stay in|keep}"} a face-down position to ensure proper healing. For more information on vitrectomy surgery, visit the <a href="https://www.aao.org/eye-health/treatments/what-is-vitrectomy" className="text-medical-green hover:underline" target="_blank" rel="noopener noreferrer">AAO website</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecoveryImageGallery;
