import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 blur-[150px] rounded-full"></div>

      <div className="text-center relative z-10">
        <div className="mb-6 inline-block p-6 rounded-full bg-white/5 border border-red-500/30 animate-pulse">
          <FaExclamationTriangle className="text-6xl text-red-500" />
        </div>
        
        <h1 className="text-9xl font-black text-white/10 absolute -top-20 left-1/2 -translate-x-1/2 select-none">
          404
        </h1>

        <h2 className="text-4xl font-bold text-white mb-4">Ukurasa Haupo</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you are looking for has been moved or doesn't exist in the Methynix grid.
        </p>

        <button 
          onClick={() => navigate('/')}
          className="btn-glow px-8 py-4 rounded-2xl font-bold flex items-center gap-3 mx-auto transition-transform active:scale-95"
        >
          <FaHome /> RUDI NYUMBANI (HOME)
        </button>
      </div>
      
      {/* Matrix-like decorative elements */}
      <div className="absolute bottom-10 left-10 opacity-20 font-mono text-xs text-green-500">
        ERROR_CODE: 0x404_METHYNIX_VICOBA
      </div>
    </div>
  );
};

export default NotFound;