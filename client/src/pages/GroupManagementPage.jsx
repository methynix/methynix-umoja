import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { FaLayerGroup, FaPlus } from 'react-icons/fa';

const GroupManagementPage = () => {
  const { data: stats } = useQuery({
    queryKey: ['globalStats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/stats/global'); // Tumeiandika kwenye Controller
      return data.data;
    }
  });

  return (
    <div className="space-y-8 animate-in slide-up duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Group Administration</h2>
        <button className="btn-glow flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase">
          <FaPlus /> Create New Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-8 border-neon-blue">
            <p className="text-gray-500 text-xs font-black uppercase mb-2">Total Managed Groups</p>
            <h3 className="text-5xl font-black text-white">{stats?.groupCount || 0}</h3>
        </div>
        <div className="card-glass p-8 border-neon-green">
            <p className="text-gray-500 text-xs font-black uppercase mb-2">Total System Liquidity</p>
            <h3 className="text-5xl font-black text-white">TZS {stats?.totalShares?.toLocaleString() || 0}</h3>
        </div>
      </div>

      {/* List of all groups will go here */}
      <div className="card-glass p-10 text-center text-gray-500 italic">
        Database query for all distinct groupCodes...
      </div>
    </div>
  );
};

export default GroupManagementPage;