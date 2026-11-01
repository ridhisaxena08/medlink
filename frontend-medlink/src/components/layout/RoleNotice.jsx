import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLE_LABELS = {
  doctor: 'doctor',
  asha: 'ASHA worker',
  hospital: 'hospital',
  responder: 'emergency responder',
  admin: 'platform admin',
};

/**
 * This client only implements the patient surface. Every other role has its own
 * endpoints, so signing in with one would 403 on the first dashboard call.
 */
export default function RoleNotice({ role }) {
  const { logout, user } = useAuth();
  const label = ROLE_LABELS[role] || role;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs max-w-sm w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">Wrong account type</h2>
          <p className="text-xs text-slate-500 mt-1.5">
            You are signed in as <strong className="text-slate-700">{user?.name}</strong>, a {label}{' '}
            account. Swasthya Setu is the patient app, so these screens have no data to show you.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-left">
          <p className="text-[11px] text-slate-500">
            Sign in with a patient account instead, or register a new one on the login screen.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
