import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { upload } from '../../middleware/upload';
import { validate } from '../../middleware/validate';
import * as controller from './files.controller';
import { idParamSchema, listDocumentsSchema, uploadSchema } from './files.validation';

const router = Router();
router.use(authenticate);

router.post('/upload', upload.single('file'), validate({ body: uploadSchema }), controller.upload);
/** Alias so the documents-facing clients can POST /api/documents directly. */
router.post('/', upload.single('file'), validate({ body: uploadSchema }), controller.upload);
router.get('/', validate({ query: listDocumentsSchema }), controller.list);
router.get('/my', validate({ query: listDocumentsSchema }), controller.list);
router.get('/:id/meta', validate({ params: idParamSchema }), controller.getMeta);
router.get('/:id', validate({ params: idParamSchema }), controller.download);
router.delete('/:id', validate({ params: idParamSchema }), controller.archive);

export default router;
