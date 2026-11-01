import React from 'react';
import { Clock, MapPin, Video, XCircle } from 'lucide-react';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';

const ACTIVE_STATUSES = ['Requested', 'Confirmed', 'Rescheduled'];

export default function AppointmentRow({ appointment, onReschedule, onCancel, onJoin }) {
  const isActive = ACTIVE_STATUSES.includes(appointment.status);
  const isVideo = appointment.mode === 'Video Consult';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <img
          src={appointment.avatar}
          alt={appointment.doctor}
          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">{appointment.doctor}</h3>
            <Badge variant={isActive ? 'confirmed' : 'completed'}>{appointment.status}</Badge>
          </div>
          <p className="text-xs font-semibold text-blue-600">{appointment.specialty}</p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {appointment.date}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {appointment.hospital}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
              {appointment.mode}
            </span>
          </div>
        </div>
      </div>

      {isActive && (
        <div className="flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
          {isVideo && (
            <Button variant="primary" size="sm" icon={Video} onClick={() => onJoin(appointment)}>
              Join Video
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => onReschedule(appointment)}>
            Reschedule
          </Button>
          <button
            onClick={() => onCancel(appointment.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Cancel booking"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
