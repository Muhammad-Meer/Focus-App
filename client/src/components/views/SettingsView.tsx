import React from 'react';
import {
  Sliders,
  CreditCard,
  Shield,
  ChevronDown,
  Download,
  Trash2,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
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
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h2>
        <p className="text-secondary mt-1.5 text-base">
          Customize your deep work environment and manage your account.
        </p>
      </div>

      {/* 1. General Section */}
      <section className="space-y-4" id="section-general">
        <div className="flex items-center space-x-2 text-xl font-semibold text-foreground">
          <Sliders className="w-5 h-5 text-primary" />
          <h3>General</h3>
        </div>

        <div className="bg-surface border border-border rounded-2xl divide-y divide-border shadow-xs">
          {/* Language row */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-base">
                Language
              </h4>
              <p className="text-sm text-secondary mt-0.5">
                Primary display language for the application.
              </p>
            </div>

            <div className="relative inline-block self-start sm:self-auto">
              <select
                id="select-language"
                value={settings.language}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="appearance-none bg-surface-subtle border border-border text-foreground text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="English (US)">English (US)</option>
                <option value="English (UK)">English (UK)</option>
                <option value="Spanish (ES)">Spanish (ES)</option>
                <option value="German (DE)">German (DE)</option>
                <option value="French (FR)">French (FR)</option>
                <option value="Japanese (JP)">Japanese (JP)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Startup Behavior row */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-base">
                Startup Behavior
              </h4>
              <p className="text-sm text-secondary mt-0.5">
                Automatically start Zenith Focus when your computer boots.
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              id="toggle-startup-behavior"
              onClick={() => updateSettings({ autoStartOnBoot: !settings.autoStartOnBoot })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                settings.autoStartOnBoot ? 'bg-primary' : 'bg-border'
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

      {/* 2. Subscription Section */}
      <section className="space-y-4" id="section-subscription">
        <div className="flex items-center space-x-2 text-xl font-semibold text-foreground">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3>Subscription</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Current Plan */}
          <div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl p-6 shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden">
            <div>
              <span className="inline-block bg-white/20 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase mb-3">
                CURRENT PLAN
              </span>
              <h4 className="text-2xl font-extrabold tracking-tight">Free Tier</h4>
            </div>

            <div className="flex items-end justify-between mt-6">
              <p className="text-xs text-white/80 font-medium">
                No active subscription yet.
              </p>
              <button
                id="btn-manage-subscription"
                onClick={() => setBillingModalOpen(true)}
                className="bg-white text-primary hover:bg-primary-soft text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Right Card: Billing History */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-foreground text-base mb-3">
                Billing History
              </h4>
              <div className="space-y-2.5 text-sm">
                <p className="py-4 text-center text-xs text-muted">
                  No billing history yet.
                </p>
              </div>
            </div>

            <button
              id="btn-download-invoices"
              onClick={exportDataCSV}
              className="text-xs font-semibold text-primary hover:underline self-start mt-4 cursor-pointer"
            >
              Download all invoices
            </button>
          </div>
        </div>
      </section>

      {/* 3. Privacy & Security Section */}
      <section className="space-y-4" id="section-privacy">
        <div className="flex items-center space-x-2 text-xl font-semibold text-foreground">
          <Shield className="w-5 h-5 text-primary" />
          <h3>Privacy & Security</h3>
        </div>

        <div className="bg-surface border border-border rounded-2xl divide-y divide-border shadow-xs">
          {/* Data Export */}
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground text-base">
                Data Export
              </h4>
              <p className="text-sm text-secondary mt-0.5">
                Download a copy of your personal focus data and history.
              </p>
            </div>

            <div className="relative">
              <button
                id="btn-export-data-trigger"
                onClick={() => setDownloadDropdown(!downloadDropdown)}
                className="p-2.5 rounded-xl border border-border hover:bg-surface-subtle text-foreground transition-colors cursor-pointer"
                title="Export Focus Data"
              >
                <Download className="w-5 h-5" />
              </button>

              {downloadDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg p-2 z-20 space-y-1">
                  <button
                    onClick={() => {
                      exportDataJSON();
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle rounded-lg"
                  >
                    Export as JSON (.json)
                  </button>
                  <button
                    onClick={() => {
                      exportDataCSV();
                      setDownloadDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-foreground hover:bg-surface-subtle rounded-lg"
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
              <h4 className="font-semibold text-error text-base">
                Account Deletion
              </h4>
              <p className="text-sm text-secondary mt-0.5">
                Permanently remove all your account information and focus history.
              </p>
            </div>

            <button
              id="btn-delete-account-trigger"
              onClick={() => setDeleteModalOpen(true)}
              className="p-2.5 rounded-xl border border-error/30 hover:bg-error-soft text-error transition-colors cursor-pointer"
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
          className="flex items-center space-x-3 px-8 py-3 rounded-xl border border-border bg-surface hover:bg-surface-subtle text-foreground text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-muted" />
          <span>Sign out of all sessions</span>
        </button>

        <div className="text-center text-xs text-muted space-y-1">
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
