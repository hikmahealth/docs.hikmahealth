---
title: "Key Concepts"
description: "Core data concepts in Hikma Health and how they relate to each other."
order: 2
---

## Key Concepts

This page describes the core data concepts in Hikma Health and how they relate to each other. Understanding these concepts will help you make the most of the system when recording and managing patient data.

## Patient Records

A patient record is the central entity in Hikma Health. Every visit, event, appointment, prescription, vital sign, and diagnosis is linked to a patient.

Patient registration forms are fully dynamic. Administrators create and customize registration forms through the admin portal. This means the fields you see when registering a patient are configured by your organization — not hardcoded into the app.

Every patient has a set of base fields that are always available:

| Field | Description |
|---|---|
| Given name | Patient's first name |
| Surname | Patient's last name |
| Date of birth | In `YYYY-MM-DD` format |
| Sex | Male or female |
| Phone | Contact number |
| Hometown | Place of origin |
| Citizenship | Nationality |
| Camp | Refugee camp or settlement (if applicable) |
| Government ID | National or government-issued ID |
| External patient ID | ID from referral systems or other sources |
| Photo | Optional patient photo |

Beyond these base fields, your organization can define custom fields of various types — text, number, date, select dropdown, checkbox, and boolean — through the admin portal. Custom field values are stored as patient additional attributes linked to the patient record.

## Visits

A visit represents a single patient encounter at a clinic. When a patient arrives and is seen by a provider, a visit is created to group together everything that happens during that encounter.

Each visit records:

| Field | Description |
|---|---|
| Patient | The patient being seen |
| Clinic | Where the visit takes place |
| Provider | The healthcare worker conducting the visit |
| Check-in time | When the patient was checked in |

A visit on its own is a container. The clinical data collected during the visit is stored as events within that visit.

## Events and Event Forms

Events are the primary way clinical data is recorded during a visit. Each event is a submission of an event form — a dynamic form designed by administrators in the admin portal.

Event forms are fully dynamic. Your organization defines what forms are available, what fields they contain, and which clinics can use them. This means the clinical data you collect is entirely customizable to your workflows. Common examples include history-taking forms, physical examination forms, treatment forms, and counseling forms.

Event form fields support a range of input types:

- Free text and numbers
- Radio buttons and checkboxes
- Date pickers
- Dropdown selects
- Diagnosis fields (with ICD code search)
- Medication fields (with dosage details)
- File uploads
- Grouped inputs

Each event stores the completed form data, the form template it was based on, and which provider recorded it.

## Vitals

Vitals are structured recordings of a patient's physiological measurements. They are recorded as dedicated entries within the patient file and can optionally be linked to a specific visit.

The following measurements are supported:

| Vital Sign | Unit |
|---|---|
| Systolic blood pressure | mmHg |
| Diastolic blood pressure | mmHg |
| Blood pressure position | Sitting, standing, or lying |
| Heart rate | bpm |
| Pulse rate | bpm |
| Oxygen saturation (SpO2) | % |
| Respiratory rate | breaths/min |
| Temperature | °C |
| Height | cm |
| Weight | kg |
| BMI | Calculated |
| Waist circumference | cm |
| Pain level | 0–10 scale |

> **Note:** We strongly recommend using the dedicated vitals entry within the patient file to record vital signs, rather than capturing them through event forms. Dedicated vitals entries are stored in a structured format, making them easier to track over time, trend, and query across patients. When vitals are embedded in event forms, they are stored as free-form data and lose this structure.

## Diagnoses

Diagnoses (also referred to as patient problems) are structured records of a patient's clinical conditions. They are recorded as dedicated entries within the patient file and use standardized medical coding.

Each diagnosis entry captures:

| Field | Description |
|---|---|
| Problem code | A standardized code (ICD-10 or ICD-11) |
| Problem label | Human-readable description of the condition |
| Code system | Which coding system is used (ICD-10, ICD-11, SNOMED) |
| Clinical status | Active, in remission, resolved, or unknown |
| Verification status | Provisional, confirmed, refuted, or unconfirmed |
| Severity score | Optional, on a 1–10 scale |
| Onset date | When the condition started (optional) |
| End date | When the condition resolved (optional) |

The app includes a built-in ICD-11 diagnosis search that lets providers search by code or description using fuzzy matching, making it fast to find the right diagnosis.

> **Note:** We strongly recommend using the dedicated diagnosis entry within the patient file to record diagnoses, rather than capturing them through event forms. Structured diagnosis entries use standardized codes, support clinical and verification statuses, and enable meaningful reporting across your patient population. Diagnoses embedded in event forms lack this structure and are harder to aggregate.

