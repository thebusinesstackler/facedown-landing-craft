
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
import { Search, Plus, Calendar, Eye, EyeOff } from 'lucide-react';
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
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const orders = await getCustomerOrders();
      setCustomers(orders);
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

  const getPriceForPeriod = (period: string) => {
    switch (period) {
      case '1 Week Rental': return '$259';
      case '2 Week Rental': return '$320';
      case '3 Week Rental': return '$380';
      default: return `$${period}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCardDetailsReveal = () => {
    if (passwordInput === '1234') {
      setIsPasswordCorrect(true);
      setShowCardDetails(true);
      setPasswordInput('');
    } else {
      toast({
        title: "Incorrect password",
        description: "Please enter the correct password to view card details.",
        variant: "destructive"
      });
      setPasswordInput('');
    }
  };

  const closeCardDetails = () => {
    setShowCardDetails(false);
    setIsPasswordCorrect(false);
    setSelectedCustomer(null);
  };

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
          <p className="text-gray-600">Manage rental periods and customer information</p>
        </div>
        <Button className="flex items-center gap-2" onClick={loadCustomers}>
          <Plus className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Rental Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">1 Week Rental</CardTitle>
            <CardDescription>Standard recovery period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">$259</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">2 Week Rental</CardTitle>
            <CardDescription>Extended recovery period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">$320</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">3 Week Rental</CardTitle>
            <CardDescription>Maximum recovery period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-medical-blue">$380</div>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
          <CardDescription>Overview of all customer rental orders from the website</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No customer orders found. Orders will appear here when customers place them.
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
                    <TableCell>{customer.rental_period}</TableCell>
                    <TableCell>{new Date(customer.start_date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold">${customer.price}</TableCell>
                    <TableCell>
                      <Select value={customer.status} onValueChange={(value) => handleStatusUpdate(customer.id, value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                                <p className="text-sm text-gray-600">Price: ${customer.price}</p>
                                <p className="text-sm text-gray-600">Start Date: {new Date(customer.start_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">Status: {customer.status}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Payment Information</h4>
                                <p className="text-sm text-gray-600">
                                  Card: {customer.card_number_masked}
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
    </div>
  );
};

export default CustomersSection;
