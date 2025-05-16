
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SpintexHeading from './SpintexHeading';
import BookingCalendar from './BookingCalendar';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }).optional(),
  bestContactTime: z.enum(['morning', 'afternoon', 'evening']).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  
  // Define a default city name to use instead of the template variable
  const defaultCity = "Boca Raton";
  const defaultRegion = "Florida";

  // List of cities serviced - could be dynamically loaded from a data source
  const servicedCities = [
    { city: defaultCity, region: defaultRegion, latitude: 26.3683, longitude: -80.1289 },
    { city: "Miami", region: defaultRegion, latitude: 25.7617, longitude: -80.1918 },
    { city: "Fort Lauderdale", region: defaultRegion, latitude: 26.1224, longitude: -80.1373 },
    { city: "West Palm Beach", region: defaultRegion, latitude: 26.7153, longitude: -80.0534 },
    { city: "Delray Beach", region: defaultRegion, latitude: 26.4615, longitude: -80.0728 }
  ];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      subject: "",
      bestContactTime: "morning",
    }
  });

  const nextStep = () => {
    if (step === 1) {
      const nameValid = form.trigger("name");
      const emailValid = form.trigger("email");
      const phoneValid = form.trigger("phone");
      
      if (nameValid && emailValid && phoneValid) {
        setStep(2);
      }
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const onSubmit = async (data: FormValues) => {
    if (!selectedDate) {
      toast({
        title: "Delivery Date Required",
        description: "Please select a delivery date for your equipment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          subject: data.subject || 'Contact Form Submission',
          bestContactTime: data.bestContactTime || 'morning',
          deliveryDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          resendApiKey: 're_VcM1Sk1a_6B9CNbs16KsuSWtcQzTY2Hzp',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
      setSelectedDate(undefined);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-[#1F1F1F] text-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
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
            {"{Fill out the form below|Contact us today|Reach out now}"} for {"{personalized recovery solutions|customized equipment|expert assistance}"} in {defaultCity}.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="bg-black border border-gray-800 p-6 rounded-xl overflow-hidden w-full shadow-md">
            {isSubmitted ? (
              <div className="text-center py-16">
                <div className="bg-medical-green/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-medical-green" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
                <p className="text-gray-300 mb-8">
                  Your order has been received. We'll prepare your equipment for delivery on your requested date.
                </p>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep(1);
                  }}
                  variant="outline" 
                  className="border-medical-green text-medical-green hover:bg-medical-green/10"
                >
                  Place Another Order
                </Button>
              </div>
            ) : (
              <>
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex flex-col items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        step >= num ? 'bg-medical-green text-white' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {step > num ? <Check size={18} /> : num}
                      </div>
                      <span className={`text-sm mt-2 ${step >= num ? 'text-gray-200' : 'text-gray-400'}`}>
                        {num === 1 && 'Your Info'}
                        {num === 2 && 'Message'}
                        {num === 3 && 'Schedule'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Personal Information */}
                    {step === 1 && (
                      <>
                        <h3 className="text-xl font-medium text-white mb-4">Your Information</h3>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="your.email@example.com" 
                                    type="email"
                                    className="bg-gray-900 border-gray-700 text-white" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-300">Phone</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="(555) 123-4567" 
                                    className="bg-gray-900 border-gray-700 text-white" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="bestContactTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Best time to contact you</FormLabel>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div 
                                  className={`cursor-pointer border rounded-lg p-3 text-center transition-colors ${
                                    field.value === 'morning' 
                                      ? 'border-medical-green bg-medical-green/10 text-medical-green' 
                                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                                  }`}
                                  onClick={() => form.setValue("bestContactTime", "morning")}
                                >
                                  Morning
                                </div>
                                <div 
                                  className={`cursor-pointer border rounded-lg p-3 text-center transition-colors ${
                                    field.value === 'afternoon' 
                                      ? 'border-medical-green bg-medical-green/10 text-medical-green' 
                                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                                  }`}
                                  onClick={() => form.setValue("bestContactTime", "afternoon")}
                                >
                                  Afternoon
                                </div>
                                <div 
                                  className={`cursor-pointer border rounded-lg p-3 text-center transition-colors ${
                                    field.value === 'evening' 
                                      ? 'border-medical-green bg-medical-green/10 text-medical-green' 
                                      : 'border-gray-700 text-gray-300 hover:border-gray-500'
                                  }`}
                                  onClick={() => form.setValue("bestContactTime", "evening")}
                                >
                                  Evening
                                </div>
                              </div>
                            </FormItem>
                          )}
                        />
                                                
                        <div className="mt-8 flex justify-end">
                          <Button 
                            type="button" 
                            onClick={nextStep} 
                            className="bg-medical-green hover:bg-medical-green/90 text-white"
                          >
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Step 2: Message Information */}
                    {step === 2 && (
                      <>
                        <h3 className="text-xl font-medium text-white mb-4">Your Message</h3>
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Subject</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="What is your inquiry about?" 
                                  className="bg-gray-900 border-gray-700 text-white" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us about your recovery needs..." 
                                  className="bg-gray-900 border-gray-700 text-white min-h-[120px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                        
                        <div className="mt-8 flex justify-between">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="bg-medical-green hover:bg-medical-green/90 text-white"
                          >
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Step 3: Booking Calendar */}
                    {step === 3 && (
                      <>
                        <h3 className="text-xl font-medium text-white mb-4">Schedule Your Equipment Delivery</h3>
                        <BookingCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
                        
                        <div className="mt-8 flex justify-between">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                          </Button>
                          
                          <Button 
                            type="submit" 
                            disabled={isSubmitting || !selectedDate}
                            className="bg-medical-green hover:bg-medical-green/90 text-white"
                          >
                            {isSubmitting ? (
                              "Placing Order..."
                            ) : (
                              <>
                                Place Order <Send className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {!selectedDate && (
                          <p className="text-yellow-400 text-sm mt-2 text-center">
                            Please select a delivery date to continue
                          </p>
                        )}
                      </>
                    )}
                  </form>
                </Form>
              </>
            )}
          </Card>

          <div className="flex flex-col space-y-6">
            {/* Map */}
            <div className="relative rounded-xl overflow-hidden h-[350px]">
              <iframe 
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114304.40083200874!2d-80.17553029943376!3d26.368296151218453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d8e3c5a9dae6bd%3A0x77a929f150d7516e!2${defaultCity}%2C%20${defaultRegion}!5e0!3m2!1sen!2sus!4v1716644596117!5m2!1sen!2sus`}
                className="absolute inset-0 w-full h-full border-0 rounded-xl"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            {/* Cities We Service Section */}
            <div className="bg-black/30 p-6 rounded-xl border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Cities We Service</h3>
              <div className="mb-4">
                <p className="text-gray-300">We service {defaultCity} and surrounding areas in {defaultRegion}.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {servicedCities.map((location, index) => (
                  <div key={index} className="p-3 bg-black/50 rounded-lg border border-gray-800 hover:border-medical-green transition-colors">
                    <p className="font-medium">{location.city}</p>
                    <p className="text-sm text-gray-400">{location.region}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Recovery in {defaultCity} made easy - we provide equipment delivery and setup throughout {defaultRegion} and surrounding areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
