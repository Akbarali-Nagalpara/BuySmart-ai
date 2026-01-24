import { motion } from 'framer-motion';

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Shimmer({ className = '', width = 'w-full', height = 'h-4' }: ShimmerProps) {
  return (
    <div className={`${width} ${height} bg-slate-200 dark:bg-slate-700 rounded overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full bg-gradient-to-r from-transparent via-white/40 dark:via-slate-600/40 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Shimmer width="w-24" height="h-4" />
        <Shimmer width="w-8" height="h-8" className="rounded-full" />
      </div>
      <Shimmer width="w-32" height="h-8" />
      <Shimmer width="w-20" height="h-3" />
    </div>
  );
}
