
-- Fix the insecure customer_orders table RLS policies
-- Remove the dangerous "anyone can view/modify" policies and implement proper admin-only access

-- First, drop the existing insecure policies
DROP POLICY IF EXISTS "Anyone can create orders" ON customer_orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON customer_orders;
DROP POLICY IF EXISTS "Admin can update orders" ON customer_orders;
DROP POLICY IF EXISTS "Admin can delete orders" ON customer_orders;

-- Create secure policies that require proper admin authentication
-- Only allow authenticated admin users to view orders
CREATE POLICY "Only authenticated admins can view orders" ON customer_orders
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_admin = true
  )
);

-- Only allow authenticated admin users to update orders
CREATE POLICY "Only authenticated admins can update orders" ON customer_orders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_admin = true
  )
);

-- Only allow authenticated admin users to delete orders
CREATE POLICY "Only authenticated admins can delete orders" ON customer_orders
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_admin = true
  )
);

-- Allow public order creation (for customers placing orders)
CREATE POLICY "Public can create orders" ON customer_orders
FOR INSERT WITH CHECK (true);

-- Fix the insecure SQL function by adding proper search path protection
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$function$;

-- Create a secure function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = (auth.jwt() ->> 'email') 
    AND is_admin = true
  );
$$;
