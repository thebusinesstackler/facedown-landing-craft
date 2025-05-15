
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "The equipment made all the difference in my recovery. Being able to maintain the face-down position comfortably helped me get through the challenging recovery period.",
      name: "Michael R.",
      location: "Dallas, TX",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "Your sleep support system was a lifesaver! I was worried about how I would sleep face-down for so long, but the equipment made it possible. Thank you!",
      name: "Patricia L.",
      location: "Chicago, IL",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=2"
    },
    {
      quote: "The delivery was prompt, and the setup team was very helpful in showing me how to use everything. The equipment was clean and in perfect condition.",
      name: "Robert S.",
      location: "Atlanta, GA",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=3"
    },
    {
      quote: "I can't imagine going through vitrectomy recovery without this equipment. Worth every penny for the comfort and peace of mind.",
      name: "Susan T.",
      location: "Phoenix, AZ",
      rating: 5,
      image: "https://i.pravatar.cc/150?img=4"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-medical-light/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-medical-blue/10 px-4 py-1.5 rounded-full text-medical-blue font-medium text-sm mb-4">
            <Star className="w-4 h-4" />
            <span>{"{Patient|Customer|Client}"} Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-medical-dark mb-6">
            {"{What Our Patients Say|Hear From Our Patients|Patient Success Stories}"}
          </h2>
          
          <p className="text-gray-600 text-lg">
            {"{Read about real experiences|Discover authentic stories|See what patients are saying}"} from {"{patients|individuals|people}"} who used our equipment during their {"{recovery|healing journey|post-surgery period}"}.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
              <CardContent className="p-8 bg-white h-full flex flex-col">
                <div className="mb-6">
                  <Quote className="w-10 h-10 text-medical-blue/20" />
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 italic mb-6 flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="mt-6 flex items-center">
                  <Avatar className="h-12 w-12 border-2 border-medical-blue/20">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback className="bg-medical-blue/10 text-medical-blue">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold text-medical-dark">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center max-w-4xl mx-auto bg-medical-blue/5 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-medical-dark mb-4">
            {"{Join|Be part of} thousands of {satisfied|happy} patients nationwide"}
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {"{We're proud|We're honored|It's our privilege}"} to have helped thousands of patients across the nation with their vitrectomy recovery. Our equipment is {"{trusted by|recommended by|chosen by}"} both patients and medical professionals for {"{reliable|effective|comfortable}"} face-down recovery solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
