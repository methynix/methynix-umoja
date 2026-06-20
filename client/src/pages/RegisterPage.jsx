import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaLock, FaUsers, FaArrowRight, FaCamera } from 'react-icons/fa6';
import axiosInstance from '../services/axiosInstance';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  const onRegister = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', data);
      
      toast.success('Akaunti na Kikundi vimesajiliwa! Karibu METHYNIX-UMOJA.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Usajili umefeli. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vicoba-cream dark:bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="bg-white dark:bg-gray-900 p-6 md:p-10 w-full max-w-2xl rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-vicoba-forest/5">
  <div className="text-center mb-8">
    <h1 className="text-3xl md:text-4xl font-extrabold text-vicoba-forest tracking-tight">
      METHYNIX VICOBA
    </h1>
    <p className="text-vicoba-dark dark:text-gray-100 mt-2 text-sm font-semibold">{t('register_title')}</p>
  </div>

        <form onSubmit={handleSubmit(onRegister)} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-4">
  <h3 className="text-vicoba-forest text-xs font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">{t('personal_info')}</h3>
  
  <div>
    <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('full_name')}</label>
    <div className="relative">
      <FaUser className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("name", { required: "Jina lako linahitajika" })}
        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
        placeholder="Mussa au Asha..."
      />
    </div>
    {errors.name && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.name.message}</span>}
  </div>

  <div>
    <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('phone_number')}</label>
    <div className="relative">
      <FaPhone className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("phone", { required: "Namba ya simu inahitajika" })}
        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
        placeholder="07xxxxxxxx"
      />
    </div>
    {errors.phone && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.phone.message}</span>}
  </div>
             <div className="grid grid-cols-1 gap-4">

  <PasswordInput
    register={register}
    name="password"
    errors={errors}
    label="Nywila (Password)"
    placeholder="Tengeneza password"
    rules={{ required: "Password inahitajika", minLength: { value: 6, message: "Tumia herufi kuanzia 6" } }}
  />

  <PasswordInput
    register={register}
    name="confirmPassword"
    errors={errors}
    label={t('confirm_password')}
    placeholder="Rudia tena password"
    rules={{ required: "Tafadhali rudia password", validate: (value) => value === password || "Password hazifanani!" }}
  />

</div>
            </div>

           <div className="space-y-4">
  <h3 className="text-vicoba-forest text-xs font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">{t('group_info')}</h3>
  
  <div>
    <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('group_name')}</label>
    <div className="relative">
      <FaUsers className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("groupName", { required: "Jina la kikundi linahitajika" })}
        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
        placeholder="Mfano: WANAAWAKE WA SHUTI"
      />
    </div>
    {errors.groupName && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.groupName.message}</span>}
  </div>

  <div>
    <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('group_code')}</label>
    <div className="relative">
      <FaLock className="absolute left-4 top-3.5 text-vicoba-forest" />
      <input
        {...register("groupCode", { required: "Code ya kikundi inahitajika" })}
        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
        placeholder="Tengeneza tarakimu fupi (e.g. 4589)"
      />
    </div>
    {errors.groupCode && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.groupCode.message}</span>}
  </div>

  <p className="text-xs text-gray-500 dark:text-gray-300 font-medium bg-vicoba-cream dark:bg-gray-950 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 leading-snug">
    💡 {t('group_code_note')}
  </p>
</div>
          </div>

        <button 
    type="submit" 
    disabled={loading}
    className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 transition-colors shadow-md shadow-vicoba-forest/20 mt-6 active:scale-[0.99]"
  >
    {loading ? <><Spinner /> {t('signing_up')}</> : <>{t('complete_signup')} <FaArrowRight /></>}
  </button>
</form>

<div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
  <p className="text-vicoba-dark dark:text-gray-100 text-sm font-medium">
    {t('already_account')}{' '}
    <Link to="/login" className="text-vicoba-forest hover:text-vicoba-leaf font-bold underline transition-colors">
      {t('login_here')}
    </Link>
  </p>
</div>
<p className="text-center text-gray-400 dark:text-gray-500 text-xs font-semibold mt-6">
  © {new Date().getFullYear()} Methynix Software
</p>
      </div>
    </div>
  );
};

export default RegisterPage;