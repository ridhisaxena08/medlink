/**
 * Translates API documents into the prop shapes the presentational components
 * were already written against, so the UI layer stays unchanged.
 */

const INITIALS_COLORS = ['2563eb', '0891b2', '7c3aed', 'db2777', 'ea580c', '059669'];

/** Inline SVG avatar - the API stores no profile images. */
export const avatarFor = (name = '?') => {
  const initials = name
    .replace(/^Dr\.?\s*/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  const hash = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bg = INITIALS_COLORS[hash % INITIALS_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="#${bg}"/><text x="50%" y="52%" dy=".35em" font-family="system-ui,sans-serif" font-size="52" font-weight="700" fill="#fff" text-anchor="middle">${initials || '?'}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const titleCase = (value = '') =>
  String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const formatMoney = (amount) =>
  amount === undefined || amount === null ? 'Not listed' : `₹${Number(amount).toLocaleString('en-IN')}`;

export const formatBytes = (bytes) => {
  if (!bytes && bytes !== 0) return '--';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const DAY = 24 * 60 * 60 * 1000;

/** "Today, 10:30 AM" / "Tomorrow, 4:00 PM" / "Fri, 14 Nov, 11:15 AM" */
export const formatAppointmentDate = (iso) => {
  if (!iso) return 'Date not set';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Date not set';

  const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDelta = Math.round((startOfDay(date) - startOfDay(new Date())) / DAY);

  if (dayDelta === 0) return `Today, ${time}`;
  if (dayDelta === 1) return `Tomorrow, ${time}`;
  if (dayDelta === -1) return `Yesterday, ${time}`;

  const day = date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  return `${day}, ${time}`;
};

export const formatShortDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '--';

export const formatRelative = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return formatShortDate(iso);
};

/* ------------------------------------------------------------ appointments */

export const adaptAppointment = (appointment) => {
  const doctorName = appointment.doctor?.name || 'Assigned doctor';
  const isTele = appointment.mode === 'teleconsult';

  return {
    id: appointment._id,
    raw: appointment,
    doctor: doctorName,
    // Appointments populate the doctor's name only, so the visit reason stands
    // in for the specialty line.
    specialty: appointment.reason || titleCase(appointment.mode),
    hospital: appointment.hospital?.name || (isTele ? 'Video consultation' : 'Clinic visit'),
    date: formatAppointmentDate(appointment.scheduledStart),
    time: appointment.scheduledStart,
    status: titleCase(appointment.status),
    mode: isTele ? 'Video Consult' : 'In-Clinic',
    fee: '',
    avatar: avatarFor(doctorName),
  };
};

/* ----------------------------------------------------------------- doctors */

export const adaptDoctor = (profile) => {
  const name = profile.user?.name || 'Verified doctor';
  const hospital =
    profile.hospitals?.[0]?.name ||
    [profile.practiceLocation?.city, profile.practiceLocation?.district]
      .filter(Boolean)
      .join(', ') ||
    'Independent practice';

  return {
    // Appointments reference the doctor's USER id, not the profile id.
    id: profile.user?._id || profile.user || profile._id,
    profileId: profile._id,
    raw: profile,
    name,
    specialty: profile.specialties?.[0] ? titleCase(profile.specialties[0]) : 'General Physician',
    specialties: profile.specialties || [],
    rating: Number(profile.rating?.average ?? 0).toFixed(1),
    reviews: profile.rating?.count ?? 0,
    experience: `${profile.experienceYears ?? 0} yrs exp`,
    experienceYears: profile.experienceYears ?? 0,
    hospital,
    // The API models availability, not presence - "accepting patients" is the
    // closest honest signal for the online/offline dot.
    status: profile.acceptingNewPatients ? 'Online' : 'Offline',
    fee: formatMoney(profile.consultationFee),
    feeValue: profile.consultationFee ?? null,
    modes: [...new Set((profile.availability || []).map((slot) => slot.mode))],
    avatar: avatarFor(name),
  };
};

/* --------------------------------------------------------------- documents */

const CATEGORY_LABELS = {
  prescription: 'Prescriptions',
  lab_report: 'Lab Reports',
  scan: 'Scans',
  discharge_summary: 'Discharge',
  insurance: 'Insurance',
  id_proof: 'ID Proof',
  certificate: 'Vaccines',
  medicine_image: 'Medicine',
  other: 'Other',
};

export const DOCUMENT_CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const adaptDocument = (doc) => ({
  id: doc._id,
  raw: doc,
  title: doc.title,
  category: CATEGORY_LABELS[doc.category] || titleCase(doc.category),
  categoryKey: doc.category,
  doctor: doc.uploadedBy?.name || 'You',
  date: formatShortDate(doc.documentDate || doc.createdAt),
  size: formatBytes(doc.sizeBytes),
  mimeType: doc.mimeType,
});

/* --------------------------------------------------------------- reminders */

export const adaptReminder = (reminder) => {
  const dose = reminder.doses?.[0];
  const { taken = 0, missed = 0, skipped = 0 } = reminder.adherence || {};
  const total = taken + missed + skipped;

  return {
    id: reminder._id,
    raw: reminder,
    name: reminder.medicineName,
    dosage: dose?.amount || dose?.label || titleCase(reminder.status),
    time: dose?.time || (reminder.nextTriggerAt ? formatAppointmentDate(reminder.nextTriggerAt) : '--'),
    // A dose logged today is what the toggle reflects; the API counts totals.
    taken: Boolean(reminder.lastTriggeredAt) && taken > missed,
    adherencePct: total ? Math.round((taken / total) * 100) : null,
    nextTriggerAt: reminder.nextTriggerAt,
  };
};

/* -------------------------------------------------------------- audit logs */

const ACTION_TITLES = {
  login: 'Signed in',
  logout: 'Signed out',
  create: 'Record created',
  read: 'Record viewed',
  update: 'Record updated',
  delete: 'Record deleted',
  upload: 'Document uploaded',
  download: 'Document downloaded',
  grant_consent: 'Consent granted',
  revoke_consent: 'Consent revoked',
};

export const adaptAuditLog = (log) => ({
  id: log._id,
  title: ACTION_TITLES[log.action] || titleCase(log.action),
  desc: `${titleCase(log.resourceType)}${log.actor?.name ? ` by ${log.actor.name}` : ''}`,
  time: formatRelative(log.createdAt),
  outcome: log.outcome,
});

/* ------------------------------------------------------------- patient/me */

export const adaptProfile = (user, patientProfile, healthSummary) => {
  const address = patientProfile?.address;
  const city = [address?.district, address?.state].filter(Boolean).join(', ');
  const allergies = (healthSummary?.allergies || [])
    .map((a) => a.title)
    .filter(Boolean)
    .join(', ');

  return {
    name: user?.name || 'Your account',
    id: user?._id ? user._id.slice(-8).toUpperCase() : '--------',
    email: user?.email || 'Not added',
    phone: user?.phone || '--',
    bloodGroup: patientProfile?.bloodGroup || 'Not set',
    dob: patientProfile?.dateOfBirth ? formatShortDate(patientProfile.dateOfBirth) : 'Not set',
    gender: patientProfile?.gender ? titleCase(patientProfile.gender) : 'Not set',
    city: city || 'Not set',
    allergies: allergies || 'None recorded',
    role: user?.role || 'patient',
    avatar: avatarFor(user?.name || 'User'),
  };
};
