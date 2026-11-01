import React, { useState } from 'react';
import { ScrollText } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { admin } from '../../lib/api';
import { formatRelative, titleCase } from '../../lib/adapters';

const OUTCOMES = ['', 'success', 'denied', 'failure'];
const OUTCOME_STYLES = {
  success: 'bg-emerald-50 text-emerald-700',
  denied: 'bg-amber-50 text-amber-700',
  failure: 'bg-rose-50 text-rose-700',
};

export default function AdminAuditPage() {
  const [outcome, setOutcome] = useState('');
  const { data, error, loading, reload } = useAsync(
    () => admin.auditLogs({ outcome: outcome || undefined, limit: 100 }),
    [outcome],
  );

  const logs = data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Audit Log"
        description="Every read, write and denied access across all patients, with the actor who performed it."
        badgeText={`${logs.length} Entries`}
      />

      <div className="flex items-center gap-2">
        {OUTCOMES.map((o) => (
          <button
            key={o || 'all'}
            onClick={() => setOutcome(o)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              outcome === o
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {o ? titleCase(o) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading audit trail..." />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No entries" description="Nothing matches this filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-xs min-w-[640px]">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="p-3 font-semibold">Actor</th>
                <th className="p-3 font-semibold">Action</th>
                <th className="p-3 font-semibold">Resource</th>
                <th className="p-3 font-semibold">Outcome</th>
                <th className="p-3 font-semibold text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b border-slate-50 last:border-0">
                  <td className="p-3">
                    <span className="font-semibold text-slate-800">{log.actor?.name || 'System'}</span>
                    {log.actorRole && (
                      <span className="text-slate-400"> · {titleCase(log.actorRole)}</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-700">{titleCase(log.action)}</td>
                  <td className="p-3 text-slate-500">{titleCase(log.resourceType)}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        OUTCOME_STYLES[log.outcome] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {titleCase(log.outcome)}
                    </span>
                    {log.reason && <span className="text-[10px] text-slate-400 ml-1.5">{log.reason}</span>}
                  </td>
                  <td className="p-3 text-right text-slate-400">{formatRelative(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
