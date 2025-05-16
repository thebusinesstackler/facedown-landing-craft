
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isToday, isBefore, startOfDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calculateDeliveryDate, isValidDeliveryDay } from '@/utils/deliveryUtils';

interface BookingCalendarProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [availableSlots, setAvailableSlots] = useState<{[key: string]: number}>({});
  
  // Generate some mock availability data
  useEffect(() => {
    const today = new Date();
    const slots: {[key: string]: number} = {};
    
    // Generate next 30 days of availability
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      
      // Only show slots for Monday, Wednesday, Thursday
      const day = date.getDay();
      if (day === 1 || day === 3 || day === 4) {
        slots[dateString] = Math.floor(Math.random() * 3) + 3; // 3-5 slots for delivery days
      } else {
        slots[dateString] = 0; // No slots for other days
      }
    }
    
    setAvailableSlots(slots);
  }, []);

  // Disable past dates, non-delivery days, and dates with no availability
  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const isBeforeToday = isBefore(date, startOfDay(new Date()));
    const noSlotsAvailable = availableSlots[dateString] === 0;
    const isValidDay = isValidDeliveryDay(date);
    
    return isBeforeToday || noSlotsAvailable || !isValidDay;
  };

  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={isDateUnavailable}
        className="bg-white rounded-md pointer-events-auto w-full"
        classNames={{
          day_today: "bg-medical-green/20 text-medical-green font-bold",
          day_selected: "bg-medical-green text-white hover:bg-medical-green hover:text-white",
          head_cell: "text-gray-500 font-medium",
          cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-full transition-colors",
          caption: "flex justify-center pt-1 px-4 relative items-center",
          caption_label: "text-gray-800 font-bold text-base",
          nav_button: "absolute border rounded-full p-1 bg-white text-gray-700 hover:bg-gray-100",
          table: "w-full border-collapse space-y-1 text-gray-900",
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
          month: "space-y-4 w-full"
        }}
      />

      {/* Display available slots for selected date */}
      {selectedDate && availableSlots[format(selectedDate, "yyyy-MM-dd")] > 0 && (
        <div className="mt-4">
          <Card className="bg-gray-50 border border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available slots:</span>
                <Badge variant="outline" className="bg-medical-green/10 text-medical-green border-medical-green">
                  {availableSlots[format(selectedDate, "yyyy-MM-dd")]} slots available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
