
export async function POST(request) {
  try {
    const { 
      name, 
      email, 
      subject, 
      message, 
      resendApiKey, 
      orderDetails,
      isOrderConfirmation 
    } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { status: 400 }
      );
    }

    let htmlContent = '';
    
    if (isOrderConfirmation) {
      htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Order Confirmation</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your order! We are processing it and will deliver your recovery equipment as scheduled.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details:</h3>
            <p><strong>Package:</strong> ${orderDetails.rentalPeriod}</p>
            <p><strong>Estimated Delivery Date:</strong> ${orderDetails.deliveryDate}</p>
            <p><strong>Delivery Address:</strong> ${orderDetails.address}</p>
          </div>
          
          <p>Our team will contact you shortly to confirm delivery details and answer any questions you may have.</p>
          <p>For any immediate concerns, please contact our customer service at support@example.com.</p>
          
          <p style="margin-top: 30px;">Wishing you a speedy recovery,</p>
          <p><strong>The Recovery Equipment Team</strong></p>
        </div>
      `;
    } else {
      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message || 'Not provided'}</p>
      `;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: isOrderConfirmation ? email : 'your-business-email@example.com',
        subject: subject || `New Contact Form Submission from ${name}`,
        html: htmlContent,
      }),
    });

    const data = await response.json();

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
