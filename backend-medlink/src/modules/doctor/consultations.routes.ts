import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import * as controller from './doctor.controller';
import { createConsultationSchema, idParamSchema } from './doctor.validation';

const router = Router();
router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.DOCTOR),
  validate({ body: createConsultationSchema }),
  controller.createConsultation,
);
router.get('/:id', validate({ params: idParamSchema }), controller.getConsultation);

export default router;
