import React, { useState, useEffect, useMemo } from 'react';
import AuthContext from '../contexts/authContext';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.get('/auth/me');
            setUser(response.data.data.user);
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false); 
        }
    };

    checkAuth();
}, []);

    const login = async (phone, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { phone, password });
        
        console.log("Server Response:", response.data);

        const { token, data } = response.data; 

        if (token && data?.user) {
            localStorage.setItem('token', token);
            setUser(data.user);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Login Error:", error.response?.data);
        toast.error(error.response?.data?.message || 'Login failed');
        return false;
    }
};

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out safely');
    };

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};