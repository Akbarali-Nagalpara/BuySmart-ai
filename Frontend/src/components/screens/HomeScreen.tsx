import { useState } from 'react';
import { Search, Sparkles, Moon, Sun, Zap, TrendingUp, ShoppingBag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { generateMockAnalysis } from '../../utils/mockData';

export function HomeScreen() {
  const { searchQuery, setSearchQuery, recentSearches, addRecentSearch, setCurrentScreen, setCurrentAnalysis } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    addRecentSearch(searchQuery);
    setCurrentScreen('loading');

    setTimeout(() => {
      const analysis = generateMockAnalysis(searchQuery);
      setCurrentAnalysis(analysis);
      setCurrentScreen('dashboard');
    }, 3000);
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch();
  };

  const exampleSearches = [
    'iPhone 15 Pro Max',
    'Sony WH-1000XM5',
    'MacBook Air M2',
    'Samsung S24 Ultra'
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0a0e1a] via-[#131824] to-[#0f1419] overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Scan line effect */}
      <div className="scanline opacity-20" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              opacity: Math.random() * 0.5
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-20 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-float delay-1000" />

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-xl glass-effect-light border border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 hover:scale-110 neon-glow-cyan"
        >
          {isDark ? 
            <Sun className="w-5 h-5 text-cyan-400" /> : 
            <Moon className="w-5 h-5 text-cyan-400" />
          }
        </button>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-slide-up">
            {/* AI Badge */}
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 glass-effect-light rounded-full border border-cyan-500/30 neon-glow-cyan">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">AI-Powered Decision Intelligence</span>
            </div>

            {/* Main heading */}
            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                BuySmart AI
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Let AI analyze before you buy
            </p>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Advanced AI analyzes thousands of reviews, sentiment patterns, and market data in seconds
            </p>
          </div>

          {/* AI Search Interface */}
          <div className="glass-effect rounded-3xl p-8 mb-12 border border-cyan-500/20 neon-glow-cyan animate-slide-up delay-200">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative group">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
                  <Search className="w-6 h-6 text-cyan-400 group-focus-within:animate-pulse" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter product name to analyze..."
                  className="w-full pl-16 pr-6 py-6 text-lg rounded-2xl bg-[#0a0e1a]/60 border-2 border-cyan-500/30 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm font-medium"
                />
              </div>

              <Button 
                onClick={handleSearch} 
                size="lg" 
                className="px-12 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 neon-glow-cyan border-none shadow-2xl"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Analyze Now
              </Button>
            </div>

            {/* Example searches */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide font-semibold">Try searching for</p>
              <div className="flex flex-wrap justify-center gap-3">
                {exampleSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(query);
                      setTimeout(() => handleSearch(), 100);
                    }}
                    className="px-5 py-2.5 glass-effect-light text-gray-300 rounded-full border border-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300 hover:scale-105 font-medium neon-glow-cyan"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="text-center mb-16 animate-fade-in delay-300">
              <p className="text-sm text-gray-500 mb-5 uppercase tracking-wider font-bold flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Recent Analyses
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {recentSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(query)}
                    className="px-6 py-3 glass-effect-light text-gray-300 rounded-full border border-purple-500/20 hover:border-purple-400/50 hover:text-purple-400 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in delay-500">
            <div className="glass-effect p-8 rounded-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="w-10 h-10 text-cyan-400" />
                <div className="text-right">
                  <div className="text-4xl font-black text-cyan-400 mb-1">10K+</div>
                  <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Products Analyzed</div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Sparkles className="w-10 h-10 text-purple-400" />
                <div className="text-right">
                  <div className="text-4xl font-black text-purple-400 mb-1">98%</div>
                  <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">AI Accuracy</div>
                </div>
              </div>
            </div>
            
            <div className="glass-effect p-8 rounded-2xl border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-10 h-10 text-green-400" />
                <div className="text-right">
                  <div className="text-4xl font-black text-green-400 mb-1">&lt;3s</div>
                  <div className="text-sm text-gray-400 font-semibold uppercase tracking-wide">Analysis Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer tagline */}
          <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Powered by advanced machine learning algorithms and natural language processing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
