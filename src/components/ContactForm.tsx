import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { sendEmail } from '@/utils/emailUtils';
import { LocationData } from '@/utils/locationUtils';

interface ContactFormProps {
  locationData?: LocationData;
}

const ContactForm: React.FC<ContactFormProps> = ({ locationData }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !message) {
      toast("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await sendEmail({
        name,
        email,
        phone,
        message,
        location: locationData ? `${locationData.city_name}, ${locationData.region_name}` : 'N/A'
      });
      toast.success("Your message has been sent!");
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error("Email sending error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-form" className="py-12 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold">Get in Touch</CardTitle>
            <CardDescription>We'd love to hear from you!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div>
                <Input 
                  type="email" 
                  placeholder="Your Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div>
                <Input 
                  type="tel" 
                  placeholder="Your Phone Number" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>
              <div>
                <Textarea 
                  placeholder="Your Message" 
                  rows={4} 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                />
              </div>
              <CardFooter>
                <Button disabled={loading} className="w-full bg-medical-blue text-white hover:bg-medical-blue/90">
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactForm;
