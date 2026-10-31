import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './users.controller';
import { deactivateSchema, updateMeSchema } from './users.validation';

const router = Router();
router.use(authenticate);

router.get('/me', controller.getMe);
router.patch('/me', validate({ body: updateMeSchema }), controller.updateMe);
router.post('/me/deactivate', validate({ body: deactivateSchema }), controller.deactivateMe);

export default router;
