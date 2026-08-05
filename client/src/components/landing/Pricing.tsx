import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';

interface Tier {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  popular?: boolean;
  available?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    tagline: 'Everything you need to build the deep work habit.',
    features: [
      'Unlimited Pomodoro & deep work sessions',
      'Synthesized ambient sound generator',
      'Streaks, XP & achievements',
      'Focus heatmaps & CSV export',
      'Offline-first, private by default',
    ],
    cta: 'Start focusing free',
    available: true,
  },
  {
    name: 'Pro',
    price: '$6',
    period: 'per month',
    tagline: 'For serious deep workers who want the full picture.',
    features: [
      'Everything in Starter',
      'Advanced analytics & long-term trends',
      'Custom soundscape mixing',
      'Multi-device sync',
      'Priority support',
    ],
    cta: 'Join the waitlist',
    popular: true,
    available: false,
  },
  {
    name: 'Team',
    price: '$24',
    period: 'per month',
    tagline: 'Deep work culture for your whole organization.',
    features: [
      'Everything in Pro',
      'Shared team dashboards',
      'Admin & reporting controls',
      'SSO & SAML',
      'Dedicated onboarding',
    ],
    cta: 'Contact sales',
    available: false,
  },
];

export const Pricing: React.FC = () => {
  const [joined, setJoined] = useState<Record<string, boolean>>({});

  const handleCta = (tier: Tier) => {
    if (tier.available) {
      window.location.hash = '#/app';
      return;
    }
    setJoined((prev) => ({ ...prev, [tier.name]: true }));
  };

  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-surface/60 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest uppercase text-primary">
              Pricing
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Start free. <span className="text-gradient">Upgrade when ready.</span>
            </h2>
            <p className="mt-4 text-secondary text-base sm:text-lg">
              The free tier includes every core feature. Paid tiers are on the way — join the
              waitlist to be first in line.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 120} className="h-full">
              <div
                className={`relative h-full flex flex-col p-7 rounded-3xl bg-surface border transition-all duration-300 hover:-translate-y-1 ${
                  tier.popular
                    ? 'border-primary/60 shadow-soft ring-1 ring-primary/30'
                    : 'border-border hover:shadow-soft'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-[10px] font-bold tracking-wider uppercase shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    <span>Most popular</span>
                  </span>
                )}

                <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
                <div className="mt-3 flex items-baseline space-x-1.5">
                  <span className="font-display text-4xl font-extrabold text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-xs text-muted font-medium">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-secondary">{tier.tagline}</p>

                <ul className="mt-6 space-y-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start space-x-2.5 text-sm text-foreground">
                      <span className="mt-0.5 p-0.5 rounded-full bg-success-soft text-success shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCta(tier)}
                  className={`mt-7 w-full py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    tier.popular
                      ? 'bg-primary hover:bg-primary-hover text-white shadow-soft hover:shadow-lg'
                      : 'bg-surface-subtle border border-border text-foreground hover:border-primary/40 hover:bg-primary/5'
                  }`}
                >
                  {joined[tier.name] ? 'You’re on the list! ✓' : tier.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
