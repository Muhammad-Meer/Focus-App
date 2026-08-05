import React, { useEffect, useState } from 'react';
import { AppProvider, AuthUser, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/landing/LandingPage';
import { SettingsView } from './components/views/SettingsView';
import { DashboardView } from './components/views/DashboardView';
import { FocusView } from './components/views/FocusView';
import { StatsView } from './components/views/StatsView';
import { AchievementsView } from './components/views/AchievementsView';
import { GoalsView } from './components/views/GoalsView';

// Modals
import { ManageSubscriptionModal } from './components/modals/ManageSubscriptionModal';
import { SupportModal } from './components/modals/SupportModal';
import { SignOutModal } from './components/modals/SignOutModal';
import { AccountDeleteModal } from './components/modals/AccountDeleteModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { NotificationsPopover } from './components/modals/NotificationsPopover';

const readStoredUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const MainLayout: React.FC = () => {
  const { activeRoute } = useApp();

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Permanent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeRoute === 'settings' && <SettingsView />}
          {activeRoute === 'dashboard' && <DashboardView />}
          {activeRoute === 'focus' && <FocusView />}
          {activeRoute === 'stats' && <StatsView />}
          {activeRoute === 'achievements' && <AchievementsView />}
          {activeRoute === 'goals' && <GoalsView />}
        </main>
      </div>

      {/* Modals & Popovers */}
      <ManageSubscriptionModal />
      <SupportModal />
      <SignOutModal />
      <AccountDeleteModal />
      <ProfileModal />
      <NotificationsPopover />
    </div>
  );
};

export default function App() {
  const [authed, setAuthed] = useState<AuthUser | null>(readStoredUser);
  const [route, setRoute] = useState<'landing' | 'app'>(() =>
    window.location.hash === '#/app' ? 'app' : 'landing',
  );

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash === '#/app' ? 'app' : 'landing');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleAuthed = (user: AuthUser) => {
    localStorage.setItem('user', JSON.stringify(user));
    setAuthed(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setAuthed(null);
  };

  if (route === 'landing') {
    return <LandingPage />;
  }

  if (!authed) {
    return <AuthPage onAuthed={handleAuthed} />;
  }

  return (
    <AppProvider user={authed} onLogout={handleLogout}>
      <MainLayout />
    </AppProvider>
  );
}
