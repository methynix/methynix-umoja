import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserShield, FaGlobe, FaSignOutAlt, FaIdCard, FaUsers, FaPhone } from 'react-icons/fa';
import { useUserStats } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { data: user, isLoading } = useUserStats();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toast.success(lng === 'sw' ? 'Lugha imebadilishwa kuwa Kiswahili' : 'Language changed to English');
  };

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Generate initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header / Hero Section */}
      <div className="relative overflow-hidden card-glass p-8 border-b-4 border-neon-blue">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          {/* Avatar Area */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-neon-green to-neon-blue p-1 shadow-glow-blue">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-4xl font-black italic">
              {getInitials(user?.name)}
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-black uppercase italic tracking-tight text-white mb-2">
              {user?.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-neon-green/10 border border-neon-green/30 rounded text-neon-green text-xs font-bold uppercase tracking-widest">
                {user?.role}
              </span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-gray-400 text-xs font-bold uppercase tracking-widest">
                ID: {user?._id?.substring(user._id.length - 6).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase text-neon-green tracking-widest flex items-center gap-2">
            <FaIdCard className="text-sm" /> Taarifa Binafsi
          </h3>
          
          <div className="card-glass p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-xs" />
                <span className="text-sm uppercase font-bold tracking-tighter">Namba ya Simu</span>
              </div>
              <span className="text-white font-mono">{user?.phone}</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3 text-gray-400">
                <FaUsers className="text-xs" />
                <span className="text-sm uppercase font-bold tracking-tighter">Kikundi (Group Code)</span>
              </div>
              <span className="text-neon-blue font-bold">{user?.groupCode || 'Huna Kikundi'}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-3 text-gray-400">
                <FaUserShield className="text-xs" />
                <span className="text-sm uppercase font-bold tracking-tighter">Hali ya Akaunti</span>
              </div>
              <span className="text-neon-green text-xs font-black uppercase tracking-widest">Verified Member</span>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic uppercase text-neon-blue tracking-widest flex items-center gap-2">
            <FaGlobe className="text-sm" /> Mipangilio (Settings)
          </h3>
          
          <div className="card-glass p-6 space-y-6">
            {/* Language Switcher */}
            <div>
              <p className="text-gray-500 text-xs font-black uppercase mb-4 tracking-widest">Lugha ya Mfumo (Language)</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => changeLanguage('sw')}
                  className={`flex-1 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-300 border ${
                    i18n.language === 'sw' 
                    ? 'border-neon-green bg-neon-green/10 text-neon-green shadow-glow-green' 
                    : 'border-white/10 text-gray-500 hover:bg-white/5'
                  }`}
                >
                  Kiswahili
                </button>
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`flex-1 py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-300 border ${
                    i18n.language === 'en' 
                    ? 'border-neon-blue bg-neon-blue/10 text-neon-blue shadow-glow-blue' 
                    : 'border-white/10 text-gray-500 hover:bg-white/5'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-white/5">
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-red-500/30 text-red-500 font-black uppercase text-xs tracking-[0.2em] hover:bg-red-500/10 transition-all"
              >
                <FaSignOutAlt /> Ondoka Kwenye Mfumo
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        title="Ondoka (Logout)"
        message="Je, una uhakika unataka kuondoka kwenye mfumo wa Methynix-Umoja?"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

const ChangePasswordSection = () => {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = async (data) => {
    try {
      await axiosInstance.patch('/auth/update-password', data);
      toast.success('Password imebadilishwa!');
    } catch (err) {
      toast.error('Imeshindikana kubadili password');
    }
  };

  return (
    <section className="card-glass p-6 mt-6">
      <h3 className="text-neon-blue font-black uppercase text-xs mb-4">Badili Nywila (Change Password)</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="password" {...register('oldPassword')} className="input-glow w-full p-3 bg-white/5" placeholder="Nywila ya sasa" />
        <input type="password" {...register('newPassword')} className="input-glow w-full p-3 bg-white/5" placeholder="Nywila mpya" />
        <button className="btn-glow w-full py-3 rounded-xl font-black text-xs uppercase">Hifadhi</button>
      </form>
    </section>
  );
};

export default ProfilePage;