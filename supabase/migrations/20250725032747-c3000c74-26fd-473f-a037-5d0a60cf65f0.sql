
-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- Create a simpler policy that doesn't cause recursion
-- This allows admin users to access the table without circular reference
CREATE POLICY "Admin users can access admin data" 
  ON admin_users 
  FOR ALL 
  USING (
    -- Allow access if the user's email matches an admin email in the table
    -- This avoids the circular reference by using a direct comparison
    email = (auth.jwt() ->> 'email') AND is_admin = true
  );

-- Also allow reading for authentication purposes (needed for login)
CREATE POLICY "Allow admin authentication" 
  ON admin_users 
  FOR SELECT 
  USING (true);
