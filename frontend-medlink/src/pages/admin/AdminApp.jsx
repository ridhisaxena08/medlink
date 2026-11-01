import React, { useState } from 'react';
import { ClipboardCheck, LayoutDashboard, LogOut, ScrollText, Users } from 'lucide-react';
import AdminDashboardPage from './AdminDashboardPage';
import VerificationQueuePage from './VerificationQueuePage';
import UsersPage from './UsersPage';
import AdminAuditPage from './AdminAuditPage';
import { useAuth } from '../../context/AuthContext';
import { avatarFor } from '../../lib/adapters';

const TABS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'verifications', label: 'Verifications', icon: ClipboardCheck },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'audit', label: 'Audit log', icon: ScrollText },
];

/** Admin surface - separate from the patient app, same API client and session. */
export default function AdminApp() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('dashboard');

  const render = () => {
    switch (tab) {
      case 'verifications':
        return <VerificationQueuePage />;
      case 'users':
        return <UsersPage />;
      case 'audit':
        return <AdminAuditPage />;
      default:
        return <AdminDashboardPage onNavigate={setTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black">
            MS
          </div>
          <div className="leading-none">
            <p className="text-sm font-black text-slate-900 tracking-tight">MedLink360</p>
            <span className="text-[10px] font-semibold text-slate-400">Admin console</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                tab === id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-2.5 px-2">
            <img src={avatarFor(user?.name || 'Admin')} alt="" className="w-8 h-8 rounded-full" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
              <span className="text-[10px] text-slate-400">{user?.phone}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold rounded-xl transition-colors"
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
