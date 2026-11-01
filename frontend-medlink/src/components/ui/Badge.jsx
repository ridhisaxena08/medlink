import React from 'react';

const VARIANTS = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-teal-50 text-teal-700 border-teal-200',
  online: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  offline: 'bg-slate-100 text-slate-500 border-slate-200',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
  urgent: 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse',
  primary: 'bg-blue-50 text-blue-700 border-blue-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const badgeStyle = VARIANTS[variant.toLowerCase()] || VARIANTS.default;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeStyle} ${className}`}>
      {variant.toLowerCase() === 'online' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
      )}
      {children}
    </span>
  );
}

