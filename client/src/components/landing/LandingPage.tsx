import React, { useEffect, useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, Github, Twitter, Youtube } from 'lucide-react';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';

const NAV_LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press kit', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help center', href: '#' },
      { label: 'API', href: '#' },
      { label: 'Status', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];

const SOCIALS = [
  { icon: Github, label: 'GitHub' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Youtube, label: 'YouTube' },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-background/85 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNav('hero');
            }}
            className="flex items-center space-x-2.5"
          >
            <span className="p-1.5 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">Zaf Focus</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-secondary hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2.5">
            <button
              onClick={() => (window.location.hash = '#/app')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => (window.location.hash = '#/app')}
              className="group inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-sm transition-all hover:shadow-md cursor-pointer"
            >
              <span>Launch app</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-secondary hover:bg-surface-subtle hover:text-foreground transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fadeIn">
            <div className="px-6 py-4 space-y-1">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleNav(l.id)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-secondary hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.location.hash = '#/app';
                }}
                className="mt-2 w-full flex items-center justify-center space-x-1.5 px-4 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Launch app</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/60">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-6 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2.5">
                <span className="p-1.5 rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="font-display text-lg font-bold tracking-tight">Zaf Focus</span>
              </div>
              <p className="mt-4 text-sm text-secondary leading-relaxed max-w-xs">
                The deep work engine. Protect your attention, build better habits, and do your best
                work.
              </p>
              <div className="mt-5 flex items-center space-x-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="p-2 rounded-xl bg-surface border border-border text-muted hover:text-foreground hover:border-primary/40 transition-colors"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-widest uppercase text-muted">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => {
                          if (l.href.startsWith('#')) {
                            e.preventDefault();
                            handleNav(l.href.slice(1));
                          }
                        }}
                        className="text-sm text-secondary hover:text-primary transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted">© 2026 Zaf Focus. All rights reserved.</p>
            <p className="text-xs text-muted">
              Crafted for deep work, one session at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
