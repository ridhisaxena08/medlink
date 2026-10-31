import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './emergency.controller';
import { contactIdParamSchema, createContactSchema, updateContactSchema } from './emergency.validation';

/** Top-level alias for the trusted-contact endpoints (also under /emergency/contacts). */
const router = Router();
router.use(authenticate);

router.post('/', validate({ body: createContactSchema }), controller.addContact);
router.get('/', controller.listContacts);
router.patch(
  '/:contactId',
  validate({ params: contactIdParamSchema, body: updateContactSchema }),
  controller.updateContact,
);
router.delete('/:contactId', validate({ params: contactIdParamSchema }), controller.deleteContact);

export default router;
