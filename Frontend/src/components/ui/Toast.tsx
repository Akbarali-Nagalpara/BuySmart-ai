import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 text-yellow-800 dark:text-yellow-200',
  };

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg
        animate-slide-in-right backdrop-blur-sm
        ${styles[type]}
      `}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
