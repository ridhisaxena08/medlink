import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as controller from './medicalRecords.controller';
import {
  createRecordSchema,
  idParamSchema,
  listRecordsSchema,
  updateRecordSchema,
} from './medicalRecords.validation';

const router = Router();
router.use(authenticate);

router.post('/', validate({ body: createRecordSchema }), controller.create);
router.get('/', validate({ query: listRecordsSchema }), controller.list);
router.patch('/:id', validate({ params: idParamSchema, body: updateRecordSchema }), controller.update);
router.delete('/:id', validate({ params: idParamSchema }), controller.remove);

export default router;
