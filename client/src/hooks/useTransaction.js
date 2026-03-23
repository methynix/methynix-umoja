import { useQuery ,useQueryClient,useMutation} from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

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

// src/hooks/useTransaction.js
export const useRecordContribution = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/transactions/record', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['groupMembers']);
            queryClient.invalidateQueries(['userStats']);
            toast.success('Mchango umerekodiwa kikamilifu! 💰');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindwa kurekodi mchango');
        }
    });
};