
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LocationData } from '@/utils/locationUtils';

interface FAQProps {
  locationData?: LocationData;
}

const FAQ: React.FC<FAQProps> = ({ locationData }) => {
  const faqData = [
    {
      question: "How quickly can I get my face-down recovery equipment?",
      answer: "We typically deliver within 24-48 hours of your order confirmation. For urgent cases, same-day delivery may be available in select areas."
    },
    {
      question: "What's included in the rental package?",
      answer: "Our complete package includes adjustable face-down support cushions, positioning mirrors, massage table attachments, and detailed setup instructions. All equipment is thoroughly sanitized before delivery."
    },
    {
      question: "Do you provide setup assistance?",
      answer: "Yes! Our delivery team will set up all equipment and ensure you're comfortable with its use. We also provide 24/7 phone support throughout your rental period."
    },
    {
      question: "What if I need the equipment longer than expected?",
      answer: "No problem! You can easily extend your rental period by contacting us. We offer flexible rental terms to accommodate your recovery timeline."
    },
    {
      question: "Is the equipment covered by insurance?",
      answer: "Many insurance plans cover medical equipment rentals. We can provide documentation to help with your insurance claims process."
    },
    {
      question: "What happens if something breaks during my rental?",
      answer: "All equipment is covered under our rental agreement. We'll replace any damaged items at no additional cost and can often do so within hours."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get answers to common questions about our face-down recovery equipment rental service.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                  <span className="font-semibold text-medical-dark">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
