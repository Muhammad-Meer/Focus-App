import React from 'react';
import {
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    setActiveRoute,
    sessions,
    goals,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    timeLeft,
    timerMode,
    activeTaskTitle,
    setActiveTaskTitle,
    activeCategory,
    setActiveCategory,
    serverStats,
    settings,
    user,
  } = useApp();

  // Calculate stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter(
    (s) => new Date(s.completedAt).toISOString().slice(0, 10) === todayStr
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yesterdayMinutes = sessions
    .filter((s) => new Date(s.completedAt).toISOString().slice(0, 10) === yesterdayStr)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const vsYesterdayPct =
    yesterdayMinutes > 0
      ? Math.round(((todayMinutes - yesterdayMinutes) / yesterdayMinutes) * 100)
      : todayMinutes > 0
      ? 100
      : 0;

  const currentStreak = serverStats?.currentStreak ?? 0;
  const longestStreak = serverStats?.longestStreak ?? 0;
  const dailyTarget = settings.dailyGoalMinutes;
  const firstName = user?.name?.split(' ')[0] || 'there';
  const avgBlockMinutes = todaySessions.length > 0 ? Math.round(todayMinutes / todaySessions.length) : 0;

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const minutesDisplay = Math.floor(timeLeft / 60);
  const secondsDisplay = (timeLeft % 60).toString().padStart(2, '0');

  const categories = ['Coding', 'Design', 'Writing', 'Planning', 'Research'];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn" id="dashboard-view">
      {/* Welcome & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Welcome {firstName} ⚡
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Ready for another high-impact deep work flow? Here is your daily focus engine summary.
          </p>
        </div>

        <button
          id="btn-go-focus-engine"
          onClick={() => setActiveRoute('focus')}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm self-start md:self-auto cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Launch Full Focus Mode</span>
        </button>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Focus Time */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Today's Deep Work
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {formatMinutes(todayMinutes)}
            </span>
            <div className="flex items-center space-x-1 mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                {vsYesterdayPct >= 0 ? '+' : ''}
                {vsYesterdayPct}% vs yesterday
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Current Streak */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Focus Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {currentStreak} Days
            </span>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Personal record: {longestStreak} days
            </p>
          </div>
        </div>

        {/* Card 3: Sessions Completed */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Completed Blocks
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {todaySessions.length} Blocks
            </span>
            <p className="text-xs text-[var(--text-muted)] mt-1">Avg {avgBlockMinutes}m per block</p>
          </div>
        </div>

        {/* Card 4: Daily Goal % */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Daily Target
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {Math.min(100, Math.round((todayMinutes / dailyTarget) * 100))}%
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="w-full bg-[var(--bg-card-subtle)] h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (todayMinutes / dailyTarget) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Target: {Math.floor(dailyTarget / 60)}h {(dailyTarget % 60) ? `${dailyTarget % 60}m` : ''} ({dailyTarget} mins)
            </p>
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Timer Quick Controller */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-lg text-[var(--text-primary)]">
                Active Focus Session
              </h3>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 uppercase">
              {timerMode}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-[var(--bg-card-subtle)] rounded-xl border border-[var(--border-color)]">
            <div>
              <input
                type="text"
                value={activeTaskTitle}
                onChange={(e) => setActiveTaskTitle(e.target.value)}
                placeholder="What are you working on right now?"
                className="text-lg font-bold text-[var(--text-primary)] bg-transparent border-b border-transparent hover:border-[var(--border-color)] focus:border-indigo-500 focus:outline-none w-full py-1"
              />
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-[var(--text-muted)]">Category:</span>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-transparent focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="text-slate-800">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4 self-center sm:self-auto">
              <span className="text-4xl font-mono font-bold tracking-tight text-[var(--text-primary)]">
                {minutesDisplay}:{secondsDisplay}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={isRunning ? pauseTimer : startTimer}
                  className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                  title={isRunning ? 'Pause' : 'Start'}
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] rounded-xl transition-colors cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Sessions List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                Recent Deep Work Sessions
              </h4>
              <button
                onClick={() => setActiveRoute('stats')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>View Stats</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {sessions.length === 0 ? (
                <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                  No focus sessions yet. Complete a session to see it here.
                </p>
              ) : (
                sessions.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">{s.title}</p>
                        <p className="text-[var(--text-muted)] mt-0.5">{s.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[var(--text-primary)]">
                        {s.durationMinutes} mins
                      </span>
                      <p className="text-[var(--text-muted)] mt-0.5">
                        {new Date(s.completedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Side Panel: Active Goals & Quote */}
        <div className="space-y-6">
          {/* Active Goals Box */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-[var(--text-primary)]">Active Goals</h3>
              <button
                onClick={() => setActiveRoute('goals')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {goals.length === 0 ? (
                <p className="py-6 text-center text-xs text-[var(--text-muted)]">
                  No goals yet. Create one to start tracking progress.
                </p>
              ) : (
                goals.slice(0, 3).map((g) => {
                  const pct = Math.min(100, Math.round((g.currentMinutes / g.targetMinutes) * 100));
                  return (
                    <div key={g.id} className="p-3 bg-[var(--bg-card-subtle)] rounded-xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-[var(--text-primary)]">{g.title}</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
                      </div>
                      <div className="w-full bg-[var(--border-color)] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-2xl">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              Focus Mindset
            </p>
            <p className="text-sm italic font-medium text-[var(--text-primary)] leading-relaxed">
              "Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a skill that allows you to quickly master complicated information and produce better results in less time."
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-3 font-semibold">— Cal Newport</p>
          </div>
        </div>
      </div>
    </div>
  );
};
