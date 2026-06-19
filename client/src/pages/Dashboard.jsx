import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useUserStats } from '../hooks/useUser';
import { useMyTransactions } from '../hooks/useTransaction';
import { useGlobalStats } from '../hooks/useStats';
import { 
  FaUsers, 
  FaLayerGroup, 
  FaMoneyBillWave, 
  FaUserShield, 
  FaClockRotateLeft,
  FaFileInvoiceDollar,
  FaPlus,
  FaHandHoldingDollar
} from 'react-icons/fa6';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: user, isLoading: uLoading } = useUserStats();
  const { data: transactions, isLoading: tLoading } = useMyTransactions();
  
  const isSuper = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin' || user?.role === 'secretary';
  const { data: globalStats, isLoading: sLoading } = useGlobalStats(isSuper);

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
    {isSuper ? 'Mfumo wa METHYNIX' : (user?.groupId?.name || 'Kikundi Chako')}
  </h1>
  <p className="text-vicoba-dark font-medium text-sm mt-1">
    {t('welcome_back')}, <span className="text-vicoba-forest font-bold">{user?.name}</span> 
  </p>
</div>

<div className="bg-vicoba-forest/10 px-4 py-2 rounded-full border border-vicoba-forest/20 flex items-center gap-2 self-start shadow-sm">
   <FaUserShield className="text-vicoba-forest text-sm" />
   <span className="text-xs font-bold text-vicoba-forest uppercase tracking-wide">{user?.role}</span>
</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {isSuper ? (
          <>
            <StatTile label="Wanachama Wote" value={globalStats?.totalUsers?.toLocaleString()} icon={<FaUsers />} color="border-vicoba-forest" />
            <StatTile label="Vikundi Hai" value={globalStats?.groupCount?.toLocaleString()} icon={<FaLayerGroup />} color="border-vicoba-gold" />
            <StatTile label="Mtaji wa Mfumo" value={`TZS ${globalStats?.totalCash?.toLocaleString()}`} icon={<FaMoneyBillWave />} color="border-vicoba-leaf" />
          </>
        ) : (
          <>
            <StatTile label={t('total_shares')} value={`TZS ${user?.shares?.toLocaleString()}`} icon={<FaMoneyBillWave />} color="border-vicoba-forest" />
            <StatTile label={t('borrowing_power')} value={`TZS ${(user?.shares * 3).toLocaleString()}`} icon={<FaHandHoldingDollar />} color="border-vicoba-gold" />
            <StatTile label={t('social_fund')} value={`TZS ${user?.socialFund?.toLocaleString()}`} icon={<FaUsers />} color="border-vicoba-leaf" />
          </>
        )}
      </div>

      {(isAdmin || isSuper) && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-vicoba-forest uppercase tracking-wider flex items-center gap-2 bg-vicoba-forest/5 py-1.5 px-3 rounded-md w-fit">
    {t('manage_console')}
</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {isSuper ? (
              <>
                <ConsoleBtn label="Vikundi" icon={<FaLayerGroup />} onClick={() => navigate('/dashboard/manage-groups')} />
                <ConsoleBtn label="Wasimamizi" icon={<FaUserShield />} onClick={() => navigate('/dashboard/manage-groups')} />
                <ConsoleBtn label="Matengenezo" icon={<FaFileInvoiceDollar />} onClick={() => navigate('/dashboard/manage-groups')} />
              </>
            ) : (
              <>
                <ConsoleBtn label={t('members')} icon={<FaUsers />} onClick={() => navigate('/dashboard/members')} />
                <ConsoleBtn label={t('approvals')} icon={<FaFileInvoiceDollar />} onClick={() => navigate('/dashboard/manage-loans')} />
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

<div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-vicoba-forest/5 overflow-hidden">
  <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
    <h3 className="text-base font-bold text-vicoba-dark flex items-center gap-2">
      <FaClockRotateLeft className="text-vicoba-gold" /> {t('recent_transactions')}
    </h3>
    <button onClick={() => navigate('/dashboard/shares')} className="text-xs font-bold text-vicoba-forest hover:text-vicoba-gold transition-colors underline">
      Angalia Zote
    </button>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[500px] text-left">
      <thead className="bg-gray-50 text-xs font-bold text-gray-500 border-b border-gray-100">
        <tr>
          <th className="p-4">Aina ya Miamala</th>
          <th className="p-4">Tarehe</th>
          <th className="p-4">Kiasi</th>
          <th className="p-4 text-right">Hali</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {transactions?.slice(0, 5).map(tx => (
          <tr key={tx._id} className="hover:bg-gray-50/80 transition-all">
            <td className="p-4 text-sm font-semibold text-vicoba-dark capitalize">{tx.type.replace('_', ' ').toLowerCase()}</td>
            <td className="p-4 text-xs text-gray-500 font-medium">{new Date(tx.createdAt).toLocaleDateString('en-GB')}</td>
            <td className="p-4 text-sm font-bold text-vicoba-forest">TZS {tx.amount?.toLocaleString()}</td>
            <td className="p-4 text-right">
              <span className="px-2.5 py-1 bg-emerald-50 text-vicoba-forest rounded-full text-xs font-bold border border-emerald-100 inline-block">
                {t('verified')}
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
  <div className={`bg-white border-l-4 ${color} p-5 rounded-2xl border border-gray-100 shadow-md shadow-vicoba-forest/5 flex items-center gap-4 transition-all hover:shadow-lg`}>
    <div className="p-4 bg-gray-50 text-vicoba-forest rounded-xl text-2xl border border-gray-100">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <h3 className="text-xl md:text-2xl font-extrabold text-vicoba-dark tracking-tight">{value}</h3>
    </div>
  </div>
);

const ConsoleBtn = ({ label, icon, onClick}) => (
  <button onClick={onClick} className={`p-4 md:p-5 bg-white border border-gray-200 rounded-xl transition-all text-left group shadow-sm hover:shadow-md hover:border-vicoba-forest active:scale-[0.98]`}>
    <div className="text-vicoba-gold group-hover:text-vicoba-forest transition-colors mb-3 text-2xl">{icon}</div>
    <p className="text-vicoba-dark font-bold text-sm tracking-tight">{label}</p>
  </button>
);

export default Dashboard;