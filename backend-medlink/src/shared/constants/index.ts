export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ASHA: 'asha',
  HOSPITAL: 'hospital',
  ADMIN: 'admin',
  RESPONDER: 'responder',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export const ALL_ROLES: Role[] = Object.values(ROLES);

export const ACCOUNT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DEACTIVATED: 'deactivated',
} as const;
export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;
export type VerificationStatus = (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];

export const APPOINTMENT_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  RESCHEDULED: 'rescheduled',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

export const EMERGENCY_STATUS = {
  CREATED: 'created',
  NOTIFIED: 'notified',
  ASSIGNED: 'assigned',
  ACCEPTED: 'accepted',
  EN_ROUTE: 'en_route',
  ARRIVED: 'arrived',
  TRANSPORTING: 'transporting',
  AT_HOSPITAL: 'at_hospital',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
export type EmergencyStatus = (typeof EMERGENCY_STATUS)[keyof typeof EMERGENCY_STATUS];

export const TERMINAL_EMERGENCY_STATUSES: EmergencyStatus[] = [
  EMERGENCY_STATUS.COMPLETED,
  EMERGENCY_STATUS.CANCELLED,
];

/** Allowed forward transitions for an emergency request. */
export const EMERGENCY_TRANSITIONS: Record<EmergencyStatus, EmergencyStatus[]> = {
  created: ['notified', 'assigned', 'cancelled'],
  notified: ['assigned', 'cancelled'],
  assigned: ['accepted', 'cancelled'],
  accepted: ['en_route', 'cancelled'],
  en_route: ['arrived', 'cancelled'],
  arrived: ['transporting', 'completed', 'cancelled'],
  transporting: ['at_hospital', 'cancelled'],
  at_hospital: ['completed'],
  completed: [],
  cancelled: [],
};

export const CONSENT_SCOPES = {
  PROFILE: 'profile',
  MEDICAL_HISTORY: 'medical_history',
  DOCUMENTS: 'documents',
  MEDICATIONS: 'medications',
  REMINDERS: 'reminders',
  APPOINTMENTS: 'appointments',
  PRESCRIPTIONS: 'prescriptions',
  EMERGENCY: 'emergency',
  LOCATION: 'location',
  SMS: 'sms',
} as const;
export type ConsentScope = (typeof CONSENT_SCOPES)[keyof typeof CONSENT_SCOPES];
export const ALL_CONSENT_SCOPES: ConsentScope[] = Object.values(CONSENT_SCOPES);

export const CONSENT_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
} as const;
export type ConsentStatus = (typeof CONSENT_STATUS)[keyof typeof CONSENT_STATUS];

export const REMINDER_STATUS = {
  PROPOSED: 'proposed',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
export type ReminderStatus = (typeof REMINDER_STATUS)[keyof typeof REMINDER_STATUS];

export const NOTIFICATION_CHANNELS = ['in_app', 'push', 'sms'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const AUDIT_ACTIONS = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  ACCESS_DENIED: 'access_denied',
  LOGIN: 'login',
  LOGOUT: 'logout',
  CONSENT_GRANTED: 'consent_granted',
  CONSENT_REVOKED: 'consent_revoked',
  VERIFY: 'verify',
  ASSIGN: 'assign',
  STATUS_CHANGE: 'status_change',
} as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
