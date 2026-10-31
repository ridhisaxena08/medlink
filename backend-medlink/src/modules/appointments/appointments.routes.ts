import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize, requireActiveAccount } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import * as controller from './appointments.controller';
import {
  cancelSchema,
  createAppointmentSchema,
  idParamSchema,
  listAppointmentsSchema,
  rescheduleSchema,
  statusUpdateSchema,
} from './appointments.validation';

const router = Router();
router.use(authenticate);

router.post(
  '/',
  requireActiveAccount,
  authorize(ROLES.PATIENT, ROLES.ASHA, ROLES.HOSPITAL),
  validate({ body: createAppointmentSchema }),
  controller.create,
);
router.get('/my', validate({ query: listAppointmentsSchema }), controller.listMine);
router.get('/:id', validate({ params: idParamSchema }), controller.getOne);
router.patch('/:id/cancel', validate({ params: idParamSchema, body: cancelSchema }), controller.cancel);
router.patch(
  '/:id/reschedule',
  validate({ params: idParamSchema, body: rescheduleSchema }),
  controller.reschedule,
);
router.patch(
  '/:id/status',
  authorize(ROLES.DOCTOR),
  validate({ params: idParamSchema, body: statusUpdateSchema }),
  controller.updateStatus,
);

export default router;
