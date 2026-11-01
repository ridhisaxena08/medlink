import React, { useState } from 'react';
import { CalendarClock, ClipboardList, LayoutDashboard, LogOut, Stethoscope } from 'lucide-react';
import DoctorDashboardPage from './DoctorDashboardPage';
import DoctorAppointmentsPage from './DoctorAppointmentsPage';
import DoctorAvailabilityPage from './DoctorAvailabilityPage';
import DoctorProfilePage from './DoctorProfilePage';
import { useAuth } from '../../context/AuthContext';
import { avatarFor } from '../../lib/adapters';

const TABS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: ClipboardList },
  { id: 'availability', label: 'Availability', icon: CalendarClock },
  { id: 'profile', label: 'Practice profile', icon: Stethoscope },
];

export default function DoctorApp() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');

  const render = () => {
    switch (tab) {
      case 'appointments':
        return <DoctorAppointmentsPage />;
      case 'availability':
        return <DoctorAvailabilityPage />;
      case 'profile':
        return <DoctorProfilePage />;
      default:
        return <DoctorDashboardPage onNavigate={setTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-60 bg-[#0D2040] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-black text-white tracking-tight">Swasthya Setu</p>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
              Doctor console
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab === id ? 'text-white' : 'text-slate-400'}`} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 px-2">
            <img src={avatarFor(user?.name || 'Doctor')} alt="" className="w-8 h-8 rounded-full" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <span className="text-[10px] text-slate-400">{user?.phone}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn min-w-0">
        {render()}
      </main>
    </div>
  );
}
