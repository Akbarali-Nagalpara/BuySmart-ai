import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../layout/Navigation';
import { DashboardCardSkeleton } from '../ui/SkeletonLoader';
import { TrendingUp, TrendingDown, ArrowRight, ShoppingCart, Heart, GitCompare, Clock, Calendar, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

interface TopScoredProduct {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  score: number;
  verdict: 'BUY' | 'NOT_BUY';
  price: number;
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
  const [topScoredProducts, setTopScoredProducts] = useState<TopScoredProduct[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, recentResponse, topScoredResponse, chartResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent'),
          api.get('/dashboard/top-scored'),
          api.get('/dashboard/chart')
        ]);

        setStats(statsResponse.data);
        setRecentAnalyses(recentResponse.data);
        setTopScoredProducts(topScoredResponse.data);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Decorative Blur Accents */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-purple-500/10 to-transparent dark:from-blue-400/15 dark:via-purple-400/15 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/8 via-emerald-500/8 to-transparent dark:from-cyan-400/12 dark:via-emerald-400/12 blur-3xl pointer-events-none" />

      <Navigation />

      <div className="lg:ml-64 pt-16 lg:pt-0 relative z-10">
        <div className="px-4 md:px-8 lg:px-12 py-6 md:py-10">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 md:mb-16 pb-6 md:pb-8 border-b border-slate-200/50 dark:border-slate-800/50">
            <div>
              <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-slate-900 dark:text-white mb-2 md:mb-3">
                Dashboard
              </h1>
              <p className="text-slate-400 dark:text-slate-500 text-base md:text-lg">
                Your product analysis insights
              </p>
            </div>
            <Link
              to="/analyze"
              className="group relative inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 md:px-8 py-3 md:py-4 rounded-lg text-sm md:text-base font-medium hover:scale-105 transition-transform w-full sm:w-auto justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
              New Analysis
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {/* Total Analyses */}
            <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-xs md:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Total
                </div>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {stats.totalAnalyses}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-500">Analyses</div>
              </div>
            </div>

            {/* Buy Recommendations */}
            <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-xs md:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Buy
                </div>
                <div className="text-4xl md:text-5xl font-bold text-green-600 dark:text-green-400 mb-2 tracking-tight">
                  {stats.buyRecommendations}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-500">
                  {stats.totalAnalyses > 0 ? Math.round((stats.buyRecommendations / stats.totalAnalyses) * 100) : 0}% Recommended
                </div>
              </div>
            </div>

            {/* Not Buy Recommendations */}
            <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-xs md:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Not Buy
                </div>
                <div className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-400 mb-2 tracking-tight">
                  {stats.notBuyRecommendations}
                </div>
                <div className="text-xs md:text-sm text-slate-500 dark:text-slate-500">
                  {stats.totalAnalyses > 0 ? Math.round((stats.notBuyRecommendations / stats.totalAnalyses) * 100) : 0}% Flagged
                </div>
              </div>
            </div>

            {/* Average Score */}
            <div className="group relative overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="text-xs md:text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 font-semibold">
                  Average
                </div>
                <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {stats.averageScore}
                </div>
                <div className="relative h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-600 dark:to-slate-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.averageScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
            {/* Wishlist Count */}
            <Link
              to="/wishlist"
              className="group relative p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 hover:border-pink-300 dark:hover:border-pink-700 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/30 group-hover:scale-110 transition-transform">
                  <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.wishlistCount ?? 0}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500">Wishlist Items</div>
            </Link>

            {/* Total Comparisons */}
            <Link
              to="/comparison"
              className="group relative p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-purple-700 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 group-hover:scale-110 transition-transform">
                  <GitCompare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.totalComparisons ?? 0}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500">Comparisons Made</div>
            </Link>

            {/* Avg Response Time */}
            <div className="relative p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {stats.avgResponseTime ? `${stats.avgResponseTime}s` : '0s'}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-500">Avg Response Time</div>
            </div>

            {/* This Week/Month */}
            <div className="relative p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/30">
                  <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stats.thisWeekCount ?? 0}
                </div>
                <span className="text-sm text-slate-400 dark:text-slate-600">/</span>
                <div className="text-xl font-bold text-slate-500 dark:text-slate-400">
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
                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNotBuy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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

          {/* Top Scored Products */}
          <div className="mb-16">
            <div className="mb-6">
              <h2 className="text-xl font-normal text-slate-900 dark:text-white mb-1">
                Top Scored Products
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your highest rated analyses
              </p>
            </div>

            {topScoredProducts.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-slate-400 dark:text-slate-500 text-sm">No products yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topScoredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all"
                  >
                    {/* Rank Badge */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium shrink-0 ${index === 0
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : index === 1
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                      }`}>
                      {index + 1}
                    </div>

                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0 p-2">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.productName}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      {product.brand && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                          {product.brand}
                        </div>
                      )}
                      <h3 className="text-sm font-normal text-slate-900 dark:text-white line-clamp-2 mb-1">
                        {product.productName}
                      </h3>
                      {product.price && (
                        <div className="text-base font-semibold text-slate-900 dark:text-white">
                          ₹{product.price.toLocaleString()}
                        </div>
                      )}
                    </div>

                    {/* Score & Verdict */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          {product.score}
                        </div>
                        <div className="text-xs text-slate-400">score</div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${product.verdict === 'BUY'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                        {product.verdict === 'BUY' ? 'Buy' : 'Skip'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <div className="flex flex-wrap gap-8">
                {recentAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="group relative"
                  >
                    {/* Circular Product Image */}
                    <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 overflow-hidden flex items-center justify-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-110">
                      {analysis.imageUrl ? (
                        <img
                          src={analysis.imageUrl}
                          alt={analysis.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



