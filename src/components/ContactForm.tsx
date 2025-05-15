
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import SpintexHeading from './SpintexHeading';

const ContactForm: React.FC = () => {
  useEffect(() => {
    // Load the form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  // List of cities serviced - could be dynamically loaded from a data source
  const servicedCities = [
    { city: "{location(city_name)}", region: "{location(region_name)}", latitude: 26.3683, longitude: -80.1289 },
    { city: "Miami", region: "{location(region_name)}", latitude: 25.7617, longitude: -80.1918 },
    { city: "Fort Lauderdale", region: "{location(region_name)}", latitude: 26.1224, longitude: -80.1373 },
    { city: "West Palm Beach", region: "{location(region_name)}", latitude: 26.7153, longitude: -80.0534 },
    { city: "Delray Beach", region: "{location(region_name)}", latitude: 26.4615, longitude: -80.0728 }
  ];

  return (
    <section id="contact" className="py-20 bg-[#1F1F1F] text-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SpintexHeading 
            options={[
              "Contact Us for Face-Down Recovery Equipment",
              "Get in Touch About Recovery Equipment",
              "Reach Out for Recovery Support"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6"
            interval={5000}
          />
          <p className="text-gray-300 text-lg">
            {"{Fill out the form below|Contact us today|Reach out now}"} for {"{personalized recovery solutions|customized equipment|expert assistance}"} in {location(city_name)}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="bg-black border border-gray-800 p-1 rounded-xl overflow-hidden w-full">
            <div className="w-full h-[721px]">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/StF1ENbPXhNOQkDE2cQW"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                id="inline-StF1ENbPXhNOQkDE2cQW" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Facedown Recovery Equipment - pSEO Footer"
                data-height="721"
                data-layout-iframe-id="inline-StF1ENbPXhNOQkDE2cQW"
                data-form-id="StF1ENbPXhNOQkDE2cQW"
                title="Facedown Recovery Equipment - pSEO Footer"
              />
            </div>
          </Card>

          <div className="flex flex-col space-y-6">
            {/* Smaller Map */}
            <div className="relative rounded-xl overflow-hidden h-[350px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114304.40083200874!2d-80.17553029943376!3d26.368296151218453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8e3c5a9dae6bd%3A0x77a929f150d7516e!2{location(city_name)}%2C%20{location(region_name)}!5e0!3m2!1sen!2sus!4v1716644596117!5m2!1sen!2sus" 
                className="absolute inset-0 w-full h-full border-0 rounded-xl"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {/* Cities We Service Section */}
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Cities We Service</h3>
              <div className="mb-4" dangerouslySetInnerHTML={{
                __html: `[page-generator-pro-google-map 
                map_mode="place" 
                maptype="roadmap" 
                location="{location(city_name)}" 
                destination="{location(region_name)}" 
                country_code="US" 
                height="350" 
                zoom="14" 
                center_latitude="{location(city_latitude)}" 
                center_longitude="{location(city_longitude)}" 
                ignore_errors="0"]`
              }} />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {servicedCities.map((location, index) => (
                  <div key={index} className="p-3 bg-black/50 rounded-lg border border-gray-800 hover:border-medical-green transition-colors">
                    <p className="font-medium">{location.city}</p>
                    <p className="text-sm text-gray-400">{location.region}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Recovery in {"{location(city_name)}"} made easy - we provide equipment delivery and setup throughout {"{location(region_name)}"} and surrounding areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
