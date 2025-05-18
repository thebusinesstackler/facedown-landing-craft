
import React from 'react';
import { LocationData } from '@/utils/locationUtils';
import SpintexHeading from './SpintexHeading';
import { cn } from '@/lib/utils';

interface PagePreviewProps {
  location: LocationData;
  pageIndex: number;
}

const PagePreview: React.FC<PagePreviewProps> = ({ location, pageIndex }) => {
  // Define pages for preview
  const pages = [
    { id: 0, name: "Home Page" },
    { id: 1, name: "Services Page" },
    { id: 2, name: "About Us Page" },
    { id: 3, name: "FAQ Page" },
    { id: 4, name: "Contact Page" },
  ];

  // Sample heading spintex options for different pages
  const homeHeadingSpintex = ["{keyword} in {city_name}, {region_name}"];
  const homeSubheadingSpintex = ["Supporting your recovery journey in {city_name}, {region_name}"];
  const homeMessageSpintex = [
    "{Receive|Get} medical-grade recovery equipment delivered {quickly|promptly} to your doorstep with nationwide shipping.",
    "{Need|Require} post-surgery equipment? We offer {convenient|flexible} 7-14 day rental periods with easy setup."
  ];

  const renderHomePage = () => (
    <div className="page-preview home-page">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Full-screen background image with increased brightness */}
        <div 
          className="absolute inset-0 bg-[url('https://facedownrecoveryequipment.com/wp-content/uploads/2024/12/facedown-recovery-solutions.jpg')] bg-cover bg-center bg-no-repeat"
          style={{ zIndex: -2, filter: "brightness(1.5)" }}
        ></div>
        
        {/* Overlay with reduced opacity */}
        <div className="absolute inset-0 bg-black/40" style={{ zIndex: -1 }}></div>
        
        <div className="container relative z-10 mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
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

      {/* How It Works */}
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

      {/* Testimonials */}
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
    </div>
  );

  const renderServicesPage = () => (
    <div className="page-preview services-page">
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Our Services in {location.city_name}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We offer comprehensive {location.keyword} to help patients in {location.city_name}, {location.region_name} recover comfortably.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Equipment Rentals</h2>
            <p className="mb-6">
              We provide high-quality medical equipment rentals for patients in {location.city_name} recovering from eye surgery or other procedures requiring face-down positioning.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Face-down support chairs
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Specialized mattresses
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Positioning equipment
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Comfort accessories
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Delivery & Setup</h2>
            <p className="mb-6">
              Our {location.city_name} team provides white-glove delivery and professional setup of all equipment in your home.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Scheduled delivery to {location.city_name} addresses
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Professional assembly and adjustment
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Patient training and orientation
              </li>
              <li className="flex items-center">
                <span className="bg-green-100 text-green-800 p-1 rounded-full mr-2">✓</span>
                Equipment pickup when recovery is complete
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Rental Packages for {location.city_name} Patients</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 font-medium">
                Basic
              </div>
              <h3 className="text-xl font-bold mb-4 mt-6">Essential Package</h3>
              <p className="text-gray-600 mb-4">Perfect for short-term recovery needs in {location.city_name}</p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Face-down chair</li>
                <li>✓ Standard cushions</li>
                <li>✓ Basic delivery</li>
              </ul>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium w-full">
                Get Quote
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden border-2 border-green-600 transform scale-105">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 font-medium">
                Popular
              </div>
              <h3 className="text-xl font-bold mb-4 mt-6">Comfort Package</h3>
              <p className="text-gray-600 mb-4">Our most popular option for {location.city_name} patients</p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Premium face-down chair</li>
                <li>✓ Memory foam cushions</li>
                <li>✓ White glove delivery</li>
                <li>✓ Phone support</li>
              </ul>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium w-full">
                Get Quote
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-3 py-1 font-medium">
                Premium
              </div>
              <h3 className="text-xl font-bold mb-4 mt-6">Deluxe Package</h3>
              <p className="text-gray-600 mb-4">Complete comfort solution for {location.city_name} residents</p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Premium face-down chair</li>
                <li>✓ Specialized mattress</li>
                <li>✓ All accessories</li>
                <li>✓ White glove delivery</li>
                <li>✓ 24/7 support</li>
              </ul>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium w-full">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderAboutUsPage = () => (
    <div className="page-preview about-page">
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">About Our {location.city_name} Service</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Learn how we're helping patients in {location.city_name}, {location.region_name} recover with dignity and comfort.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="mb-4">
              We started providing {location.keyword} in {location.city_name} after our founder experienced firsthand the challenges of recovery without proper equipment.
            </p>
            <p className="mb-4">
              Since then, we've helped hundreds of patients across {location.region_name} recover more comfortably in their homes, allowing them to focus on healing rather than discomfort.
            </p>
            <p>
              Our dedicated team in {location.city_name} brings years of healthcare experience and a deep understanding of patient needs during the recovery process.
            </p>
          </div>
          <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            [Team Image Placeholder]
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto">
            To provide patients in {location.city_name} and beyond with the highest quality recovery equipment and support, making the healing process as comfortable as possible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">❤️</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Care</h3>
            <p>
              We treat each {location.city_name} patient like family, ensuring their needs are met with compassion and attention.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">🛠️</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Quality</h3>
            <p>
              Our equipment meets the highest standards, providing {location.city_name} patients with safe and effective recovery tools.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Service</h3>
            <p>
              From delivery to pickup, our {location.city_name} team provides exceptional service every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFAQPage = () => (
    <div className="page-preview faq-page">
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Everything {location.city_name} patients need to know about our {location.keyword} service.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">How long can I rent equipment in {location.city_name}?</h3>
            <p className="text-gray-700">
              Our standard rental periods for {location.city_name} customers are 7, 14, or 28 days, but we can customize the rental period based on your doctor's recommendations and your specific recovery timeline.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Do you deliver to all areas of {location.city_name}?</h3>
            <p className="text-gray-700">
              Yes, we provide delivery service to all neighborhoods and surrounding areas of {location.city_name}, {location.region_name}. Our delivery team will bring the equipment directly to your home and set it up for you.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">What types of payment do you accept in {location.city_name}?</h3>
            <p className="text-gray-700">
              We accept all major credit cards, HSA/FSA cards, and can provide documentation for insurance reimbursement. For {location.city_name} customers, we also offer special payment plans if needed.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">How quickly can you deliver to {location.city_name}?</h3>
            <p className="text-gray-700">
              For most {location.city_name} addresses, we can deliver within 24-48 hours of order confirmation. We also offer expedited same-day delivery in certain circumstances, especially for post-surgical patients.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Is your equipment sanitized between users?</h3>
            <p className="text-gray-700">
              Absolutely! All equipment is thoroughly sanitized and disinfected between each use following medical-grade protocols. When delivered to your {location.city_name} home, everything will be clean, sanitized, and ready to use.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Do I need to be present for equipment pickup in {location.city_name}?</h3>
            <p className="text-gray-700">
              Ideally yes, but we understand that schedules can be complicated. We can arrange with you or a designated person in your {location.city_name} home for equipment pickup at a convenient time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPage = () => (
    <div className="page-preview contact-page">
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Contact Us in {location.city_name}</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Reach out to our {location.city_name}, {location.region_name} team for questions about {location.keyword}.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="mb-8">
              Our {location.city_name} team is ready to answer your questions and help you find the right recovery equipment for your needs.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-green-600">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Local Office</h3>
                  <p>{location.city_name} Medical Equipment Center<br />
                  123 Healing Street<br />
                  {location.city_name}, {location.region_name} 10001</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-green-600">📞</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Phone</h3>
                  <p>(555) 123-4567</p>
                  <p className="text-sm text-gray-500">Monday-Friday, 9am-5pm {location.region_name} time</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <span className="text-green-600">✉️</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p>{location.city_name.toLowerCase()}@facedownrecovery.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Your name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Your email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="Your phone number" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea className="w-full border border-gray-300 rounded-md px-3 py-2" rows={4} placeholder="How can we help with your recovery in {location.city_name}?"></textarea>
              </div>
              
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Our {location.city_name} Service Area</h2>
          <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
            [Map of {location.city_name} service area]
          </div>
        </div>
      </div>
    </div>
  );

  // Render the selected page based on index
  const renderPage = () => {
    switch (pageIndex) {
      case 0: return renderHomePage();
      case 1: return renderServicesPage();
      case 2: return renderAboutUsPage();
      case 3: return renderFAQPage();
      case 4: return renderContactPage();
      default: return renderHomePage();
    }
  };

  return (
    <div className="preview-container w-full">
      <div className="bg-green-50 px-4 py-2 text-sm font-medium border-b">
        Previewing: {pages[pageIndex].name} for {location.city_name}, {location.region_name}
      </div>
      <div className="w-full h-full overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
};

export default PagePreview;
