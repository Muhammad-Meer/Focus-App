import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

const FAQS = [
  {
    q: 'What exactly is a “deep work session”?',
    a: 'A deep work session is a timed block where you work on one task with zero distractions. Zaf Focus runs the timer, optionally layers in synthesized ambient sound, and logs the session to your history, streaks, and analytics.',
  },
  {
    q: 'Does Zaf Focus work offline?',
    a: 'Yes. Sessions, sound synthesis, and history all work fully offline on your device. Data syncs to your account whenever the backend is reachable — and stays yours even when it isn’t.',
  },
  {
    q: 'What ambient sound options are included?',
    a: 'Four soundscapes ship today: rain, café, ocean, and binaural — all synthesized in real time in your browser, so there are no streams to buffer and no ads to interrupt your flow.',
  },
  {
    q: 'Is Zaf Focus really free?',
    a: 'The free tier includes unlimited focus sessions, the full ambient sound generator, streaks, XP, achievements, heatmaps, and CSV export. Paid tiers are in development and will add advanced analytics and team features.',
  },
  {
    q: 'Can I export my focus data?',
    a: 'Absolutely. From Settings you can download a one-click CSV export of your complete session history. You can also permanently delete your account and all associated data at any time.',
  },
  {
    q: 'Is my focus data private?',
    a: 'Yes. Your data is stored locally on your device and synced to your own account. Nothing is sold, shared, or used for advertising. Delete your account anytime and everything goes with it.',
  },
];

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <Reveal>
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">FAQ</span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Questions, <span className="text-gradient">answered</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div
                  className={`rounded-2xl border transition-colors ${
                    isOpen ? 'border-primary/40 bg-surface' : 'border-border bg-surface'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold text-foreground">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-muted transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-secondary leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Final CTA */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-hover to-accent text-white p-10 sm:p-14 text-center shadow-soft">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
            />
            <h2 className="relative font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your best work is one session away.
            </h2>
            <p className="relative mt-3 max-w-xl mx-auto text-sm sm:text-base text-white/80">
              Join thousands of deep workers who protect their attention with Zaf Focus. Free
              forever, no credit card required.
            </p>
            <button
              onClick={() => (window.location.hash = '#/app')}
              className="relative mt-8 group inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-white text-primary font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
            >
              <span>Launch Zaf Focus</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
