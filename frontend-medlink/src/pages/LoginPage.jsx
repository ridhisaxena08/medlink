import React, { useState } from 'react';
import { HeartPulse, Loader2, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMPTY = { name: '', phone: '', email: '', password: '' };

/** The login endpoint takes `phone` OR `email` - pick the key from the input. */
const asCredential = (value) =>
  value.includes('@') ? { email: value.toLowerCase() } : { phone: value };

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isRegister) {
        await register({
          name: form.name.trim(),
          phone: form.phone.trim(),
          password: form.password,
          role: 'patient',
          ...(form.email.trim() ? { email: form.email.trim() } : {}),
        });
      } else {
        const account = await login({ ...asCredential(form.phone.trim()), password: form.password });
        // Admin, doctor, ASHA, hospital and responder accounts have no screens
        // here - say so at the door instead of 403-ing on the first fetch.
        if (!['patient', 'admin', 'doctor'].includes(account.role)) {
          setError({
            message: `That is a ${account.role} account. Swasthya Setu is the patient app - sign in with a patient account.`,
          });
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Swasthya Setu</h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister ? 'Create your patient health account' : 'Sign in to your health account'}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4"
        >
          {isRegister && (
            <Field label="Full name">
              <input
                required
                minLength={2}
                value={form.name}
                onChange={set('name')}
                placeholder="Ridhi Saxena"
                className={inputClass}
              />
            </Field>
          )}

          <Field
            label={isRegister ? 'Mobile number' : 'Mobile number or email'}
            hint={
              isRegister
                ? 'Include the country code, e.g. +919876543210'
                : 'Either works - whichever you registered with'
            }
          >
            <input
              required
              value={form.phone}
              onChange={set('phone')}
              placeholder={isRegister ? '+919876543210' : '+919876543210 or you@example.com'}
              className={inputClass}
            />
          </Field>

          {isRegister && (
            <Field label="Email" hint="Optional">
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className={inputClass}
              />
            </Field>
          )}

          <Field
            label="Password"
            hint={isRegister ? 'At least 8 characters, with a letter and a digit' : undefined}
          >
            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              className={inputClass}
            />
          </Field>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3 py-2">
              <p className="text-xs font-semibold text-rose-700">{error.message}</p>
              {error.fieldMessages?.length > 0 && (
                <ul className="text-[11px] text-rose-600 mt-1 space-y-0.5">
                  {error.fieldMessages.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isRegister ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isRegister ? 'Create account' : 'Sign in'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? 'login' : 'register');
              setError(null);
            }}
            className="w-full text-xs text-slate-500 hover:text-blue-600 font-medium"
          >
            {isRegister ? 'Already registered? Sign in' : 'New here? Create an account'}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all';

function Field({ label, hint, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{label}</span>
      {children}
      {hint && <span className="block text-[10px] text-slate-400">{hint}</span>}
    </label>
  );
}
