import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function DoctorSearchBar({
  searchTerm,
  onSearchChange,
  activeFilterPill,
  onSelectPill,
  resultCount = 0,
}) {
  const pills = ['All', 'Top Rated (4.8+)', 'Under ₹1200', 'Video Consult Available'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search doctor by name, symptom or condition..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500 font-medium shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Showing <strong className="text-slate-800">{resultCount}</strong> doctors</span>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {pills.map((pill) => {
          const isActive = activeFilterPill === pill;
          return (
            <button
              key={pill}
              onClick={() => onSelectPill(pill)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>
    </div>
  );
}

