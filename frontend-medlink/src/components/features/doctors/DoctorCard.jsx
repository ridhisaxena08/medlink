import React from 'react';
import { Star, MapPin, Award } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

export default function DoctorCard({ doctor, onBook }) {
  const isOnline = doctor.status === 'Online';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-slate-900 text-sm truncate">{doctor.name}</h3>
              <Badge variant={isOnline ? 'online' : 'offline'}>{doctor.status}</Badge>
            </div>
            <p className="text-xs font-semibold text-blue-600 mt-0.5">{doctor.specialty}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{doctor.experience}</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1 mb-4 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{doctor.hospital}</span>
        </div>

        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-800">{doctor.rating}</span>
            <span className="text-[11px] text-slate-400">({doctor.reviews})</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Consultation Fee</span>
            <span className="text-xs font-bold text-slate-900">{doctor.fee}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onBook(doctor)}>
          Profile
        </Button>
        <Button variant="primary" size="sm" className="flex-1 text-xs font-semibold" onClick={() => onBook(doctor)}>
          Book Visit
        </Button>
      </div>
    </div>
  );
}

