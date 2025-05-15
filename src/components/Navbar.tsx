
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Face Down Recovery</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/#features" className="font-medium transition-colors hover:text-primary">
            Equipment
          </Link>
          <Link to="/#how-it-works" className="font-medium transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link to="/pricing" className="font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link to="/#testimonials" className="font-medium transition-colors hover:text-primary">
            Testimonials
          </Link>
          <Link to="/#contact" className="font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="hidden md:flex items-center text-medical-green"
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>800-XXX-XXXX</span>
          </Button>
          <Link to="/pricing">
            <Button className="bg-medical-green hover:bg-medical-green/90 text-white">
              Rent Equipment
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
