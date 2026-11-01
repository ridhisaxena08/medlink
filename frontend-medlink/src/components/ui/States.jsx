import React from 'react';
import { AlertTriangle, Inbox, Loader2, RefreshCw } from 'lucide-react';

export function Spinner({ label = 'Loading...', className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-10 text-slate-500 ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}

export function ErrorState({ error, onRetry, className = '' }) {
  const messages = error?.fieldMessages?.length ? error.fieldMessages : [];

  return (
    <div
      className={`bg-white rounded-2xl border border-rose-200 p-6 text-center space-y-3 ${className}`}
    >
      <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">Could not load this</h4>
        <p className="text-xs text-slate-500 mt-1">{error?.message || 'Something went wrong.'}</p>
        {messages.length > 0 && (
          <ul className="text-[11px] text-rose-600 mt-2 space-y-0.5">
            {messages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        )}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, description, action, icon: Icon = Inbox, className = '' }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 ${className}`}
    >
      <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        {description && <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>}
      </div>
      {action}
    </div>
  );
}
