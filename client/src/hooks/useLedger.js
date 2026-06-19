import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

export const useMyLedger = () => {
    return useQuery({
        queryKey: ['myLedger'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/transactions/my-ledger');
            return data.data.ledger;
        },
        retry:false
    });
};