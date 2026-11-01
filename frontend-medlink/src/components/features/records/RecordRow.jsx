import React from 'react';
import { Download, Eye, FileText, Trash2 } from 'lucide-react';

const ICON_COLORS = {
  'Lab Reports': 'bg-purple-50 text-purple-600 border-purple-200',
  Scans: 'bg-amber-50 text-amber-600 border-amber-200',
  Prescriptions: 'bg-blue-50 text-blue-600 border-blue-200',
  Vaccines: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function RecordRow({ record, onDownload, onView, onDelete }) {
  const iconColors = ICON_COLORS[record.category] || 'bg-slate-50 text-slate-600 border-slate-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${iconColors}`}>
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-slate-900 truncate">{record.title}</h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
              {record.category}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
            <span>By {record.doctor}</span>
            <span>•</span>
            <span>{record.date}</span>
            <span>•</span>
            <span className="text-slate-400">{record.size}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          onClick={() => onView(record)}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5"
          title="Preview document"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">View</span>
        </button>

        <button
          onClick={() => onDownload(record)}
          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1.5"
          title="Download"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(record)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Remove from vault"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
