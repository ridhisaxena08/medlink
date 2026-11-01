import React, { useState } from 'react';
import { BadgeCheck, Check, Loader2, Phone, ShieldAlert, X } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { admin } from '../../lib/api';
import { avatarFor, formatShortDate, titleCase } from '../../lib/adapters';

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

const ROLES = [
  { value: '', label: 'All roles' },
  { value: 'doctor', label: 'Doctors' },
  { value: 'asha', label: 'ASHA workers' },
  { value: 'hospital', label: 'Hospitals' },
  { value: 'responder', label: 'Responders' },
];

export default function VerificationQueuePage() {
  const [status, setStatus] = useState('pending');
  const [role, setRole] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  const { data, error, loading, reload } = useAsync(
    () => admin.verifications({ status, role: role || undefined, limit: 100 }),
    [status, role],
  );

  const groups = (data?.groups || []).filter((g) => g.items.length > 0);
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  const decide = async (profile, groupRole, nextStatus) => {
    const name = profile.user?.name || 'this account';
    let reason;
    if (nextStatus === 'rejected') {
      reason = prompt(`Why is ${name} being rejected?`);
      if (reason === null) return;
    } else if (!confirm(`Verify ${name}? They will be able to accept patients immediately.`)) {
      return;
    }

    setBusyId(profile._id);
    try {
      // Verification takes the USER id and also flips the account to active.
      await admin.verify(profile.user._id, groupRole, nextStatus, reason || undefined);
      setNotice(`${name} ${nextStatus}.`);
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
        title="Verification Queue"
        description="Approve or reject doctor, ASHA, hospital and responder accounts. Only verified staff are discoverable by patients."
        badgeText={`${total} ${titleCase(status)}`}
      />

      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              status === s.value
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-400"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          {notice}
        </div>
      )}

      {loading ? (
        <Spinner label="Loading queue..." />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title={`Nothing ${status}`}
          description={
            status === 'pending'
              ? 'Every staff account has been reviewed. New registrations land here automatically.'
              : `No accounts currently have the ${status} status.`
          }
        />
      ) : (
        groups.map((group) => (
          <div key={group.role} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {titleCase(group.role)}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {group.items.length}
              </span>
            </h3>

            <div className="space-y-3">
              {group.items.map((profile) => (
                <ProfileCard
                  key={profile._id}
                  profile={profile}
                  role={group.role}
                  status={status}
                  busy={busyId === profile._id}
                  onDecide={decide}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ProfileCard({ profile, role, status, busy, onDecide }) {
  const user = profile.user || {};
  const name = user.name || 'Unnamed account';

  const facts = [
    profile.registrationNumber && ['Registration', profile.registrationNumber],
    profile.specialties?.length && ['Specialties', profile.specialties.join(', ')],
    profile.experienceYears !== undefined && ['Experience', `${profile.experienceYears} years`],
    profile.consultationFee !== undefined && ['Fee', `₹${profile.consultationFee}`],
    profile.ashaId && ['ASHA ID', profile.ashaId],
    profile.district && ['District', profile.district],
    profile.type && ['Type', titleCase(profile.type)],
    profile.responderType && ['Responder', titleCase(profile.responderType)],
    user.createdAt && ['Registered', formatShortDate(user.createdAt)],
  ].filter(Boolean);

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        busy ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div className="flex items-start gap-4 min-w-0">
        <img src={avatarFor(name)} alt={name} className="w-12 h-12 rounded-2xl shrink-0" />
        <div className="min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
              {titleCase(role)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {user.phone || '--'}
            </span>
            {user.email && <span className="truncate">{user.email}</span>}
          </div>
          <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-0.5">
            {facts.map(([label, value]) => (
              <div key={label} className="flex items-center gap-1">
                <dt className="font-semibold text-slate-400">{label}:</dt>
                <dd className="text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
          {profile.rejectionReason && status === 'rejected' && (
            <p className="text-[11px] text-rose-600 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              {profile.rejectionReason}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
        {busy && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
        {status !== 'verified' && (
          <button
            onClick={() => onDecide(profile, role, 'verified')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Verify
          </button>
        )}
        {status !== 'rejected' && (
          <button
            onClick={() => onDecide(profile, role, 'rejected')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
