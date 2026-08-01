import React from 'react';
import { X, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SignOutModal: React.FC = () => {
  const { signOutModalOpen, setSignOutModalOpen, logout } = useApp();

  if (!signOutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-6">
        <button
          onClick={() => setSignOutModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-card-subtle)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 text-amber-600 dark:text-amber-400">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-2xl">
            <LogOut className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Sign out of all sessions?</h3>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          This action will invalidate all active login sessions across your web browser and mobile devices. You will need to sign in again to sync your focus engine data.
        </p>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => setSignOutModalOpen(false)}
            className="px-5 py-2.5 rounded-xl border border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setSignOutModalOpen(false);
              logout();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Confirm Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
