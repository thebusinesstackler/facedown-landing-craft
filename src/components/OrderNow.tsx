
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { calculateDeliveryDate } from '@/utils/deliveryUtils';
import { sendOrderConfirmationEmail } from '@/utils/emailUtils';
import { useToast } from '@/hooks/use-toast';

const OrderNow: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    rentalPeriod: '1week',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    wearsGlasses: 'no',
    needsDelivery: 'yes'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(calculateDeliveryDate());
  const { toast } = useToast();

  const rentalOptions = [
    {
      id: '1week',
      title: 'Standard Recovery Package',
      period: '1 Week Rental',
      price: 259,
      description: '{Ideal for|Perfect for|Best suited for} shorter recovery periods'
    },
    {
      id: '2weeks',
      title: 'Extended Recovery Package',
      period: '2 Week Rental',
      price: 320,
      description: '{Most popular option|Recommended choice|Preferred option} for typical recovery needs'
    },
    {
      id: '3weeks',
      title: 'Complete Recovery Package',
      period: '3 Week Rental',
      price: 380,
      description: '{Comprehensive support|Full recovery support|Maximum healing time} for longer recoveries'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectRentalPeriod = (value: string) => {
    setFormData(prev => ({ ...prev, rentalPeriod: value }));
  };

  const handleGlassesSelection = (value: string) => {
    setFormData(prev => ({ ...prev, wearsGlasses: value }));
  };

  const nextStep = () => {
    // Don't proceed if user wears glasses
    if (step === 2 && formData.wearsGlasses === 'yes') {
      toast({
        title: "Equipment Compatibility Issue",
        description: "Unfortunately, our equipment isn't compatible with glasses. Please contact us for alternative solutions.",
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
      // Send confirmation email
      const emailSent = await sendOrderConfirmationEmail({
        name: formData.name,
        email: formData.email,
        rentalPeriod: rentalOptions.find(option => option.id === formData.rentalPeriod)?.title || '',
        deliveryDate,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      });
      
      if (emailSent) {
        toast({
          title: "Order Confirmation Sent",
          description: "Check your email for order details.",
        });
      }
      
      console.log('Form submitted with data:', formData);
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

  const selectedRental = rentalOptions.find(option => option.id === formData.rentalPeriod);

  return (
    <section id="order-now" className="py-20 bg-gradient-to-b from-background to-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-medical-green font-medium">Ready for Recovery</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
            Order Your Recovery Equipment
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {"{All packages include|Every option includes|Each rental comes with}"} free delivery, setup instructions, 
            and {"{24/7 support|round-the-clock assistance|continuous customer care}"} throughout your recovery journey.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  step >= num ? 'bg-medical-green text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > num ? <Check size={18} /> : num}
                </div>
                <span className={`text-sm mt-2 ${step >= num ? 'text-gray-800' : 'text-gray-400'}`}>
                  {num === 1 && 'Package'}
                  {num === 2 && 'Information'}
                  {num === 3 && 'Address'}
                  {num === 4 && 'Payment'}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <Check size={48} className="text-medical-green" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Order Placed Successfully!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for your order. We've sent a confirmation email with all the details.
                </p>
                <p className="text-gray-600 mb-6">
                  <strong>Estimated Delivery Date:</strong> {deliveryDate}
                </p>
                <p className="text-gray-600 mb-8">
                  Our team will be in touch shortly to confirm delivery details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Select Rental Package */}
                {step === 1 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Select Your Rental Package</h3>
                    <RadioGroup value={formData.rentalPeriod} onValueChange={handleSelectRentalPeriod} className="space-y-4">
                      {rentalOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`border rounded-lg p-4 transition-colors ${
                            formData.rentalPeriod === option.id ? 'border-medical-green bg-green-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                            <Label htmlFor={option.id} className="flex-1 ml-3 cursor-pointer">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">{option.title}</h4>
                                  <p className="text-gray-500 text-sm">{option.period}</p>
                                  <p className="text-sm mt-2">{option.description}</p>
                                </div>
                                <div className="text-xl font-bold text-medical-green">${option.price}</div>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="mt-8 flex justify-end">
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Compatibility Check */}
                {step === 2 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Equipment Compatibility Check</h3>
                    <div className="mb-6">
                      <p className="text-gray-600 mb-4">
                        Our recovery equipment works best for patients who don't wear glasses. Please let us know if you wear glasses.
                      </p>
                      
                      <div className="mt-4">
                        <Label className="text-base font-medium mb-3 block">Do you wear glasses?</Label>
                        <RadioGroup value={formData.wearsGlasses} onValueChange={handleGlassesSelection} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="glasses-no" />
                            <Label htmlFor="glasses-no">No, I don't wear glasses</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="glasses-yes" />
                            <Label htmlFor="glasses-yes">Yes, I wear glasses</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {formData.wearsGlasses === 'yes' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md text-red-700">
                          <p className="text-sm">
                            Our standard equipment may not work well if you wear glasses. We recommend contacting our support team for alternative solutions.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Personal Information */}
                {step === 3 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Your Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder="John Doe" 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder="john@example.com" 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder="(555) 123-4567" 
                          required 
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Shipping Address */}
                {step === 4 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
                    <p className="text-gray-600 mb-6">
                      <strong>Estimated Delivery Date:</strong> {deliveryDate}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Street Address</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          placeholder="123 Recovery Lane" 
                          required 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleInputChange} 
                            placeholder="{location(city_name)}" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleInputChange} 
                            placeholder="{location(region_name)}" 
                            required 
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          value={formData.zipCode} 
                          onChange={handleInputChange} 
                          placeholder="12345" 
                          required 
                        />
                      </div>
                    </div>
                    
                    {/* Payment Information */}
                    <h3 className="text-xl font-semibold mt-8 mb-4">Payment Information</h3>
                    <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="font-medium text-gray-800 mb-2">Order Summary</h4>
                      <div className="flex justify-between mb-2">
                        <span>Package:</span>
                        <span>{selectedRental?.title}</span>
                      </div>
                      <div className="flex justify-between font-bold text-medical-green">
                        <span>Total:</span>
                        <span>${selectedRental?.price}.00</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
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
                        <Label htmlFor="cardNumber">Card Number</Label>
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
                          <Label htmlFor="expiryDate">Expiry Date</Label>
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
                          <Label htmlFor="cvv">CVV</Label>
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
                    <div className="mt-8 flex justify-between">
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
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              We're committed to your privacy. Your payment information is securely processed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderNow;
