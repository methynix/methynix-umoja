import React from 'react';
import { useUserStats } from '../hooks/useUser';
import { useMyLedger } from '../hooks/useLedger';
import { FaPiggyBank,  FaCalendarCheck, FaCircleExclamation } from 'react-icons/fa6';
import {FaShieldAlt} from "react-icons/fa"

const SharesPage = () => {
  const { data: user } = useUserStats();
  const { data: ledger, isLoading } = useMyLedger();

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in slide-up duration-700 pb-20">
      
      {/* --- HEADER --- */}
      <div>
        <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase tracking-tighter">Daftari la Hisa</h2>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Mwaka wa Fedha: {new Date().getFullYear()}</p>
      </div>

      {/* --- TOTALS SUMMARY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-glass p-6 flex items-center gap-6 border-b-4 border-neon-green">
           <div className="p-4 rounded-2xl bg-neon-green/10 text-neon-green shadow-glow-green">
              <FaPiggyBank size={24} />
           </div>
           <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Jumla ya Akiba (Hisa)</p>
              <h3 className="text-3xl font-black text-white">TZS {user?.shares?.toLocaleString()}</h3>
           </div>
        </div>
        <div className="card-glass p-6 flex items-center gap-6 border-b-4 border-purple-500">
           <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400">
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
           <FaCalendarCheck className="text-neon-blue" /> Mchanganuo wa Miezi
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {ledger?.map((item, index) => (
            <div 
              key={index} 
              className={`card-glass p-4 border-t-4 transition-all duration-300 relative overflow-hidden ${
                item.status === 'Paid' ? 'border-neon-green bg-neon-green/5' : 
                item.status === 'Not Paid' ? 'border-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 
                'border-white/10 opacity-40'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.month}</span>
                {item.status === 'Not Paid' && <FaCircleExclamation className="text-red-500 animate-pulse" size={12} />}
              </div>

              <h4 className={`text-base font-black ${item.status === 'Not Paid' ? 'text-red-500' : 'text-white'}`}>
                {item.status === 'Paid' ? `TZS ${item.amount}` : '0 TZS'}
              </h4>

              <div className="mt-4 flex items-center justify-between">
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  item.status === 'Paid' ? 'border-neon-green text-neon-green bg-neon-green/10' : 
                  item.status === 'Not Paid' ? 'border-red-500 text-red-500 bg-red-500/10' : 
                  'border-gray-700 text-gray-700'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Background Watermark Month */}
              <span className="absolute -right-2 -bottom-2 text-4xl font-black text-white/5 pointer-events-none uppercase">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
         <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
           Ripoti hii inazalishwa automatically kulingana na miamala iliyothibitishwa na Secretary.
         </p>
      </div>
    </div>
  );
};

export default SharesPage;