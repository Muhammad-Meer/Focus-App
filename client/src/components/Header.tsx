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
    <header className="flex items-center justify-between px-6 py-4 bg-transparent border-b border-transparent md:border-border">
      {/* Page Title Header (matching top left in screenshot: "Zaf Focus") */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
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
            className="p-2 rounded-xl text-secondary hover:bg-surface-subtle hover:text-foreground transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
            )}
          </button>
        </div>

        {/* Settings shortcut button */}
        <button
          id="btn-header-settings"
          onClick={() => setActiveRoute('settings')}
          className={`p-2 rounded-xl transition-colors ${
            activeRoute === 'settings'
              ? 'text-primary bg-primary-soft'
              : 'text-secondary hover:bg-surface-subtle hover:text-foreground'
          }`}
          title="Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>

        {/* User Avatar pill matching screenshot ("img") */}
        <button
          id="btn-user-profile"
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-subtle text-secondary text-xs font-semibold hover:ring-2 hover:ring-primary transition-all ml-1"
          title="User Profile"
        >
          {initials || ''}
        </button>
      </div>
    </header>
  );
};
