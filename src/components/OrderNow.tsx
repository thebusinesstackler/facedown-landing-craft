import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { saveCustomerOrder, calculateEndDate, maskCardNumber } from '@/utils/customerUtils';
import { format, addDays } from 'date-fns';

interface FormData {
  rentalPeriod: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  wearsGlasses: string;
  needsDelivery: string;
}

const OrderNow: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rentalOptions = [
    { id: '1week', title: '1 Week Rental', price: 259 },
    { id: '2weeks', title: '2 Week Rental', price: 320 },
    { id: '3weeks', title: '3 Week Rental', price: 380 },
  ];

  const sendOrderConfirmationEmail = async (orderData: any) => {
    console.log('Sending order confirmation email with data:', {
      name: orderData.name,
      email: orderData.email,
      rentalPeriod: orderData.rentalPeriod,
      deliveryDate: orderData.deliveryDate,
      address: orderData.address,
      city: orderData.city,
      state: orderData.state,
      zipCode: orderData.zipCode
    });

    try {
      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: orderData.name,
          email: orderData.email,
          subject: 'Order Confirmation - Face Down Recovery Equipment',
          orderDetails: {
            rentalPeriod: orderData.rentalPeriod,
            deliveryDate: orderData.deliveryDate,
            address: `${orderData.address}\n${orderData.city}, ${orderData.state} ${orderData.zipCode}`
          },
          resendApiKey: 're_VcM1Sk1a_6B9CNbs16KsuSWtcQzTY2Hzp',
          isOrderConfirmation: true
        }),
      });

      if (response.ok) {
        console.log('Order confirmation email sent successfully');
        return true;
      } else {
        console.error('Failed to send order confirmation email');
        return false;
      }
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedRental = rentalOptions.find(option => option.id === formData.rentalPeriod);
      if (!selectedRental) throw new Error('Invalid rental period selected');

      const deliveryDate = format(addDays(new Date(), 2), 'EEEE, MMMM d, yyyy');
      
      // Send customer confirmation email
      const customerEmailSent = await sendOrderConfirmationEmail({
        name: formData.name,
        email: formData.email,
        rentalPeriod: selectedRental.title,
        deliveryDate: deliveryDate,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      });

      // Save customer order to local storage
      const savedOrder = saveCustomerOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        rentalPeriod: selectedRental.title.replace(' Rental', '') as '1 week' | '2 weeks' | '3 weeks',
        startDate: deliveryDate,
        endDate: calculateEndDate(deliveryDate, selectedRental.title.replace(' Rental', '')),
        price: selectedRental.price,
        status: 'pending' as const,
        cardDetails: {
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        }
      });
      
      // Send notification to support team - using the correct endpoint
      const supportEmailSent = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'System Notification',
          email: 'notifications@facedownrecoveryequipment.com',
          subject: `New Order: ${formData.name}`,
          message: `
            New equipment rental order received:
            
            Customer: ${formData.name}
            Email: ${formData.email}
            Phone: ${formData.phone}
            
            Package: ${selectedRental?.title}
            Price: $${selectedRental?.price}
            
            Delivery Address:
            ${formData.address}
            ${formData.city}, ${formData.state} ${formData.zipCode}
            
            Delivery Date: ${deliveryDate}
            
            Payment Information:
            Card Name: ${formData.cardName}
            Card Number: ${maskCardNumber(formData.cardNumber)}
            Expiry: ${formData.expiryDate}
            
            Wears Glasses: ${formData.wearsGlasses === 'yes' ? 'Yes' : 'No'}
            Needs Delivery: ${formData.needsDelivery === 'yes' ? 'Yes' : 'No'}
          `,
          resendApiKey: 're_VcM1Sk1a_6B9CNbs16KsuSWtcQzTY2Hzp',
          isOrderConfirmation: false
        }),
      });
      
      if (customerEmailSent) {
        toast({
          title: "Order Placed Successfully!",
          description: "You'll receive a confirmation email shortly. We'll contact you to arrange delivery.",
        });
        
        // Reset form
        setFormData({
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
      } else {
        throw new Error('Failed to send confirmation email');
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Order Face Down Recovery Equipment</CardTitle>
          <CardDescription>Fill out the form below to place your order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="rentalPeriod">Rental Period</Label>
              <Select value={formData.rentalPeriod} onValueChange={(value) => setFormData(prevState => ({ ...prevState, rentalPeriod: value }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rental period" />
                </SelectTrigger>
                <SelectContent>
                  {rentalOptions.map(option => (
                    <SelectItem key={option.id} value={option.id}>{option.title} - ${option.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="123-456-7890"
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Anytown"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="CA"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="12345"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234-5678-9012-3456"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cardName">Name on Card</Label>
                <Input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
            <div>
              <Label>Do you wear glasses?</Label>
              <RadioGroup defaultValue={formData.wearsGlasses} onValueChange={(value) => setFormData(prevState => ({ ...prevState, wearsGlasses: value }))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="glasses-yes" />
                  <Label htmlFor="glasses-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="glasses-no" />
                  <Label htmlFor="glasses-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Do you need delivery?</Label>
              <RadioGroup defaultValue={formData.needsDelivery} onValueChange={(value) => setFormData(prevState => ({ ...prevState, needsDelivery: value }))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="delivery-yes" />
                  <Label htmlFor="delivery-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="delivery-no" />
                  <Label htmlFor="delivery-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Submitting..." : "Place Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderNow;
