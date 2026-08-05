import React from 'react';
import {
  ArrowRight,
  CloudRain,
  Coffee,
  Headphones,
  Waves,
  Play,
  RotateCcw,
  SkipForward,
  Flame,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Reveal } from './Reveal';

const STATS = [
  { value: '2.4M+', label: 'focus minutes tracked' },
  { value: '86K', label: 'deep work sessions' },
  { value: '320K', label: 'streaks kept alive' },
  { value: '4.9★', label: 'average user rating' },
];

const SOUNDS = [
  { icon: CloudRain, label: 'Rain', active: true },
  { icon: Coffee, label: 'Café' },
  { icon: Waves, label: 'Ocean' },
  { icon: Headphones, label: 'Binaural' },
];

const RING_RADIUS = 84;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-3xl animate-glow-pulse"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-24 -right-40 w-[520px] h-[520px] rounded-full bg-accent/20 blur-3xl animate-glow-pulse"
        style={{ animationDelay: '2.5s' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        <Reveal>
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 ring-1 ring-primary/20 text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            <span>New — synthesized ambient sound engine</span>
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            Enter deep focus.
            <br />
            <span className="text-gradient">Leave distraction behind.</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-secondary leading-relaxed">
            Zaf Focus is your deep work engine — Pomodoro timers, real-time synthesized ambient
            sound, streaks, goals, and focus analytics in one beautifully calm workspace.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => (window.location.hash = '#/app')}
              className="group inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-soft transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Start focusing — it&apos;s free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() =>
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-surface border border-border text-foreground font-semibold hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <span>See how it works</span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <p className="mt-5 text-xs text-muted font-medium">
            No credit card required · Works offline · Free forever tier
          </p>
        </Reveal>

        {/* Timer mockup */}
        <Reveal delay={200} className="mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-md">
            <div
              aria-hidden
              className="absolute -inset-8 bg-gradient-to-br from-primary/25 via-transparent to-accent/25 blur-3xl rounded-full"
            />
            <div className="relative bg-surface border border-border rounded-3xl p-7 sm:p-8 shadow-soft">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-primary-soft text-primary-strong text-[10px] font-bold tracking-widest uppercase">
                  Pomodoro
                </span>
                <span className="text-xs font-semibold text-muted">Deep work session</span>
              </div>

              {/* Timer ring */}
              <div className="relative mx-auto mt-6 w-56 h-56">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  <defs>
                    <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" />
                      <stop offset="100%" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="100"
                    cy="100"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="var(--bg-card-subtle)"
                    strokeWidth="12"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="url(#timerGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    strokeDashoffset={RING_CIRCUMFERENCE * 0.28}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-5xl font-extrabold tracking-tight text-foreground">
                    25:00
                  </span>
                  <span className="mt-1 text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
                    Deep work
                  </span>
                </div>
              </div>

              {/* Sound chips */}
              <div className="mt-6 grid grid-cols-4 gap-2">
                {SOUNDS.map((s) => (
                  <div
                    key={s.label}
                    className={`flex flex-col items-center space-y-1.5 py-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                      s.active
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                        : 'text-muted hover:bg-surface-subtle hover:text-foreground'
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <button className="p-3 rounded-xl bg-surface-subtle text-muted hover:text-foreground hover:bg-border transition-colors cursor-pointer">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center space-x-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-soft hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start</span>
                </button>
                <button className="p-3 rounded-xl bg-surface-subtle text-muted hover:text-foreground hover:bg-border transition-colors cursor-pointer">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Floating chips */}
            <div className="absolute -top-6 -right-4 sm:-right-10 bg-surface border border-border rounded-2xl shadow-soft px-4 py-3 flex items-center space-x-3 animate-float">
              <span className="p-2 rounded-xl bg-warning-soft text-warning">
                <Flame className="w-4 h-4" />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">12-day streak</p>
                <p className="text-[10px] text-muted font-medium">Keep it alive today</p>
              </div>
            </div>
            <div
              className="absolute -bottom-6 -left-4 sm:-left-10 bg-surface border border-border rounded-2xl shadow-soft px-4 py-3 flex items-center space-x-3 animate-float"
              style={{ animationDelay: '3s' }}
            >
              <span className="p-2 rounded-xl bg-success-soft text-success">
                <TrendingUp className="w-4 h-4" />
              </span>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">+2h 15m today</p>
                <p className="text-[10px] text-muted font-medium">130% of daily goal</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Stats bar */}
        <div className="mt-20 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-border py-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="text-center">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-gradient">
                  {s.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted font-medium">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
