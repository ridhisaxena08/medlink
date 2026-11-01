import React from 'react';
import { FileSearch, ShieldCheck, Siren, Video } from 'lucide-react';
import QuickActionCard from './QuickActionCard';

export default function QuickActionGrid({ onNavigate, dashboard }) {
  const documents = dashboard?.documents?.recent?.length ?? 0;
  const consents = dashboard?.consents?.active ?? 0;
  const contacts = dashboard?.emergency?.contactsConfigured ?? 0;
  const openEmergencies = dashboard?.emergency?.openRequests?.length ?? 0;

  // Badges report this account's actual state rather than marketing copy.
  const actions = [
    {
      title: 'Consult Specialist',
      description: 'Book a video or in-clinic visit with a verified doctor.',
      icon: Video,
      colorScheme: 'blue',
      badge: 'Browse',
      tab: 'doctors',
    },
    {
      title: 'Medical Records',
      description: 'Prescriptions, lab reports and scans in one place.',
      icon: FileSearch,
      colorScheme: 'indigo',
      badge: documents ? `${documents} recent` : 'Empty',
      tab: 'records',
    },
    {
      title: 'ABHA Health Locker',
      description: 'Encrypted vault with consent-gated clinician access.',
      icon: ShieldCheck,
      colorScheme: 'emerald',
      badge: consents ? `${consents} consent${consents === 1 ? '' : 's'}` : 'No consents',
      tab: 'records',
    },
    {
      title: 'Emergency Assistance',
      description: 'Ambulance dispatch and trauma desk via SOS.',
      icon: Siren,
      colorScheme: 'amber',
      badge: openEmergencies
        ? `${openEmergencies} open`
        : contacts
        ? `${contacts} contact${contacts === 1 ? '' : 's'}`
        : 'Add a contact',
      tab: openEmergencies || contacts ? 'profile' : 'profile',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {actions.map((act) => (
        <QuickActionCard
          key={act.title}
          title={act.title}
          description={act.description}
          icon={act.icon}
          colorScheme={act.colorScheme}
          badge={act.badge}
          onClick={() => onNavigate(act.tab)}
        />
      ))}
    </div>
  );
}
