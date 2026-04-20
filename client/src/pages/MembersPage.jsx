import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaUserPlus,  FaTrash, FaPiggyBank, 
  FaUser, FaPhone, FaEllipsisVertical,
  FaXmark
} from 'react-icons/fa6';
import {FaSearch, FaShieldAlt} from 'react-icons/fa';
import { useMembers, useCreateMember, useDeleteMember } from '../hooks/useMembers';
import { useUserStats } from '../hooks/useUser';
import {useRecordContribution} from '../hooks/useTransaction';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const MembersPage = () => {
  // 1. DATA FETCHING & HOOKS
  const { data: currentUser } = useUserStats();
  const { data: members, isLoading } = useMembers();
  const createMutation = useCreateMember();
  const deleteMutation = useDeleteMember();

  // 2. STATES
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
const [selectedMember, setSelectedMember] = useState(null);
const recordMutation = useRecordContribution();
  // 3. FORM SETUP
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // 4. LOGIC: Role Permissions
  const isSuper = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin';
  const isSecretary = currentUser?.role === 'secretary';
  const canManage = isSuper || isAdmin || isSecretary;

  // 5. SEARCH FILTER
  const filteredMembers = members?.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone.includes(searchTerm)
  );

  const months = [
  { val: 1, name: "Januari" }, { val: 2, name: "Februari" },
  { val: 3, name: "Machi" }, { val: 4, name: "Aprili" },
  { val: 5, name: "Mei" }, { val: 6, name: "Juni" },
  { val: 7, name: "Julai" }, { val: 8, name: "Agosti" },
  { val: 9, name: "Septemba" }, { val: 10, name: "Oktoba" },
  { val: 11, name: "Novemba" }, { val: 12, name: "Desemba" }
];

