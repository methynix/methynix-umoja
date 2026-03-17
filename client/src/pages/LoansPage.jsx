import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus, FaHandHoldingUsd, FaInfoCircle } from 'react-icons/fa';
import { useMyLoans, useRequestLoan } from '../hooks/useLoan';
import { useUserStats } from '../hooks/useUser';
import toast from 'react-hot-toast';

const LoansPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: user } = useUserStats();
  const { data: loans, isLoading } = useMyLoans();
  const requestLoanMutation = useRequestLoan();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const maxBorrow = user?.shares * 3;

  const onSubmit = (data) => {
    if (Number(data.amount) > maxBorrow) {
      return toast.error(`Huwezi kukopa zaidi ya TZS ${maxBorrow.toLocaleString()}`);
    }
    
    requestLoanMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white italic">MIKOPO (LOANS)</h2>
          <p className="text-gray-500 text-sm uppercase tracking-widest">Omba na ufuatilie hali ya mikopo yako</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl font-bold"
        >
          <FaPlus /> Omba Mkopo Mpya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-6 border-neon-blue/40 bg-glow-mesh shadow-glow-blue">
          <div className="flex items-center gap-3 mb-4 text-neon-blue">
            <FaInfoCircle />
            <span className="text-xs font-bold uppercase tracking-tighter">Kikomo chako cha Kukopa</span>
          </div>
          <p className="text-gray-400 text-sm">Max Borrowing Power (3x Hisa)</p>
          <h2 className="text-4xl font-black text-white">TZS {maxBorrow?.toLocaleString()}</h2>
        </div>
      </div>

      <div className="card-glass overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold">Historia ya Mikopo</h3>
        </div>
         <div className="overflow-x-auto shadow-inner">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-white/5 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4">Kiasi</th>
                <th className="p-4">Riba (10%)</th>
                <th className="p-4">Sababu</th>
                <th className="p-4">Hali (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loans?.map(loan => (
                <tr key={loan._id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-bold">{loan.amountRequested?.toLocaleString()} TZS</td>
                  <td className="p-4 text-gray-400">{(loan.amountRequested * 0.1).toLocaleString()} TZS</td>
                  <td className="p-4 text-sm italic text-gray-500">{loan.purpose || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                      loan.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      loan.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="card-glass p-8 w-full max-w-md border-neon-blue/50">
            <h2 className="text-2xl font-black mb-6 italic text-neon-blue">FOAMU YA MKОPО</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Kiasi unachohitaji (TZS)</label>
                <input 
                  type="number"
                  {...register("amount", { required: true })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-neon-blue outline-none text-white font-bold"
                  placeholder="Mfano: 500000"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Sababu ya Mkopo</label>
                <textarea 
                  {...register("purpose", { required: true })}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-neon-blue outline-none text-white h-24"
                  placeholder="Elezea matumizi ya mkopo..."
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-bold uppercase text-xs">Ghairi</button>
                <button type="submit" disabled={requestLoanMutation.isLoading} className="flex-1 btn-glow py-4 rounded-xl text-neon-blue border-neon-blue font-black uppercase text-xs shadow-glow-blue">
                  {requestLoanMutation.isLoading ? 'Inatuma...' : 'Tuma Ombi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;