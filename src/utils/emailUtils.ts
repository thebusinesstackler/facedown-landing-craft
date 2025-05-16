
interface SendEmailProps {
  name: string;
  email: string;
  rentalPeriod: string;
  deliveryDate: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export const sendOrderConfirmationEmail = async ({
  name,
  email,
  rentalPeriod,
  deliveryDate,
  address,
  city,
  state,
  zipCode
}: SendEmailProps): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message: `Order confirmation for ${rentalPeriod}`,
        subject: 'Your Recovery Equipment Order Confirmation',
        orderDetails: {
          rentalPeriod,
          deliveryDate,
          address: `${address}, ${city}, ${state} ${zipCode}`
        },
        resendApiKey: 're_VcM1Sk1a_6B9CNbs16KsuSWtcQzTY2Hzp',
        isOrderConfirmation: true
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};
