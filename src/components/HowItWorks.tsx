
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" 
      }
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-medical-light to-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-medical-dark mb-6 leading-tight">
            How Our Rental Process Works
          </h2>
          <p className="text-gray-600 text-xl">
            We make equipment rental simple so you can focus on recovery
          </p>
        </motion.div>
        
        <motion.div
          className="grid md:grid-cols-5 gap-6 lg:gap-10 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, idx) => (
            <motion.div 
              key={idx} 
              className="relative"
              variants={itemVariants}
            >
              <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full p-6 border-t-4 border-medical-green">
                <div className="absolute -top-4 -left-4 bg-medical-green w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {step.number}
                </div>
                
                <div className="text-center mt-4">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-2xl font-bold text-medical-dark mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </Card>
              
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-5 lg:-right-7 w-10 lg:w-14 h-0.5 bg-medical-green/50">
                  <div className="absolute -right-1 -top-1 w-3 h-3 border-t-2 border-r-2 border-medical-green/50 transform rotate-45"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
