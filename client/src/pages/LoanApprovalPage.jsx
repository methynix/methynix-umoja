import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';
import { FaStamp, FaXmark, FaPenNib, FaCircleCheck } from 'react-icons/fa6';
import ConfirmModal from '../components/ConfirmModal';
import SignaturePad from '../components/SignaturePad';
import Spinner from '../components/Spinner';
import { useUserStats } from '../hooks/useUser';
import { useSignLoan, useRepayLoan } from '../hooks/useLoan';

const LoanApprovalsPage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { data: me } = useUserStats();
  const signMutation = useSignLoan();
  const repayMutation = useRepayLoan();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [signingLoan, setSigningLoan] = useState(null);
  const [sigData, setSigData] = useState('');
  const [repayTarget, setRepayTarget] = useState(null);

  const { data: loans, isLoading } = useQuery({
    queryKey: ['adminLoans'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/loans/group-loans');
      return data.data.loans;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => axiosInstance.patch(`/loans/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLoans'] });
      toast.success('Hatua imekamilika!');
      setIsConfirmOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Imeshindikana');
      setIsConfirmOpen(false);
    }
  });

  const role = me?.role;
  const canApprove = (loan) => role === 'admin' || (role === 'secretary' && loan.member?.role === 'member');
  const mySignatureMissing = (loan) =>
    (role === 'treasurer' && !loan.treasurerSignature) ||
    (role === 'secretary' && !loan.secretarySignature);

  const visibleLoans = (loans || []).filter((l) => l.status === 'pending');
  const activeLoans = (loans || []).filter((l) => l.status === 'approved');
  const canRepay = role === 'admin' || role === 'secretary' || role === 'treasurer';

  const initiateAction = (loan, status) => {
    setPendingAction({ id: loan._id, status, name: loan.member?.name, amount: loan.amountRequested });
    setIsConfirmOpen(true);
  };

  const openSign = (loan) => { setSigData(''); setSigningLoan(loan); };
  const submitSign = () => {
    if (!sigData) return toast.error(t('sign_here'));
    signMutation.mutate({ loanId: signingLoan._id, signature: sigData }, { onSuccess: () => setSigningLoan(null) });
  };

  if (isLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const SigBadge = ({ ok, label }) => (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${ok ? 'border-emerald-200 text-vicoba-forest bg-emerald-50' : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-950'}`}>
      {ok && <FaCircleCheck size={10} />} {label}
    </span>
  );

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight flex items-center gap-2.5">
        <FaStamp className="text-vicoba-gold" /> {t('approvals_title')}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {visibleLoans.map((loan) => (
          <div key={loan._id} className="bg-white dark:bg-gray-900 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 border-l-4 border-l-amber-400 shadow-md shadow-vicoba-forest/5 space-y-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
              <div className="space-y-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">{t('amount')}:</span>
                  <p className="text-xl font-extrabold text-vicoba-dark dark:text-gray-100">TZS {loan.amountRequested?.toLocaleString()}</p>
                </div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('applicant')}: <span className="text-vicoba-forest">{loan.member?.name}</span></p>
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">"{loan.purpose}"</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SigBadge ok={!!loan.treasurerSignature} label={t('treasurer_sig')} />
                <SigBadge ok={!!loan.secretarySignature} label={t('secretary_sig')} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                <p className="font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('guarantor_internal')}</p>
                <p className="text-gray-500 dark:text-gray-300">{loan.guarantorInternalName || '-'} · {loan.guarantorInternalPhone || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-3">
                <p className="font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('guarantor_external')}</p>
                <p className="text-gray-500 dark:text-gray-300">{loan.guarantorExternalName || '-'} · {loan.guarantorExternalPhone || '-'}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-3 sm:col-span-2">
                <p className="font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('collateral')}</p>
                <p className="text-gray-500 dark:text-gray-300">
                  {loan.collateralType === 'other' ? loan.collateralDescription : t('collateral_shares')}
                </p>
              </div>
              {loan.applicantSignature && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 sm:col-span-2">
                  <p className="font-bold text-vicoba-dark dark:text-gray-100 mb-1">{t('applicant_sig')}</p>
                  <img src={loan.applicantSignature} alt="signature" className="h-16 object-contain" />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-50 dark:border-gray-800">
              {mySignatureMissing(loan) && (
                <button onClick={() => openSign(loan)} className="px-5 py-2.5 rounded-xl border border-vicoba-forest text-vicoba-forest hover:bg-vicoba-forest hover:text-white font-bold text-sm transition-colors flex items-center gap-2">
                  <FaPenNib size={13} /> {t('sign_form')}
                </button>
              )}
              {canApprove(loan) && (
                <>
                  <button onClick={() => initiateAction(loan, 'rejected')} className="px-6 py-2.5 rounded-xl border border-red-100 text-vicoba-earth bg-red-50 hover:bg-vicoba-earth hover:text-white font-bold text-sm transition-colors">
                    {t('reject')}
                  </button>
                  <button onClick={() => initiateAction(loan, 'approved')} className="px-6 py-2.5 rounded-xl bg-vicoba-forest text-white hover:bg-emerald-900 font-bold text-sm shadow-sm shadow-vicoba-forest/10 transition-colors">
                    {t('approve')}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {visibleLoans.length === 0 && (
          <div className="p-16 text-center bg-gray-50 dark:bg-gray-950 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-medium text-sm">
            {t('no_pending')}
          </div>
        )}
      </div>

      {activeLoans.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-vicoba-dark dark:text-gray-100">{t('active_loans')}</h3>
          {activeLoans.map((loan) => (
            <div key={loan._id} className="bg-white dark:bg-gray-900 p-4 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-800 border-l-4 border-l-vicoba-forest shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <p className="text-sm font-bold text-vicoba-dark dark:text-gray-100">{loan.member?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {t('principal')}: TZS {loan.amountRequested?.toLocaleString()} · {t('total_with_interest')}: TZS {Math.round(loan.amountRequested * (1 + (loan.interestRate || 0) / 100)).toLocaleString()}
                </p>
              </div>
              {canRepay && (
                <button onClick={() => setRepayTarget(loan)} className="px-5 py-2.5 rounded-xl bg-vicoba-forest text-white hover:bg-emerald-900 font-bold text-sm transition-colors w-full md:w-auto">
                  {t('mark_repaid')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {signingLoan && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-vicoba-dark/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 p-6 w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative">
            <button onClick={() => setSigningLoan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-vicoba-dark dark:hover:text-gray-100"><FaXmark size={20} /></button>
            <h3 className="text-lg font-bold text-vicoba-dark dark:text-gray-100 mb-4">{t('sign_form')}</h3>
            <SignaturePad onChange={setSigData} label={role === 'treasurer' ? t('treasurer_sig') : t('secretary_sig')} />
            <div className="flex gap-3 pt-4">
              <button onClick={() => setSigningLoan(null)} className="flex-1 py-3 text-gray-500 dark:text-gray-300 font-bold text-sm">{t('cancel')}</button>
              <button onClick={submitSign} disabled={signMutation.isPending} className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                {signMutation.isPending ? <><Spinner /> {t('saving')}</> : t('save_signature')}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={pendingAction?.status === 'approved' ? t('approve_loan_title') : t('reject_loan_title')}
        message={
          pendingAction?.status === 'approved'
            ? `Je, una uhakika unataka kuidhinisha mkopo wa TZS ${pendingAction?.amount?.toLocaleString()} kwa ${pendingAction?.name}?`
            : `Je, una uhakika unataka kukataa ombi la mkopo la ${pendingAction?.name}?`
        }
        onConfirm={() => pendingAction && updateMutation.mutate({ id: pendingAction.id, status: pendingAction.status })}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!repayTarget}
        title={t('mark_repaid')}
        message={repayTarget ? `Thibitisha ${repayTarget.member?.name} amelipa mkopo wa TZS ${Math.round(repayTarget.amountRequested * (1 + (repayTarget.interestRate || 0) / 100)).toLocaleString()} (pamoja na riba)?` : ''}
        onConfirm={() => repayMutation.mutate(repayTarget._id, { onSuccess: () => setRepayTarget(null) })}
        onCancel={() => setRepayTarget(null)}
        isLoading={repayMutation.isPending}
      />
    </div>
  );
};

export default LoanApprovalsPage;
