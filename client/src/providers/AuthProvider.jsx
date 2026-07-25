import React, { useState, useEffect, useMemo } from 'react';
import AuthContext from '../contexts/authContext';
import axiosInstance from '../services/axiosInstance';
import toast from 'react-hot-toast';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Derive the initial loading state instead of setting it inside the effect:
    // if there's no token there's nothing to verify, so we don't start "loading".
    const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

    useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // loading already false — no synchronous setState needed

    let cancelled = false;
    const checkAuth = async () => {
        try {
            const response = await axiosInstance.get('/auth/me');
            if (!cancelled) setUser(response.data.data.user);
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem('token');
            if (!cancelled) setUser(null);
        } finally {
            if (!cancelled) setLoading(false);
        }
    };

    checkAuth();
    return () => { cancelled = true; };
}, []);

    const login = async (phone, password, groupCode) => {
    try {
        const response = await axiosInstance.post('/auth/login', { phone, password, groupCode });
        
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

    const setSession = (token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const value = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        setSession,
        isAuthenticated: !!user
    }), [user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};