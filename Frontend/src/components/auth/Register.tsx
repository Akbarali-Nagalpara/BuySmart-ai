import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Sparkles, Mail, Lock, User as UserIcon, Shield, Zap, Heart } from 'lucide-react';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex transition-colors">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:scale-105 transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700" />
        )}
      </button>

      {/* Left side - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-700/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        
        <div className="max-w-md text-white relative z-10">
          {/* Logo matching navigation */}
          <div className="mb-8 flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-white to-slate-200 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-slate-900" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">BuySmart</h1>
              <p className="text-slate-400 text-sm font-medium">AI-Powered Shopping</p>
            </div>
          </div>
          
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Join thousands of smart shoppers making better purchase decisions every day.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Free Forever</h3>
                <p className="text-sm text-slate-400">Get started instantly with no credit card required</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure & Private</h3>
                <p className="text-sm text-slate-400">Your data is encrypted and never shared</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Loved by Users</h3>
                <p className="text-sm text-slate-400">Join our community of satisfied shoppers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 rounded-xl mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white dark:text-slate-900" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create an account</h2>
              <p className="text-slate-600 dark:text-slate-400">Start your smart shopping journey</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 dark:text-red-400 text-xs">✕</span>
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-slate-900 dark:text-white hover:underline font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
