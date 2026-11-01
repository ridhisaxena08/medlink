import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize, requireActiveAccount } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import {
  listAppointmentsSchema,
  statusUpdateSchema,
} from '../appointments/appointments.validation';
import * as controller from './doctor.controller';
import {
  doctorIdParamSchema,
  idParamSchema,
  patientIdParamSchema,
  searchDoctorsSchema,
  setAvailabilitySchema,
  slotQuerySchema,
  updateDoctorProfileSchema,
} from './doctor.validation';

const router = Router();
router.use(authenticate);

/* ---- the signed-in doctor (declared before /:doctorId) ---- */
router.get('/me', authorize(ROLES.DOCTOR), controller.getMe);
router.put('/me', authorize(ROLES.DOCTOR), validate({ body: updateDoctorProfileSchema }), controller.updateMe);

router.post(
  '/availability',
  authorize(ROLES.DOCTOR),
  requireActiveAccount,
  validate({ body: setAvailabilitySchema }),
  controller.setAvailability,
);
router.get('/availability', authorize(ROLES.DOCTOR), controller.getAvailability);

router.get('/dashboard', authorize(ROLES.DOCTOR), controller.dashboard);

router.get(
  '/appointments',
  authorize(ROLES.DOCTOR),
  validate({ query: listAppointmentsSchema }),
  controller.listAppointments,
);
router.patch(
  '/appointments/:id/status',
  authorize(ROLES.DOCTOR),
  validate({ params: idParamSchema, body: statusUpdateSchema }),
  controller.updateAppointmentStatus,
);

router.get(
  '/patients/:patientId',
  authorize(ROLES.DOCTOR, ROLES.HOSPITAL, ROLES.ADMIN),
  validate({ params: patientIdParamSchema }),
  controller.patientView,
);

/* ---- discovery (any signed-in user) ---- */
router.get('/', validate({ query: searchDoctorsSchema }), controller.search);
router.get('/:doctorId/slots', validate({ params: doctorIdParamSchema, query: slotQuerySchema }), controller.slots);
router.get('/:doctorId', validate({ params: doctorIdParamSchema }), controller.getPublic);

export default router;
