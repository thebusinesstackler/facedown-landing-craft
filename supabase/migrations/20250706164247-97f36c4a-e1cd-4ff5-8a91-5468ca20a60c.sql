
-- Add DELETE policy for customer orders
CREATE POLICY "Admin can delete orders" 
  ON public.customer_orders 
  FOR DELETE 
  USING (true);

-- Update the admin_users table to include the business tackler email
INSERT INTO public.admin_users (username, email, password_hash, is_admin, role)
VALUES (
  'admin',
  'thebusinesstackler@gmail.com',
  -- This is a hashed version of a placeholder password - you'll need to update this
  '$2a$10$placeholder.hash.here',
  true,
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  role = 'admin';
