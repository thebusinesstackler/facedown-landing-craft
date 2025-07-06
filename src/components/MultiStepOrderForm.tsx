import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Check, Package, AlertCircle, Glasses, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { saveCustomerOrder, sendOrderEmail } from '@/utils/supabaseOrderUtils';

const MultiStepOrderForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
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
    deliveryDate: getExpectedDeliveryDate(),
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    domain: 'facedownrecoveryequipment'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [step1EmailSent, setStep1EmailSent] = useState(false);
  const [surgeryDateOpen, setSurgeryDateOpen] = useState(false);
  const { toast } = useToast();

  const rentalOptions = [
    {
      id: '1week',
      title: '1 Week Rental',
      price: 259,
      description: 'Perfect for shorter recovery periods',
      features: ['Complete equipment set']
    },
    {
      id: '2weeks',
      title: '2 Week Rental',
      price: 320,
      description: 'Most popular choice for recovery',
      features: ['Complete equipment set']
    },
    {
      id: '3weeks',
      title: '3 Week Rental',
      price: 380,
      description: 'Comprehensive recovery support',
      features: ['Complete equipment set']
    }
  ];

  const shippingFee = 25;

  // Included items list for all packages
  const includedItems = [
    'Vitrectomy Chair',
    'Facedown Table Support', 
    'Mirror and 4 headrest face covers',
    'Instructions',
    'Pickup included'
  ];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Format phone number
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
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

  const handleSurgeryDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, surgeryDate: format(date, 'yyyy-MM-dd') }));
      setSurgeryDateOpen(false);
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
    }
    
    if (stepNumber === 4) {
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
      
      // Calculate total with shipping
      const totalPrice = (selectedRental?.price || 0) + shippingFee;
      
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
        start_date: formData.deliveryDate,
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
                                    <p className="text-gray-500 text-sm mb-3">{option.description}</p>
                                    
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
                                    
                                    <ul className="text-sm space-y-1">
                                      {option.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-600">
                                          <Check size={14} className="text-medical-green mr-2" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
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
                          <Label>Date of Your Surgery *</Label>
                          <Popover open={surgeryDateOpen} onOpenChange={setSurgeryDateOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal hover:bg-medical-green hover:text-white hover:border-medical-green focus:ring-medical-green focus:border-medical-green",
                                  !formData.surgeryDate && "text-muted-foreground",
                                  validationErrors.surgeryDate && 'border-red-300 focus:border-red-400'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.surgeryDate ? format(new Date(formData.surgeryDate), "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={formData.surgeryDate ? new Date(formData.surgeryDate) : undefined}
                                onSelect={handleSurgeryDateSelect}
                                initialFocus
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
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

                {/* Step 4: Delivery Address & Payment */}
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

                    {/* Payment Information */}
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
                          <span>${shippingFee}.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Expected Delivery:</span>
                          <span>{format(new Date(formData.deliveryDate), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-medical-green text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${(selectedRental?.price || 0) + shippingFee}.00</span>
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
                          className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
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
                          className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
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
                            className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
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
                            className="focus:ring-medical-green focus:border-medical-green hover:border-medical-green"
                          />
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
