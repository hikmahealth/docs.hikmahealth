---
title: "Permissions and Access Control"
description: "How Hikma Health's capability-based permission system controls user access across clinics."
order: 1
---

## Permissions and Access Control

Hikma Health uses a capability-based permission system to control what each user can do within the app. Permissions are scoped per clinic — a user can have different capabilities at different clinics — and are managed by administrators through the admin portal.

## For Administrators

### Roles and Default Capabilities

When creating a new user in the admin portal, you assign them one of four roles. Each role comes with a default set of capabilities that can be further customized.

| Role | Description |
|---|---|
| Super Admin | Full and complete control over the entire system across all clinics. Bypasses all permission checks. |
| Admin | Full control over data within their assigned clinic. Can manage records, prescriptions, and other users' work at that clinic. |
| Provider | Similar to Admin, but cannot delete records. Intended for doctors, nurses, and clinical officers who need to create and edit patient data. |
| Registrar | Can only register patients. Intended for front-desk staff who check patients in but do not record clinical data. |

These roles serve as starting points. They select a default set of capabilities for the user, but Hikma Health is at its core a capabilities-based system — Super Admins can override any individual capability for any user through the admin portal.

### Capabilities Reference

The following capabilities can be independently granted or revoked for each user at each clinic:

| Capability | What It Controls |
|---|---|
| Can register patients | Register new patients in the system |
| Can view history | View patient files, visit history, and charts |
| Can edit records | Create and edit visits, events, vitals, diagnoses, and appointments |
| Can edit other provider's events | Edit events, visits, and appointments created by other providers |
| Can prescribe medications | Create prescriptions and update prescription statuses |
| Can dispense medications | Dispense prescribed medications from pharmacy inventory |
| Can download patient reports | Download patient chart information |
| Can delete patient visits | Delete individual visits from a patient's history |
| Can delete patient records | Delete a patient and their entire chart |
| Is clinic admin | Grants all capabilities for that clinic, regardless of individual settings |

### Default Capabilities by Role

| Capability | Super Admin | Admin | Provider | Registrar |
|---|---|---|---|---|
| Can register patients | Yes | Yes | Yes | Yes |
| Can view history | Yes | Yes | Yes | No |
| Can edit records | Yes | Yes | Yes | No |
| Can edit other provider's events | Yes | Yes | No | No |
| Can prescribe medications | Yes | Yes | No | No |
| Can dispense medications | Yes | Yes | No | No |
| Can download patient reports | Yes | Yes | No | No |
| Can delete patient visits | Yes | Yes | No | No |
| Can delete patient records | Yes | Yes | No | No |
| Is clinic admin | Yes | Yes | No | No |

### Clinic Scoping

Permissions do not carry across clinics. A user who is an Admin at Clinic A does not automatically have any permissions at Clinic B. Each clinic's capabilities are assigned independently.

If a user works at multiple clinics, the Super Admin must explicitly assign capabilities for each clinic. This ensures that access is intentional and auditable — a provider granted prescribing rights at one clinic will not automatically gain those rights at another.

### Disabling Permissions

Super Admins can choose to turn off the permission system entirely from the admin portal. When disabled, all permission checks are bypassed and every user has full access. This can be useful during initial setup or for small deployments where fine-grained access control is not needed.

## For Users

### What You'll Experience

Your capabilities determine what actions are available to you in the app. If you attempt an action you don't have permission for, you'll see a message explaining that the action is not allowed. You will not see an error — the app simply informs you and prevents the action.

Some examples of what permissions control:

- **Registering a patient** — Only users with the registration capability can create new patient records.
- **Editing a visit** — Requires the edit records capability. If the visit was created by a different provider, you also need the "edit other provider's events" capability.
- **Prescribing medication** — Only users with the prescribe medications capability can create or update prescriptions.
- **Dispensing medication** — Only users with the dispense medications capability can fulfill prescriptions from the pharmacy view.
- **Deleting records** — Deleting visits and deleting patients are controlled by separate capabilities, and both are typically restricted to administrators.

