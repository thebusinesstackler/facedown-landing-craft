
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { getCustomerOrders } from '@/utils/supabaseOrderUtils';
import { Plus, Package, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  name: string;
  totalCount: number;
}

interface RentalPeriod {
  orderId: string;
  customerName: string;
  startDate: Date;
  endDate: Date;
  equipmentUsed: number;
}

const CalendarSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: '1', name: 'Face-Down Recovery Chair', totalCount: 4 }
  ]);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newEquipmentCount, setNewEquipmentCount] = useState(1);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [rentalPeriods, setRentalPeriods] = useState<RentalPeriod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentalData();
  }, []);

  const loadRentalData = async () => {
    try {
      const orders = await getCustomerOrders();
      const periods: RentalPeriod[] = orders
        .filter(order => order.start_date && order.end_date)
        .map(order => ({
          orderId: order.id,
          customerName: order.name,
          startDate: parseISO(order.start_date!),
          endDate: parseISO(order.end_date!),
          equipmentUsed: 1 // Assuming 1 equipment per order
        }));
      
      setRentalPeriods(periods);
    } catch (error) {
      console.error('Error loading rental data:', error);
      toast({
        title: "Error",
        description: "Failed to load rental data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEquipment = () => {
    if (newEquipmentName.trim() === '') {
      toast({
        title: "Validation Error",
        description: "Equipment name is required",
        variant: "destructive"
      });
      return;
    }

    const newEquipment: Equipment = {
      id: Date.now().toString(),
      name: newEquipmentName.trim(),
      totalCount: newEquipmentCount
    };

    setEquipment(prev => [...prev, newEquipment]);
    setNewEquipmentName('');
    setNewEquipmentCount(1);
    setShowAddEquipment(false);
    
    toast({
      title: "Equipment Added",
      description: `Added ${newEquipmentCount} ${newEquipmentName} to inventory`
    });
  };

  const getAvailableEquipment = (date: Date, equipmentId: string) => {
    const equipmentItem = equipment.find(eq => eq.id === equipmentId);
    if (!equipmentItem) return 0;

    const usedOnDate = rentalPeriods.filter(period => {
      return date >= period.startDate && date <= period.endDate;
    }).reduce((total, period) => total + period.equipmentUsed, 0);

    return Math.max(0, equipmentItem.totalCount - usedOnDate);
  };

  const getRentalsForDate = (date: Date) => {
    return rentalPeriods.filter(period => 
      isSameDay(date, period.startDate) || 
      isSameDay(date, period.endDate) ||
      (date >= period.startDate && date <= period.endDate)
    );
  };

  const getDateStatus = (date: Date) => {
    const rentals = getRentalsForDate(date);
    const deliveries = rentals.filter(rental => isSameDay(date, rental.startDate));
    const returns = rentals.filter(rental => isSameDay(date, rental.endDate));
    
    return { rentals, deliveries, returns };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading rental calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Equipment Rental Calendar</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Total Equipment: {equipment.reduce((sum, eq) => sum + eq.totalCount, 0)} pieces
            </div>
            <Button 
              onClick={() => setShowAddEquipment(!showAddEquipment)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Equipment
            </Button>
          </div>
        </div>
      </div>

      {/* Add Equipment Form */}
      {showAddEquipment && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Equipment Name</label>
                <Input
                  placeholder="e.g., Face-Down Recovery Chair"
                  value={newEquipmentName}
                  onChange={(e) => setNewEquipmentName(e.target.value)}
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={newEquipmentCount}
                  onChange={(e) => setNewEquipmentCount(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addEquipment}>Add Equipment</Button>
              <Button variant="outline" onClick={() => setShowAddEquipment(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Equipment Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {equipment.map(eq => {
                const availableToday = getAvailableEquipment(selectedDate, eq.id);
                return (
                  <div key={eq.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-gray-500">Total: {eq.totalCount} pieces</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{availableToday}</div>
                      <div className="text-sm text-gray-500">Available Today</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Rental Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full"
              modifiers={{
                hasRentals: (date) => getRentalsForDate(date).length > 0,
                hasDelivery: (date) => getDateStatus(date).deliveries.length > 0,
                hasReturn: (date) => getDateStatus(date).returns.length > 0
              }}
              modifiersClassNames={{
                hasRentals: "bg-blue-100 text-blue-900",
                hasDelivery: "bg-green-100 text-green-900 font-bold",
                hasReturn: "bg-orange-100 text-orange-900 font-bold"
              }}
            />
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span>Delivery Date</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                <span>Return Date</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                <span>Active Rental</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details */}
      <Card>
        <CardHeader>
          <CardTitle>Details for {format(selectedDate, 'EEEE, MMMM d, yyyy')}</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const { deliveries, returns, rentals } = getDateStatus(selectedDate);
            
            if (deliveries.length === 0 && returns.length === 0 && rentals.length === 0) {
              return <p className="text-gray-500">No scheduled activities for this date.</p>;
            }

            return (
              <div className="space-y-4">
                {deliveries.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Deliveries ({deliveries.length})</h4>
                    <div className="space-y-2">
                      {deliveries.map(rental => (
                        <div key={rental.orderId} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span>{rental.customerName}</span>
                          <Badge variant="outline" className="bg-green-100">
                            Deliver
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {returns.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Returns ({returns.length})</h4>
                    <div className="space-y-2">
                      {returns.map(rental => (
                        <div key={rental.orderId} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span>{rental.customerName}</span>
                          <Badge variant="outline" className="bg-orange-100">
                            Return
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment availability for selected date */}
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Equipment Availability</h4>
                  {equipment.map(eq => (
                    <div key={eq.id} className="flex items-center justify-between p-2 bg-blue-50 rounded mb-2">
                      <span>{eq.name}</span>
                      <Badge variant="outline" className="bg-blue-100">
                        {getAvailableEquipment(selectedDate, eq.id)} / {eq.totalCount} available
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSection;
