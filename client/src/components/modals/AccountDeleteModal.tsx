import React, { useState } from 'react';
import { X, AlertOctagon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccountDeleteModal: React.FC = () => {
  const { deleteModalOpen, setDeleteModalOpen, resetAllData } = useApp();
  const [confirmInput, setConfirmInput] = useState('');

  if (!deleteModalOpen) return null;

  const handleDelete = () => {
    if (confirmInput.trim().toUpperCase() !== 'DELETE') return;
    resetAllData();
    alert('Account data permanently removed.');
    setDeleteModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-rose-200 dark:border-rose-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        <button
          onClick={() => setDeleteModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-card-subtle)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-rose-600 dark:text-rose-400">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-2xl">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400">Delete Account & Data?</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Permanently erases all logged focus sessions, unlocked achievements, custom goals, and settings.
        </p>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">
            Type <span className="font-mono text-rose-600 font-bold">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            placeholder="DELETE"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={confirmInput.trim().toUpperCase() !== 'DELETE'}
            onClick={handleDelete}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${
              confirmInput.trim().toUpperCase() === 'DELETE'
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-rose-300 dark:bg-rose-950 text-rose-100 cursor-not-allowed'
            }`}
          >
            Permanently Delete
          </button>
        </div>
      </div>
    </div>
  );
};
