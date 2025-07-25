
export interface CustomerOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  rentalPeriod: '1 week' | '2 weeks' | '3 weeks';
  startDate: string;
  endDate: string;
  price: number;
  status: 'active' | 'pending' | 'completed';
  orderDate: string;
}

// Remove insecure localStorage usage - orders are now stored in Supabase
export const calculateEndDate = (startDate: string, period: string): string => {
  const start = new Date(startDate);
  let days = 7; // default 1 week
  
  if (period === '2 weeks') days = 14;
  if (period === '3 weeks') days = 21;
  
  const end = new Date(start);
  end.setDate(start.getDate() + days);
  return end.toISOString().split('T')[0];
};

export const maskCardNumber = (cardNumber: string): string => {
  return '**** **** **** ' + cardNumber.slice(-4);
};

// Note: Customer orders are now handled through Supabase with proper security
// Use the supabaseOrderUtils for all order operations
