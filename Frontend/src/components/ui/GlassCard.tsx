import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = false,
  onClick,
}: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative backdrop-blur-xl bg-white/90 dark:bg-slate-900/70',
        'border border-primary-200/50 dark:border-slate-700/50',
        'rounded-2xl shadow-lg shadow-primary-500/10',
        'transition-all duration-300',
        hover && 'hover:shadow-2xl hover:shadow-primary-500/20 hover:scale-[1.02] hover:border-primary-300/70',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/40 via-white/50 to-accent-50/40 dark:from-slate-800/40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
