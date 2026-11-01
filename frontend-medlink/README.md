# Swasthya Setu - patient web app

React + Vite frontend for the MedLink360 API. All screens read and write live
data; there is no mock layer.

## Running

```bash
npm install
npm run dev      # http://localhost:5173
```

The API base URL comes from `.env`:

```
VITE_API_URL=https://medlink-8vbl.onrender.com/api
```

Point it at `http://localhost:5000/api` to develop against a local backend.
Restart `npm run dev` after changing it - Vite only reads env at startup.

## How the API layer is organised

| File | Responsibility |
| --- | --- |
| `src/lib/apiClient.js` | fetch wrapper: base URL, bearer token, `{success,data,meta}` unwrapping, 401 refresh-and-retry, `ApiError` |
| `src/lib/api.js` | one function per endpoint, grouped by backend module |
| `src/lib/adapters.js` | converts API documents into the props the UI components expect |
| `src/context/AuthContext.jsx` | session state, login/register/logout, localStorage persistence |
| `src/hooks/useAsync.js` | `{ data, error, loading, reload }` for any loader |

Tokens live in `localStorage` under `ss.accessToken` / `ss.refreshToken`.
Access tokens last 15 minutes; the client swaps in a new one automatically and
only drops you to the login screen when the refresh token is also rejected.

## Screen to endpoint map

| Screen | Endpoints |
| --- | --- |
| Login / Register | `POST /auth/login`, `POST /auth/register` |
| Home | `GET /patients/dashboard`, `GET /audit-logs`, `PATCH /reminders/:id/adherence` |
| Appointments | `GET /appointments/my`, `PATCH /appointments/:id/cancel`, `PATCH /appointments/:id/reschedule` |
| Find Doctors | `GET /doctors`, `GET /doctors/:id/slots`, `POST /appointments` |
| Records | `GET /documents/my`, `POST /documents/upload`, `GET /documents/:id`, `DELETE /documents/:id` |
| Profile | `GET/PUT /users/me`, `GET/PUT /patients/me`, `GET /patients/medical-history`, `GET/POST /emergency-contacts`, `POST /auth/change-password` |
| Header | `GET /notifications`, `PATCH /notifications/read-all` |

## Admin console

Signing in with an admin account swaps the patient app for the review console
(`src/pages/admin/`). Same session and API client, different surface.

| Tab | Endpoints |
| --- | --- |
| Overview | `GET /admin/dashboard` |
| Verifications | `GET /admin/verifications`, `PATCH /admin/verifications/:userId` |
| Users | `GET /admin/users`, `PATCH /admin/users/:id/status` |
| Audit log | `GET /admin/audit-logs` |

Verifying a staff account does two things at once: it flips
`verificationStatus` to `verified` *and* the user's account status to `active`,
which is what lets a doctor publish availability and appear in patient search.

Note `PATCH /admin/verifications/:id` takes the staff member's **user** id, not
their profile id.

## Doctor console

Doctor accounts get their own surface (`src/pages/doctor/`).

| Tab | Endpoints |
| --- | --- |
| Overview | `GET /doctors/dashboard` |
| Appointments | `GET /doctors/appointments`, `PATCH /doctors/appointments/:id/status` |
| Availability | `GET /doctors/availability`, `POST /doctors/availability` |
| Practice profile | `GET /doctors/me`, `PUT /doctors/me` |

A patient booking arrives as `requested`. It is not a real appointment until
the doctor confirms it, which is what the Appointments tab is for.

Availability windows must divide evenly into the slot length - 09:00 to 17:00
works with 30 minutes but is rejected with 45.

## Things worth knowing

- **Only verified doctors appear in search.** A doctor account is invisible
  until an admin verifies it, which also activates the account so it can
  publish availability.
- **Booking uses real slots.** The modal reads `GET /doctors/:id/slots` for the
  chosen day; a doctor with no published availability shows no times.
- **Uploads need the bearer token on download too**, so files are fetched as a
  blob rather than linked directly.
- **The free Render instance sleeps** after 15 minutes idle. The first request
  then takes ~50 seconds; the client surfaces this as a "server may be waking
  up" message rather than a generic failure.
