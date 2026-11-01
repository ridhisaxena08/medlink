import React from 'react';
import { CalendarDays } from 'lucide-react';

export default function StatCard({ label, value, change, color = 'text-blue-600', bg = 'bg-blue-50', icon: Icon = CalendarDays }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
          <span className="text-[11px] font-semibold text-slate-400">{change}</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

