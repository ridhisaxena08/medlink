import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Loader2, Lock, PhoneCall, User } from 'lucide-react';
import Button from '../../ui/Button';
import { auth, emergency, patients, users } from '../../../lib/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const inputClass =
  'w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-400 focus:bg-white outline-none transition-all';

export default function SettingsAccordion({ profile, onSaved }) {
  const [openSection, setOpenSection] = useState('personal');
  const toggle = (section) => setOpenSection(openSection === section ? '' : section);

  return (
    <div className="space-y-3">
      <Section
        id="personal"
        openSection={openSection}
        onToggle={toggle}
        icon={User}
        iconClass="text-blue-600"
        title="Personal Identification & ABDM Profile"
      >
        <PersonalForm profile={profile} onSaved={onSaved} />
      </Section>

      <Section
        id="emergency"
        openSection={openSection}
        onToggle={toggle}
        icon={PhoneCall}
        iconClass="text-rose-600"
        title="Emergency Contact & SOS Dispatch"
      >
        <EmergencyForm />
      </Section>

      <Section
        id="security"
        openSection={openSection}
        onToggle={toggle}
        icon={Lock}
        iconClass="text-emerald-600"
        title="Password & Health Data Privacy"
      >
        <SecurityForm />
      </Section>
    </div>
  );
}

