
import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Contact Us",
      description: "Call our team or fill out our online form. We'll help determine what equipment you need for your specific recovery plan.",
      icon: "📞"
    },
    {
      number: "02",
      title: "Schedule Delivery",
      description: "We coordinate with you and your medical provider to ensure timely delivery before your surgery date.",
      icon: "📅"
    },
    {
      number: "03",
      title: "Equipment Setup",
      description: "Our specialists deliver and set up your equipment, providing demonstrations for proper use.",
      icon: "🛠️"
    },
    {
      number: "04",
      title: "Recovery Period",
      description: "Use your equipment for your prescribed face-down period with our 24/7 support available.",
      icon: "🏥"
    },
    {
      number: "05",
      title: "Equipment Pickup",
      description: "Once your recovery period is complete, we'll schedule a convenient pickup time.",
      icon: "🚚"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-medical-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark mb-4">How Our Rental Process Works</h2>
          <p className="text-gray-600 text-lg">
            We make the equipment rental process simple so you can focus on your recovery.
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line (visible on medium screens and up) */}
          <div className="hidden md:block absolute top-1/4 left-1/2 w-0.5 h-3/4 -translate-x-1/2 bg-medical-blue/30"></div>
          
          <div className="space-y-12 relative">
            {steps.map((step, idx) => (
              <div key={idx} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className="text-sm font-bold text-medical-green mb-2">STEP {step.number}</div>
                  <h3 className="text-2xl font-bold text-medical-dark mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg z-10 border-2 border-medical-blue text-2xl">
                  {step.icon}
                </div>
                
                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
