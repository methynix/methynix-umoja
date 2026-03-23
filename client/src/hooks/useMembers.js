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

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId) => {
      const { data } = await axiosInstance.delete(`/users/members/${memberId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groupMembers']);
      toast.success('Mwanachama amefutwa kwenye mfumo!');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || 'Imeshindwa kufuta mwanachama';
      toast.error(errorMsg);
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