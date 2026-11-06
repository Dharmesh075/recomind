'use client';

import React, { useState } from 'react';
import {
  User,
  Sliders,
  Shield,
  Eye,
  Check,
  Lock,
  Calendar,
  LogOut,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Trash2,
  KeyRound,
  Laptop,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCategories } from '@/data/products';
import { clearBrowsingHistory } from '@/lib/store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

type ProfileSection = 'personal' | 'preferences' | 'security' | 'privacy';

export default function ProfilePage() {
  const {
    user,
    preferences,
    updateProfile,
    changePassword,
    updatePreferences,
    signOut,
  } = useAuth();

  const [activeSection, setActiveSection] = useState<ProfileSection>('personal');

  // Personal Info Form State
  const [prevUid, setPrevUid] = useState(user?.uid);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [language, setLanguage] = useState(user?.language || 'English');
  const [currency, setCurrency] = useState(user?.currency || 'INR (₹)');
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [personalFeedback, setPersonalFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (user?.uid !== prevUid) {
    setPrevUid(user?.uid);
    setDisplayName(user?.displayName || '');
    setLanguage(user?.language || 'English');
    setCurrency(user?.currency || 'INR (₹)');
  }

  // Shopping Preferences Form State
  const datasetCategories = getCategories().map((c) => c.name);
  const [prevPrefs, setPrevPrefs] = useState(preferences);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(preferences);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const [prefsFeedback, setPrefsFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (preferences !== prevPrefs) {
    setPrevPrefs(preferences);
    setSelectedCategories(preferences);
  }

  // Account Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [securityFeedback, setSecurityFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Privacy Actions State
  const [privacyFeedback, setPrivacyFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Dirty check for personal info
  const isPersonalDirty =
    displayName !== (user?.displayName || '') ||
    language !== (user?.language || 'English') ||
    currency !== (user?.currency || 'INR (₹)');

  // Member Since formatting
  const memberSinceFormatted = (() => {
    if (!user?.createdAt) return 'October 2024';
    try {
      const d = new Date(user.createdAt);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'October 2024';
    }
  })();

  // Dynamic Initials
  const initials = (() => {
    if (!user?.displayName?.trim()) return 'U';
    const parts = user.displayName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  /* -------------------------------------------------------------
   * Form Handlers
   * ------------------------------------------------------------- */
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalFeedback(null);

    if (!displayName.trim()) {
      setPersonalFeedback({
        type: 'error',
        message: 'Full name cannot be left blank.',
      });
      return;
    }

    setIsSavingPersonal(true);
    const result = await updateProfile({
      displayName: displayName.trim(),
      language,
      currency,
    });
    setIsSavingPersonal(false);

    if (result.error) {
      setPersonalFeedback({
        type: 'error',
        message: result.error,
      });
    } else {
      setPersonalFeedback({
        type: 'success',
        message: 'Your profile has been updated.',
      });
    }
  };

  const handleCancelPersonal = () => {
    setDisplayName(user?.displayName || '');
    setLanguage(user?.language || 'English');
    setCurrency(user?.currency || 'INR (₹)');
    setPersonalFeedback(null);
  };

  const handleToggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSavePreferences = () => {
    setIsSavingPrefs(true);
    updatePreferences(selectedCategories);
    setTimeout(() => {
      setIsSavingPrefs(false);
      setPrefsFeedback({
        type: 'success',
        message: 'Your profile has been updated.',
      });
    }, 300);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityFeedback(null);

    if (!currentPassword) {
      setSecurityFeedback({
        type: 'error',
        message: 'Please enter your current password.',
      });
      return;
    }

    if (newPassword.length < 8) {
      setSecurityFeedback({
        type: 'error',
        message: 'New password must be at least 8 characters long.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityFeedback({
        type: 'error',
        message: 'New passwords do not match. Please verify and try again.',
      });
      return;
    }

    setIsSavingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSavingPassword(false);

    if (result.error) {
      setSecurityFeedback({
        type: 'error',
        message: result.error,
      });
    } else {
      setSecurityFeedback({
        type: 'success',
        message: 'Your password has been changed successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleClearHistoryAction = () => {
    clearBrowsingHistory();
    setPrivacyFeedback({
      type: 'success',
      message: 'Your browsing history has been cleared from your account profile.',
    });
  };

  const handleResetPreferencesAction = () => {
    const defaults = ['Audio', 'Workspace'];
    setSelectedCategories(defaults);
    updatePreferences(defaults);
    setPrivacyFeedback({
      type: 'success',
      message: 'Personalization interest vectors have been reset to default values.',
    });
  };

  const navItems = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'preferences', label: 'Shopping Preferences', icon: Sliders },
    { id: 'security', label: 'Account Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
  ] as const;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-semibold text-primary tracking-tight">
          My Profile
        </h1>
        <p className="text-secondary text-sm mt-1">
          Manage your account and shopping preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <section className="bg-white rounded-2xl border border-border p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Circular Avatar / Generated Initials */}
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0 select-none">
            {initials}
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary tracking-tight">
              {user?.displayName || 'User Profile'}
            </h2>
            <p className="text-sm text-secondary font-normal mt-0.5">
              {user?.email || 'authenticated-shopper@recomind.com'}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-secondary/80 mt-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Member since {memberSinceFormatted}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveSection('personal')}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold text-primary bg-[#F8F9F7] hover:bg-gray-100 rounded-lg border border-border transition-colors cursor-pointer"
        >
          Edit Profile
        </button>
      </section>

      {/* Main Two-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8 items-start">
        {/* Left Column: Profile Navigation */}
        <aside className="bg-white rounded-2xl border border-border p-2.5 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-secondary px-3.5 pt-2 pb-1 block tracking-wider uppercase">
            Account Settings
          </span>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setActiveSection(id);
                  setPersonalFeedback(null);
                  setPrefsFeedback(null);
                  setSecurityFeedback(null);
                  setPrivacyFeedback(null);
                }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left relative cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#F0F4F1] text-primary font-semibold'
                      : 'text-secondary hover:text-primary hover:bg-[#F8F9F7]'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-accent rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-accent' : 'text-secondary'
                  }`}
                />
                <span>{label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Column: Active Section Canvas */}
        <main className="bg-white rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
          {/* 1. PERSONAL INFORMATION */}
          {activeSection === 'personal' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Personal Information
                </h2>
                <p className="text-xs text-secondary mt-1">
                  Update your contact details and default regional viewing preferences.
                </p>
              </div>

              {personalFeedback && (
                <Alert
                  type={personalFeedback.type}
                  message={personalFeedback.message}
                  onDismiss={() => setPersonalFeedback(null)}
                />
              )}

              {isPersonalDirty && (
                <div className="p-3 bg-[#A86C19]/10 border border-[#A86C19]/20 rounded-xl flex items-center gap-2 text-xs text-[#A86C19]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You have unsaved changes. Remember to click &quot;Save Changes&quot; below.</span>
                </div>
              )}

              <form onSubmit={handleSavePersonal} className="space-y-5">
                <Input
                  label="Full Name"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                />

                {/* Email (Read-Only by default with lock badge) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="user-email-readonly"
                      className="text-sm font-medium text-primary"
                    >
                      Email Address
                    </label>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-secondary bg-[#F8F9F7] px-2 py-0.5 rounded border border-border">
                      <Lock className="w-3 h-3 text-secondary" />
                      Read-only
                    </span>
                  </div>
                  <input
                    id="user-email-readonly"
                    type="email"
                    disabled
                    value={user?.email || 'demo@recomind.com'}
                    className="w-full h-[50px] px-4 text-[15px] bg-[#F8F9F7] border border-border rounded-lg text-secondary cursor-not-allowed select-none"
                  />
                  <p className="mt-1.5 text-xs text-secondary/80">
                    Your email address is managed securely by your authentication account.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Language */}
                  <div>
                    <label
                      htmlFor="preferred-language"
                      className="text-sm font-medium text-primary block mb-1.5"
                    >
                      Preferred Language
                    </label>
                    <select
                      id="preferred-language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-[50px] px-4 text-sm bg-white border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    >
                      <option value="English">English (Default)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                    </select>
                  </div>

                  {/* Preferred Currency / Region */}
                  <div>
                    <label
                      htmlFor="preferred-currency"
                      className="text-sm font-medium text-primary block mb-1.5"
                    >
                      Preferred Currency & Region
                    </label>
                    <select
                      id="preferred-currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full h-[50px] px-4 text-sm bg-white border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
                    >
                      <option value="INR (₹)">INR (₹) — India (Default)</option>
                      <option value="USD ($)">USD ($) — United States</option>
                      <option value="EUR (€)">EUR (€) — Europe</option>
                      <option value="GBP (£)">GBP (£) — United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <Button
                    type="submit"
                    loading={isSavingPersonal}
                    className="h-11 px-6 text-sm"
                  >
                    Save Changes
                  </Button>
                  {isPersonalDirty && (
                    <button
                      type="button"
                      onClick={handleCancelPersonal}
                      className="h-11 px-4 text-sm font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* 2. SHOPPING PREFERENCES */}
          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Shopping Preferences
                </h2>
                <p className="text-xs text-secondary mt-1">
                  Select your primary product interests to improve recommendation relevance across your feeds.
                </p>
              </div>

              {prefsFeedback && (
                <Alert
                  type={prefsFeedback.type}
                  message={prefsFeedback.message}
                  onDismiss={() => setPrefsFeedback(null)}
                />
              )}

              {/* Informative Rationale */}
              <div className="p-4 bg-[#F8F9F7] border border-border rounded-xl space-y-1 text-xs text-secondary">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  How category preferences work
                </span>
                <p className="leading-relaxed">
                  Selecting preferred categories helps prioritize relevant product clusters in candidate generation. Preferences adjust category ranking inputs without requiring a full machine learning model retrain.
                </p>
              </div>

              {/* Category Chips */}
              <div>
                <span className="text-xs font-semibold text-secondary uppercase tracking-wider block mb-3">
                  Catalog Categories
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {datasetCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className={`
                          px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer border
                          ${
                            isSelected
                              ? 'bg-[#F0F4F1] text-accent border-accent/40 font-semibold shadow-2xs'
                              : 'bg-white text-secondary hover:text-primary border-border font-medium hover:border-gray-300'
                          }
                        `}
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-accent text-white' : 'border border-border'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button
                  type="button"
                  onClick={handleSavePreferences}
                  loading={isSavingPrefs}
                  className="h-11 px-6 text-sm"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}

          {/* 3. ACCOUNT SECURITY */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Account Security
                </h2>
                <p className="text-xs text-secondary mt-1">
                  Manage your authentication password and inspect your active browsing session.
                </p>
              </div>

              {securityFeedback && (
                <Alert
                  type={securityFeedback.type}
                  message={securityFeedback.message}
                  onDismiss={() => setSecurityFeedback(null)}
                />
              )}

              {/* Password Change Form */}
              <form onSubmit={handleChangePassword} className="space-y-4">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-accent" />
                  <span>Change Password</span>
                </h3>

                <Input
                  label="Current Password"
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="New Password"
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    loading={isSavingPassword}
                    className="h-11 px-6 text-sm"
                  >
                    Update Password
                  </Button>
                </div>
              </form>

              {/* Active Session Information */}
              <div className="pt-4 border-t border-border space-y-3">
                <h3 className="text-sm font-semibold text-primary flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-accent" />
                  <span>Active Session Information</span>
                </h3>
                <div className="p-4 rounded-xl bg-[#F8F9F7] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-primary block">
                      Current Web Client Session
                    </span>
                    <span className="text-secondary mt-0.5 block">
                      UID: {user?.uid || 'user_demo_001'} • Localhost Evaluation Runtime
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-success font-medium">Active now</span>
                  </div>
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-primary block">
                    Sign Out of Recomind
                  </span>
                  <span className="text-xs text-secondary">
                    Terminates your active session on this device.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="px-4 py-2 text-xs font-semibold text-error hover:bg-error/10 border border-error/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. PRIVACY */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-primary">
                  Privacy & Data Transparency
                </h2>
                <p className="text-xs text-secondary mt-1">
                  Understand how your actions inform recommendation algorithms and control your recorded signals.
                </p>
              </div>

              {privacyFeedback && (
                <Alert
                  type={privacyFeedback.type}
                  message={privacyFeedback.message}
                  onDismiss={() => setPrivacyFeedback(null)}
                />
              )}

              {/* Transparency Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                  Recorded Signal Types
                </span>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#F8F9F7] border border-border space-y-1">
                    <strong className="text-primary block font-semibold">
                      1. Product Detail Views (Implicit Signals)
                    </strong>
                    <p className="text-secondary leading-relaxed">
                      Recorded when you inspect a product. Used to calculate collaborative similarity with shoppers who explored similar items. Repeated refreshes are deduplicated automatically.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F9F7] border border-border space-y-1">
                    <strong className="text-primary block font-semibold">
                      2. Wishlist Favorites (Explicit Signals)
                    </strong>
                    <p className="text-secondary leading-relaxed">
                      Recorded when you tap the heart icon. Supplies high-weight preference vectors representing intentional affinity for specific brands and design attributes.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8F9F7] border border-border space-y-1">
                    <strong className="text-primary block font-semibold">
                      3. Shopping Preferences (Declared Filters)
                    </strong>
                    <p className="text-secondary leading-relaxed">
                      Manually configured category weights used as rank modifiers without modifying core collaborative matrices.
                    </p>
                  </div>
                </div>
              </div>

              {/* Privacy Management Actions */}
              <div className="pt-4 border-t border-border space-y-4">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block">
                  Data Reset Actions
                </span>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleClearHistoryAction}
                    className="flex-1 p-3.5 rounded-xl border border-border bg-[#F8F9F7] hover:bg-gray-100 transition-colors text-left space-y-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Trash2 className="w-3.5 h-3.5 text-error" />
                      <span>Clear Browsing History</span>
                    </div>
                    <p className="text-[11px] text-secondary">
                      Deletes recorded product view timestamps from your account.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPreferencesAction}
                    className="flex-1 p-3.5 rounded-xl border border-border bg-[#F8F9F7] hover:bg-gray-100 transition-colors text-left space-y-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <RefreshCw className="w-3.5 h-3.5 text-accent" />
                      <span>Reset Personalization Priors</span>
                    </div>
                    <p className="text-[11px] text-secondary">
                      Resets selected category vectors back to initial defaults.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
