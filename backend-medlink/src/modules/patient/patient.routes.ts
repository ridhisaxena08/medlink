import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { ROLES } from '../../shared/constants';
import {
  addPatientMedicationSchema,
  listPatientMedicationsSchema,
  stopMedicationSchema,
} from '../intelligence/medicines/medicines.validation';
import {
  createRecordSchema,
  idParamSchema,
  listRecordsSchema,
} from '../medical-records/medicalRecords.validation';
import * as controller from './patient.controller';
import { patientIdParamSchema, updatePatientProfileSchema } from './patient.validation';

const router = Router();
router.use(authenticate);

/* ---- the signed-in patient ---- */
router.get('/me', authorize(ROLES.PATIENT), controller.getMe);
router.put('/me', authorize(ROLES.PATIENT), validate({ body: updatePatientProfileSchema }), controller.updateMe);
router.get('/dashboard', authorize(ROLES.PATIENT), controller.dashboard);

router.get('/medical-history', validate({ query: listRecordsSchema }), controller.listHistory);
router.post('/medical-history', validate({ body: createRecordSchema }), controller.addHistory);

router.get('/medicines', validate({ query: listPatientMedicationsSchema }), controller.listMedicines);
router.post('/medicines', validate({ body: addPatientMedicationSchema }), controller.addMedicine);
router.patch('/medicines/:id/confirm', validate({ params: idParamSchema }), controller.confirmMedicine);
router.patch(
  '/medicines/:id/stop',
  validate({ params: idParamSchema, body: stopMedicationSchema }),
  controller.stopMedicine,
);

/* ---- authorised access to another patient (consent/assignment enforced) ---- */
router.get('/:patientId', validate({ params: patientIdParamSchema }), controller.getPatient);
router.get('/:patientId/dashboard', validate({ params: patientIdParamSchema }), controller.patientDashboard);

export default router;
