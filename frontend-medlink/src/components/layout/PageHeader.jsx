import React from 'react';
import Badge from '../ui/Badge';

export default function PageHeader({
  title,
  description,
  badgeText,
  badgeVariant = 'primary',
  children,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DCEBFF] via-[#EBF3FE] to-white border border-blue-100 p-6 shadow-xs mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-xl md:text-2xl font-extrabold text-[#0D2040] tracking-tight">{title}</h1>
            {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
          </div>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{description}</p>
        </div>
        {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
      </div>

      <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-blue-400/10 pointer-events-none blur-2xl" />
      <div className="absolute right-32 -top-8 w-24 h-24 rounded-full bg-indigo-300/15 pointer-events-none blur-xl" />
    </div>
  );
}

