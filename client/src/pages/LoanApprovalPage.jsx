import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FaStamp } from 'react-icons/fa6';
import ConfirmModal from '../components/ConfirmModal'; // Tumia modal yetu custom

const LoanApprovalsPage = () => {
  const queryClient = useQueryClient();

  // --- STATES ZA CONFIRMATION ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // Itashika { id, status, name, amount }

  const { data: loans, isLoading } = useQuery({
    queryKey: ['adminLoans'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/loans/group-loans');
      return data.data.loans;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosInstance.patch(`/loans/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLoans']);
      toast.success('Hatua imekamilika!');
      setIsConfirmOpen(false); // Funga modal baada ya kufanikiwa
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Imeshindikana');
      setIsConfirmOpen(false);
    }
  });

  // 1. Function ya kuanzisha mchakato (Inafungua Modal kwanza)
  const initiateAction = (loan, status) => {
    setPendingAction({
      id: loan._id,
      status: status,
      name: loan.member?.name,
      amount: loan.amountRequested
    });
    setIsConfirmOpen(true);
  };

  // 2. Function inayotekeleza baada ya Admin kubonyeza "Yes" kwenye Modal
  const handleFinalConfirm = () => {
    if (pendingAction) {
      updateMutation.mutate({ 
        id: pendingAction.id, 
        status: pendingAction.status 
      });
    }
  };

  if (isLoading) return <div className="h-[60vh] flex items-center justify-center text-neon-blue uppercase font-black text-xs animate-pulse">Inatafuta maombi...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
        <FaStamp className="text-neon-blue" /> Maombi ya Mikopo
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {loans?.filter(l => l.status === 'pending').map((loan) => (
          <div key={loan._id} className="card-glass p-6 flex flex-col md:flex-row justify-between items-center border-l-4 border-yellow-500 hover:border-neon-blue transition-all">
            <div className="space-y-1">
              <p className="text-white font-black text-xl">TZS {loan.amountRequested?.toLocaleString()}</p>
              <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                Mwombaji: <span className="text-neon-green">{loan.member?.name}</span>
              </p>
              <p className="text-gray-400 text-xs italic">" {loan.purpose} "</p>
            </div>
            
            <div className="flex gap-4 mt-6 md:mt-0 w-full md:w-auto">
              <button 
                onClick={() => initiateAction(loan, 'rejected')}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/10 text-[10px] font-black uppercase transition-all"
              >
                Reject
              </button>
              <button 
                onClick={() => initiateAction(loan, 'approved')}
                className="flex-1 md:flex-none px-8 py-3 rounded-xl bg-neon-green/20 border border-neon-green text-neon-green hover:shadow-glow-green text-[10px] font-black uppercase transition-all"
              >
                Approve
              </button>
            </div>
          </div>
        ))}

        {loans?.filter(l => l.status === 'pending').length === 0 && (
          <div className="p-20 text-center card-glass border-dashed border-white/10 text-gray-600 font-black uppercase tracking-[0.3em]">
            Hakuna maombi yanayosubiri
          </div>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        title={pendingAction?.status === 'approved' ? 'Idhinisha Mkopo?' : 'Kataa Mkopo?'}
        message={
          pendingAction?.status === 'approved' 
          ? `Je, una uhakika unataka kuidhinisha mkopo wa TZS ${pendingAction?.amount?.toLocaleString()} kwa ${pendingAction?.name}?`
          : `Je, una uhakika unataka kukataa ombi la mkopo la ${pendingAction?.name}?`
        }
        onConfirm={handleFinalConfirm}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={updateMutation.isLoading}
      />
    </div>
  );
};

export default LoanApprovalsPage;