If you believe you need additional access, contact your clinic administrator or Super Admin.

## For Developers

### Architecture

The permission system is built around three layers:

1. **Storage** — Permissions are stored in the `user_clinic_permissions` table in WatermelonDB, with one row per user-clinic pair. Each row contains boolean flags for every capability. Permissions sync from the server alongside all other data.
2. **Pure check logic** — The `UserClinicPermissions.Check` namespace (`app/models/UserClinicPermissions.ts`) contains pure functions with no side effects. All check functions return a `Result<true, PermissionDeniedError>` type for type-safe error handling.
3. **React hook** — `usePermissionGuard()` (`app/hooks/usePermissionGuard.ts`) subscribes to the current user's permissions via WatermelonDB observables, providing reactive updates when permissions change.

### Permission Check Cascade

Every permission check follows this decision cascade:

1. Is the permission system disabled globally? → **ALLOW**
2. Is the user's role `super_admin`? → **ALLOW**
3. Is the permissions object null (not found)? → **DENY**
4. Is `isClinicAdmin` true for this clinic? → **ALLOW**
5. Check the specific capability flag → **ALLOW** or **DENY**

### Operations Map

Rather than checking raw capability names throughout the codebase, screens reference named operations that map to one or more capabilities. This decouples UI actions from the underlying permission flags.

| Operation | Required Capability |
|---|---|
| `patient:register` | `canRegisterPatients` |
| `patient:edit` | `canEditRecords` |
| `patient:delete` | `canDeletePatientRecords` |
| `patient:downloadReport` | `canDownloadPatientReports` |
| `visit:create` | `canEditRecords` |
| `visit:delete` | `canDeletePatientVisits` |
| `event:create` | `canEditRecords` |
| `event:edit` | `canEditRecords` |
| `prescription:create` | `canPrescribeMedications` |
| `prescription:updateStatus` | `canPrescribeMedications` |
| `prescription:dispense` | `canDispenseMedications` |
| `vitals:create` | `canEditRecords` |
| `diagnosis:create` | `canEditRecords` |
| `diagnosis:edit` | `canEditRecords` |
| `appointment:create` | `canEditRecords` |
| `appointment:update` | `canEditRecords` |
| `appointment:markComplete` | `canEditRecords` |

### Using the Permission Hook

The `usePermissionGuard()` hook is the primary interface for checking permissions in React components:

```typescript
const { can, checkEditEvent } = usePermissionGuard()

// Simple check — returns a boolean
if (can("prescription:dispense")) {
  // show dispense button
}

// Editing events by other providers — special compound check
const result = checkEditEvent(event.recordedByUserId)
if (!result.ok) {
  Toast.show(result.error.message)
  return
}
```

### Check Composition

The `Check` namespace supports three composition modes for combining capabilities:

- **`requirePermission(name)`** — Requires a single capability.
- **`requireAll([...names])`** — Requires every listed capability (AND logic).
- **`requireAny([...names])`** — Requires at least one of the listed capabilities (OR logic).

### Editing Other Providers' Work

Editing an event has a special two-part check:

- If the current user created the event, only `canEditRecords` is required.
- If a different provider created the event, both `canEditRecords` and `canEditOtherProviderEvent` are required.

This prevents providers from accidentally or intentionally modifying each other's clinical notes unless explicitly permitted.

### Key Files

| File | Purpose |
|---|---|
| `app/models/UserClinicPermissions.ts` | Core permission logic, capability definitions, check functions, DB queries |
| `app/db/model/UserClinicPermissions.ts` | WatermelonDB model definition |
| `app/hooks/usePermissionGuard.ts` | React hook for runtime permission checks |
| `app/db/schema.ts` (lines 271–294) | Database table schema |
| `app/store/provider.ts` | User context store (userId, role, clinicId) |
| `test/models/UserClinicPermissions.test.ts` | Comprehensive test suite |
