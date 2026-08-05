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
        className="fixed inset-0 bg-overlay/40 backdrop-blur-2xs"
        onClick={() => setNotificationsOpen(false)}
      />
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-3xl shadow-2xl p-5 z-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Notifications</h3>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-muted hover:text-error font-medium"
                title="Clear all"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1 text-muted hover:text-foreground rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-xs text-muted">
              No recent notifications.
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-2xl border text-xs space-y-1 transition-all cursor-pointer ${
                  n.read
                    ? 'border-border bg-surface-subtle opacity-70'
                    : 'border-primary/20 bg-primary-soft/60'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-foreground">
                  <span>{n.title}</span>
                  <span className="text-[10px] font-normal text-muted">
                    {n.time}
                  </span>
                </div>
                <p className="text-secondary">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
