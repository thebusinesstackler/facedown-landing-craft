
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
      
      // First, try to find user in custom admin_users table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .single()

      // If found in admin_users table, use custom authentication
      if (adminUser && !adminError) {
        console.log('User found in admin_users table, verifying password')

        // For initial setup, check if password is still temp_hash
        if (adminUser.password_hash === 'temp_hash') {
          // Set up the actual password hash
          const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'BlessedYear2026!'
          const hashedPassword = await hashPassword(adminPassword)
          
          const { error: updateError } = await supabase
            .from('admin_users')
            .update({ password_hash: hashedPassword })
            .eq('id', adminUser.id)

          if (updateError) {
            console.error('Error updating password:', updateError)
            throw updateError
          }

          // Check if the provided password matches the admin password
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
          } else {
            console.log('Password mismatch for custom admin user')
            // Continue to try Supabase auth
          }
        } else {
          // Verify password against stored hash
          const isValid = await verifyPassword(password, adminUser.password_hash)
          
          if (isValid) {
            console.log('Login successful with custom admin credentials')
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
          } else {
            console.log('Password verification failed for custom admin user')
            // Continue to try Supabase auth
          }
        }
      }

      // If not found in admin_users or password didn't match, try Supabase auth
      console.log('Attempting Supabase auth login')
      
      // Create a new Supabase client for auth operations
      const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
      
      const { data: authData, error: authError } = await supabaseAuth.auth.signInWithPassword({
        email: username.includes('@') ? username : `${username}@gmail.com`,
        password: password
      })

      if (authError) {
        console.log('Supabase auth failed:', authError.message)
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      if (authData.user) {
        console.log('Supabase auth successful, checking admin privileges')
        
        // Check if this user should have admin access
        // For now, we'll allow the specific admin email
        const adminEmail = 'thebusinesstackler@gmail.com'
        
        if (authData.user.email === adminEmail) {
          console.log('User is authorized admin via Supabase auth')
          
          // Create or update admin user record
          const { data: existingAdmin, error: findError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', authData.user.email)
            .single()

          let adminUserData = existingAdmin

          if (findError || !existingAdmin) {
            // Create admin user record
            const { data: newAdmin, error: createError } = await supabase
              .from('admin_users')
              .insert({
                username: authData.user.email.split('@')[0],
                email: authData.user.email,
                password_hash: 'supabase_auth', // Mark as Supabase auth user
                role: 'admin',
                is_admin: true
              })
              .select()
              .single()

            if (createError) {
              console.error('Error creating admin user record:', createError)
            } else {
              adminUserData = newAdmin
            }
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              user: {
                id: adminUserData?.id || authData.user.id,
                username: adminUserData?.username || authData.user.email.split('@')[0],
                email: authData.user.email,
                role: adminUserData?.role || 'admin',
                is_admin: true
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          console.log('User authenticated but not authorized as admin')
          return new Response(
            JSON.stringify({ success: false, error: 'User not authorized as admin' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
          )
        }
      }

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid credentials' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    if (action === 'setup_admin_password') {
      console.log('Setting up admin password')
      
      // Hash the password and update the admin user
      const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'BlessedYear2026!'
      const hashedPassword = await hashPassword(adminPassword)
      
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: hashedPassword })
        .eq('email', 'thebusinesstackler@gmail.com')

      if (error) {
        console.error('Error setting up password:', error)
        throw error
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
