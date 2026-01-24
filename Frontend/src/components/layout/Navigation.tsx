import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useComparison } from '../../context/ComparisonContext';
import { 
  BarChart3, 
  Search, 
  Clock, 
  User, 
  LogOut, 
  Heart, 
  GitCompare, 
  Settings, 
  HelpCircle,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { comparisonCount } = useComparison();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-colors">
      <div className="px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white dark:text-slate-900" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:from-slate-700 group-hover:to-slate-500 dark:group-hover:from-slate-100 dark:group-hover:to-slate-400 transition-all">
                BuySmart
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block -mt-1">AI-Powered</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/analyze"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/analyze')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              Analyze
            </Link>
            <Link
              to="/comparison"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                isActive('/comparison')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {comparisonCount}
                </span>
              )}
            </Link>
            <Link
              to="/wishlist"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/wishlist')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Heart className="w-4 h-4" />
              Wishlist
            </Link>
            <Link
              to="/history"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/history')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              History
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Help */}
            <Link
              to="/help"
              className={`p-2.5 rounded-lg transition-all ${
                isActive('/help')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </Link>

            {/* Settings */}
            <Link
              to="/settings"
              className={`p-2.5 rounded-lg transition-all ${
                isActive('/settings')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* User Profile */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="w-6 h-6 bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-300 dark:to-slate-400 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white dark:text-slate-900" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name || 'User'}</span>
            </div>

            {/* Profile Page Link (Mobile) */}
            <Link
              to="/profile"
              className={`md:hidden p-2.5 rounded-lg transition-all ${
                isActive('/profile')
                  ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
