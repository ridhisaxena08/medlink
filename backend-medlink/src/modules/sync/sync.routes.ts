import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './sync.controller';
import { pullSchema, pushSchema } from './sync.validation';

const router = Router();
router.use(authenticate);

router.post('/push', validate({ body: pushSchema }), controller.push);
router.get('/pull', validate({ query: pullSchema }), controller.pull);
router.get('/status', controller.status);

export default router;
