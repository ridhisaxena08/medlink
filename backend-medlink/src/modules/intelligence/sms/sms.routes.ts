import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate';
import { intelligenceLimiter } from '../../../middleware/rateLimiter';
import { validate } from '../../../middleware/validate';
import * as controller from './sms.controller';
import { prepareSmsSchema, sendSmsSchema } from './sms.validation';

const router = Router();
router.use(authenticate);

router.post('/prepare', validate({ body: prepareSmsSchema }), controller.prepare);
router.post('/send', intelligenceLimiter, validate({ body: sendSmsSchema }), controller.send);

export default router;
