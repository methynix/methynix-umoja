import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { FaCalendarPlus, FaCalendarCheck, FaXmark, FaLock, FaLockOpen } from 'react-icons/fa6';
import { useGroupMeetings, useCreateMeeting } from '../hooks/useMeeting';
import { useUserStats } from '../hooks/useUser';
import Spinner from '../components/Spinner';

const MeetingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user } = useUserStats();
  const { data: meetings, isLoading } = useGroupMeetings();
  const createMutation = useCreateMeeting();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', type: 'regular', date: new Date().toISOString().slice(0, 10) }
  });

  const isLeader = ['admin', 'secretary', 'treasurer'].includes(user?.role);

  const onSubmit = (data) => {
    createMutation.mutate(data, { onSuccess: () => { setIsModalOpen(false); reset(); } });
  };

  const inputClass = 'w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-semibold transition-all';

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">{t('meetings')}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mt-1">
            {user?.groupId?.name}
          </p>
        </div>
        {isLeader && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-vicoba-forest hover:bg-emerald-900 text-white flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm w-full md:w-auto justify-center transition-colors shadow-md shadow-vicoba-forest/10 active:scale-[0.99]"
          >
            <FaCalendarPlus /> {t('start_meeting')}
          </button>
        )}
      </div>

      {meetings?.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-300">
            <FaCalendarCheck size={36} />
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-medium text-sm">{t('no_meetings')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings?.map(meeting => (
            <button
              key={meeting._id}
              onClick={() => navigate(`/dashboard/meetings/${meeting._id}`)}
              className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm shadow-vicoba-forest/5 hover:shadow-md hover:border-vicoba-forest/30 transition-all text-left flex items-center justify-between gap-4 active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${meeting.status === 'closed' ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : 'bg-emerald-50 text-vicoba-forest'}`}>
                  {meeting.status === 'closed' ? <FaLock size={16} /> : <FaLockOpen size={16} />}
                </div>
                <div>
                  <p className="font-bold text-vicoba-dark dark:text-gray-100 text-sm">{meeting.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                    {new Date(meeting.date).toLocaleDateString('sw-TZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  meeting.type === 'contribution'
                    ? 'bg-amber-50 border-amber-200 text-vicoba-gold'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {meeting.type === 'contribution' ? t('contribution_meeting') : t('regular_meeting')}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  meeting.status === 'closed'
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                    : 'bg-emerald-50 border-emerald-200 text-vicoba-forest'
                }`}>
                  {meeting.status === 'closed' ? t('meeting_closed') : t('meeting_open')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-vicoba-dark/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative">
            <button onClick={() => { setIsModalOpen(false); reset(); }} className="absolute top-4 right-4 text-gray-400 hover:text-vicoba-dark dark:hover:text-gray-100 transition-colors">
              <FaXmark size={20} />
            </button>
            <h3 className="text-xl font-bold text-vicoba-dark dark:text-gray-100 tracking-tight mb-6">{t('start_meeting')}</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5">{t('meeting_agenda')}</label>
                <input
                  {...register('title', { required: 'Ajenda ya mkutano inahitajika' })}
                  className={inputClass}
                  placeholder="Mfano: Mkutano wa kila mwezi, Januari"
                />
                {errors.title && <span className="text-xs text-vicoba-earth font-bold block mt-1">{errors.title.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5">{t('meeting_date')}</label>
                <input
                  type="date"
                  {...register('date')}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5">{t('meeting_type')}</label>
                <select {...register('type')} className={inputClass}>
                  <option value="regular">{t('regular_meeting')}</option>
                  <option value="contribution">{t('contribution_meeting')}</option>
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => { setIsModalOpen(false); reset(); }} className="flex-1 py-3 text-gray-500 dark:text-gray-300 font-bold text-sm hover:text-vicoba-dark dark:hover:text-gray-100 transition-colors">
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? <><Spinner /> {t('saving')}</> : t('start_meeting')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;
