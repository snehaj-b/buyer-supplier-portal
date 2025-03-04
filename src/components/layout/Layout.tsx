
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [userRole, setUserRole] = useState('purchaser');
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedUserRole = localStorage.getItem('userRole');
    
    if (!isLoggedIn) {
      navigate('/login');
    } else if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} />
      <div id="main-content" className="main-content">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
