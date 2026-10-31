import { Router } from 'express';
import adminRoutes from './modules/admin/admin.routes';
import appointmentRoutes from './modules/appointments/appointments.routes';
import ashaRoutes from './modules/asha/asha.routes';
import auditRoutes from './modules/audit/audit.routes';
import authRoutes from './modules/auth/auth.routes';
import consentRoutes from './modules/consent/consent.routes';
import consultationRoutes from './modules/doctor/consultations.routes';
import doctorRoutes from './modules/doctor/doctor.routes';
import emergencyContactRoutes from './modules/emergency/contacts.routes';
import emergencyRoutes from './modules/emergency/emergency.routes';
import fileRoutes from './modules/files/files.routes';
import hospitalRoutes from './modules/hospital/hospital.routes';
import intelligenceRoutes from './modules/intelligence/intelligence.routes';
import interactionRoutes from './modules/intelligence/interactions/interactions.routes';
import medicineRoutes from './modules/intelligence/medicines/medicines.routes';
import offlineDataRoutes from './modules/intelligence/offlineData.routes';
import prescriptionRoutes from './modules/intelligence/prescriptions/prescriptions.routes';
import reminderRoutes from './modules/intelligence/reminders/reminders.routes';
import smsRoutes from './modules/intelligence/sms/sms.routes';
import locationRoutes from './modules/location/location.routes';
import medicalRecordRoutes from './modules/medical-records/medicalRecords.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import patientRoutes from './modules/patient/patient.routes';
import responderRoutes from './modules/responder/responder.routes';
import syncRoutes from './modules/sync/sync.routes';
import userRoutes from './modules/users/users.routes';

const router = Router();

/* shared */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/consents', consentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/files', fileRoutes);
router.use('/documents', fileRoutes); // alias used by the patient app
router.use('/sync', syncRoutes);
router.use('/location', locationRoutes);
router.use('/audit-logs', auditRoutes);

/* role modules */
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/asha', ashaRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/admin', adminRoutes);
router.use('/responders', responderRoutes);

/* cross-cutting business modules */
router.use('/appointments', appointmentRoutes);
router.use('/consultations', consultationRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/emergency-contacts', emergencyContactRoutes);

/* MedLink Intelligence (Saathi) */
router.use('/intelligence', intelligenceRoutes);
router.use('/medicines', medicineRoutes);
router.use('/interactions', interactionRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/reminders', reminderRoutes);
router.use('/sms', smsRoutes);
router.use('/offline-data', offlineDataRoutes);

export default router;
