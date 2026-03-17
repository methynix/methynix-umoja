import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      {/* Added pb-20 for mobile to clear the bottom nav, and p-4 for tighter mobile spacing */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 relative overflow-x-hidden">
        <div className="fixed top-0 right-0 w-64 h-64 bg-neon-green/5 blur-[120px] -z-10" />
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;