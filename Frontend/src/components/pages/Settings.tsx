import { useState, useEffect } from 'react';
import { Navigation } from '../layout/Navigation';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import api from '../../config/api';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  Trash2,
  Save,
  Moon,
  Sun,
  X,
} from 'lucide-react';

interface UserSettings {
  emailNotifications: boolean;
  priceAlerts: boolean;
  weeklyDigest: boolean;
  theme: string;
}

export function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { success, error: showError } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email change modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<UserSettings>('/settings');
      const settings = response.data;
      
      setEmailNotifications(settings.emailNotifications);
      setPriceAlerts(settings.priceAlerts);
      setWeeklyDigest(settings.weeklyDigest);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      showError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      
      const settings: UserSettings = {
        emailNotifications,
        priceAlerts,
        weeklyDigest,
        theme: isDark ? 'dark' : 'light'
      };

      await api.put('/settings', settings);
      success('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showError('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      showError('Account deletion is not available in demo mode');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.post('/settings/change-password', {
        currentPassword,
        newPassword
      });
      success('Password changed successfully!');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      setIsChangingEmail(true);
      await api.post('/settings/change-email', {
        newEmail,
        password: emailPassword
      });
      success('Email changed successfully! Please log in with your new email.');
      setShowEmailModal(false);
      setNewEmail('');
      setEmailPassword('');
    } catch (error: any) {
      showError(error.response?.data?.message || 'Failed to change email');
    } finally {
      setIsChangingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />

      <div className="px-8 lg:px-16 py-8">
        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                <User className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h1 className="text-5xl font-extralight text-slate-900 dark:text-white mb-2">Settings</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Manage your account preferences and settings
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                  <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    <div className="h-16 bg-slate-100 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">{/* Appearance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Appearance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Theme Mode
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Choose your preferred theme
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`
                      relative w-16 h-8 rounded-full transition-colors
                      ${isDark ? 'bg-slate-900' : 'bg-slate-300'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 left-1 w-6 h-6 bg-white rounded-full
                        flex items-center justify-center transition-transform
                        ${isDark ? 'translate-x-8' : 'translate-x-0'}
                      `}
                    >
                      {isDark ? (
                        <Moon className="w-4 h-4 text-primary-600" />
                      ) : (
                        <Sun className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Email Notifications
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Receive email updates about your analyses
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-700 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Price Drop Alerts
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Get notified when tracked products go on sale
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={priceAlerts}
                      onChange={(e) => setPriceAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-700 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white mb-1">
                      Weekly Digest
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Receive weekly summary of your shopping insights
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={weeklyDigest}
                      onChange={(e) => setWeeklyDigest(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-700 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-900 dark:peer-checked:bg-white"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Privacy & Security
                </h2>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Change Password</span>
                </button>
                <button 
                  onClick={() => setShowEmailModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">Change Email</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Data & Privacy</span>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border-2 border-red-200 dark:border-red-900/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h2 className="text-xl font-semibold text-red-900 dark:text-red-400">Danger Zone</h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-red-800 dark:text-red-300">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving || isLoading}
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-lg font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Change Email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  placeholder="Enter new email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  placeholder="Enter your password to confirm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeEmail}
                  disabled={isChangingEmail}
                  className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {isChangingEmail ? 'Changing...' : 'Change Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
