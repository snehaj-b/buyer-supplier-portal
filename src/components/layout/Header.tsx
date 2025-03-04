
import React from 'react';
import { Bell, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { toast } = useToast();
  
  const showNotification = () => {
    toast({
      title: "Notifications",
      description: "You have 3 unread notifications",
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex justify-end items-center space-x-4">
      <button 
        onClick={showNotification}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
      >
        <Bell size={20} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <User size={16} className="text-blue-600" />
        </div>
        <div className="text-sm font-medium">Profile</div>
      </div>
    </header>
  );
};

export default Header;
