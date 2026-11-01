import React from 'react';
import { Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import Button from '../../ui/Button';

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

/** First name only - "Good Morning, Devansh" reads better than the full name. */
const firstName = (name) => (name || 'there').trim().split(/\s+/)[0];

export default function HeroHome({ user, dashboard, upcoming, onBookClick, onRecordsClick }) {
  const activeConditions = dashboard?.healthSummary?.totalActive ?? 0;
  const adherence = dashboard?.reminders?.adherenceRate;
  const upcomingCount = dashboard?.appointments?.count ?? 0;

  const summary = upcoming
    ? `You have ${upcomingCount} consultation${upcomingCount === 1 ? '' : 's'} coming up - next is ${upcoming.date} with ${upcoming.doctor}.`
    : 'You have no consultations scheduled. Book one from Find Doctors whenever you need it.';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D2040] via-[#142E54] to-[#1E3A8A] text-white p-6 md:p-8 shadow-md">
      <div className="max-w-xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>Ayushman Bharat Digital Mission (ABDM) Sync Active</span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {greeting()}, {firstName(user?.name)} 👋
        </h2>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">{summary}</p>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" icon={Calendar} onClick={onBookClick}>
            Schedule Visit
          </Button>
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={onRecordsClick}
          >
            View Health Locker
          </Button>
        </div>
      </div>

      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
            {adherence === null || adherence === undefined ? 'Health record' : 'Medication adherence'}
          </div>
          <div className="text-xl font-bold text-white">
            {adherence === null || adherence === undefined ? (
              <>
                {activeConditions}{' '}
                <span className="text-xs font-normal text-slate-300">
                  active {activeConditions === 1 ? 'entry' : 'entries'}
                </span>
              </>
            ) : (
              <>
                {adherence}
                <span className="text-xs font-normal text-emerald-300"> %</span>
              </>
            )}
          </div>
          <div className="text-[11px] text-emerald-400">
            {activeConditions === 0 ? 'No conditions recorded' : 'Tracked in your record'}
          </div>
        </div>
      </div>
    </div>
  );
}
