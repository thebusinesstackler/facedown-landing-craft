
import { supabase } from '@/integrations/supabase/client';

export interface CustomerOrderData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  rental_period?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  status?: string;
  card_number_masked?: string;
  card_name?: string;
  expiry_date?: string;
}

export const saveCustomerOrder = async (orderData: CustomerOrderData) => {
  try {
    const { data, error } = await supabase
      .from('customer_orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error saving order:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in saveCustomerOrder:', error);
    throw error;
  }
};

export const getCustomerOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('customer_orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCustomerOrders:', error);
    throw error;
  }
};

export const updateCustomerOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('customer_orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCustomerOrderStatus:', error);
    throw error;
  }
};

export const sendOrderEmail = async (type: 'step1' | 'completed', orderData: any) => {
  try {
    const response = await fetch('/api/functions/v1/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        packageDetails: orderData.packageDetails,
        price: orderData.price,
        address: orderData.address,
        needDate: orderData.needDate,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
