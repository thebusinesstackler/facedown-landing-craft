
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Eye, Package, RefreshCw, CreditCard, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCustomerOrders, updateCustomerOrderStatus } from '@/utils/supabaseOrderUtils';
import { useToast } from '@/hooks/use-toast';

interface CustomerOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  rental_period: string;
  start_date: string;
  end_date: string;
  price: number;
  status: string;
  card_number_masked: string;
  card_name: string;
  expiry_date: string;
  created_at: string;
}

const CustomersSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<CustomerOrder[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUnmaskDialog, setShowUnmaskDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [unmaskedCards, setUnmaskedCards] = useState<Set<string>>(new Set());
  const [verifying, setVerifying] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const orders = await getCustomerOrders();
      // Filter out any test or invalid entries - only show orders with valid data
      const validOrders = orders.filter(order => 
        order.name && 
        order.email && 
        order.rental_period && 
        order.price && 
        order.start_date
      );
      setCustomers(validOrders);
    } catch (error) {
      console.error('Error loading customers:', error);
      toast({
        title: "Error loading customers",
        description: "Failed to load customer data from database.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate revenue metrics
  const totalRevenue = customers.reduce((sum, customer) => sum + (customer.price || 0), 0);
  const pendingRevenue = customers.filter(c => c.status === 'pending').reduce((sum, customer) => sum + (customer.price || 0), 0);
  const activeRevenue = customers.filter(c => c.status === 'active').reduce((sum, customer) => sum + (customer.price || 0), 0);
  const completedRevenue = customers.filter(c => c.status === 'completed').reduce((sum, customer) => sum + (customer.price || 0), 0);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateCustomerOrderStatus(orderId, newStatus);
      await loadCustomers(); // Reload the data
      toast({
        title: "Status updated",
        description: "Customer order status has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        description: "Failed to update customer order status.",
        variant: "destructive"
      });
    }
  };

  const handleShipmentUpdate = async (orderId: string) => {
    try {
      await updateCustomerOrderStatus(orderId, 'shipped');
      await loadCustomers();
      toast({
        title: "Equipment shipped",
        description: "Order has been marked as shipped.",
      });
    } catch (error) {
      console.error('Error updating shipment:', error);
      toast({
        title: "Error updating shipment",
        description: "Failed to update shipment status.",
        variant: "destructive"
      });
    }
  };

  const handleUnmaskRequest = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowUnmaskDialog(true);
    setAdminPassword('');
  };

  const verifyAdminPassword = async () => {
    if (!adminPassword) {
      toast({
        title: "Password required",
        description: "Please enter your admin password to unmask credit card details.",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);
    
    try {
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'validate_password',
          password: adminPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUnmaskedCards(prev => new Set([...prev, selectedOrderId]));
        setShowUnmaskDialog(false);
        setAdminPassword('');
        toast({
          title: "Access granted",
          description: "Credit card details have been unmasked.",
        });
      } else {
        toast({
          title: "Invalid password",
          description: "The admin password you entered is incorrect.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast({
        title: "Verification failed",
        description: "Failed to verify admin password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const maskCard = (orderId: string) => {
    setUnmaskedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(orderId);
      return newSet;
    });
  };

  const getCardDisplay = (customer: CustomerOrder) => {
    if (unmaskedCards.has(customer.id)) {
      // Show full card number (assuming it's stored in card_number_masked even when unmasked)
      return customer.card_number_masked.replace(/\*/g, '');
    }
    return customer.card_number_masked;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-lg">Loading customer data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage orders and revenue tracking</p>
        </div>
        <Button className="flex items-center gap-2" onClick={loadCustomers}>
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
            <CardDescription>All time earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending Orders</CardTitle>
            <CardDescription>Revenue from pending orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Active Rentals</CardTitle>
            <CardDescription>Revenue from active rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${activeRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Completed Orders</CardTitle>
            <CardDescription>Revenue from completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">${completedRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Orders ({filteredCustomers.length})</CardTitle>
          <CardDescription>Orders submitted through the website forms</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rental Details</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Payment Info</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No customer orders found. Orders will appear here when customers submit the form.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{customer.email}</div>
                        <div className="text-gray-500">{customer.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{customer.rental_period}</div>
                        <div className="text-gray-500">
                          Start: {new Date(customer.start_date).toLocaleDateString()}
                        </div>
                        {customer.end_date && (
                          <div className="text-gray-500">
                            End: {new Date(customer.end_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">${customer.price}</TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{getCardDisplay(customer)}</span>
                          {unmaskedCards.has(customer.id) ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => maskCard(customer.id)}
                              className="h-6 w-6 p-0"
                            >
                              <EyeOff className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnmaskRequest(customer.id)}
                              className="h-6 w-6 p-0"
                            >
                              <CreditCard className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="text-gray-500">{customer.card_name}</div>
                        <div className="text-gray-500">{customer.expiry_date}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={customer.status} onValueChange={(value) => handleStatusUpdate(customer.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {customer.status !== 'shipped' && customer.status !== 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShipmentUpdate(customer.id)}
                            className="flex items-center gap-1"
                          >
                            <Package className="h-4 w-4" />
                            Ship
                          </Button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Customer Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Personal Information</h4>
                                <p className="text-sm text-gray-600">{customer.name}</p>
                                <p className="text-sm text-gray-600">{customer.email}</p>
                                <p className="text-sm text-gray-600">{customer.phone}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Address</h4>
                                <p className="text-sm text-gray-600">
                                  {customer.address}<br />
                                  {customer.city}, {customer.state} {customer.zip_code}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Order Details</h4>
                                <p className="text-sm text-gray-600">Package: {customer.rental_period}</p>
                                <p className="text-sm text-gray-600">Revenue: ${customer.price}</p>
                                <p className="text-sm text-gray-600">Start Date: {new Date(customer.start_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">Status: {customer.status}</p>
                                <p className="text-sm text-gray-600">Order Date: {new Date(customer.created_at).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Payment Information</h4>
                                <p className="text-sm text-gray-600">
                                  Card: {getCardDisplay(customer)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Name: {customer.card_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Expires: {customer.expiry_date}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admin Password Dialog */}
      <Dialog open={showUnmaskDialog} onOpenChange={setShowUnmaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Verification Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your admin password to unmask credit card details.
            </p>
            <Input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && verifyAdminPassword()}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUnmaskDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAdminPassword}
                disabled={verifying || !adminPassword}
              >
                {verifying ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomersSection;
