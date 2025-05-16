
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, isToday, isBefore, startOfDay, endOfDay, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, TruckIcon } from "lucide-react";
import { calculateDeliveryDate } from '@/utils/deliveryUtils';

interface BookingCalendarProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | undefined;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateSelect, selectedDate }) => {
  const [availableSlots, setAvailableSlots] = useState<{[key: string]: number}>({});
  const [timeRemaining, setTimeRemaining] = useState<{hours: number, minutes: number, seconds: number}>({ 
    hours: 0, minutes: 0, seconds: 0 
  });
  const [canGetSameDayDelivery, setCanGetSameDayDelivery] = useState(false);
  const [nextDeliveryDate, setNextDeliveryDate] = useState<string>("");
  
  // Generate some mock availability data
  useEffect(() => {
    const today = new Date();
    const slots: {[key: string]: number} = {};
    
    // Generate next 14 days of availability
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      
      // Random number of slots between 0-5
      // Weekend days (Saturday and Sunday) have fewer slots
      const day = date.getDay();
      const isWeekend = day === 0 || day === 6;
      
      slots[dateString] = isWeekend ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 5) + 1;
    }
    
    setAvailableSlots(slots);
    
    // Set next delivery date based on utility function
    setNextDeliveryDate(calculateDeliveryDate());
    
    // Check if same-day delivery is possible
    const dayOfWeek = today.getDay();
    const hours = today.getHours();
    
    // Monday or Wednesday before 2pm
    if ((dayOfWeek === 1 || dayOfWeek === 3) && hours < 14) {
      setCanGetSameDayDelivery(true);
      
      // Calculate cutoff time - 2pm today
      const cutoffTime = new Date(today);
      cutoffTime.setHours(14, 0, 0, 0);
      
      // Update countdown timer
      const updateTimer = () => {
        const now = new Date();
        if (isBefore(now, cutoffTime)) {
          const diff = differenceInSeconds(cutoffTime, now);
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          
          setTimeRemaining({ hours, minutes, seconds });
        } else {
          setCanGetSameDayDelivery(false);
          clearInterval(timerInterval);
        }
      };
      
      updateTimer();
      const timerInterval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(timerInterval);
    }
  }, []);

  // Disable past dates and dates with no availability
  const isDateUnavailable = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const isBeforeToday = isBefore(date, startOfDay(new Date()));
    const noSlotsAvailable = availableSlots[dateString] === 0;
    
    return isBeforeToday || noSlotsAvailable;
  };
  
  const formatTimeRemaining = (): string => {
    const { hours, minutes, seconds } = timeRemaining;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-medical-green/10 to-medical-blue/10">
              <CardTitle className="text-lg text-gray-800">Select Delivery Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                disabled={isDateUnavailable}
                className="bg-white rounded-md pointer-events-auto"
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
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {/* Upcoming delivery dates */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-medical-blue/10 to-medical-green/10">
              <div className="flex items-center">
                <TruckIcon className="mr-2 h-5 w-5 text-medical-blue" />
                <CardTitle className="text-lg text-gray-800">Expected Delivery</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-1 text-sm">Standard delivery available:</p>
                  <p className="text-xl font-medium text-gray-800">{nextDeliveryDate}</p>
                </div>
                
                {/* Date selected summary */}
                {selectedDate && (
                  <div className="bg-medical-green/5 p-4 rounded-lg border border-medical-green/20">
                    <p className="text-gray-600 mb-1 text-sm">Your selected date:</p>
                    <p className="text-xl font-medium text-medical-green">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                    
                    {availableSlots[format(selectedDate, "yyyy-MM-dd")] !== undefined && (
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline" className="bg-medical-green/10 text-medical-green border-medical-green">
                          {availableSlots[format(selectedDate, "yyyy-MM-dd")]} slots available
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Same day delivery counter */}
          {canGetSameDayDelivery && (
            <Card className="bg-white border-2 border-medical-green">
              <CardHeader className="pb-3 bg-medical-green/10">
                <CardTitle className="text-lg flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-medical-green" />
                  <span className="text-gray-800">Same Day Order Window</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    Order within:
                  </p>
                  <div className="text-2xl font-mono font-bold text-medical-green">
                    {formatTimeRemaining()}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    to qualify for {isToday(new Date(nextDeliveryDate)) ? "same day" : "expedited"} delivery
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
