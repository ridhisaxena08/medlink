import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize, requireActiveAccount } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import { listAppointmentsSchema } from '../appointments/appointments.validation';
import {
  assignSchema,
  listRequestsSchema,
  statusUpdateSchema as emergencyStatusSchema,
} from '../emergency/emergency.validation';
import * as controller from './hospital.controller';
import {
  assignAshaSchema,
  createDepartmentSchema,
  idParamSchema,
  linkExistingDoctorSchema,
  listStaffSchema,
  registerAshaSchema,
  registerDoctorSchema,
  reportsSchema,
  updateHospitalSchema,
  verifySchema,
} from './hospital.validation';

const router = Router();
router.use(authenticate, authorize(ROLES.HOSPITAL, ROLES.ADMIN));

router.get('/me', controller.getMe);
router.put('/me', validate({ body: updateHospitalSchema }), controller.updateMe);
router.get('/dashboard', controller.dashboard);
router.get('/reports', validate({ query: reportsSchema }), controller.reports);

/* ---- doctors ---- */
router.post('/doctors', requireActiveAccount, validate({ body: registerDoctorSchema }), controller.registerDoctor);
router.post('/doctors/link', validate({ body: linkExistingDoctorSchema }), controller.linkDoctor);
router.get('/doctors', validate({ query: listStaffSchema }), controller.listDoctors);
router.patch('/doctors/:id/verify', validate({ params: idParamSchema, body: verifySchema }), controller.verifyDoctor);

/* ---- departments ---- */
router.post('/departments', validate({ body: createDepartmentSchema }), controller.createDepartment);
router.get('/departments', controller.listDepartments);

/* ---- ASHA workers ---- */
router.post('/asha', requireActiveAccount, validate({ body: registerAshaSchema }), controller.registerAsha);
router.get('/asha', validate({ query: listStaffSchema }), controller.listAsha);
router.patch('/asha/:id/verify', validate({ params: idParamSchema, body: verifySchema }), controller.verifyAsha);
router.post('/asha/assignments', validate({ body: assignAshaSchema }), controller.assignAsha);

/* ---- operations ---- */
router.get('/appointments', validate({ query: listAppointmentsSchema }), controller.listAppointments);
router.get('/emergency-requests', validate({ query: listRequestsSchema }), controller.listEmergencyRequests);
router.post(
  '/emergency-requests/:id/assign',
  validate({ params: idParamSchema, body: assignSchema }),
  controller.assignResponder,
);
router.patch(
  '/emergency-requests/:id/status',
  validate({ params: idParamSchema, body: emergencyStatusSchema }),
  controller.updateEmergencyStatus,
);

export default router;
