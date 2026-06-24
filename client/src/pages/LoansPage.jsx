import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { 
  FaPlus, 
  FaHandHoldingDollar, 
  FaClock, 
  FaCheckDouble, 
  FaCircleInfo,
  FaReceipt,
  FaXmark
} from 'react-icons/fa6';
import { useMyLoans, useRequestLoan } from '../hooks/useLoan';
import { useUserStats } from '../hooks/useUser';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import SignaturePad from '../components/SignaturePad';

const LoansPage = () => {
  const { data: user, isLoading: uLoading } = useUserStats();
  const { data: loans, isLoading: lLoading } = useMyLoans();
  const requestLoanMutation = useRequestLoan();
  const { t } = useTranslation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appSig, setAppSig] = useState('');
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const totalShares = user?.shares || 0;
  const maxBorrowingPower = totalShares * 3;
  const isSuper = user?.role === 'superadmin';
  const loanThreshold = user?.groupId?.loanThreshold || 0;
  const watchedAmount = Number(watch('amount')) || 0;
  const needsOtherCollateral = loanThreshold > 0 && watchedAmount > loanThreshold;

  const totalActiveDebt = loans
    ?.filter(l => l.status === 'approved')
    .reduce((acc, curr) => acc + (curr.amountRequested * 1.1), 0) || 0;

  const totalPaidSoFar = loans
    ?.filter(l => l.status === 'approved')
    .reduce((acc, curr) => acc + (curr.totalPaid || 0), 0) || 0;

  const openLoanModal = () => { reset(); setAppSig(''); setIsModalOpen(true); };
  const closeLoanModal = () => { reset(); setAppSig(''); setIsModalOpen(false); };

  const onSubmit = (data) => {
    const requestedAmount = Number(data.amount);

    if (!needsOtherCollateral && requestedAmount > maxBorrowingPower) {
      return toast.error(`Kikomo chako ni TZS ${maxBorrowingPower.toLocaleString()}. Huwezi kukopa zaidi (dhamana ni hisa).`);
    }
    if (!appSig) {
      return toast.error(t('please_sign'));
    }

    requestLoanMutation.mutate(
      { ...data, applicantSignature: appSig },
      { onSuccess: () => closeLoanModal() }
    );
  };

  if (uLoading || lLoading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin shadow-glow-blue"></div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-up duration-700 pb-20">
      
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
  <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">{t('loans_title')}</h2>
  <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mt-1">{t('loans_subtitle')}</p>
</div>
<button 
  onClick={openLoanModal}
  className={`bg-vicoba-forest hover:bg-emerald-900 text-white flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-base w-full md:w-auto justify-center transition-colors shadow-md shadow-vicoba-forest/10 active:scale-[0.99] ${isSuper ? 'hidden' : ''}`}
>
  <FaPlus /> {t('request_new_loan')}
</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
  <div className="bg-white dark:bg-gray-900 p-6 border-l-4 border-vicoba-gold rounded-2xl border  shadow-md shadow-vicoba-forest/5 relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-center gap-2 text-vicoba-gold mb-2">
        <FaCircleInfo size={14} />
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-300">{t('borrow_limit')}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">TZS {maxBorrowingPower.toLocaleString()}</h2>
    </div>
    <FaHandHoldingDollar className="absolute -right-2 -bottom-2 text-gray-100/70 text-7xl pointer-events-none" />
  </div>

  <div className="bg-white dark:bg-gray-900 p-6 border-l-4 border-vicoba-earth rounded-2xl border  shadow-md shadow-vicoba-forest/5 relative overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-center gap-2 text-vicoba-earth mb-2">
        <FaClock size={14} />
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-300">{t('total_debt')}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">TZS {totalActiveDebt.toLocaleString()}</h2>
   <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-300">
        <span>Umesharudisha (Paid):</span>
        <span className="text-vicoba-forest font-bold">TZS {totalPaidSoFar.toLocaleString()}</span>
      </div>
    </div>
    <FaReceipt className="absolute -right-2 -bottom-2 text-gray-100/70 text-7xl pointer-events-none" />
  </div>
</div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 overflow-hidden">
  <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 flex items-center justify-between">
    <div className="flex items-center gap-2">
       <FaCheckDouble className="text-vicoba-forest" />
       <h3 className="text-base font-bold text-vicoba-dark dark:text-gray-100">{t('loan_history')}</h3>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] text-left">
      <thead className="bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-500 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
        <tr>
          <th className="p-4">{t('principal')}</th>
          <th className="p-4">{t('total_with_interest')}</th>
          <th className="p-4">Umesharudisha</th>
          <th className="p-4">{t('remaining')}</th>
          <th className="p-4 text-right">{t('status')}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {loans && loans.length > 0 ? (
          loans.slice(0, 10).map(loan => {
            const totalWithInterest = loan.amountRequested * 1.1;
            const returned = loan.totalPaid || 0;
            const remaining = Math.max(0, totalWithInterest - returned);

            return (
              <tr key={loan._id} className="hover:bg-gray-50/80 transition-all">
                <td className="p-4">
                   <p className="text-vicoba-dark dark:text-gray-100 font-bold text-sm">TZS {loan.amountRequested.toLocaleString()}</p>
                   <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-medium">Sababu: {loan.purpose || 'Binafsi'}</p>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-300 font-medium text-sm">TZS {totalWithInterest.toLocaleString()}</td>
                <td className="p-4 text-vicoba-forest font-bold text-sm">TZS {returned.toLocaleString()}</td>
                <td className="p-4 text-vicoba-earth font-bold text-sm">
                   {loan.status === 'approved' ? `TZS ${remaining.toLocaleString()}` : '-'}
                </td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    loan.status === 'paid' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    loan.status === 'approved' ? 'bg-emerald-50 text-vicoba-forest border-emerald-100' :
                    loan.status === 'pending' ? 'bg-amber-50 text-vicoba-gold border-amber-100' :
                    'bg-red-50 text-vicoba-earth border-red-100'
                  }`}>
                    {loan.status === 'paid' ? t('loan_paid') : loan.status === 'approved' ? t('approved') : loan.status === 'pending' ? t('pending') : t('rejected')}
                  </span>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="5" className="p-16 text-center text-gray-400 dark:text-gray-500 font-medium text-sm">
              {t('no_loans')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      {isModalOpen && (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-vicoba-dark/60 backdrop-blur-sm p-4 overflow-y-auto">
    <div className="bg-white dark:bg-gray-900 p-6 md:p-8 w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative my-auto max-h-[92vh] overflow-y-auto">
      <button 
        onClick={closeLoanModal}
        className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-vicoba-dark dark:text-gray-100 transition-colors"
      >
        <FaXmark size={20} />
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-bold text-vicoba-dark dark:text-gray-100 tracking-tight">{t('loan_request')}</h3>
        <p className="text-xs font-semibold text-vicoba-forest bg-vicoba-forest/5 px-2 py-1 rounded mt-1.5 w-fit">Kikomo Chako: TZS {maxBorrowingPower.toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5 block">{t('amount_needed')}</label>
          <input 
            type="number"
            {...register("amount", { required: "Ingiza kiasi" })}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3.5 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-base font-bold transition-all"
            placeholder="Mfano: 500000"
          />
          {errors.amount && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.amount.message}</span>}
        </div>

        <div>
          <label className="text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5 block">{t('loan_purpose')}</label>
          <textarea 
            {...register("purpose", { required: "Elezea sababu" })}
            className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3.5 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm h-24 resize-none font-medium transition-all"
            placeholder="Elezea kwa ufupi matumizi ya mkopo huu..."
          ></textarea>
          {errors.purpose && <span className="text-xs text-vicoba-earth font-bold mt-1 block">{errors.purpose.message}</span>}
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <p className="text-xs font-bold text-vicoba-forest uppercase tracking-wide">{t('guarantor_internal')}</p>
          <div className="grid grid-cols-2 gap-3">
            <input {...register('guarantorInternalName', { required: t('required_field') })} placeholder={t('full_name')} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-sm font-semibold text-vicoba-dark dark:text-gray-100 outline-none focus:border-vicoba-forest" />
            <input {...register('guarantorInternalPhone', { required: t('required_field') })} placeholder={t('phone_number')} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-sm font-semibold text-vicoba-dark dark:text-gray-100 outline-none focus:border-vicoba-forest" />
          </div>

          <p className="text-xs font-bold text-vicoba-forest uppercase tracking-wide">{t('guarantor_external')}</p>
          <div className="grid grid-cols-2 gap-3">
            <input {...register('guarantorExternalName', { required: t('required_field') })} placeholder={t('full_name')} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-sm font-semibold text-vicoba-dark dark:text-gray-100 outline-none focus:border-vicoba-forest" />
            <input {...register('guarantorExternalPhone', { required: t('required_field') })} placeholder={t('phone_number')} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-sm font-semibold text-vicoba-dark dark:text-gray-100 outline-none focus:border-vicoba-forest" />
          </div>

          <div>
            <label className="text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5 block">{t('collateral')}</label>
            {needsOtherCollateral ? (
              <textarea {...register('collateralDescription', { required: t('required_field') })} placeholder={t('collateral_other_hint')} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-sm font-medium text-vicoba-dark dark:text-gray-100 outline-none focus:border-vicoba-forest h-20 resize-none" />
            ) : (
              <div className="text-xs font-bold text-vicoba-forest bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-lg px-3 py-2.5">
                {t('collateral_shares')}
              </div>
            )}
          </div>

          <SignaturePad value={appSig} onChange={setAppSig} label={t('applicant_sig')} />
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-center">
           <p className="text-xs text-vicoba-gold font-bold">{t('interest_note')}</p>
        </div>

        <div className="flex gap-4 pt-2">
          <button 
            type="button" 
            onClick={closeLoanModal}
            className="flex-1 py-3 text-gray-500 dark:text-gray-300 font-bold text-sm transition-colors hover:text-vicoba-dark dark:text-gray-100"
          >
            Ghairi
          </button>
          <button 
            type="submit"
            disabled={requestLoanMutation.isPending}
            className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {requestLoanMutation.isPending ? <><Spinner /> {t('sending')}</> : t('send_request')}
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