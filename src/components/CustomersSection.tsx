import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Eye, Package, RefreshCw, CreditCard, EyeOff, UserPlus, Edit, Trash2, Ship, PackageCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { getCustomerOrders, updateCustomerOrderStatus, saveCustomerOrder, updateCustomerOrder, deleteCustomerOrder } from '@/utils/supabaseOrderUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  notes?: string;
}

interface EquipmentReturn {
  vitrectomy_chair: boolean;
  table_tap_support_unit: boolean;
  mirror: boolean;
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState<string>('');
  const [equipmentReturns, setEquipmentReturns] = useState<Record<string, EquipmentReturn>>({});
  
  // Add Customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    rental_period: '',
    start_date: '',
    price: '',
    card_number_masked: '',
    card_name: '',
    expiry_date: ''
  });
  const [addingCustomer, setAddingCustomer] = useState(false);
  
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

  const handleEditCustomer = (customer: CustomerOrder) => {
    setEditingCustomer({ ...customer });
    setShowEditDialog(true);
  };

  const handleSaveCustomerEdit = async () => {
    if (!editingCustomer) return;

    try {
      setUpdating(true);
      
      // Update the customer in the database
      await updateCustomerOrder(editingCustomer.id, {
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
        city: editingCustomer.city,
        state: editingCustomer.state,
        zip_code: editingCustomer.zip_code,
        rental_period: editingCustomer.rental_period,
        start_date: editingCustomer.start_date,
        price: editingCustomer.price,
        notes: editingCustomer.notes || ''
      });

      await loadCustomers();
      setShowEditDialog(false);
      setEditingCustomer(null);

      toast({
        title: "Customer Updated",
        description: "Customer information has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error updating customer",
        description: "Failed to update customer information.",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      setDeleting(customerId);
      await deleteCustomerOrder(customerId);
      await loadCustomers();
      
      toast({
        title: "Customer Deleted",
        description: "Customer has been successfully deleted from the system.",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error deleting customer",
        description: "Failed to delete customer from database.",
        variant: "destructive"
      });
    } finally {
      setDeleting('');
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCustomer.name || !newCustomer.email || !newCustomer.rental_period || !newCustomer.start_date || !newCustomer.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Rental Period, Start Date, Price).",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingCustomer(true);
      
      // Calculate end date (1 week from start date)
      const startDate = new Date(newCustomer.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      
      const customerData = {
        ...newCustomer,
        price: parseFloat(newCustomer.price),
        end_date: endDate.toISOString().split('T')[0],
        status: 'pending',
        card_number_masked: newCustomer.card_number_masked || '****-****-****-0000'
      };

      await saveCustomerOrder(customerData);
      await loadCustomers();
      
      // Reset form
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        rental_period: '',
        start_date: '',
        price: '',
        card_number_masked: '',
        card_name: '',
        expiry_date: ''
      });

      toast({
        title: "Customer Added",
        description: "Customer has been successfully added to the system.",
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      toast({
        title: "Error adding customer",
        description: "Failed to add customer to database.",
        variant: "destructive"
      });
    } finally {
      setAddingCustomer(false);
    }
  };

  const handleEquipmentReturnChange = (customerId: string, equipment: keyof EquipmentReturn, checked: boolean) => {
    setEquipmentReturns(prev => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [equipment]: checked
      }
    }));
  };

  const initializeEquipmentReturn = (customerId: string) => {
    if (!equipmentReturns[customerId]) {
      setEquipmentReturns(prev => ({
        ...prev,
        [customerId]: {
          vitrectomy_chair: false,
          table_tap_support_unit: false,
          mirror: false
        }
      }));
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
      
      // Open PirateShip.com in a new tab
      window.open('https://www.pirateship.com', '_blank');
      
      toast({
        title: "Equipment shipped",
        description: "Order has been marked as shipped and PirateShip opened for label creation.",
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
    setAdminPassword(''); // Reset password field
  };

  const verifyAdminPassword = async () => {
    if (!adminPassword) {
      toast({
        title: "Password required",
        description: "Please enter the admin password to unmask credit card details.",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);
    
    try {
      // Use Supabase Auth to verify the admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'thebusinesstackler@gmail.com',
        password: adminPassword,
      });

      if (error) {
        toast({
          title: "Authentication failed",
          description: "Invalid password.",
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        setUnmaskedCards(prev => new Set([...prev, selectedOrderId]));
        setShowUnmaskDialog(false);
        setAdminPassword('');
        
        // Sign out immediately for security
        await supabase.auth.signOut();
        
        toast({
          title: "Access granted",
          description: "Credit card details have been unmasked.",
        });
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      toast({
        title: "Verification failed",
        description: "Failed to verify admin credentials. Please try again.",
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
    <div className="space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-2 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customer Management</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage orders and customer information</p>
        </div>
        <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto" onClick={loadCustomers}>
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Revenue Overview - Mobile responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-l-4 border-blue-500 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-lg text-blue-700">Total Revenue</CardTitle>
            <CardDescription className="text-xs sm:text-sm">All time earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-yellow-500 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-lg text-yellow-700">Pending Orders</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Revenue from pending orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">${pendingRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-lg text-green-700">Active Rentals</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Revenue from active rentals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">${activeRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-gray-500 shadow-lg">
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-lg text-gray-700">Completed Orders</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Revenue from completed orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-gray-600">${completedRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Customer Orders, Add Customer, and Returns */}
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <Tabs defaultValue="orders" className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-purple-100">
              <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-xs sm:text-sm">Customer Orders</TabsTrigger>
              <TabsTrigger value="add-customer" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 text-xs sm:text-sm">Add Customer</TabsTrigger>
              <TabsTrigger value="returns" className="data-[state=active]:bg-white data-[state=active]:text-green-600 text-xs sm:text-sm">Returns</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <TabsContent value="orders">
            <CardContent className="px-2 sm:px-6">
              {/* Search and Filters - Mobile responsive */}
              <div className="flex flex-col gap-3 mb-4 sm:mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-blue-200 focus:border-blue-400 text-sm"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
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

              {/* Customer Table - Mobile responsive with horizontal scroll */}
              <div className="rounded-md border border-gray-200 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-700 min-w-[120px]">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[140px]">Contact</TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[150px]">Rental Details</TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[80px]">Revenue</TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[160px]">Payment Info</TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700 min-w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No customer orders found. Orders will appear here when customers submit the form or you add them manually.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id} className="hover:bg-blue-25 transition-colors">
                            <TableCell className="font-medium text-sm">{customer.name}</TableCell>
                            <TableCell>
                              <div className="text-xs sm:text-sm">
                                <div className="truncate max-w-[120px]">{customer.email}</div>
                                <div className="text-gray-500">{customer.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs sm:text-sm">
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
                            <TableCell className="font-semibold text-green-600 text-sm">${customer.price}</TableCell>
                            <TableCell>
                              <div className="text-xs space-y-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-mono text-xs">{getCardDisplay(customer)}</span>
                                  {unmaskedCards.has(customer.id) ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => maskCard(customer.id)}
                                      className="h-5 w-5 p-0"
                                    >
                                      <EyeOff className="h-3 w-3" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleUnmaskRequest(customer.id)}
                                      className="h-5 w-5 p-0"
                                    >
                                      <CreditCard className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                <div className="text-gray-500 truncate max-w-[100px]">{customer.card_name}</div>
                                <div className="text-gray-500">{customer.expiry_date}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select value={customer.status} onValueChange={(value) => handleStatusUpdate(customer.id, value)}>
                                <SelectTrigger className="w-24 h-8 text-xs">
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
                              <div className="flex flex-wrap gap-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditCustomer(customer)}
                                  className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50 h-7 px-2 text-xs"
                                >
                                  <Edit className="h-3 w-3" />
                                  <span className="hidden sm:inline">Edit</span>
                                </Button>
                                {customer.status !== 'shipped' && customer.status !== 'completed' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleShipmentUpdate(customer.id)}
                                    className="flex items-center gap-1 border-green-200 text-green-600 hover:bg-green-50 h-7 px-2 text-xs"
                                    title="Order Labels"
                                  >
                                    <Ship className="h-3 w-3" />
                                    <span className="hidden sm:inline">Ship</span>
                                  </Button>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 h-7 px-2 text-xs"
                                      disabled={deleting === customer.id}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span className="hidden sm:inline">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="max-w-sm sm:max-w-md">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {customer.name}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteCustomer(customer.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedCustomer(customer)}
                                      className="border-gray-200 text-gray-600 hover:bg-gray-50 h-7 px-2 text-xs"
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Customer Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 text-sm">
                                      <div>
                                        <h4 className="font-medium">Personal Information</h4>
                                        <p className="text-sm text-gray-600">{customer.name}</p>
                                        <p className="text-sm text-gray-600 break-words">{customer.email}</p>
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
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-gray-600 font-mono">
                                            Card: {getCardDisplay(customer)}
                                          </span>
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
                                        <p className="text-sm text-gray-600">
                                          Name: {customer.card_name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Expires: {customer.expiry_date}
                                        </p>
                                      </div>
                                      {customer.notes && (
                                        <div>
                                          <h4 className="font-medium">Notes</h4>
                                          <p className="text-sm text-gray-600">{customer.notes}</p>
                                        </div>
                                      )}
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
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="add-customer">
            <CardContent className="px-2 sm:px-6">
              <form onSubmit={handleAddCustomer} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name *</label>
                    <Input
                      id="name"
                      placeholder="Customer name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email *</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="customer@email.com"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input
                      id="phone"
                      placeholder="(555) 123-4567"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="rental_period" className="text-sm font-medium">Rental Period *</label>
                    <Select value={newCustomer.rental_period} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, rental_period: value }))}>
                      <SelectTrigger className="border-2 border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="Select rental period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 Week Face-Down Recovery Kit">1 Week Face-Down Recovery Kit</SelectItem>
                        <SelectItem value="2 Week Face-Down Recovery Kit">2 Week Face-Down Recovery Kit</SelectItem>
                        <SelectItem value="Face-Down Chair Only">Face-Down Chair Only</SelectItem>
                        <SelectItem value="Face-Down Table Only">Face-Down Table Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="start_date" className="text-sm font-medium">Start Date *</label>
                    <Input
                      id="start_date"
                      type="date"
                      value={newCustomer.start_date}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, start_date: e.target.value }))}
                      required
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price *</label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newCustomer.price}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, price: e.target.value }))}
                      required
                      className="border-2 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">Address Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="address" className="text-sm font-medium">Address</label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">City</label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={newCustomer.city}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium">State</label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={newCustomer.state}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="zip_code" className="text-sm font-medium">Zip Code</label>
                      <Input
                        id="zip_code"
                        placeholder="12345"
                        value={newCustomer.zip_code}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, zip_code: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">Payment Information (Optional)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label htmlFor="card_number_masked" className="text-sm font-medium">Card Number (Masked)</label>
                      <Input
                        id="card_number_masked"
                        placeholder="****-****-****-1234"
                        value={newCustomer.card_number_masked}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, card_number_masked: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="card_name" className="text-sm font-medium">Cardholder Name</label>
                      <Input
                        id="card_name"
                        placeholder="John Doe"
                        value={newCustomer.card_name}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, card_name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="expiry_date" className="text-sm font-medium">Expiry Date</label>
                      <Input
                        id="expiry_date"
                        placeholder="MM/YY"
                        value={newCustomer.expiry_date}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, expiry_date: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={addingCustomer} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto">
                    <UserPlus className="h-4 w-4" />
                    {addingCustomer ? 'Adding Customer...' : 'Add Customer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="returns">
            <CardContent className="px-2 sm:px-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-green-700">Equipment Returns</h3>
                    <p className="text-sm text-gray-600">Track returned equipment and get shipping addresses for PirateShip.com</p>
                  </div>
                  <Button 
                    onClick={() => window.open('https://www.pirateship.com', '_blank')}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full sm:w-auto"
                  >
                    <Ship className="h-4 w-4" />
                    Open PirateShip
                  </Button>
                </div>

                {/* Returns Table */}
                <div className="rounded-md border border-gray-200 overflow-hidden shadow-lg">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                        <TableRow>
                          <TableHead className="font-semibold text-gray-700 min-w-[150px]">Customer</TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[200px]">Return Address</TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[180px]">Equipment Status</TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[120px]">Rental Period</TableHead>
                          <TableHead className="font-semibold text-gray-700 min-w-[100px]">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.filter(c => c.status === 'active' || c.status === 'shipped' || c.status === 'completed').length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              No active rentals or shipments found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          customers
                            .filter(c => c.status === 'active' || c.status === 'shipped' || c.status === 'completed')
                            .map((customer) => {
                              initializeEquipmentReturn(customer.id);
                              const returns = equipmentReturns[customer.id] || { vitrectomy_chair: false, table_tap_support_unit: false, mirror: false };
                              
                              return (
                                <TableRow key={customer.id} className="hover:bg-green-25 transition-colors">
                                  <TableCell>
                                    <div className="text-sm">
                                      <div className="font-medium">{customer.name}</div>
                                      <div className="text-gray-500">{customer.email}</div>
                                      <div className="text-gray-500">{customer.phone}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm space-y-1">
                                      <div className="font-medium">{customer.address}</div>
                                      <div className="text-gray-600">{customer.city}, {customer.state} {customer.zip_code}</div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip_code}`;
                                          navigator.clipboard.writeText(address);
                                          toast({
                                            title: "Address copied",
                                            description: "Address has been copied to clipboard for PirateShip.com",
                                          });
                                        }}
                                        className="mt-1 h-6 px-2 text-xs border-green-200 text-green-600 hover:bg-green-50"
                                      >
                                        Copy Address
                                      </Button>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`vitrectomy-${customer.id}`}
                                          checked={returns.vitrectomy_chair}
                                          onCheckedChange={(checked) => 
                                            handleEquipmentReturnChange(customer.id, 'vitrectomy_chair', checked as boolean)
                                          }
                                        />
                                        <label htmlFor={`vitrectomy-${customer.id}`} className="text-xs sm:text-sm">
                                          Vitrectomy Chair
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`table-${customer.id}`}
                                          checked={returns.table_tap_support_unit}
                                          onCheckedChange={(checked) => 
                                            handleEquipmentReturnChange(customer.id, 'table_tap_support_unit', checked as boolean)
                                          }
                                        />
                                        <label htmlFor={`table-${customer.id}`} className="text-xs sm:text-sm">
                                          Table Tap Support Unit
                                        </label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`mirror-${customer.id}`}
                                          checked={returns.mirror}
                                          onCheckedChange={(checked) => 
                                            handleEquipmentReturnChange(customer.id, 'mirror', checked as boolean)
                                          }
                                        />
                                        <label htmlFor={`mirror-${customer.id}`} className="text-xs sm:text-sm">
                                          Mirror
                                        </label>
                                      </div>
                                      <div className="mt-2 text-xs">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                          Object.values(returns).every(Boolean) 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                          {Object.values(returns).every(Boolean) ? 'All Returned' : 'Partial Return'}
                                        </span>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-sm">
                                    <div className="font-medium">{customer.rental_period}</div>
                                    <div className="text-gray-500 text-xs">
                                      Started: {new Date(customer.start_date).toLocaleDateString()}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      customer.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                      customer.status === 'shipped' ? 'bg-orange-100 text-orange-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl text-blue-600">Edit Customer Information</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <Input
                    placeholder="Customer name"
                    value={editingCustomer.name || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="customer@email.com"
                    value={editingCustomer.email || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    placeholder="(555) 123-4567"
                    value={editingCustomer.phone || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rental Period</label>
                  <Select 
                    value={editingCustomer.rental_period} 
                    onValueChange={(value) => setEditingCustomer(prev => prev ? { ...prev, rental_period: value } : null)}
                  >
                    <SelectTrigger className="border-2 border-blue-200 focus:border-blue-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 Week Face-Down Recovery Kit">1 Week Face-Down Recovery Kit</SelectItem>
                      <SelectItem value="2 Week Face-Down Recovery Kit">2 Week Face-Down Recovery Kit</SelectItem>
                      <SelectItem value="Face-Down Chair Only">Face-Down Chair Only</SelectItem>
                      <SelectItem value="Face-Down Table Only">Face-Down Table Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <Input
                    type="date"
                    value={editingCustomer.start_date || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, start_date: e.target.value } : null)}
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editingCustomer.price || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                    className="border-2 border-blue-200 focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-medium text-purple-600">Address Information</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <Input
                    placeholder="123 Main Street"
                    value={editingCustomer.address || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, address: e.target.value } : null)}
                    className="border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      placeholder="City"
                      value={editingCustomer.city || ''}
                      onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, city: e.target.value } : null)}
                      className="border-2 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input
                      placeholder="State"
                      value={editingCustomer.state || ''}
                      onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, state: e.target.value } : null)}
                      className="border-2 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Zip Code</label>
                  <Input
                    placeholder="12345"
                    value={editingCustomer.zip_code || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, zip_code: e.target.value } : null)}
                    className="border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea
                    placeholder="Add any notes about this customer..."
                    rows={3}
                    value={editingCustomer.notes || ''}
                    onChange={(e) => setEditingCustomer(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    className="border-2 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveCustomerEdit}
                  disabled={updating}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Authentication Dialog */}
      <Dialog open={showUnmaskDialog} onOpenChange={setShowUnmaskDialog}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Password Required</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your admin password to unmask credit card details.
            </p>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyAdminPassword()}
                className="border-2 border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUnmaskDialog(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAdminPassword}
                disabled={verifying || !adminPassword}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto"
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
