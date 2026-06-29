import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

export const useGroupMeetings = () => {
    return useQuery({
        queryKey: ['meetings'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/meetings');
            return data.data.meetings;
        },
        retry: false,
    });
};

export const useMeetingDetail = (id) => {
    return useQuery({
        queryKey: ['meeting', id],
        queryFn: async () => {
            const { data } = await axiosInstance.get(`/meetings/${id}`);
            return data.data;
        },
        enabled: !!id,
        retry: false,
    });
};

export const useMyFines = () => {
    return useQuery({
        queryKey: ['myFines'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/meetings/my-fines');
            return data.data.fines;
        },
        retry: false,
    });
};

export const useCreateMeeting = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const { data } = await axiosInstance.post('/meetings', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            toast.success('Mkutano umeanzishwa!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindikana');
        },
    });
};

export const useSaveAttendance = (meetingId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (records) => {
            const { data } = await axiosInstance.post(`/meetings/${meetingId}/attendance`, { records });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
            toast.success('Mahudhurio yamehifadhiwa!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindikana');
        },
    });
};

export const usePayFine = (meetingId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (attendanceId) => {
            const { data } = await axiosInstance.patch(`/meetings/${meetingId}/fines/${attendanceId}/pay`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
            queryClient.invalidateQueries({ queryKey: ['myFines'] });
            queryClient.invalidateQueries({ queryKey: ['groupSummary'] });
            toast.success('Faini imewekwa imelipwa!');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindikana');
        },
    });
};

export const useCloseMeeting = (meetingId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosInstance.patch(`/meetings/${meetingId}/close`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meeting', meetingId] });
            queryClient.invalidateQueries({ queryKey: ['meetings'] });
            toast.success('Mkutano umefungwa.');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Imeshindikana');
        },
    });
};
