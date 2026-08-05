import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileModal: React.FC = () => {
  const { profileModalOpen, setProfileModalOpen, sessions, user, serverStats } = useApp();

  if (!profileModalOpen) return null;

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const displayName = user?.name || '';
  const displayEmail = user?.email || '';
  const initials = displayName
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-6">
        <button
          onClick={() => setProfileModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-full hover:bg-[var(--bg-card-subtle)]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
            {initials || ''}
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{displayName}</h3>
            <p className="text-xs text-[var(--text-muted)] font-medium">{displayEmail}</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
            {serverStats?.level ? `Level ${serverStats.level}` : 'Member'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-[var(--bg-card-subtle)] p-3 rounded-2xl text-center space-y-0.5 border border-[var(--border-color)]">
            <span className="text-xl font-bold text-[var(--text-primary)]">
              {(totalMinutes / 60).toFixed(1)}h
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">Total Focused</p>
          </div>
          <div className="bg-[var(--bg-card-subtle)] p-3 rounded-2xl text-center space-y-0.5 border border-[var(--border-color)]">
            <span className="text-xl font-bold text-[var(--text-primary)]">
              {sessions.length}
            </span>
            <p className="text-[11px] text-[var(--text-muted)]">Sessions Done</p>
          </div>
        </div>

        <button
          onClick={() => setProfileModalOpen(false)}
          className="w-full py-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-primary)] text-xs font-semibold transition-colors"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
};
