import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaStamp } from 'react-icons/fa';

const LoanApprovalsPage = () => {
  const queryClient = useQueryClient();

  // 1. Vuta mikopo inayohitaji approval (Scoped by Backend)
  const { data: loans, isLoading } = useQuery({
    queryKey: ['adminLoans'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/loans/group-loans');
      return data.data.loans;
    }
  });

  // 2. Mutation ya ku-update status
  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosInstance.patch(`/loans/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminLoans']);
      toast.success('Hatua imechukuliwa kikamilifu!');
    }
  });

  if (isLoading) return <div className="p-10 text-neon-blue">Checking pending requests...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
        <FaStamp className="text-neon-blue" /> Maombi ya Mikopo
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {loans?.filter(l => l.status === 'pending').length > 0 ? (
          loans.filter(l => l.status === 'pending').map((loan) => (
            <div key={loan._id} className="card-glass p-6 flex flex-col md:flex-row justify-between items-center border-l-4 border-yellow-500">
              <div className="space-y-1">
                <p className="text-white font-black text-lg">TZS {loan.amountRequested?.toLocaleString()}</p>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">
                  Mwombaji: <span className="text-neon-green">{loan.member?.name}</span>
                </p>
                <p className="text-gray-400 text-sm italic ">" {loan.purpose} "</p>
              </div>
              
              <div className="flex gap-4 mt-4 md:mt-0">
                <button 
                  onClick={() => updateMutation.mutate({ id: loan._id, status: 'rejected' })}
                  className="px-6 py-2 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-black uppercase"
                >
                  Reject
                </button>
                <button 
                  onClick={() => updateMutation.mutate({ id: loan._id, status: 'approved' })}
                  className="px-6 py-2 rounded-lg bg-neon-green/20 border border-neon-green text-neon-green hover:shadow-glow-green text-xs font-black uppercase"
                >
                  Approve
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center card-glass border-dashed border-white/10 text-gray-600 font-bold uppercase tracking-widest">
            Hakuna maombi mapya yanayosubiri
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApprovalsPage;