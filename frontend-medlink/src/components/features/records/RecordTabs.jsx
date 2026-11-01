import React from 'react';

// Mirrors the category enum the upload endpoint accepts.
const CATEGORIES = [
  { id: 'All', label: 'All Files' },
  { id: 'Prescriptions', label: 'Prescriptions' },
  { id: 'Lab Reports', label: 'Lab Reports' },
  { id: 'Scans', label: 'Scans & X-Rays' },
  { id: 'Discharge', label: 'Discharge' },
  { id: 'Vaccines', label: 'Vaccines' },
  { id: 'Insurance', label: 'Insurance' },
  { id: 'Other', label: 'Other' },
];

export default function RecordTabs({ activeCategory, onSelectCategory, counts = {} }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200">
      {CATEGORIES.map(({ id, label }) => {
        const isActive = activeCategory === id;
        const count = counts[id] ?? 0;

        return (
          <button
            key={id}
            onClick={() => onSelectCategory(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-all ${
              isActive
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            <span>{label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

