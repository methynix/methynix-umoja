import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

export const useMyTransactions = () => {
    return useQuery({
        queryKey: ['myTransactions'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/transactions/my-history');
            return data.data.transactions;
        },
        retry: false,
    });
};

export const useRecordContribution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/transactions/record', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groupMembers'] });
            queryClient.invalidateQueries({ queryKey: ['userStats'] });
            queryClient.invalidateQueries({ queryKey: ['myLedger'] });
            toast.success('Mchango umerekodiwa kikamilifu!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindwa kurekodi mchango');
        }
    });
};
