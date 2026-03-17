import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStats } from '../hooks/useUser';
import { useMyTransactions } from '../hooks/useTransaction';
import { useGlobalStats } from '../hooks/useStats';
import { 
  FaWallet, 
  FaUsers, 
  FaChartLine, 
  FaHandHoldingDollar, 
  FaUserShield, 
  FaClockRotateLeft, 
  FaArrowTrendUp,
  FaPlus,
  FaFileInvoiceDollar,
  FaSitemap
} from 'react-icons/fa6';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 1. Vuta data ya User aliyelogin (Self)
  const { data: user, isLoading: userLoading } = useUserStats();
  
  // 2. Vuta miamala ya hivi karibuni (Personal)
  const { data: transactions, isLoading: transLoading } = useMyTransactions();

  // 3. Tambua Roles
  const isSuper = user?.role === 'superadmin';
  const isAdmin = user?.role === 'admin' || user?.role === 'secretary';

  // 4. Vuta Global Stats KAMA tu ni Superadmin
  const { data: globalStats, isLoading: statsLoading } = useGlobalStats(isSuper);

  // Loading Screen (Glowing Spinner)
  if (userLoading || transLoading || (isSuper && statsLoading)) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(57,255,20,0.5)]"></div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
            {isSuper ? 'PLATFORM OVERVIEW' : t('dashboard')}
          </h1>
          <p className="text-gray-500 text-xs md:text-sm">
            {t('welcome_back')}, <span className="text-neon-green font-bold">{user?.name}</span> 
            {isAdmin && <span className="text-neon-blue"> • {user?.groupCode}</span>}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
           <div className={`p-3 rounded-xl ${isSuper ? 'bg-neon-blue/20 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]' : 'bg-neon-green/20 text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.3)]'}`}>
              <FaUserShield size={22} />
           </div>
           <div>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Authorization</p>
              <p className="text-sm font-black text-white uppercase tracking-wider">{user?.role}</p>
           </div>
        </div>
      </div>

      {/* --- DYNAMIC STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Contextual based on Role */}
        <div className="card-glass p-8 relative overflow-hidden group border-l-4 border-neon-green hover:shadow-[0_0_25px_rgba(57,255,20,0.15)] transition-all">
          <div className="relative z-10">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
              {isSuper ? 'Total Platform Members' : t('total_shares')}
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight">
              {isSuper 
                ? globalStats?.totalUsers?.toLocaleString() 
                : `TZS ${user?.shares?.toLocaleString()}`}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-neon-green text-xs font-bold">
              <FaArrowTrendUp /> <span>Live System Data</span>
            </div>
          </div>
          <FaWallet className="absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:text-neon-green/10 transition-colors duration-500" />
        </div>

        {/* Card 2: Contextual based on Role */}
        <div className="card-glass p-8 relative overflow-hidden group border-l-4 border-neon-blue hover:shadow-[0_0_25px_rgba(0,243,255,0.15)] transition-all">
          <div className="relative z-10">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
              {isSuper ? 'Active VICOBA Groups' : t('borrowing_power')}
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight">
              {isSuper 
                ? globalStats?.groupCount?.toLocaleString() 
                : `TZS ${(user?.shares * 3)?.toLocaleString()}`}
            </h2>
            <p className="mt-4 text-[10px] text-gray-500 uppercase font-black tracking-tighter">
              {isSuper ? 'Verified Scoped Units' : 'Kikomo cha mkopo kulingana na hisa'}
            </p>
          </div>
          <FaHandHoldingDollar className="absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:text-neon-blue/10 transition-colors duration-500" />
        </div>

        {/* Card 3: Contextual based on Role */}
        <div className="card-glass p-8 relative overflow-hidden group border-l-4 border-purple-500 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)] transition-all">
          <div className="relative z-10">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">
              {isSuper ? 'Global Platform Cash' : t('social_fund')}
            </p>
            <h2 className="text-4xl font-black text-white tracking-tight">
              {isSuper 
                ? `TZS ${globalStats?.totalCash?.toLocaleString()}` 
                : `TZS ${user?.socialFund?.toLocaleString()}`}
            </h2>
            <div className="mt-4 flex items-center gap-2 text-purple-400 text-xs font-bold">
              <FaUsers /> <span>{isSuper ? 'Total Net Liquidity' : 'Bima na Dharura'}</span>
            </div>
          </div>
          <FaChartLine className="absolute -right-4 -bottom-4 text-white/5 text-8xl group-hover:text-purple-500/10 transition-colors duration-500" />
        </div>
      </div>

      {/* --- MANAGEMENT CONSOLE (For Admins / Super) --- */}
      {(isAdmin || isSuper) && (
        <div className="space-y-6">
          <h3 className="text-lg font-black italic text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
             <span className="h-[2px] w-8 bg-neon-green"></span> Management Console
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/dashboard/members')}
              className="p-6 card-glass border-white/5 hover:border-neon-green group transition-all text-left relative overflow-hidden"
            >
              <FaUsers className="absolute -right-2 -top-2 text-white/5 text-5xl group-hover:text-neon-green/20 transition-all" />
              <p className="text-neon-green font-black text-xs mb-1 uppercase tracking-widest">Members</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter leading-tight">Usimamizi wa wanachama na michango.</p>
            </button>

            <button 
              onClick={() => navigate('/dashboard/manage-loans')}
              className="p-6 card-glass border-white/5 hover:border-neon-blue group transition-all text-left relative overflow-hidden"
            >
              <FaFileInvoiceDollar className="absolute -right-2 -top-2 text-white/5 text-5xl group-hover:text-neon-blue/20 transition-all" />
              <p className="text-neon-blue font-black text-xs mb-1 uppercase tracking-widest">Approvals</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter leading-tight">Idhinisha au kataa maombi ya mikopo.</p>
            </button>

            {isSuper && (
              <button 
                onClick={() => navigate('/dashboard/manage-groups')}
                className="p-6 card-glass border-white/5 hover:border-purple-500 group transition-all text-left relative overflow-hidden"
              >
                <FaSitemap className="absolute -right-2 -top-2 text-white/5 text-5xl group-hover:text-purple-500/20 transition-all" />
                <p className="text-purple-500 font-black text-xs mb-1 uppercase tracking-widest">VICOBA Groups</p>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter leading-tight">Dhibiti vikundi vyote vya platform.</p>
              </button>
            )}

            <button className="p-6 card-glass border-white/5 hover:border-white/20 group transition-all text-left relative overflow-hidden">
              <FaPlus className="absolute -right-2 -top-2 text-white/5 text-5xl group-hover:text-white/20 transition-all" />
              <p className="text-white font-black text-xs mb-1 uppercase tracking-widest">New Session</p>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter leading-tight">Anzisha kikao kipya cha wiki.</p>
            </button>
          </div>
        </div>
      )}

      {/* --- RECENT TRANSACTIONS TABLE --- */}
      <div className="card-glass overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-blue/10 rounded-lg text-neon-blue">
               <FaClockRotateLeft />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Miamala ya Hivi Karibuni</h3>
          </div>
          <button 
            onClick={() => navigate('/dashboard/shares')}
            className="text-[10px] font-black uppercase text-gray-500 hover:text-neon-green transition-all border-b border-transparent hover:border-neon-green"
          >
            {t('view_all')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-600 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="p-5">Type</th>
                <th className="p-5">Date</th>
                <th className="p-5">Amount (TZS)</th>
                <th className="p-5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions?.length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5">
                      <p className="text-white font-bold text-sm uppercase group-hover:text-neon-green transition-colors">
                        {tx.type?.replace('_', ' ')}
                      </p>
                    </td>
                    <td className="p-5 text-gray-500 text-xs font-bold font-mono">
                      {new Date(tx.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-5 font-black text-white">
                      {tx.amount?.toLocaleString()}
                    </td>
                    <td className="p-5 text-right">
                      <span className="px-3 py-1 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full text-[9px] font-black uppercase shadow-[0_0_10px_rgba(57,255,20,0.1)]">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-gray-700 font-black uppercase italic tracking-[0.3em]">
                    No Activity Logged
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;