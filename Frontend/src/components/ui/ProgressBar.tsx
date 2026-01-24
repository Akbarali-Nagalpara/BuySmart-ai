interface ProgressBarProps {
  value: number;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({ value, className = '', animated = true }: ProgressBarProps) {
  const getColor = (val: number) => {
    if (val >= 80) return 'from-green-500 via-emerald-500 to-green-600';
    if (val >= 60) return 'from-blue-500 via-cyan-500 to-blue-600';
    if (val >= 40) return 'from-yellow-500 via-orange-500 to-yellow-600';
    return 'from-red-500 via-rose-500 to-red-600';
  };

  return (
    <div className={`w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner ${className}`}>
      <div
        className={`
          h-full bg-gradient-to-r ${getColor(value)}
          shadow-lg relative overflow-hidden
          ${animated ? 'transition-all duration-1000 ease-out' : ''}
        `}
        style={{ width: `${value}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
