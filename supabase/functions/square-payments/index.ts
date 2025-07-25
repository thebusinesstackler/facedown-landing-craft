
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

    if (!squareApplicationId || !squareAccessToken || !squareLocationId) {
      throw new Error('Square credentials not fully configured')
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
            locationId: squareLocationId,
            environment: squareEnvironment,
            applicationId: squareApplicationId
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
        
        console.log('Processing payment with details:', {
          hasToken: !!token,
          hasVerificationToken: !!verificationToken,
          amount,
          orderId,
          customerEmail,
          customerName
        })

        // Convert amount to cents (Square uses cents)
        const amountMoney = {
          amount: Math.round(amount * 100),
          currency: 'USD',
        }

        const paymentData: any = {
          source_id: token,
          amount_money: amountMoney,
          location_id: squareLocationId,
          idempotency_key: crypto.randomUUID(),
          note: description,
          buyer_email_address: customerEmail,
          autocomplete: true,
          // Add reference ID for tracking
          reference_id: orderId ? `order_${orderId}` : undefined,
        }

        // Include verification token if provided (for 3D Secure)
        if (verificationToken) {
          paymentData.verification_token = verificationToken
          console.log('Including verification token for 3D Secure')
        }

        console.log('Sending payment request to Square:', {
          amount: amountMoney.amount,
          currency: amountMoney.currency,
          locationId: squareLocationId,
          hasVerificationToken: !!verificationToken,
          referenceId: paymentData.reference_id
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
          const errorMessage = result.errors?.[0]?.detail || result.errors?.[0]?.code || 'Payment failed'
          throw new Error(errorMessage)
        }

        const payment = result.payment
        console.log('Square payment successful:', {
          paymentId: payment.id,
          status: payment.status,
          cardBrand: payment.card_details?.card?.card_brand,
          last4: payment.card_details?.card?.last_4,
          totalMoney: payment.total_money
        })

        // Update customer order with payment information
        if (orderId) {
          const updateData = {
            transaction_id: payment.id,
            payment_status: payment.status,
            payment_amount: amount,
            payment_date: new Date().toISOString(),
            status: payment.status === 'COMPLETED' ? 'completed' : 'pending',
            card_brand: payment.card_details?.card?.card_brand,
            card_last_4: payment.card_details?.card?.last_4,
          }

          const { error: updateError } = await supabaseClient
            .from('customer_orders')
            .update(updateData)
            .eq('id', orderId)

          if (updateError) {
            console.error('Error updating order:', updateError)
          } else {
            console.log('Order updated successfully with payment info')
          }
        }

        return new Response(
          JSON.stringify({ 
            payment: {
              id: payment.id,
              status: payment.status,
              total_money: payment.total_money,
              card_details: payment.card_details,
              created_at: payment.created_at,
              updated_at: payment.updated_at
            },
            receiptUrl: payment.receipt_url,
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
