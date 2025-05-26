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
import { LocationData } from '@/utils/locationUtils';
import { saveCustomerOrder, calculateEndDate } from '@/utils/customerUtils';

interface OrderNowProps {
  locationData?: LocationData;
}

const OrderNow: React.FC<OrderNowProps> = ({ locationData }) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    rentalPeriod: '1week',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: locationData?.city_name || '',
    state: locationData?.region_name || '',
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
  const [step1EmailSent, setStep1EmailSent] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(calculateDeliveryDate());
  const { toast } = useToast();

  const rentalOptions = [
    {
      id: '1week',
      title: 'Standard Recovery Package',
      period: '1 Week Rental',
      price: 259,
      description: 'Ideal for shorter recovery periods'
    },
    {
      id: '2weeks',
      title: 'Extended Recovery Package',
      period: '2 Week Rental',
      price: 320,
      description: 'Most popular option for typical recovery needs'
    },
    {
      id: '3weeks',
      title: 'Complete Recovery Package',
      period: '3 Week Rental',
      price: 380,
      description: 'Comprehensive support for longer recoveries'
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
          message: `You have a new order started by ${formData.name}. Email: ${formData.email}, Phone: ${formData.phone}`,
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
    // Don't proceed if user wears glasses
    if (step === 2 && formData.wearsGlasses === 'yes') {
      toast({
        title: "Equipment Compatibility Issue",
        description: "Unfortunately, our equipment isn't compatible with glasses. Please contact us for alternative solutions.",
        variant: "destructive"
      });
      return;
    }

    // Send email when moving from step 2 to step 3 (after personal info is completed)
    if (step === 2 && !step1EmailSent) {
      sendStepOneEmail();
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
      const selectedRental = rentalOptions.find(option => option.id === formData.rentalPeriod);
      
      // Save customer order to localStorage for admin dashboard
      const customerOrder = saveCustomerOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        rentalPeriod: selectedRental?.period.replace(' Rental', '') as '1 week' | '2 weeks' | '3 weeks',
        startDate: deliveryDate,
        endDate: calculateEndDate(deliveryDate, selectedRental?.period || '1 Week Rental'),
        price: selectedRental?.price || 259,
        status: 'pending',
        cardDetails: {
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        }
      });

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
          message: `Someone just completed an order! Customer: ${formData.name}, Email: ${formData.email}, Phone: ${formData.phone}, Package: ${selectedRental?.title}, Price: $${selectedRental?.price}, Address: ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
          subject: 'Order Completed',
          to: 'thebusinesstackler@gmail.com',
          resendApiKey: 're_5dGi9VAU_K9ruwEyo3xRjicQnr8EHsXGy'
        }),
      });

      // Send confirmation email to customer
      const customerEmailSent = await sendOrderConfirmationEmail({
        name: formData.name,
        email: formData.email,
        rentalPeriod: selectedRental?.title || '',
        deliveryDate,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      });
      
      if (customerEmailSent) {
        toast({
          title: "Order Confirmation Sent",
          description: "Check your email for order details.",
        });
      }
      
      console.log('Form submitted with data:', formData);
      console.log('Customer order saved:', customerOrder);
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
                          placeholder="Enter your full name" 
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
                          placeholder="Enter your email address" 
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
                          placeholder="Enter your phone number" 
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
                          placeholder="Enter your street address" 
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
                            placeholder="Enter your city" 
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
                            placeholder="Enter your state" 
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
                          placeholder="Enter your ZIP code" 
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
                          placeholder="Enter name on card" 
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
