import { Card } from '../ui/Card';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ReviewInsights as ReviewInsightsType } from '../../types';

interface ReviewInsightsProps {
  insights: ReviewInsightsType;
  aiSummary: string;
}

export function ReviewInsights({ insights, aiSummary }: ReviewInsightsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 rounded-full" />
        <h2 className="text-3xl font-black text-gray-900 dark:text-white">AI-Generated Insights</h2>
      </div>

      <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-cyan-500/20 shadow-lg">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-600 dark:bg-cyan-400 rounded-full animate-pulse dark:neon-glow-cyan" />
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Executive Summary</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
            {aiSummary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-green-600 dark:border-green-400 hover:border-green-500 dark:hover:border-green-300 transition-all duration-300 dark:neon-glow-green shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-2xl dark:neon-glow-green">
              <ThumbsUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              Positive Signals
            </h3>
          </div>
          <ul className="space-y-4">
            {insights.positive.map((point, index) => (
              <li key={index} className="flex items-start gap-4 group">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg flex items-center justify-center text-sm font-bold mt-1 shadow-lg group-hover:scale-110 transition-transform dark:neon-glow-green">
                  ✓
                </span>
                <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-red-600 dark:border-red-400 hover:border-red-500 dark:hover:border-red-300 transition-all duration-300 dark:neon-glow-red shadow-lg">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl shadow-2xl dark:neon-glow-red">
              <ThumbsDown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              Warning Signals
            </h3>
          </div>
          <ul className="space-y-4">
            {insights.negative.map((point, index) => (
              <li key={index} className="flex items-start gap-4 group">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-lg flex items-center justify-center text-sm font-bold mt-1 shadow-lg group-hover:scale-110 transition-transform dark:neon-glow-red">
                  ✗
                </span>
                <span className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
