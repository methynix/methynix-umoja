import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-vicoba-dark antialiased">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 relative overflow-x-hidden">
        {/* Ambient background glows for professional tech touch */}
        <div className="fixed top-0 right-0 w-72 h-72 bg-vicoba-forest/[0.03] rounded-full blur-[120px] -z-10" />
        <div className="fixed bottom-0 left-64 w-72 h-72 bg-vicoba-gold/[0.03] rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;