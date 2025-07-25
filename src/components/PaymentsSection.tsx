
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, DollarSign, RefreshCw, History, AlertCircle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  square_customer_id?: string;
  payment_status?: string;
  price?: number;
}

const PaymentsSection = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [chargeAmount, setChargeAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCustomers = data.map(order => ({
        id: order.id,
        name: order.name,
        email: order.email,
        phone: order.phone || '',
        square_customer_id: order.square_customer_id,
        payment_status: order.payment_status,
        price: order.price,
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerSelect = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setChargeAmount(customer.price?.toString() || '');
      setDescription(`Payment for order ${customer.id.slice(0, 8)}`);
      
      // Fetch payment history for this customer
      await fetchPaymentHistory(customerId);
    }
  };

  const fetchPaymentHistory = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .eq('id', customerId)
        .not('transaction_id', 'is', null);

      if (error) throw error;
      setPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  const processRefund = async (transactionId: string, amount: number) => {
    try {
      const { error } = await supabase.functions.invoke('square-payments', {
        body: {
          action: 'refund_payment',
          paymentId: transactionId,
          amount,
          reason: 'Customer refund request',
        }
      });

      if (error) throw error;

      toast({
        title: "Refund Successful",
        description: `Refunded $${amount}`,
      });

      // Refresh payment history
      if (selectedCustomer) {
        await fetchPaymentHistory(selectedCustomer.id);
      }

    } catch (error) {
      console.error('Refund error:', error);
      toast({
        title: "Refund Failed",
        description: error.message || "Failed to process refund",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
        <Button onClick={fetchCustomers} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Selection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Select Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer">Choose Customer</Label>
              <Select value={selectedCustomer?.id || ''} onValueChange={handleCustomerSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.email}
                      {customer.payment_status && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded ${
                          customer.payment_status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {customer.payment_status}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCustomer && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Name:</strong> {selectedCustomer.name}
                </div>
                <div>
                  <strong>Email:</strong> {selectedCustomer.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedCustomer.phone}
                </div>
                <div>
                  <strong>Status:</strong> 
                  <span className={`ml-1 px-2 py-1 text-xs rounded ${
                    selectedCustomer.payment_status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedCustomer.payment_status || 'pending'}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Admin Payment Processing</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Real Square payments require customers to enter their payment details directly. 
                    Admin-initiated charges need to be implemented with customer payment collection.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="h-5 w-5 mr-2" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              paymentHistory.length > 0 ? (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div key={payment.transaction_id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">${payment.payment_amount}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(payment.payment_date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {payment.transaction_id?.slice(0, 12)}...
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            payment.payment_status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.payment_status}
                          </span>
                          {payment.payment_status === 'COMPLETED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => processRefund(payment.transaction_id, payment.payment_amount)}
                            >
                              Refund
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No payment history for this customer</p>
              )
            ) : (
              <p className="text-gray-500">Select a customer to view payment history</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentsSection;
