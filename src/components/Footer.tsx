
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-medical-dark to-black text-white/90 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-bold">Face<span className="text-medical-green">Down</span> Recovery</h3>
            <p className="text-gray-300 leading-relaxed">
              Specialized equipment rental for vitrectomy patients nationwide, providing comfort during your recovery journey.
            </p>
            <div className="flex flex-col space-y-2 text-gray-300">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-medical-green" />
                <span className="hover:text-white transition-colors">800-XXX-XXXX</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-medical-green" />
                <span className="hover:text-white transition-colors">info@facedownrecoveryequipment.com</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2">Equipment</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Face-Down Chairs
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Mirror Systems
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Sleep Support
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Accessories
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Rental Process
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="#" className="flex items-center text-gray-300 hover:text-medical-green transition-colors">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  For Physicians
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold border-b border-white/10 pb-2">Service Areas</h3>
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-medical-green mr-2 mt-1 flex-shrink-0" />
              <p className="text-gray-300">
                We provide nationwide delivery and setup services for your convenience, including express options for urgent needs.
              </p>
            </div>
            <Link to="#" className="inline-block text-medical-green hover:text-medical-green/80 underline underline-offset-4">
              View Coverage Map
            </Link>
            
            <div className="pt-4">
              <h4 className="text-white text-sm font-medium mb-3">Connect With Us</h4>
              <div className="flex space-x-4">
                <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-medical-green hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-medical-green hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-medical-green hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link to="#" className="bg-white/10 p-2 rounded-full hover:bg-medical-green hover:text-white transition-colors">
                  <Linkedin className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-sm text-white/60 flex flex-wrap justify-between">
          <p>&copy; 2025 Face Down Recovery Equipment. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