## Appointments

Appointments track scheduled and walk-in patient visits. They support multi-department routing, allowing a single appointment to be tracked across multiple departments within a clinic.

Each appointment records:

| Field | Description |
|---|---|
| Patient | Who the appointment is for |
| Clinic | Where the appointment takes place |
| Provider | Assigned healthcare worker (optional) |
| Date and time | Scheduled appointment time |
| Duration | Expected length in minutes (optional) |
| Reason | Why the patient is being seen |
| Notes | Additional context |
| Walk-in | Whether this is a walk-in rather than scheduled |
| Departments | Which departments the patient needs to visit |
| Status | Current state of the appointment |

**Appointment statuses:** pending, scheduled, checked in, in progress, confirmed, cancelled, completed.

For appointments that involve multiple departments, each department tracks its own status independently — including who saw the patient and when — so staff can see at a glance which departments the patient still needs to visit.

## Prescriptions

A prescription is an order for one or more medications for a patient. Prescriptions can be linked to a specific visit and are assigned a priority and status to support pharmacy workflows.

Each prescription records:

| Field | Description |
|---|---|
| Patient | Who the prescription is for |
| Provider | Who wrote the prescription |
| Priority | Emergency, high, normal, or low |
| Status | Pending, prepared, picked up, partially picked up, not picked up, cancelled, expired |
| Pickup clinic | Where the patient should collect the medication (optional) |
| Prescribed at | When the prescription was written |
| Expiration date | When the prescription expires |
| Notes | Additional instructions |

### Prescription Items

Each prescription contains one or more prescription items, each representing a single medication:

| Field | Description |
|---|---|
| Drug | Selected from the drug catalogue |
| Dosage instructions | How to take the medication |
| Quantity prescribed | Amount ordered |
| Quantity dispensed | Amount actually given |
| Refills authorized | Number of refills allowed |
| Refills used | Number of refills consumed |
| Item status | Active, completed, or cancelled |

### Dispensing

When a prescription item is dispensed, a dispensing record is created that tracks:

- Which drug and batch were used
- The quantity dispensed
- Days supply
- Who dispensed it and when

Dispensing is done from the pharmacy view, where staff can select specific inventory batches to fulfill each prescription item. Inventory quantities are updated accordingly.

## Drug Catalogue

The drug catalogue is the master list of medications available across your organization. Each entry describes a single drug formulation:

| Field | Description |
|---|---|
| Generic name | Non-proprietary drug name |
| Brand name | Commercial name (optional) |
| Form | Tablet, syrup, capsule, cream, injection, etc. |
| Route | Oral, IV, IM, topical, inhalation, etc. |
| Dosage quantity | Strength per unit (e.g., 500) |
| Dosage units | Unit of strength (e.g., mg) |
| Manufacturer | Drug manufacturer (optional) |
| Barcode | For scanning (optional) |
| Sale price / currency | Cost information (optional) |
| Min / max stock level | For inventory management |
| Controlled substance | Whether the drug is a controlled substance |
| Requires refrigeration | Cold chain flag |
| Active | Whether the drug is currently in use |

The drug catalogue is managed through the admin portal and synced to all devices. When creating a prescription, providers select medications from this catalogue.

## Clinic Inventory

Each clinic maintains its own inventory, tracked by batch:

| Field | Description |
|---|---|
| Drug | Which drug from the catalogue |
| Batch number | Manufacturer's batch/lot number |
| Expiry date | When the batch expires |
| Quantity available | Current stock |
| Reserved quantity | Stock reserved for pending prescriptions |
| Last counted at | Most recent physical count |

## How It All Fits Together

```
Patient
  │
  ├── Visits
  │     └── Events (dynamic form submissions)
  │
  ├── Vitals (structured measurements)
  │
  ├── Diagnoses (coded clinical problems)
  │
  ├── Appointments
  │
  └── Prescriptions
        └── Prescription Items
              └── Dispensing Records
                    └── Clinic Inventory (batch tracking)
                          └── Drug Catalogue
```

A patient comes to the clinic and either has a scheduled appointment or walks in. A visit is created for the encounter. During the visit, providers fill out event forms to capture clinical data, record vitals, and document diagnoses. If medication is needed, a prescription is created with one or more prescription items selected from the drug catalogue. The pharmacy staff then dispenses the medication from available clinic inventory batches.
