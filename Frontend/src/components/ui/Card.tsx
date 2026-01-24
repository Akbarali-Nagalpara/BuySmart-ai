import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:glass-effect rounded-3xl shadow-xl dark:shadow-2xl
        border border-gray-200 dark:border-cyan-500/20
        transition-all duration-500
        ${hover ? 'hover:shadow-2xl dark:hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:scale-[1.02] hover:border-gray-300 dark:hover:border-cyan-400/40 cursor-pointer hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
