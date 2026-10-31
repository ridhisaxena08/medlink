import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import * as controller from './responder.controller';
import {
  acceptSchema,
  availabilitySchema,
  declineSchema,
  idParamSchema,
  listAssignmentsSchema,
  locationSchema,
  statusSchema,
  updateResponderProfileSchema,
} from './responder.validation';

const router = Router();
router.use(authenticate, authorize(ROLES.RESPONDER));

router.get('/me', controller.getMe);
router.put('/me', validate({ body: updateResponderProfileSchema }), controller.updateMe);
router.put('/availability', validate({ body: availabilitySchema }), controller.setAvailability);

router.get('/assignments', validate({ query: listAssignmentsSchema }), controller.listAssignments);
router.get('/history', controller.history);
router.get('/assignments/:id', validate({ params: idParamSchema }), controller.getAssignment);
router.post(
  '/assignments/:id/accept',
  validate({ params: idParamSchema, body: acceptSchema }),
  controller.accept,
);
router.post(
  '/assignments/:id/decline',
  validate({ params: idParamSchema, body: declineSchema }),
  controller.decline,
);
router.get('/assignments/:id/navigation', validate({ params: idParamSchema }), controller.navigation);
router.patch(
  '/assignments/:id/status',
  validate({ params: idParamSchema, body: statusSchema }),
  controller.updateAssignmentStatus,
);

router.post('/location', validate({ body: locationSchema }), controller.postLocation);

export default router;
