import React from 'react';
import { useWasteManagement } from '../../context/WasteManagementContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWasteManagement();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md transition-all animate-in slide-in-from-bottom duration-200 ${
              isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-500/40 shadow-emerald-950/20'
                : isWarning
                ? 'bg-amber-900/95 text-white border-amber-500/40 shadow-amber-950/20'
                : isError
                ? 'bg-red-900/95 text-white border-red-500/40 shadow-red-950/20'
                : 'bg-gray-900/95 text-white border-gray-700/60 shadow-gray-950/20'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-300" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-300" />}
              {!isSuccess && !isWarning && !isError && (
                <Info className="w-4 h-4 text-blue-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>
              <p className="text-[11px] text-gray-200 mt-0.5 leading-snug line-clamp-2">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 -mr-1 -mt-1 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
