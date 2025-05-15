
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-dark mb-4">What Our Patients Say</h2>
          <p className="text-gray-600 text-lg">
            Read about real experiences from patients who used our equipment during their recovery.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-8 bg-gradient-to-tr from-medical-light to-white">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="mt-6">
                  <p className="font-bold text-medical-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're proud to have helped thousands of patients across the nation with their vitrectomy recovery. Our equipment is trusted by both patients and medical professionals.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
