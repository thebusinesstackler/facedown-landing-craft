import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, getDay } from 'date-fns';
import { saveCustomerOrder, sendOrderEmail } from '@/utils/supabaseOrderUtils';

const MultiStepOrderForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  
  // Calculate next available delivery date based on current day/time
  const getNextDeliveryDate = () => {
    const now = new Date();
    const currentDay = getDay(now); // 0 = Sunday, 1 = Monday, etc.
    const currentHour = now.getHours();
    
    let deliveryDate: Date;
    
    if (currentDay === 0) {
      // Sunday -> shipped Monday, delivered Wednesday (3 days later)
      deliveryDate = addDays(now, 3);
    } else if (currentDay === 2 && currentHour < 15) {
      // Tuesday before 3pm -> deliver Thursday (2 days later)
      deliveryDate = addDays(now, 2);
    } else if (currentDay === 4 && currentHour < 14) {
      // Thursday before 2pm -> deliver Saturday (2 days later)
      deliveryDate = addDays(now, 2);
    } else {
      // Default to next available delivery window
      if (currentDay >= 0 && currentDay <= 2) {
        // Sunday-Tuesday, next delivery is Thursday
        const daysUntilThursday = (4 - currentDay + 7) % 7 || 7;
        deliveryDate = addDays(now, daysUntilThursday);
      } else {
        // Wednesday-Saturday, next delivery is Tuesday
        const daysUntilTuesday = (2 - currentDay + 7) % 7 || 7;
        deliveryDate = addDays(now, daysUntilTuesday);
      }
    }
    
    return format(deliveryDate, 'yyyy-MM-dd');
  };

  const [formData, setFormData] = useState({
    selectedPackage: '1week',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    needDate: getNextDeliveryDate(),
    expeditedDelivery: 'no',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step1EmailSent, setStep1EmailSent] = useState(false);
  const { toast } = useToast();

  const packages = [
    {
      id: '1week',
      title: '1 Week Rental',
      price: 259,
      description: 'Perfect for shorter recovery periods',
      features: ['Complete equipment set', 'Free delivery & setup', '24/7 support', 'Pickup included']
    },
    {
      id: '2weeks',
      title: '2 Week Rental',
      price: 320,
      description: 'Most popular choice for recovery',
      features: ['Complete equipment set', 'Free delivery & setup', '24/7 support', 'Pickup included', 'Extended rental discount']
    },
    {
      id: '3weeks',
      title: '3 Week Rental',
      price: 380,
      description: 'Comprehensive recovery support',
      features: ['Complete equipment set', 'Free delivery & setup', '24/7 support', 'Pickup included', 'Maximum rental discount']
    }
  ];

  const shippingFee = 25;
  const expeditedFee = 350;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageSelection = (value: string) => {
    setFormData(prev => ({ ...prev, selectedPackage: value }));
  };

  const handleExpeditedDeliverySelection = (value: string) => {
    setFormData(prev => ({ ...prev, expeditedDelivery: value }));
  };

  const getExpeditedDeliveryDate = () => {
    const now = new Date();
    return format(addDays(now, 1), 'yyyy-MM-dd');
  };

  const canOfferExpeditedDelivery = () => {
    const now = new Date();
    const currentDay = getDay(now);
    // Only offer expedited delivery on Sunday (next day delivery)
    return currentDay === 0;
  };

  const sendStepOneEmail = async () => {
    try {
      await sendOrderEmail('step1', {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        needDate: formData.needDate,
      });
      
      setStep1EmailSent(true);
      console.log('Step 1 email sent successfully');
    } catch (error) {
      console.error('Error sending step 1 email:', error);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.needDate)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Send email when step 1 is completed (moving from step 1 to step 2)
    if (step === 1 && !step1EmailSent) {
      sendStepOneEmail();
    }
    
    if (step === 3 && (!formData.address || !formData.city || !formData.state || !formData.zipCode)) {
      toast({
        title: "Missing Address",
        description: "Please fill in all address fields.",
        variant: "destructive"
      });
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const selectedPackage = packages.find(pkg => pkg.id === formData.selectedPackage);
      
      // Mask the card number for storage
      const maskedCardNumber = formData.cardNumber.replace(/\d(?=\d{4})/g, '*');
      
      // Calculate total with shipping and expedited delivery
      const expeditedCharge = formData.expeditedDelivery === 'yes' ? expeditedFee : 0;
      const totalPrice = (selectedPackage?.price || 0) + shippingFee + expeditedCharge;
      
      // Save to Supabase
      const orderData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        rental_period: selectedPackage?.title,
        start_date: formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.needDate,
        price: totalPrice,
        status: 'pending',
        card_number_masked: maskedCardNumber,
        card_name: formData.cardName,
        expiry_date: formData.expiryDate,
      };

      await saveCustomerOrder(orderData);
      
      // Send completion email
      await sendOrderEmail('completed', {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        packageDetails: selectedPackage?.title,
        price: totalPrice,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      });
      
      toast({
        title: "Order Submitted Successfully!",
        description: "We'll contact you shortly to confirm your order.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error Processing Order",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
      console.error('Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const selectedPackage = packages.find(pkg => pkg.id === formData.selectedPackage);

  return (
    <section className="w-full">
      <div className="w-full max-w-none">
        <Card className="w-full border-0 shadow-none bg-transparent">
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <Check size={48} className="text-medical-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your order. We'll contact you shortly to confirm delivery details.
                </p>
                <p className="text-gray-600">
                  <strong>Equipment delivery date:</strong> {format(new Date(formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.needDate), 'PPP')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            placeholder="Enter your first name" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            placeholder="Enter your last name" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                            placeholder="you@example.com" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            placeholder="(123) 456-7890" 
                            required 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="needDate">Delivery Date *</Label>
                          <Input 
                            id="needDate" 
                            name="needDate" 
                            type="date" 
                            value={formData.needDate} 
                            onChange={handleInputChange} 
                            required 
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Next available delivery: {format(new Date(getNextDeliveryDate()), 'EEEE, MMMM d, yyyy')}
                            {getDay(new Date()) === 0 && (
                              <span className="block mt-1 text-blue-600">
                                Sunday orders are shipped Monday and delivered Wednesday
                              </span>
                            )}
                          </p>
                        </div>
                        
                        {/* Expedited Delivery Option - Only show on Sunday */}
                        {canOfferExpeditedDelivery() && (
                          <div className="md:col-span-2">
                            <Label className="text-base font-medium mb-3 block">Delivery Speed</Label>
                            <RadioGroup value={formData.expeditedDelivery} onValueChange={handleExpeditedDeliverySelection} className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <RadioGroupItem value="no" id="standard-delivery" />
                                <Label htmlFor="standard-delivery" className="flex-1">
                                  <div>
                                    <div className="font-medium">Standard Delivery - FREE</div>
                                    <div className="text-sm text-gray-500">
                                      Shipped Monday, delivered Wednesday ({format(new Date(getNextDeliveryDate()), 'MMMM d, yyyy')})
                                    </div>
                                  </div>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                                <RadioGroupItem value="yes" id="expedited-delivery" />
                                <Label htmlFor="expedited-delivery" className="flex-1">
                                  <div>
                                    <div className="font-medium">Expedited Next-Day Delivery - +$350</div>
                                    <div className="text-sm text-gray-500">
                                      Delivered tomorrow ({format(new Date(getExpeditedDeliveryDate()), 'MMMM d, yyyy')})
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Package Selection */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Select Your Recovery Package</h3>
                      <RadioGroup value={formData.selectedPackage} onValueChange={handlePackageSelection} className="space-y-4">
                        {packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              formData.selectedPackage === pkg.id ? 'border-medical-green bg-green-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start">
                              <RadioGroupItem value={pkg.id} id={pkg.id} className="mt-1" />
                              <Label htmlFor={pkg.id} className="flex-1 ml-3 cursor-pointer">
                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-lg">{pkg.title}</h4>
                                    <p className="text-gray-500 text-sm mb-2">{pkg.description}</p>
                                    <ul className="text-sm space-y-1">
                                      {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center">
                                          <Check size={14} className="text-medical-green mr-2" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="text-2xl font-bold text-medical-green mt-2 sm:mt-0">
                                    ${pkg.price}
                                  </div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Delivery Address */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Delivery Address</h3>
                    <p className="text-gray-600">
                      Equipment will be delivered on: <strong>{format(new Date(formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.needDate), 'PPP')}</strong>
                      {formData.expeditedDelivery === 'yes' && (
                        <span className="block text-blue-600 font-medium">Expedited Next-Day Delivery</span>
                      )}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder="123 Main Street" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange} 
                            placeholder="Boca Raton" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleInputChange} 
                            placeholder="FL" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input 
                            id="zipCode" 
                            name="zipCode" 
                            value={formData.zipCode} 
                            onChange={handleInputChange} 
                            placeholder="33431" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Payment */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Payment Information</h3>
                    
                    {/* Order Summary */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Package:</span>
                          <span>{selectedPackage?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Package Price:</span>
                          <span>${selectedPackage?.price}.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping Fee:</span>
                          <span>${shippingFee}.00</span>
                        </div>
                        {formData.expeditedDelivery === 'yes' && (
                          <div className="flex justify-between">
                            <span>Expedited Delivery:</span>
                            <span>${expeditedFee}.00</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Delivery Date:</span>
                          <span>{format(new Date(formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.needDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-medical-green text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${(selectedPackage?.price || 0) + shippingFee + (formData.expeditedDelivery === 'yes' ? expeditedFee : 0)}.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input 
                          id="cardName" 
                          name="cardName" 
                          value={formData.cardName} 
                          onChange={handleInputChange} 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input 
                          id="cardNumber" 
                          name="cardNumber" 
                          value={formData.cardNumber} 
                          onChange={handleInputChange} 
                          placeholder="1234 5678 9012 3456" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input 
                            id="expiryDate" 
                            name="expiryDate" 
                            value={formData.expiryDate} 
                            onChange={handleInputChange} 
                            placeholder="MM/YY" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input 
                            id="cvv" 
                            name="cvv" 
                            value={formData.cvv} 
                            onChange={handleInputChange} 
                            placeholder="123" 
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-medical-green hover:bg-medical-green/90"
                        disabled={isSending}
                      >
                        {isSending ? "Processing..." : (
                          <>Complete Order <Check size={16} className="ml-2" /></>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Secure payment processing. Your information is protected.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MultiStepOrderForm;
