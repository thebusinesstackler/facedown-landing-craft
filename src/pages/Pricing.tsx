import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import PricingCard from '@/components/PricingCard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address is required" }),
  rentPeriod: z.enum(['1week', '2weeks', '3weeks']),
  additionalItems: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Pricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('1week');
  const [additionalItems, setAdditionalItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      rentPeriod: "1week",
      additionalItems: [],
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Get details about the selected plan
      const planDetails = {
        '1week': {title: '1 Week Rental', price: 259},
        '2weeks': {title: '2 Week Rental', price: 320},
        '3weeks': {title: '3 Week Rental', price: 380},
      }[values.rentPeriod];
      
      // Format today's date to use as delivery date
      const deliveryDate = format(new Date(), 'yyyy-MM-dd');
      
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          subject: 'New Face Down Recovery Equipment Order',
          message: `New order received from pricing page: ${planDetails.title}`,
          orderDetails: {
            rentalPeriod: planDetails.title,
            price: planDetails.price,
            deliveryDate: deliveryDate,
            address: values.address,
            additionalItems: additionalItems.join(', ')
          },
          resendApiKey: 're_VcM1Sk1a_6B9CNbs16KsuSWtcQzTY2Hzp',
          isOrderConfirmation: true
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send order');
      }
      
      toast({
        title: "Order Submitted Successfully!",
        description: "We've sent a confirmation to your email address.",
      });
      
      // Also notify the support team
      await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'System Notification',
          email: 'notifications@facedownrecoveryequipment.com',
          subject: `New Order: ${values.fullName}`,
          message: `
            New equipment rental order received:
            
            Customer: ${values.fullName}
            Email: ${values.email}
            Phone: ${values.phone}
            
            Package: ${planDetails.title}
            Price: $${planDetails.price}
            
            Delivery Address: ${values.address}
            Additional Items: ${additionalItems.join(', ') || 'None'}
          `,
          resendApiKey: 're_VcM1Sk1a_6B9CNbs16KsuSWtcQzTY2Hzp',
          isOrderConfirmation: false
        }),
      });
      
      form.reset();
      setAdditionalItems([]);
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Error Processing Order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
    form.setValue("rentPeriod", plan as "1week" | "2weeks" | "3weeks");
  };

  const handleAdditionalItem = (item: string) => {
    if (additionalItems.includes(item)) {
      setAdditionalItems(additionalItems.filter(i => i !== item));
    } else {
      setAdditionalItems([...additionalItems, item]);
    }
    form.setValue("additionalItems", additionalItems);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-b from-medical-light to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Select Your Recovery Equipment Rental Plan
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the rental duration that best fits your recovery needs. All plans include delivery, setup, and pickup.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Choose Desired Plan</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <PricingCard
                  title="1 Week Rental"
                  price={259.00}
                  selected={selectedPlan === '1week'}
                  onSelect={() => handlePlanSelection('1week')}
                  features={[
                    "Complete equipment set",
                    "Free delivery & setup",
                    "24/7 support",
                    "Pickup included"
                  ]}
                />
                <PricingCard
                  title="2 Week Rental"
                  price={320.00}
                  selected={selectedPlan === '2weeks'}
                  onSelect={() => handlePlanSelection('2weeks')}
                  features={[
                    "Complete equipment set",
                    "Free delivery & setup",
                    "24/7 support", 
                    "Pickup included",
                    "Extended rental discount"
                  ]}
                />
                <PricingCard
                  title="3 Week Rental"
                  price={380.00}
                  selected={selectedPlan === '3weeks'}
                  onSelect={() => handlePlanSelection('3weeks')}
                  features={[
                    "Complete equipment set",
                    "Free delivery & setup",
                    "24/7 support",
                    "Pickup included",
                    "Maximum rental discount"
                  ]}
                />
              </div>

              <Card className="mb-12">
                <CardHeader>
                  <CardTitle>Additional Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="headrest-covers" 
                        className="h-4 w-4 rounded border-gray-300 text-medical-green focus:ring-medical-green"
                        checked={additionalItems.includes('headrest')}
                        onChange={() => handleAdditionalItem('headrest')}
                      />
                      <label htmlFor="headrest-covers">Extra Headrest Covers - $10.00</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="pillows" 
                        className="h-4 w-4 rounded border-gray-300 text-medical-green focus:ring-medical-green"
                        checked={additionalItems.includes('pillows')}
                        onChange={() => handleAdditionalItem('pillows')}
                      />
                      <label htmlFor="pillows">Support Pillows - $15.00</label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
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
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
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
                              <FormLabel>Delivery Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St, Boca Raton, FL" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full md:w-auto bg-medical-green hover:bg-medical-green/90 text-white"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : (
                            <>Complete Order <ArrowRight className="ml-2" /></>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
