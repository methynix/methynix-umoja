import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStats } from '../hooks/useUser';
import { useMyTransactions } from '../hooks/useTransaction';
import { useMyLedger } from '../hooks/useLedger';
import { useGlobalStats } from '../hooks/useStats';
import { 
  FaWallet, FaUsers, FaChartLine, FaHandHoldingDollar, 
  FaUserShield, FaClockRotateLeft, FaArrowTrendUp,
  FaTriangleExclamation, FaFileInvoiceDollar, FaSitemap, FaPlus
} from 'react-icons/fa6';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Hooks za Data (Dynamic)
  const { data: user, isLoading: uLoading } = useUserStats();
  const { data: transactions, isLoading: tLoading } = useMyTransactions();
  const { data: ledger, isLoading: lLoading } = useMyLedger();
  
  const isSuper = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin' || user?.role === 'secretary';
  const { data: globalStats, isLoading: sLoading } = useGlobalStats(isSuper);

  // Logic ya Alert: Angalia mwezi wa sasa
  const currentMonthIdx = new Date().getMonth();
  const currentMonthData = ledger?.[currentMonthIdx];
  const hasNotPaid = currentMonthData?.status === 'Not Paid';

  if (uLoading || tLoading || lLoading || (isSuper && sLoading)) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-neon-green border-t-transparent rounded-full animate-spin shadow-glow-green"></div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* --- NOTIFICATION ALERT --- */}
      {hasNotPaid && (
        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-2xl flex items-center gap-4 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <div className="bg-red-500 p-3 rounded-xl text-white shadow-lg">
            <FaTriangleExclamation size={20} />
          </div>
          <div>
            <h4 className="text-red-500 font-black text-[10px] uppercase tracking-widest">Deni la Mwezi Huu</h4>
            <p className="text-white text-[10px] md:text-xs font-bold mt-1 uppercase opacity-90">
              Haujalipa michango ya {currentMonthData?.month}. Tafadhali wasiliana na Secretary.
            </p>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-green to-neon-blue p-0.5 shadow-glow-green">
             <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center text-2xl font-black italic text-white uppercase">
               {user?.groupId?.name?.charAt(0) || 'U'}
             </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black italic text-white uppercase tracking-tighter">
              {isSuper ? 'PLATFORM ROOT' : (user?.groupId?.name || 'METHYNIX VICOBA')}
            </h1>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              {t('welcome_back')}, <span className="text-neon-green">{user?.name}</span>
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3 self-start md:self-center backdrop-blur-md">
           <FaUserShield className="text-neon-blue" />
           <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.role}</span>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          label={isSuper ? 'Total Users' : 'Hisa Zako'}
          value={isSuper ? globalStats?.totalUsers : `TZS ${user?.shares?.toLocaleString()}`}
          icon={<FaWallet />} color="border-neon-green" glow="group-hover:text-neon-green"
        />
        <StatCard 
          label={isSuper ? 'Total Groups' : 'Uwezo wa Kukopa'}
          value={isSuper ? globalStats?.groupCount : `TZS ${(user?.shares * 3)?.toLocaleString()}`}
          icon={<FaHandHoldingDollar />} color="border-neon-blue" glow="group-hover:text-neon-blue"
        />
        <StatCard 
          label={isSuper ? 'Global Cash' : 'Mfuko wa Jamii'}
          value={isSuper ? `TZS ${globalStats?.totalCash?.toLocaleString()}` : `TZS ${user?.socialFund?.toLocaleString()}`}
          icon={<FaChartLine />} color="border-purple-500" glow="group-hover:text-purple-500"
        />
      </div>

      {/* --- MANAGEMENT CONSOLE (For Admins) --- */}
      {(isAdmin || isSuper) && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black italic text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
             <span className="h-[1px] w-6 bg-neon-green"></span> Management Console
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ConsoleBtn label="Members" icon={<FaUsers />} onClick={() => navigate('/dashboard/members')} color="hover:border-neon-green" />
            <ConsoleBtn label="Approvals" icon={<FaFileInvoiceDollar />} onClick={() => navigate('/dashboard/manage-loans')} color="hover:border-neon-blue" />
            {isSuper && <ConsoleBtn label="Groups" icon={<FaSitemap />} onClick={() => navigate('/dashboard/manage-groups')} color="hover:border-purple-500" />}
            <ConsoleBtn label="Meeting" icon={<FaPlus />} onClick={() => {}} color="hover:border-white/20" />
          </div>
        </div>
      )}

      {/* --- RECENT TRANSACTIONS --- */}
      <div className="card-glass border-white/5 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm md:text-lg font-black italic uppercase text-white flex items-center gap-2">
            <FaClockRotateLeft className="text-neon-blue" /> Miamala
          </h3>
          <button onClick={() => navigate('/dashboard/shares')} className="text-[9px] font-black uppercase text-neon-green">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left">
            <tbody className="divide-y divide-white/5">
              {transactions?.slice(0, 5).map(tx => (
                <tr key={tx._id} className="hover:bg-white/5 transition-all">
                  <td className="p-5 text-xs font-bold uppercase text-white">{tx.type.replace('_', ' ')}</td>
                  <td className="p-5 text-[10px] text-gray-500 font-mono">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="p-5 text-sm font-black text-white">TZS {tx.amount?.toLocaleString()}</td>
                  <td className="p-5 text-right"><span className="px-2 py-0.5 bg-neon-green/10 text-neon-green rounded text-[8px] font-black uppercase">Success</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ label, value, icon, color, glow }) => (
  <div className={`card-glass p-6 md:p-8 border-l-4 ${color} relative overflow-hidden group`}>
    <div className="relative z-10">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <h2 className="text-2xl md:text-3xl font-black text-white">{value}</h2>
      <div className="mt-4 flex items-center gap-2 text-neon-green text-[9px] font-black uppercase"><FaArrowTrendUp /> System Validated</div>
    </div>
    <div className={`absolute -right-4 -bottom-4 text-white/5 text-7xl transition-all duration-500 ${glow}`}>
      {icon}
    </div>
  </div>
);

const ConsoleBtn = ({ label, icon, onClick, color }) => (
  <button onClick={onClick} className={`p-4 md:p-6 card-glass border-white/5 ${color} transition-all text-left group`}>
    <div className="text-gray-400 group-hover:scale-110 transition-transform mb-2">{icon}</div>
    <p className="text-white font-black text-[10px] uppercase tracking-widest">{label}</p>
  </button>
);

export default Dashboard;