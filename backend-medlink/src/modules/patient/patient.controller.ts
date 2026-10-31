import { ok, paginated } from '../../shared/utils/apiResponse';
import { authedHandler } from '../../shared/utils/asyncHandler';
import * as medicalRecords from '../medical-records/medicalRecords.service';
import * as medicines from '../intelligence/medicines/medicines.service';
import * as service from './patient.service';

export const getMe = authedHandler(async (req, res) => ok(res, await service.getProfile(req.user.id)));

export const updateMe = authedHandler(async (req, res) =>
  ok(res, await service.updateProfile(req.user.id, req.body)),
);

export const dashboard = authedHandler(async (req, res) => ok(res, await service.getDashboard(req.user.id)));

export const getPatient = authedHandler(async (req, res) =>
  ok(res, await service.getProfileFor(req.user, req.params.patientId)),
);

export const patientDashboard = authedHandler(async (req, res) =>
  ok(res, await service.getDashboardFor(req.user, req.params.patientId)),
);

export const listHistory = authedHandler(async (req, res) => {
  const { items, meta } = await medicalRecords.listRecords(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const addHistory = authedHandler(async (req, res) =>
  ok(res, await medicalRecords.createRecord(req.user, req.body)),
);

export const listMedicines = authedHandler(async (req, res) => {
  const { items, meta } = await medicines.listPatientMedications(req.user, req.query as never);
  return paginated(res, items, meta);
});

export const addMedicine = authedHandler(async (req, res) =>
  ok(res, await medicines.addPatientMedication(req.user, req.body)),
);

export const confirmMedicine = authedHandler(async (req, res) =>
  ok(res, await medicines.confirmPatientMedication(req.user, req.params.id)),
);

export const stopMedicine = authedHandler(async (req, res) =>
  ok(res, await medicines.stopPatientMedication(req.user, req.params.id, req.body?.reason)),
);
