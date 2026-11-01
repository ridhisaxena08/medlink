import React, { useState } from 'react';
import { Pill, CheckCircle2 } from 'lucide-react';
import ToggleSwitch from '../../ui/ToggleSwitch';
import { EmptyState } from '../../ui/States';
import { reminders as remindersApi } from '../../../lib/api';
import { adaptReminder } from '../../../lib/adapters';

export default function HomeReminders({ initial = [] }) {
  const [items, setItems] = useState(() => (initial || []).map(adaptReminder));
  const [pending, setPending] = useState(null);

  /** Optimistic flip, then PATCH /reminders/:id/adherence - roll back on failure. */
  const toggleReminder = async (item) => {
    const outcome = item.taken ? 'skipped' : 'taken';
    setPending(item.id);
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, taken: !i.taken } : i)));
    try {
      await remindersApi.recordAdherence(item.id, outcome);
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, taken: item.taken } : i)));
      alert(err.message);
    } finally {
      setPending(null);
    }
  };

  const completedCount = items.filter((i) => i.taken).length;
  const nextDue = items.find((i) => !i.taken)?.time;
  const compliance = items.find((i) => i.adherencePct !== null)?.adherencePct;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Medication Routine</h4>
            <p className="text-[11px] text-slate-500">Daily adherence tracker</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" />
          <span>
            {completedCount}/{items.length} Taken
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No active reminders"
          description="Medicine reminders appear once a prescription is added to your record."
          className="border-0 shadow-none p-6"
        />
      ) : (
        <>
          <div className="space-y-3 my-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  item.taken
                    ? 'bg-slate-50/70 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200/90 shadow-xs'
                } ${pending === item.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="min-w-0 pr-2">
                  <p
                    className={`text-xs font-bold truncate ${
                      item.taken ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span>{item.dosage}</span>
                    <span>•</span>
                    <span className="font-semibold text-blue-600">{item.time}</span>
                  </div>
                </div>
                <ToggleSwitch size="sm" checked={item.taken} onChange={() => toggleReminder(item)} />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{nextDue ? `Next dosage due at ${nextDue}` : 'All doses logged'}</span>
            {compliance !== null && compliance !== undefined && (
              <span className="text-emerald-600 font-medium">{compliance}% Compliance</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
