
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "The equipment made all the difference in my recovery. Being able to maintain the face-down position comfortably helped me get through the challenging recovery period.",
      name: "Michael R.",
      location: "Dallas, TX",
      rating: 5
    },
    {
      quote: "Your sleep support system was a lifesaver! I was worried about how I would sleep face-down for so long, but the equipment made it possible. Thank you!",
      name: "Patricia L.",
      location: "Chicago, IL",
      rating: 5
    },
    {
      quote: "The delivery was prompt, and the setup team was very helpful in showing me how to use everything. The equipment was clean and in perfect condition.",
      name: "Robert S.",
      location: "Atlanta, GA",
      rating: 5
    },
    {
      quote: "I can't imagine going through vitrectomy recovery without this equipment. Worth every penny for the comfort and peace of mind.",
      name: "Susan T.",
      location: "Phoenix, AZ",
      rating: 5
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-medical-light/30 via-white/80 to-medical-light/30 z-0" />
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-medical-blue/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-medical-green/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-medical-blue/5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-95">
          <div className="inline-flex items-center justify-center gap-2 bg-medical-blue/10 px-4 py-1.5 rounded-full text-medical-blue font-medium text-sm mb-4 backdrop-blur-sm">
            <Star className="w-4 h-4" />
            <span>Patient Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-medical-dark mb-6">
            What Our Patients Say
          </h2>
          
          <p className="text-gray-600 text-lg">
            Read about real experiences from patients who used our equipment during their recovery journey.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <Carousel 
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
            onSelect={(index) => setActiveIndex(index)}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, idx) => (
                <CarouselItem key={idx} className="pl-2 md:pl-4 sm:basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card className={`h-full overflow-hidden border-0 transition-all duration-500 backdrop-blur-sm ${
                      activeIndex === idx 
                        ? 'shadow-xl scale-105 bg-gradient-to-br from-white/90 to-medical-light/50' 
                        : 'shadow-lg bg-gradient-to-br from-white/70 to-medical-light/30'
                    }`}>
                      <CardContent className="p-6 md:p-8 h-full flex flex-col">
                        <div className="mb-4 flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        
                        <ScrollArea className="flex-grow max-h-56">
                          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                            {testimonial.quote}
                          </p>
                        </ScrollArea>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100/50">
                          <div className="text-right">
                            <p className="font-bold text-medical-dark">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-10 gap-4">
              <CarouselPrevious className="relative static h-10 w-10 rounded-full bg-medical-blue/10 hover:bg-medical-blue/20 text-medical-blue border-0 backdrop-blur-sm transition-colors" />
              <div className="flex gap-1">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx ? 'bg-medical-blue w-6' : 'bg-medical-blue/30'
                    }`}
                    onClick={() => {
                      const carouselApi = document.querySelector('[data-radix-carousel-viewport]')?.__embedded_carousel__;
                      if (carouselApi) {
                        carouselApi.scrollTo(idx);
                      }
                    }}
                  />
                ))}
              </div>
              <CarouselNext className="relative static h-10 w-10 rounded-full bg-medical-blue/10 hover:bg-medical-blue/20 text-medical-blue border-0 backdrop-blur-sm transition-colors" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-16 text-center max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-medical-blue/5 to-white border border-medical-blue/10 shadow-md backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-medical-dark mb-4">
            Join thousands of satisfied patients nationwide
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're proud to have helped thousands of patients across the nation with their vitrectomy recovery. Our equipment is trusted by both patients and medical professionals for comfortable face-down recovery solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
