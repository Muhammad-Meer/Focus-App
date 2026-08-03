import React from 'react';
import {
  Globe,
  Sliders,
  CreditCard,
  Shield,
  Sun,
  Moon,
  ChevronDown,
  Download,
  Trash2,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setThemeMode,
    settings,
    updateSettings,
    setBillingModalOpen,
    setSignOutModalOpen,
    setDeleteModalOpen,
    exportDataJSON,
    exportDataCSV,
  } = useApp();

  const [downloadDropdown, setDownloadDropdown] = React.useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 animate-fadeIn" id="settings-view">
      {/* Settings Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Settings
        </h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-base">
          Customize your deep work environment and manage your account.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <section className="space-y-4" id="section-appearance">
        <div className="flex items-center space-x-2 text-xl font-semibold text-[var(--text-primary)]">
          <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3>Appearance</h3>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] text-base">
              Interface Theme
            </h4>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Switch between light and dark visual styles.
            </p>
          </div>

          {/* Theme Pill Selector */}
          <div className="bg-[var(--bg-card-subtle)] p-1 rounded-full flex items-center self-start sm:self-auto border border-[var(--border-color)]">
            <button
              id="theme-toggle-light"
              onClick={() => setThemeMode('light')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>

            <button
              id="theme-toggle-dark"
              onClick={() => setThemeMode('dark')}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. General Section */}
      <section className="space-y-4" id="section-general">
        <div className="flex items-center space-x-2 text-xl font-semibold text-[var(--text-primary)]">
          <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3>General</h3>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl divide-y divide-[var(--border-color)] shadow-xs">
          {/* Language row */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] text-base">
                Language
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Primary display language for the application.
              </p>
            </div>

            <div className="relative inline-block self-start sm:self-auto">
              <select
                id="select-language"
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="appearance-none bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish (ES)">Spanish (ES)</option>
                <option value="German (DE)">German (DE)</option>
                <option value="French (FR)">French (FR)</option>
                <option value="Japanese (JP)">Japanese (JP)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[var(--text-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Startup Behavior row */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] text-base">
                Startup Behavior
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Automatically start Zenith Focus when your computer boots.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              id="toggle-startup-behavior"
              onClick={() => updateSettings({ autoStartOnBoot: !settings.autoStartOnBoot })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                settings.autoStartOnBoot ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={settings.autoStartOnBoot}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.autoStartOnBoot ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Subscription Section */}
      <section className="space-y-4" id="section-subscription">
        <div className="flex items-center space-x-2 text-xl font-semibold text-[var(--text-primary)]">
          <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3>Subscription</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Current Plan */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden">
            <div>
              <span className="inline-block bg-white/20 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase mb-3">
                CURRENT PLAN
              </span>
              <h4 className="text-2xl font-extrabold tracking-tight">Free Tier</h4>
            </div>

            <div className="flex items-end justify-between mt-6">
              <p className="text-xs text-indigo-100 font-medium">
                No active subscription yet.
              </p>
              <button
                id="btn-manage-subscription"
                onClick={() => setBillingModalOpen(true)}
                className="bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Right Card: Billing History */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] text-base mb-3">
                Billing History
              </h4>
              <div className="space-y-2.5 text-sm">
                <p className="py-4 text-center text-xs text-[var(--text-muted)]">
                  No billing history yet.
                </p>
              </div>
            </div>

            <button
              id="btn-download-invoices"
              onClick={exportDataCSV}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline self-start mt-4 cursor-pointer"
            >
              Download all invoices
            </button>
          </div>
        </div>
      </section>

      {/* 4. Privacy & Security Section */}
      <section className="space-y-4" id="section-privacy">
        <div className="flex items-center space-x-2 text-xl font-semibold text-[var(--text-primary)]">
          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3>Privacy & Security</h3>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl divide-y divide-[var(--border-color)] shadow-xs">
          {/* Data Export */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] text-base">
                Data Export
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Download a copy of your personal focus data and history.
              </p>
            </div>

            <div className="relative">
              <button
                id="btn-export-data-trigger"
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                className="p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Export Focus Data"
              >
                <Download className="w-5 h-5" />
              </button>

              {downloadDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-lg p-2 z-20 space-y-1">
                  <button
                    onClick={() => {
                      exportDataJSON();
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] rounded-lg"
                  >
                    Export as JSON (.json)
                  </button>
                  <button
                    onClick={() => {
                      exportDataCSV();
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card-subtle)] rounded-lg"
                  >
                    Export Sessions (.csv)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Deletion */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-rose-600 dark:text-rose-400 text-base">
                Account Deletion
              </h4>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Permanently remove all your account information and focus history.
              </p>
            </div>

            <button
              id="btn-delete-account-trigger"
              onClick={() => setDeleteModalOpen(true)}
              className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
              title="Delete Account"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Sign Out Action */}
      <div className="pt-8 flex flex-col items-center justify-center space-y-6">
        <button
          id="btn-sign-out-all-sessions"
          onClick={() => setSignOutModalOpen(true)}
          className="flex items-center space-x-3 px-8 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-primary)] text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
          <span>Sign out of all sessions</span>
        </button>

        <div className="text-center text-xs text-[var(--text-muted)] space-y-1">
          <p>© 2026 Zaf Focus. All rights reserved.</p>
          <div className="space-x-3">
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:underline">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
