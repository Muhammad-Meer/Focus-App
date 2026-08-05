import React, { useState } from 'react';
import { Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, toggleGoal, updateGoalProgress } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Coding');
  const [newTargetHours, setNewTargetHours] = useState('5');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addGoal({
      title: newTitle.trim(),
      category: newCategory,
      targetMinutes: parseFloat(newTargetHours) * 60,
    });

    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn" id="goals-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Focus Goals
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Set target focus hours for daily routines, weekly sprints, and active projects.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2  hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Inline Goal Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-[var(--bg-card)] border border-indigo-200 p-6 rounded-2xl shadow-sm space-y-4 animate-fadeIn"
        >
          <h3 className="font-bold text-base text-[var(--text-primary)]">Add New Focus Goal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Goal Title
              </label>
              <input
                type="text"
                placeholder="e.g. Finish Core Refactoring"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none cursor-pointer"
              >
                <option value="Coding">Coding</option>
                <option value="Design">Design</option>
                <option value="Writing">Writing</option>
                <option value="Planning">Planning</option>
                <option value="Daily">Daily Routine</option>
                <option value="Weekly">Weekly Sprint</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Target Hours
              </label>
              <input
                type="number"
                min="0.5"
                max="100"
                step="0.5"
                value={newTargetHours}
                onChange={(e) => setNewTargetHours(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-card-subtle)] border border-[var(--border-color)] rounded-xl text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 text-white shadow-xs"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No goals yet. Create your first goal to start tracking focus time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
          const targetHrs = (goal.targetMinutes / 60).toFixed(1);
          const currentHrs = (goal.currentMinutes / 60).toFixed(1);
          const pct = Math.min(100, Math.round((goal.currentMinutes / goal.targetMinutes) * 100));

          return (
            <div
              key={goal.id}
              className={`bg-[var(--bg-card)] border rounded-2xl p-6 shadow-xs space-y-4 transition-all ${
                goal.completed
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-[var(--border-color)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {goal.category}
                  </span>
                  <h3 className="font-bold text-lg text-[var(--text-primary)] mt-2">
                    {goal.title}
                  </h3>
                </div>

                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    goal.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border border-[var(--border-color)] text-[var(--text-muted)] hover:text-emerald-600'
                  }`}
                  title={goal.completed ? 'Completed!' : 'Mark as Completed'}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Slider / Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--text-secondary)]">
                    {currentHrs} / {targetHrs} hours
                  </span>
                  <span className="text-indigo-600 font-bold">{pct}%</span>
                </div>
                <div className="w-full bg-[var(--bg-card-subtle)] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      goal.completed ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Quick Log Progress Adjustment */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)] text-xs">
                <span className="text-[var(--text-muted)]">Log manual hours:</span>
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => updateGoalProgress(goal.id, 30)}
                    className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-primary)] font-medium"
                  >
                    +30m
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 60)}
                    className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-primary)] font-medium"
                  >
                    +1h
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
