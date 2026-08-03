import React from 'react';
import {
  Award,
  Zap,
  Flame,
  Trophy,
  Moon,
  Crown,
  CheckCircle2,
  Lock,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AchievementsView: React.FC = () => {
  const { achievements, serverStats } = useApp();
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const level = serverStats?.level ?? 1;
  const points = serverStats?.points ?? 0;
  const nextLevelXp = level * 500;
  const levelProgress = Math.min(100, Math.round(((points % 500) / 500) * 100));
  const xpToNext = Math.max(0, nextLevelXp - points);

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-6 h-6" />;
      case 'Flame':
        return <Flame className="w-6 h-6" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6" />;
      case 'Moon':
        return <Moon className="w-6 h-6" />;
      case 'Crown':
        return <Crown className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const filtered = achievements.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 animate-fadeIn" id="achievements-view">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
          Achievements & Badges
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Earn recognition and level up as you conquer continuous focus milestones.
        </p>
      </div>

      {/* User Level Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl ring-1 ring-white/20">
            <Star className="w-10 h-10 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
              CURRENT PRODUCTIVITY LEVEL
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight">Level {level}: Deep Work Specialist</h3>
            <p className="text-xs text-indigo-100 mt-0.5">
              {points.toLocaleString()} XP accumulated • {unlockedCount} of {achievements.length} Badges Unlocked
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-xs font-bold text-indigo-100">
            <span>Level {level}</span>
            <span>Level {level + 1} ({nextLevelXp.toLocaleString()} XP)</span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${levelProgress}%` }} />
          </div>
          <p className="text-[11px] text-indigo-200 text-right font-medium">
            {xpToNext} XP to next level
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-[var(--border-color)] pb-3">
        {['all', 'mastery', 'streak', 'time', 'sessions'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-subtle)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No achievements yet. Complete focus sessions to start earning badges.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className={`bg-[var(--bg-card)] border rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all ${
                ach.unlocked
                  ? 'border-indigo-200 dark:border-indigo-900/60 ring-1 ring-indigo-500/20'
                  : 'border-[var(--border-color)] opacity-75'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-2xl ${
                      ach.unlocked
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)]'
                    }`}
                  >
                    {renderIcon(ach.iconName)}
                  </div>

                  {ach.unlocked ? (
                    <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-card-subtle)] px-2.5 py-1 rounded-md">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-base text-[var(--text-primary)]">{ach.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
                {ach.unlocked ? (
                  <p className="text-[11px] font-medium text-[var(--text-muted)]">
                    Unlocked on {ach.unlockedAt || 'Recently'}
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)]">
                      <span>Progress</span>
                      <span>{ach.progress}%</span>
                    </div>
                    <div className="w-full bg-[var(--bg-card-subtle)] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{ width: `${ach.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
