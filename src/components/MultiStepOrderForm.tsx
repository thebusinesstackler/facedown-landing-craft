import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { format, addDays } from 'date-fns';

const MultiStepOrderForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    selectedPackage: '1week',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    needDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePackageSelection = (value: string) => {
    setFormData(prev => ({ ...prev, selectedPackage: value }));
  };

  const sendStepOneEmail = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Admin Notification',
          email: 'thebusinesstackler@gmail.com',
          phone: '',
          message: `You have a new order started by ${formData.firstName} ${formData.lastName}. Email: ${formData.email}, Phone: ${formData.phone}, Equipment needed by: ${formData.needDate}`,
          subject: 'New Order Started',
          to: 'thebusinesstackler@gmail.com',
          resendApiKey: 're_5dGi9VAU_K9ruwEyo3xRjicQnr8EHsXGy'
        }),
      });

      if (response.ok) {
        console.log('Step 1 email sent successfully');
        setStep1EmailSent(true);
      }
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
      
      // Send order completion email
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Admin Notification',
          email: 'thebusinesstackler@gmail.com',
          phone: '',
          message: `Someone just completed an order! Customer: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}, Phone: ${formData.phone}, Package: ${selectedPackage?.title}, Price: $${selectedPackage?.price}, Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          subject: 'Order Completed',
          to: 'thebusinesstackler@gmail.com',
          resendApiKey: 're_5dGi9VAU_K9ruwEyo3xRjicQnr8EHsXGy'
        }),
      });
      
      console.log('Order submitted:', {
        ...formData,
        package: selectedPackage,
        totalPrice: selectedPackage?.price
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
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex flex-col items-center flex-1">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-medical-green text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > num ? <Check size={18} /> : num}
              </div>
              <span className={`text-sm mt-2 text-center ${step >= num ? 'text-gray-800' : 'text-gray-400'}`}>
                {num === 1 && 'Your Info'}
                {num === 2 && 'Select Package'}
                {num === 3 && 'Delivery Address'}
                {num === 4 && 'Payment'}
              </span>
            </div>
          ))}
        </div>

        <Card className="w-full">
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
                  <strong>Equipment needed by:</strong> {format(new Date(formData.needDate), 'PPP')}
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
                          <Label htmlFor="needDate">When do you need the equipment? *</Label>
                          <Input 
                            id="needDate" 
                            name="needDate" 
                            type="date" 
                            value={formData.needDate} 
                            onChange={handleInputChange} 
                            required 
                          />
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
                      Equipment will be delivered on: <strong>{format(new Date(formData.needDate), 'PPP')}</strong>
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
                          <span>Delivery Date:</span>
                          <span>{format(new Date(formData.needDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-medical-green text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${selectedPackage?.price}.00</span>
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
