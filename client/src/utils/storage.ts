import { UserSettings, FocusSession, Goal, Achievement, Invoice, NotificationItem } from '../types';

const SETTINGS_KEY = 'zenith_settings_v1';
const SESSIONS_KEY = 'zenith_sessions_v1';
const GOALS_KEY = 'zenith_goals_v1';
const ACHIEVEMENTS_KEY = 'zenith_achievements_v1';
const NOTIFICATIONS_KEY = 'zenith_notifications_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  language: 'English (US)',
  autoStartOnBoot: true,
  soundEnabled: true,
  soundVolume: 50,
  ambientPreset: 'none',
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  dailyGoalMinutes: 240, // 4 hours
  weeklyGoalMinutes: 1200, // 20 hours
};

export const INITIAL_SESSIONS: FocusSession[] = [
  {
    id: 's-1',
    title: 'Design System Tokens & Components',
    category: 'Design',
    durationMinutes: 50,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    mode: 'pomodoro',
    rating: 5,
  },
  {
    id: 's-2',
    title: 'API Endpoint Optimization & Caching',
    category: 'Coding',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    mode: 'pomodoro',
    rating: 4,
  },
  {
    id: 's-3',
    title: 'Deep Architecture Planning',
    category: 'Planning',
    durationMinutes: 45,
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    mode: 'custom',
    rating: 5,
  },
  {
    id: 's-4',
    title: 'Refactoring React Router & State',
    category: 'Coding',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    mode: 'pomodoro',
    rating: 4,
  },
  {
    id: 's-5',
    title: 'Technical Documentation Writing',
    category: 'Writing',
    durationMinutes: 30,
    completedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    mode: 'pomodoro',
    rating: 5,
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-1',
    title: 'Daily Deep Work Target',
    category: 'Daily',
    targetMinutes: 240,
    currentMinutes: 150,
    completed: false,
  },
  {
    id: 'g-2',
    title: 'Complete UI Component Refactor',
    category: 'Coding',
    targetMinutes: 600,
    currentMinutes: 450,
    deadline: '2026-08-05',
    completed: false,
  },
  {
    id: 'g-3',
    title: 'Weekly Focus Hours Milestone',
    category: 'Weekly',
    targetMinutes: 1200,
    currentMinutes: 980,
    completed: false,
  },
  {
    id: 'g-4',
    title: 'Write Technical Architecture Spec',
    category: 'Writing',
    targetMinutes: 180,
    currentMinutes: 180,
    completed: true,
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Deep Diver',
    description: 'Complete your first 50-minute continuous focus block.',
    iconName: 'Zap',
    unlocked: true,
    unlockedAt: '2026-07-28',
    progress: 100,
    category: 'mastery',
  },
  {
    id: 'ach-2',
    title: '7-Day Flow Master',
    description: 'Maintain a daily focus streak for 7 consecutive days.',
    iconName: 'Flame',
    unlocked: true,
    unlockedAt: '2026-07-30',
    progress: 100,
    category: 'streak',
  },
  {
    id: 'ach-3',
    title: 'Century Club',
    description: 'Accumulate over 100 total hours of logged deep work.',
    iconName: 'Trophy',
    unlocked: false,
    progress: 68,
    category: 'time',
  },
  {
    id: 'ach-4',
    title: 'Night Owl',
    description: 'Complete a focus session after 10:00 PM.',
    iconName: 'Moon',
    unlocked: true,
    unlockedAt: '2026-07-29',
    progress: 100,
    category: 'streak',
  },
  {
    id: 'ach-5',
    title: 'Zenith Master',
    description: 'Unlock 10 achievements and maintain an 85%+ completion rate.',
    iconName: 'Crown',
    unlocked: false,
    progress: 40,
    category: 'mastery',
  },
  {
    id: 'ach-6',
    title: 'Productivity Marathoner',
    description: 'Log 5 focus sessions in a single 24-hour period.',
    iconName: 'Award',
    unlocked: false,
    progress: 80,
    category: 'sessions',
  },
];

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-102',
    date: 'Sep 12, 2024',
    amount: '$12.00',
    status: 'paid',
    downloadUrl: '#',
  },
  {
    id: 'inv-101',
    date: 'Aug 12, 2024',
    amount: '$12.00',
    status: 'paid',
    downloadUrl: '#',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Achievement Unlocked!',
    message: 'You earned the "7-Day Flow Master" badge. Keep up the high focus momentum!',
    time: '2 hours ago',
    read: false,
    type: 'achievement',
  },
  {
    id: 'n-2',
    title: 'Daily Goal Progress',
    message: 'You are 62% toward your 4-hour daily deep work goal today.',
    time: '4 hours ago',
    read: false,
    type: 'reminder',
  },
  {
    id: 'n-3',
    title: 'Pro Plan Active',
    message: 'Your Zenith Focus Pro subscription renews on Oct 12, 2024.',
    time: '1 day ago',
    read: true,
    type: 'system',
  },
];

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

export function getStoredSessions(): FocusSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SESSIONS;
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveStoredSessions(sessions: FocusSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Failed to save sessions:', e);
  }
}

export function getStoredGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_GOALS;
  } catch {
    return INITIAL_GOALS;
  }
}

export function saveStoredGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals:', e);
  }
}

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveStoredAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements:', e);
  }
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifications: NotificationItem[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}
