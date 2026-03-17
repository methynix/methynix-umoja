import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaThLarge, FaMoneyBillWave, FaPiggyBank, FaUser, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { useUserStats } from '../hooks/useUser';

const Sidebar = () => {
  const navigate = useNavigate();
  const { data: user } = useUserStats();
  const isAdmin = user?.role === 'admin' || user?.role === 'secretary' || user?.role === 'superadmin';

  const navItems = [
    { path: '/dashboard', icon: <FaThLarge />, label: 'Home' },
    { path: '/dashboard/shares', icon: <FaPiggyBank />, label: 'Shares' },
    { path: '/dashboard/loans', icon: <FaMoneyBillWave />, label: 'Loans' },
    isAdmin && { path: '/dashboard/members', icon: <FaUsers />, label: 'Members' },
    { path: '/dashboard/profile', icon: <FaUser />, label: 'Me' },
  ].filter(Boolean);

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible only on md screens and up) */}
      <aside className="hidden md:flex w-64 bg-black border-r border-white/10 flex-col h-screen sticky top-0">
        <div className="p-8">
          <h2 className="text-2xl font-black bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent italic">METHYNIX</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-neon-green/10 text-neon-green border border-neon-green/20 shadow-glow-green' : 'text-gray-500 hover:text-white'}`}>
              {item.icon} <span className="font-bold text-sm uppercase">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION (Visible only on small screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 flex justify-around items-center p-2 z-[100]">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} end className={({ isActive }) => `flex flex-col items-center p-2 transition-all ${isActive ? 'text-neon-green' : 'text-gray-500'}`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-black uppercase mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;