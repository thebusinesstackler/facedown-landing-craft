-- Add missing columns to customer_orders table
ALTER TABLE public.customer_orders 
ADD COLUMN IF NOT EXISTS surgery_date text,
ADD COLUMN IF NOT EXISTS doctor_office text,
ADD COLUMN IF NOT EXISTS doctor_name text,
ADD COLUMN IF NOT EXISTS wears_glasses text,
ADD COLUMN IF NOT EXISTS height text,
ADD COLUMN IF NOT EXISTS weight text,
ADD COLUMN IF NOT EXISTS body_build text;