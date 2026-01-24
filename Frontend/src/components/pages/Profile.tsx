import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, LogOut, Save } from 'lucide-react';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => {
    // TODO: Implement save functionality with API
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
            <p className="text-slate-700">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 p-8 mb-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/30">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{user?.name}</h2>
                <p className="text-slate-700">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </div>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setName(user?.name || '');
                        setEmail(user?.email || '');
                      }}
                      className="px-6 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 hover:shadow-xl hover:shadow-primary-500/30 transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-xl shadow-lg border border-primary-200/50 p-8 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </h3>
            <button className="text-primary-600 hover:text-primary-700 font-semibold">
              Change Password
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
            <h3 className="text-lg font-bold text-red-700 mb-4">Danger Zone</h3>
            <p className="text-slate-700 mb-4">
              Logging out will end your current session. You'll need to sign in again to access your account.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
