import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize, requireActiveAccount } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import { createAppointmentSchema } from '../appointments/appointments.validation';
import { createReminderSchema } from '../intelligence/reminders/reminders.validation';
import * as controller from './asha.controller';
import {
  createAssignmentSchema,
  createFollowUpSchema,
  idParamSchema,
  listAssignmentsSchema,
  listFollowUpsSchema,
  listPatientsSchema,
  patientIdParamSchema,
  registerPatientSchema,
  updateAshaProfileSchema,
} from './asha.validation';

const router = Router();
router.use(authenticate);

router.get('/me', authorize(ROLES.ASHA), controller.getMe);
router.put('/me', authorize(ROLES.ASHA), validate({ body: updateAshaProfileSchema }), controller.updateMe);
router.get('/dashboard', authorize(ROLES.ASHA), controller.dashboard);

/* ---- patients ---- */
router.get(
  '/patients',
  authorize(ROLES.ASHA),
  validate({ query: listPatientsSchema }),
  controller.listPatients,
);
router.post(
  '/patients',
  authorize(ROLES.ASHA),
  requireActiveAccount,
  validate({ body: registerPatientSchema }),
  controller.registerPatient,
);
router.get(
  '/patients/:patientId',
  authorize(ROLES.ASHA),
  validate({ params: patientIdParamSchema }),
  controller.getPatient,
);

/* ---- assignments (created by hospital/admin only) ---- */
router.post(
  '/assignments',
  authorize(ROLES.HOSPITAL, ROLES.ADMIN),
  validate({ body: createAssignmentSchema }),
  controller.createAssignment,
);
router.get('/assignments', validate({ query: listAssignmentsSchema }), controller.listAssignments);
router.delete('/assignments/:id', validate({ params: idParamSchema }), controller.revokeAssignment);

/* ---- field work ---- */
router.post(
  '/followups',
  authorize(ROLES.ASHA),
  requireActiveAccount,
  validate({ body: createFollowUpSchema }),
  controller.createFollowUp,
);
router.get('/followups', validate({ query: listFollowUpsSchema }), controller.listFollowUps);

router.post(
  '/appointments',
  authorize(ROLES.ASHA),
  requireActiveAccount,
  validate({ body: createAppointmentSchema }),
  controller.bookAppointment,
);

router.post(
  '/reminders',
  authorize(ROLES.ASHA),
  requireActiveAccount,
  validate({ body: createReminderSchema }),
  controller.proposeReminder,
);

export default router;
