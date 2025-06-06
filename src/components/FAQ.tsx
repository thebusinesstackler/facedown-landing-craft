
import React from 'react';
import { Card } from '@/components/ui/card';
import { PlusCircle, MinusCircle } from 'lucide-react';
import SpintexHeading from './SpintexHeading';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  // FAQ data with spintex content
  const faqs = [
    {
      question: "How do I rent face-down recovery equipment?",
      answer: "{The process is simple|Renting is straightforward|It's easy to get started}! {Simply call us|Contact us|Reach out} at {our toll-free number|our customer service line} or {complete|fill out|submit} the {online form|request form on our website}. Our {team|specialists|recovery experts} will {guide you|assist you|help you} through the {entire process|selection process|rental procedure} and {answer|address|respond to} any {questions|concerns|queries} you may have."
    },
    {
      question: "What type of equipment do I need for my face-down recovery equipment in {location(city_name)}?",
      answer: "The equipment you need for your face-down recovery equipment in {location(city_name)} depends on your specific surgery and doctor's instructions. We provide ergonomic equipment such as recovery chairs, face-down pillows, and other supportive gear designed to assist you in maintaining the required face-down position. If you're unsure, contact us for personalized recommendations tailored to your recovery needs."
    },
    {
      question: "What is the rental period for face-down recovery equipment in {location(city_name)}?",
      answer: "{Our standard rental periods|We offer rental durations|Our typical rental timeframes} {range from|are typically|usually span} 7 to 14 days, {which covers|aligning with|matching} the {typical|average|standard} recovery period {prescribed by|recommended by|suggested by} most {doctors|physicians|ophthalmologists}. {However|That said|Nevertheless}, we {understand|recognize|know} that {each recovery|every healing journey|individual recovery} is {unique|different|personal}, so we offer {flexible|customizable|adjustable} rental {extensions|periods|timeframes} to {accommodate|meet|satisfy} your {specific|individual|particular} {needs|requirements|situation}."
    },
    {
      question: "How quickly can the equipment be delivered?",
      answer: "{We pride ourselves|We specialize|We excel} in {rapid|quick|fast} {delivery|shipping|fulfillment}. {With our express shipping|Through our expedited delivery|Using our priority shipping} option, {equipment|recovery gear|your order} can {arrive|be delivered|reach you} within {24-48 hours|1-2 business days|two days} of your {order confirmation|approved order|completed reservation}. {For urgent cases|In emergency situations|When time is critical}, {same-day|immediate|expedited} delivery {may be available|can be arranged|is possible} in the {{location(city_name)}|{location(region_name)}} area."
    },
    {
      question: "Is the equipment sanitized between rentals?",
      answer: "{Absolutely|Yes, definitely|Without question}! {Your safety|Patient safety|Health safety} is our {top priority|primary concern|main focus}. {All equipment|Each item|Every piece of gear} undergoes a {rigorous|thorough|comprehensive} {cleaning and sanitization|disinfection|sterilization} process {between rentals|after each use|before delivery}. Our {cleaning protocols|sanitization procedures|disinfection methods} {exceed|surpass|go beyond} medical-grade {standards|requirements|guidelines} to {ensure|guarantee|provide} you with {clean|sanitized|hygienic} equipment for your {recovery|healing|post-surgery period}."
    },
    {
      question: "Do you provide setup instructions?",
      answer: "{Yes|Absolutely|Of course}! {All rentals|Every equipment rental|Each order} {includes|comes with|provides} {detailed|comprehensive|clear} {setup instructions|user guides|instruction manuals}. {Additionally|Furthermore|Moreover}, our {team|staff|technicians} is {available|ready|on call} to {provide|offer|give} {setup assistance|guidance|support} over the phone. {For customers|For clients|If needed} in the {{location(city_name)}|local} area, we can also {arrange|schedule|provide} {in-home setup|in-person assistance|home setup service} for an {additional fee|extra charge|supplemental cost}."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SpintexHeading 
            options={[
              "Your Rent face-down recovery equipment Questions Answered in {location(city_name)}",
              "Frequently Asked Questions About Face-Down Recovery Equipment",
              "Common Questions About Face-Down Recovery Rentals"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6 text-gradient-medical"
            interval={5000}
          />
          <p className="text-gray-300 text-lg mb-12">
            Find answers to our most commonly asked questions below. Can't find what you're looking for? Contact us directly.
          </p>
        </div>
        
        <div className="grid gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index} className="bg-gray-800/50 overflow-hidden backdrop-blur-sm border border-gray-700 shadow-lg rounded-xl transition-all duration-300 hover:shadow-medical-green/20 hover:border-medical-green/30">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${index}`} className="border-0">
                  <AccordionTrigger 
                    className="py-6 px-6 text-xl font-medium text-left hover:no-underline group data-[state=open]:bg-medical-green/10 transition-all duration-300"
                  >
                    <span className="text-white group-hover:text-medical-green group-data-[state=open]:text-medical-green transition-colors flex-grow text-left">
                      {faq.question}
                    </span>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700/50 group-hover:bg-medical-green/20 group-data-[state=open]:bg-medical-green/30 transition-all duration-200 ml-4">
                      <PlusCircle className="h-5 w-5 text-medical-green shrink-0 transition-all duration-300 group-data-[state=closed]:flex group-data-[state=open]:hidden" />
                      <MinusCircle className="h-5 w-5 text-medical-green shrink-0 transition-all duration-300 group-data-[state=open]:flex group-data-[state=closed]:hidden" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 px-6 pb-6 data-[state=open]:animate-fadeIn">
                    <div className="bg-medical-green/5 p-5 rounded-lg border-l-4 border-medical-green mt-2">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
