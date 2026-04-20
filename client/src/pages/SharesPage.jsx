import React from 'react';
import { useUserStats } from '../hooks/useUser';
import { useMyLedger } from '../hooks/useLedger';
import { 
  FaPiggyBank, 
  FaCalendarCheck, 
  FaCircleExclamation, 
  FaArrowTrendUp
} from 'react-icons/fa6';
import {FaShieldAlt} from 'react-icons/fa'

const SharesPage = () => {
  const { data: user } = useUserStats();
  const { data: ledger, isLoading } = useMyLedger();

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin shadow-glow-blue"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-up duration-700 pb-24">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
            Daftari la Mwaka
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            Mwaka wa Fedha: {new Date().getFullYear()}
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-3">
          <FaArrowTrendUp className="text-neon-green" />
          <span className="text-[10px] font-black uppercase text-white">Live Tracking Enabled</span>
        </div>
      </div>

      {/* --- TOTALS SUMMARY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-glass p-6 flex items-center gap-6 border-b-4 border-neon-green group">
           <div className="p-4 rounded-2xl bg-neon-green/10 text-neon-green shadow-glow-green group-hover:scale-110 transition-transform">
              <FaPiggyBank size={24} />
           </div>
           <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Jumla ya Akiba (Hisa)</p>
              <h3 className="text-3xl font-black text-white">TZS {user?.shares?.toLocaleString()}</h3>
           </div>
        </div>
        <div className="card-glass p-6 flex items-center gap-6 border-b-4 border-purple-500 group">
           <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <FaShieldAlt size={24} />
           </div>
           <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Mfuko wa Jamii</p>
              <h3 className="text-3xl font-black text-white">TZS {user?.socialFund?.toLocaleString()}</h3>
           </div>
        </div>
      </div>

      {/* --- MONTHLY CALENDAR GRID --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-black italic text-gray-500 uppercase tracking-widest flex items-center gap-2">
           <FaCalendarCheck className="text-neon-blue" /> Mchanganuo wa Kila Mwezi
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ledger?.map((item, index) => (
            <div 
              key={index} 
              className={`card-glass p-5 border-t-4 transition-all duration-300 relative overflow-hidden ${
                item.status === 'Paid' ? 'border-neon-green bg-neon-green/5' : 
                item.status === 'Not Paid' ? 'border-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                'border-white/10 opacity-40'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{item.month}</span>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  item.status === 'Paid' ? 'border-neon-green text-neon-green bg-neon-green/10' : 
                  item.status === 'Not Paid' ? 'border-red-500 text-red-500 bg-red-500/10' : 
                  'border-gray-700 text-gray-700'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* MCHANGANUO WA PESA KWA MWEZI */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Hisa:</span>
                  <span className={`text-sm font-black ${item.status === 'Not Paid' ? 'text-red-500' : 'text-white'}`}>
                    {item.shareAmount > 0 ? `TZS ${item.shareAmount.toLocaleString()}` : '0 TZS'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-t border-white/5 pt-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Jamii:</span>
                  <span className={`text-sm font-black ${item.status === 'Not Paid' ? 'text-red-500' : 'text-purple-400'}`}>
                    {item.socialAmount > 0 ? `TZS ${item.socialAmount.toLocaleString()}` : '0 TZS'}
                  </span>
                </div>
              </div>

              {/* Background Watermark Month */}
              <span className="absolute -right-2 -bottom-2 text-4xl font-black text-white/5 pointer-events-none uppercase italic">
                {item.month}
              </span>

              {item.status === 'Not Paid' && (
                 <div className="absolute top-0 right-0 p-1">
                    <FaCircleExclamation className="text-red-500 animate-pulse" size={12} />
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
         <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
           Msimu wa {new Date().getFullYear()} • Methynix Umoja Digital Ledger
         </p>
      </div>
    </div>
  );
};

export default SharesPage;