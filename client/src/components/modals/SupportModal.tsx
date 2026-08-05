import React, { useState } from 'react';
import { X, HelpCircle, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupportModal: React.FC = () => {
  const { supportModalOpen, setSupportModalOpen } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!supportModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject('');
      setMessage('');
      setSupportModalOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-6">
        <button
          onClick={() => setSupportModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-muted hover:text-foreground rounded-full hover:bg-surface-subtle"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-soft rounded-2xl text-primary-strong">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Zenith Support Hub</h3>
            <p className="text-xs text-secondary mt-0.5">
              Have questions or feedback? We are here to help.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="p-6 bg-success-soft text-success rounded-2xl text-center space-y-2">
            <p className="font-bold text-base">Message Sent Successfully! 🎉</p>
            <p className="text-xs">Our deep work support team will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we assist you?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">
                Message / Feedback
              </label>
              <textarea
                rows={4}
                placeholder="Describe your question or issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-subtle border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSupportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-surface-subtle"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
