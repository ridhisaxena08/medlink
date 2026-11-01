import React, { useState } from 'react';
import { Check, CheckCheck, Clock, Loader2, MapPin, Phone, UserX, X } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { doctorSelf } from '../../lib/api';
import { avatarFor, formatAppointmentDate, titleCase } from '../../lib/adapters';

const FILTERS = [
  { value: 'requested', label: 'Requests' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: '', label: 'All' },
];

const STATUS_STYLES = {
  requested: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rescheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-slate-100 text-slate-600 border-slate-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  no_show: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function DoctorAppointmentsPage() {
  const [status, setStatus] = useState('requested');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  const { data, error, loading, reload } = useAsync(
    () => doctorSelf.appointments({ status: status || undefined, limit: 100 }),
    [status],
  );

  const list = data || [];

  const act = async (appointment, next) => {
    const name = appointment.patient?.name || 'this patient';
    let reason;
    if (next === 'rejected') {
      reason = prompt(`Why are you declining ${name}'s request?`);
      if (reason === null) return;
    } else if (!confirm(`Mark ${name}'s appointment as ${next.replace('_', ' ')}?`)) {
      return;
    }

    setBusyId(appointment._id);
    try {
      await doctorSelf.setAppointmentStatus(appointment._id, next, reason || undefined);
      setNotice(`${name}: ${next.replace('_', ' ')}.`);
      setTimeout(() => setNotice(null), 4000);
      await reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Confirm or decline incoming requests, then mark visits complete once the consultation is done."
        badgeText={`${list.length} ${status ? titleCase(status) : 'Total'}`}
      />

      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value || 'all'}
            onClick={() => setStatus(f.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              status === f.value
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      {loading ? (
        <Spinner label="Loading appointments..." />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : list.length === 0 ? (
        <EmptyState
          title={status === 'requested' ? 'No requests waiting' : 'Nothing here'}
          description={
            status === 'requested'
              ? 'New patient bookings land here as requests until you confirm them.'
              : 'Try a different filter.'
          }
        />
      ) : (
        <div className="space-y-3">
          {list.map((appt) => {
            const patient = appt.patient || {};
            const busy = busyId === appt._id;

            return (
              <div
                key={appt._id}
                className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  busy ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={avatarFor(patient.name || 'Patient')}
                    alt=""
                    className="w-12 h-12 rounded-2xl shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-sm">{patient.name || 'Patient'}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          STATUS_STYLES[appt.status] || STATUS_STYLES.completed
                        }`}
                      >
                        {titleCase(appt.status)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{appt.reason}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-500" />
                        {formatAppointmentDate(appt.scheduledStart)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {appt.mode === 'teleconsult' ? 'Video consult' : 'In-clinic'}
                      </span>
                      {patient.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {patient.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
                  {busy && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}

                  {appt.status === 'requested' && (
                    <>
                      <Action onClick={() => act(appt, 'confirmed')} tone="emerald" icon={Check}>
                        Confirm
                      </Action>
                      <Action onClick={() => act(appt, 'rejected')} tone="rose" icon={X}>
                        Decline
                      </Action>
                    </>
                  )}

                  {['confirmed', 'rescheduled'].includes(appt.status) && (
                    <>
                      <Action onClick={() => act(appt, 'completed')} tone="blue" icon={CheckCheck}>
                        Complete
                      </Action>
                      <Action onClick={() => act(appt, 'no_show')} tone="slate" icon={UserX}>
                        No show
                      </Action>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const TONES = {
  emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
  rose: 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50',
  slate: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
};

function Action({ onClick, tone, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors ${TONES[tone]}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {children}
    </button>
  );
}
