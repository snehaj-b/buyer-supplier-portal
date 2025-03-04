
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
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
