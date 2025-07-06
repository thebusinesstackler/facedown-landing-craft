
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, Package, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, getDay } from 'date-fns';
import { saveCustomerOrder, sendOrderEmail } from '@/utils/supabaseOrderUtils';

const MultiStepOrderForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    deliveryDate: getNextDeliveryDate(),
    rentalDuration: '1week',
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

  const rentalOptions = [
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
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRentalDurationSelection = (value: string) => {
    setFormData(prev => ({ ...prev, rentalDuration: value }));
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

  const validateStep = (stepNumber: number) => {
    const errors: {[key: string]: string} = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'Please enter your first name';
      if (!formData.lastName.trim()) errors.lastName = 'Please enter your last name';
      if (!formData.email.trim()) errors.email = 'Please enter your email address';
      if (!formData.phone.trim()) errors.phone = 'Please enter your phone number';
      if (!formData.deliveryDate) errors.deliveryDate = 'Please select a delivery date';
    }
    
    if (stepNumber === 3) {
      if (!formData.address.trim()) errors.address = 'Please enter your street address';
      if (!formData.city.trim()) errors.city = 'Please enter your city';
      if (!formData.state.trim()) errors.state = 'Please enter your state';
      if (!formData.zipCode.trim()) errors.zipCode = 'Please enter your ZIP code';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const sendStepOneEmail = async () => {
    try {
      await sendOrderEmail('step1', {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        needDate: formData.deliveryDate,
      });
      
      setStep1EmailSent(true);
      console.log('Step 1 email sent successfully');
    } catch (error) {
      console.error('Error sending step 1 email:', error);
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    // Send email when step 1 is completed (moving from step 1 to step 2)
    if (step === 1 && !step1EmailSent) {
      sendStepOneEmail();
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      const selectedRental = rentalOptions.find(option => option.id === formData.rentalDuration);
      
      // Mask the card number for storage
      const maskedCardNumber = formData.cardNumber.replace(/\d(?=\d{4})/g, '*');
      
      // Calculate total with shipping and expedited delivery
      const expeditedCharge = formData.expeditedDelivery === 'yes' ? expeditedFee : 0;
      const totalPrice = (selectedRental?.price || 0) + shippingFee + expeditedCharge;
      
      // Save to Supabase
      const orderData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        rental_period: selectedRental?.title,
        start_date: formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.deliveryDate,
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
        packageDetails: selectedRental?.title,
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

  const selectedRental = rentalOptions.find(option => option.id === formData.rentalDuration);

  const ValidationMessage = ({ error }: { error: string }) => (
    <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
      <AlertCircle size={14} />
      <span>{error}</span>
    </div>
  );

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
                  <strong>Equipment delivery date:</strong> {format(new Date(formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.deliveryDate), 'PPP')}
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
                            className={validationErrors.firstName ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.firstName && <ValidationMessage error={validationErrors.firstName} />}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input 
                            id="lastName" 
                            name="lastName" 
                            value={formData.lastName} 
                            onChange={handleInputChange} 
                            placeholder="Enter your last name"
                            className={validationErrors.lastName ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.lastName && <ValidationMessage error={validationErrors.lastName} />}
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
                            className={validationErrors.email ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.email && <ValidationMessage error={validationErrors.email} />}
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            placeholder="(123) 456-7890"
                            className={validationErrors.phone ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.phone && <ValidationMessage error={validationErrors.phone} />}
                        </div>
                        <div>
                          <Label htmlFor="deliveryDate">When would you like the equipment delivered? *</Label>
                          <Input 
                            id="deliveryDate" 
                            name="deliveryDate" 
                            type="date" 
                            value={formData.deliveryDate} 
                            onChange={handleInputChange}
                            className={validationErrors.deliveryDate ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.deliveryDate && <ValidationMessage error={validationErrors.deliveryDate} />}
                        </div>
                        <div>
                          <Label htmlFor="rentalDuration">How long do you need the equipment? *</Label>
                          <RadioGroup value={formData.rentalDuration} onValueChange={handleRentalDurationSelection} className="mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1week" id="duration-1week" />
                              <Label htmlFor="duration-1week">1 Week ($259)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="2weeks" id="duration-2weeks" />
                              <Label htmlFor="duration-2weeks">2 Weeks ($320)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="3weeks" id="duration-3weeks" />
                              <Label htmlFor="duration-3weeks">3 Weeks ($380)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Package Details */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Your Selected Package</h3>
                      <div className="border rounded-lg p-4 bg-green-50 border-medical-green">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg">{selectedRental?.title}</h4>
                            <p className="text-gray-500 text-sm mb-2">{selectedRental?.description}</p>
                            <ul className="text-sm space-y-1">
                              {selectedRental?.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center">
                                  <Check size={14} className="text-medical-green mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="text-2xl font-bold text-medical-green mt-2 sm:mt-0">
                            ${selectedRental?.price}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <p className="text-sm text-blue-700">
                          <strong>Delivery Date:</strong> {format(new Date(formData.deliveryDate), 'PPP')}
                        </p>
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

                {/* Step 3: Delivery Address */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Delivery Address</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address *</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder="123 Main Street"
                          className={validationErrors.address ? 'border-red-300 focus:border-red-400' : ''}
                        />
                        {validationErrors.address && <ValidationMessage error={validationErrors.address} />}
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
                            className={validationErrors.city ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.city && <ValidationMessage error={validationErrors.city} />}
                        </div>
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleInputChange} 
                            placeholder="FL"
                            className={validationErrors.state ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.state && <ValidationMessage error={validationErrors.state} />}
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code *</Label>
                          <Input 
                            id="zipCode" 
                            name="zipCode" 
                            value={formData.zipCode} 
                            onChange={handleInputChange} 
                            placeholder="33431"
                            className={validationErrors.zipCode ? 'border-red-300 focus:border-red-400' : ''}
                          />
                          {validationErrors.zipCode && <ValidationMessage error={validationErrors.zipCode} />}
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
                    
                    {/* Expedited Delivery Option - Only show on Sunday */}
                    {canOfferExpeditedDelivery() && (
                      <div className="space-y-4 mb-6">
                        <Label className="text-base font-medium mb-3 block">Delivery Speed</Label>
                        <RadioGroup value={formData.expeditedDelivery} onValueChange={handleExpeditedDeliverySelection} className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 border rounded-lg">
                            <RadioGroupItem value="no" id="standard-delivery" />
                            <Label htmlFor="standard-delivery" className="flex-1">
                              <div>
                                <div className="font-medium">Standard Delivery</div>
                                <div className="text-sm text-gray-500">
                                  Delivered {format(new Date(formData.deliveryDate), 'MMMM d, yyyy')}
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
                    
                    {/* Order Summary */}
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Package:</span>
                          <span>{selectedRental?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Package Price:</span>
                          <span>${selectedRental?.price}.00</span>
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
                          <span>{format(new Date(formData.expeditedDelivery === 'yes' ? getExpeditedDeliveryDate() : formData.deliveryDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-medical-green text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${(selectedRental?.price || 0) + shippingFee + (formData.expeditedDelivery === 'yes' ? expeditedFee : 0)}.00</span>
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
