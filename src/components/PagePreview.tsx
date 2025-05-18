
import React from 'react';
import { LocationData } from '@/utils/locationUtils';
import SpintexHeading from './SpintexHeading';
import { cn } from '@/lib/utils';

interface PagePreviewProps {
  location: LocationData;
  sectionIndex: number;
}

const PagePreview: React.FC<PagePreviewProps> = ({ location, sectionIndex }) => {
  // Define sections for preview
  const sections = [
    { id: 0, name: "Hero Section" },
    { id: 1, name: "How It Works" },
    { id: 2, name: "Testimonials" },
    { id: 3, name: "FAQ" },
    { id: 4, name: "Contact" },
  ];

  // Sample heading spintex options for different sections
  const heroHeadingSpintex = ["{keyword} in {city_name}, {region_name}"];
  const heroSubheadingSpintex = ["Supporting your recovery journey in {city_name}, {region_name}"];
  const heroMessageSpintex = [
    "{Receive|Get} medical-grade recovery equipment delivered {quickly|promptly} to your doorstep with nationwide shipping.",
    "{Need|Require} post-surgery equipment? We offer {convenient|flexible} 7-14 day rental periods with easy setup."
  ];

  const renderHeroSection = () => (
    <section className="relative min-h-[500px] flex items-center">
      {/* Full-screen background image with increased brightness */}
      <div 
        className="absolute inset-0 bg-[url('https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg')] bg-cover bg-center bg-no-repeat"
        style={{ zIndex: -2, filter: "brightness(1.5)" }}
      ></div>
      
      {/* Overlay with reduced opacity */}
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: -1 }}></div>
      
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white">
            {location.keyword} in {location.city_name}, {location.region_name}
          </h1>
          
          <p className="text-2xl font-medium text-white bg-black/40 p-3 inline-block backdrop-blur-sm">
            Supporting your recovery journey in {location.city_name}, {location.region_name}
          </p>
          
          <p className="text-lg text-gray-200 max-w-xl mx-auto backdrop-blur-sm bg-black/20 p-4 rounded-lg">
            Medical-grade recovery equipment delivered quickly to your doorstep with nationwide shipping to {location.city_name}.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium">
              Order Equipment
            </button>
            <button className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md font-medium mt-2 sm:mt-0">
              Call For Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderHowItWorks = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works in {location.city_name}</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Order Online</h3>
            <p className="text-gray-600">
              Place your order for {location.keyword} in {location.city_name} through our simple online form.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
            <p className="text-gray-600">
              We'll deliver your equipment to {location.city_name} at your preferred date and time.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="bg-green-100 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-green-600 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Return When Done</h3>
            <p className="text-gray-600">
              Once your recovery is complete, we'll pick up the equipment from your {location.city_name} location.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderTestimonials = () => (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our {location.city_name} Customers Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-gray-500 text-sm">{location.city_name}, {location.region_name}</p>
              </div>
            </div>
            <p className="text-gray-600">
              "The {location.keyword} service in {location.city_name} was excellent. The equipment arrived on time and made my recovery so much easier."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Michael Davis</h4>
                <p className="text-gray-500 text-sm">{location.city_name}, {location.region_name}</p>
              </div>
            </div>
            <p className="text-gray-600">
              "I was concerned about my post-surgery recovery, but the equipment and support in {location.city_name} made all the difference."
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFAQ = () => (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions in {location.city_name}</h2>
        
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">How long can I rent the equipment in {location.city_name}?</h3>
            <p className="text-gray-600 mt-2">
              Our standard rental periods in {location.city_name} are 7, 14, or 28 days, but we can accommodate your specific needs.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Do you deliver to all areas of {location.city_name}?</h3>
            <p className="text-gray-600 mt-2">
              Yes, we provide delivery services to all neighborhoods and surrounding areas of {location.city_name}, {location.region_name}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us in {location.city_name}</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-4">Our {location.city_name} Service</h3>
            <p className="text-gray-600 mb-6">
              We're proud to offer {location.keyword} to patients in {location.city_name} and throughout {location.region_name}.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600">📱</span>
                </div>
                <span>(555) 123-4567</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600">✉️</span>
                </div>
                <span>support@facedownrecovery.com</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full border rounded-md px-3 py-2" placeholder="Your name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border rounded-md px-3 py-2" placeholder="Your email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="w-full border rounded-md px-3 py-2" rows={4} placeholder="How can we help?"></textarea>
              </div>
              
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium w-full">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Render the selected section based on index
  const renderSection = () => {
    switch (sectionIndex) {
      case 0: return renderHeroSection();
      case 1: return renderHowItWorks();
      case 2: return renderTestimonials();
      case 3: return renderFAQ();
      case 4: return renderContact();
      default: return renderHeroSection();
    }
  };

  return (
    <div className="preview-container">
      <div className="bg-green-50 px-4 py-2 text-sm font-medium border-b">
        Previewing: {sections[sectionIndex].name} for {location.city_name}, {location.region_name}
      </div>
      {renderSection()}
    </div>
  );
};

export default PagePreview;
