import { ReactNode, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40',
    secondary: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/30',
    outline: 'border-2 border-primary-600 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20',
    ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={cn(
        'relative rounded-xl font-semibold transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'overflow-hidden',
        variants[variant],
        sizes[size],
        className
      )}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Ripple effect overlay */}
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : null}
        {children}
      </span>
    </motion.button>
  );
}
