interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <Skeleton className="w-full h-48 mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-10 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-slate-200 dark:border-slate-700">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
