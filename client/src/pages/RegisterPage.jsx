import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaLock, FaUsers, FaArrowRight, FaPiggyBank, FaShieldHalved } from 'react-icons/fa6';
import axiosInstance from '../services/axiosInstance';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [groupType, setGroupType] = useState('vicoba');
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const handleSendOTP = async () => {
    const phone = getValues('phone');
    if (!phone || String(phone).trim().length !== 10) {
      toast.error('Tafadhali weka namba ya simu sahihi (tarakimu 10).');
      return;
    }
    setSendingOTP(true);
    try {
      await axiosInstance.post('/auth/otp/request', { phone: String(phone).trim() });
      setOtpSent(true);
      toast.success('OTP imetumwa! Angalia ujumbe kwenye simu yako.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Imeshindikana kutuma OTP. Jaribu tena.');
    } finally {
      setSendingOTP(false);
    }
  };

  const onRegister = async (data) => {
    if (!otpSent) {
      toast.error(t('otp_required'));
      return;
    }
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
                    {...register('name', { required: 'Jina lako linahitajika' })}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
                    placeholder="Mussa au Asha..."
                  />
                </div>
                {errors.name && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('phone_number')}</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FaPhone className="absolute left-4 top-3.5 text-vicoba-forest" />
                    <input
                      {...register('phone', { required: 'Namba ya simu inahitajika' })}
                      className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
                      placeholder="07xxxxxxxx"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendingOTP}
                    className="shrink-0 px-3 py-2 rounded-xl bg-vicoba-forest hover:bg-emerald-900 text-white font-bold text-xs transition-colors disabled:opacity-60 whitespace-nowrap"
                  >
                    {sendingOTP ? <Spinner /> : otpSent ? t('resend_otp') : t('send_otp')}
                  </button>
                </div>
                {errors.phone && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.phone.message}</span>}
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">
                    <FaShieldHalved className="inline mr-1 text-vicoba-forest" />{t('otp_code')}
                  </label>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mb-1.5">{t('otp_sent_msg')}</p>
                  <input
                    {...register('otp', {
                      required: 'OTP inahitajika',
                      minLength: { value: 6, message: 'OTP ni tarakimu 6' },
                      maxLength: { value: 6, message: 'OTP ni tarakimu 6' },
                    })}
                    maxLength={6}
                    inputMode="numeric"
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-emerald-300 dark:border-emerald-700 p-3 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-bold tracking-[0.3em] transition-all text-center"
                    placeholder="● ● ● ● ● ●"
                  />
                  {errors.otp && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.otp.message}</span>}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <PasswordInput
                  register={register}
                  name="password"
                  errors={errors}
                  label="Nywila (Password)"
                  placeholder="Tengeneza password"
                  rules={{ required: 'Password inahitajika', minLength: { value: 6, message: 'Tumia herufi kuanzia 6' } }}
                />
                <PasswordInput
                  register={register}
                  name="confirmPassword"
                  errors={errors}
                  label={t('confirm_password')}
                  placeholder="Rudia tena password"
                  rules={{ required: 'Tafadhali rudia password', validate: (value) => value === getValues('password') || 'Password hazifanani!' }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-vicoba-forest text-xs font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-1 mb-2">{t('group_info')}</h3>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('group_type')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${groupType === 'vicoba' ? 'border-vicoba-forest bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                    <input type="radio" value="vicoba" defaultChecked {...register('type')} onChange={() => setGroupType('vicoba')} className="sr-only" />
                    <span className="block text-sm font-bold text-vicoba-dark dark:text-gray-100">{t('type_vicoba')}</span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{t('type_vicoba_desc')}</span>
                  </label>
                  <label className={`cursor-pointer rounded-xl border p-3 text-center transition-all ${groupType === 'chama' ? 'border-vicoba-forest bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-gray-700'}`}>
                    <input type="radio" value="chama" {...register('type')} onChange={() => setGroupType('chama')} className="sr-only" />
                    <span className="block text-sm font-bold text-vicoba-dark dark:text-gray-100">{t('type_chama')}</span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{t('type_chama_desc')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('group_name')}</label>
                <div className="relative">
                  <FaUsers className="absolute left-4 top-3.5 text-vicoba-forest" />
                  <input
                    {...register('groupName', { required: 'Jina la kikundi linahitajika' })}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
                    placeholder="Mfano: WANAWAKE WA NGUVU"
                  />
                </div>
                {errors.groupName && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.groupName.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('group_code')}</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-3.5 text-vicoba-forest" />
                  <input
                    {...register('groupCode', { required: 'Code ya kikundi inahitajika' })}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all"
                    placeholder="Tengeneza tarakimu fupi (e.g. 4589)"
                  />
                </div>
                {errors.groupCode && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.groupCode.message}</span>}
              </div>

              {groupType !== 'chama' && (
                <div>
                  <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('share_value')}</label>
                  <div className="relative">
                    <FaPiggyBank className="absolute left-4 top-3.5 text-vicoba-forest" />
                    <input
                      type="number"
                      min="0"
                      {...register('shareValue', { required: 'Thamani ya hisa inahitajika', min: { value: 1, message: 'Lazima iwe zaidi ya 0' } })}
                      className={`w-full bg-gray-50 dark:bg-gray-950 border ${errors.shareValue ? 'border-vicoba-earth' : 'border-gray-300 dark:border-gray-700'} p-3 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-medium transition-all`}
                      placeholder="Mfano: 10000"
                    />
                  </div>
                  {errors.shareValue && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.shareValue.message}</span>}
                </div>
              )}

              <p className="text-xs text-gray-500 dark:text-gray-300 font-medium bg-vicoba-cream dark:bg-gray-950 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 leading-snug">
                💡 {t('group_code_note')}
              </p>
            </div>
          </div>

          {!otpSent && (
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
              📱 Lazima uthibitishe namba yako ya simu kwanza. Bonyeza <strong>{t('send_otp')}</strong> karibu na namba yako.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !otpSent}
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
