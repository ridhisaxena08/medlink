import React, { useState } from 'react';
import { Bell, Check, ChevronDown, MapPin } from 'lucide-react';
import SearchInput from '../ui/SearchInput';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { notifications as notificationsApi } from '../../lib/api';
import { avatarFor, formatRelative } from '../../lib/adapters';

const LOCATIONS = ['New Delhi, NCR', 'Mumbai, MH', 'Bengaluru, KA', 'Hyderabad, TS'];

export default function Header({ onNavigateProfile, onGlobalSearch }) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [isLocOpen, setIsLocOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const { data, reload } = useAsync(() => notificationsApi.list({ limit: 8 }), []);
  const items = data || [];
  const unread = data?.meta?.unread ?? items.filter((n) => !n.readAt).length;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onGlobalSearch?.(e.target.value);
  };

  const markAll = async () => {
    try {
      await notificationsApi.markAllRead();
      await reload();
    } catch {
      /* non-critical */
    }
  };

  const displayName = user?.name || 'Your account';
  const shortId = user?._id ? user._id.slice(-8).toUpperCase() : '--------';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="w-80">
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          onClear={() => {
            setSearchTerm('');
            onGlobalSearch?.('');
          }}
          placeholder="Search doctors by name or specialty..."
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsLocOpen(!isLocOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{location}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          {isLocOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setLocation(loc);
                    setIsLocOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-blue-50 flex items-center justify-between"
                >
                  <span>{loc}</span>
                  {loc === location && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setIsBellOpen(!isBellOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>
          {isBellOpen && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAll} className="text-[11px] font-semibold text-blue-600 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              {items.length === 0 ? (
                <p className="px-3 py-6 text-xs text-slate-500 text-center">Nothing yet.</p>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {items.map((n) => (
                    <li
                      key={n._id}
                      className={`px-3 py-2 border-b border-slate-50 last:border-0 ${
                        n.readAt ? 'opacity-60' : ''
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                      {n.body && <p className="text-[11px] text-slate-500 truncate">{n.body}</p>}
                      <span className="text-[10px] text-slate-400">{formatRelative(n.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onNavigateProfile}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-full text-left"
        >
          <img
            src={avatarFor(displayName)}
            alt="Profile"
            className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-400"
          />
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">{displayName}</p>
            <span className="text-[10px] text-blue-600 font-medium">ABHA #{shortId}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
