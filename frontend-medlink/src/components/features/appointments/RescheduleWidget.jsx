import React from 'react';
import { Calendar as CalendarIcon, HelpCircle, ShieldCheck, Stethoscope } from 'lucide-react';
import Button from '../../ui/Button';

/**
 * Side panel on the appointments screen. Booking always goes through a doctor's
 * published slots, so this links into discovery rather than inventing times.
 */
export default function RescheduleWidget({ onBrowseDoctors }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold text-slate-900">Book a new consultation</h4>
        </div>
        <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
      </div>

      <p className="text-xs text-slate-500">
        Pick a verified specialist to see the slots they have actually published for the next seven
        days.
      </p>

      <div className="space-y-2 text-[11px] text-slate-600">
        <div className="flex items-start gap-2">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
          <span>Filter by specialty, fee, experience or district.</span>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <span>Only admin-verified doctors appear in search results.</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800">
        <p className="font-semibold">Video and in-clinic supported</p>
        <p className="text-blue-600">Choose the mode when you confirm the slot.</p>
      </div>

      <Button variant="primary" className="w-full text-xs font-bold" onClick={onBrowseDoctors}>
        Find a specialist
      </Button>
    </div>
  );
}
