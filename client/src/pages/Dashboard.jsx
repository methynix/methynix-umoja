import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useUserStats } from '../hooks/useUser';
import { useMyTransactions } from '../hooks/useTransaction';
import { useGlobalStats } from '../hooks/useStats';
import { useGroupSummary } from '../hooks/useLoan';
import { 
  FaUsers, 
  FaLayerGroup, 
  FaMoneyBillWave, 
  FaUserShield, 
  FaClockRotateLeft,
  FaFileInvoiceDollar,
  FaPlus,
  FaHandHoldingDollar,
  FaGear
} from 'react-icons/fa6';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: user, isLoading: uLoading } = useUserStats();
  const { data: transactions, isLoading: tLoading } = useMyTransactions();
  
  const isSuper = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin' || user?.role === 'secretary' || user?.role === 'treasurer';
  const isChairman = user?.role === 'admin';
  const { data: globalStats, isLoading: sLoading } = useGlobalStats(isSuper);
  const { data: summary } = useGroupSummary();

  const handleMeetingClick = () => {
    toast('Coming Soon. Tunafanyia kazi kipengele hiki cha Kikao.', {
      style: {
        borderRadius: '10px',
        background: '#1B5E20',
        color: '#fff',
        border: '1px solid #D4A017',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });
  };

  if (uLoading || tLoading || (isSuper && sLoading)) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-24">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
  <h1 className="text-2xl md:text-3xl font-extrabold text-vicoba-forest tracking-tight">
    {isSuper ? t('dashboard') : (user?.groupId?.name || t('your_group'))}
  </h1>
  <p className="text-vicoba-dark dark:text-gray-100 font-medium text-sm mt-1">
    {t('welcome_back')}, <span className="text-vicoba-forest font-bold">{user?.name}</span> 
  </p>
</div>

<div className="bg-vicoba-forest/10 px-4 py-2 rounded-full border border-vicoba-forest/20 flex items-center gap-2 self-start shadow-sm">
   <FaUserShield className="text-vicoba-forest text-sm" />
   <span className="text-xs font-bold text-vicoba-forest uppercase tracking-wide">{t('role_' + (user?.role || 'member'))}</span>
</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {isSuper ? (
          <>
            <StatTile label={t('all_users')} value={globalStats?.totalUsers?.toLocaleString()} icon={<FaUsers />} color="border-vicoba-forest" />
            <StatTile label={t('active_groups')} value={globalStats?.groupCount?.toLocaleString()} icon={<FaLayerGroup />} color="border-vicoba-gold" />
            <StatTile label={t('system_capital')} value={`TZS ${globalStats?.totalCash?.toLocaleString()}`} icon={<FaMoneyBillWave />} color="border-vicoba-leaf" />
          </>
        ) : (
          <>
            <StatTile label={t('total_shares')} value={`TZS ${user?.shares?.toLocaleString()}`} icon={<FaMoneyBillWave />} color="border-vicoba-forest" />
            <StatTile label={t('borrowing_power')} value={`TZS ${(user?.shares * 3).toLocaleString()}`} icon={<FaHandHoldingDollar />} color="border-vicoba-gold" />
            <StatTile label={t('social_fund')} value={`TZS ${user?.socialFund?.toLocaleString()}`} icon={<FaUsers />} color="border-vicoba-leaf" />
          </>
        )}
      </div>

      {!isSuper && summary && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-vicoba-forest uppercase tracking-wider flex items-center gap-2 bg-vicoba-forest/5 py-1.5 px-3 rounded-md w-fit">
            {t('group_summary')}
          </h3>

          {isAdmin && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <SummaryCard label={t('total_group_shares')} value={summary.totalShares} />
              <SummaryCard label={t('total_group_social')} value={summary.totalSocialFund} />
              <SummaryCard label={t('total_group_mawazo')} value={summary.totalMawazo} />
              <SummaryCard label={t('borrowers_count')} value={summary.borrowers} money={false} />
              <SummaryCard label={t('total_loaned')} value={summary.totalLoaned} />
              <SummaryCard label={t('interest_profit')} value={summary.interestProfit} highlight />
            </div>
          )}

          <div className="bg-gradient-to-br from-vicoba-forest to-emerald-900 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-100">{t('my_dividend')}</p>
              <p className="text-[11px] text-emerald-200 font-medium mt-0.5">{t('dividend_hint')}</p>
            </div>
            <p className="text-2xl md:text-3xl font-extrabold">TZS {(summary.myDividend || 0).toLocaleString()}</p>
          </div>
        </div>
      )}

      {(isAdmin || isSuper) && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-vicoba-forest uppercase tracking-wider flex items-center gap-2 bg-vicoba-forest/5 py-1.5 px-3 rounded-md w-fit">
    {t('manage_console')}
</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {isSuper ? (
              <>
                <ConsoleBtn label={t('groups')} icon={<FaLayerGroup />} onClick={() => navigate('/dashboard/manage-groups')} />
                <ConsoleBtn label={t('system_admins')} icon={<FaUserShield />} onClick={() => navigate('/dashboard/manage-groups')} />
                <ConsoleBtn label={t('maintenance')} icon={<FaFileInvoiceDollar />} onClick={() => navigate('/dashboard/manage-groups')} />
              </>
            ) : (
              <>
                <ConsoleBtn label={t('members')} icon={<FaUsers />} onClick={() => navigate('/dashboard/members')} />
                <ConsoleBtn label={t('approvals')} icon={<FaFileInvoiceDollar />} onClick={() => navigate('/dashboard/manage-loans')} />
                {isChairman && (
                  <ConsoleBtn label={t('group_settings')} icon={<FaGear />} onClick={() => navigate('/dashboard/settings')} />
                )}
                <ConsoleBtn
                  label={t('session')}
                  icon={<FaPlus />}
                  onClick={handleMeetingClick}
                />
              </>
            )}
          </div>
        </div>
      )}

