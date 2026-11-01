import React, { useState } from 'react';
import { CalendarDays, Check, Loader2, X } from 'lucide-react';
import { useAsync } from '../../../hooks/useAsync';
import { appointments, doctors as doctorsApi } from '../../../lib/api';
import { ErrorState, Spinner } from '../../ui/States';

const todayISO = () => new Date().toISOString().slice(0, 10);

/** Books into a slot the doctor has actually published for the chosen day. */
export default function BookingModal({ doctor, onClose, onBooked }) {
  const [date, setDate] = useState(todayISO());
  const [mode, setMode] = useState('');
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { data, error, loading, reload } = useAsync(
    () => doctorsApi.slots(doctor.id, date, mode || undefined),
    [date, mode],
  );

  const slots = data?.slots || [];
  const openSlots = slots.filter((s) => s.available);

  const confirm = async () => {
    if (!selected || reason.trim().length < 3) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await appointments.book({
        doctor: doctor.id,
        scheduledStart: selected.start,
        mode: selected.mode,
        reason: reason.trim(),
      });
      onBooked?.();
    } catch (err) {
      setSubmitError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-2xl" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{doctor.name}</h3>
            <p className="text-xs text-blue-600 font-semibold">{doctor.specialty}</p>
            <p className="text-[11px] text-slate-400">{doctor.fee} consultation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Date</span>
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => {
                setDate(e.target.value);
                setSelected(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Mode</span>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setSelected(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none"
            >
              <option value="">Any</option>
              <option value="in_person">In-clinic</option>
              <option value="teleconsult">Video</option>
            </select>
          </label>
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            Available slots
          </p>
          {loading ? (
            <Spinner label="Checking availability..." />
          ) : error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : openSlots.length === 0 ? (
            <div className="text-center py-6 px-3 bg-slate-50 rounded-xl border border-slate-200">
              <CalendarDays className="w-5 h-5 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">
                No open slots on this date. This doctor may not have published availability yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {openSlots.map((slot) => {
                const label = new Date(slot.start).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });
                const isSelected = selected?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    onClick={() => setSelected(slot)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <label className="block space-y-1.5 mb-4">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Reason for visit
          </span>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Chest pain for three days"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 outline-none resize-none"
          />
          <span className="block text-[10px] text-slate-400">At least 3 characters.</span>
        </label>

        {submitError && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 mb-3">
            <p className="text-xs font-semibold text-rose-700">{submitError.message}</p>
          </div>
        )}

        <button
          onClick={confirm}
          disabled={!selected || reason.trim().length < 3 || submitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Confirm booking
        </button>
      </div>
    </div>
  );
}
