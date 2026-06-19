import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

export const useGlobalStats = (isSuper) => {
    return useQuery({
        queryKey: ['globalPlatformStats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/stats/global');
            return data.data;
        },
        enabled: isSuper, // Only fetch if the user is actually a superadmin
    });
};