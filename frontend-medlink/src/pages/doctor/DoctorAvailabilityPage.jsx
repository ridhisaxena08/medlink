import React, { useEffect, useState } from 'react';
import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { doctorSelf } from '../../lib/api';
import { titleCase } from '../../lib/adapters';

const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const inputClass =
  'px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white outline-none focus:border-blue-400';

const blankSlot = () => ({
  weekday: 'monday',
  startTime: '09:00',
  endTime: '17:00',
  slotDurationMinutes: 30,
  mode: 'in_person',
  isActive: true,
});

export default function DoctorAvailabilityPage() {
  const { data, error, loading, reload } = useAsync(() => doctorSelf.availability(), []);
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState({ busy: false, saved: false, error: null });

  useEffect(() => {
    if (data?.availability) {
      setRows(
        data.availability.map((a) => ({
          weekday: a.weekday,
          startTime: a.startTime,
          endTime: a.endTime,
          slotDurationMinutes: a.slotDurationMinutes,
          mode: a.mode,
          isActive: a.isActive,
        })),
      );
    }
  }, [data]);

  const update = (index, key, value) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));

  const save = async () => {
    setStatus({ busy: true, saved: false, error: null });
    try {
      await doctorSelf.setAvailability(rows);
      setStatus({ busy: false, saved: true, error: null });
      setTimeout(() => setStatus((s) => ({ ...s, saved: false })), 2500);
      await reload();
    } catch (err) {
      // The API rejects windows that do not divide evenly into slots.
      setStatus({ busy: false, saved: false, error: err.message });
    }
  };

  if (loading) return <Spinner label="Loading availability..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability"
        description="Your weekly template. Patients can only book inside these windows, split into slots of the length you choose."
        badgeText={`${rows.filter((r) => r.isActive).length} Active windows`}
      />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-xs min-w-[720px]">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="p-3 font-semibold">Day</th>
              <th className="p-3 font-semibold">From</th>
              <th className="p-3 font-semibold">To</th>
              <th className="p-3 font-semibold">Slot length</th>
              <th className="p-3 font-semibold">Mode</th>
              <th className="p-3 font-semibold">Active</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-500">
                  No windows yet. Add one below - without availability you cannot be booked.
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-slate-50 last:border-0">
                <td className="p-3">
                  <select
                    value={row.weekday}
                    onChange={(e) => update(i, 'weekday', e.target.value)}
                    className={inputClass}
                  >
                    {WEEKDAYS.map((d) => (
                      <option key={d} value={d}>
                        {titleCase(d)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="time"
                    value={row.startTime}
                    onChange={(e) => update(i, 'startTime', e.target.value)}
                    className={inputClass}
                  />
                </td>
                <td className="p-3">
                  <input
                    type="time"
                    value={row.endTime}
                    onChange={(e) => update(i, 'endTime', e.target.value)}
                    className={inputClass}
                  />
                </td>
                <td className="p-3">
                  <select
                    value={row.slotDurationMinutes}
                    onChange={(e) => update(i, 'slotDurationMinutes', Number(e.target.value))}
                    className={inputClass}
                  >
                    {[10, 15, 20, 30, 45, 60].map((m) => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <select
                    value={row.mode}
                    onChange={(e) => update(i, 'mode', e.target.value)}
                    className={inputClass}
                  >
                    <option value="in_person">In-clinic</option>
                    <option value="teleconsult">Video</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={row.isActive}
                    onChange={(e) => update(i, 'isActive', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove window"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setRows((prev) => [...prev, blankSlot()])}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add window
        </button>

        <button
          onClick={() =>
            setRows(WEEKDAYS.slice(0, 6).map((weekday) => ({ ...blankSlot(), weekday })))
          }
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
        >
          Fill Mon-Sat 09:00-17:00
        </button>

        <button
          onClick={save}
          disabled={status.busy}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors ml-auto"
        >
          {status.busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : status.saved ? (
            <Check className="w-3.5 h-3.5" />
          ) : null}
          {status.saved ? 'Saved' : 'Save availability'}
        </button>
      </div>

      {status.error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-semibold text-rose-700">
          {status.error}
        </div>
      )}

      <p className="text-[11px] text-slate-400">
        Each window must divide evenly into the slot length - 09:00 to 17:00 works with 30 minutes,
        but not with 45.
      </p>
    </div>
  );
}
