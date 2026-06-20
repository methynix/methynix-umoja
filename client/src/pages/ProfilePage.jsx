import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaUserShield, FaGlobe, FaSignOutAlt, FaIdCard, FaUsers, FaPhone, FaLock, FaMoon, FaSun } from 'react-icons/fa';
import { ThemeContext } from '../providers/ThemeProvider';
import { useUserStats } from '../hooks/useUser';
import { useAuth } from '../hooks/useAuth';
import ConfirmModal from '../components/ConfirmModal';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

const ROLE_LABELS = {
  superadmin: 'Msimamizi Mkuu',
  admin: 'Mwenyekiti',
  secretary: 'Katibu',
  member: 'Mwanachama',
};

const ProfilePage = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: user, isLoading } = useUserStats();
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lng', lng);
    toast.success(lng === 'sw' ? 'Lugha imebadilishwa!' : 'Language updated!');
  };

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 relative overflow-hidden">
  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
    <div className="w-20 h-20 rounded-full bg-vicoba-forest flex items-center justify-center text-2xl font-bold text-white shadow-md">
      {user?.name?.substring(0, 2).toUpperCase()}
    </div>
    <div className="text-center md:text-left">
      <h1 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 mb-2">{user?.name}</h1>
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        <span className="px-3 py-1 bg-emerald-50 text-vicoba-forest text-xs font-bold rounded-lg border border-emerald-100">{t('role_' + (user?.role || 'member'))}</span>
        <span className="px-3 py-1 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700">{t('member_no')}: {user?._id?.slice(-6)}</span>
      </div>
    </div>
  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-base font-bold text-vicoba-dark dark:text-gray-100 flex items-center gap-2">
   <FaIdCard className="text-vicoba-forest" /> {t('profile')}
</h3>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 space-y-4">
   <InfoRow icon={<FaPhone />} label={t('phone_number')} value={user?.phone} />
   <InfoRow icon={<FaUsers />} label={t('group_name')} value={user?.groupId?.name || '---'} />
</div>
        </div>

        <div className="space-y-6">
          <h3 className="text-base font-bold text-vicoba-dark dark:text-gray-100 flex items-center gap-2">
   <FaGlobe className="text-vicoba-gold" /> {t('settings')}
</h3>
          
         <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 space-y-6">
  <div>
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 tracking-wide">{t('appearance')}</p>
    <button onClick={toggleTheme} className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-3 font-bold text-sm text-vicoba-dark dark:text-gray-100 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:bg-gray-800 transition-colors">
      {theme === 'light' ? <><FaMoon className="text-vicoba-dark dark:text-gray-100" /> {t('dark_mode')}</> : <><FaSun className="text-vicoba-gold" /> {t('light_mode')}</>}
    </button>
  </div>

  <div>
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 tracking-wide">{t('language')}</p>
    <div className="flex gap-4">
      <button onClick={() => changeLanguage('sw')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm border transition-all ${i18n.language === 'sw' ? 'bg-vicoba-forest text-white border-vicoba-forest shadow-sm shadow-vicoba-forest/10' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:bg-gray-800'}`}>Kiswahili</button>
      <button onClick={() => changeLanguage('en')} className={`flex-1 py-2.5 rounded-xl font-bold text-sm border transition-all ${i18n.language === 'en' ? 'bg-vicoba-forest text-white border-vicoba-forest shadow-sm shadow-vicoba-forest/10' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-950 hover:bg-gray-100 dark:bg-gray-800'}`}>English</button>
    </div>
  </div>

            <div className="pt-5 border-t border-gray-100 dark:border-gray-800">
     <ChangePasswordSection />
  </div>

  <button onClick={() => setIsLogoutModalOpen(true)} className="w-full py-3 bg-red-50 text-vicoba-earth border border-red-100 font-bold text-sm rounded-xl hover:bg-vicoba-earth hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm shadow-red-500/5">
    <FaSignOutAlt /> {t('logout')}
  </button>
</div>
        </div>
      </div>

      <ConfirmModal isOpen={isLogoutModalOpen} title={t('logout_confirm_title')} message={t('logout_confirm_msg')} onConfirm={logout} onCancel={() => setIsLogoutModalOpen(false)} />
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0">
    <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 text-sm font-semibold">{icon} <span className="text-gray-500 dark:text-gray-300">{label}</span></div>
    <span className="font-bold text-sm text-vicoba-dark dark:text-gray-100">{value}</span>
  </div>
);

const ChangePasswordSection = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mb-2">
      <div className="flex items-center gap-2 mb-1"><FaLock className="text-vicoba-gold text-xs" /><span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{t('account_security')}</span></div>
      <PasswordInput
        register={register}
        name="oldPassword"
        errors={errors}
        placeholder={t('current_password')}
        rules={{ required: 'Ingiza nywila ya sasa' }}
      />
      <PasswordInput
        register={register}
        name="newPassword"
        errors={errors}
        placeholder={t('new_password')}
        rules={{ required: 'Ingiza nywila mpya', minLength: { value: 6, message: 'Tumia herufi kuanzia 6' } }}
      />
      <button type="submit" disabled={isSubmitting} className="w-full bg-vicoba-dark hover:bg-stone-800 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {isSubmitting ? <><Spinner /> {t('saving')}</> : t('save_new_password')}
      </button>
    </form>
  );
};

export default ProfilePage;