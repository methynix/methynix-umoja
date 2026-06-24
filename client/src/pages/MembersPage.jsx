import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  FaUserPlus, FaTrash, FaPiggyBank,
  FaUser, FaPhone, FaXmark, FaLayerGroup
} from 'react-icons/fa6';
import { FaSearch, FaShieldAlt } from 'react-icons/fa';
import { useMembers, useCreateMember, useDeleteMember } from '../hooks/useMembers';
import { useUserStats } from '../hooks/useUser';
import { useRecordContribution } from '../hooks/useTransaction';
import ConfirmModal from '../components/ConfirmModal';
import Spinner from '../components/Spinner';

const MembersPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: currentUser } = useUserStats();
  const { data: members, isLoading } = useMembers();
  const createMutation = useCreateMember();
  const deleteMutation = useDeleteMember();
  const recordMutation = useRecordContribution();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // SEPARATE forms so one modal never carries the other's data,
  // and so reopening "Sajili" never shows the previous member's details.
  const registerForm = useForm({
    defaultValues: { name: '', phone: '', role: 'member', shares: 0, socialFund: 0 },
  });
  const recordForm = useForm({ shouldUnregister: true, defaultValues: { month: '', type: 'share', amount: '', shares: '' } });

  const isSuper = currentUser?.role === 'superadmin';
  const isAdmin = currentUser?.role === 'admin';
  const isSecretary = currentUser?.role === 'secretary';
  const isTreasurer = currentUser?.role === 'treasurer';
  const canManage = isAdmin || isSecretary || isTreasurer;
  const shareValue = currentUser?.groupId?.shareValue || 0;
  const socialFundAmount = currentUser?.groupId?.socialFundAmount || 0;
  const mawazoAmount = currentUser?.groupId?.mawazoAmount || 0;
  const recordType = recordForm.watch('type');
  const recordShares = recordForm.watch('shares');
  const fixedFor = (tp) => (tp === 'mawazo' ? mawazoAmount : tp === 'social_fund' ? socialFundAmount : 0);

  const months = [
    { val: 1, name: 'Januari' }, { val: 2, name: 'Februari' },
    { val: 3, name: 'Machi' }, { val: 4, name: 'Aprili' },
    { val: 5, name: 'Mei' }, { val: 6, name: 'Juni' },
    { val: 7, name: 'Julai' }, { val: 8, name: 'Agosti' },
    { val: 9, name: 'Septemba' }, { val: 10, name: 'Oktoba' },
    { val: 11, name: 'Novemba' }, { val: 12, name: 'Desemba' },
  ];
  const currentMonth = new Date().getMonth() + 1;

  // Always start the register modal from a clean slate.
  const openRegisterModal = () => {
    registerForm.reset({ name: '', phone: '', role: 'member', shares: 0, socialFund: 0 });
    setIsModalOpen(true);
  };
  const closeRegisterModal = () => {
    setIsModalOpen(false);
    registerForm.reset({ name: '', phone: '', role: 'member', shares: 0, socialFund: 0 });
  };

  const openContributionModal = (member) => {
    setSelectedMember(member);
    recordForm.reset({ type: 'share', shares: '' });
    setIsContributionModalOpen(true);
  };
  const closeContributionModal = () => {
    setIsContributionModalOpen(false);
    setSelectedMember(null);
    recordForm.reset({ type: 'share', shares: '' });
  };

  const filteredMembers = members?.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
  );

  const onRegister = (data) => {
    createMutation.mutate(
      {
        ...data,
        shares: Number(data.shares) || 0,
        socialFund: Number(data.socialFund) || 0,
      },
      { onSuccess: () => closeRegisterModal() }
    );
  };

  const onRecord = (data) => {
    const payload = {
      memberId: selectedMember._id,
      type: data.type,
    };
    if (data.type === 'share') {
      payload.shares = Number(data.shares);
    }
    recordMutation.mutate(payload, { onSuccess: () => closeContributionModal() });
  };

  const handleDeleteConfirm = () => {
    if (memberToDelete) {
      deleteMutation.mutate(memberToDelete._id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        },
      });
    }
  };

  // Superadmin manages the platform by GROUP, not by a single giant user list.
  if (isSuper) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-4 px-6">
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-vicoba-forest">
          <FaLayerGroup size={32} />
        </div>
        <h2 className="text-xl font-extrabold text-vicoba-dark dark:text-gray-100">{t('use_groups_title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 max-w-sm font-medium">
          {t('use_groups_desc')}
        </p>
        <button
          onClick={() => navigate('/dashboard/manage-groups')}
          className="bg-vicoba-forest hover:bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15"
        >
          {t('go_to_groups')}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClass =
    'w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-semibold transition-all';
  const labelClass = 'block text-xs font-bold text-vicoba-dark dark:text-gray-100 mb-1.5';

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark dark:text-gray-100 tracking-tight">{t('members_title')}</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm font-medium mt-1">
            {t('group_name')}: {currentUser?.groupId?.name || '...'}
          </p>
        </div>

        {canManage && (
          <button
            onClick={openRegisterModal}
            className="bg-vicoba-forest hover:bg-emerald-900 text-white flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm w-full md:w-auto justify-center transition-colors shadow-md shadow-vicoba-forest/10 active:scale-[0.99]"
          >
            <FaUserPlus /> {t('register_member')}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 p-1 flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shadow-vicoba-forest/5">
        <div className="pl-4 text-gray-400 dark:text-gray-500"><FaSearch size={14} /></div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('search_member')}
          className="bg-transparent border-none outline-none text-vicoba-dark dark:text-gray-100 w-full py-3 text-sm placeholder-gray-400 font-medium"
        />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-md shadow-vicoba-forest/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-500 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="p-4">{t('members_title')}</th>
                <th className="p-4">{t('user_role')}</th>
                <th className="p-4">{t('shares')}</th>
                <th className="p-4">{t('social_fund')}</th>
                <th className="p-4 text-right">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers?.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm font-bold text-vicoba-forest shadow-sm">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-vicoba-dark dark:text-gray-100 font-bold text-sm">{member.name}</p>
                          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium">{member.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        member.role === 'admin' ? 'border-amber-200 text-vicoba-gold bg-amber-50' :
                        member.role === 'secretary' ? 'border-indigo-100 text-indigo-600 bg-indigo-50' :
                        'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-950'
                      }`}>
                        {member.role === 'admin' ? 'Mwenyekiti' : member.role === 'secretary' ? 'Katibu' : member.role === 'treasurer' ? 'Muweka Hazina' : 'Mwanachama'}
                      </span>
                    </td>
                    <td className="p-4 text-vicoba-forest font-bold text-sm">TZS {member.shares?.toLocaleString()}</td>
                    <td className="p-4 text-vicoba-gold font-bold text-sm">TZS {member.socialFund?.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canManage && (
                          <button
                            onClick={() => openContributionModal(member)}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-vicoba-forest hover:bg-emerald-50 hover:border-emerald-200 transition-colors bg-white dark:bg-gray-900 shadow-sm"
                            title="Jaza Michango"
                          >
                            <FaPiggyBank size={14} />
                          </button>
                        )}
                        {isAdmin && member._id !== currentUser._id && (
                          <button
                            onClick={() => { setMemberToDelete(member); setIsDeleteModalOpen(true); }}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-vicoba-earth hover:bg-red-50 hover:border-red-200 transition-colors bg-white dark:bg-gray-900 shadow-sm"
                            title="Futa Mwanachama"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-gray-400 dark:text-gray-500 font-medium text-sm">
                    {t('no_members')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-vicoba-dark/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 w-full max-w-lg rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl my-auto relative">
            <button onClick={closeRegisterModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-vicoba-dark dark:text-gray-100 transition-colors">
              <FaXmark size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-vicoba-dark dark:text-gray-100 tracking-tight">{t('register_member')}</h3>
              <p className="text-xs font-semibold text-vicoba-forest bg-vicoba-forest/5 px-2 py-1 rounded mt-1.5 w-fit">
                Kikundi: {currentUser?.groupId?.name}
              </p>
            </div>

            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className={labelClass}>{t('full_name')}</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    {...registerForm.register('name', { required: 'Jina ni lazima' })}
                    className={inputClass}
                    placeholder="Mfano: Asha Juma"
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <span className="text-xs text-vicoba-earth font-bold block mt-1">
                    {registerForm.formState.errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className={labelClass}>{t('phone_number')}</label>
                <div className="relative flex items-center">
                  <FaPhone className="absolute left-4 text-gray-400 dark:text-gray-500 text-sm" />
                  <input
                    {...registerForm.register('phone', { required: 'Namba ya simu ni lazima' })}
                    className={inputClass}
                    placeholder="07xxxxxxxx"
                  />
                </div>
                {registerForm.formState.errors.phone && (
                  <span className="text-xs text-vicoba-earth font-bold block mt-1">
                    {registerForm.formState.errors.phone.message}
                  </span>
                )}
              </div>

              {isAdmin && (
                <div>
                  <label className={labelClass}>{t('user_role')}</label>
                  <select
                    {...registerForm.register('role')}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-semibold cursor-pointer transition-all"
                  >
                    <option value="member">Mwanachama (Member)</option>
                    <option value="secretary">Katibu (Secretary)</option>
                    <option value="treasurer">Muweka Hazina (Treasurer)</option>
                    <option value="admin">Mwenyekiti (Admin)</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('first_shares')}</label>
                  <div className="relative flex items-center">
                    <FaPiggyBank className="absolute left-4 text-gray-400 dark:text-gray-500 text-sm" />
                    <input type="number" min="0" {...registerForm.register('shares')} className={inputClass} placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{t('social_fund_input')}</label>
                  <div className="relative flex items-center">
                    <FaShieldAlt className="absolute left-4 text-gray-400 dark:text-gray-500 text-sm" />
                    <input type="number" min="0" {...registerForm.register('socialFund')} className={inputClass} placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <p className="text-xs text-vicoba-gold font-bold">
                  {t('first_password_note')}
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={closeRegisterModal} className="flex-1 py-3 text-gray-500 dark:text-gray-300 font-bold text-sm transition-colors hover:text-vicoba-dark dark:text-gray-100">
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? <><Spinner /> {t('registering')}</> : t('complete_registration')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTRIBUTION MODAL */}
      {isContributionModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-vicoba-dark/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 p-6 md:p-8 w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl relative">
            <button onClick={closeContributionModal} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-vicoba-dark dark:text-gray-100 transition-colors">
              <FaXmark size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-vicoba-dark dark:text-gray-100 tracking-tight">{t('record_contribution')}</h3>
              <p className="text-xs font-semibold text-vicoba-forest bg-vicoba-forest/5 px-2 py-1 rounded mt-1.5 w-fit">
                Mwanachama: {selectedMember?.name}
              </p>
            </div>

            <form onSubmit={recordForm.handleSubmit(onRecord)} className="space-y-5">
              <div className="text-xs font-bold text-vicoba-forest bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-lg px-3 py-2">
                {t('current_week_note')}
              </div>

              <div>
                <label className={labelClass}>{t('contribution_type')}</label>
                <select
                  {...recordForm.register('type', { required: true })}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-sm font-semibold cursor-pointer transition-all"
                >
                  <option value="share">{t('share_type')}</option>
                  <option value="social_fund">{t('social_type')}</option>
                  <option value="mawazo">{t('mawazo_type')}</option>
                </select>
              </div>

              {recordType === 'share' ? (
                <div>
                  <label className={labelClass}>{t('shares_count')}</label>
                  <input
                    type="number"
                    min="1"
                    {...recordForm.register('shares', { required: t('shares_count_hint'), min: { value: 1, message: 'Lazima iwe zaidi ya 0' } })}
                    placeholder="Mfano: 5"
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3.5 rounded-xl focus:ring-2 focus:ring-vicoba-leaf focus:border-vicoba-forest outline-none text-vicoba-dark dark:text-gray-100 text-base font-bold transition-all"
                  />
                  <div className="mt-2 text-xs font-bold text-vicoba-forest bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-lg px-3 py-2">
                    {shareValue > 0
                      ? `${t('computed_amount')}: TZS ${((Number(recordShares) || 0) * shareValue).toLocaleString()} (${shareValue.toLocaleString()} ${t('per_share')})`
                      : 'Thamani ya hisa haijawekwa. Mwenyekiti aiweke kwenye Mipangilio ya Kikundi.'}
                  </div>
                  {recordForm.formState.errors.shares && (
                    <span className="text-xs text-vicoba-earth font-bold block mt-1">
                      {recordForm.formState.errors.shares.message}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <label className={labelClass}>{t('amount_tzs')}</label>
                  <div className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 p-3.5 rounded-xl text-vicoba-dark dark:text-gray-100 text-base font-bold">
                    TZS {fixedFor(recordType).toLocaleString()}
                  </div>
                  <div className="mt-2 text-xs font-bold text-vicoba-forest bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-lg px-3 py-2">
                    {fixedFor(recordType) > 0 ? t('fixed_amount_note') : t('fixed_amount_unset')}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={closeContributionModal} className="flex-1 py-3 text-gray-500 dark:text-gray-300 font-bold text-sm transition-colors hover:text-vicoba-dark dark:text-gray-100">
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={recordMutation.isPending}
                  className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {recordMutation.isPending ? <><Spinner /> {t('saving')}</> : t('save_contribution')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t('delete_member_title')}
        message={`Je, una uhakika unataka kumfuta ${memberToDelete?.name} kutoka kwenye mfumo? Kitendo hiki hakina marekebisho.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default MembersPage;
