import React from 'react';
import { CalendarCheck, CalendarDays, ClipboardList, Clock, Star, Stethoscope } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import StatCard from '../../components/features/appointments/StatCard';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { doctorSelf } from '../../lib/api';
import { avatarFor, titleCase } from '../../lib/adapters';

export default function DoctorDashboardPage({ onNavigate }) {
  const { data, error, loading, reload } = useAsync(() => doctorSelf.dashboard(), []);

  if (loading) return <Spinner label="Loading your clinic..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const today = data.today || {};
  const stats = [
    {
      label: 'Today',
      value: today.total ?? 0,
      change: `${today.completed ?? 0} completed`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: CalendarDays,
    },
    {
      label: 'Awaiting approval',
      value: data.pendingRequests ?? 0,
      change: 'Patient requests',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: ClipboardList,
    },
    {
      label: 'Upcoming',
      value: data.upcomingCount ?? 0,
      change: 'After today',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: CalendarCheck,
    },
    {
      label: 'Consultations',
      value: data.consultationsThisWeek ?? 0,
      change: 'Last 7 days',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: Stethoscope,
    },
  ];

  const profile = data.profile || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clinic Overview"
        description="Today's schedule, requests waiting on you, and your verification status."
        badgeText={titleCase(profile.verificationStatus || 'unknown')}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {data.pendingRequests > 0 && (
        <button
          onClick={() => onNavigate('appointments')}
          className="w-full flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 hover:bg-amber-100/70 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {data.pendingRequests} appointment request
                {data.pendingRequests === 1 ? '' : 's'} waiting
              </p>
              <p className="text-xs text-amber-700">
                Patients cannot attend until you confirm the slot.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 shrink-0">Review →</span>
        </button>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Today's schedule</h3>
          {(today.appointments || []).length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Nothing booked today"
              description="Confirmed visits for today will appear here with patient contact details."
            />
          ) : (
            today.appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={avatarFor(appt.patient?.name || 'Patient')}
                    alt=""
                    className="w-10 h-10 rounded-xl shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {appt.patient?.name || 'Patient'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {appt.reason} · {appt.patient?.phone}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3 text-blue-500" />
                    {new Date(appt.scheduledStart).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </p>
                  <span className="text-[10px] font-semibold text-slate-500">
                    {titleCase(appt.status)} · {appt.mode === 'teleconsult' ? 'Video' : 'In-clinic'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 self-start">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Star className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Your practice</h3>
          </div>
          <Row label="Verification" value={titleCase(profile.verificationStatus || '--')} />
          <Row
            label="Accepting patients"
            value={profile.acceptingNewPatients ? 'Yes' : 'No'}
            warn={!profile.acceptingNewPatients}
          />
          <Row label="Rating" value={`${profile.rating?.average ?? 0} (${profile.rating?.count ?? 0})`} />
          <Row label="Unread notifications" value={data.unreadNotifications ?? 0} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, warn }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={`font-bold ${warn ? 'text-amber-600' : 'text-slate-900'}`}>{value}</span>
    </div>
  );
}
