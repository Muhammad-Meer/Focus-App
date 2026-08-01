import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';
import { login, signup } from '../../api';
import { AuthUser } from '../../context/AppContext';

interface AuthPageProps {
  onAuthed: (user: AuthUser) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthed }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } =
        mode === 'login' ? await login({ email: form.email, password: form.password }) : await signup(form);
      localStorage.setItem('user', JSON.stringify(data));
      onAuthed(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-soft overflow-hidden animate-fadeIn">
        {/* Brand Side */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-7 h-7 fill-white/20" />
              <span className="font-bold text-2xl tracking-tight">Zaf Focus</span>
            </div>
            <p className="text-xs font-medium tracking-wide text-indigo-200 mt-1">
              Deep Work Engine
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Protect your attention.
              <br />
              Build better habits.
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Immerse yourself in distraction-free deep work sessions with ambient sound,
              streaks, goals, and detailed focus analytics.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '25m', label: 'Pomodoro' },
              { value: '∞', label: 'Ambient Sound' },
              { value: 'XP', label: 'Rewards' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center ring-1 ring-white/20">
                <p className="text-xl font-extrabold">{s.value}</p>
                <p className="text-[11px] text-indigo-200 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Side */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="md:hidden flex items-center space-x-2 mb-8">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-xl tracking-tight">Zaf Focus</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">
            {mode === 'login'
              ? 'Sign in to continue your deep work journey.'
              : 'Start building your focus streak today.'}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-medium text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                name="password"
                type="password"
                placeholder={mode === 'signup' ? 'Password (min 6 characters)' : 'Password'}
                value={form.password}
                onChange={handleChange}
                required
                minLength={mode === 'signup' ? 6 : undefined}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl shadow-sm transition-all cursor-pointer"
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              <span>{loading ? (mode === 'login' ? 'Signing in...' : 'Creating account...') : mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
            </button>
          </form>

          <p className="text-xs text-[var(--text-muted)] mt-6 text-center">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {mode === 'login' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
