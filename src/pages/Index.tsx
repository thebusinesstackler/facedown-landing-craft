
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Any password will work as per requirements
    if (password.trim() !== '') {
      // Set a simple auth flag in localStorage
      localStorage.setItem('fdr_admin_auth', 'true');
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard",
      });
      navigate('/admin/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Please enter a password",
        variant: "destructive",
      });
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
            <CardDescription className="text-gray-600">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-2 border-gray-300 focus:border-medical-blue transition-colors"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-medical-blue to-medical-burgundy hover:from-medical-burgundy hover:to-medical-blue transition-all duration-300 text-white font-semibold shadow-lg"
              >
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Secure access to Face Down Recovery Equipment management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
