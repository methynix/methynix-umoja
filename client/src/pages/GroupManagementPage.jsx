import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axiosInstance from '../services/axiosInstance';
import {
  FaLayerGroup, FaSliders, FaEye, FaChevronLeft, FaChevronRight,
  FaUserShield, FaXmark, FaUser, FaPhone,
} from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import PasswordInput from '../components/PasswordInput';
import Spinner from '../components/Spinner';

const GroupManagementPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [maintConfirmOpen, setMaintConfirmOpen] = useState(false);
  const [pendingMaintValue, setPendingMaintValue] = useState(false);
  const [coAdminOpen, setCoAdminOpen] = useState(false);

  const coAdminForm = useForm({ defaultValues: { name: '', phone: '', password: '' } });

  const { data: groupData, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups', page, search],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/groups?page=${page}&search=${search}`);
      return data?.data;
    },
  });

  const { data: isMaintenance, isLoading: maintLoading } = useQuery({
    queryKey: ['maintStatus'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/settings/maintenance');
      return data?.data?.value || false;
    },
  });

  const toggleMaint = useMutation({
    mutationFn: (val) => axiosInstance.post('/settings/maintenance', { value: val }),
    onSuccess: (_, val) => {
      queryClient.invalidateQueries({ queryKey: ['maintStatus'] });
      toast.success(val ? 'Mfumo umewekwa kwenye Matengenezo' : 'Mfumo umerudi mtandaoni');
      setMaintConfirmOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Imeshindikana kubadili hali ya mfumo');
      setMaintConfirmOpen(false);
    },
  });

  const createCoAdmin = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.post('/users/members', payload);
      return data;
    },
    onSuccess: () => {
      toast.success('Msimamizi mwenzako amesajiliwa kikamilifu!');
      setCoAdminOpen(false);
      coAdminForm.reset({ name: '', phone: '', password: '' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Usajili umeshindikana');
    },
  });

  const requestToggle = (val) => {
    setPendingMaintValue(val);
    setMaintConfirmOpen(true);
  };

  const onCreateCoAdmin = (data) => {
    // Backend forces role = superadmin for a superadmin creator.
    createCoAdmin.mutate({ ...data, role: 'superadmin' });
  };

  if (groupsLoading || maintLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark tracking-tight flex items-center gap-2.5">
            <FaLayerGroup className="text-vicoba-forest" /> Usimamizi wa Vikundi
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Dhibiti vikundi vyote na mipangilio mikuu ya mfumo
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Tafuta kikundi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-white border border-gray-100 p-3 pl-10 rounded-2xl text-xs font-bold outline-none focus:border-vicoba-forest shadow-sm"
            />
          </div>

          <button
            onClick={() => { coAdminForm.reset({ name: '', phone: '', password: '' }); setCoAdminOpen(true); }}
            className="w-full sm:w-auto bg-vicoba-dark hover:bg-stone-800 text-white flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-colors shadow-sm"
          >
            <FaUserShield /> Sajili Msimamizi Mwenzako
          </button>

          <div className="flex items-center justify-between gap-4 bg-white p-3 px-4 rounded-2xl border border-gray-100 shadow-sm shadow-vicoba-forest/5 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-gray-500">
              <FaSliders className="text-vicoba-earth text-sm" />
              <span className="text-xs font-bold uppercase tracking-wide">Maintenance</span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!isMaintenance}
                disabled={toggleMaint.isPending}
                onChange={(e) => requestToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-100 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vicoba-earth peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {isMaintenance && (
        <div className="bg-amber-50 border border-amber-200 text-vicoba-gold text-xs font-bold px-4 py-3 rounded-xl">
          ⚠️ Mfumo upo kwenye Matengenezo. Watumiaji wengine wameshindwa kuingia hadi utakapozima hali hii.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {groupData?.groups?.map((group) => (
          <div
            key={group._id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-md shadow-vicoba-forest/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-gray-200"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-lg text-vicoba-dark uppercase tracking-tight">{group.name}</h4>
              <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-500">
                <span>Code ya Kikundi:</span>
                <span className="text-vicoba-gold font-mono">{group.groupCode}</span>
              </div>
            </div>

            <button
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-vicoba-dark hover:bg-gray-50 hover:border-gray-300 font-bold text-sm transition-colors flex items-center justify-center gap-2 bg-white shadow-sm shadow-vicoba-forest/5"
              onClick={() => navigate(`/dashboard/groups/${group._id}/members`)}
            >
              <FaEye size={14} className="text-gray-400" /> Angalia Wanachama
            </button>
          </div>
        ))}

        {groupData?.groups?.length === 0 && (
          <div className="p-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 font-medium text-sm uppercase tracking-widest">
            Hakuna kikundi kilichopatikana
          </div>
        )}
      </div>

      {groupData?.pages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-3 rounded-xl border border-gray-200 bg-white text-vicoba-dark disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <FaChevronLeft size={14} />
          </button>
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
            Ukurasa {page} kati ya {groupData.pages}
          </span>
          <button
            disabled={page >= groupData.pages}
            onClick={() => setPage((p) => p + 1)}
            className="p-3 rounded-xl border border-gray-200 bg-white text-vicoba-dark disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <FaChevronRight size={14} />
          </button>
        </div>
      )}

      {/* CO-ADMIN (SUPERADMIN) REGISTRATION */}
      {coAdminOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-vicoba-dark/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white p-6 md:p-8 w-full max-w-md rounded-2xl border border-gray-100 shadow-xl my-auto relative">
            <button
              onClick={() => setCoAdminOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-vicoba-dark transition-colors"
            >
              <FaXmark size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-vicoba-dark tracking-tight">Sajili Msimamizi Mwenzako</h3>
              <p className="text-xs font-semibold text-gray-500 mt-1.5">
                Watapata mamlaka kamili ya Msimamizi Mkuu (sio mwanachama wa kikundi).
              </p>
            </div>

            <form onSubmit={coAdminForm.handleSubmit(onCreateCoAdmin)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vicoba-dark mb-1.5">Jina Kamili</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 text-sm" />
                  <input
                    {...coAdminForm.register('name', { required: 'Jina ni lazima' })}
                    className="w-full bg-gray-50 border border-gray-300 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-vicoba-leaf outline-none text-vicoba-dark text-sm font-semibold transition-all"
                    placeholder="Jina la msimamizi"
                  />
                </div>
                {coAdminForm.formState.errors.name && (
                  <span className="text-xs text-vicoba-earth font-bold block mt-1">
                    {coAdminForm.formState.errors.name.message}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-vicoba-dark mb-1.5">Namba ya Simu</label>
                <div className="relative flex items-center">
                  <FaPhone className="absolute left-4 text-gray-400 text-sm" />
                  <input
                    {...coAdminForm.register('phone', { required: 'Namba ya simu ni lazima' })}
                    className="w-full bg-gray-50 border border-gray-300 p-3 pl-11 rounded-xl focus:ring-2 focus:ring-vicoba-leaf outline-none text-vicoba-dark text-sm font-semibold transition-all"
                    placeholder="07xxxxxxxx"
                  />
                </div>
                {coAdminForm.formState.errors.phone && (
                  <span className="text-xs text-vicoba-earth font-bold block mt-1">
                    {coAdminForm.formState.errors.phone.message}
                  </span>
                )}
              </div>

              <PasswordInput
                register={coAdminForm.register}
                name="password"
                errors={coAdminForm.formState.errors}
                label="Nywila"
                placeholder="Tengeneza nywila salama"
                rules={{ required: 'Nywila inahitajika', minLength: { value: 6, message: 'Tumia herufi kuanzia 6' } }}
              />

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setCoAdminOpen(false)} className="flex-1 py-3 text-gray-500 font-bold text-sm transition-colors hover:text-vicoba-dark">
                  Ghairi
                </button>
                <button
                  type="submit"
                  disabled={createCoAdmin.isPending}
                  className="flex-1 bg-vicoba-forest hover:bg-emerald-900 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-vicoba-forest/15 disabled:opacity-60 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  {createCoAdmin.isPending ? <><Spinner /> Inasajili...</> : 'Sajili'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={maintConfirmOpen}
        title={pendingMaintValue ? 'Washa Matengenezo?' : 'Zima Matengenezo?'}
        message={
          pendingMaintValue
            ? 'Ukiwasha, watumiaji wengine wote hawataweza kuingia wala kutumia mfumo hadi utakapozima. Wewe (Msimamizi Mkuu) utaendelea kuingia kawaida.'
            : 'Mfumo utarudi mtandaoni na watumiaji wote wataweza kuingia tena.'
        }
        onConfirm={() => toggleMaint.mutate(pendingMaintValue)}
        onCancel={() => setMaintConfirmOpen(false)}
        isLoading={toggleMaint.isPending}
      />
    </div>
  );
};

export default GroupManagementPage;
