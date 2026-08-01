export type RouteType = 'dashboard' | 'focus' | 'stats' | 'achievements' | 'goals' | 'settings';

export type ThemeMode = 'light' | 'dark';

export type FocusMode = 'pomodoro' | 'shortBreak' | 'longBreak' | 'custom';

export interface FocusSession {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  completedAt: string; // ISO date string
  mode: FocusMode;
  rating?: number; // 1-5 scale
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  targetMinutes: number;
  currentMinutes: number;
  deadline?: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
  category: 'streak' | 'time' | 'sessions' | 'mastery';
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending';
  downloadUrl: string;
}

export interface UserSettings {
  theme: ThemeMode;
  language: string;
  autoStartOnBoot: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 100
  ambientPreset: 'none' | 'rain' | 'binaural' | 'cafe' | 'space';
  pomodoroDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  dailyGoalMinutes: number;
  weeklyGoalMinutes: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'achievement' | 'reminder' | 'system';
}
