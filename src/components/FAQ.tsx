
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
      question: "How quickly can I get the recovery equipment?",
      answer: "We offer same-day or next-day delivery in most areas. Once you place your order, we'll contact you to schedule a convenient delivery time."
    },
    {
      question: "Is the equipment sanitized between uses?",
      answer: "Yes, all equipment is thoroughly sanitized and inspected before each rental. We follow strict medical-grade cleaning protocols to ensure your safety."
    },
    {
      question: "What if I need to extend my rental period?",
      answer: "You can extend your rental period by contacting us before your current rental expires. We'll arrange pickup and delivery for the extended period."
    },
    {
      question: "Do you provide setup assistance?",
      answer: "Yes, our delivery team will set up the equipment and provide basic instructions. We also include detailed setup guides and 24/7 support."
    },
    {
      question: "What happens if the equipment breaks?",
      answer: "If equipment malfunctions due to normal use, we'll replace it at no charge. We provide 24/7 technical support and emergency replacement service."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order up to 24 hours before scheduled delivery for a full refund. Cancellations within 24 hours may incur a small processing fee."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
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
