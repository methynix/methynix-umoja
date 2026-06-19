import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-vicoba-dark/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 md:p-8 w-full max-w-md rounded-2xl border border-gray-100 shadow-xl transition-all space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-vicoba-dark tracking-tight">{title}</h2>
          <p className="text-sm font-medium text-gray-500 mt-2 leading-relaxed">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={onCancel} 
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 font-bold text-sm transition-colors disabled:opacity-50"
          >
            Ghairi
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-vicoba-earth text-white hover:bg-red-800 font-bold text-sm shadow-sm shadow-vicoba-earth/10 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? 'Inatekeleza...' : 'Ndio, Thibitisha'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;