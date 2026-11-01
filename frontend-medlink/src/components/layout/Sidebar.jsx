import React from "react";
import {
  Home,
  Calendar,
  Stethoscope,
  FileText,
  Settings,
  HeartPulse,
} from "lucide-react";
import { useAsync } from "../../hooks/useAsync";
import { appointments } from "../../lib/api";
import EmergencyButton from "./EmergencyButton";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "doctors", label: "Find Doctors", icon: Stethoscope },
  { id: "records", label: "Medical Records", icon: FileText },
  { id: "profile", label: "Profile & Settings", icon: Settings },
];

export default function Sidebar({ activeTab, onSelectTab }) {
  // `upcoming=true` filters on date only, so cancelled and rejected visits are
  // still in the response - count the live ones here.
  const { data } = useAsync(
    () => appointments.mine({ upcoming: true, limit: 100 }),
    [],
  );
  const upcomingCount = (data || []).filter((a) =>
    ["requested", "confirmed", "rescheduled"].includes(a.status),
  ).length;

  return (
    <aside className="w-64 bg-[#0D2040] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <HeartPulse className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            Swasthya <span className="text-blue-400">Setu</span>
          </h1>
          <span className="text-[10px] font-medium text-emerald-400 tracking-wide uppercase">
            A BRIDGE TOWARDS HEALTH
          </span>
        </div>
      </div>

      <nav className="p-3 space-y-1.5 flex-1">
        <p className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onSelectTab(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`}
              />
              <span>{label}</span>
              {id === "appointments" && upcomingCount > 0 && (
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300">
                  {upcomingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 m-3 rounded-2xl bg-gradient-to-b from-slate-800/80 to-[#142A4D] border border-slate-700/60">
        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <span className="text-xs font-semibold text-rose-300">
            Emergency 24x7
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-3">
          Direct line to ambulance & emergency doctor triage.
        </p>
        <EmergencyButton />
      </div>
    </aside>
  );
}
