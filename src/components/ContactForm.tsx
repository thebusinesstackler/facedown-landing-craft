import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import SpintexHeading from './SpintexHeading';
import BookingCalendar from './BookingCalendar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { sendOrderConfirmationEmail } from '@/utils/emailUtils';
import { format } from 'date-fns';
import { LocationData } from '@/utils/locationUtils';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  address: z.string().min(5, { message: "Please enter your full address." }),
  city: z.string().min(2, { message: "City is required." }),
  zipCode: z.string().min(5, { message: "Please enter a valid ZIP code." }),
});

const ContactForm: React.FC<ContactFormProps> = ({ locationData }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: defaultCity,
      zipCode: "",
    },
  });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      toast({
        title: "Delivery Date Selected",
        description: `You've selected ${format(date, 'EEEE, MMMM d, yyyy')} for your equipment delivery.`,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a delivery date before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await sendOrderConfirmationEmail({
        name: values.name,
        email: values.email,
        rentalPeriod: "Standard Rental",
        deliveryDate: format(selectedDate, 'yyyy-MM-dd'),
        address: values.address,
        city: values.city,
        state: defaultRegion,
        zipCode: values.zipCode
      });
      
      if (success) {
        toast({
          title: "Order Submitted Successfully!",
          description: `Your equipment will be delivered on ${format(selectedDate, 'EEEE, MMMM d, yyyy')}.`,
        });
        form.reset();
        setSelectedDate(undefined);
      } else {
        throw new Error("Failed to submit order");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
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
              "Schedule Your Equipment Delivery",
              "Book Your Recovery Equipment",
              "Select Your Delivery Date"
            ]}
            className="text-3xl md:text-5xl font-bold mb-6"
            interval={5000}
          />
          <p className="text-gray-300 text-lg">
            {"{Choose a date|Select when|Pick a day}"} for {"{your equipment delivery|when you need your equipment|setup of your recovery system}"} in {defaultCity}.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          <Card className="p-6 rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 md:col-span-3">
            <h3 className="text-xl font-medium text-gray-800 mb-6">Select Your Delivery Date</h3>
            <BookingCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
            
            <div className="mt-6 p-4 bg-medical-green/10 rounded-lg border border-medical-green/20">
              <h4 className="font-medium text-medical-green">Delivery Schedule:</h4>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>• Order Monday before 2PM: Delivered Wednesday</li>
                <li>• Order Tuesday: Delivered Thursday</li>
                <li>• Order Thursday: Delivered Monday</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200 md:col-span-2">
            <h3 className="text-xl font-medium text-gray-800 mb-6">Complete Your Order</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-white text-gray-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" className="bg-white text-gray-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Delivery Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" className="bg-white text-gray-800" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">City</FormLabel>
                        <FormControl>
                          <Input placeholder="Boca Raton" className="bg-white text-gray-800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="33432" className="bg-white text-gray-800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {selectedDate ? (
                  <div className="p-3 bg-medical-green/10 rounded-lg border border-medical-green/20 text-medical-green font-medium">
                    Delivery scheduled for: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-700">
                    Please select a delivery date from the calendar
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-medical-green hover:bg-medical-green/90"
                  disabled={isSubmitting || !selectedDate}
                >
                  {isSubmitting ? "Processing..." : "Submit Order"}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
        
        {/* Cities We Service Section */}
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-4 text-center">Cities We Service</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {servicedCities.map((location, index) => (
              <div key={index} className="p-3 bg-black/50 rounded-lg border border-gray-800 hover:border-medical-green transition-colors">
                <p className="font-medium">{location.city}</p>
                <p className="text-sm text-gray-400">{location.region}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
