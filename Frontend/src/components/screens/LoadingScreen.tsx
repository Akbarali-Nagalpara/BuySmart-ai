import { useEffect, useState } from 'react';
import { Cpu, Database, MessageSquare, BarChart3, CheckCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Step {
  id: number;
  label: string;
  message: string;
  icon: typeof Sparkles;
}

const steps: Step[] = [
  {
    id: 1,
    label: 'Collecting Product Data',
    message: 'Aggregating information from multiple e-commerce sources...',
    icon: Database,
  },
  {
    id: 2,
    label: 'Analyzing Customer Reviews',
    message: 'Processing sentiment from 5000+ customer reviews...',
    icon: MessageSquare,
  },
  {
    id: 3,
    label: 'Running AI Models',
    message: 'Applying neural networks for pattern recognition...',
    icon: Cpu,
  },
  {
    id: 4,
    label: 'Generating Intelligence Report',
    message: 'Compiling AI-powered buy recommendation...',
    icon: BarChart3,
  },
];

export function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0a0e1a] via-[#131824] to-[#0f1419] flex items-center justify-center overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Scan line effect */}
      <div className="scanline opacity-10" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-float delay-1000" />

      <div className="max-w-3xl w-full mx-auto px-4 relative z-10">
        {/* AI Core Animation */}
        <div className="text-center mb-12 animate-scale-in">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
            {/* Rotating rings */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-4 border-purple-500/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-4 border-cyan-500/50 animate-spin" style={{ animationDuration: '4s' }} />
            
            {/* Core */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center neon-glow-cyan animate-pulse">
              <Cpu className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            AI Analysis in Progress
          </h2>
          <p className="text-xl text-gray-400 font-medium">
            Neural networks processing your request...
          </p>
        </div>

        {/* Analysis Steps */}
        <div className="glass-effect rounded-3xl p-8 mb-8 border border-cyan-500/20 animate-slide-up delay-200">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <div
                  key={step.id}
                  className={`
                    flex items-start gap-5 p-6 rounded-2xl transition-all duration-500
                    ${isCurrent ? 'glass-effect-light border-2 border-cyan-500/50 scale-105 neon-glow-cyan' : ''}
                    ${isCompleted ? 'opacity-50 border border-green-500/30' : ''}
                    ${isPending ? 'opacity-30 border border-gray-700/30' : ''}
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-500 relative
                      ${isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-500 neon-glow-green' : 
                        isCurrent ? 'bg-gradient-to-br from-cyan-500 via-purple-500 to-cyan-500 animate-pulse neon-glow-cyan' : 
                        'bg-gray-800 border border-gray-700'}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8 text-white" />
                    ) : (
                      <Icon className="w-8 h-8 text-white" />
                    )}
                    
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-xl border-2 border-cyan-400 animate-ping" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className={`
                        font-bold text-xl mb-2 transition-colors duration-500
                        ${isCurrent ? 'text-cyan-400' : 
                          isCompleted ? 'text-green-400' : 
                          'text-gray-500'}
                      `}
                    >
                      {step.label}
                    </h3>
                    <p className={`text-sm ${isCurrent ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                      {step.message}
                    </p>
                  </div>

                  {isCurrent && (
                    <div className="flex space-x-2 items-center">
                      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Progress</span>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-4 bg-gray-900/50 rounded-full overflow-hidden shadow-inner border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 glass-effect-light rounded-full border border-cyan-500/20">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <p className="text-sm text-gray-400 font-medium">
              Advanced ML algorithms analyzing market intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
