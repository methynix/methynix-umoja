import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FaStamp } from 'react-icons/fa6';
import ConfirmModal from '../components/ConfirmModal';

const LoanApprovalsPage = () => {
  const queryClient = useQueryClient();

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

  const initiateAction = (loan, status) => {
    setPendingAction({
      id: loan._id,
      status: status,
      name: loan.member?.name,
      amount: loan.amountRequested
    });
    setIsConfirmOpen(true);
  };


  const handleFinalConfirm = () => {
    if (pendingAction) {
      updateMutation.mutate({ 
        id: pendingAction.id, 
        status: pendingAction.status 
      });
    }
  };

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark tracking-tight flex items-center gap-2.5">
        <FaStamp className="text-vicoba-gold" /> Maombi ya Mikopo
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {loans?.filter(l => l.status === 'pending').map((loan) => (
          <div 
            key={loan._id} 
            className="bg-white p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 rounded-2xl border border-gray-100 border-l-4 border-l-amber-400 shadow-md shadow-vicoba-forest/5 transition-all"
          >
            <div className="space-y-1.5 w-full">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-semibold text-gray-400">Kiasi:</span>
                <p className="text-xl font-extrabold text-vicoba-dark">TZS {loan.amountRequested?.toLocaleString()}</p>
              </div>
              <p className="text-sm font-bold text-gray-600">
                Mwombaji: <span className="text-vicoba-forest">{loan.member?.name}</span>
              </p>
              <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 inline-block w-full md:w-auto font-medium">
                Lengo: <span className="italic text-gray-500">"{loan.purpose}"</span>
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto pt-2 md:pt-0 border-t border-gray-50 md:border-0">
              <button 
                onClick={() => initiateAction(loan, 'rejected')}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-red-100 text-vicoba-earth bg-red-50 hover:bg-vicoba-earth hover:text-white font-bold text-sm transition-colors"
              >
                Kataa
              </button>
              <button 
                onClick={() => initiateAction(loan, 'approved')}
                className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-vicoba-forest text-white hover:bg-emerald-900 font-bold text-sm shadow-sm shadow-vicoba-forest/10 transition-colors"
              >
                Idhinisha
              </button>
            </div>
          </div>
        ))}

        {loans?.filter(l => l.status === 'pending').length === 0 && (
          <div className="p-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-medium text-sm">
            Hakuna maombi mapya yanayosubiri idhini kwa sasa.
          </div>
        )}
      </div>

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
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};

export default LoanApprovalsPage;