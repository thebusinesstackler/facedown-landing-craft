
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, DollarSign, CreditCard, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  customer_name: string;
  customer_email: string;
  transaction_id: string;
  payment_amount: number;
  payment_status: string;
  payment_date: string;
  rental_period: string;
}

const TransactionsSection = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*')
        .not('transaction_id', 'is', null)
        .eq('payment_status', 'COMPLETED')
        .order('payment_date', { ascending: false });

      if (error) throw error;

      const formattedTransactions = data.map(order => ({
        id: order.id,
        customer_name: order.name,
        customer_email: order.email,
        transaction_id: order.transaction_id,
        payment_amount: order.payment_amount,
        payment_status: order.payment_status,
        payment_date: order.payment_date,
        rental_period: order.rental_period,
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSquareReceiptUrl = (transactionId: string) => {
    const environment = localStorage.getItem('square_settings') 
      ? JSON.parse(localStorage.getItem('square_settings')!).environment 
      : 'sandbox';
    
    const baseUrl = environment === 'production' 
      ? 'https://squareup.com' 
      : 'https://squareupsandbox.com';
    
    return `${baseUrl}/receipt/preview/${transactionId}`;
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
        <h2 className="text-2xl font-bold text-gray-900">Successful Transactions</h2>
        <Button onClick={fetchTransactions} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${transactions.reduce((sum, t) => sum + (t.payment_amount || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Transaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${transactions.length > 0 ? (transactions.reduce((sum, t) => sum + (t.payment_amount || 0), 0) / transactions.length).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {new Date(transaction.payment_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.customer_name}</div>
                        <div className="text-sm text-gray-500">{transaction.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {transaction.transaction_id.slice(0, 12)}...
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        ${transaction.payment_amount?.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.rental_period}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getSquareReceiptUrl(transaction.transaction_id), '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No successful transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsSection;
