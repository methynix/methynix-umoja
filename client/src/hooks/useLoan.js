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

export const useRepayLoan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (loanId) => {
            const { data } = await axiosInstance.patch(`/loans/${loanId}/repay`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminLoans'] });
            queryClient.invalidateQueries({ queryKey: ['groupSummary'] });
            toast.success('Mkopo umewekwa hali ya: Umelipwa!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindikana');
        }
    });
};

export const useGroupSummary = () => {
    return useQuery({
        queryKey: ['groupSummary'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/groups/summary');
            return data.data.summary;
        },
        retry: false,
    });
};

export const useSignLoan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ loanId, signature }) => {
            const { data } = await axiosInstance.patch(`/loans/${loanId}/sign`, { signature });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminLoans'] });
            toast.success('Saini imehifadhiwa!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindwa kusaini');
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