import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/authContext';

const AuthGuard = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    const token = localStorage.getItem('token');

    if (loading) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#39FF14]"></div>
            </div>
        );
    }

    if (!user && !token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user && token) {
        return (
            <div className="h-screen w-full bg-black flex items-center justify-center text-green-500">
                Inapakia Dashboard...
            </div>
        );
    }

    return children;
};

export default AuthGuard;