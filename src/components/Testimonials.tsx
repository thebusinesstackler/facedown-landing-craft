
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

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

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-r from-medical-light/50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-medical-blue"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-medical-green"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-medical-blue"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-medical-blue/10 px-4 py-1.5 rounded-full text-medical-blue font-medium text-sm mb-4">
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
        
        <div className="max-w-5xl mx-auto">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="px-4 md:px-10"
          >
            <CarouselContent>
              {testimonials.map((testimonial, idx) => (
                <CarouselItem key={idx} className="sm:basis-full md:basis-1/2 lg:basis-1/2 p-1">
                  <div className="h-full">
                    <Card className="overflow-hidden h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-medical-light/20">
                      <CardContent className="p-8 h-full flex flex-col">
                        <div className="mb-6 flex justify-between items-center">
                          <Quote className="w-10 h-10 text-medical-blue/40" />
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                        
                        <blockquote className="text-gray-700 italic mb-8 flex-grow text-lg">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="mt-auto">
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
            <div className="flex items-center justify-center mt-8 gap-4">
              <CarouselPrevious className="relative static h-10 w-10 rounded-full border-2 border-medical-blue/30 hover:border-medical-blue transition-all bg-white/80" />
              <CarouselNext className="relative static h-10 w-10 rounded-full border-2 border-medical-blue/30 hover:border-medical-blue transition-all bg-white/80" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-16 text-center max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-medical-blue/5 to-white border border-medical-blue/10 shadow-md">
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
