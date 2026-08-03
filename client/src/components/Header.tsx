import React from 'react';
import { Bell, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeRoute,
    setActiveRoute,
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    setProfileModalOpen,
    user,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const initials = (user?.name || '')
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent border-b border-transparent md:border-[var(--border-color)]">
      {/* Page Title Header (matching top left in screenshot: "Zaf Focus") */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          {activeRoute === 'settings'
            ? 'Zaf Focus'
            : activeRoute === 'dashboard'
            ? 'Dashboard'
            : activeRoute === 'focus'
            ? 'Focus Engine'
            : activeRoute === 'stats'
            ? 'Analytics & Stats'
            : activeRoute === 'achievements'
            ? 'Achievements & Badges'
            : 'Focus Goals'}
        </h1>
      </div>

      {/* Top Right Utilities */}
      <div className="flex items-center space-x-3">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-primary)] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-[var(--bg-page)]" />
            )}
          </button>
        </div>

        {/* Settings shortcut button */}
        <button
          id="btn-header-settings"
          onClick={() => setActiveRoute('settings')}
          className={`p-2 rounded-xl transition-colors ${
            activeRoute === 'settings'
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-primary)]'
          }`}
          title="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>

        {/* User Avatar pill matching screenshot ("img") */}
        <button
          id="btn-user-profile"
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:ring-2 hover:ring-indigo-500 transition-all ml-1"
          title="User Profile"
        >
          {initials || ''}
        </button>
      </div>
    </header>
  );
};
