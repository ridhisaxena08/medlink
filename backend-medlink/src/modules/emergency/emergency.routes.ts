import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { emergencyLimiter } from '../../middleware/rateLimiter';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import * as controller from './emergency.controller';
import {
  assignSchema,
  contactIdParamSchema,
  createContactSchema,
  createSosSchema,
  idParamSchema,
  listRequestsSchema,
  locationUpdateSchema,
  nearbyHospitalsSchema,
  statusUpdateSchema,
  updateContactSchema,
} from './emergency.validation';

const router = Router();
router.use(authenticate);

/* ---- SOS ---- */
router.post(
  '/sos',
  emergencyLimiter,
  authorize(ROLES.PATIENT, ROLES.ASHA),
  validate({ body: createSosSchema }),
  controller.createSos,
);
router.get('/my-requests', validate({ query: listRequestsSchema }), controller.myRequests);

/* ---- trusted contacts ---- */
router.post('/contacts', validate({ body: createContactSchema }), controller.addContact);
router.get('/contacts', controller.listContacts);
router.patch(
  '/contacts/:contactId',
  validate({ params: contactIdParamSchema, body: updateContactSchema }),
  controller.updateContact,
);
router.delete('/contacts/:contactId', validate({ params: contactIdParamSchema }), controller.deleteContact);

/* ---- facility discovery ---- */
router.get('/hospitals/nearby', validate({ query: nearbyHospitalsSchema }), controller.nearbyHospitals);

/* ---- request lifecycle ---- */
router.get('/requests/:id', validate({ params: idParamSchema }), controller.getRequest);
router.post(
  '/requests/:id/assign',
  authorize(ROLES.HOSPITAL, ROLES.ADMIN),
  validate({ params: idParamSchema, body: assignSchema }),
  controller.assign,
);
router.patch(
  '/requests/:id/status',
  validate({ params: idParamSchema, body: statusUpdateSchema }),
  controller.updateStatus,
);
router.post(
  '/requests/:id/location',
  validate({ params: idParamSchema, body: locationUpdateSchema }),
  controller.postLocation,
);
router.get('/requests/:id/tracking', validate({ params: idParamSchema }), controller.tracking);

export default router;
