import { Router } from 'express';
import { authenticate } from '../../../middleware/authenticate';
import { validate } from '../../../middleware/validate';
import * as controller from './medicines.controller';
import {
  addPatientMedicationSchema,
  explanationQuerySchema,
  idParamSchema,
  listPatientMedicationsSchema,
  searchMedicinesSchema,
} from './medicines.validation';

const router = Router();
router.use(authenticate);

router.get('/search', validate({ query: searchMedicinesSchema }), controller.search);
router.get('/patient', validate({ query: listPatientMedicationsSchema }), controller.listForPatient);
router.post('/patient', validate({ body: addPatientMedicationSchema }), controller.addForPatient);
router.get('/:id/explanation', validate({ params: idParamSchema, query: explanationQuerySchema }), controller.explanation);
router.get('/:id', validate({ params: idParamSchema }), controller.getOne);

export default router;
