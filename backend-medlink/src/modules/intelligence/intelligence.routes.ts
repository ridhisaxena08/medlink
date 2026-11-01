import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { intelligenceLimiter } from '../../middleware/rateLimiter';
import { upload } from '../../middleware/upload';
import { validate } from '../../middleware/validate';
import * as controller from './intelligence.controller';
import { chatSchema, speakSchema } from './intelligence.validation';
import { identifySchema, scanSchema } from './ocr/ocr.validation';

const router = Router();
router.use(authenticate);

router.post('/chat', intelligenceLimiter, validate({ body: chatSchema }), controller.chat);
router.post('/scan', intelligenceLimiter, upload.single('image'), validate({ body: scanSchema }), controller.scan);
router.post('/identify', intelligenceLimiter, validate({ body: identifySchema }), controller.identify);
router.post('/speak', intelligenceLimiter, validate({ body: speakSchema }), controller.speak);

export default router;
