import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import { listAuditSchema } from '../audit/audit.validation';
import * as controller from './admin.controller';
import {
  idParamSchema,
  listUsersSchema,
  updateUserStatusSchema,
  verificationQueueSchema,
  verifyEntitySchema,
} from './admin.validation';

const router = Router();
router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/dashboard', controller.dashboard);
router.get('/users', validate({ query: listUsersSchema }), controller.listUsers);
router.patch(
  '/users/:id/status',
  validate({ params: idParamSchema, body: updateUserStatusSchema }),
  controller.updateUserStatus,
);

router.get('/verifications', validate({ query: verificationQueueSchema }), controller.verificationQueue);
router.patch(
  '/verifications/:id',
  validate({ params: idParamSchema, body: verifyEntitySchema }),
  controller.verifyEntity,
);

router.get('/audit-logs', validate({ query: listAuditSchema }), controller.auditLogs);
router.get('/access-report', controller.accessReport);

export default router;
