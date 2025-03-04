
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronsLeft, 
  ChevronsRight, 
  ShoppingCart, 
  Users, 
  ClipboardList, 
  FileText,
  BarChart4,
  Settings,
  UserCircle
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <BarChart4 size={20} />, 
      path: '/' 
    },
    { 
      title: 'RFQ List', 
      icon: <ClipboardList size={20} />, 
      path: '/rfq-list' 
    },
    { 
      title: 'Create RFQ', 
      icon: <FileText size={20} />, 
      path: '/create-rfq' 
    },
    { 
      title: 'Proposals List', 
      icon: <FileText size={20} />, 
      path: '/proposals-list' 
    },
    { 
      title: 'Comparison View', 
      icon: <FileText size={20} />, 
      path: '/comparison-view' 
    },
    { 
      title: 'Call for Bids', 
      icon: <ShoppingCart size={20} />, 
      path: '/call-for-bids' 
    },
    { 
      title: 'Suppliers', 
      icon: <Users size={20} />, 
      path: '/suppliers' 
    },
    { 
      title: 'Settings', 
      icon: <Settings size={20} />, 
      path: '/settings' 
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    // Update main content margin
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (collapsed) {
        mainContent.classList.remove('main-content-collapsed');
        mainContent.classList.add('main-content');
      } else {
        mainContent.classList.remove('main-content');
        mainContent.classList.add('main-content-collapsed');
      }
    }
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-sidebar shadow-md z-10 transition-all duration-300 ${
        collapsed ? 'w-[80px]' : 'w-[260px]'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!collapsed && <div className="text-xl font-semibold text-blue-600">ProcureFlow</div>}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>
        
        {/* Profile Summary */}
        <div className={`p-4 border-b border-sidebar-border ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <UserCircle size={32} className="text-blue-600" />
          ) : (
            <div className="flex items-center space-x-3">
              <UserCircle size={36} className="text-blue-600" />
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-xs text-gray-500">Purchaser</div>
              </div>
            </div>
          )}
        </div>
        
        {/* Nav Menu */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2.5 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-sidebar-accent'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Footer */}
        <div className={`p-4 text-xs text-gray-500 border-t border-sidebar-border ${
          collapsed ? 'text-center' : ''
        }`}>
          {!collapsed && 'ProcureFlow © 2023'}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
