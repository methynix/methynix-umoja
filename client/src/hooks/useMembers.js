import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

export const useMembers = () => {
    return useQuery({
        queryKey: ['groupMembers'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/members');
            return data.data.members;
        }
    });
};

export const useCreateMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (memberData) => {
            const { data } = await axiosInstance.post('/users/members', memberData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['groupMembers']);
            toast.success('Mwanachama amesajiliwa kikamilifu!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Usajili umeshindikana');
        }
    });
};