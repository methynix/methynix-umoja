import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaUserShield, FaGlobe, FaSignOutAlt, FaIdCard, FaUsers, FaPhone, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useUserStats } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/ConfirmModal';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { data: user, isLoading } = useUserStats();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toast.success(lng === 'sw' ? 'Lugha imebadilishwa!' : 'Language updated!');
  };

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div></div>;

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'MS';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-up duration-700 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative overflow-hidden card-glass p-8 border-b-4 border-neon-blue">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neon-green to-neon-blue p-1 shadow-glow-blue">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-3xl font-black italic">{getInitials(user?.name)}</div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic text-white mb-2">{user?.name}</h1>
            <div className="flex gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-neon-green/10 border border-neon-green/30 rounded text-neon-green text-[10px] font-black uppercase">{user?.role}</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-gray-400 text-[10px] font-black uppercase tracking-widest">ID: {user?._id?.slice(-6).toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 2. PERSONAL INFO */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase text-neon-green tracking-widest flex items-center gap-3">
             <FaIdCard className="text-sm" /> Taarifa Binafsi
          </h3>
          <div className="card-glass p-6 space-y-4">
             <InfoRow icon={<FaPhone />} label="Namba ya Simu" value={user?.phone} />
             <InfoRow icon={<FaUsers />} label="Kikundi" value={user?.groupId?.name || 'Loading...'} />
             <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><FaUserShield /> Status</span>
                <span className="text-neon-green text-[10px] font-black uppercase flex items-center gap-1"><FaCheckCircle /> Verified</span>
             </div>
          </div>
        </div>

        {/* 3. SETTINGS & PASSWORD */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase text-neon-blue tracking-widest flex items-center gap-3">
             <FaGlobe className="text-sm" /> Mipangilio
          </h3>
          
          <div className="card-glass p-6 space-y-8">
            {/* Language Switcher */}
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase mb-4 tracking-widest text-center md:text-left">Lugha ya Mfumo</p>
              <div className="flex gap-4">
                <button onClick={() => changeLanguage('sw')} className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] border transition-all ${i18n.language === 'sw' ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-glow-green' : 'border-white/10 text-gray-500'}`}>Kiswahili</button>
                <button onClick={() => changeLanguage('en')} className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] border transition-all ${i18n.language === 'en' ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-glow-blue' : 'border-white/10 text-gray-500'}`}>English</button>
              </div>
            </div>

            {/* Password Section Integrated */}
            <div className="pt-6 border-t border-white/5">
               <ChangePasswordSection />
            </div>

            {/* Logout */}
            <button onClick={() => setIsLogoutModalOpen(true)} className="w-full py-4 border border-red-500/20 text-red-500 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-red-500/10 transition-all">Ondoka Kwenye Mfumo</button>
          </div>
        </div>
      </div>

      <ConfirmModal isOpen={isLogoutModalOpen} title="Ondoka?" message="Je, una uhakika unataka kutoka?" onConfirm={logout} onCancel={() => setIsLogoutModalOpen(false)} />
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex justify-between items-center border-b border-white/5 pb-3">
    <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase tracking-tighter">{icon} {label}</div>
    <span className="text-white font-bold text-sm uppercase">{value}</span>
  </div>
);

const ChangePasswordSection = () => {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
    try {
      await axiosInstance.patch('/auth/update-password', data);
      toast.success('Nywila imebadilishwa!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kosa limetokea');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex items-center gap-2 mb-2"><FaLock className="text-neon-blue text-xs" /><span className="text-[10px] font-black text-gray-500 uppercase">Usalama wa Nywila</span></div>
      <input type="password" {...register('oldPassword', { required: true })} className="input-glow w-full p-3 bg-white/5 text-sm" placeholder="Nywila ya sasa" />
      <input type="password" {...register('newPassword', { required: true, minLength: 6 })} className="input-glow w-full p-3 bg-white/5 text-sm" placeholder="Nywila mpya" />
      <button type="submit" className="w-full btn-glow py-3 rounded-xl font-black text-[10px] uppercase border-neon-blue text-neon-blue">Hifadhi Nywila</button>
    </form>
  );
};

export default ProfilePage;