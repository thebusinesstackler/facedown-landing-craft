
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://i.imgur.com/2kCVmzN.png" 
              alt="Face Down Recovery Logo" 
              className="h-12 mr-2 transition-opacity hover:opacity-90"
            />
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className={scrolled ? 'text-medical-blue' : 'text-white'}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link 
            to="/#how-it-works" 
            className={`font-medium transition-all hover:text-medical-green relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-medical-green after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            How It Works
          </Link>
          <Link 
            to="/pricing" 
            className={`font-medium transition-all hover:text-medical-green relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-medical-green after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            Pricing
          </Link>
          <Link 
            to="/#testimonials" 
            className={`font-medium transition-all hover:text-medical-green relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-medical-green after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            Testimonials
          </Link>
          <Link 
            to="/#contact" 
            className={`font-medium transition-all hover:text-medical-green relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-medical-green after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}
          >
            Contact
          </Link>
        </nav>
        
        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button 
            variant="ghost" 
            className={`flex items-center ${
              scrolled 
                ? 'text-medical-blue hover:bg-medical-blue/10' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Phone className="mr-2 h-4 w-4" />
            <span>(786) 592-0040</span>
          </Button>
          <Link to="/pricing">
            <Button className="bg-medical-green hover:bg-gradient-green text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
              Rent Equipment
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md border-t border-gray-100 p-4 z-50 animate-slide-down">
          <nav className="flex flex-col space-y-3 pb-4">
            <Link 
              to="/#how-it-works" 
              className="px-4 py-2 text-gray-800 hover:text-medical-green hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className="px-4 py-2 text-gray-800 hover:text-medical-green hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/#testimonials" 
              className="px-4 py-2 text-gray-800 hover:text-medical-green hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link 
              to="/#contact" 
              className="px-4 py-2 text-gray-800 hover:text-medical-green hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-gray-100">
              <Button className="w-full bg-medical-green hover:bg-medical-green/90 text-white">
                <Phone className="mr-2 h-4 w-4" />
                Call (786) 592-0040
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
