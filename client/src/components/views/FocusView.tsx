import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  CloudRain,
  Radio,
  Coffee,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundSynth } from '../../utils/audio';

export const FocusView: React.FC = () => {
  const {
    timerMode,
    setTimerMode,
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    activeTaskTitle,
    setActiveTaskTitle,
    activeCategory,
    setActiveCategory,
    ambientPreset,
    setAmbientPreset,
    settings,
    updateSettings,
  } = useApp();

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Total seconds for progress calculation
  const totalSeconds =
    timerMode === 'pomodoro'
      ? settings.pomodoroDuration * 60
      : timerMode === 'shortBreak'
      ? settings.shortBreakDuration * 60
      : timerMode === 'longBreak'
      ? settings.longBreakDuration * 60
      : 45 * 60;

  const progressPct = Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  const minutesDisplay = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secondsDisplay = (timeLeft % 60).toString().padStart(2, '0');

  // SVG Circle parameters
  const radius = 120;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value, 10);
    updateSettings({ soundVolume: vol });
    soundSynth.setVolume(vol / 100);
  };

  const ambientButtons = [
    { id: 'none', label: 'Mute', icon: <VolumeX className="w-4 h-4" /> },
    { id: 'rain', label: 'Rain', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'binaural', label: '40Hz Beat', icon: <Radio className="w-4 h-4" /> },
    { id: 'cafe', label: 'Cafe', icon: <Coffee className="w-4 h-4" /> },
    { id: 'space', label: 'Deep Space', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[var(--bg-page)] p-8 max-w-none overflow-y-auto' : ''
      }`}
      id="focus-view"
    >
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Focus Engine
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Immerse yourself in distraction-free deep work.
          </p>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Distraction-Free Fullscreen'}
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="bg-[var(--bg-card-subtle)] p-1.5 rounded-2xl border border-[var(--border-color)] inline-flex space-x-1">
          {[
            { id: 'pomodoro', label: `Pomodoro (${settings.pomodoroDuration}m)` },
            { id: 'shortBreak', label: `Short Break (${settings.shortBreakDuration}m)` },
            { id: 'longBreak', label: `Long Break (${settings.longBreakDuration}m)` },
            { id: 'custom', label: 'Custom (45m)' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setTimerMode(mode.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                timerMode === mode.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Circular Timer Display */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        {/* Task Title Edit Input */}
        <div className="w-full max-w-md text-center mb-6">
          <input
            type="text"
            value={activeTaskTitle}
            onChange={(e) => setActiveTaskTitle(e.target.value)}
            className="text-center font-bold text-xl text-[var(--text-primary)] bg-transparent border-b border-transparent hover:border-[var(--border-color)] focus:border-indigo-500 focus:outline-none w-full py-1"
            placeholder="Focus Session Objective..."
          />
          <div className="mt-2 flex items-center justify-center space-x-2">
            <span className="text-xs text-[var(--text-muted)]">Category:</span>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="text-xs font-semibold text-indigo-600 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Coding">Coding</option>
              <option value="Design">Design</option>
              <option value="Writing">Writing</option>
              <option value="Planning">Planning</option>
              <option value="Research">Research</option>
            </select>
          </div>
        </div>

        {/* SVG Circular Clock */}
        <div className="relative flex items-center justify-center my-4">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Circle Track */}
            <circle
              stroke="var(--bg-card-subtle)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Animated Active Stroke */}
            <circle
              stroke="#4648d4"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl md:text-6xl font-mono font-extrabold tracking-tight text-[var(--text-primary)]">
              {minutesDisplay}:{secondsDisplay}
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-2">
              {isRunning ? 'Flow State Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-4 mt-8">
          <button
            onClick={resetTimer}
            className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-main-timer-toggle"
            onClick={isRunning ? pauseTimer : startTimer}
            className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={skipTimer}
            className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card-subtle)] hover:bg-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Skip Session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Web Audio Sound Synthesizer Panel */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-base text-[var(--text-primary)]">
              Ambient White Noise Generator
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-[var(--text-muted)] font-medium">Volume</span>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.soundVolume}
              onChange={handleVolumeChange}
              className="w-28 accent-indigo-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-[var(--text-primary)] w-8">
              {settings.soundVolume}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ambientButtons.map((btn) => {
            const isActive = ambientPreset === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setAmbientPreset(btn.id as any)}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
