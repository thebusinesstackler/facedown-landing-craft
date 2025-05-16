
import { format, addDays } from 'date-fns';

export const calculateDeliveryDate = (): string => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 3 = Wednesday
  const hours = now.getHours();
  
  let deliveryDate: Date;
  
  if (dayOfWeek === 1 && hours < 14) {
    // Monday before 2pm = deliver Wednesday (2 days later)
    deliveryDate = addDays(now, 2);
  } else if (dayOfWeek === 3 && hours < 14) {
    // Wednesday before 2pm = deliver Friday (2 days later)
    deliveryDate = addDays(now, 2);
  } else {
    // Default to next Monday if not eligible for expedited delivery
    const daysUntilMonday = (8 - dayOfWeek) % 7 || 7; // Calculate days until next Monday
    deliveryDate = addDays(now, daysUntilMonday);
  }
  
  return format(deliveryDate, 'EEEE, MMMM d, yyyy');
};
