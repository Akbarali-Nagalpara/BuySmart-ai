import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { DashboardCardSkeleton } from '../ui/SkeletonLoader';
import { TrendingUp, TrendingDown, Activity, ArrowRight, ShoppingCart, Heart, GitCompare, Clock, Calendar, BarChart3 } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { StaggerChildren, StaggerItem } from '../animations/StaggerChildren';
import { CountUp } from '../animations/CountUp';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedButton } from '../ui/AnimatedButton';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../config/api';

interface DashboardStats {
  totalAnalyses: number;
  buyRecommendations: number;
  notBuyRecommendations: number;
  averageScore: number;
  wishlistCount?: number;
  totalComparisons?: number;
  avgResponseTime?: number;
  thisWeekCount?: number;
  thisMonthCount?: number;
  lastWeekCount?: number;
  lastMonthCount?: number;
}

interface RecentAnalysis {
  id: string;
  productName: string;
  score: number;
  verdict: 'BUY' | 'NOT_BUY';
  date: string;
  imageUrl?: string;
}

interface ChartData {
  date: string;
  total: number;
  buy: number;
  notBuy: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    buyRecommendations: 0,
    notBuyRecommendations: 0,
    averageScore: 0
  });
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, recentResponse, chartResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent'),
          api.get('/dashboard/chart')
        ]);
        
        setStats(statsResponse.data);
        setRecentAnalyses(recentResponse.data);
        setChartData(chartResponse.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navigation />
        <div className="px-8 py-6">
          <div className="mb-8">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
            <DashboardCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />
      
      <div className="px-8 lg:px-16 py-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-16 pb-8 border-b border-slate-200/50 dark:border-slate-800/50">
          <div>
            <h1 className="text-5xl font-extralight tracking-tight text-slate-900 dark:text-white mb-3">
              Dashboard
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-lg">
              Your product analysis insights
            </p>
          </div>
          <Link
            to="/analyze"
            className="group relative inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-lg font-medium hover:scale-105 transition-transform"
          >
            <ShoppingCart className="w-5 h-5" />
            New Analysis
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Total Analyses */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="text-sm uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-4 font-medium">
                Total
              </div>
              <div className="text-6xl font-extralight text-slate-900 dark:text-white mb-3 tracking-tight">
                {stats.totalAnalyses}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500">Analyses</div>
            </div>
          </div>

          {/* Buy Recommendations */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="text-sm uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-4 font-medium">
                Buy
              </div>
              <div className="text-6xl font-extralight text-green-600 dark:text-green-400 mb-3 tracking-tight">
                {stats.buyRecommendations}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500">
                {stats.totalAnalyses > 0 ? Math.round((stats.buyRecommendations / stats.totalAnalyses) * 100) : 0}% Recommended
              </div>
            </div>
          </div>

          {/* Not Buy Recommendations */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="text-sm uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-4 font-medium">
                Not Buy
              </div>
              <div className="text-6xl font-extralight text-red-600 dark:text-red-400 mb-3 tracking-tight">
                {stats.notBuyRecommendations}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500">
                {stats.totalAnalyses > 0 ? Math.round((stats.notBuyRecommendations / stats.totalAnalyses) * 100) : 0}% Flagged
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="text-sm uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-4 font-medium">
                Average
              </div>
              <div className="text-6xl font-extralight text-slate-900 dark:text-white mb-3 tracking-tight">
                {stats.averageScore}
              </div>
              <div className="relative h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-600 dark:to-slate-400 transition-all duration-1000 ease-out"
                  style={{ width: `${stats.averageScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Wishlist Count */}
          <Link
            to="/wishlist"
            className="group relative p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/30">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">
              {stats.wishlistCount ?? 0}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">Wishlist Items</div>
          </Link>

          {/* Total Comparisons */}
          <Link
            to="/comparison"
            className="group relative p-6 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                <GitCompare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">
              {stats.totalComparisons ?? 0}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">Comparisons Made</div>
          </Link>

          {/* Avg Response Time */}
          <div className="relative p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-extralight text-slate-900 dark:text-white mb-1">
              {stats.avgResponseTime ? `${stats.avgResponseTime}s` : '0s'}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">Avg Response Time</div>
          </div>

          {/* This Week/Month */}
          <div className="relative p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30">
                <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-3xl font-extralight text-slate-900 dark:text-white">
                {stats.thisWeekCount ?? 0}
              </div>
              <span className="text-sm text-slate-400 dark:text-slate-600">/</span>
              <div className="text-xl font-extralight text-slate-500 dark:text-slate-400">
                {stats.thisMonthCount ?? 0}
              </div>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">This Week / Month</div>
            {stats.lastWeekCount !== undefined && (
              <div className="text-xs text-slate-400 dark:text-slate-600 mt-2 flex items-center gap-1">
                {stats.thisWeekCount! > stats.lastWeekCount ? (
                  <>
                    <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400">
                      +{Math.round(((stats.thisWeekCount! - stats.lastWeekCount) / Math.max(stats.lastWeekCount, 1)) * 100)}%
                    </span>
                  </>
                ) : stats.thisWeekCount! < stats.lastWeekCount ? (
                  <>
                    <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                    <span className="text-red-600 dark:text-red-400">
                      {Math.round(((stats.thisWeekCount! - stats.lastWeekCount) / Math.max(stats.lastWeekCount, 1)) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">No change</span>
                )}
                <span className="text-slate-400">vs last week</span>
              </div>
            )}
          </div>
        </div>

        {/* Analysis History Chart */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extralight text-slate-900 dark:text-white tracking-tight mb-2">
                Analysis Activity
              </h2>
              <p className="text-sm text-slate-400 dark:text-slate-600">
                Last 30 days of product analysis history
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Buy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600 dark:text-slate-400">Not Buy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                <span className="text-slate-600 dark:text-slate-400">Total</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            {chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-slate-400 dark:text-slate-600 text-center">
                  No analysis data available yet
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNotBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0"
                    className="dark:opacity-10"
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px'
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="buy" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    fill="url(#colorBuy)"
                    name="Buy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="notBuy" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fill="url(#colorNotBuy)"
                    name="Not Buy"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#64748b" 
                    strokeWidth={2}
                    fill="url(#colorTotal)"
                    name="Total"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Analyses */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extralight text-slate-900 dark:text-white tracking-tight">
              Recent Activity
            </h2>
            <Link 
              to="/history" 
              className="group text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              View all 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-32 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50 border border-slate-200 dark:border-slate-800">
              <div className="inline-flex p-8 rounded-full bg-white dark:bg-slate-800 shadow-lg mb-6">
                <ShoppingCart className="w-12 h-12 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-slate-400 dark:text-slate-500 mb-2 text-lg">No analyses yet</p>
              <p className="text-slate-400 dark:text-slate-600 text-sm mb-8">Start analyzing products to see your activity here</p>
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
              >
                Start your first analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {recentAnalyses.map((analysis, index) => (
                <div 
                  key={analysis.id} 
                  className="group relative rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-28 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                    {analysis.imageUrl ? (
                      <img 
                        src={analysis.imageUrl} 
                        alt={analysis.productName}
                        className="max-w-full max-h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                      </div>
                    )}
                    {/* Score Badge Overlay */}
                    <div className="absolute top-2 right-2 flex items-center justify-center w-9 h-9 rounded-lg backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                      <div className={`text-sm font-bold ${
                        analysis.score >= 70 
                          ? 'text-green-600 dark:text-green-400'
                          : analysis.score >= 40
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {analysis.score}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight min-h-[2.5rem]">
                      {analysis.productName}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-600 mb-3">
                      <Calendar className="w-3 h-3" />
                      {analysis.date}
                    </div>

                    {/* Verdict Badge */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium text-xs ${
                      analysis.verdict === 'BUY'
                        ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                    }`}>
                      {analysis.verdict === 'BUY' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {analysis.verdict}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



