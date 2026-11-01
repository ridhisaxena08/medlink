import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './audit.controller';
import { listAuditSchema } from './audit.validation';

const router = Router();
router.use(authenticate);

router.get('/', validate({ query: listAuditSchema }), controller.list);

export default router;
