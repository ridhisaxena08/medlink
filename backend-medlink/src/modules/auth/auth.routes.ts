import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authLimiter } from '../../middleware/rateLimiter';
import { validate } from '../../middleware/validate';
import * as controller from './auth.controller';
import {
  changePasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from './auth.validation';

const router = Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), controller.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), controller.login);
router.post('/refresh', authLimiter, validate({ body: refreshSchema }), controller.refresh);
router.post('/logout', authenticate, validate({ body: logoutSchema }), controller.logout);
router.post(
  '/change-password',
  authenticate,
  authLimiter,
  validate({ body: changePasswordSchema }),
  controller.changePassword,
);

export default router;
