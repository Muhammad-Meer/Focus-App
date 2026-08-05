import React from 'react';
import { X, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsPopover: React.FC = () => {
  const {
    notifications,
    notificationsOpen,
    setNotificationsOpen,
    markNotificationRead,
    clearNotifications,
  } = useApp();

  if (!notificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 animate-fadeIn">
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-2xs"
        onClick={() => setNotificationsOpen(false)}
      />
      <div className="relative w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-5 z-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-[var(--text-primary)]">Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-[var(--text-muted)] hover:text-rose-600 font-medium"
                title="Clear all"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-xs text-[var(--text-muted)]">
              No recent notifications.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-all cursor-pointer ${
                  n.read
                    ? 'border-[var(--border-color)] bg-[var(--bg-card-subtle)] opacity-70'
                    : 'border-indigo-200 bg-indigo-50/40'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
                  <span>{n.title}</span>
                  <span className="text-[10px] font-normal text-[var(--text-muted)]">
                    {n.time}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)]">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
