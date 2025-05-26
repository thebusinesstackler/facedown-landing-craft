
import React, { useState } from 'react';
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
import { Search, Plus, Calendar } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  rentalPeriod: '1 week' | '3 weeks';
  startDate: string;
  endDate: string;
  price: number;
  status: 'active' | 'pending' | 'completed';
}

const CustomersSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      rentalPeriod: '1 week',
      startDate: '2024-01-15',
      endDate: '2024-01-22',
      price: 259,
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 234-5678',
      rentalPeriod: '3 weeks',
      startDate: '2024-01-10',
      endDate: '2024-01-31',
      price: 380,
      status: 'completed'
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceForPeriod = (period: string) => {
    switch (period) {
      case '1 week': return '$259';
      case '2 weeks': return '$320';
      case '3 weeks': return '$380';
      default: return '$259';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Customer Management</h2>
          <p className="text-gray-600">Manage rental periods and customer information</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Customer
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
            <Select>
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
          <CardTitle>Customer Rentals</CardTitle>
          <CardDescription>Overview of all customer rental periods</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{customer.email}</div>
                      <div className="text-gray-500">{customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.rentalPeriod}</TableCell>
                  <TableCell>{customer.startDate}</TableCell>
                  <TableCell>{customer.endDate}</TableCell>
                  <TableCell className="font-semibold">${customer.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersSection;
