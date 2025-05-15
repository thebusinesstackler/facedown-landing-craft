
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactCTA: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-medical-blue to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Support Your Recovery?</h2>
          <p className="text-lg text-white/90 mb-8">
            Contact us today to arrange for your {"{keyword}"} equipment. Our specialists are ready to help you through every step of the process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-medical-blue hover:bg-white/90">
              <Phone className="mr-2 h-4 w-4" />
              Call (786) 592-0040
            </Button>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Order Now
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Nationwide Service</h3>
              <p className="text-white/80">
                We provide delivery and setup services across the entire United States.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-white/80">
                Our team is available around the clock to assist with any questions or concerns.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Quick Response</h3>
              <p className="text-white/80">
                We understand urgency and can often arrange next-day delivery when needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
