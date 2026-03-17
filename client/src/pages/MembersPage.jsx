import React, { useState } from 'react';
import { useMembers, useCreateMember } from '../hooks/useMembers';
import { FaUserPlus, FaSearch, FaEllipsisV, FaMoneyBillWave } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const MembersPage = () => {
  const { data: members, isLoading } = useMembers();
  const createMutation = useCreateMember();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onRegister = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  if (isLoading) return <div className="p-10 text-neon-green">Inapakia orodha...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Wanachama</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase"
        >
          <FaUserPlus /> Sajili Mwanachama
        </button>
      </div>

      {/* Search Bar */}
      <div className="card-glass p-4 flex items-center gap-4 border-white/5">
        <FaSearch className="text-gray-500" />
        <input 
          type="text" 
          placeholder="Tafuta mwanachama kwa jina au namba..." 
          className="bg-transparent border-none outline-none text-white w-full text-sm"
        />
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-500 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-5">Mwanachama</th>
              <th className="p-5">Hisa (Shares)</th>
              <th className="p-5">Jamii</th>
              <th className="p-5">Role</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members?.map((m) => (
              <tr key={m._id} className="hover:bg-white/5 transition-all">
                <td className="p-5">
                  <p className="text-white font-bold text-sm uppercase">{m.name}</p>
                  <p className="text-gray-500 text-xs">{m.phone}</p>
                </td>
                <td className="p-5 text-neon-green font-mono text-sm">
                  {m.shares?.toLocaleString()}
                </td>
                <td className="p-5 text-purple-400 font-mono text-sm">
                  {m.socialFund?.toLocaleString()}
                </td>
                <td className="p-5">
                  <span className="text-[9px] font-black uppercase border border-white/10 px-2 py-0.5 rounded text-gray-400">
                    {m.role}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button className="text-gray-500 hover:text-white p-2">
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manual Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <div className="card-glass p-8 w-full max-w-lg border-neon-green/30">
            <h3 className="text-2xl font-black italic text-neon-green uppercase mb-6">Usajili wa Mwanachama Mpya</h3>
            <form onSubmit={handleSubmit(onRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Jina Kamili</label>
                <input {...register("name")} className="input-glow w-full p-4 mt-1 bg-white/5 text-white" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Namba ya Simu</label>
                <input {...register("phone")} className="input-glow w-full p-4 mt-1 bg-white/5 text-white" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Password (Temporary)</label>
                <input type="password" {...register("password")} className="input-glow w-full p-4 mt-1 bg-white/5 text-white" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Hisa za Kuanzia (TZS)</label>
                <input type="number" defaultValue="0" {...register("shares")} className="input-glow w-full p-4 mt-1 bg-white/5 text-white" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Mfuko wa Jamii (TZS)</label>
                <input type="number" defaultValue="0" {...register("socialFund")} className="input-glow w-full p-4 mt-1 bg-white/5 text-white" />
              </div>
              <div className="md:col-span-2 flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-gray-500 font-bold text-xs uppercase">Ghairi</button>
                <button type="submit" className="flex-1 btn-glow py-4 rounded-xl font-black text-xs uppercase">Sajili Sasa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;