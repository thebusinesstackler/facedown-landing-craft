
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

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

    if (action === 'login') {
      // Find user by username or email
      const { data: user, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .single()

      if (error || !user) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash)
      
      if (!isValid) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

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

    if (action === 'setup_admin_password') {
      // Hash the password and update the admin user
      const hashedPassword = await bcrypt.hash('BlessedYear2026!', 10)
      
      const { error } = await supabase
        .from('admin_users')
        .update({ password_hash: hashedPassword })
        .eq('email', 'thebusinesstackler@gmail.com')

      if (error) {
        throw error
      }

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
