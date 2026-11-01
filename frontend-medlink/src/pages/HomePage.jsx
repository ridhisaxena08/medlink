import React from 'react';
import HeroHome from '../components/features/home/HeroHome';
import QuickActionGrid from '../components/features/home/QuickActionGrid';
import HomeAppointment from '../components/features/home/HomeAppointment';
import HomeReminders from '../components/features/home/HomeReminders';
import RecentActivity from '../components/features/home/RecentActivity';
import { EmptyState, ErrorState, Spinner } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { patients } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { adaptAppointment } from '../lib/adapters';

export default function HomePage({ onNavigate }) {
  const { user } = useAuth();
  // One call backs this whole screen: appointments, reminders, documents, counts.
  const { data, error, loading, reload } = useAsync(() => patients.dashboard(), []);

  if (loading) return <Spinner label="Loading your health summary..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const upcomingRaw = data?.appointments?.upcoming?.[0] || null;
  const upcoming = upcomingRaw ? adaptAppointment(upcomingRaw) : null;

  return (
    <div className="space-y-6">
      <HeroHome
        user={user}
        dashboard={data}
        upcoming={upcoming}
        onBookClick={() => onNavigate('doctors')}
        onRecordsClick={() => onNavigate('records')}
      />

      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2">Quick Services</h3>
        <QuickActionGrid onNavigate={onNavigate} dashboard={data} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {upcoming ? (
          <HomeAppointment
            appointment={upcoming}
            onJoinCall={() =>
              alert(
                upcoming.mode === 'Video Consult'
                  ? `Telehealth room for ${upcoming.doctor} opens at ${upcoming.date}.`
                  : `This is an in-clinic visit at ${upcoming.hospital}.`,
              )
            }
            onViewAll={() => onNavigate('appointments')}
          />
        ) : (
          <EmptyState
            title="No upcoming visits"
            description="Book a consultation with a verified specialist to see it here."
            action={
              <button
                onClick={() => onNavigate('doctors')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Find a doctor
              </button>
            }
          />
        )}

        <HomeReminders initial={data?.reminders?.active} />
      </div>

      <RecentActivity />
    </div>
  );
}
