import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { CircularProgress } from '../ui/CircularProgress';
import { Tooltip } from '../ui/Tooltip';
import { Star, ThumbsUp, Shield, TrendingUp, Award } from 'lucide-react';
import { ScoreData } from '../../types';

interface ScoreBreakdownProps {
  scores: ScoreData;
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const metrics = [
    {
      label: 'Sentiment Score',
      value: scores.sentiment,
      icon: ThumbsUp,
      tooltip: 'Overall customer satisfaction based on review sentiment analysis',
      type: 'circular' as const,
    },
    {
      label: 'Feature Quality',
      value: scores.featureQuality,
      icon: Award,
      tooltip: 'Quality and performance of product features',
      type: 'bar' as const,
    },
    {
      label: 'Brand Reliability',
      value: scores.brandReliability,
      icon: Shield,
      tooltip: 'Brand reputation and product reliability score',
      type: 'bar' as const,
    },
    {
      label: 'Rating & Reviews',
      value: scores.ratingReview,
      icon: Star,
      tooltip: 'Aggregate score from ratings and review volume',
      type: 'bar' as const,
    },
    {
      label: 'Consistency Score',
      value: scores.consistency,
      icon: TrendingUp,
      tooltip: 'Product quality consistency across batches',
      type: 'bar' as const,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full" />
        <h2 className="text-3xl font-black text-white">Intelligence Breakdown</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-effect p-8 rounded-2xl flex flex-col items-center justify-center border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
          {metrics[0] && (() => {
            const Icon = metrics[0].icon;
            return (
              <>
                <Tooltip content={metrics[0].tooltip}>
                  <div className="flex flex-col items-center gap-4 mb-8 cursor-help group">
                    <div className="p-4 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl shadow-2xl neon-glow-cyan group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-white text-center">
                      {metrics[0].label}
                    </h3>
                  </div>
                </Tooltip>
                <CircularProgress value={metrics[0].value} />
              </>
            );
          })()}
        </div>

        <div className="lg:col-span-2 glass-effect p-8 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
          <div className="space-y-8">
            {metrics.slice(1).map((metric) => {
              const Icon = metric.icon;
              const getColor = (val: number) => {
                if (val >= 80) return 'text-green-400';
                if (val >= 60) return 'text-cyan-400';
                if (val >= 40) return 'text-yellow-400';
                return 'text-red-400';
              };
              return (
                <div key={metric.label} className="space-y-3 group">
                  <Tooltip content={metric.tooltip}>
                    <div className="flex items-center justify-between cursor-help">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-800 rounded-xl border border-gray-700 group-hover:scale-110 group-hover:border-cyan-500/50 transition-all">
                          <Icon className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <span className="font-bold text-lg text-white">
                          {metric.label}
                        </span>
                      </div>
                      <span className={`text-4xl font-black ${getColor(metric.value)}`}>
                        {metric.value}
                      </span>
                    </div>
                  </Tooltip>
                  <ProgressBar value={metric.value} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
