import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function QuickActionCard({
  title,
  description,
  icon: Icon,
  badge,
  colorScheme = 'blue',
  onClick,
}) {
  const themes = {
    blue: { bg: 'bg-blue-50/70 hover:bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-600 text-white', text: 'text-blue-900' },
    emerald: { bg: 'bg-emerald-50/70 hover:bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-600 text-white', text: 'text-emerald-900' },
    indigo: { bg: 'bg-indigo-50/70 hover:bg-indigo-50', border: 'border-indigo-100', iconBg: 'bg-indigo-600 text-white', text: 'text-indigo-900' },
    amber: { bg: 'bg-amber-50/70 hover:bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-600 text-white', text: 'text-amber-900' },
  };

  const current = themes[colorScheme] || themes.blue;

  return (
    <div
      onClick={onClick}
      role="button"
      className={`group relative p-5 rounded-2xl border ${current.bg} ${current.border} transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${current.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs border border-slate-200">
              {badge}
            </span>
          )}
          <div className="w-8 h-8 rounded-full bg-white/80 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-slate-900 transition-colors shadow-xs">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`font-bold text-sm mb-1 ${current.text}`}>{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

