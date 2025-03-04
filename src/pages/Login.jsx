
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('purchaser');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (isLoggedIn && storedUserRole === 'purchaser') {
      navigate('/dashboard');
    } else if (isLoggedIn && storedUserRole === 'supplier') {
      navigate('/supplier/dashboard');
    }
  }, [navigate]);
  
  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter username and password",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be an API call for authentication
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', userRole);
    
    toast({
      title: "Success",
      description: `Logged in as ${userRole === 'supplier' ? 'Supplier' : 'Purchaser'}`,
    });
    
    if (userRole === 'supplier') {
      navigate('/supplier/dashboard');
    } else {
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Smart System Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <input
                  id="purchaser"
                  name="userRole"
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  checked={userRole === 'purchaser'}
                  onChange={() => setUserRole('purchaser')}
                />
                <label htmlFor="purchaser" className="ml-2 block text-sm text-gray-700">
                  Purchaser
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="supplier"
                  name="userRole"
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  checked={userRole === 'supplier'}
                  onChange={() => setUserRole('supplier')}
                />
                <label htmlFor="supplier" className="ml-2 block text-sm text-gray-700">
                  Supplier
                </label>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
