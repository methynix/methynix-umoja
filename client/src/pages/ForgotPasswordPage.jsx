import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaShieldHalved, FaArrowRight } from 'react-icons/fa6';
import axiosInstance from '../services/axiosInstance';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const requestOTP = async () => {
    const phone = getValues('phone');
    const email = getValues('email');
    if (!phone || String(phone).trim().length !== 10) {
      toast.error('Tafadhali weka namba ya simu sahihi (tarakimu 10).');
      return;
    }
    if (!email || !String(email).trim()) {
      toast.error('Tafadhali weka email yako.');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/password-reset/request', { phone: phone.trim(), email: email.trim() });
      toast.success(res.data.message || t('reset_otp_sent'));
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Imeshindikana. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const phone = getValues('phone');
    const otp = getValues('otp');
    if (!otp || String(otp).trim().length !== 6) {
      toast.error('OTP lazima iwe tarakimu 6.');
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/password-reset/verify', { phone: phone.trim(), otp: otp.trim() });
      setResetToken(res.data.data.resetToken);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP si sahihi.');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/password-reset/confirm', {
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success(res.data.message || t('reset_done'));
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Imeshindikana kubadilisha password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vicoba-cream dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-10 w-full max-w-md relative z-10 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-vicoba-forest tracking-tight">METHYNIX VICOBA</h1>
          <p className="text-vicoba-dark dark:text-gray-100 font-medium mt-2 text-base">{t('forgot_password_title')}</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-vicoba-dark dark:text-gray-100 mb-2">{t('phone_number')}</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-vicoba-forest" />
                <input
                  {...register('phone', { required: true })}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf outline-none text-vicoba-dark dark:text-gray-100 text-base font-medium"
                  placeholder="07xxxxxxxx"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-vicoba-dark dark:text-gray-100 mb-2">{t('email_address')}</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-vicoba-forest" />
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-4 pl-12 rounded-xl focus:ring-2 focus:ring-vicoba-leaf outline-none text-vicoba-dark dark:text-gray-100 text-base font-medium"
                  placeholder="jina@email.com"
                />
              </div>
              <p className="text-[11px] text-gray-400 font-medium mt-1.5">{t('email_first_time_hint')}</p>
            </div>
            <button
              type="button"
              onClick={requestOTP}
              disabled={loading}
              className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-vicoba-forest/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : t('send_otp')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              {t('reset_otp_sent')}
            </p>
            <div>
              <label className="block text-sm font-bold text-vicoba-dark dark:text-gray-100 mb-2">
                <FaShieldHalved className="inline mr-1 text-vicoba-forest" />{t('otp_code')}
              </label>
              <input
                {...register('otp', { required: true })}
                maxLength={6}
                inputMode="numeric"
                className="w-full bg-gray-50 dark:bg-gray-950 border border-emerald-300 dark:border-emerald-700 p-4 rounded-xl focus:ring-2 focus:ring-vicoba-leaf outline-none text-vicoba-dark dark:text-gray-100 text-base font-bold tracking-[0.3em] text-center"
                placeholder="● ● ● ● ● ●"
              />
            </div>
            <button
              type="button"
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-vicoba-forest/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : t('verify_otp_btn')}
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit(onResetPassword)} className="space-y-6">
            <PasswordInput
              register={register}
              name="newPassword"
              errors={errors}
              label={t('new_password')}
              placeholder={t('new_password')}
              rules={{ required: 'Password inahitajika', minLength: { value: 6, message: 'Tumia herufi kuanzia 6' } }}
            />
            <PasswordInput
              register={register}
              name="confirmPassword"
              errors={errors}
              label={t('confirm_password')}
              placeholder={t('confirm_password')}
              rules={{ required: 'Tafadhali rudia password', validate: (value) => value === getValues('newPassword') || 'Password hazifanani!' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-vicoba-forest/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner /> : <>{t('reset_password_btn')} <FaArrowRight /></>}
            </button>
          </form>
        )}

        <p className="text-center text-vicoba-dark dark:text-gray-100 mt-8 text-sm font-medium">
          <Link to="/login" className="text-vicoba-forest hover:text-vicoba-leaf font-bold underline transition-colors">
            {t('back_to_login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
