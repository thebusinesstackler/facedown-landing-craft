
import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import SpintexHeading from './SpintexHeading';

const ContactForm: React.FC = () => {
  useEffect(() => {
    // Load the form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="contact" className="py-20 bg-[#1F1F1F] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <SpintexHeading 
            options={[
              "Contact Us for Face-Down Recovery Equipment",
              "Get in Touch About Recovery Equipment",
              "Reach Out for Recovery Support"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6"
            interval={5000}
          />
          <p className="text-gray-300 text-lg">
            {"{Fill out the form below|Contact us today|Reach out now}"} for {"{personalized recovery solutions|customized equipment|expert assistance}"} in Boca Raton.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="bg-black border border-gray-800 p-1 rounded-xl overflow-hidden">
            <div className="aspect-video h-[721px]">
              <iframe
                src="https://api.leadconnectorhq.com/widget/form/StF1ENbPXhNOQkDE2cQW"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                id="inline-StF1ENbPXhNOQkDE2cQW" 
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Facedown Recovery Equipment - pSEO Footer"
                data-height="721"
                data-layout-iframe-id="inline-StF1ENbPXhNOQkDE2cQW"
                data-form-id="StF1ENbPXhNOQkDE2cQW"
                title="Facedown Recovery Equipment - pSEO Footer"
              />
            </div>
          </Card>

          <div className="relative h-full min-h-[500px] rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114304.40083200874!2d-80.17553029943376!3d26.368296151218453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8e3c5a9dae6bd%3A0x77a929f150d7516e!2sBoca%20Raton%2C%20FL!5e0!3m2!1sen!2sus!4v1716644596117!5m2!1sen!2sus" 
              className="absolute inset-0 w-full h-full border-0 rounded-xl"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
