import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';

// Hook to get the current logged-in user details
export const useGetUser = () => {
    return useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/users/me');
            return data.data; // Assuming your MVC returns { status: 'success', data: { user } }
        }
    });
};

// Hook to update user profile
export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updateData) => {
            const { data } = await axiosInstance.patch('/users/update-me', updateData);
            return data;
        },
        onSuccess: () => {
            // Invalidate and refetch user data so UI updates everywhere
            queryClient.invalidateQueries(['authUser']);
        }
    });
};