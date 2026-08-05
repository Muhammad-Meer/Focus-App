import React from 'react';
import { Timer, AudioLines, TrendingUp } from 'lucide-react';
import { Reveal } from './Reveal';

const STEPS = [
  {
    icon: Timer,
    step: '01',
    title: 'Set your session',
    description:
      'Pick a Pomodoro or custom timer and set your daily focus target. One click and you’re locked in.',
  },
  {
    icon: AudioLines,
    step: '02',
    title: 'Choose your soundscape',
    description:
      'Layer synthesized rain, ocean, café ambience, or binaural waves to drown out the noise around you.',
  },
  {
    icon: TrendingUp,
    step: '03',
    title: 'Grow your streak',
    description:
      'Complete sessions to earn XP, keep your streak alive, and watch your focus heatmap fill up.',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-surface/60 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              How it works
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              From distraction to flow in <span className="text-gradient">three steps</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 relative grid md:grid-cols-3 gap-10">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40"
          />

          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 150}>
              <div className="relative text-center md:px-4">
                <div className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-soft">
                  <s.icon className="w-7 h-7" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold tracking-[0.25em] text-muted">
                  STEP {s.step}
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-secondary leading-relaxed">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
