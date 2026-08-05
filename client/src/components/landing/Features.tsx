import React from 'react';
import { Timer, AudioLines, Flame, Target, BarChart3, Trophy } from 'lucide-react';
import { Reveal } from './Reveal';

const FEATURES = [
  {
    icon: Timer,
    title: 'Pomodoro & deep work timers',
    description:
      'Classic 25/5 Pomodoro cycles with fully customizable durations and automatic break scheduling tuned to your rhythm.',
  },
  {
    icon: AudioLines,
    title: 'Synthesized ambient sound',
    description:
      'Rain, café, ocean, and binaural soundscapes generated live in your browser. No streams, no buffering, no tabs to fight over.',
  },
  {
    icon: Flame,
    title: 'Streaks that stick',
    description:
      'Daily focus streaks and XP keep you accountable. Miss a day and rebuild your momentum — every session counts.',
  },
  {
    icon: Target,
    title: 'Goal-driven focus',
    description:
      'Set daily and weekly focus targets, track progress toward every goal, and celebrate the moment you land it.',
  },
  {
    icon: BarChart3,
    title: 'Focus analytics & heatmaps',
    description:
      'Beautiful session history and weekly heatmaps reveal when you do your best work — with one-click CSV export.',
  },
  {
    icon: Trophy,
    title: 'Achievements & rewards',
    description:
      'Unlock achievements across streaks, time, sessions, and mastery as you level up your deep work practice.',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              Everything you need
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              One calm workspace for <span className="text-gradient">deep work</span>
            </h2>
            <p className="mt-4 text-secondary text-base sm:text-lg">
              Stop juggling timers, noise apps, and spreadsheet goals. Zaf Focus brings the whole
              system together.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 100}>
              <div className="group h-full p-6 rounded-2xl bg-surface border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-soft hover:border-primary/30">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm w-fit transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-secondary leading-relaxed">{f.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
