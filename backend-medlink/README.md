# MedLink360 Backend

One Express + TypeScript + MongoDB server covering all five MedLink360 roles —
patient, doctor, ASHA worker, hospital/admin, emergency responder — plus the
shared services they depend on and the MedLink Intelligence (Saathi) module.

```
Node 20+ · TypeScript 5 · Express 4 · Mongoose 8 · Zod · JWT
```

## Quick start

```bash
cp .env.example .env          # already done on first setup
npm install
# A plain `mongod` works for development; a replica set (or Atlas) makes the
# multi-collection registration writes atomic. See "Transactions" below.
npm run seed                  # admin account + verified medicine/interaction catalogue
npm run dev                   # http://localhost:5000
open http://localhost:5000/docs   # Swagger UI (the site root redirects here)
```

Seeded admin: `+919999900001` / `Admin@12345` — change it before any shared deployment.

| Script | What it does |
| --- | --- |
| `npm run dev` | Hot-reloading dev server |
| `npm run build` / `npm start` | Compile to `dist/` and run |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit, wiring, contract and integration tests |
| `npm run seed` | Idempotent development seed |
| `npm run docs` | Print the Swagger URL and validate the spec parses |

### Transactions

Registration flows write across `users` and a profile collection. On a replica
set they run in one transaction; on a standalone `mongod` the helper in
`src/shared/utils/transaction.ts` detects the unsupported deployment, logs a
warning and replays the writes sequentially — so development is never blocked,
while production keeps atomicity. `connectDatabase()` also builds every
collection and index up front, because a transaction cannot create a collection.

## Response envelope

```jsonc
// success
{ "success": true, "data": { }, "meta": { "page": 1, "limit": 20, "total": 42, "totalPages": 3 } }
// failure
{ "success": false, "error": { "code": "FORBIDDEN", "message": "...", "details": [] }, "requestId": "…" }
```

Auth is `Authorization: Bearer <accessToken>`. Access tokens are short-lived;
refresh tokens rotate on every use and reuse of a retired token revokes every
session on the account.

## The access model

**This is the part that matters.** A role never grants access to patient data on
its own. Every read or write that touches a patient goes through one gate —
`src/shared/services/access.service.ts` — which requires one of:

| Basis | Who | Condition |
| --- | --- | --- |
| `self` | the patient | it's their own record |
| `consent` | anyone | an active, unexpired `consents` row covering the requested **scope** |
| `treatment_relationship` | doctor | a non-cancelled appointment or an existing consultation with that patient |
| `asha_assignment` | ASHA worker | an unexpired `ashaAssignments` row **and** a matching active consent — both, always |
| `hospital_relationship` | hospital | the patient has an appointment or emergency at that facility |
| `emergency_grant` | responder | a time-boxed grant recorded on that specific emergency request |

Scopes are fine-grained (`profile`, `medical_history`, `documents`,
`medications`, `reminders`, `appointments`, `prescriptions`, `emergency`,
`location`, `sms`), so consent for a consultation does not expose prescriptions
or SMS. Denials are written to `auditLogs` with the actor, the subject, the
scope and the reason, and surface in `GET /api/admin/access-report`.

Consequences that are enforced in code, not just documented:

- An ASHA worker who is assigned but lacks consent sees a name and nothing else.
- Revoking consent takes effect on the next request — and on the next offline sync.
- Assisted consent (recorded by someone other than the patient) is rejected
  unless it carries non-in-app evidence (`otp`, `verbal_recorded`, `paper`).
- ASHA workers cannot assign themselves patients; only hospitals and admins assign.
- Responders see a clinical snapshot captured at SOS time, and only while the
  incident is open and their grant is live.
- Suspending an account revokes its sessions immediately rather than waiting for
  token expiry.

## Safety rules in the Intelligence module

- **Medications** added by anyone other than the patient stay `confirmedByPatient: false`.
- **Reminders** created by anyone other than the patient are `proposed`; only the
  patient can activate a schedule. The engine refuses to invent times for
  "as needed" or uninterpretable frequencies and says so.
- **Prescription parsing** always returns `verified: false` with per-item
  confidence and ranked candidates; a human verifies before anything becomes a
  medication.
- **Interaction checking** is rule-based against reviewed data, returns
  `unknownIngredients`, and states plainly that an empty result is not safety.
- **The assistant** never diagnoses; it escalates red-flag symptoms (English and
  Hindi) and attaches the user's health context only on explicit opt-in.
- **SMS** requires a prepared-then-approved body, SMS-scope consent when sending
  for someone else, and a verified phone number.
- **OCR and identification** can run on device. `/api/intelligence/scan` is the
  optional online path; nothing offline depends on it, and `/identify` accepts
  text extracted locally.

## Offline and sync

`/api/offline-data/*` serves versioned, cursor-paged medicine and interaction
bundles so lookup and interaction checks keep working with no connectivity.

