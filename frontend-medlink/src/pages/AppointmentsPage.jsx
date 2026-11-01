import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, XCircle, Activity } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import StatCard from '../components/features/appointments/StatCard';
import AppointmentRow from '../components/features/appointments/AppointmentRow';
import RescheduleWidget from '../components/features/appointments/RescheduleWidget';
import { EmptyState, ErrorState, Spinner } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { appointments as appointmentsApi } from '../lib/api';
import { adaptAppointment } from '../lib/adapters';

export default function AppointmentsPage({ onNavigateDoctors }) {
  const [busyId, setBusyId] = useState(null);
  const { data, error, loading, reload } = useAsync(
    () => appointmentsApi.mine({ limit: 50 }),
    [],
  );

  const list = useMemo(() => (data || []).map(adaptAppointment), [data]);

  const stats = useMemo(() => {
    const count = (statuses) =>
      (data || []).filter((a) => statuses.includes(a.status)).length;
    return [
      {
        label: 'Upcoming',
        value: count(['requested', 'confirmed', 'rescheduled']),
        change: 'Scheduled',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        icon: CalendarDays,
      },
      {
        label: 'Completed',
        value: count(['completed']),
        change: 'All time',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        icon: CheckCircle2,
      },
      {
        label: 'Cancelled',
        value: count(['cancelled', 'rejected']),
        change: 'All time',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
        icon: XCircle,
      },
      {
        label: 'Total Visits',
        value: (data || []).length,
        change: 'Lifetime',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        icon: Activity,
      },
    ];
  }, [data]);

  const upcomingCount = stats[0].value;

  const handleCancel = async (id) => {
    const reason = prompt('Reason for cancelling (optional):');
    if (reason === null) return;
    setBusyId(id);
    try {
      await appointmentsApi.cancel(id, reason || undefined);
      await reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleReschedule = async (appointment) => {
    const input = prompt(
      'New date and time (YYYY-MM-DD HH:mm):',
      new Date(appointment.time).toISOString().slice(0, 16).replace('T', ' '),
    );
    if (!input) return;
    const scheduledStart = new Date(input.replace(' ', 'T'));
    if (Number.isNaN(scheduledStart.getTime())) {
      alert('Could not read that date. Use the format 2026-11-20 15:30');
      return;
    }
    setBusyId(appointment.id);
    try {
      await appointmentsApi.reschedule(appointment.id, {
        scheduledStart: scheduledStart.toISOString(),
      });
      await reload();
    } catch (err) {
      // 409 means the doctor has no published slot at that time.
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleJoin = (appointment) =>
    alert(
      appointment.mode === 'Video Consult'
        ? `Telehealth room for ${appointment.doctor} opens at ${appointment.date}.`
        : `In-clinic visit at ${appointment.hospital}.`,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consultation & Appointments"
        description="Review your upcoming clinical sessions, join encrypted tele-consultations, or reschedule visits."
        badgeText={`${upcomingCount} Upcoming`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Your Appointment Schedule</h3>
            <button
              onClick={onNavigateDoctors}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              + Book New Doctor
            </button>
          </div>

          {loading ? (
            <Spinner label="Loading appointments..." />
          ) : error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : list.length === 0 ? (
            <EmptyState
              title="No appointments yet"
              description="Book a consultation and it will show up here with join and reschedule controls."
              action={
                <button
                  onClick={onNavigateDoctors}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Browse specialists
                </button>
              }
            />
          ) : (
            <div className="space-y-3">
              {list.map((app) => (
                <div key={app.id} className={busyId === app.id ? 'opacity-50 pointer-events-none' : ''}>
                  <AppointmentRow
                    appointment={app}
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                    onJoin={handleJoin}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <RescheduleWidget onBrowseDoctors={onNavigateDoctors} />
        </div>
      </div>
    </div>
  );
}
