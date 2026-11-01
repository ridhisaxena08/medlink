import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './notifications.controller';
import { idParamSchema, listNotificationsSchema } from './notifications.validation';

const router = Router();
router.use(authenticate);

router.get('/', validate({ query: listNotificationsSchema }), controller.list);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', validate({ params: idParamSchema }), controller.markRead);

export default router;
