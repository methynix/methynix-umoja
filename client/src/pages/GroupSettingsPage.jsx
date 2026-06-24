import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaGear, FaUsers, FaPiggyBank } from 'react-icons/fa6';
import { FaHashtag } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import { useUserStats } from '../hooks/useUser';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const GroupSettingsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: user } = useUserStats();
  const group = user?.groupId;

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        groupCode: group.groupCode,
        shareValue: group.shareValue,
        socialFundAmount: group.socialFundAmount,
        mawazoAmount: group.mawazoAmount,
        loanThreshold: group.loanThreshold,
      });
    }
  }, [group, reset]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.patch('/groups/settings', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      toast.success(t('settings_saved'));
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Imeshindikana');
    },
  });

  const labelClass = 'block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5';
  const inputClass =
    'w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-semibold transition-all';

  return (
    <div className="space-y-6 pb-20 max-w-xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight flex items-center gap-2.5">
        <FaGear className="text-vicoba-forest" /> {t('group_settings')}
      </h2>

      <form
        onSubmit={handleSubmit((d) => mutation.mutate(d))}
        className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 space-y-5"
      >
        <div>
          <label className={labelClass}>{t('group_name')}</label>
          <div className="relative flex items-center">
            <FaUsers className="absolute left-4 text-gray-400 text-sm" />
            <input {...register('name', { required: t('required_field') })} className={inputClass} />
          </div>
          {errors.name && <span className="text-xs text-vicoba-earth font-bold block mt-1">{errors.name.message}</span>}
        </div>

        <div>
          <label className={labelClass}>{t('group_code_label')}</label>
          <div className="relative flex items-center">
            <FaHashtag className="absolute left-4 text-gray-400 text-sm" />
            <input {...register('groupCode', { required: t('required_field') })} className={inputClass} />
          </div>
          {errors.groupCode && <span className="text-xs text-vicoba-earth font-bold block mt-1">{errors.groupCode.message}</span>}
        </div>

        <div>
          <label className={labelClass}>{t('share_value')}</label>
          <div className="relative flex items-center">
            <FaPiggyBank className="absolute left-4 text-gray-400 text-sm" />
            <input
              type="number"
              min="0"
              {...register('shareValue', { required: t('required_field'), min: { value: 1, message: 'Lazima iwe zaidi ya 0' } })}
              className={inputClass}
            />
          </div>
          {errors.shareValue && <span className="text-xs text-vicoba-earth font-bold block mt-1">{errors.shareValue.message}</span>}
        </div>

        <div>
          <label className={labelClass}>{t('social_fund_amount')}</label>
          <div className="relative flex items-center">
            <FaPiggyBank className="absolute left-4 text-gray-400 text-sm" />
            <input type="number" min="0" {...register('socialFundAmount')} className={inputClass} placeholder="0" />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('mawazo_amount')}</label>
          <div className="relative flex items-center">
            <FaPiggyBank className="absolute left-4 text-gray-400 text-sm" />
            <input type="number" min="0" {...register('mawazoAmount')} className={inputClass} placeholder="0" />
          </div>
        </div>

        <div>
          <label className={labelClass}>{t('loan_threshold')}</label>
          <div className="relative flex items-center">
            <FaPiggyBank className="absolute left-4 text-gray-400 text-sm" />
            <input type="number" min="0" {...register('loanThreshold')} className={inputClass} placeholder="0" />
          </div>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium block mt-1">{t('loan_threshold_hint')}</span>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-vicoba-forest hover:bg-emerald-900 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {mutation.isPending ? <><Spinner /> {t('saving')}</> : t('save_changes')}
        </button>
      </form>
    </div>
  );
};

export default GroupSettingsPage;
