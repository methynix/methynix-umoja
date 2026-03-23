import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { FaLayerGroup, FaChevronRight, FaChevronLeft } from 'react-icons/fa6';

const GroupManagementPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['groups', page],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/groups?page=${page}`);
      return data.data;
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black italic text-white uppercase tracking-widest">Platform Groups</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {data?.groups?.map(group => (
          <div key={group._id} className="card-glass p-5 flex justify-between items-center group hover:border-neon-blue transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue font-black border border-neon-blue/30">
                {group.name[0]}
              </div>
              <div>
                <h4 className="text-white font-bold">{group.name}</h4>
                <p className="text-gray-500 text-[10px] uppercase tracking-widest">Code: {group.groupCode}</p>
              </div>
            </div>
            <button className="text-gray-500 group-hover:text-neon-blue transition-colors">
              <FaChevronRight />
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-6 pt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} className="p-2 text-neon-green disabled:opacity-20"><FaChevronLeft /></button>
        <span className="text-xs font-black text-gray-500">PAGE {page} OF {data?.pages || 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= data?.pages} className="p-2 text-neon-green disabled:opacity-20"><FaChevronRight /></button>
      </div>
    </div>
  );
};

export default GroupManagementPage;