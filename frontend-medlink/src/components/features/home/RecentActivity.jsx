import React from 'react';
import { History, Activity, Clock } from 'lucide-react';
import { Spinner } from '../../ui/States';
import { useAsync } from '../../../hooks/useAsync';
import { auditLogs } from '../../../lib/api';
import { adaptAuditLog } from '../../../lib/adapters';

export default function RecentActivity() {
  // Every read/write against this patient's data is journalled server-side.
  const { data, loading } = useAsync(() => auditLogs.list({ limit: 6 }), []);
  const activities = (data || []).map(adaptAuditLog);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900">Recent Health Activity</h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">ABDM Audit Log</span>
      </div>

      {loading ? (
        <Spinner label="Reading audit trail..." />
      ) : activities.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">No recorded activity yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-200 transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  act.outcome === 'success'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                <Activity className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{act.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {act.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
