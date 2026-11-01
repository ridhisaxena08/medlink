/**
 * Every backend endpoint the app uses, grouped by module.
 * Paths mirror src/routes.ts in the MedLink360 backend.
 */
import { api, request, tokenStore } from './apiClient';

export const auth = {
  register: (body) => api.post('/auth/register', body, { auth: false }),
  login: (body) => api.post('/auth/login', body, { auth: false }),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }, { auth: false }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  changePassword: (body) => api.post('/auth/change-password', body),
};

export const users = {
  me: () => api.get('/users/me'),
  updateMe: (body) => api.put('/users/me', body),
};

export const patients = {
  me: () => api.get('/patients/me'),
  updateMe: (body) => api.put('/patients/me', body),
  dashboard: () => api.get('/patients/dashboard'),
  medicalHistory: () => api.get('/patients/medical-history'),
  medicines: () => api.get('/patients/medicines'),
  confirmMedicine: (id) => api.patch(`/patients/medicines/${id}/confirm`),
  stopMedicine: (id) => api.patch(`/patients/medicines/${id}/stop`),
};

export const doctors = {
  /** Filters: q, specialty, district, mode, maxFee, minExperience, sort, page, limit */
  search: (params) => api.get('/doctors', params),
  get: (doctorId) => api.get(`/doctors/${doctorId}`),
  slots: (doctorId, date, mode) => api.get(`/doctors/${doctorId}/slots`, { date, mode }),
};

/** Endpoints only a doctor account can call. */
export const doctorSelf = {
  profile: () => api.get('/doctors/me'),
  updateProfile: (body) => api.put('/doctors/me', body),
  dashboard: () => api.get('/doctors/dashboard'),
  appointments: (params) => api.get('/doctors/appointments', params),
  /** status: 'confirmed' | 'rejected' | 'completed' | 'no_show' */
  setAppointmentStatus: (id, status, reason) =>
    api.patch(`/doctors/appointments/${id}/status`, { status, reason }),
  availability: () => api.get('/doctors/availability'),
  setAvailability: (availability, exceptions) =>
    api.post('/doctors/availability', { availability, ...(exceptions ? { exceptions } : {}) }),
  patientView: (patientId) => api.get(`/doctors/patients/${patientId}`),
};

export const appointments = {
  mine: (params) => api.get('/appointments/my', params),
  get: (id) => api.get(`/appointments/${id}`),
  book: (body) => api.post('/appointments', body),
  cancel: (id, reason) => api.patch(`/appointments/${id}/cancel`, { reason }),
  reschedule: (id, body) => api.patch(`/appointments/${id}/reschedule`, body),
};

export const documents = {
  mine: (params) => api.get('/documents/my', params),
  /**
   * The backend reads the binary from a `file` field and the metadata from the
   * same multipart body, so title/category travel as form fields - not JSON.
   */
  upload: ({ file, title, category = 'other', description, documentDate }) => {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('category', category);
    if (description) form.append('description', description);
    if (documentDate) form.append('documentDate', documentDate);
    return request('/documents/upload', { method: 'POST', form });
  },
  meta: (id) => api.get(`/documents/${id}/meta`),
  /** Returns a Blob - the route streams bytes and still requires the bearer token. */
  download: (id) => request(`/documents/${id}`, { raw: true }),
  archive: (id) => api.delete(`/documents/${id}`),
};

export const medicalRecords = {
  list: (params) => api.get('/medical-records', params),
  create: (body) => api.post('/medical-records', body),
  update: (id, body) => api.patch(`/medical-records/${id}`, body),
  remove: (id) => api.delete(`/medical-records/${id}`),
};

export const reminders = {
  list: (params) => api.get('/reminders', params),
  get: (id) => api.get(`/reminders/${id}`),
  /** outcome: 'taken' | 'missed' | 'skipped' */
  recordAdherence: (id, outcome) => api.patch(`/reminders/${id}/adherence`, { outcome }),
};

export const notifications = {
  list: (params) => api.get('/notifications', params),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
};

export const auditLogs = {
  list: (params) => api.get('/audit-logs', params),
};

export const admin = {
  dashboard: () => api.get('/admin/dashboard'),
  /** Grouped by role: { status, groups: [{ role, count, items }] } */
  verifications: (params) => api.get('/admin/verifications', params),
  /** `id` is the staff member's USER id, not their profile id. */
  verify: (userId, role, status, reason) =>
    api.patch(`/admin/verifications/${userId}`, { role, status, reason }),
  users: (params) => api.get('/admin/users', params),
  setUserStatus: (userId, status, reason) =>
    api.patch(`/admin/users/${userId}/status`, { status, reason }),
  auditLogs: (params) => api.get('/admin/audit-logs', params),
  accessReport: () => api.get('/admin/access-report'),
};

export const emergency = {
  sos: (body) => api.post('/emergency/sos', body),
  myRequests: () => api.get('/emergency/my-requests'),
  contacts: () => api.get('/emergency-contacts'),
  addContact: (body) => api.post('/emergency-contacts', body),
  nearbyHospitals: (params) => api.get('/emergency/hospitals/nearby', params),
};

export const intelligence = {
  chat: (body) => api.post('/intelligence/chat', body),
  searchMedicines: (q) => api.get('/medicines/search', { q }),
  checkInteractions: (body) => api.post('/interactions/check', body),
};

export { tokenStore };
