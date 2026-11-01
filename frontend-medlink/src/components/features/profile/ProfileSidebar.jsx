import React from 'react';
import { Droplet, Heart, LogOut, Mail, MapPin, Phone, QrCode, ShieldCheck } from 'lucide-react';
import Badge from '../../ui/Badge';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSidebar({ profile, onShowQR }) {
  const { logout } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="text-center">
        <div className="relative inline-block mb-3">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 mx-auto"
          />
          <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-xs">
            <div
              className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"
              title="Verified"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <h3 className="font-bold text-slate-900 text-lg">{profile.name}</h3>
        <p className="text-xs text-blue-600 font-semibold mb-2">ABHA ID: {profile.id}</p>
        <Badge variant="confirmed">ABDM Linked & Active</Badge>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
        <Row icon={Droplet} iconClass="text-rose-500" label="Blood Group" value={profile.bloodGroup} bold />
        <Row icon={Mail} iconClass="text-blue-500" label="Email" value={profile.email} truncate />
        <Row icon={Phone} iconClass="text-emerald-500" label="Mobile" value={profile.phone} />
        <Row icon={MapPin} iconClass="text-amber-500" label="Location" value={profile.city} />
      </div>

      <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-rose-700">
          <Heart className="w-3.5 h-3.5" />
          <span>Known Allergies</span>
        </div>
        <p className="text-rose-600 text-[11px]">{profile.allergies}</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onShowQR}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>Display ABDM Health QR</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, iconClass, label, value, bold, truncate }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-slate-500 flex items-center gap-2">
        <Icon className={`w-3.5 h-3.5 ${iconClass}`} /> {label}
      </span>
      <span
        className={`${bold ? 'font-bold text-slate-900' : 'font-medium text-slate-800'} ${
          truncate ? 'truncate max-w-[140px]' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
