import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './intelligence.controller';
import { offlineQuerySchema } from './intelligence.validation';

const router = Router();
router.use(authenticate);

router.get('/version', controller.offlineVersion);
router.get('/medicines', validate({ query: offlineQuerySchema }), controller.offlineMedicines);
router.get('/interactions', validate({ query: offlineQuerySchema }), controller.offlineInteractions);

export default router;
