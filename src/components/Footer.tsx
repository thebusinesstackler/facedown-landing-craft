
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-medical-dark text-white/80 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Face Down Recovery</h3>
            <p className="mb-4">
              Specialized equipment rental for vitrectomy patients nationwide.
            </p>
            <div className="text-sm">
              <p>CALL US: 800-XXX-XXXX</p>
              <p>EMAIL: info@facedownrecoveryequipment.com</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Equipment</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Face-Down Chairs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mirror Systems</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sleep Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rental Process</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Physicians</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Service Areas</h3>
            <p className="mb-2">
              We provide nationwide delivery and setup services for your convenience.
            </p>
            <a href="#" className="text-medical-blue hover:underline">View Coverage Map</a>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-sm text-white/60">
          <div className="flex flex-col md:flex-row justify-between">
            <p>&copy; 2025 Face Down Recovery Equipment. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