function Section({ id, openSection, onToggle, icon: Icon, iconClass, title, children }) {
  const isOpen = openSection === id;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-800 text-sm hover:bg-slate-50"
      >
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${iconClass}`} />
          <span>{title}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="p-4 pt-3 border-t border-slate-100 space-y-3">{children}</div>}
    </div>
  );
}

/** Name/email live on the user record; the clinical fields on the patient profile. */
function PersonalForm({ profile, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', dateOfBirth: '', gender: '', bloodGroup: '', district: '', state: '' });
  const [status, setStatus] = useState({ busy: false, saved: false, error: null });

  useEffect(() => {
    patients
      .me()
      .then((p) =>
        setForm({
          name: profile.name !== 'Your account' ? profile.name : '',
          email: profile.email !== 'Not added' ? profile.email : '',
          dateOfBirth: p?.dateOfBirth ? String(p.dateOfBirth).slice(0, 10) : '',
          gender: p?.gender || '',
          bloodGroup: p?.bloodGroup || '',
          district: p?.address?.district || '',
          state: p?.address?.state || '',
        }),
      )
      .catch(() => {});
  }, [profile.name, profile.email]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setStatus({ busy: true, saved: false, error: null });
    try {
      const account = await users.me();
      const userPatch = {};
      if (form.name.trim() && form.name.trim() !== account.name) userPatch.name = form.name.trim();
      if (form.email.trim() && form.email.trim() !== account.email) userPatch.email = form.email.trim();
      const updated = Object.keys(userPatch).length ? await users.updateMe(userPatch) : account;

      const profilePatch = {};
      if (form.dateOfBirth) profilePatch.dateOfBirth = form.dateOfBirth;
      if (form.gender) profilePatch.gender = form.gender;
      if (form.bloodGroup) profilePatch.bloodGroup = form.bloodGroup;
      if (form.district || form.state) {
        profilePatch.address = { district: form.district || undefined, state: form.state || undefined };
      }
      if (Object.keys(profilePatch).length) await patients.updateMe(profilePatch);

      setStatus({ busy: false, saved: true, error: null });
      setTimeout(() => setStatus((s) => ({ ...s, saved: false })), 2500);
      onSaved?.(updated);
    } catch (err) {
      setStatus({ busy: false, saved: false, error: err.message });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Labelled label="Full legal name">
          <input value={form.name} onChange={set('name')} className={inputClass} />
        </Labelled>
        <Labelled label="Email">
          <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
        </Labelled>
        <Labelled label="Date of birth">
          <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className={inputClass} />
        </Labelled>
        <Labelled label="Gender">
          <select value={form.gender} onChange={set('gender')} className={inputClass}>
            <option value="">Not set</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="undisclosed">Prefer not to say</option>
          </select>
        </Labelled>
        <Labelled label="Blood group">
          <select value={form.bloodGroup} onChange={set('bloodGroup')} className={inputClass}>
            <option value="">Not set</option>
            {BLOOD_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Labelled>
        <Labelled label="District">
          <input value={form.district} onChange={set('district')} className={inputClass} />
        </Labelled>
        <Labelled label="State">
          <input value={form.state} onChange={set('state')} className={inputClass} />
        </Labelled>
      </div>
      <SaveBar status={status} onSave={save} label="Save changes" />
    </>
  );
}

function EmergencyForm() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [status, setStatus] = useState({ busy: false, saved: false, error: null });

  const load = () => emergency.contacts().then(setContacts).catch(() => {});
  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setStatus({ busy: true, saved: false, error: null });
    try {
      await emergency.addContact({
        name: form.name.trim(),
        phone: form.phone.trim(),
        relationship: form.relationship.trim(),
        isPrimary: contacts.length === 0,
      });
      setForm({ name: '', phone: '', relationship: '' });
      setStatus({ busy: false, saved: true, error: null });
      setTimeout(() => setStatus((s) => ({ ...s, saved: false })), 2500);
      load();
    } catch (err) {
      setStatus({ busy: false, saved: false, error: err.message });
    }
  };

  return (
    <>
      {contacts.length > 0 && (
        <ul className="space-y-1.5">
          {contacts.map((c) => (
            <li
              key={c._id}
              className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs"
            >
              <span className="font-semibold text-slate-700">
                {c.name} <span className="text-slate-400 font-normal">({c.relationship})</span>
              </span>
              <span className="text-slate-500">{c.phone}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Labelled label="Name">
          <input value={form.name} onChange={set('name')} placeholder="Sunita Sharma" className={inputClass} />
        </Labelled>
        <Labelled label="Phone">
          <input value={form.phone} onChange={set('phone')} placeholder="+919811122334" className={inputClass} />
        </Labelled>
        <Labelled label="Relationship">
          <input value={form.relationship} onChange={set('relationship')} placeholder="Spouse" className={inputClass} />
        </Labelled>
      </div>
      <SaveBar
        status={status}
        onSave={save}
        label="Add contact"
        disabled={!form.name.trim() || !form.phone.trim() || !form.relationship.trim()}
      />
    </>
  );
}

function SecurityForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [status, setStatus] = useState({ busy: false, saved: false, error: null });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setStatus({ busy: true, saved: false, error: null });
    try {
      await auth.changePassword(form);
      setForm({ currentPassword: '', newPassword: '' });
      setStatus({ busy: false, saved: true, error: null });
    } catch (err) {
      setStatus({ busy: false, saved: false, error: err.message });
    }
  };

  return (
    <>
      <p className="text-xs text-slate-600">
        Every read of your records is written to the audit trail, visible on the home screen.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Labelled label="Current password">
          <input type="password" value={form.currentPassword} onChange={set('currentPassword')} className={inputClass} />
        </Labelled>
        <Labelled label="New password">
          <input type="password" value={form.newPassword} onChange={set('newPassword')} className={inputClass} />
        </Labelled>
      </div>
      {status.saved && (
        <p className="text-[11px] text-emerald-600 font-semibold">
          Password updated. You will be asked to sign in again.
        </p>
      )}
      <SaveBar
        status={{ ...status, saved: false }}
        onSave={save}
        label="Change password"
        disabled={!form.currentPassword || form.newPassword.length < 8}
      />
    </>
  );
}

function Labelled({ label, children }) {
  return (
    <div>
      <label className="text-xs text-slate-500 font-medium block mb-1">{label}</label>
      {children}
    </div>
  );
}

function SaveBar({ status, onSave, label, disabled }) {
  return (
    <div className="space-y-1.5">
      <Button
        size="sm"
        variant="primary"
        onClick={onSave}
        disabled={status.busy || disabled}
        className="text-xs"
      >
        {status.busy ? (
          <span className="flex items-center gap-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving
          </span>
        ) : status.saved ? (
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        ) : (
          label
        )}
      </Button>
      {status.error && <p className="text-[11px] text-rose-600 font-medium">{status.error}</p>}
    </div>
  );
}
