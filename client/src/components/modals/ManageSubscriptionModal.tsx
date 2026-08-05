import React from 'react';
import { X, Check, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ManageSubscriptionModal: React.FC = () => {
  const { billingModalOpen, setBillingModalOpen } = useApp();

  if (!billingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6">
        <button
          onClick={() => setBillingModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-muted hover:text-foreground rounded-full hover:bg-surface-subtle"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase bg-primary-soft text-primary-strong px-2.5 py-1 rounded-md">
            SUBSCRIPTION MANAGEMENT
          </span>
          <h3 className="text-2xl font-bold text-foreground mt-2">Free Tier</h3>
          <p className="text-xs text-secondary mt-1">
            You're on the free plan. Upgrade and billing details will appear here once available.
          </p>
        </div>

        <div className="space-y-3 bg-surface-subtle p-4 rounded-2xl border border-border text-xs">
          <div className="flex items-center space-x-2 text-foreground font-medium">
            <Check className="w-4 h-4 text-success" />
            <span>Unlimited Pomodoro & Deep Work Focus Sessions</span>
          </div>
          <div className="flex items-center space-x-2 text-foreground font-medium">
            <Check className="w-4 h-4 text-success" />
            <span>High-Fidelity Synthesized Ambient Sound Generator</span>
          </div>
          <div className="flex items-center space-x-2 text-foreground font-medium">
            <Check className="w-4 h-4 text-success" />
            <span>Advanced Focus Heatmaps & CSV Data Exports</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-2xl text-xs">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <div>
              <p className="font-semibold text-foreground">No payment method on file</p>
              <p className="text-muted">Add a payment method to enable billing.</p>
            </div>
          </div>
          <button className="text-xs font-semibold text-primary hover:underline">
            Edit
          </button>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={() => setBillingModalOpen(false)}
            className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle"
          >
            Close
          </button>
          <button
            onClick={() => {
              alert('Subscription management updated!');
              setBillingModalOpen(false);
            }}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs"
          >
            Save Subscription Settings
          </button>
        </div>
      </div>
    </div>
  );
};
