
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SquareCustomer {
  id: string
  given_name?: string
  family_name?: string
  email_address?: string
}

interface PaymentRequest {
  token: string
  verificationToken?: string
  amount: number
  orderId?: string
  customerEmail: string
  customerName: string
  description?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const squareApplicationId = Deno.env.get('SQUARE_APPLICATION_ID')
    const squareAccessToken = Deno.env.get('SQUARE_ACCESS_TOKEN')
    const squareEnvironment = Deno.env.get('SQUARE_ENVIRONMENT') || 'sandbox'
    const squareLocationId = Deno.env.get('SQUARE_LOCATION_ID')

    if (!squareApplicationId || !squareAccessToken) {
      throw new Error('Square credentials not configured')
    }

    const baseUrl = squareEnvironment === 'production' 
      ? 'https://connect.squareup.com' 
      : 'https://connect.squareupsandbox.com'

    const { action, ...payload } = await req.json()

    console.log(`Processing Square action: ${action}`)

    switch (action) {
      case 'test_connection': {
        const response = await fetch(`${baseUrl}/v2/locations`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${squareAccessToken}`,
            'Square-Version': '2024-01-18',
          },
        })

        const result = await response.json()
        
        if (!response.ok) {
          console.error('Square connection test error:', result)
          throw new Error(result.errors?.[0]?.detail || 'Failed to connect to Square')
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Connected to Square successfully',
            locations: result.locations?.length || 0,
            locationId: squareLocationId || 'Not configured',
            environment: squareEnvironment
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'create_customer': {
        const { firstName, lastName, email } = payload
        
        const customerData = {
          given_name: firstName,
          family_name: lastName,
          email_address: email,
        }

        const response = await fetch(`${baseUrl}/v2/customers`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${squareAccessToken}`,
            'Content-Type': 'application/json',
            'Square-Version': '2024-01-18',
          },
          body: JSON.stringify(customerData),
        })

        const result = await response.json()
        
        if (!response.ok) {
          console.error('Square customer creation error:', result)
          throw new Error(result.errors?.[0]?.detail || 'Failed to create customer')
        }

        return new Response(
          JSON.stringify({ customer: result.customer }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'process_payment': {
        const { token, verificationToken, amount, orderId, customerEmail, customerName, description = 'Order payment' }: PaymentRequest = payload
        
        if (!squareLocationId) {
          throw new Error('Square location ID not configured')
        }

        // Convert amount to cents (Square uses cents)
        const amountMoney = {
          amount: Math.round(amount * 100),
          currency: 'USD',
        }

        const paymentData = {
          source_id: token,
          amount_money: amountMoney,
          location_id: squareLocationId,
          idempotency_key: crypto.randomUUID(),
          note: description,
          buyer_email_address: customerEmail,
          ...(verificationToken && { verification_token: verificationToken }),
        }

        console.log('Processing real Square payment:', {
          amount: amountMoney.amount,
          customer: customerName,
          orderId,
          locationId: squareLocationId,
        })

        const response = await fetch(`${baseUrl}/v2/payments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${squareAccessToken}`,
            'Content-Type': 'application/json',
            'Square-Version': '2024-01-18',
          },
          body: JSON.stringify(paymentData),
        })

        const result = await response.json()
        
        if (!response.ok) {
          console.error('Square payment error:', result)
          throw new Error(result.errors?.[0]?.detail || 'Payment failed')
        }

        console.log('Square payment successful:', result.payment.id)

        // Update customer order with payment information
        if (orderId) {
          const { error: updateError } = await supabaseClient
            .from('customer_orders')
            .update({
              transaction_id: result.payment.id,
              payment_status: result.payment.status,
              payment_amount: amount,
              payment_date: new Date().toISOString(),
              status: 'completed',
            })
            .eq('id', orderId)

          if (updateError) {
            console.error('Error updating order:', updateError)
          } else {
            console.log('Order updated successfully with payment info')
          }
        }

        return new Response(
          JSON.stringify({ 
            payment: result.payment,
            receiptUrl: result.payment.receipt_url,
            success: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'charge_customer': {
        const { customerId, amount, description = 'Admin charge', email, orderId } = payload
        
        // This is for admin-initiated charges - we'll need to implement
        // a way to collect payment method from customer first
        throw new Error('Admin charges require customer payment method collection')
      }

      case 'get_customer': {
        const { customerId } = payload
        
        const response = await fetch(`${baseUrl}/v2/customers/${customerId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${squareAccessToken}`,
            'Square-Version': '2024-01-18',
          },
        })

        const result = await response.json()
        
        if (!response.ok) {
          console.error('Square get customer error:', result)
          throw new Error(result.errors?.[0]?.detail || 'Failed to get customer')
        }

        return new Response(
          JSON.stringify({ customer: result.customer }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'refund_payment': {
        const { paymentId, amount, reason = 'Customer refund' } = payload
        
        const refundData = {
          idempotency_key: crypto.randomUUID(),
          amount_money: {
            amount: Math.round(amount * 100),
            currency: 'USD',
          },
          payment_id: paymentId,
          reason,
        }

        const response = await fetch(`${baseUrl}/v2/refunds`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${squareAccessToken}`,
            'Content-Type': 'application/json',
            'Square-Version': '2024-01-18',
          },
          body: JSON.stringify(refundData),
        })

        const result = await response.json()
        
        if (!response.ok) {
          console.error('Square refund error:', result)
          throw new Error(result.errors?.[0]?.detail || 'Refund failed')
        }

        return new Response(
          JSON.stringify({ refund: result.refund }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('Square payment function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
