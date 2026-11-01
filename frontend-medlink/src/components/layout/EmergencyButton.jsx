import React, { useState } from 'react';
import { Loader2, PhoneCall } from 'lucide-react';
import { emergency } from '../../lib/api';

/**
 * Raises a real SOS request (POST /emergency/sos), which dispatches to nearby
 * responders - so it asks twice and needs a location fix before firing.
 */
export default function EmergencyButton() {
  const [busy, setBusy] = useState(false);

  const raise = async () => {
    if (!confirm('Raise an emergency SOS?\n\nThis alerts nearby responders and hospitals with your location. Only continue if this is a real emergency.')) {
      return;
    }

    setBusy(true);
    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('This browser cannot share your location, which the dispatcher needs.'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, () =>
          reject(new Error('Location permission denied. Responders cannot be dispatched without it.')),
          { timeout: 10000 },
        );
      });

      const request = await emergency.sos({
        emergencyType: 'medical',
        severity: 'high',
        location: [position.coords.longitude, position.coords.latitude],
        description: 'SOS raised from the Swasthya Setu web app',
      });

      alert(`SOS raised.\n\nReference: ${request._id}\nStatus: ${request.status}\n\nKeep this screen open - responders are being notified.`);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={raise}
      disabled={busy}
      className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-60 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PhoneCall className="w-3.5 h-3.5" />}
      <span>{busy ? 'Raising SOS...' : 'Raise Emergency SOS'}</span>
    </button>
  );
}
