import React from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  ShieldCheck,
  Siren,
  UserPlus,
  Users,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/features/appointments/StatCard';
import { ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { admin } from '../../lib/api';
import { titleCase } from '../../lib/adapters';

export default function AdminDashboardPage({ onNavigate }) {
  const { data, error, loading, reload } = useAsync(() => admin.dashboard(), []);

  if (loading) return <Spinner label="Loading platform metrics..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const pendingTotal = (data.verification?.pending || []).reduce((sum, p) => sum + p.count, 0);
  const totalUsers = (data.users?.byRoleAndStatus || []).reduce((sum, u) => sum + u.count, 0);

  const stats = [
    {
      label: 'Pending reviews',
      value: pendingTotal,
      change: 'Awaiting you',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: ClipboardCheck,
    },
    {
      label: 'Total users',
      value: totalUsers,
      change: `+${data.users?.newLast24h ?? 0} in 24h`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: Users,
    },
    {
      label: 'Appointments',
      value: data.activity?.appointmentsLast7d ?? 0,
      change: 'Last 7 days',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: CalendarDays,
    },
    {
      label: 'Open emergencies',
      value: data.emergency?.open ?? 0,
      change: `${data.emergency?.last7d ?? 0} in 7 days`,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      icon: Siren,
    },
  ];

  // Collapse the { role, status } aggregate into one row per role.
  const roleRows = Object.values(
    (data.users?.byRoleAndStatus || []).reduce((acc, entry) => {
      const { role, status } = entry._id;
      acc[role] = acc[role] || { role, total: 0, active: 0, pending: 0 };
      acc[role].total += entry.count;
      if (status === 'active') acc[role].active += entry.count;
      if (status === 'pending') acc[role].pending += entry.count;
      return acc;
    }, {}),
  ).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Overview"
        description="Account mix, verification backlog, clinical activity and access-control health across MedLink360."
        badgeText="Admin"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {pendingTotal > 0 && (
        <button
          onClick={() => onNavigate('verifications')}
          className="w-full flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100/70 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {pendingTotal} account{pendingTotal === 1 ? '' : 's'} waiting for review
              </p>
              <p className="text-xs text-amber-700">
                {(data.verification?.pending || [])
                  .filter((p) => p.count > 0)
                  .map((p) => `${p.count} ${p.role}`)
                  .join(', ')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 shrink-0">Review now →</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Accounts by role" icon={Users}>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold text-right">Active</th>
                <th className="pb-2 font-semibold text-right">Pending</th>
                <th className="pb-2 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {roleRows.map((row) => (
                <tr key={row.role} className="border-b border-slate-50 last:border-0">
                  <td className="py-2 font-semibold text-slate-700">{titleCase(row.role)}</td>
                  <td className="py-2 text-right text-emerald-600 font-semibold">{row.active}</td>
                  <td className="py-2 text-right text-amber-600 font-semibold">{row.pending}</td>
                  <td className="py-2 text-right text-slate-900 font-bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title="Privacy & access control" icon={ShieldCheck}>
          <dl className="space-y-2.5 text-xs">
            <Metric label="Active consents" value={data.privacy?.activeConsents ?? 0} />
            <Metric
              label="ASHA assignments expiring in 14 days"
              value={data.privacy?.ashaAssignmentsExpiringIn14Days ?? 0}
            />
            <Metric
              label="Access denials (7 days)"
              value={data.privacy?.accessDenialsLast7d ?? 0}
              warn={(data.privacy?.accessDenialsLast7d ?? 0) > 0}
            />
            <Metric label="Consultations (7 days)" value={data.activity?.consultationsLast7d ?? 0} />
            <Metric label="Verified medicines" value={data.catalogue?.verifiedMedicines ?? 0} />
          </dl>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
        <Icon className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value, warn }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className={`font-bold ${warn ? 'text-rose-600' : 'text-slate-900'}`}>{value}</dd>
    </div>
  );
}
