import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';

const LoginPage = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onLogin = async (data) => {
    const success = await login(data.phone, data.password, data.groupCode);
    if (success) {
      toast.success('Umeingia kikamilifu!');
      navigate('/dashboard', { replace: true });
    }
    // Failure toast is handled inside the auth provider.
  };

  return (
    <div className="min-h-screen bg-vicoba-cream dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-10 w-full max-w-md relative z-10 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-vicoba-forest tracking-tight">
            METHYNIX VICOBA
          </h1>
          <p className="text-vicoba-dark dark:text-gray-100 font-medium mt-2 text-base">
            {t('welcome_login')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onLogin)} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-bold text-vicoba-dark dark:text-gray-100 mb-2">
              {t('phone_number')}
            </label>
            <input
              {...register('phone', { required: 'Namba ya simu inahitajika' })}
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-4 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-base transition-all font-medium"
              placeholder="07xxxxxxxx"
            />
            {errors.phone && (
              <span className="text-sm font-bold text-vicoba-earth mt-1 block pl-1">
                {errors.phone.message}
              </span>
            )}
          </div>

          <PasswordInput
            register={register}
            name="password"
            errors={errors}
            label={t('pin_label')}
            placeholder={t('enter_password')}
            rules={{ required: 'Nywila inahitajika' }}
          />

          <div>
            <label className="block text-sm font-bold text-vicoba-dark mb-2">
              {t('group_code_label')} <span className="text-gray-400 font-medium">({t('optional')})</span>
            </label>
            <input
              {...register('groupCode')}
              className="w-full bg-gray-50 border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark text-base transition-all font-medium"
              placeholder={t('group_code_optional_hint')}
            />
            <span className="text-[11px] text-gray-400 font-medium mt-1 block pl-1">{t('group_code_login_note')}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md shadow-vicoba-forest/20 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner /> {t('logging_in')}
              </>
            ) : (
              t('login_btn')
            )}
          </button>
        </form>

        <p className="text-center text-vicoba-dark dark:text-gray-100 mt-8 text-sm font-medium">
          {t('not_member_yet')}{' '}
          <Link to="/register" className="text-vicoba-forest hover:text-vicoba-leaf font-bold underline transition-colors">
            {t('register_group_here')}
          </Link>
        </p>

        <p className="text-center text-gray-400 dark:text-gray-500 text-xs font-semibold mt-6">
          © {new Date().getFullYear()} Methynix Software
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
