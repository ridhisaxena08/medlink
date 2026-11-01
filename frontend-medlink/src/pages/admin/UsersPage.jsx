import React, { useEffect, useState } from 'react';
import { Ban, CheckCircle2, Loader2, Search } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { admin } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { avatarFor, formatShortDate, titleCase } from '../../lib/adapters';

const ROLES = ['', 'patient', 'doctor', 'asha', 'hospital', 'responder', 'admin'];
const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  suspended: 'bg-rose-50 text-rose-700 border-rose-200',
  deactivated: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function UsersPage() {
  const { user: me } = useAuth();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [role, setRole] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data, error, loading, reload } = useAsync(
    () => admin.users({ q: debounced || undefined, role: role || undefined, limit: 100 }),
    [debounced, role],
  );

  const users = data || [];

  const setStatus = async (user, status) => {
    const verb = status === 'suspended' ? 'Suspend' : 'Reactivate';
    let reason;
    if (status === 'suspended') {
      reason = prompt(`Why is ${user.name} being suspended? (Their sessions end immediately.)`);
      if (reason === null) return;
    } else if (!confirm(`${verb} ${user.name}?`)) {
      return;
    }

    setBusyId(user._id);
    try {
      await admin.setUserStatus(user._id, status, reason || undefined);
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
        title="User Directory"
        description="Every account on the platform. Suspending an account revokes its sessions immediately."
        badgeText={`${users.length} Shown`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-400"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r ? titleCase(r) : 'All roles'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner label="Loading users..." />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : users.length === 0 ? (
        <EmptyState title="No users match" description="Try a different search term or role filter." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {users.map((user) => (
            <div
              key={user._id}
              className={`flex items-center justify-between gap-4 p-4 border-b border-slate-50 last:border-0 ${
                busyId === user._id ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={avatarFor(user.name)} alt={user.name} className="w-9 h-9 rounded-xl shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {titleCase(user.role)}
                    </span>
                    {user._id === me?._id && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {user.phone}
                    {user.email ? ` • ${user.email}` : ''} • joined {formatShortDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                    STATUS_STYLES[user.status] || STATUS_STYLES.deactivated
                  }`}
                >
                  {titleCase(user.status)}
                </span>

                {busyId === user._id && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}

                {/* The API rejects an admin changing their own status. */}
                {user._id !== me?._id &&
                  (user.status === 'suspended' ? (
                    <button
                      onClick={() => setStatus(user, 'active')}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Reactivate"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setStatus(user, 'suspended')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Suspend"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
