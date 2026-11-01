import React from 'react';
import { Calendar, Video, Clock, ChevronRight } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

export default function HomeAppointment({ appointment, onJoinCall, onViewAll }) {
  if (!appointment) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">Upcoming Visit</span>
            <p className="text-[11px] text-slate-500">Confirmed booking</p>
          </div>
        </div>
        <Badge variant="confirmed">{appointment.status}</Badge>
      </div>

      <div className="flex items-center gap-3.5 my-4">
        <img src={appointment.avatar} alt={appointment.doctor} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-100" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{appointment.doctor}</h4>
          <p className="text-xs text-blue-600 font-medium">{appointment.specialty}</p>
          <p className="text-[11px] text-slate-400 truncate">{appointment.hospital}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600 mb-4">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{appointment.date}</span>
        </div>
        <span className="font-semibold text-slate-700">{appointment.mode}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm" icon={Video} className="flex-1" onClick={onJoinCall}>Join Call</Button>
        <button onClick={onViewAll} className="p-2 text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1">
          <span>All</span> <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
