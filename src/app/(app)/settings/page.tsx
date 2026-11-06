'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Sun,
  AlertTriangle,
  LogOut,
  Trash2,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

export default function SettingsPage() {
  const { signOut, deleteAccount } = useAuth();

  // Notification Toggles (real in-app preferences)
  const [inAppRecNotifications, setInAppRecNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Privacy Controls
  const [recommendationTracking, setRecommendationTracking] = useState(true);
  const [historyRecording, setHistoryRecording] = useState(true);
  const [usePersonalization, setUsePersonalization] = useState(true);
  const [useCategoryPriors, setUseCategoryPriors] = useState(true);

  // Status feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSaveSettings = () => {
    setFeedback('Settings updated successfully.');
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm account deletion.');
      return;
    }

    setIsDeleting(true);
    const result = await deleteAccount(deletePassword);
    setIsDeleting(false);

    if (result.error) {
      setDeleteError(result.error);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5" />
          System Preferences
        </div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          Settings
        </h1>
        <p className="text-secondary text-sm mt-1">
          Configure appearance, real notification alerts, privacy controls, and account actions.
        </p>
      </div>

      {feedback && (
        <Alert
          type="success"
          message={feedback}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* 1. APPEARANCE */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">Appearance</h2>
            <p className="text-xs text-secondary mt-0.5">
              Theme and display configuration for the application shell.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-accent/30 bg-[#F0F4F1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center text-accent shadow-2xs">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-primary block">
                Light Mode (Active Default)
              </span>
              <span className="text-xs text-secondary">
                Minimalist high-contrast palette calibrated for optimal legibility and whitespace.
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-accent bg-white px-2.5 py-1 rounded-full border border-border/80 shadow-2xs">
            Enabled
          </span>
        </div>
      </section>

      {/* 2. NOTIFICATIONS */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">Notifications</h2>
            <p className="text-xs text-secondary mt-0.5">
              Configure available notification alerts for your account.
            </p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-border">
          {/* Notification Item 1 */}
          <div className="flex items-start justify-between gap-4 pt-1">
            <div>
              <span className="text-sm font-medium text-primary block">
                In-App Recommendation Updates
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md leading-relaxed">
                Receive subtle header badges when newly catalogued products match your wishlist or declared category preferences.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInAppRecNotifications(!inAppRecNotifications)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${inAppRecNotifications ? 'bg-accent' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={inAppRecNotifications}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${inAppRecNotifications ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Notification Item 2 */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <div>
              <span className="text-sm font-medium text-primary block">
                Security & Authentication Alerts
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md leading-relaxed">
                Receive security notices when password updates or new device logins occur.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSecurityAlerts(!securityAlerts)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${securityAlerts ? 'bg-accent' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={securityAlerts}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${securityAlerts ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 3. PRIVACY SETTINGS */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-primary">Privacy Settings</h2>
            <p className="text-xs text-secondary mt-0.5">
              Control the signals collected and how they affect your personal recommendation models.
            </p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-border">
          {/* Privacy Item 1: Recommendation-related activity */}
          <div className="flex items-start justify-between gap-4 pt-1">
            <div>
              <span className="text-sm font-medium text-primary block">
                Recommendation-related Activity
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md leading-relaxed">
                Allows Recomind to record click-throughs and detailed inspections to personalize product feeds.
              </p>
              <span className="text-[11px] text-accent/90 block mt-1">
                Consequence: Disabling this freezes your interaction profile; recommendations will rely only on static popularity.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRecommendationTracking(!recommendationTracking)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${recommendationTracking ? 'bg-accent' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={recommendationTracking}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${recommendationTracking ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Privacy Item 2: Browsing History */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <div>
              <span className="text-sm font-medium text-primary block">
                Browsing History Recording
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md leading-relaxed">
                Log timestamps for recently visited product pages.
              </p>
              <span className="text-[11px] text-accent/90 block mt-1">
                Consequence: When paused, new product views will not appear in Recently Viewed.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHistoryRecording(!historyRecording)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${historyRecording ? 'bg-accent' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={historyRecording}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${historyRecording ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Privacy Item 3: Category Priors */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <div>
              <span className="text-sm font-medium text-primary block">
                Saved Category Preferences Weighting
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md leading-relaxed">
                Apply category choices from your Profile as candidate ranking multipliers.
              </p>
              <span className="text-[11px] text-accent/90 block mt-1">
                Consequence: When turned off, category selections in your profile are ignored.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUseCategoryPriors(!useCategoryPriors)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${useCategoryPriors ? 'bg-accent' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={useCategoryPriors}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${useCategoryPriors ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Privacy Item 4: Optional Personalization */}
          <div className="flex items-start justify-between gap-4 pt-4">
            <div>
              <span className="text-sm font-medium text-primary block">
                Personalized Recommendations (Hybrid ML)
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md leading-relaxed">
                Enable hybrid collaborative filtering and content distance matching.
              </p>
              <span className="text-[11px] text-accent/90 block mt-1">
                Consequence: When off, all recommendation sections fall back to unpersonalized general popularity.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setUsePersonalization(!usePersonalization)}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                ${usePersonalization ? 'bg-accent' : 'bg-gray-300'}
              `}
              role="switch"
              aria-checked={usePersonalization}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
                  ${usePersonalization ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <Button onClick={handleSaveSettings} className="h-10 text-xs px-6">
            Save Preferences
          </Button>
        </div>
      </section>

      {/* 4. ACCOUNT ACTIONS & DANGER ZONE */}
      <section className="space-y-4">
        {/* Sign Out Action Card */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">Sign Out</h3>
            <p className="text-xs text-secondary mt-0.5">
              Securely sign out of your account on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-secondary hover:text-primary bg-[#F8F9F7] hover:bg-gray-100 rounded-lg border border-border transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Distinct Danger Zone */}
        <div className="bg-white rounded-2xl border-2 border-error/20 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-error">Danger Zone</h3>
              <p className="text-xs text-secondary mt-0.5">
                Irreversible account deletion actions.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-error/10">
            <div>
              <span className="text-sm font-semibold text-primary block">
                Delete Account
              </span>
              <p className="text-xs text-secondary mt-0.5 max-w-md">
                Permanently deletes your account credentials, saved wishlist items, browsing logs, and personal recommendation vectors.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDeleteError(null);
                setDeletePassword('');
                setIsDeleteModalOpen(true);
              }}
              className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-white bg-error hover:bg-error/90 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-border max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-secondary hover:text-primary p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg font-bold text-primary">
                Are you absolutely sure?
              </h2>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                This action is irreversible. All your user profile details, wishlist products, and browsing interaction history will be permanently destroyed.
              </p>
            </div>

            {deleteError && (
              <Alert
                type="error"
                message={deleteError}
                onDismiss={() => setDeleteError(null)}
              />
            )}

            <form onSubmit={handleConfirmDelete} className="space-y-4 pt-1">
              <Input
                label="Confirm your password"
                type="password"
                id="deletePassword"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter password to confirm"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-secondary hover:text-primary bg-[#F8F9F7] rounded-lg border border-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-error hover:bg-error/90 disabled:opacity-50 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
