import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

export const useUserStats = () => {
    const token = localStorage.getItem('token');
    
    return useQuery({
        // Ongeza token kwenye queryKey ili ikibadilika i-refetch automatically
        queryKey: ['userStats', token], 
        queryFn: async () => {
            if (!token) return null;
            const { data } = await axiosInstance.get('/auth/me');
            return data.data.user;
        },
    enabled: !!token, 
    retry: false,  
    });
};