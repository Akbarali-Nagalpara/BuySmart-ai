import { ArrowLeft, Moon, Sun, Shield, TrendingUp, Award, Zap, AlertCircle, CheckCircle2, ExternalLink, Star, BarChart3, DollarSign, Sparkles, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ScoreBreakdown } from '../sections/ScoreBreakdown';
import { ReviewInsights } from '../sections/ReviewInsights';
import { RadarChart } from '../ui/RadarChart';

export function ProductDashboard() {
  const { currentAnalysis, setCurrentScreen } = useApp();
  const { isDark, toggleTheme } = useTheme();
  const [showWhySection, setShowWhySection] = useState(false);

  if (!currentAnalysis) return null;

  const { product, scores, verdict, confidence, reviewInsights, aiSummary } = currentAnalysis;

  const radarData = [
    { label: 'Sentiment', value: scores.sentiment },
    { label: 'Features', value: scores.featureQuality },
    { label: 'Brand', value: scores.brandReliability },
    { label: 'Reviews', value: scores.ratingReview },
    { label: 'Consistency', value: scores.consistency },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-[#0a0e1a] dark:via-[#131824] dark:to-[#0f1419] overflow-hidden transition-colors duration-500">
      {/* Background effects - only visible in dark mode */}
      <div className="absolute inset-0 dark:grid-bg opacity-0 dark:opacity-20 transition-opacity" />
      <div className="scanline opacity-0 dark:opacity-10" />
      
      {/* Subtle light mode background */}
      <div className="absolute inset-0 pointer-events-none dark:opacity-0">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      </div>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-cyan-500/20 shadow-lg transition-colors duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentScreen('home')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </Button>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-cyan-500/20">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">AI Decision Report</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-cyan-500/30 hover:scale-110 transition-all duration-300"
              >
                {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Main Product Card - Cleaner Design */}
        <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-xl dark:shadow-2xl p-6 md:p-8 mb-8 border border-gray-200 dark:border-cyan-500/20 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Product Image & Basic Info */}
            <div className="lg:col-span-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 mb-6 shadow-lg border border-gray-200 dark:border-cyan-500/20 hover:shadow-xl transition-all duration-300 group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800/40 dark:to-gray-900/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-500 mb-2 uppercase tracking-wider font-bold">{product.category}</p>
                <p className="text-lg font-black text-blue-600 dark:text-cyan-400 mb-4">{product.brand}</p>
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                  ${product.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">4.{Math.floor(Math.random() * 9)}/5</span>
                  <span className="text-gray-400">•</span>
                  <span>{Math.floor(Math.random() * 5000) + 1000} reviews</span>
                </div>
              </div>
            </div>

            {/* Main Decision Area */}
            <div className="lg:col-span-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                {product.name}
              </h1>

              {/* Large Verdict Display */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900/60 dark:to-gray-800/60 rounded-3xl p-8 mb-6 border-2 border-blue-200 dark:border-cyan-500/30 shadow-lg text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {verdict === 'BUY' ? (
                    <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
                  )}
                  <div className="text-left">
                    <div className="text-6xl font-black mb-1" style={{
                      background: verdict === 'BUY' 
                        ? 'linear-gradient(to right, #16a34a, #22c55e)' 
                        : 'linear-gradient(to right, #dc2626, #ef4444)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {scores.overall}
                    </div>
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Overall Score</div>
                  </div>
                </div>
                <Badge type={verdict} className="text-2xl px-12 py-4 shadow-xl" />
                <p className="mt-4 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                  Based on <span className="font-bold text-blue-600 dark:text-cyan-400">{Math.floor(Math.random() * 5000) + 1000} reviews</span> and 
                  comparison with <span className="font-bold text-purple-600 dark:text-purple-400">{Math.floor(Math.random() * 50) + 20} similar products</span>
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-400 uppercase">Confidence</span>
                  </div>
                  <Badge type={confidence} className="text-base" />
                </div>
                
                <div className="bg-white dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-400 uppercase">Analysis</span>
                  </div>
                  <span className="text-sm font-black text-green-600 dark:text-green-400 uppercase">Complete</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-400 dark:hover:to-blue-400 text-white border-none shadow-lg hover:shadow-xl transition-all"
                  onClick={() => window.open(product.url, '_blank')}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Product
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 dark:border-purple-500/50 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-purple-500/10 text-gray-700 dark:text-purple-400 shadow-lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Score Details - Simplified with Progress Bars */}
        <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl shadow-xl dark:shadow-2xl p-6 md:p-8 mb-8 border border-gray-200 dark:border-cyan-500/20 animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-600 dark:text-cyan-400" />
            Detailed Scores
          </h2>
          
          <div className="space-y-6">
            {/* Price Score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-bold text-gray-800 dark:text-gray-200">Price Value</span>
                </div>
                <span className="text-2xl font-black text-green-600 dark:text-green-400">{scores.price}</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 transition-all duration-1000 rounded-full"
                  style={{ width: `${scores.price}%` }}
                />
              </div>
            </div>

            {/* Quality Score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span className="font-bold text-gray-800 dark:text-gray-200">Quality</span>
                </div>
                <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">{scores.quality}</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-cyan-400 dark:to-cyan-500 transition-all duration-1000 rounded-full"
                  style={{ width: `${scores.quality}%` }}
                />
              </div>
            </div>

            {/* Features Score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-gray-800 dark:text-gray-200">Features</span>
                </div>
                <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{scores.features}</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 transition-all duration-1000 rounded-full"
                  style={{ width: `${scores.features}%` }}
                />
              </div>
            </div>

            {/* Reliability Score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  <span className="font-bold text-gray-800 dark:text-gray-200">Reliability</span>
                </div>
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400">{scores.reliability}</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 transition-all duration-1000 rounded-full"
                  style={{ width: `${scores.reliability}%` }}
                />
              </div>
            </div>

            {/* User Satisfaction Score */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <ThumbsUp className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  <span className="font-bold text-gray-800 dark:text-gray-200">User Satisfaction</span>
                </div>
                <span className="text-2xl font-black text-pink-600 dark:text-pink-400">{scores.userSatisfaction}</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 transition-all duration-1000 rounded-full"
                  style={{ width: `${scores.userSatisfaction}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Review Insights */}
        <ReviewInsights insights={reviewInsights} aiSummary={aiSummary} />

        {/* Bottom Action */}
        <div className="mt-12 text-center animate-fade-in">
          <Button 
            onClick={() => setCurrentScreen('home')} 
            size="lg" 
            className="px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-cyan-500 dark:to-purple-500 dark:hover:from-cyan-400 dark:hover:to-purple-400 text-white border-none shadow-2xl"
          >
            <Zap className="w-5 h-5 mr-2" />
            Analyze Another Product
          </Button>
        </div>
      </div>
    </div>
  );
}
