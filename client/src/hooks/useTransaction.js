import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

export const useMyTransactions = () => {
    return useQuery({
        queryKey: ['myTransactions'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/transactions/my-history');
            return data.data.transactions;
        }
    });
};