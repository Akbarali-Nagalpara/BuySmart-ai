interface BadgeProps {
  type: 'BUY' | 'NOT_BUY' | 'Low' | 'Medium' | 'High';
  className?: string;
}

export function Badge({ type, className = '' }: BadgeProps) {
  const styles = {
    BUY: 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white dark:neon-glow-green border border-green-400/50 shadow-xl',
    NOT_BUY: 'bg-gradient-to-r from-red-500 via-rose-500 to-red-600 text-white dark:neon-glow-red border border-red-400/50 shadow-xl',
    Low: 'bg-gradient-to-r from-red-500 to-red-600 text-white dark:neon-glow-red border border-red-400/50 shadow-xl',
    Medium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-xl border border-yellow-300/50',
    High: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white dark:neon-glow-green border border-green-400/50 shadow-xl',
  };

  return (
    <span
      className={`
        px-5 py-2.5 rounded-full font-black text-sm
        inline-flex items-center justify-center
        uppercase tracking-wide
        transition-all duration-300 hover:scale-110
        shadow-2xl
        ${styles[type]}
        ${className}
      `}
    >
      {type === 'BUY' && '✓ BUY'}
      {type === 'NOT_BUY' && '✗ NOT BUY'}
      {type !== 'BUY' && type !== 'NOT_BUY' && type}
    </span>
  );
}
