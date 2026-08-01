import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  RouteType,
  ThemeMode,
  FocusMode,
  FocusSession,
  Goal,
  Achievement,
  UserSettings,
  NotificationItem,
} from '../types';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredSessions,
  saveStoredSessions,
  getStoredGoals,
  saveStoredGoals,
  getStoredAchievements,
  saveStoredAchievements,
  getStoredNotifications,
  saveStoredNotifications,
} from '../utils/storage';
import { soundSynth } from '../utils/audio';
import {
  getMe,
  getUserStats,
  getSessionHistory,
  createSession,
  startSession,
  pauseSession,
  resumeSession,
  endSession,
  cancelSession,
} from '../api';

export interface AuthUser {
  _id?: string;
  name: string;
  email: string;
  token: string;
}

export interface ServerStats {
  name?: string;
  totalFocusMinutes?: number;
  points?: number;
  currentStreak?: number;
  longestStreak?: number;
  level?: number;
  badges?: { id: string; name: string; description: string; earnedAt?: string }[];
}

interface AppContextType {
  // Auth
  user: AuthUser | null;
  logout: () => void;

  // Backend synced stats (points / streak / level / badges)
  serverStats: ServerStats | null;

  // Navigation
  activeRoute: RouteType;
  setActiveRoute: (route: RouteType) => void;

  // Theme
  theme: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;

  // User Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;

