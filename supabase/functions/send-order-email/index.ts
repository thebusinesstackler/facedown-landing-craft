
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'step1' | 'completed';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageDetails?: string;
  price?: number;
  address?: string;
  needDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, customerName, customerEmail, customerPhone, packageDetails, price, address, needDate }: EmailRequest = await req.json();

    let subject = "";
    let htmlContent = "";

    if (type === 'step1') {
      subject = "New Order Started - Face Down Recovery";
      htmlContent = `
        <h2>New Order Started</h2>
        <p>A new customer has started an order:</p>
        <ul>
          <li><strong>Name:</strong> ${customerName}</li>
          <li><strong>Email:</strong> ${customerEmail}</li>
          <li><strong>Phone:</strong> ${customerPhone}</li>
          ${needDate ? `<li><strong>Equipment needed by:</strong> ${needDate}</li>` : ''}
        </ul>
        <p>They are currently filling out the order form.</p>
      `;
    } else if (type === 'completed') {
      subject = "Order Completed - Face Down Recovery";
      htmlContent = `
        <h2>Order Completed!</h2>
        <p>A customer has completed their order:</p>
        <ul>
          <li><strong>Name:</strong> ${customerName}</li>
          <li><strong>Email:</strong> ${customerEmail}</li>
          <li><strong>Phone:</strong> ${customerPhone}</li>
          ${packageDetails ? `<li><strong>Package:</strong> ${packageDetails}</li>` : ''}
          ${price ? `<li><strong>Price:</strong> $${price}</li>` : ''}
          ${address ? `<li><strong>Address:</strong> ${address}</li>` : ''}
        </ul>
        <p>Please contact the customer to arrange delivery.</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Face Down Recovery <orders@facedownrecoveryequipment.com>",
      to: ["thebusinesstackler@gmail.com"],
      subject: subject,
      html: htmlContent,
    });

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
