
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-xl font-bold text-medical-blue">Face Down Recovery</span>
          </a>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="font-medium transition-colors hover:text-medical-blue">
            Equipment
          </a>
          <a href="#how-it-works" className="font-medium transition-colors hover:text-medical-blue">
            How It Works
          </a>
          <a href="#testimonials" className="font-medium transition-colors hover:text-medical-blue">
            Testimonials
          </a>
          <a href="#contact" className="font-medium transition-colors hover:text-medical-blue">
            Contact
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="hidden md:flex items-center text-medical-green"
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>800-XXX-XXXX</span>
          </Button>
          <Button className="bg-medical-blue hover:bg-medical-blue/90 text-white">
            Rent Equipment
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