  // Focus Timer State
  timerMode: FocusMode;
  setTimerMode: (mode: FocusMode) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  activeTaskTitle: string;
  setActiveTaskTitle: (title: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipTimer: () => void;

  // Ambient Audio
  ambientPreset: 'none' | 'rain' | 'binaural' | 'cafe' | 'space';
  setAmbientPreset: (preset: 'none' | 'rain' | 'binaural' | 'cafe' | 'space') => void;
  isPlayingAudio: boolean;
  toggleAudio: () => void;

  // Data Collections
  sessions: FocusSession[];
  addSession: (session: Omit<FocusSession, 'id' | 'completedAt'>) => void;
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentMinutes' | 'completed'>) => void;
  toggleGoal: (id: string) => void;
  updateGoalProgress: (id: string, minutes: number) => void;
  achievements: Achievement[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Modals & Popovers
  supportModalOpen: boolean;
  setSupportModalOpen: (open: boolean) => void;
  billingModalOpen: boolean;
  setBillingModalOpen: (open: boolean) => void;
  signOutModalOpen: boolean;
  setSignOutModalOpen: (open: boolean) => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  // Utility Actions
  exportDataJSON: () => void;
  exportDataCSV: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Maps backend badge ids to the achievement icon names used by the UI
const BADGE_ICON_MAP: Record<string, string> = {
  first_session: 'Zap',
  streak_7: 'Flame',
  streak_30: 'Crown',
  hours_100: 'Trophy',
};

const getDurationMinutes = (mode: FocusMode, settings: UserSettings): number => {
  if (mode === 'pomodoro') return settings.pomodoroDuration;
  if (mode === 'shortBreak') return settings.shortBreakDuration;
  if (mode === 'longBreak') return settings.longBreakDuration;
  return 45;
};

interface BackendSession {
  _id: string;
  title: string;
  category?: string;
  mode?: string;
  plannedDuration?: number;
  actualDuration?: number;
  endTime?: string;
  createdAt?: string;
}

const mapBackendSession = (s: BackendSession): FocusSession => ({
  id: s._id || `s-${Date.now()}`,
  title: s.title || 'Deep Focus Session',
  category: s.category || 'Coding',
  durationMinutes: s.actualDuration || s.plannedDuration || 0,
  completedAt: s.endTime || s.createdAt || new Date().toISOString(),
  mode: (s.mode as FocusMode) || 'pomodoro',
  rating: 5,
});

export const AppProvider: React.FC<{
  children: React.ReactNode;
  user: AuthUser | null;
  onLogout: () => void;
}> = ({ children, user, onLogout }) => {
  const [activeRoute, setActiveRoute] = useState<RouteType>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings);
  const [theme, setTheme] = useState<ThemeMode>(settings.theme);

  const [sessions, setSessions] = useState<FocusSession[]>(getStoredSessions);
  const [goals, setGoals] = useState<Goal[]>(getStoredGoals);
  const [achievements, setAchievements] = useState<Achievement[]>(getStoredAchievements);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);

  const [serverStats, setServerStats] = useState<ServerStats | null>(null);

  // Timer state
  const [timerMode, setTimerModeState] = useState<FocusMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState<number>(settings.pomodoroDuration * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTaskTitle, setActiveTaskTitle] = useState<string>('Deep System Architecture & UI Polish');
  const [activeCategory, setActiveCategory] = useState<string>('Coding');

  const activeBackendSession = useRef<string | null>(null);

  // Ambient Audio
  const [ambientPreset, setAmbientPresetState] = useState<'none' | 'rain' | 'binaural' | 'cafe' | 'space'>(
    settings.ambientPreset
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Modals
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [billingModalOpen, setBillingModalOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Apply Theme class to document root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync achievements unlocked state with backend badges
  const syncAchievements = useCallback((badges: { id: string }[]) => {
    if (!badges || badges.length === 0) return;
    const ids = badges.map((b) => b.id);
    setAchievements((prev) => {
      const updated = prev.map((ach) => {
        const shouldUnlock = ids.some((id) => BADGE_ICON_MAP[id] === ach.iconName);
        if (shouldUnlock && !ach.unlocked) {
          return {
            ...ach,
            unlocked: true,
            unlockedAt: ach.unlockedAt || new Date().toISOString().slice(0, 10),
            progress: 100,
          };
        }
        return ach;
      });
      saveStoredAchievements(updated);
      return updated;
    });
  }, []);

  // Load backend data (user profile, stats, session history) on mount
  useEffect(() => {
    if (!user?.token) return;
    let cancelled = false;

    (async () => {
      try {
        await getMe();
      } catch {
        // backend unreachable — the app still works offline
      }

      try {
        const { data } = await getUserStats();
        if (!cancelled && data) {
          setServerStats(data);
          if (data.badges) syncAchievements(data.badges);
        }
      } catch {
        // ignore
      }

      try {
        const { data } = await getSessionHistory();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(mapBackendSession);
          setSessions(mapped);
          saveStoredSessions(mapped);
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, syncAchievements]);

  // Persist settings changes
  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      if (newSettings.theme && newSettings.theme !== theme) {
        setTheme(newSettings.theme);
      }
      return updated;
    });
  }, [theme]);

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
    updateSettings({ theme: mode });
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeMode(nextTheme);
  };

  // Timer duration setup on mode change
  const setTimerMode = (mode: FocusMode) => {
    setTimerModeState(mode);
    setIsRunning(false);
    setTimeLeft(getDurationMinutes(mode, settings) * 60);
  };

  // Complete Focus Session handler
  const completeSession = useCallback(() => {
    const durationMins = getDurationMinutes(timerMode, settings);

    soundSynth.playChime();

    // Add session if it's a work pomodoro or custom session
    if (timerMode === 'pomodoro' || timerMode === 'custom') {
      const newSession: FocusSession = {
        id: `s-${Date.now()}`,
        title: activeTaskTitle || 'Deep Focus Session',
        category: activeCategory,
        durationMinutes: durationMins,
        completedAt: new Date().toISOString(),
        mode: timerMode,
        rating: 5,
      };

      setSessions((prev) => {
        const next = [newSession, ...prev];
        saveStoredSessions(next);
        return next;
      });

      // Update goal progress
      setGoals((prev) => {
        const updated = prev.map((g) => {
          if (g.category === 'Daily' || g.category === activeCategory) {
            const nextCur = g.currentMinutes + durationMins;
            return {
              ...g,
              currentMinutes: nextCur,
              completed: nextCur >= g.targetMinutes,
            };
          }
          return g;
        });
        saveStoredGoals(updated);
        return updated;
      });

      // Add notification
      const newNotif: NotificationItem = {
        id: `n-${Date.now()}`,
        title: 'Session Complete! 🎉',
        message: `Logged ${durationMins} min of ${activeCategory} focus: "${activeTaskTitle}".`,
        time: 'Just now',
        read: false,
        type: 'achievement',
      };
      setNotifications((prev) => {
        const next = [newNotif, ...prev];
        saveStoredNotifications(next);
        return next;
      });

      // Record the session on the backend (points / streak / level / badges)
      if (user?.token && activeBackendSession.current) {
        const sessionId = activeBackendSession.current;
        activeBackendSession.current = null;
        endSession(sessionId, { actualDuration: durationMins })
          .then(({ data }) => {
            if (data?.rewards) {
              setServerStats((prev) => ({
                ...prev,
                points: data.rewards.totalPoints,
                currentStreak: data.rewards.currentStreak,
                level: data.rewards.level,
              }));

              const rewardsNotif: NotificationItem = {
                id: `n-${Date.now()}-rewards`,
                title: 'Rewards Earned! ⚡',
                message: `+${data.rewards.pointsEarned} points • ${data.rewards.currentStreak}-day streak • Level ${data.rewards.level}`,
                time: 'Just now',
                read: false,
                type: 'achievement',
              };
              setNotifications((prev) => {
                const next = [rewardsNotif, ...prev];
                saveStoredNotifications(next);
                return next;
              });

              if (Array.isArray(data.rewards.newBadges) && data.rewards.newBadges.length > 0) {
                syncAchievements(data.rewards.newBadges);
                const badgeNotif: NotificationItem = {
                  id: `n-${Date.now()}-badge`,
                  title: 'New Badge Unlocked! 🏆',
                  message: data.rewards.newBadges.map((b: { name: string }) => b.name).join(', '),
                  time: 'Just now',
                  read: false,
                  type: 'achievement',
                };
                setNotifications((prev) => {
                  const next = [badgeNotif, ...prev];
                  saveStoredNotifications(next);
                  return next;
                });
              }
            }
          })
          .catch(() => {
            // backend offline — session stays in local history only
          });
      }
    }

    // Auto switch to break if configured
    if (timerMode === 'pomodoro' && settings.autoStartBreaks) {
      setTimerModeState('shortBreak');
      setTimeLeft(getDurationMinutes('shortBreak', settings) * 60);
      setIsRunning(true);
    } else {
      setIsRunning(false);
      setTimerModeState(timerMode);
    }
  }, [timerMode, settings, activeTaskTitle, activeCategory, user, syncAchievements]);

  // Main countdown tick effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, completeSession]);

  const startTimer = () => {
    setIsRunning(true);
    if (!user?.token) return;

    if (activeBackendSession.current) {
      // resume an existing backend session
      resumeSession(activeBackendSession.current).catch(() => {});
    } else {
      // create + start a new backend session so real duration can be tracked
      createSession({
        title: activeTaskTitle,
        category: activeCategory,
        mode: timerMode,
        plannedDuration: getDurationMinutes(timerMode, settings),
      })
        .then(({ data }) => {
          activeBackendSession.current = data._id;
          return startSession(data._id);
        })
        .catch(() => {});
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (activeBackendSession.current) {
      pauseSession(activeBackendSession.current).catch(() => {});
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (activeBackendSession.current) {
      cancelSession(activeBackendSession.current).catch(() => {});
      activeBackendSession.current = null;
    }
    setTimerModeState(timerMode);
    setTimeLeft(getDurationMinutes(timerMode, settings) * 60);
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (activeBackendSession.current) {
      cancelSession(activeBackendSession.current).catch(() => {});
      activeBackendSession.current = null;
    }
    if (timerMode === 'pomodoro') {
      setTimerModeState('shortBreak');
      setTimeLeft(getDurationMinutes('shortBreak', settings) * 60);
    } else if (timerMode === 'shortBreak') {
      setTimerModeState('pomodoro');
      setTimeLeft(getDurationMinutes('pomodoro', settings) * 60);
    } else {
      setTimerModeState('pomodoro');
      setTimeLeft(getDurationMinutes('pomodoro', settings) * 60);
    }
  };

  // Ambient Audio trigger
  const setAmbientPreset = (preset: 'none' | 'rain' | 'binaural' | 'cafe' | 'space') => {
    setAmbientPresetState(preset);
    updateSettings({ ambientPreset: preset });
    if (preset === 'none') {
      soundSynth.stop();
      setIsPlayingAudio(false);
    } else {
      soundSynth.playPreset(preset, settings.soundVolume / 100);
      setIsPlayingAudio(true);
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      soundSynth.stop();
      setIsPlayingAudio(false);
    } else {
      const p = ambientPreset === 'none' ? 'rain' : ambientPreset;
      setAmbientPreset(p);
    }
  };

  // Sessions CRUD
  const addSession = (sessionData: Omit<FocusSession, 'id' | 'completedAt'>) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: `s-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    setSessions((prev) => {
      const next = [newSession, ...prev];
      saveStoredSessions(next);
      return next;
    });
  };

  // Goals CRUD
  const addGoal = (goalData: Omit<Goal, 'id' | 'currentMinutes' | 'completed'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}`,
      currentMinutes: 0,
      completed: false,
    };
    setGoals((prev) => {
      const next = [...prev, newGoal];
      saveStoredGoals(next);
      return next;
    });
  };

  const toggleGoal = (id: string) => {
    setGoals((prev) => {
      const updated = prev.map((g) =>
        g.id === id ? { ...g, completed: !g.completed } : g
      );
      saveStoredGoals(updated);
      return updated;
    });
  };

  const updateGoalProgress = (id: string, mins: number) => {
    setGoals((prev) => {
      const updated = prev.map((g) => {
        if (g.id === id) {
          const nextCur = Math.max(0, g.currentMinutes + mins);
          return { ...g, currentMinutes: nextCur, completed: nextCur >= g.targetMinutes };
        }
        return g;
      });
      saveStoredGoals(updated);
      return updated;
    });
  };

  // Notifications CRUD
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveStoredNotifications(updated);
      return updated;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveStoredNotifications([]);
  };