const currentMonth = new Date().getMonth() + 1;

  // 6. HANDLERS
  const onRegister = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const onRecord = (data) => {
  const payload = {
    memberId: selectedMember._id, // Id ya mwanachama uliyem-click
    type: data.type,             // 'share' au 'social_fund'
    amount: Number(data.amount)  // Hakikisha ni namba
  };

  recordMutation.mutate(payload, {
    onSuccess: () => {
      setIsContributionModalOpen(false); // Funga Modal ya pesa
      reset();
    }
  });
};

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteMutation.mutate(memberToDelete._id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }
      });
    }
  };

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-up duration-700 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Wanachama</h2>
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
            {isSuper ? 'Platform-wide Members' : `Kikundi: ${currentUser?.groupId?.name || 'Pakia...'}`}
          </p>
        </div>
        
        {canManage && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest w-full md:w-auto justify-center"
          >
            <FaUserPlus /> Sajili Mwanachama
          </button>
        )}
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="card-glass p-1 flex items-center gap-3 border-white/5 shadow-inner">
        <div className="pl-4 text-gray-500">
          <FaSearch size={14} />
        </div>
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tafuta kwa jina au namba ya simu..." 
          className="bg-transparent border-none outline-none text-white w-full py-3 text-sm placeholder:text-gray-600"
        />
      </div>

      {/* --- MEMBERS TABLE (Responsive) --- */}
      <div className="card-glass overflow-hidden border-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-white/5 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="p-5">Mwanachama</th>
                <th className="p-5">Role</th>
                {!isSuper && <th className="p-5">Hisa (Shares)</th>}
                {!isSuper && <th className="p-5">Mfuko wa Jamii</th>}
                <th className="p-5 text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers?.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-white/5 transition-all group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-neon-green">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm uppercase tracking-tight">{member.name}</p>
                          <p className="text-gray-500 text-[10px] font-mono">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                        member.role === 'admin' ? 'border-neon-blue text-neon-blue bg-neon-blue/5' : 
                        member.role === 'secretary' ? 'border-purple-500 text-purple-500 bg-purple-500/5' : 
                        'border-white/10 text-gray-500'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    {!isSuper && (
                      <td className="p-5 text-neon-green font-black text-sm">
                        {member.shares?.toLocaleString()}
                      </td>
                    )}
                    {!isSuper && (
                      <td className="p-5 text-purple-400 font-black text-sm">
                        {member.socialFund?.toLocaleString()}
                      </td>
                    )}
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Record Shares (Admins/Sec only) */}
                        {!isSuper && (isAdmin || isSecretary) && (
                          <button 
  onClick={() => {
    setSelectedMember(member);
    setIsContributionModalOpen(true);
  }}
  className="p-2.5 rounded-lg bg-white/5 text-neon-blue hover:bg-neon-blue/20 transition-all"
  title="Jaza Michango"
>
  <FaPiggyBank />
</button>
                        )}
                        
                        {/* Delete Button (Admins only) */}
                        {(isAdmin || isSuper) && (
                          <button 
                            onClick={() => {
                              setMemberToDelete(member);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2.5 rounded-lg bg-white/5 text-red-500 hover:bg-red-500/20 transition-all"
                            title="Futa Mwanachama"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-gray-600 font-black uppercase italic tracking-widest text-xs">
                    Hakuna mwanachama aliyepatikana
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: USAJILI MPYA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="card-glass p-8 w-full max-w-lg border-neon-green/30 my-auto relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              <FaXmark size={24} />
            </button>

            <div className="mb-8">
              <h3 className="text-2xl font-black italic text-neon-green uppercase tracking-tighter">Sajili Mwanachama</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Usajili wa mwanachama ndani ya {currentUser?.groupId?.name}</p>
            </div>

            <form onSubmit={handleSubmit(onRegister)} className="space-y-5">
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-gray-600" />
                <input 
                  {...register("name", { required: "Jina ni lazima" })}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm"
                  placeholder="Jina Kamili"
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute left-4 top-4 text-gray-600" />
                <input 
                  {...register("phone", { required: "Namba ya simu ni lazima" })}
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm"
                  placeholder="Namba ya Simu"
                />
              </div>

              {(currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Mamlaka (User Role)</label>
    <select 
      {...register("role")}
      className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-neon-green outline-none text-white text-sm appearance-none cursor-pointer"
    >
      <option value="member" className="bg-black text-white uppercase font-bold">Mwanachama (Member)</option>
      <option value="secretary" className="bg-black text-white uppercase font-bold">Katibu (Secretary)</option>
      <option value="admin" className="bg-black text-white uppercase font-bold">Mwenyekiti (Admin)</option>
    </select>
    <p className="text-[8px] text-gray-600 italic">** Admin anaweza kuteua viongozi wengine.</p>
  </div>
)}

{/* Kama ni Secretary, weka hidden input ili react-hook-form isome 'member' */}
{currentUser?.role === 'secretary' && (
  <input type="hidden" value="member" {...register("role")} />
)}

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <FaPiggyBank className="absolute left-4 top-4 text-gray-600 text-xs" />
                  <input 
                    type="number"
                    defaultValue="0"
                    {...register("shares")}
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm"
                    placeholder="Hisa"
                  />
                </div>
                <div className="relative">
                  <FaShieldAlt className="absolute left-4 top-4 text-gray-600 text-xs" />
                  <input 
                    type="number"
                    defaultValue="0"
                    {...register("socialFund")}
                    className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-xl focus:border-neon-green outline-none text-white text-sm"
                    placeholder="Jamii"
                  />
                </div>
              </div>

              <div className="p-3 bg-neon-green/5 border border-neon-green/10 rounded-lg text-center">
                <p className="text-[9px] text-neon-green font-bold uppercase tracking-tighter">
                  Nywila (Password) ya kwanza itakuwa ni jina la mwanachama kwa herufi ndogo.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-gray-500 font-black uppercase text-xs tracking-widest"
                >
                  Ghairi
                </button>
                <button 
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 btn-glow py-4 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'Inasajili...' : 'Kamilisha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: REKODI MCHANGO --- */}
{isContributionModalOpen && (
  <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
    <div className="card-glass p-8 w-full max-w-md border-neon-blue/30 relative">
      <button 
        onClick={() => setIsContributionModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-white"
      >
        <FaXmark size={24} />
      </button>

      <div className="mb-8">
        <h3 className="text-2xl font-black italic text-neon-blue uppercase tracking-tighter">Jaza Mchango</h3>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
          Mwanachama: <span className="text-white">{selectedMember?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onRecord)} className="space-y-6">
        <div>
    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-2">Mwezi wa Malipo</label>
    <select 
      {...register("month", { required: true })}
      defaultValue={currentMonth}
      className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:border-neon-blue outline-none text-white text-sm"
    >
      {months.map(m => (
        <option 
          key={m.val} 
          value={m.val} 
          disabled={m.val > currentMonth} // <--- Hapa ndipo tunazuia mwezi wa mbeleni
          className="bg-black text-white"
        >
          {m.name} {m.val > currentMonth ? '(Bado)' : ''}
        </option>
      ))}
    </select>
  </div>

        {/* Aina ya Mchango */}
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Aina ya Mchango</label>
          <select 
            {...register("type", { required: true })}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-neon-blue outline-none text-white text-sm appearance-none"
          >
            <option value="share" className="bg-black text-white uppercase font-bold">Hisa (Shares)</option>
            <option value="social_fund" className="bg-black text-white uppercase font-bold">Mfuko wa Jamii</option>
          </select>
        </div>

        {/* Kiasi cha Pesa */}
        <div>
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Kiasi (TZS)</label>
          <input 
            type="number"
            {...register("amount", { required: true, min: 1 })}
            placeholder="Mfano: 50000"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-neon-blue outline-none text-white text-lg font-black"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => setIsContributionModalOpen(false)}
            className="flex-1 py-4 text-gray-500 font-black uppercase text-xs tracking-widest"
          >
            Ghairi
          </button>
          <button 
            type="submit"
            disabled={recordMutation.isLoading}
            className="flex-1 btn-glow py-4 rounded-xl font-black text-xs uppercase tracking-widest border-neon-blue text-neon-blue shadow-glow-blue disabled:opacity-50"
          >
            {recordMutation.isLoading ? 'Inasave...' : 'Hifadhi Mchango'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* --- CONFIRM DELETE MODAL --- */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Ondoa Mwanachama?"
        message={`Je, una uhakika unataka kumfuta ${memberToDelete?.name} kutoka kwenye mfumo? Kitendo hiki hakina marekebisho.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={deleteMutation.isLoading}
      />
    </div>
  );
};

export default MembersPage;