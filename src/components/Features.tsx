
import React from 'react';
import { Check } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      title: "Face-Down Chair",
      description: "Ergonomically designed chairs that provide proper support while maintaining the required face-down position.",
      image: "https://images.unsplash.com/photo-1595034487820-95566d190335?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Face-Down Mirror",
      description: "Special mirror systems that allow you to watch TV or interact with family while keeping your head in the proper position.",
      image: "https://images.unsplash.com/photo-1583912487465-3bdc63473d52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Sleep Support System",
      description: "Specially designed pillows and support frames that help you maintain the face-down position while sleeping comfortably.",
      image: "https://images.unsplash.com/photo-1576013551627-0ae1be0dfac6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const benefits = [
    "FDA-approved medical equipment",
    "Clean, sanitized, and fully-inspected",
    "Nationwide delivery & setup",
    "Easy rental process",
    "Physician recommended",
    "24/7 customer support"
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark mb-4">Specialized Recovery Equipment</h2>
          <p className="text-gray-600 text-lg">
            Our medical-grade equipment is designed specifically to support your face-down recovery after vitrectomy surgery.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-medical-light rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105">
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-medical-dark mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-medical-blue/5 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-medical-dark mb-6">Why Choose Our Equipment?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="mr-3 mt-1 bg-medical-green rounded-full p-1">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-xl font-bold text-medical-dark mb-4">Doctor Recommended</h4>
              <p className="text-gray-600 mb-4">
                Our equipment is recommended by ophthalmologists nationwide to ensure proper positioning during your recovery period.
              </p>
              <blockquote className="border-l-4 border-medical-green pl-4 italic text-gray-600">
                "Proper face-down positioning is critical for successful recovery after vitrectomy surgery. Quality equipment makes all the difference for patient comfort and compliance."
              </blockquote>
              <div className="mt-3 text-sm text-right text-gray-500">- Dr. Sarah Johnson, Ophthalmologist</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
