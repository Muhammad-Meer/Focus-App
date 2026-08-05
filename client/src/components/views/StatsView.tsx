import React, { useState } from 'react';
import {
  Download,
  Search,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StatsView: React.FC = () => {
  const { sessions, exportDataCSV } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Group weekly data for bar charts
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Real weekly totals (hours per weekday) from completed sessions
  const dayTotals = new Array(7).fill(0);
  sessions.forEach((s) => {
    const d = new Date(s.completedAt);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays >= 0 && diffDays < 7) {
      const dayIndex = (d.getDay() + 6) % 7;
      dayTotals[dayIndex] += s.durationMinutes / 60;
    }
  });

  const hasRealData = dayTotals.some((v) => v > 0);
  const weeklyHours = dayTotals;
  const weeklyTotal = weeklyHours.reduce((a, b) => a + b, 0).toFixed(1);
  const maxWeeklyHour = Math.max(...weeklyHours) || 1;

  // Category breakdown calculation
  const categoryTotals: Record<string, number> = {};
  sessions.forEach((s) => {
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + s.durationMinutes;
  });

  const totalMinutesAll = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  // Search and filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesCat = filterCategory === 'All' || s.category === filterCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn" id="stats-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Focus Analytics & Stats
          </h2>
          <p className="text-secondary mt-1 text-sm">
            Detailed performance breakdown, focus volume, and session history logs.
          </p>
        </div>

        <button
          onClick={exportDataCSV}
          className="flex items-center space-x-2 border border-border bg-surface hover:bg-surface-subtle text-foreground text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-muted" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Focus Hours Bar Graph */}
        <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-base text-foreground">
                Weekly Focus Volume
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Total hours logged per day this week
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-lg">
              {weeklyTotal} Hours Total
            </span>
          </div>   

          {/* Bar Chart Canvas Simulation */}
          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {!hasRealData ? (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                No focus data yet this week. Complete a session to start tracking.
              </div>
            ) : (
              daysOfWeek.map((day, idx) => {
                const val = weeklyHours[idx];
                const heightPct = (val / maxWeeklyHour) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-bold text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}h
                    </span>
                    <div className="w-full bg-surface-subtle h-36 rounded-xl flex items-end overflow-hidden p-1">
                      <div
                        className="w-full bg-primary rounded-lg transition-all duration-500 group-hover:bg-primary-hover"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-secondary">
                      {day}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Breakdown Donut / Progress */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-base text-foreground">
              Focus Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {Object.keys(categoryTotals).length === 0 ? (
              <p className="py-6 text-center text-xs text-muted">
                No focus data yet.
              </p>
            ) : (
              Object.entries(categoryTotals).map(([cat, mins]) => {
                const pct = Math.round((mins / totalMinutesAll) * 100);
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-foreground">{cat}</span>
                      <span className="text-muted">
                        {mins} mins ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-surface-subtle h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Filterable Session Logs Table */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-lg text-foreground">Session Logs</h3>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-surface-subtle border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-44"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-surface-subtle border border-border text-xs font-medium text-foreground rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Coding">Coding</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Planning">Planning</option>
              <option value="Research">Research</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Session Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Completed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    No focus sessions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-surface-subtle transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {s.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-md font-semibold text-[11px]">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {s.durationMinutes} mins
                    </td>
                    <td className="py-3.5 px-4 capitalize text-secondary">
                      {s.mode}
                    </td>
                    <td className="py-3.5 px-4 text-muted">
                      {new Date(s.completedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
