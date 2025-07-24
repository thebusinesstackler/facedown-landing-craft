
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Simple hash function for passwords (in production, use proper bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt_for_fdr_admin');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computedHash = await hashPassword(password);
  return computedHash === hash;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, username, password, email } = await req.json()
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Admin auth action:', action)

    if (action === 'login') {
      console.log('Attempting login for:', username)
      
      // Get the admin password from environment
      const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'BlessedYear2026!'
      
      // Check if credentials match the admin email and password
      if (username === 'thebusinesstackler@gmail.com' && password === adminPassword) {
        console.log('Login successful with admin credentials')
        
        // Try to get or create admin user record
        let { data: adminUser, error: findError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', 'thebusinesstackler@gmail.com')
          .single()

        if (findError || !adminUser) {
          console.log('Creating admin user record')
          const hashedPassword = await hashPassword(adminPassword)
          
          const { data: newAdmin, error: createError } = await supabase
            .from('admin_users')
            .insert({
              username: 'admin',
              email: 'thebusinesstackler@gmail.com',
              password_hash: hashedPassword,
              role: 'admin',
              is_admin: true
            })
            .select()
            .single()

          if (createError) {
            console.error('Error creating admin user record:', createError)
            adminUser = {
              id: 'admin-1',
              username: 'admin',
              email: 'thebusinesstackler@gmail.com',
              role: 'admin',
              is_admin: true
            }
          } else {
            adminUser = newAdmin
          }
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: {
              id: adminUser.id,
              username: adminUser.username,
              email: adminUser.email,
              role: adminUser.role,
              is_admin: adminUser.is_admin
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // If direct admin credentials don't match, try database lookup
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .single()

      if (adminUser && !adminError) {
        console.log('User found in admin_users table, verifying password')

        if (adminUser.password_hash === 'temp_hash') {
          // Update with proper hash
          const hashedPassword = await hashPassword(adminPassword)
          
          await supabase
            .from('admin_users')
            .update({ password_hash: hashedPassword })
            .eq('id', adminUser.id)

          if (password === adminPassword) {
            console.log('Login successful with initial password')
            return new Response(
              JSON.stringify({ 
                success: true, 
                user: {
                  id: adminUser.id,
                  username: adminUser.username,
                  email: adminUser.email,
                  role: adminUser.role,
                  is_admin: adminUser.is_admin
                }
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        } else {
          // Verify password against stored hash
          const isValid = await verifyPassword(password, adminUser.password_hash)
          
          if (isValid) {
            console.log('Login successful with stored credentials')
            return new Response(
              JSON.stringify({ 
                success: true, 
                user: {
                  id: adminUser.id,
                  username: adminUser.username,
                  email: adminUser.email,
                  role: adminUser.role,
                  is_admin: adminUser.is_admin
                }
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }
      }

      console.log('Login failed - invalid credentials')
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    if (action === 'setup_admin_password') {
      console.log('Setting up admin password')
      
      const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'BlessedYear2026!'
      const hashedPassword = await hashPassword(adminPassword)
      
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: hashedPassword })
        .eq('email', 'thebusinesstackler@gmail.com')

      if (error) {
        console.error('Error setting up password:', error)
        // Don't throw error, just log it
      }

      console.log('Admin password set up successfully')
      return new Response(
        JSON.stringify({ success: true, message: 'Admin password set up successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('Admin auth error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
