import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate';
import { authorize } from '../../../middleware/authorize';
import { intelligenceLimiter } from '../../../middleware/rateLimiter';
import { validate } from '../../../middleware/validate';
import { ROLES } from '../../../shared/constants';
import * as controller from './prescriptions.controller';
import {
  createPrescriptionSchema,
  idParamSchema,
  listPrescriptionsSchema,
  parsePrescriptionSchema,
  patientIdParamSchema,
  verifyPrescriptionSchema,
} from './prescriptions.validation';

const router = Router();
router.use(authenticate);

router.post('/', authorize(ROLES.DOCTOR), validate({ body: createPrescriptionSchema }), controller.create);
router.get('/', validate({ query: listPrescriptionsSchema }), controller.list);
router.post('/parse', intelligenceLimiter, validate({ body: parsePrescriptionSchema }), controller.parse);
router.post('/verify', validate({ body: verifyPrescriptionSchema }), controller.verify);
router.get('/patient/:patientId', validate({ params: patientIdParamSchema }), controller.listForPatient);
router.get('/:id', validate({ params: idParamSchema }), controller.getOne);

export default router;
