import React, { useState } from 'react';
import { QrCode, X } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import ProfileSidebar from '../components/features/profile/ProfileSidebar';
import SettingsAccordion from '../components/features/profile/SettingsAccordion';
import { ErrorState, Spinner } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { patients, users } from '../lib/api';
import { adaptProfile } from '../lib/adapters';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettingsPage() {
  const { user, setUser } = useAuth();
  const [showQR, setShowQR] = useState(false);

  const { data, error, loading, reload } = useAsync(
    async () => {
      const [account, profile, history] = await Promise.all([
        users.me(),
        patients.me().catch(() => null),
        patients.medicalHistory().catch(() => null),
      ]);
      return { account, profile, history };
    },
    [user?._id],
  );

  if (loading) return <Spinner label="Loading your account..." />;
  if (error) return <ErrorState error={error} onRetry={reload} />;

  const profile = adaptProfile(data.account, data.profile, data.history);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Account & ABDM Health ID"
        description="Manage your national health identifier, linked hospitals, emergency contacts, and privacy preferences."
        badgeText={data.account?.phoneVerified ? 'Verified Identity' : 'Unverified'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileSidebar profile={profile} onShowQR={() => setShowQR(true)} />
        </div>
        <div className="lg:col-span-2">
          <SettingsAccordion
            profile={profile}
            onSaved={async (updated) => {
              setUser(updated);
              await reload();
            }}
          />
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-9 h-9" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">National ABDM QR Code</h3>
            <p className="text-xs text-slate-500 mb-4">
              Scan at any registered clinic for instant OPD token generation.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl inline-block mb-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ABHA:${profile.id}`}
                alt="ABHA QR"
                className="w-40 h-40 mx-auto"
              />
            </div>
            <p className="text-xs font-mono font-bold text-slate-700">ABHA: {profile.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}
