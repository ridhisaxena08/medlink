import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './location.controller';
import { nearbySchema, shareLocationSchema, validateLocationSchema } from './location.validation';

const router = Router();
router.use(authenticate);

router.post('/validate', validate({ body: validateLocationSchema }), controller.validateLocation);
router.post('/share', validate({ body: shareLocationSchema }), controller.share);
router.get('/nearby', validate({ query: nearbySchema }), controller.nearby);

export default router;
