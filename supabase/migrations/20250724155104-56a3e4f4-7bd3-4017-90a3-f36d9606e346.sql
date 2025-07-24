
-- Add Square integration columns to customer_orders table
ALTER TABLE public.customer_orders 
ADD COLUMN square_customer_id TEXT,
ADD COLUMN payment_status TEXT DEFAULT 'pending',
ADD COLUMN transaction_id TEXT,
ADD COLUMN payment_amount NUMERIC,
ADD COLUMN payment_date TIMESTAMP WITH TIME ZONE;

-- Create index for efficient Square customer lookup
CREATE INDEX idx_customer_orders_square_customer_id ON public.customer_orders(square_customer_id);
CREATE INDEX idx_customer_orders_payment_status ON public.customer_orders(payment_status);
