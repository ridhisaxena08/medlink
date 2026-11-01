import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import DoctorSearchBar from '../components/features/doctors/DoctorSearchBar';
import DoctorFilters from '../components/features/doctors/DoctorFilters';
import DoctorCard from '../components/features/doctors/DoctorCard';
import BookingModal from '../components/features/doctors/BookingModal';
import { EmptyState, ErrorState, Spinner } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { doctors as doctorsApi } from '../lib/api';
import { adaptDoctor, titleCase } from '../lib/adapters';

const EXPERIENCE_FLOOR = { All: undefined, '5+ Years': 5, '10+ Years': 10, '15+ Years': 15 };

export default function FindDoctorsPage({ initialSearch = '' }) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debounced, setDebounced] = useState(initialSearch);
  const [filterPill, setFilterPill] = useState('All');
  const [specialty, setSpecialty] = useState('All');
  const [experience, setExperience] = useState('All');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [booking, setBooking] = useState(null);
  const [toast, setToast] = useState(null);

  // Keep typing cheap - the search runs server-side.
  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchTerm), 350);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const query = useMemo(
    () => ({
      q: debounced || undefined,
      specialty: specialty === 'All' ? undefined : specialty,
      minExperience: EXPERIENCE_FLOOR[experience],
      maxFee: filterPill === 'Under ₹1200' ? 1200 : undefined,
      mode: filterPill === 'Video Consult Available' ? 'teleconsult' : undefined,
      sort: filterPill === 'Top Rated (4.8+)' ? 'rating' : undefined,
      limit: 50,
    }),
    [debounced, specialty, experience, filterPill],
  );

  const { data, error, loading, reload } = useAsync(() => doctorsApi.search(query), [query]);

  const all = useMemo(() => (data || []).map(adaptDoctor), [data]);

  // These two are not server-side filters, so they are applied to the page.
  const filtered = useMemo(
    () =>
      all.filter((doc) => {
        if (onlyOnline && doc.status !== 'Online') return false;
        if (filterPill === 'Top Rated (4.8+)' && Number(doc.rating) < 4.8) return false;
        return true;
      }),
    [all, onlyOnline, filterPill],
  );

  const specialties = useMemo(() => {
    const found = new Set();
    all.forEach((doc) => doc.specialties.forEach((s) => found.add(titleCase(s))));
    return ['All', ...[...found].sort()];
  }, [all]);

  const resetAll = () => {
    setSearchTerm('');
    setFilterPill('All');
    setSpecialty('All');
    setExperience('All');
    setOnlyOnline(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Verified Specialists"
        description="Book video consultations or in-person clinic visits with admin-verified medical specialists."
        badgeText={`${all.length} Verified`}
      />

      <DoctorSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilterPill={filterPill}
        onSelectPill={setFilterPill}
        resultCount={filtered.length}
      />

      {toast && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-700">
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <DoctorFilters
            specialties={specialties}
            selectedSpecialty={specialty}
            onSelectSpecialty={setSpecialty}
            selectedExp={experience}
            onSelectExp={setExperience}
            onlyOnline={onlyOnline}
            onToggleOnline={setOnlyOnline}
            onReset={resetAll}
          />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <Spinner label="Searching specialists..." />
          ) : error ? (
            <ErrorState error={error} onRetry={reload} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No specialists match your criteria"
              description="Only doctors an admin has verified appear in search. Try resetting the filters."
              action={
                <button onClick={resetAll} className="text-xs font-bold text-blue-600 hover:underline">
                  Reset filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((doc) => (
                <DoctorCard key={doc.id} doctor={doc} onBook={setBooking} />
              ))}
            </div>
          )}
        </div>
      </div>

      {booking && (
        <BookingModal
          doctor={booking}
          onClose={() => setBooking(null)}
          onBooked={() => {
            setBooking(null);
            setToast(`Appointment requested with ${booking.name}. Check the Appointments tab.`);
            setTimeout(() => setToast(null), 6000);
          }}
        />
      )}
    </div>
  );
}
