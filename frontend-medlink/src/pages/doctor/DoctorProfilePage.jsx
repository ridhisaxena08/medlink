import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { ErrorState, Spinner } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { doctorSelf } from '../../lib/api';
import { titleCase } from '../../lib/adapters';

const inputClass =
  'w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white outline-none transition-all';

export default function DoctorProfilePage() {
  const { data, error, loading, reload } = useAsync(() => doctorSelf.profile(), []);
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ busy: false, saved: false, error: null });

  useEffect(() => {
    if (!data) return;
    setForm({
      specialties: (data.specialties || []).join(', '),
      experienceYears: data.experienceYears ?? 0,
      consultationFee: data.consultationFee ?? '',
      teleconsultFee: data.teleconsultFee ?? '',
      languages: (data.languages || []).join(', '),
      bio: data.bio || '',
      acceptingNewPatients: data.acceptingNewPatients ?? true,
      city: data.practiceLocation?.city || '',
      district: data.practiceLocation?.district || '',
      state: data.practiceLocation?.state || '',
    });
  }, [data]);

  if (loading || !form) return <Spinner label="Loading your profile..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));

  const save = async () => {
    setStatus({ busy: true, saved: false, error: null });
    try {
      const list = (value) => value.split(',').map((s) => s.trim()).filter(Boolean);
      const body = {
        specialties: list(form.specialties),
        languages: list(form.languages),
        experienceYears: Number(form.experienceYears),
        acceptingNewPatients: form.acceptingNewPatients,
        bio: form.bio || undefined,
      };
      if (form.consultationFee !== '') body.consultationFee = Number(form.consultationFee);
      if (form.teleconsultFee !== '') body.teleconsultFee = Number(form.teleconsultFee);
      if (form.city || form.district || form.state) {
        body.practiceLocation = {
          city: form.city || undefined,
          district: form.district || undefined,
          state: form.state || undefined,
        };
      }
      await doctorSelf.updateProfile(body);
      setStatus({ busy: false, saved: true, error: null });
      setTimeout(() => setStatus((s) => ({ ...s, saved: false })), 2500);
      await reload();
    } catch (err) {
      setStatus({ busy: false, saved: false, error: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Practice Profile"
        description="What patients see in search results. Registration number and verification are managed by an admin."
        badgeText={titleCase(data.verificationStatus || 'unknown')}
      />

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Specialties" hint="Comma separated">
            <input value={form.specialties} onChange={set('specialties')} className={inputClass} />
          </Field>
          <Field label="Languages" hint="Comma separated">
            <input value={form.languages} onChange={set('languages')} className={inputClass} />
          </Field>
          <Field label="Years of experience">
            <input
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={set('experienceYears')}
              className={inputClass}
            />
          </Field>
          <Field label="Registration number" hint="Admin-managed, read only">
            <input value={data.registrationNumber || '--'} readOnly className={`${inputClass} opacity-60`} />
          </Field>
          <Field label="In-clinic fee (₹)">
            <input
              type="number"
              min="0"
              value={form.consultationFee}
              onChange={set('consultationFee')}
              className={inputClass}
            />
          </Field>
          <Field label="Video consult fee (₹)">
            <input
              type="number"
              min="0"
              value={form.teleconsultFee}
              onChange={set('teleconsultFee')}
              className={inputClass}
            />
          </Field>
          <Field label="City">
            <input value={form.city} onChange={set('city')} className={inputClass} />
          </Field>
          <Field label="District">
            <input value={form.district} onChange={set('district')} className={inputClass} />
          </Field>
          <Field label="State">
            <input value={form.state} onChange={set('state')} className={inputClass} />
          </Field>
        </div>

        <Field label="Bio" hint="Shown on your profile card">
          <textarea rows={3} value={form.bio} onChange={set('bio')} className={`${inputClass} resize-none`} />
        </Field>

        <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs cursor-pointer">
          <div>
            <span className="font-bold text-slate-700">Accepting new patients</span>
            <p className="text-[11px] text-slate-500">
              Turning this off marks you offline in patient search.
            </p>
          </div>
          <input
            type="checkbox"
            checked={form.acceptingNewPatients}
            onChange={set('acceptingNewPatients')}
            className="w-4 h-4 rounded text-blue-600"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={status.busy}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-colors"
          >
            {status.busy ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : status.saved ? (
              <Check className="w-3.5 h-3.5" />
            ) : null}
            {status.saved ? 'Saved' : 'Save profile'}
          </button>
          {status.error && <p className="text-[11px] text-rose-600 font-medium">{status.error}</p>}
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="text-xs text-slate-500 font-medium block mb-1">
        {label}
        {hint && <span className="text-slate-400 font-normal"> · {hint}</span>}
      </label>
      {children}
    </div>
  );
}
