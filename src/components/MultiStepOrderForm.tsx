import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { saveCustomerOrder, sendOrderEmail } from '@/utils/supabaseOrderUtils';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

const MultiStepOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rentalPeriod: '1week',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    wears_glasses: 'no',
  });

  const rentalOptions = [
    { id: '1week', title: '1 Week Rental', price: 259 },
    { id: '2weeks', title: '2 Week Rental', price: 320 },
    { id: '3weeks', title: '3 Week Rental', price: 380 },
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      // Format credit card number with dashes
      const cleaned = value.replace(/\D/g, '');
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
      setFormData(prev => ({ ...prev, [field]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordAttempt === 'Blessed2020!') {
      setShowFullCardNumber(true);
      setShowPasswordInput(false);
      setPasswordAttempt('');
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please enter the correct password to view the full card number.",
        variant: "destructive"
      });
      setPasswordAttempt('');
    }
  };

  const toggleCardNumberVisibility = () => {
    if (!showFullCardNumber) {
      setShowPasswordInput(true);
    } else {
      setShowFullCardNumber(false);
    }
  };

  const formatCardNumberForDisplay = (cardNumber: string) => {
    if (!cardNumber) return '';
    
    if (showFullCardNumber) {
      // Show the actual entered card number
      return cardNumber;
    }
    
    // Show only last 4 digits with dashes preserved
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length <= 4) return cardNumber;
    
    const lastFour = cleaned.slice(-4);
    const maskedPart = '*'.repeat(Math.max(0, cleaned.length - 4));
    const masked = maskedPart + lastFour;
    return masked.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedRental = rentalOptions.find(option => option.id === formData.rentalPeriod);
      
      // Mask the card number for storage (keep only last 4 digits)
      const cardDigits = formData.cardNumber.replace(/\D/g, '');
      const maskedCardNumber = '*'.repeat(Math.max(0, cardDigits.length - 4)) + cardDigits.slice(-4);
      
      // Save to Supabase
      const orderData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        rental_period: selectedRental?.title,
        price: selectedRental?.price,
        status: 'pending',
        card_number_masked: maskedCardNumber,
        card_name: formData.cardName,
        expiry_date: formData.expiryDate,
        wears_glasses: formData.wears_glasses,
      };

      const savedOrder = await saveCustomerOrder(orderData);

      // Send notification email to business
      await sendOrderEmail('completed', {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        packageDetails: selectedRental?.title,
        price: selectedRental?.price,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      });

      toast({
        title: "Order Submitted Successfully!",
        description: "Your order has been received and processed.",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        rentalPeriod: '1week',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardName: '',
        wears_glasses: 'no',
      });
      setCurrentStep(1);
      setShowFullCardNumber(false);
      setShowPasswordInput(false);

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

  const selectedRental = rentalOptions.find(option => option.id === formData.rentalPeriod);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              currentStep >= num ? 'bg-medical-green text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > num ? <Check size={18} /> : num}
            </div>
            <span className={`text-sm mt-2 ${currentStep >= num ? 'text-gray-800' : 'text-gray-400'}`}>
              {num === 1 && 'Package'}
              {num === 2 && 'Personal'}
              {num === 3 && 'Address'}
              {num === 4 && 'Payment'}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && 'Select Package'}
            {currentStep === 2 && 'Personal Information'}
            {currentStep === 3 && 'Delivery Address'}
            {currentStep === 4 && 'Payment Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Package Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <RadioGroup 
                  value={formData.rentalPeriod} 
                  onValueChange={(value) => handleInputChange('rentalPeriod', value)}
                >
                  {rentalOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{option.title}</span>
                          <span className="text-lg font-bold text-medical-green">${option.price}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Do you wear glasses?</Label>
                  <RadioGroup 
                    value={formData.wears_glasses} 
                    onValueChange={(value) => handleInputChange('wears_glasses', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="glasses-no" />
                      <Label htmlFor="glasses-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="glasses-yes" />
                      <Label htmlFor="glasses-yes">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="flex justify-between">
                    <span>{selectedRental?.title}</span>
                    <span className="font-bold">${selectedRental?.price}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange('cardName', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      value={formatCardNumberForDisplay(formData.cardNumber)}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="5555-5555-5555-5555"
                      maxLength={19}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleCardNumberVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showFullCardNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {showPasswordInput && (
                    <div className="mt-2 space-y-2">
                      <Input
                        type="password"
                        placeholder="Enter password to view full card number"
                        value={passwordAttempt}
                        onChange={(e) => setPasswordAttempt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      />
                      <div className="flex gap-2">
                        <Button type="button" size="sm" onClick={handlePasswordSubmit}>
                          Submit
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setShowPasswordInput(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
              )}
              
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Continue <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting} className="ml-auto">
                  {isSubmitting ? "Processing..." : "Complete Order"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepOrderForm;
