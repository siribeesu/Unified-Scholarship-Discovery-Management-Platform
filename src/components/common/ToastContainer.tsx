import React from 'react';
import { useApp } from '../../context';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div 
      role="region" 
      aria-label="Notifications" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => {
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
        let borderColor = 'border-blue-200';
        let bgIcon = 'bg-blue-50';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
          borderColor = 'border-emerald-200';
          bgIcon = 'bg-emerald-50';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
          borderColor = 'border-amber-200';
          bgIcon = 'bg-amber-50';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
          borderColor = 'border-rose-200';
          bgIcon = 'bg-rose-50';
        }

        return (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto bg-white border ${borderColor} rounded-xl shadow-lg p-3.5 flex items-start gap-3 transition-all transform translate-y-0 duration-200`}
          >
            <div className={`p-1.5 rounded-lg ${bgIcon}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label={`Dismiss notification: ${toast.title}`}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
