
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { hash, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      
      // Find user by username or email
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .single()

      if (error || !user) {
        console.log('User not found:', error)
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      console.log('User found, verifying password')

      // For initial setup, check if password is still temp_hash
      if (user.password_hash === 'temp_hash') {
        // Set up the actual password hash
        const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'BlessedYear2026!'
        const hashedPassword = await hash(adminPassword)
        
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ password_hash: hashedPassword })
          .eq('id', user.id)

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
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                is_admin: user.is_admin
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else {
          console.log('Password mismatch')
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid credentials' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          )
        }
      } else {
        // Verify password against stored hash
        const isValid = await compare(password, user.password_hash)
        
        if (!isValid) {
          console.log('Password verification failed')
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid credentials' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          )
        }

        console.log('Login successful')
        return new Response(
          JSON.stringify({ 
            success: true, 
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              is_admin: user.is_admin
            }
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (action === 'setup_admin_password') {
      console.log('Setting up admin password')
      
      // Hash the password and update the admin user
      const adminPassword = Deno.env.get('ADMIN_PASSWORD') || 'BlessedYear2026!'
      const hashedPassword = await hash(adminPassword)
      
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
