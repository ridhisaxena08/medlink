import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate';
import { validate } from '../../../middleware/validate';
import * as controller from './reminders.controller';
import {
  adherenceSchema,
  createReminderSchema,
  generateRemindersSchema,
  idParamSchema,
  listRemindersSchema,
  updateReminderSchema,
} from './reminders.validation';

const router = Router();
router.use(authenticate);

router.post('/generate', validate({ body: generateRemindersSchema }), controller.generate);
router.post('/', validate({ body: createReminderSchema }), controller.create);
router.get('/', validate({ query: listRemindersSchema }), controller.list);
router.patch('/:id', validate({ params: idParamSchema, body: updateReminderSchema }), controller.update);
router.post('/:id/adherence', validate({ params: idParamSchema, body: adherenceSchema }), controller.adherence);

export default router;
