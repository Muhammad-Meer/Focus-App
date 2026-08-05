import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Reveal } from './Reveal';

const TESTIMONIALS = [
  {
    quote:
      'Zaf Focus turned my chaotic mornings into a machine. Three hours of deep work before noon, every single day.',
    name: 'Maya Chen',
    role: 'Product Designer',
    initials: 'MC',
  },
  {
    quote:
      'The synthesized rain is unreal — I stopped reaching for noise-streaming sites entirely. Everything just works offline.',
    name: 'Daniel Okafor',
    role: 'Software Engineer',
    initials: 'DO',
  },
  {
    quote:
      'The heatmaps showed me exactly when I actually focus. I redesigned my whole schedule around them.',
    name: 'Sofia Reyes',
    role: 'PhD Researcher',
    initials: 'SR',
  },
];

const GRADIENTS = [
  'from-primary to-accent',
  'from-primary-hover to-primary-strong',
  'from-accent to-primary',
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              Loved by deep workers
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              People focus better <span className="text-gradient">with Zaf</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="relative h-full p-6 rounded-2xl bg-surface border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <Quote
                  className="absolute top-5 right-5 w-6 h-6 text-primary/15"
                  aria-hidden
                />
                <div className="flex items-center space-x-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm text-foreground leading-relaxed">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center space-x-3">
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-white text-xs font-bold`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted font-medium">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
