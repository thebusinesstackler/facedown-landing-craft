
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
  cardDetails: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  };
  orderDate: string;
}

const CUSTOMERS_STORAGE_KEY = 'fdr_customer_orders';

export const saveCustomerOrder = (orderData: Omit<CustomerOrder, 'id' | 'orderDate'>): CustomerOrder => {
  const customers = getCustomerOrders();
  const newCustomer: CustomerOrder = {
    ...orderData,
    id: Date.now().toString(),
    orderDate: new Date().toISOString()
  };
  
  customers.push(newCustomer);
  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  return newCustomer;
};

export const getCustomerOrders = (): CustomerOrder[] => {
  const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

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
