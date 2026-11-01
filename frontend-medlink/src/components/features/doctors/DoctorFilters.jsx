import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const DEFAULT_SPECIALTIES = ['All'];
const EXPERIENCES = ['All', '5+ Years', '10+ Years', '15+ Years'];

export default function DoctorFilters({
  selectedSpecialty, onSelectSpecialty, selectedExp, onSelectExp, onlyOnline, onToggleOnline, onReset,
  specialties = DEFAULT_SPECIALTIES,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Filters</h3>
        </div>
        <button onClick={onReset} className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1">
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Specialization</label>
        <div className="space-y-1">
          {specialties.map((spec) => (
            <label key={spec} className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-50 cursor-pointer">
              <input
                type="radio" name="spec" checked={selectedSpecialty === spec}
                onChange={() => onSelectSpecialty(spec)} className="text-blue-600 w-3.5 h-3.5"
              />
              <span className={selectedSpecialty === spec ? 'font-bold text-blue-600' : 'text-slate-600'}>{spec}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Experience</label>
        <div className="space-y-1">
          {EXPERIENCES.map((exp) => (
            <label key={exp} className="flex items-center gap-2 p-1.5 rounded-lg text-xs hover:bg-slate-50 cursor-pointer">
              <input
                type="radio" name="exp" checked={selectedExp === exp}
                onChange={() => onSelectExp(exp)} className="text-blue-600 w-3.5 h-3.5"
              />
              <span className={selectedExp === exp ? 'font-bold text-blue-600' : 'text-slate-600'}>{exp}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
          <span className="text-slate-700 font-semibold">Available Online Now</span>
          <input
            type="checkbox" checked={onlyOnline} onChange={(e) => onToggleOnline(e.target.checked)}
            className="rounded text-blue-600 w-4 h-4"
          />
        </label>
      </div>
    </div>
  );
}
