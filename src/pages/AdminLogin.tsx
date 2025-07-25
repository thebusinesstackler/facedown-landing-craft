
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = localStorage.getItem('fdr_admin_auth');
    if (adminAuth === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { 
          action: 'login',
          username: username,
          password: password
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        // Store admin session info
        localStorage.setItem('fdr_admin_auth', 'true');
        localStorage.setItem('fdr_admin_user', JSON.stringify(data.user));
        
        toast({
          title: "Login successful",
          description: `Welcome ${data.user.username}!`,
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-medical-blue via-slate-100 to-medical-burgundy p-4">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Face Down Recovery
          </h1>
          <p className="text-white/90 text-lg drop-shadow">
            Equipment Management System
          </p>
        </div>

        <Card className="glass-card neo-morph">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold gradient-text">
              Admin Login
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </CardContent>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Use: thebusinesstackler@gmail.com / BlessedYear2026!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
