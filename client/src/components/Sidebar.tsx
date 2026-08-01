import React from 'react';
import {
  LayoutGrid,
  Timer,
  BarChart3,
  Award,
  Target,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RouteType } from '../types';

export const Sidebar: React.FC = () => {
  const {
    activeRoute,
    setActiveRoute,
    setSupportModalOpen,
    setSignOutModalOpen,
  } = useApp();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems: { id: RouteType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'focus', label: 'Focus', icon: <Timer className="w-5 h-5" /> },
    { id: 'stats', label: 'Stats', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" /> },
    { id: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: RouteType) => {
    setActiveRoute(id);
    setMobileOpen(false);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full justify-between p-6 select-none">
      <div>
        {/* Brand Header */}
        <div className="mb-8 px-2">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-6 h-6 fill-indigo-600/20" />
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">
              Zaf Focus
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 font-medium tracking-wide">
            Deep Work Engine
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5" id="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[#d0e1fb] text-[#1b1b23] dark:bg-indigo-950/80 dark:text-indigo-200 shadow-sm font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className={isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-[var(--text-muted)]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-[var(--border-color)] space-y-1.5">
        <button
          id="btn-support"
          onClick={() => {
            setSupportModalOpen(true);
            setMobileOpen(false);
          }}
          className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-primary)] transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-[var(--text-muted)]" />
          <span>Support</span>
        </button>

        <button
          id="btn-logout"
          onClick={() => {
            setSignOutModalOpen(true);
            setMobileOpen(false);
          }}
          className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)] hover:text-[var(--text-primary)] transition-colors"
        >
          <LogOut className="w-5 h-5 text-[var(--text-muted)]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside
        id="desktop-sidebar"
        className="hidden md:block w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] h-screen sticky top-0 shrink-0"
      >
        {SidebarContent}
      </aside>

      {/* Mobile Header Bar & Drawer Toggle */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-lg text-[var(--text-primary)]">Zaf Focus</span>
        </div>
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-[var(--bg-sidebar)] h-full shadow-2xl z-10 flex flex-col">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
