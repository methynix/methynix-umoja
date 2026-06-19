import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { FaArrowLeft } from 'react-icons/fa6';

const ROLE_LABELS = {
  superadmin: 'Msimamizi Mkuu',
  admin: 'Mwenyekiti',
  secretary: 'Katibu',
  member: 'Mwanachama',
};

const GroupMembersPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: members, isLoading, isError, error } = useQuery({
    queryKey: ['groupDetailMembers', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/groups/${id}/members`);
      return data.data.members;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-vicoba-forest border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-vicoba-earth font-bold text-sm">
          {error?.response?.data?.message || 'Imeshindwa kupakua wanachama wa kikundi hiki.'}
        </p>
        <button
          onClick={() => navigate('/dashboard/manage-groups')}
          className="bg-vicoba-forest hover:bg-emerald-900 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
        >
          Rudi kwenye Vikundi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/manage-groups')}
          className="p-2.5 rounded-xl border border-gray-200 bg-white text-vicoba-dark hover:bg-gray-50 transition-colors shadow-sm"
          aria-label="Rudi"
        >
          <FaArrowLeft size={14} />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-vicoba-dark tracking-tight">Wanachama wa Kikundi</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Jumla: {members?.length || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-vicoba-forest/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 border-b border-gray-100">
              <tr>
                <th className="p-4">Jina</th>
                <th className="p-4">Namba ya Simu</th>
                <th className="p-4">Wajibu</th>
                <th className="p-4 text-right">Tarehe ya Kujiunga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members?.length > 0 ? (
                members.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-vicoba-dark font-bold text-sm">{m.name}</td>
                    <td className="p-4 text-gray-500 text-sm font-medium">{m.phone}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-gray-200 text-gray-500 bg-gray-50">
                        {ROLE_LABELS[m.role] || 'Mwanachama'}
                      </span>
                    </td>
                    <td className="p-4 text-right text-xs text-gray-400 font-medium">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-16 text-center text-gray-400 font-medium text-sm">
                    Kikundi hiki hakina wanachama bado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GroupMembersPage;
