import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Star,
  ArrowRight,
  Brain,
  Target,
  Award,
  Moon,
  Sun,
  ShoppingBag,
  CheckCircle2,
  TrendingDown,
} from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { ScrollReveal } from '../animations/ScrollReveal';
import { CountUp } from '../animations/CountUp';
import { AnimatedButton } from '../ui/AnimatedButton';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../context/ThemeContext';
import { ThreeBackground } from '../animations/ThreeBackground';

export function Landing() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Enhanced Three.js 3D Background */}
      <ThreeBackground />
      
      {/* Unique Grid Pattern Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Asymmetric Accent Elements */}
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-400/10 dark:via-purple-400/10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-slate-500/5 via-transparent to-transparent dark:from-slate-700/10 pointer-events-none" />

      {/* Navigation - Minimalist Design */}
      <nav className="sticky top-0 z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-slate-900/5 dark:border-white/5">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-20">
            <FadeIn direction="left" duration={0.6}>
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-11 h-11 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow rotate-3 group-hover:rotate-6 transition-transform duration-300">
                    <Sparkles className="w-5 h-5 text-white dark:text-slate-900" />
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    BuySmart
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase">
                    AI Intelligence
                  </span>
                </div>
              </Link>
            </FadeIn>
            <FadeIn direction="right" duration={0.6} delay={0.2}>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </button>
                <Link
                  to="/login"
                  className="hidden sm:block text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors px-5 py-2 text-sm"
                >
                  Sign in
                </Link>
                <Link to="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm">
                  Get Started →
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Layout */}
      <section className="container mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <FadeIn delay={0.2}>
              <div className="inline-flex items-center gap-2.5 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full mb-8 border border-slate-200 dark:border-slate-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
                  Powered by AI
                </span>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3} duration={0.8}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.05]">
                Stop guessing.
                <br />
                <span className="text-slate-400 dark:text-slate-600">Start</span>{' '}
                <span className="relative inline-block">
                  knowing
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C40 3 160 3 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-blue-500" />
                  </svg>
                </span>
                .
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.5} duration={0.8}>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg">
                AI that analyzes thousands of reviews in seconds. Get brutally honest insights, catch fake reviews, and shop with confidence.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.7} duration={0.6}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
                <Link 
                  to="/register" 
                  className="group inline-flex items-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl"
                >
                  Start Analyzing Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
              </div>
            </FadeIn>

            {/* Mini Stats */}
            <FadeIn delay={0.9}>
              <div className="flex items-center gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    <CountUp end={50} suffix="K+" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    <CountUp end={98} suffix="%" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    <CountUp end={15} suffix="K+" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Users</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Visual */}
          <FadeIn delay={0.4} duration={1}>
            <div className="relative lg:ml-auto">
              {/* Main Card */}
              <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">Product Analysis</div>
                      <div className="text-xs text-slate-500">Completed in 2.3s</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                    ✓ VERIFIED
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                      <span>Overall Score</span>
                      <span className="text-slate-900 dark:text-white font-bold">94/100</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">4.8</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Rating</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">1.2K</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Reviews</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      Recommended to Buy
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-6 py-3 rounded-2xl shadow-xl rotate-3 hover:rotate-6 transition-transform">
                <div className="text-xs font-semibold opacity-80">AI Powered</div>
                <div className="text-2xl font-bold">⚡</div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-slate-900 dark:bg-white rounded-3xl -z-10 opacity-50 blur-2xl" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features - Bento Grid Layout */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need,
              <br />
              <span className="text-slate-400 dark:text-slate-600">nothing you don't</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Powerful features that help you make smarter buying decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <div className="lg:col-span-2 lg:row-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-10 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                AI-Powered Deep Analysis
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-lg">
                Our advanced machine learning models process thousands of data points in seconds, giving you comprehensive insights no human could match.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">2.3s</div>
                  <div className="text-sm text-slate-500">Avg. Analysis</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">50K+</div>
                  <div className="text-sm text-slate-500">Reviews/Day</div>
                </div>
              </div>
            </div>

            {/* Small Feature Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Fake Review Detection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                AI identifies suspicious patterns and filters out unreliable reviews
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Price Tracking
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitor price history and get alerts when prices drop
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Instant Reports
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get comprehensive analysis in under 30 seconds
              </p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 rounded-3xl p-8 text-white dark:text-slate-900 border border-slate-700 dark:border-slate-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
                  <p className="text-slate-300 dark:text-slate-600 text-sm">
                    Clear buy/not-buy guidance based on your preferences
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 dark:bg-slate-900/10 rounded-2xl">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/20 dark:bg-slate-900/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-sm font-semibold">85% Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Modern Timeline */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Three steps to <span className="text-slate-400 dark:text-slate-600">smarter shopping</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              From search to purchase decision in under 30 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
            
            {[
              {
                step: '01',
                title: 'Paste Product Link',
                description: 'Copy any product URL from Amazon, eBay, or major retailers',
                icon: <Target className="w-7 h-7" />,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '02',
                title: 'AI Analyzes',
                description: 'Machine learning processes reviews, ratings, and market data',
                icon: <Brain className="w-7 h-7" />,
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Get Report',
                description: 'Receive clear buy/skip recommendation with detailed insights',
                icon: <Award className="w-7 h-7" />,
                color: 'from-orange-500 to-red-500',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group hover:shadow-lg">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 left-8 px-4 py-1.5 bg-gradient-to-r ${item.color} text-white text-sm font-bold rounded-full shadow-lg`}>
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-6 mt-4 group-hover:scale-110 transition-transform text-white`}>
                    {item.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Card Stack Design */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by <span className="text-slate-400 dark:text-slate-600">15K+ shoppers</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Real stories from people making smarter purchases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Tech Enthusiast',
                comment: 'Saved me from a terrible phone purchase. The AI caught issues that weren\'t obvious in reviews. Worth every second.',
                rating: 5,
                avatar: 'SJ',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                name: 'Mike Chen',
                role: 'Frequent Shopper',
                comment: 'Finally, a tool that filters out fake reviews. The insights are incredibly detailed and actually useful.',
                rating: 5,
                avatar: 'MC',
                color: 'from-purple-500 to-pink-500',
              },
              {
                name: 'Emily Davis',
                role: 'Budget Conscious',
                comment: 'Price tracking helped me save $200 on a laptop. The waiting was worth it. This app pays for itself!',
                rating: 5,
                avatar: 'ED',
                color: 'from-orange-500 to-red-500',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg transition-all group"
              >
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Direct */}
      <section className="py-24">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="relative bg-slate-900 dark:bg-white rounded-[3rem] p-12 md:p-20 overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent dark:from-blue-400/10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-600/20 to-transparent dark:from-purple-400/10 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-bold text-white dark:text-slate-900 mb-6 leading-tight">
                Stop wasting money on wrong products
              </h2>
              <p className="text-xl text-slate-300 dark:text-slate-600 mb-10 leading-relaxed">
                Join 15,000+ smart shoppers who trust AI to guide their purchase decisions. Start analyzing products for free.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  Start Analyzing Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex flex-col gap-1 text-slate-400 dark:text-slate-500 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Free forever</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Footer - Minimalist */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white dark:text-slate-900" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">BuySmart</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
                AI-powered shopping intelligence for confident purchase decisions.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wide">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">&copy; 2026 BuySmart AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