  // Data Exporters
  const exportDataJSON = () => {
    const data = {
      userSettings: settings,
      focusSessions: sessions,
      userGoals: goals,
      userAchievements: achievements,
      exportedAt: new Date().toISOString(),
      appName: 'Zaf Focus Deep Work Engine',
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zaf-focus-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDataCSV = () => {
    let csvContent = 'ID,Title,Category,DurationMinutes,CompletedAt,Mode,Rating\n';
    sessions.forEach((s) => {
      const title = `"${s.title.replace(/"/g, '""')}"`;
      csvContent += `${s.id},${title},${s.category},${s.durationMinutes},${s.completedAt},${s.mode},${s.rating || 5}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zaf-focus-sessions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAllData = () => {
    localStorage.removeItem('zenith_settings_v1');
    localStorage.removeItem('zenith_sessions_v1');
    localStorage.removeItem('zenith_goals_v1');
    localStorage.removeItem('zenith_achievements_v1');
    localStorage.removeItem('zenith_notifications_v1');
    setSessions([]);
    setGoals([]);
    setNotifications([]);
    setSettings(getStoredSettings());
    setTheme('light');
    soundSynth.stop();
    onLogout();
  };

  const logout = () => {
    if (activeBackendSession.current) {
      cancelSession(activeBackendSession.current).catch(() => {});
      activeBackendSession.current = null;
    }
    soundSynth.stop();
    onLogout();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        logout,
        serverStats,
        activeRoute,
        setActiveRoute,
        theme,
        toggleTheme,
        setThemeMode,
        settings,
        updateSettings,
        timerMode,
        setTimerMode,
        timeLeft,
        setTimeLeft,
        isRunning,
        activeTaskTitle,
        setActiveTaskTitle,
        activeCategory,
        setActiveCategory,
        startTimer,
        pauseTimer,
        resetTimer,
        skipTimer,
        ambientPreset,
        setAmbientPreset,
        isPlayingAudio,
        toggleAudio,
        sessions,
        addSession,
        goals,
        addGoal,
        toggleGoal,
        updateGoalProgress,
        achievements,
        notifications,
        markNotificationRead,
        clearNotifications,
        supportModalOpen,
        setSupportModalOpen,
        billingModalOpen,
        setBillingModalOpen,
        signOutModalOpen,
        setSignOutModalOpen,
        deleteModalOpen,
        setDeleteModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        notificationsOpen,
        setNotificationsOpen,
        exportDataJSON,
        exportDataCSV,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
