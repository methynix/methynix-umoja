import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="card-glass p-8 w-full max-w-md border-t-4 border-red-500">
        <h2 className="text-2xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;