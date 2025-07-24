
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, Package, AlertCircle, Glasses, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { saveCustomerOrder, sendOrderEmail } from '@/utils/supabaseOrderUtils';

const MultiStepOrderForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showCouponField, setShowCouponField] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [cardViewPassword, setCardViewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Calculate expected delivery date based on current day/time
  const getExpectedDeliveryDate = () => {
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
    rentalDuration: '1week',
    surgeryDate: '',
    doctorOffice: '',
    doctorName: '',
    wearsGlasses: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    bodyBuild: '',
    deliveryDate: getExpectedDeliveryDate(),
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    couponCode: '',
    domain: 'facedownrecoveryequipment'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step1EmailSent, setStep1EmailSent] = useState(false);
  const { toast } = useToast();

  const rentalOptions = [
    {
      id: '1week',
      title: '1 Week Rental',
      price: 259
    },
    {
      id: '2weeks',
      title: '2 Week Rental',
      price: 320
    },
    {
      id: '3weeks',
      title: '3 Week Rental',
      price: 380
    }
  ];

  const shippingFee = 25;

  // Check if coupon removes shipping
  const isCouponValid = formData.couponCode.toLowerCase() === 'shipping2025';
  const finalShippingFee = isCouponValid ? 0 : shippingFee;

  // Included items list for all packages
  const includedItems = [
    'Vitrectomy Chair',
    'Facedown Table Support', 
    'Mirror and 4 headrest face covers'
  ];

  const calculateBodyBuild = (heightFeet: string, heightInches: string, weight: string) => {
    if (!heightFeet || !weight) return '';
    
    const totalHeightInches = parseInt(heightFeet) * 12 + (parseInt(heightInches) || 0);
    const weightLbs = parseInt(weight);
    const heightMeters = totalHeightInches * 0.0254;
    const weightKg = weightLbs * 0.453592;
    const bmi = weightKg / (heightMeters * heightMeters);
    
    if (bmi < 18.5) return 'slim';
    if (bmi >= 18.5 && bmi < 25) return 'medium';
    if (bmi >= 25 && bmi < 30) return 'medium';
    return 'obese';
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = numbers.slice(0, 10);
    
    // Format as (555) 555-5555
    if (limited.length >= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else {
      return limited;
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limited = numbers.slice(0, 16);
    
    // Format as 5555-5555-5555-5555
    if (limited.length >= 12) {
      return `${limited.slice(0, 4)}-${limited.slice(4, 8)}-${limited.slice(8, 12)}-${limited.slice(12)}`;
    } else if (limited.length >= 8) {
      return `${limited.slice(0, 4)}-${limited.slice(4, 8)}-${limited.slice(8)}`;
    } else if (limited.length >= 4) {
      return `${limited.slice(0, 4)}-${limited.slice(4)}`;
    } else {
      return limited;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Format phone number
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    // Format card number
    if (name === 'cardNumber') {
      processedValue = formatCardNumber(value);
    }
    
    const newFormData = { ...formData, [name]: processedValue };
    
    // Calculate body build when height or weight changes (but don't display it)
    if (name === 'heightFeet' || name === 'heightInches' || name === 'weight') {
      newFormData.bodyBuild = calculateBodyBuild(
        name === 'heightFeet' ? processedValue : formData.heightFeet,
        name === 'heightInches' ? processedValue : formData.heightInches,
        name === 'weight' ? processedValue : formData.weight
      );
    }
    
    setFormData(newFormData);
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRentalDurationSelection = (value: string) => {
    setFormData(prev => ({ ...prev, rentalDuration: value }));
  };

  const handleGlassesSelection = (value: string) => {
    setFormData(prev => ({ ...prev, wearsGlasses: value }));
  };

  const handleCardViewToggle = () => {
    if (!showCardNumber) {
      // Show password input
      setCardViewPassword('');
      setPasswordError('');
      setShowCardNumber(false);
    } else {
      // Hide card number
      setShowCardNumber(false);
      setCardViewPassword('');
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = () => {
    if (cardViewPassword === 'Blessed2020!') {
      setShowCardNumber(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const validateStep = (stepNumber: number) => {
    const errors: {[key: string]: string} = {};
    
    if (stepNumber === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'Please enter your first name';
      if (!formData.lastName.trim()) errors.lastName = 'Please enter your last name';
      if (!formData.email.trim()) errors.email = 'Please enter your email address';
      if (!formData.phone.trim()) errors.phone = 'Please enter your phone number';
    }
    
    if (stepNumber === 3) {
      if (!formData.surgeryDate) errors.surgeryDate = 'Please enter your surgery date';
      if (!formData.wearsGlasses) errors.wearsGlasses = 'Please let us know if you wear glasses';
      if (!formData.heightFeet) errors.heightFeet = 'Please enter your height';
      if (!formData.weight) errors.weight = 'Please enter your weight';
    }
    
    if (stepNumber === 4) {
      if (!formData.address.trim()) errors.address = 'Please enter your street address';
      if (!formData.city.trim()) errors.city = 'Please enter your city';
      if (!formData.state.trim()) errors.state = 'Please enter your state';
      if (!formData.zipCode.trim()) errors.zipCode = 'Please enter your ZIP code';
    }
    
    if (stepNumber === 5) {
      if (!formData.cardName.trim()) errors.cardName = 'Please enter the name on card';
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Please enter your card number';
      if (!formData.expiryDate.trim()) errors.expiryDate = 'Please enter the expiry date';
      if (!formData.cvv.trim()) errors.cvv = 'Please enter the CVV';
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

    // Check glasses compatibility before proceeding from step 3
    if (step === 3 && formData.wearsGlasses === 'yes') {
      toast({
        title: "Equipment Compatibility Notice",
        description: "Our equipment doesn't work as well with glasses. You may still continue, but effectiveness might be reduced.",
        variant: "destructive"
      });
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
      
      // Calculate total with shipping (considering coupon)
      const totalPrice = (selectedRental?.price || 0) + finalShippingFee;
      
      // Save to Supabase with additional fields
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
        start_date: formData.deliveryDate,
        price: totalPrice,
        status: 'pending',
        card_number_masked: maskedCardNumber,
        card_name: formData.cardName,
        expiry_date: formData.expiryDate,
        // Additional fields - store as JSON or separate fields as needed
        surgery_date: formData.surgeryDate,
        doctor_office: formData.doctorOffice,
        doctor_name: formData.doctorName,
        wears_glasses: formData.wearsGlasses,
        height: `${formData.heightFeet}'${formData.heightInches || 0}"`,
        weight: formData.weight,
        body_build: formData.bodyBuild,
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

  // Get earliest delivery date to highlight in calendar
  const getEarliestDeliveryDate = () => {
    return new Date(formData.deliveryDate);
  };

  return (
    <section className="w-full">
      <div className="w-full max-w-none">
        <Card className="w-full border-0 shadow-none bg-transparent">
          <CardContent className="p-4">
            {/* Hidden domain field */}
            <input type="hidden" name="domain" value={formData.domain} />
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                  <Check size={48} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Thank You for Your Order!</h3>
                <p className="text-gray-600 mb-4 text-lg">
                  We've successfully received your order and are processing it now.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-blue-800 font-medium mb-2">Order Details:</p>
                  <p className="text-blue-700 text-sm">
                    <strong>Package:</strong> {selectedRental?.title}
                  </p>
                  <p className="text-blue-700 text-sm">
                    <strong>Expected Delivery:</strong> {format(new Date(formData.deliveryDate), 'PPP')}
                  </p>
                </div>
                <p className="text-gray-600 mb-2">
                  Our team will contact you shortly to confirm delivery details.
                </p>
                <p className="text-gray-600 text-sm">
                  You'll receive tracking information once your equipment has shipped.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Order Your Equipment Today</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input 
                            id="firstName" 
                            name="firstName" 
                            value={formData.firstName} 
                            onChange={handleInputChange} 
                            placeholder="Enter your first name"
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.firstName && 'border-red-300 focus:border-red-400'
                            )}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.lastName && 'border-red-300 focus:border-red-400'
                            )}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.email && 'border-red-300 focus:border-red-400'
                            )}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.phone && 'border-red-300 focus:border-red-400'
                            )}
                          />
                          {validationErrors.phone && <ValidationMessage error={validationErrors.phone} />}
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

                {/* Step 2: Equipment Selection */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-6">Select Your Rental Package</h3>
                      <RadioGroup value={formData.rentalDuration} onValueChange={handleRentalDurationSelection} className="space-y-4">
                        {rentalOptions.map((option) => (
                          <div
                            key={option.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              formData.rentalDuration === option.id ? 'border-medical-green bg-green-50' : 'border-gray-200 hover:border-medical-green hover:bg-green-50'
                            }`}
                          >
                            <div className="flex items-start">
                              <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                              <Label htmlFor={option.id} className="flex-1 ml-3 cursor-pointer">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-lg">{option.title}</h4>
                                    
                                    <div className="mb-3">
                                      <p className="font-medium text-sm text-gray-700 mb-2">Included:</p>
                                      <ul className="text-sm space-y-1">
                                        {includedItems.map((item, idx) => (
                                          <li key={idx} className="flex items-center text-gray-600">
                                            <Check size={14} className="text-medical-green mr-2 flex-shrink-0" />
                                            {item}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-medical-green ml-4">${option.price}</div>
                                </div>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} className="hover:bg-medical-green hover:text-white">
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Compatibility Questions */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-6">Equipment Compatibility & Surgery Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="surgeryDate">Date of Your Surgery *</Label>
                          <Input 
                            id="surgeryDate" 
                            name="surgeryDate" 
                            type="date"
                            value={formData.surgeryDate} 
                            onChange={handleInputChange} 
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.surgeryDate && 'border-red-300 focus:border-red-400'
                            )}
                          />
                          {validationErrors.surgeryDate && <ValidationMessage error={validationErrors.surgeryDate} />}
                        </div>

                        <div>
                          <Label htmlFor="doctorOffice">Doctor's Office Name</Label>
                          <Input 
                            id="doctorOffice" 
                            name="doctorOffice" 
                            value={formData.doctorOffice} 
                            onChange={handleInputChange} 
                            placeholder="Enter your doctor's office name (optional)"
                            className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
                          />
                        </div>

                        {formData.doctorOffice.trim() && (
                          <div>
                            <Label htmlFor="doctorName">Doctor's Name</Label>
                            <Input 
                              id="doctorName" 
                              name="doctorName" 
                              value={formData.doctorName} 
                              onChange={handleInputChange} 
                              placeholder="Enter your doctor's name"
                              className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
                            />
                          </div>
                        )}

                        <div>
                          <Label>Do you wear glasses? *</Label>
                          <Select value={formData.wearsGlasses} onValueChange={handleGlassesSelection}>
                            <SelectTrigger className={cn(
                              "hover:border-medical-green focus:ring-medical-green focus:border-medical-green",
                              validationErrors.wearsGlasses && 'border-red-300 focus:border-red-400'
                            )}>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              <SelectItem 
                                value="no"
                                className="hover:bg-medical-green hover:text-white focus:bg-medical-green focus:text-white"
                              >
                                No, I don't wear glasses
                              </SelectItem>
                              <SelectItem 
                                value="yes"
                                className="hover:bg-medical-green hover:text-white focus:bg-medical-green focus:text-white"
                              >
                                Yes, I wear glasses
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {validationErrors.wearsGlasses && <ValidationMessage error={validationErrors.wearsGlasses} />}
                          
                          {formData.wearsGlasses === 'yes' && (
                            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                              <div className="flex items-start">
                                <Glasses className="text-orange-600 mr-2 mt-0.5" size={16} />
                                <div>
                                  <p className="text-orange-800 font-medium text-sm mb-1">
                                    Equipment Compatibility Notice
                                  </p>
                                  <p className="text-orange-700 text-sm">
                                    Our equipment doesn't work as well if you wear glasses. The effectiveness may be reduced, but you can still use it.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Height *</Label>
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Select value={formData.heightFeet} onValueChange={(value) => handleInputChange({ target: { name: 'heightFeet', value } } as any)}>
                                  <SelectTrigger className={cn(
                                    "hover:border-medical-green focus:ring-medical-green focus:border-medical-green",
                                    validationErrors.heightFeet && 'border-red-300 focus:border-red-400'
                                  )}>
                                    <SelectValue placeholder="Feet" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white z-50">
                                    {[4, 5, 6, 7].map(feet => (
                                      <SelectItem 
                                        key={feet} 
                                        value={feet.toString()}
                                        className="hover:bg-medical-green hover:text-white focus:bg-medical-green focus:text-white"
                                      >
                                        {feet} ft
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex-1">
                                <Select value={formData.heightInches} onValueChange={(value) => handleInputChange({ target: { name: 'heightInches', value } } as any)}>
                                  <SelectTrigger className="hover:border-medical-green focus:ring-medical-green focus:border-medical-green">
                                    <SelectValue placeholder="Inches" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white z-50">
                                    {Array.from({ length: 12 }, (_, i) => (
                                      <SelectItem 
                                        key={i} 
                                        value={i.toString()}
                                        className="hover:bg-medical-green hover:text-white focus:bg-medical-green focus:text-white"
                                      >
                                        {i} in
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {validationErrors.heightFeet && <ValidationMessage error={validationErrors.heightFeet} />}
                          </div>

                          <div>
                            <Label htmlFor="weight">Weight (lbs) *</Label>
                            <Input 
                              id="weight" 
                              name="weight" 
                              type="number"
                              value={formData.weight} 
                              onChange={handleInputChange} 
                              placeholder="Enter weight in pounds"
                              className={cn(
                                "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                                validationErrors.weight && 'border-red-300 focus:border-red-400'
                              )}
                            />
                            {validationErrors.weight && <ValidationMessage error={validationErrors.weight} />}
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                          <p className="text-sm text-blue-700">
                            <strong>Expected Delivery Date:</strong> {format(new Date(formData.deliveryDate), 'PPP')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} className="hover:bg-medical-green hover:text-white">
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
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
                          className={cn(
                            "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                            validationErrors.address && 'border-red-300 focus:border-red-400'
                          )}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.city && 'border-red-300 focus:border-red-400'
                            )}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.state && 'border-red-300 focus:border-red-400'
                            )}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.zipCode && 'border-red-300 focus:border-red-400'
                            )}
                          />
                          {validationErrors.zipCode && <ValidationMessage error={validationErrors.zipCode} />}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} className="hover:bg-medical-green hover:text-white">
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button type="button" onClick={nextStep} className="bg-medical-green hover:bg-medical-green/90">
                        Continue <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 5: Payment Information - with password protected card view */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Payment Information</h3>
                    
                    
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
                          <span className={isCouponValid ? 'line-through text-gray-500' : ''}>${shippingFee}.00</span>
                        </div>
                        {isCouponValid && (
                          <div className="flex justify-between text-medical-green">
                            <span>Coupon Discount:</span>
                            <span>-${shippingFee}.00</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Expected Delivery:</span>
                          <span>{format(new Date(formData.deliveryDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-medical-green text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${(selectedRental?.price || 0) + finalShippingFee}.00</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Coupon Code Section with Link */}
                      <div>
                        {!showCouponField ? (
                          <button
                            type="button"
                            onClick={() => setShowCouponField(true)}
                            className="text-medical-green hover:text-medical-green/80 text-sm font-medium flex items-center gap-1"
                          >
                            Have a coupon? <ChevronDown size={14} />
                          </button>
                        ) : (
                          <div>
                            <Label htmlFor="couponCode">Coupon Code</Label>
                            <Input 
                              id="couponCode" 
                              name="couponCode" 
                              value={formData.couponCode} 
                              onChange={handleInputChange} 
                              placeholder="Enter coupon code" 
                              className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
                            />
                            {isCouponValid && (
                              <p className="text-medical-green text-sm mt-1">✓ Coupon applied! Shipping fee removed.</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Name on Card *</Label>
                        <Input 
                          id="cardName" 
                          name="cardName" 
                          value={formData.cardName} 
                          onChange={handleInputChange} 
                          placeholder="John Doe" 
                          required 
                          className={cn(
                            "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                            validationErrors.cardName && 'border-red-300 focus:border-red-400'
                          )}
                        />
                        {validationErrors.cardName && <ValidationMessage error={validationErrors.cardName} />}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          {formData.cardNumber && (
                            <div className="flex items-center gap-2">
                              {!showCardNumber && !cardViewPassword ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCardViewToggle}
                                  className="text-xs text-medical-green hover:text-medical-green/80"
                                >
                                  <Eye size={14} className="mr-1" />
                                  View Full Number
                                </Button>
                              ) : showCardNumber ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCardViewToggle}
                                  className="text-xs text-medical-green hover:text-medical-green/80"
                                >
                                  <EyeOff size={14} className="mr-1" />
                                  Hide Number
                                </Button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="password"
                                    placeholder="Enter password"
                                    value={cardViewPassword}
                                    onChange={(e) => setCardViewPassword(e.target.value)}
                                    className="w-32 h-8 text-xs"
                                    onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handlePasswordSubmit}
                                    className="text-xs"
                                  >
                                    View
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Input 
                          id="cardNumber" 
                          name="cardNumber" 
                          value={showCardNumber ? formData.cardNumber : formData.cardNumber.replace(/\d(?=\d{4})/g, '*')}
                          onChange={handleInputChange} 
                          placeholder="5555-5555-5555-5555" 
                          required 
                          className={cn(
                            "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                            validationErrors.cardNumber && 'border-red-300 focus:border-red-400'
                          )}
                        />
                        {passwordError && (
                          <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                        )}
                        {validationErrors.cardNumber && <ValidationMessage error={validationErrors.cardNumber} />}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.expiryDate && 'border-red-300 focus:border-red-400'
                            )}
                          />
                          {validationErrors.expiryDate && <ValidationMessage error={validationErrors.expiryDate} />}
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
                            className={cn(
                              "focus:ring-medical-green focus:border-medical-green hover:border-medical-green",
                              validationErrors.cvv && 'border-red-300 focus:border-red-400'
                            )}
                          />
                          {validationErrors.cvv && <ValidationMessage error={validationErrors.cvv} />}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} className="hover:bg-medical-green hover:text-white">
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

        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">
            Secure payment processing. Your information is protected.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MultiStepOrderForm;
