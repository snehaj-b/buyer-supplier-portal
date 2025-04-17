
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UserPlus, Mail, Lock, Phone, Building, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    userRole: 'purchaser'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      setLoading(true);
      const response = await authService.register(formData);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.data.user.userRole);
      localStorage.setItem('userData', JSON.stringify({
        fullName: response.data.data.user.fullName,
        email: response.data.data.user.email,
        company: response.data.data.user.company,
        phone: response.data.data.user.phone
      }));
      
      toast({
        title: "Registration Successful",
        description: `Welcome ${formData.fullName}! You've registered as a ${formData.userRole === 'supplier' ? 'Supplier' : 'Purchaser'}`,
      });
      
      if (formData.userRole === 'supplier') {
        navigate('/supplier/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">Create Your Account</CardTitle>
          <p className="text-sm text-gray-500 mt-2">Join our procurement platform to start bidding or purchasing</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="pl-10"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    className="pl-10"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>
              
              <div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <input
                  id="purchaser"
                  name="userRole"
                  type="radio"
                  className="h-4 w-4 text-blue-600 border-gray-300"
                  checked={formData.userRole === 'purchaser'}
                  onChange={() => setFormData(prev => ({ ...prev, userRole: 'purchaser' }))}
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
                  checked={formData.userRole === 'supplier'}
                  onChange={() => setFormData(prev => ({ ...prev, userRole: 'supplier' }))}
                />
                <label htmlFor="supplier" className="ml-2 block text-sm text-gray-700">
                  Supplier
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 py-6"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                <>
                  <UserPlus className="mr-2" size={18} /> Register
                </>
              )}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
