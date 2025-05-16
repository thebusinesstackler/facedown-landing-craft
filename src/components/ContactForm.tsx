
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SpintexHeading from './SpintexHeading';
import BookingCalendar from './BookingCalendar';

const ContactForm: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  
  // Define a default city name to use instead of the template variable
  const defaultCity = "Boca Raton";
  const defaultRegion = "Florida";

  // List of cities serviced - could be dynamically loaded from a data source
  const servicedCities = [
    { city: defaultCity, region: defaultRegion, latitude: 26.3683, longitude: -80.1289 },
    { city: "Miami", region: defaultRegion, latitude: 25.7617, longitude: -80.1918 },
    { city: "Fort Lauderdale", region: defaultRegion, latitude: 26.1224, longitude: -80.1373 },
    { city: "West Palm Beach", region: defaultRegion, latitude: 26.7153, longitude: -80.0534 },
    { city: "Delray Beach", region: defaultRegion, latitude: 26.4615, longitude: -80.0728 }
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      toast({
        title: "Date Selected",
        description: `You've selected ${date.toLocaleDateString()} for your equipment delivery.`,
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#1F1F1F] text-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SpintexHeading 
            options={[
              "Schedule Your Equipment Delivery",
              "Book Your Recovery Equipment",
              "Select Your Delivery Date"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6"
            interval={5000}
          />
          <p className="text-gray-300 text-lg">
            {"{Choose a date|Select when|Pick a day}"} for {"{your equipment delivery|when you need your equipment|setup of your recovery system}"} in {defaultCity}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="p-6 rounded-xl overflow-hidden w-full shadow-lg bg-gradient-to-b from-black/80 to-black/90 border border-gray-700">
            <h3 className="text-xl font-medium text-white mb-6">Select Your Preferred Delivery Date</h3>
            <BookingCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
          </Card>

          <div className="flex flex-col space-y-6">
            {/* Map */}
            <div className="relative rounded-xl overflow-hidden h-[350px]">
              <iframe 
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114304.40083200874!2d-80.17553029943376!3d26.368296151218453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8e3c5a9dae6bd%3A0x77a929f150d7516e!2${defaultCity}%2C%20${defaultRegion}!5e0!3m2!1sen!2sus!4v1716644596117!5m2!1sen!2sus`}
                className="absolute inset-0 w-full h-full border-0 rounded-xl"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {/* Cities We Service Section */}
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Cities We Service</h3>
              <div className="mb-4">
                <p className="text-gray-300">We service {defaultCity} and surrounding areas in {defaultRegion}.</p>
              </div>
              
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
                  Recovery in {defaultCity} made easy - we provide equipment delivery and setup throughout {defaultRegion} and surrounding areas.
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
