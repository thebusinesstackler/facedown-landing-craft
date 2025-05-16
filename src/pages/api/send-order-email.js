
export async function POST(request) {
  try {
    const { 
      name, 
      email, 
      phone, 
      message, 
      subject, 
      orderDetails, 
      supportEmail,
      resendApiKey, 
      isOrderConfirmation 
    } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { status: 400 }
      );
    }

    // Determine recipient based on the type of email
    const to = isOrderConfirmation ? email : supportEmail || 'support@facedownrecoveryequipment.com';
    
    // Build email content based on type
    let emailContent;
    if (isOrderConfirmation) {
      // Customer confirmation email
      emailContent = `
        <h2>Your Order Confirmation</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your order with Face Down Recovery Equipment.</p>
        <p><strong>Order Details:</strong></p>
        <p>Rental Package: ${orderDetails?.rentalPeriod || 'Standard Package'}</p>
        <p>Delivery Date: ${orderDetails?.deliveryDate || 'To be confirmed'}</p>
        <p>Delivery Address: ${orderDetails?.address || 'Not provided'}</p>
        <p>If you have any questions, please contact us at support@facedownrecoveryequipment.com.</p>
        <p>Thank you!</p>
      `;
    } else {
      // Admin notification email
      emailContent = `
        <h2>${subject || 'New Message'}</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <div>${message}</div>
      `;
    }

    console.log('Sending email to:', to);
    console.log('API Key:', `${resendApiKey.substring(0, 5)}...`);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'orders@facedownrecoveryequipment.com',
        to: to,
        subject: subject || `Order Confirmation for ${name}`,
        html: emailContent,
      }),
    });

    const data = await response.json();
    console.log('Resend API Response:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      { status: 500 }
    );
  }
}
