import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './consent.controller';
import {
  createConsentSchema,
  idParamSchema,
  listConsentSchema,
  revokeConsentSchema,
} from './consent.validation';

const router = Router();
router.use(authenticate);

router.post('/', validate({ body: createConsentSchema }), controller.create);
router.get('/', validate({ query: listConsentSchema }), controller.list);
router.delete('/:id', validate({ params: idParamSchema, body: revokeConsentSchema }), controller.revoke);

export default router;
