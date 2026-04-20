import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaHandHoldingDollar,  FaClock, FaCheckDouble } from 'react-icons/fa6';
import {FaInfoCircle} from 'react-icons/fa';
import { useMyLoans, useRequestLoan } from '../hooks/useLoan';
import { useUserStats } from '../hooks/useUser';
import toast from 'react-hot-toast';

const LoansPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useUserStats();
  const { data: loans, isLoading } = useMyLoans();
  const requestLoanMutation = useRequestLoan();
  const { register, handleSubmit, reset } = useForm();

  const maxBorrow = user?.shares * 3;

  const onSubmit = (data) => {
    if (Number(data.amount) > maxBorrow) {
      return toast.error(`Huwezi kukopa zaidi ya TZS ${maxBorrow.toLocaleString()}`);
    }
    requestLoanMutation.mutate(data, { onSuccess: () => { setIsModalOpen(false); reset(); } });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Mikopo</h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">Dhibiti na ufuatilie madeni yako</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[10px] uppercase">
          <FaPlus /> Omba Mkopo
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-glass p-6 border-neon-blue/40">
          <div className="flex items-center gap-3 mb-2 text-neon-blue uppercase text-[10px] font-black">
            <FaInfoCircle /> <span>Kikomo cha Kukopa (3x Hisa)</span>
          </div>
          <h2 className="text-3xl font-black text-white">TZS {maxBorrow?.toLocaleString()}</h2>
        </div>
        
        {/* HII NI SEHEMU YA RETURNS (Deni la Jumla) */}
        <div className="card-glass p-6 border-red-500/30">
          <div className="flex items-center gap-3 mb-2 text-red-500 uppercase text-[10px] font-black">
            <FaClock /> <span>Jumla ya Madeni Unayodaiwa</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            TZS {loans?.filter(l => l.status === 'approved').reduce((acc, curr) => acc + (curr.amountRequested * 1.1), 0).toLocaleString()}
          </h2>
        </div>
      </div>

      {/* LOAN HISTORY TABLE */}
      <div className="card-glass overflow-hidden border-white/5 shadow-2xl">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <FaCheckDouble className="text-neon-green" />
          <h3 className="text-lg font-black italic uppercase text-white">Historia na Marejesho</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-white/5 text-gray-500 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-5">Kiasi</th>
                <th className="p-5">Jumla (+Riba 10%)</th>
                <th className="p-5">Umesharudisha</th>
                <th className="p-5">Deni Lililobaki</th>
                <th className="p-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loans?.map(loan => {
                const totalWithInterest = loan.amountRequested * 1.1; // Riba ya 10%
                const paid = loan.totalPaid || 0; // Sehemu hii itatoka kwenye transactions
                const balance = totalWithInterest - paid;

                return (
                  <tr key={loan._id} className="hover:bg-white/5 transition-all">
                    <td className="p-5 text-white font-bold">TZS {loan.amountRequested?.toLocaleString()}</td>
                    <td className="p-5 text-gray-400">TZS {totalWithInterest.toLocaleString()}</td>
                    <td className="p-5 text-neon-green font-bold">TZS {paid.toLocaleString()}</td>
                    <td className="p-5 text-red-500 font-bold">TZS {balance.toLocaleString()}</td>
                    <td className="p-5 text-right">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                        loan.status === 'approved' ? 'border-neon-green text-neon-green bg-neon-green/5' :
                        loan.status === 'pending' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/5' :
                        'border-red-500 text-red-500 bg-red-500/5'
                      }`}>
                        {loan.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOAN MODAL - (Code yako ya mwanzo ipo sawa hapa) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
           {/* ... modal content yako ... */}
        </div>
      )}
    </div>
  );
};

export default LoansPage;