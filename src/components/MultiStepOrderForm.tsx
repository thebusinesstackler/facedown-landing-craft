import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { saveCustomerOrder, sendOrderEmail } from '@/utils/supabaseOrderUtils';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import SquarePaymentForm from './SquarePaymentForm';
import { inputValidation } from '@/utils/inputValidation';

const MultiStepOrderForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [squareConfig, setSquareConfig] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
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
    wears_glasses: 'no',
  });

  const rentalOptions = [
    { id: '1week', title: '1 Week Rental', price: 259 },
    { id: '2weeks', title: '2 Week Rental', price: 320 },
    { id: '3weeks', title: '3 Week Rental', price: 380 },
  ];

  useEffect(() => {
    const getSquareConfig = async () => {
      try {
        const response = await supabase.functions.invoke('square-payments', {
          body: { action: 'test_connection' }
        });

        if (response.data?.success) {
          setSquareConfig({
            applicationId: response.data.applicationId,
            locationId: response.data.locationId,
            environment: response.data.environment
          });
        }
      } catch (error) {
        console.error('Error getting Square config:', error);
      }
    };

    getSquareConfig();
  }, []);

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    if (currentStep === 2) {
      const nameValidation = inputValidation.validateName(`${formData.firstName} ${formData.lastName}`);
      if (!nameValidation.isValid) {
        errors.name = nameValidation.error!;
      }

      const emailValidation = inputValidation.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error!;
      }

      const phoneValidation = inputValidation.validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error!;
      }
    }

    if (currentStep === 3) {
      const addressValidation = inputValidation.validateAddress(formData.address);
      if (!addressValidation.isValid) {
        errors.address = addressValidation.error!;
      }

      const zipValidation = inputValidation.validateZipCode(formData.zipCode);
      if (!zipValidation.isValid) {
        errors.zipCode = zipValidation.error!;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    // Sanitize input
    const sanitizedValue = inputValidation.sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = async (token: string, verificationToken?: string) => {
    setIsSubmitting(true);

    try {
      const selectedRental = rentalOptions.find(option => option.id === formData.rentalPeriod);
      
      // Save order to Supabase first
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
        wears_glasses: formData.wears_glasses,
      };

      const savedOrder = await saveCustomerOrder(orderData);
      console.log('Order saved:', savedOrder);

      // Process the payment with Square
      const paymentResponse = await supabase.functions.invoke('square-payments', {
        body: {
          action: 'process_payment',
          token,
          verificationToken,
          amount: selectedRental?.price,
          orderId: savedOrder.id,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
        }
      });

      if (paymentResponse.error) {
        throw new Error('Payment processing failed');
      }

      console.log('Payment processed:', paymentResponse.data);

      // Send notification email
      await sendOrderEmail('completed', {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        packageDetails: selectedRental?.title,
        price: selectedRental?.price,
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      });

      toast({
        title: "Order Completed Successfully!",
        description: "Your payment has been processed and order confirmed.",
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
        wears_glasses: 'no',
      });
      setCurrentStep(1);

    } catch (error) {
      console.error('Order processing error:', error);
      toast({
        title: "Order Processing Failed",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive"
    });
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
                    maxLength={50}
                    required
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    maxLength={50}
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
                  maxLength={254}
                  required
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  maxLength={20}
                  required
                />
                {validationErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                )}
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
                  maxLength={255}
                  required
                />
                {validationErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    maxLength={50}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    maxLength={10}
                    required
                  />
                  {validationErrors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.zipCode}</p>
                  )}
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
              
              {squareConfig && (
                <SquarePaymentForm
                  applicationId={squareConfig.applicationId}
                  locationId={squareConfig.locationId}
                  environment={squareConfig.environment}
                  amount={selectedRental?.price || 0}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  disabled={isSubmitting}
                  buttonText={isSubmitting ? "Processing..." : "Complete Order"}
                />
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft size={16} className="mr-2" /> Back
              </Button>
            )}
            
            {currentStep < 4 && (
              <Button type="button" onClick={nextStep} className="ml-auto">
                Continue <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepOrderForm;
