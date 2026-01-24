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
} from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { ScrollReveal } from '../animations/ScrollReveal';
import { CountUp } from '../animations/CountUp';
import { AnimatedButton } from '../ui/AnimatedButton';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../context/ThemeContext';

export function Landing() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden transition-colors">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-900/10 dark:to-pink-900/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-cyan-200/20 to-blue-200/20 dark:from-cyan-900/10 dark:to-blue-900/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="flex items-center justify-between h-20">
            <FadeIn direction="left" duration={0.6}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white dark:text-slate-900" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <span className="text-2xl font-extralight tracking-tight text-slate-900 dark:text-white">
                  BuySmart<span className="font-semibold">AI</span>
                </span>
              </div>
            </FadeIn>
            <FadeIn direction="right" duration={0.6} delay={0.2}>
              <div className="flex items-center gap-6">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  aria-label="Toggle theme"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-slate-700" />
                  )}
                </button>
                <Link
                  to="/login"
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors px-4 py-2"
                >
                  Login
                </Link>
                <Link to="/register" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg">
                  Get Started Free
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-8 lg:px-16 py-24 md:py-32 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <FadeIn delay={0.2}>
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-full mb-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">AI-Powered Shopping Intelligence</span>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.4} duration={0.8}>
            <h1 className="text-6xl md:text-8xl font-extralight tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
              Shop <span className="font-semibold">Smarter</span>{' '}<br/>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                Not Harder
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.6} duration={0.8}>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Let AI analyze thousands of reviews in seconds. Get honest recommendations,
              spot fake reviews, and make confident purchase decisions.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.8} duration={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/register" className="group relative inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-10 py-5 rounded-2xl font-semibold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-3xl">
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Analyzing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:scale-105 transition-all border-2 border-slate-200 dark:border-slate-700">
                <Brain className="w-5 h-5" />
                See How It Works
              </Link>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={1}>
            <div className="grid grid-cols-3 gap-12 mt-20 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-extralight text-slate-900 dark:text-white mb-2">
                  <CountUp end={50} suffix="K+" />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500 font-medium">Products Analyzed</div>
              </div>
              <div className="text-center border-x border-slate-200 dark:border-slate-800">
                <div className="text-5xl font-extralight text-slate-900 dark:text-white mb-2">
                  <CountUp end={98} suffix="%" />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500 font-medium">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extralight text-slate-900 dark:text-white mb-2">
                  <CountUp end={15} suffix="K+" />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500 font-medium">Happy Users</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extralight text-slate-900 dark:text-white mb-4">
              Why Choose <span className="font-semibold">BuySmart AI</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to make confident purchase decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning algorithms analyze millions of data points instantly',
                color: 'from-primary-500 to-primary-600',
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Smart Recommendations',
                description: 'Get personalized buy/not-buy recommendations based on comprehensive analysis',
                color: 'from-accent-500 to-accent-600',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Detailed Insights',
                description: 'Visual breakdowns of sentiment, features, reliability, and more',
                color: 'from-primary-600 to-accent-600',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Fake Review Detection',
                description: 'AI identifies suspicious reviews to give you authentic insights',
                color: 'from-orange-500 to-red-600',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Price Tracking',
                description: 'Monitor price history and get alerts on the best deals',
                color: 'from-accent-600 to-primary-600',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Instant Results',
                description: 'Get comprehensive analysis reports in under 30 seconds',
                color: 'from-yellow-500 to-amber-600',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-xl"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extralight text-slate-900 dark:text-white mb-4">
              <span className="font-semibold">Three Simple Steps</span> to Smarter Shopping
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Start making better purchase decisions in under 30 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Search Product',
                description: 'Enter the product name or paste a link from any e-commerce site',
                icon: <Target className="w-6 h-6" />,
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes reviews, ratings, features, and market trends',
                icon: <Brain className="w-6 h-6" />,
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Receive detailed reports with buy/not-buy recommendations',
                icon: <Award className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-700"></div>
                )}
                <div className="relative">
                  <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 mx-auto mb-6 shadow-lg">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extralight text-slate-900 dark:text-white mb-4">
              Loved by <span className="font-semibold">15,000+ Users</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join thousands of smart shoppers making better decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Tech Enthusiast',
                comment: 'BuySmart AI saved me from buying a phone with terrible battery life. The analysis was spot on!',
                rating: 5,
              },
              {
                name: 'Mike Chen',
                role: 'Online Shopper',
                comment: 'I love how it filters out fake reviews. Finally, honest product insights!',
                rating: 5,
              },
              {
                name: 'Emily Davis',
                role: 'Budget Conscious',
                comment: 'The price tracking feature helped me save $200 on a laptop. Absolutely worth it!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-lg">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="relative bg-slate-900 dark:bg-white rounded-3xl p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"></div>
            <div className="relative z-10">
              <h2 className="text-5xl font-extralight text-white dark:text-slate-900 mb-6">
                Ready to <span className="font-semibold">Transform</span> Your Shopping?
              </h2>
              <p className="text-xl text-slate-300 dark:text-slate-600 mb-10 max-w-2xl mx-auto">
                Join 15,000+ smart shoppers making confident purchase decisions with AI
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:scale-105 transition-all shadow-2xl"
              >
                Start Analyzing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-6">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 dark:bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-extralight text-xl">BuySmart<span className="font-semibold">AI</span></span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                AI-powered shopping intelligence for confident purchase decisions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 BuySmart AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
