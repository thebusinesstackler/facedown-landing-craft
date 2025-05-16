
import { format, addDays } from 'date-fns';

export const calculateDeliveryDate = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday
  const hours = now.getHours();
  
  let deliveryDate: Date;
  
  if (dayOfWeek === 1 && hours < 14) {
    // Monday before 2pm = deliver Wednesday (2 days later)
    deliveryDate = addDays(now, 2);
  } else if (dayOfWeek === 2) {
    // Tuesday = deliver Thursday (2 days later)
    deliveryDate = addDays(now, 2);
  } else if (dayOfWeek === 4) {
    // Thursday = deliver Monday (4 days later)
    deliveryDate = addDays(now, 4);
  } else {
    // Default to next Monday if not eligible for expedited delivery
    const daysUntilMonday = (8 - dayOfWeek) % 7 || 7; // Calculate days until next Monday
    deliveryDate = addDays(now, daysUntilMonday);
  }
  
  return format(deliveryDate, 'EEEE, MMMM d, yyyy');
};

export const isValidDeliveryDay = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  
  // Valid delivery days are Monday, Wednesday, and Thursday (1, 3, 4)
  return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 4;
};
