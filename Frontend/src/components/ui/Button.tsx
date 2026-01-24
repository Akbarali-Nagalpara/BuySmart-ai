import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-cyan-500 dark:via-purple-500 dark:to-cyan-500 text-white dark:hover:from-cyan-400 dark:hover:via-purple-400 dark:hover:to-cyan-400 dark:neon-glow-cyan border border-blue-500/30 dark:border-cyan-400/30',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-700 dark:to-gray-800 text-white hover:from-gray-500 hover:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-500 dark:border-gray-600',
    outline: 'border-2 border-gray-300 dark:border-cyan-500/50 text-gray-700 dark:text-cyan-400 hover:bg-gray-100 dark:hover:bg-cyan-500/10 hover:border-gray-400 dark:hover:border-cyan-400 backdrop-blur-sm',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  return (
    <button
      className={`
        rounded-xl font-bold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-105 active:scale-95
        shadow-xl hover:shadow-2xl
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
