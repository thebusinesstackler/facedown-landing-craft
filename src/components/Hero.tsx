
import React from 'react';
import { Button } from '@/components/ui/button';
import SpintexHeading from './SpintexHeading';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';

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
        
        {/* Second promotional section */}
        <div className="mt-24 grid md:grid-cols-2 gap-12 items-stretch">
          {/* Left promotional card */}
          <div className="bg-medical-dark text-white p-8 rounded-xl shadow-xl flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {"{Get|Enjoy|Claim}"} <br />
              10% {"{Off|Discount}"} <br />
              Your {"{First|Initial}"} <br />
              Rental
            </h2>
            <p className="text-lg mb-8">
              {"{Take advantage of|Don't miss out on|Make the most of|Seize}"} our {"{special offer|exclusive deal|limited-time offer|current promotion}"}! {"{Enjoy|Receive|Claim|Get}"} a {"{10% discount|10% off|10% savings|10% reduction}"} on your first {"{face-down recovery equipment rental|rental for face-down recovery equipment|face-down recovery gear rental|recovery equipment rental for face-down healing}"}. We {"{make|simplify|ease|streamline}"} your recovery {"{easier|more convenient|simpler|more comfortable}"} and {"{more affordable|cost-effective|budget-friendly|affordable}"}.
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 text-lg">
              Claim Your Discount Now
            </Button>
          </div>
          
          {/* Right urgent needs card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col">
            <div className="bg-medical-dark text-white p-6 rounded-t-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                {"{Urgent|Immediate}"} <br />
                Need for Recovery <br />
                Equipment?
              </h2>
            </div>
            
            <div className="p-8 flex-grow">
              <p className="text-lg mb-8 text-center">
                We {"{understand|recognize|know|acknowledge}"} that your recovery time is {"{crucial|vital|important|essential}"}. That's why we offer {"{expedited shipping options|fast shipping|quick delivery|priority shipping}"} to get the equipment to you as {"{quickly as possible|soon as possible|fast as we can|promptly}"}. Don't {"{delay|pause|hold up|slow down}"} your recovery—{"{order today|place your order now|order right away|get started today}"}!
              </p>
              
              <div className="flex justify-center mt-auto">
                <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 text-lg w-full">
                  {"{Contact Us Now|Claim Offer|Get Started Today}"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* New equipment showcase section with video */}
        <div className="mt-24 py-12 bg-[#2a3b2d]/95 rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left video */}
            <div className="relative rounded-lg overflow-hidden shadow-2xl mx-6">
              <div className="aspect-w-16 aspect-h-9">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  className="w-full h-full object-cover"
                >
                  <source src="https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
            
            {/* Right content */}
            <div className="px-6 md:pr-12 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                {"{Rent|Get} face-down recovery equipment {made easy|simplified} in {Boca Raton|your area}"}
              </h2>
              
              <p className="text-lg text-white/80">
                {"{Locally owned and operated|Family-owned and managed}, our team at Facedown Recovery Equipment makes {renting|obtaining} face-down recovery equipment in {Boca Raton|your city} {hassle-free|simple} with {quality-focused products|premium equipment}."}
              </p>
              
              <ul className="space-y-4">
                {[
                  "{Custom|Specialized|Tailored} solutions for all needs",
                  "{Affordable|Budget-friendly|Cost-effective} rental options for every budget",
                  "{Quick|Fast|Rapid} delivery to ensure timely recovery",
                  "{Affordable|Competitive} pricing with a {low-price|best-price} assurance",
                  "{Flexible|Adaptable|Convenient} rental periods that fit your schedule",
                  "{Easy-to-follow|Simple|Straightforward} rental process from start to finish",
                  "{Complete|Comprehensive|Full} support from start to finish"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-1 flex-shrink-0">
                      <svg width="16" height="16" viewBox="0 0 16 16" className="text-white" fill="currentColor">
                        <path d="M6.00016 10.7799L3.11016 7.8899L2.40016 8.5999L6.00016 12.1999L14.0002 4.1999L13.2902 3.4899L6.00016 10.7799Z" />
                      </svg>
                    </div>
                    <span className="text-white text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 text-lg mt-6 w-full sm:w-auto">
                Rent Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
