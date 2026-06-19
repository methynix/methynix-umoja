import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

export const useMyLoans = () => {
    return useQuery({
        queryKey: ['myLoans'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/loans/my-loans');
            return data.data.loans;
        }
    });
};

export const useRequestLoan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loanData) => {
            const { data } = await axiosInstance.post('/loans/request', loanData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myLoans']);
            toast.success('Ombi la mkopo limetumwa!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindwa kutuma ombi');
        }
    });
};