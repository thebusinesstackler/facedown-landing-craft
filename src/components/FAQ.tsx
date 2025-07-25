
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
  const faqItems = [
    {
      question: "How does the rental process work?",
      answer: "Simply select your rental period, provide your information, and we'll deliver the recovery equipment to your door. After your rental period, we'll pick it up - no hassle on your end."
    },
    {
      question: "What equipment is included?",
      answer: "Our recovery packages include professional-grade cold therapy machines, compression devices, and all necessary accessories for optimal post-surgery recovery."
    },
    {
      question: "How quickly can you deliver?",
      answer: "We typically deliver within 24-48 hours of your order confirmation. Emergency same-day delivery may be available in select areas."
    },
    {
      question: "What if I need the equipment longer than expected?",
      answer: "No problem! You can extend your rental period by contacting our support team. We'll adjust your billing accordingly."
    },
    {
      question: "Is the equipment sanitized?",
      answer: "Absolutely. All equipment is thoroughly sanitized and inspected between each rental to ensure the highest safety standards."
    },
    {
      question: "What happens if something breaks?",
      answer: "Don't worry - normal wear and tear is covered. If there's an issue with the equipment, contact us immediately and we'll replace it at no charge."
    },
    {
      question: "Do you work with insurance?",
      answer: "Many insurance plans cover durable medical equipment rentals. We can provide documentation to help with your insurance claim."
    },
    {
      question: "What areas do you serve?",
      answer: locationData 
        ? `We currently serve ${locationData.city_name}, ${locationData.region_name} and surrounding areas. Contact us to confirm delivery availability to your specific location.`
        : "We serve many areas across the United States. Contact us to confirm delivery availability to your specific location."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  {item.answer}
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