`/api/sync/push` is idempotent on `(deviceId, clientRecordId)` and authorises
every queued record exactly as its online equivalent — an offline queue is not a
bypass. `/api/sync/pull` recomputes the caller's authorised scope on every pull.

## Project layout

```
src/
├── config/          environment, database (+ ensureCollections), storage driver
├── middleware/      authenticate, authorize, validate, errorHandler, rateLimiter, upload
├── modules/
│   ├── auth/ users/ consent/ audit/ notifications/ files/ sync/ location/
│   ├── patient/ doctor/ asha/ hospital/ admin/ responder/
│   ├── appointments/ medical-records/ emergency/
│   └── intelligence/{ai,ocr,medicines,interactions,prescriptions,reminders,sms,voice}
├── shared/          constants, types, utils, services (access, audit, notification)
├── routes.ts  app.ts  server.ts
docs/openapi.yaml    160 documented operations, served at /docs and kept in sync by tests
```

Each business module follows `*.routes.ts → *.controller.ts → *.service.ts`
with `*.model.ts` and `*.validation.ts` alongside. Controllers do HTTP only;
services own the business rules and the access checks.

## Collections

`users`, `patientProfiles`, `doctorProfiles`, `ashaProfiles`, `ashaAssignments`,
`ashaFollowUps`, `hospitalProfiles`, `departments`, `responderProfiles`,
`appointments`, `consultations`, `medicalRecords`, `documents`, `prescriptions`,
`medicines`, `drugInteractions`, `patientMedications`, `reminders`,
`emergencyContacts`, `emergencyRequests`, `responderAssignments`,
`locationUpdates`, `consents`, `notifications`, `auditLogs`, `syncRecords`.

Document binaries live in object storage (`src/config/storage.ts`); MongoDB
keeps only metadata, the storage key and a checksum. The local driver is the
default; implement `StorageDriver` for S3/GCS without touching call sites.

Geospatial indexes (`2dsphere`) back doctor discovery, nearby-hospital lookup
and ambulance tracking.

## External providers

`ai`, `ocr`, `sms` and `tts` are interfaces with safe stub implementations
selected by `AI_PROVIDER` / `OCR_PROVIDER` / `SMS_PROVIDER` / `TTS_PROVIDER`.
The stubs keep every flow exercisable end to end: the SMS stub logs instead of
sending, the OCR stub returns no text (so clients fall back to on-device OCR),
and the TTS stub tells the client to use device speech. Swap in a real provider
by implementing the interface and registering it.

## API reference — Swagger

The server hosts an interactive explorer for all 160 operations:

| URL | What |
| --- | --- |
| `/docs` | Swagger UI (the site root `/` redirects here) |
| `/docs/openapi.json` | The spec as JSON |
| `/docs/openapi.yaml` | The spec as YAML (raw file) |

Click **Authorize**, paste an access token from `POST /api/auth/login`, and
*Try it out* works against the running server — the token persists across page
reloads. The spec's first `servers` entry is rewritten at load time to the host
and port this process is actually listening on, so requests go to the right
place without editing anything.

`docs/openapi.yaml` is the source of truth and is read from disk (not compiled
into `dist/`), so editing it and refreshing the page is enough in development.
`tests/contract.test.ts` asserts that every mounted route is documented and every
documented path exists, so the spec cannot drift from the code.

Set `SWAGGER_ENABLED=false` to turn the explorer off, or `SWAGGER_PATH=/api-docs`
to move it. Helmet's strict CSP applies everywhere; it is relaxed to allow inline
styles and scripts **only** on the docs path, which Swagger UI requires.

## Tests

```bash
npm test
```

- `tests/utils.test.ts` — geo, time, SMS segmentation, assistant escalation, state machine
- `tests/reminderEngine.test.ts` — schedule proposal and next-trigger computation
- `tests/prescriptionParser.test.ts` — dosing extraction and the never-verified guarantee
- `tests/app.test.ts` — wiring, error envelope, validation
- `tests/contract.test.ts` — routes ↔ OpenAPI
- `tests/swagger.test.ts` — explorer HTML, JSON/YAML spec, auth scheme, CSP scoping
- `tests/integration/accessControl.test.ts` — registration, token rotation, consent
  grant/scope/revocation, emergency state machine, slot validation, against a real
  MongoDB replica set (`mongodb-memory-server`)

## Not included

- Phone/email OTP verification (`phoneVerified` exists; the delivery flow does not)
- A scheduler process for `dispatchDueReminders()` and appointment reminders —
  the function is written and tested-by-construction, but nothing calls it on a timer
- Push notifications (recorded as `pending`; no provider wired)
- Real OCR, AI, SMS and TTS providers (stubs only)
- Turn-by-turn routing (navigation returns straight-line distance and a coarse ETA)
