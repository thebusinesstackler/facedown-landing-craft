
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Pagination,
  PaginationContent,
  PaginationItem 
} from '@/components/ui/pagination';
import type { UseEmblaCarouselType } from 'embla-carousel-react';

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
  const [api, setApi] = useState<UseEmblaCarouselType[1] | null>(null);

  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section id="testimonials" className="py-20 relative w-full overflow-hidden bg-gradient-to-b from-white via-medical-light/10 to-white">
      {/* Full-width background with modern gradient */}
      <div className="absolute inset-0 bg-medical-light/5 z-0" />
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-medical-blue/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-medical-green/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-medical-blue/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-medical-blue/10 px-4 py-1.5 rounded-full text-medical-blue font-medium text-sm mb-4 backdrop-blur-sm">
            <Star className="w-4 h-4" />
            <span>Patient Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-medical-dark mb-6 tracking-tight">
            What Our Patients Say
          </h2>
          
          <p className="text-gray-600 text-lg">
            Read about real experiences from patients who used our equipment during their recovery journey.
          </p>
        </div>
        
        <div className="w-full">
          <Carousel 
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, idx) => (
                <CarouselItem key={idx} className="pl-2 md:pl-4 sm:basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="h-full p-1">
                    <Card 
                      className={`h-full overflow-hidden border-0 transition-all duration-500 backdrop-blur-sm group
                        ${activeIndex === idx 
                          ? 'shadow-xl scale-105 bg-white' 
                          : 'shadow-lg hover:shadow-xl hover:scale-[1.02] bg-white/80'
                        }`}
                    >
                      <CardContent className="p-6 md:p-8 h-full flex flex-col relative">
                        <Quote className="absolute top-6 right-6 w-10 h-10 text-medical-blue/10 group-hover:text-medical-blue/20 transition-all duration-500" />
                        
                        <div className="mb-4 flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        
                        <ScrollArea className="flex-grow max-h-56 pr-4">
                          <p className="text-gray-700 mb-6 text-lg leading-relaxed relative">
                            &ldquo;{testimonial.quote}&rdquo;
                          </p>
                        </ScrollArea>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="text-right">
                            <p className="font-bold text-medical-dark group-hover:text-medical-blue transition-colors duration-300">{testimonial.name}</p>
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
              <CarouselPrevious className="relative static h-10 w-10 rounded-full bg-medical-blue/10 hover:bg-medical-blue/20 text-medical-blue border-0 backdrop-blur-sm transition-all duration-300 hover:scale-110" />
              <Pagination className="inline-flex">
                <PaginationContent>
                  {testimonials.map((_, idx) => (
                    <PaginationItem key={idx} className="mx-1">
                      <button
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          activeIndex === idx ? 'bg-medical-blue w-8' : 'bg-medical-blue/30 hover:bg-medical-blue/50'
                        }`}
                        onClick={() => api?.scrollTo(idx)}
                      />
                    </PaginationItem>
                  ))}
                </PaginationContent>
              </Pagination>
              <CarouselNext className="relative static h-10 w-10 rounded-full bg-medical-blue/10 hover:bg-medical-blue/20 text-medical-blue border-0 backdrop-blur-sm transition-all duration-300 hover:scale-110" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-16 text-center max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-medical-blue/5 to-medical-light/50 border border-medical-blue/10 shadow-md backdrop-blur-sm hover:shadow-lg transition-all duration-300">
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
