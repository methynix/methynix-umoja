import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUser, FaPhone, FaArrowRight } from 'react-icons/fa6';
import axiosInstance from '../services/axiosInstance';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';
import { useAuth } from '../hooks/useAuth';

const VerifyMemberPage = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [loadingInfo, setLoadingInfo] = useState(true);
  const [info, setInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axiosInstance.get(`/auth/verify-member/${token}`);
        setInfo(res.data.data);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Link si sahihi au imekwisha muda.');
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchInfo();
  }, [token]);

  const onSetPassword = async (data) => {
    setSubmitting(true);
    try {
      const res = await axiosInstance.post(`/auth/verify-member/${token}/approve`, {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      const { token: jwt, data: { user } } = res.data;
      setSession(jwt, user);
      toast.success(t('member_verified_msg'));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Imeshindikana. Jaribu tena.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-vicoba-cream dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 p-10 w-full max-w-md relative z-10 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-vicoba-forest tracking-tight">METHYNIX VICOBA</h1>
          <p className="text-vicoba-dark dark:text-gray-100 font-medium mt-2 text-base">{t('verify_member_title')}</p>
        </div>

        {loadingInfo && (
          <div className="flex justify-center py-10"><Spinner /></div>
        )}

        {!loadingInfo && errorMsg && (
          <div className="space-y-4 text-center">
            <p className="text-sm text-vicoba-earth font-bold bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
              {errorMsg}
            </p>
            <Link to="/login" className="text-vicoba-forest hover:text-vicoba-leaf font-bold underline transition-colors">
              {t('back_to_login')}
            </Link>
          </div>
        )}

        {!loadingInfo && info && !confirmed && (
          <div className="space-y-6">
            <p className="text-sm text-vicoba-dark dark:text-gray-100 font-medium text-center">{t('confirm_identity_msg')}</p>
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <FaUser className="text-vicoba-forest" />
                <span className="font-bold text-vicoba-dark dark:text-gray-100">{info.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-vicoba-forest" />
                <span className="font-bold text-vicoba-dark dark:text-gray-100">{info.phone}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setConfirmed(true)}
              className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-vicoba-forest/20 active:scale-[0.99]"
            >
              {t('yes_this_is_me')}
            </button>
          </div>
        )}

        {!loadingInfo && info && confirmed && (
          <form onSubmit={handleSubmit(onSetPassword)} className="space-y-6">
            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              {t('set_password_msg')}
            </p>
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
              disabled={submitting}
              className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-vicoba-forest/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <Spinner /> : <>{t('activate_account_btn')} <FaArrowRight /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyMemberPage;
