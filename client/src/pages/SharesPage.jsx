import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStats } from '../hooks/useUser';
import { useMyLedger } from '../hooks/useLedger';
import { useMyFines } from '../hooks/useMeeting';
import {
  FaPiggyBank,
  FaCalendarCheck,
  FaCircleExclamation,
  FaArrowTrendUp,
  FaTriangleExclamation
} from 'react-icons/fa6';
import { FaShieldAlt } from 'react-icons/fa';

const SharesPage = () => {
  const { data: user } = useUserStats();
  const { data: ledger, isLoading } = useMyLedger();
  const { data: fines } = useMyFines();
  const { t } = useTranslation();

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const unpaidFines = fines?.filter(f => !f.finePaid && f.fineAmount > 0) || [];

  return (
    <div className="space-y-8 animate-in slide-up duration-700 pb-24">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">
            {t('weekly_ledger')}
          </h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mt-1">
            {t('last_12_weeks')}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl flex items-center gap-3 shadow-sm shadow-vicoba-forest/5">
          <FaArrowTrendUp className="text-vicoba-forest" />
          <span className="text-xs font-bold text-vicoba-dark dark:text-gray-100">{t('system_ready')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 p-6 flex items-center gap-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-vicoba-forest">
            <FaPiggyBank size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-xs font-bold uppercase tracking-wide">{t('total_savings_shares')}</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">TZS {user?.shares?.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 flex items-center gap-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5">
          <div className="p-3.5 rounded-xl bg-amber-50 text-vicoba-gold">
            <FaShieldAlt size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-xs font-bold uppercase tracking-wide">{t('social_fund')}</p>
            <h3 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">TZS {user?.socialFund?.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {unpaidFines.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/40 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FaTriangleExclamation className="text-vicoba-earth" />
            <h3 className="text-sm font-extrabold text-vicoba-earth uppercase tracking-wide">{t('my_fines')}</h3>
          </div>
          <div className="space-y-3">
            {unpaidFines.map(f => (
              <div key={f._id} className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-xl border border-red-100 dark:border-red-800/30">
                <div>
                  <p className="text-sm font-bold text-vicoba-dark dark:text-gray-100">{f.meeting?.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                    {new Date(f.meeting?.date).toLocaleDateString('sw-TZ')} •{' '}
                    {f.status === 'absent' ? t('absent_label') : t('late_label')}
                  </p>
                </div>
                <span className="text-sm font-extrabold text-vicoba-earth">TZS {f.fineAmount?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-base font-bold text-vicoba-dark dark:text-gray-100 flex items-center gap-2">
          <FaCalendarCheck className="text-vicoba-forest" /> {t('weekly_breakdown')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ledger?.map((item, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-900 p-5 rounded-2xl border transition-all relative overflow-hidden ${
                item.status === 'Paid' ? 'border-emerald-100 shadow-sm shadow-vicoba-forest/5' :
                item.status === 'Not Paid' ? 'border-red-100 shadow-sm shadow-red-500/5' :
                'border-gray-100 dark:border-gray-800 opacity-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-vicoba-forest uppercase tracking-widest">
                    {t('week_label')} {item.weekNumber}
                  </span>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{item.label}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  item.status === 'Paid' ? 'border-emerald-200 text-vicoba-forest bg-emerald-50' :
                  item.status === 'Not Paid' ? 'border-red-200 text-vicoba-earth bg-red-50' :
                  'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-950'
                }`}>
                  {item.status === 'Paid' ? t('paid') : item.status === 'Not Paid' ? t('not_paid') : t('time_pending')}
                </span>
              </div>

              <div className="space-y-2.5 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('share_label')}:</span>
                  <span className={`text-sm font-bold ${item.status === 'Not Paid' ? 'text-vicoba-earth' : 'text-vicoba-dark dark:text-gray-100'}`}>
                    {item.shareAmount > 0 ? `TZS ${item.shareAmount.toLocaleString()}` : '0 TZS'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-2">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('social_label')}:</span>
                  <span className={`text-sm font-bold ${item.status === 'Not Paid' ? 'text-vicoba-earth' : 'text-vicoba-gold'}`}>
                    {item.socialAmount > 0 ? `TZS ${item.socialAmount.toLocaleString()}` : '0 TZS'}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-2">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{t('mawazo_type')}:</span>
                  <span className={`text-sm font-bold ${item.status === 'Not Paid' ? 'text-vicoba-earth' : 'text-vicoba-dark dark:text-gray-100'}`}>
                    {item.mawazoAmount > 0 ? `TZS ${item.mawazoAmount.toLocaleString()}` : '0 TZS'}
                  </span>
                </div>
              </div>

              {item.status === 'Not Paid' && (
                <div className="absolute top-3 right-3">
                  <FaCircleExclamation className="text-vicoba-earth" size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">
          Msimu wa {new Date().getFullYear()} • Methynix Vicoba Digital Ledger built by Methynix Software
        </p>
      </div>
    </div>
  );
};

export default SharesPage;