<div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 overflow-hidden">
  <div className="p-4 md:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50">
    <h3 className="text-base font-bold text-vicoba-dark dark:text-gray-100 flex items-center gap-2">
      <FaClockRotateLeft className="text-vicoba-gold" /> {t('recent_transactions')}
    </h3>
    <button onClick={() => navigate('/dashboard/shares')} className="text-xs font-bold text-vicoba-forest hover:text-vicoba-gold transition-colors underline">
      {t('view_all')}
    </button>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[500px] text-left">
      <thead className="bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-500 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
        <tr>
          <th className="p-4">{t('transaction_type')}</th>
          <th className="p-4">{t('date')}</th>
          <th className="p-4">{t('amount')}</th>
          <th className="p-4 text-right">{t('status')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {transactions?.slice(0, 5).map(tx => (
          <tr key={tx._id} className="hover:bg-gray-50/80 transition-all">
            <td className="p-4 text-sm font-semibold text-vicoba-dark dark:text-gray-100 capitalize">{tx.type.replace('_', ' ').toLowerCase()}</td>
            <td className="p-4 text-xs text-gray-500 dark:text-gray-300 font-medium">{new Date(tx.createdAt).toLocaleDateString('en-GB')}</td>
            <td className="p-4 text-sm font-bold text-vicoba-forest">TZS {tx.amount?.toLocaleString()}</td>
            <td className="p-4 text-right">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border inline-block ${
                tx.status === 'pending' ? 'bg-amber-50 text-vicoba-gold border-amber-100'
                : tx.status === 'failed' ? 'bg-red-50 text-vicoba-earth border-red-100'
                : 'bg-emerald-50 text-vicoba-forest border-emerald-100'
              }`}>
                {tx.status === 'pending' ? t('pending') : tx.status === 'failed' ? t('rejected') : t('verified')}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

const StatTile = ({ label, value, icon, color }) => (
  <div className={`bg-white dark:bg-gray-900 border-l-4 ${color} p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 flex items-center gap-4 transition-all hover:shadow-lg`}>
    <div className="p-4 bg-gray-50 dark:bg-gray-950 text-vicoba-forest rounded-xl text-2xl border border-gray-100 dark:border-gray-800">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-1">{label}</p>
      <h3 className="text-xl md:text-2xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">{value}</h3>
    </div>
  </div>
);

const ConsoleBtn = ({ label, icon, onClick}) => (
  <button onClick={onClick} className={`p-4 md:p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl transition-all text-left group shadow-sm hover:shadow-md hover:border-vicoba-forest active:scale-[0.98]`}>
    <div className="text-vicoba-gold group-hover:text-vicoba-forest transition-colors mb-3 text-2xl">{icon}</div>
    <p className="text-vicoba-dark dark:text-gray-100 font-bold text-sm tracking-tight">{label}</p>
  </button>
);

const SummaryCard = ({ label, value, money = true, highlight = false }) => (
  <div className={`p-4 rounded-2xl border shadow-sm ${highlight ? 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800/40' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
    <p className={`text-lg md:text-xl font-extrabold mt-1 ${highlight ? 'text-vicoba-gold' : 'text-vicoba-dark dark:text-gray-100'}`}>
      {money ? `TZS ${(value || 0).toLocaleString()}` : (value || 0)}
    </p>
  </div>
);

export default Dashboard;