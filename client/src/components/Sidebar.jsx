import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaThLarge,
  FaPiggyBank,
  FaMoneyBillWave,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaLayerGroup,
} from 'react-icons/fa';
import { useUserStats } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from './ConfirmModal';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user } = useUserStats();
  const { logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const role = user?.role;
  const isSuper = role === 'superadmin';
  const isLeader = role === 'admin' || role === 'secretary';

  const navItems = (
    isSuper
      ? [
          { path: '/dashboard', icon: <FaThLarge />, label: t('dashboard') },
          { path: '/dashboard/manage-groups', icon: <FaLayerGroup />, label: t('groups') },
          { path: '/dashboard/profile', icon: <FaUser />, label: t('profile') },
        ]
      : [
          { path: '/dashboard', icon: <FaThLarge />, label: t('dashboard') },
          { path: '/dashboard/shares', icon: <FaPiggyBank />, label: t('shares') },
          { path: '/dashboard/loans', icon: <FaMoneyBillWave />, label: t('loans') },
          isLeader && { path: '/dashboard/members', icon: <FaUsers />, label: t('members') },
          { path: '/dashboard/profile', icon: <FaUser />, label: t('profile') },
        ]
  ).filter(Boolean);

  const doLogout = () => {
    setConfirmOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col h-screen sticky top-0 z-50 shadow-sm shadow-vicoba-forest/5">
        <div className="p-6 pt-8">
          <h2 className="text-xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">
            METHYNIX <span className="text-vicoba-forest dark:text-vicoba-leaf block text-xs font-bold uppercase tracking-widest mt-0.5">Umoja Vikoba</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">by Methynix Software</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 pt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-vicoba-forest dark:text-vicoba-leaf border border-emerald-100/50 dark:border-emerald-800/40'
                    : 'text-gray-400 dark:text-gray-400 hover:text-vicoba-dark dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50 dark:border-gray-800">
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex items-center gap-3.5 px-4 py-3 w-full text-vicoba-earth bg-red-50/50 dark:bg-red-900/10 hover:bg-vicoba-earth hover:text-white rounded-xl font-bold text-sm transition-all"
          >
            <FaSignOutAlt />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 flex justify-around items-center p-2 z-[100] pb-safe shadow-lg">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center p-1.5 transition-all ${
                isActive ? 'text-vicoba-forest dark:text-vicoba-leaf font-bold scale-105' : 'text-gray-400'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] mt-0.5 font-medium tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <ConfirmModal
        isOpen={confirmOpen}
        title={t('logout_confirm_title')}
        message={t('logout_confirm_msg')}
        onConfirm={doLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default Sidebar;
