import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate';
import { intelligenceLimiter } from '../../../middleware/rateLimiter';
import { validate } from '../../../middleware/validate';
import * as controller from './interactions.controller';
import { checkInteractionsSchema } from './interactions.validation';

const router = Router();
router.use(authenticate);

router.post('/check', intelligenceLimiter, validate({ body: checkInteractionsSchema }), controller.check);

export default router;
