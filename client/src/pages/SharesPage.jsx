import React from 'react';
import { FaPiggyBank, FaHistory, FaShieldAlt } from 'react-icons/fa';
import { useUserStats } from '../hooks/useUser';
import { useMyTransactions } from '../hooks/useTransaction';

const SharesPage = () => {
  const { data: user } = useUserStats();
  const { data: transactions, isLoading } = useMyTransactions();

  const contributions = transactions?.filter(t => t.type === 'share' || t.type === 'social_fund') || [];

  return (
    <div className="space-y-8 animate-in slide-up duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic bg-gradient-to-r from-neon-green to-neon-blue bg-clip-text text-transparent uppercase">
            DAFTARI LA HISA
          </h1>
          <p className="text-gray-500 text-sm tracking-widest">Usimamizi wa akiba na michango ya kijamii</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-8 flex items-center gap-6 border-b-4 border-neon-green group">
          <div className="p-5 rounded-2xl bg-neon-green/10 text-neon-green group-hover:scale-110 transition-transform shadow-glow-green">
            <FaPiggyBank size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Jumla ya Hisa</p>
            <h3 className="text-4xl font-black text-white">TZS {user?.shares?.toLocaleString()}</h3>
          </div>
        </div>

        <div className="card-glass p-8 flex items-center gap-6 border-b-4 border-purple-500 group">
          <div className="p-5 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <FaShieldAlt size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase mb-1">Mfuko wa Jamii</p>
            <h3 className="text-4xl font-black text-white">TZS {user?.socialFund?.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="card-glass overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <FaHistory className="text-neon-green" />
          <h2 className="text-xl font-black uppercase italic">Historia ya Michango</h2>
        </div>
        <div className="overflow-x-auto shadow-inner">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-white/5 text-gray-500 text-[10px] uppercase font-black">
              <tr>
                <th className="p-5">Tarehe</th>
                <th className="p-5">Aina</th>
                <th className="p-5">Kiasi (TZS)</th>
                <th className="p-5 text-right">Mpokeaji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {contributions.length > 0 ? (
                contributions.map((row) => (
                  <tr key={row._id} className="hover:bg-neon-green/5 transition-colors">
                    <td className="p-5 font-mono text-xs text-gray-400">
                      {new Date(row.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-5">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold border ${
                        row.type === 'share' ? 'border-neon-green/30 text-neon-green bg-neon-green/5' : 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                      }`}>
                        {row.type === 'share' ? 'HISA (SHARE)' : 'JAMII (SOCIAL)'}
                      </span>
                    </td>
                    <td className="p-5 text-white font-bold">{row.amount?.toLocaleString()}</td>
                    <td className="p-5 text-right text-xs text-gray-600 italic">Official Admin</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-gray-600 font-bold uppercase tracking-[0.2em]">Hakuna michango bado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SharesPage;