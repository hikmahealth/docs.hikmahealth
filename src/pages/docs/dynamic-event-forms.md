---
title: Dynamic Event Forms
description: Create and manage forms from the administrators portal for all users to utilize
---

Through the Admin portal, users can create all the forms they need and have them available on the mobile applications for the beneficiaries. Event Forms in Hikma Health are customizable, dynamic forms that allow healthcare providers to capture various types of patient data during clinical visits.

---

## Table of Contents
1. [What are Event Forms?](#what-are-event-forms)
2. [Dynamic Form System](#dynamic-form-system)
3. [Input Types](#input-types)
4. [Form Properties](#form-properties)
5. [Event Form Builder Guide](#event-form-builder-guide)
6. [Form Renderer](#form-renderer)
7. [Best Practices](#best-practices)
8. [Technical Reference](#technical-reference)
9. [Troubleshooting](#troubleshooting)

---

## What are Event Forms?

The term "Event" is used to describe any and all interactions between a patient and a care provider.

Examples of Events include:
- Patient symptoms
- Patient treatment plans
- Dental examination
- Lab testing & investigations
- Physical examinations
- Triage assessments
- Specialist consultations
- Discharge summaries

Event Forms are structured data collection templates that define:
- **What data to collect** (field types and configurations)
- **How to display it** (input types and options)
- **Validation rules** (required fields, data types)
- **Language support** (multilingual forms)

Each form can be associated with patient events during visits and stores data in a structured format for analysis and reporting.

---

## Dynamic Form System

### How Forms are Dynamic

Event Forms are **completely dynamic** and configurable without code changes:

1. **Runtime Creation**: Forms are created through a visual builder interface in the Admin portal, not hardcoded
2. **Field Flexibility**: Add, remove, or reorder fields at any time
3. **Type Safety**: Each field type has validation and structure
4. **Data Structure**: Form definitions are stored as JSON in the database
5. **Instant Updates**: Changes to forms are immediately available after syncing to mobile devices

### Form Data Structure

```json
{
  "id": "uuid",
  "name": "Physical Examination Form",
  "description": "Standard physical exam checklist",
  "language": "en",
  "is_editable": true,
  "is_snapshot_form": false,
  "form_fields": [
    {
      "id": "field-id-123",
      "fieldType": "free-text",
      "inputType": "text",
      "name": "Blood Pressure",
      "description": "Systolic/Diastolic",
      "required": true,
      "length": "short"
    }
    // ... more fields
  ]
}
```

---

## Input Types

Event Forms support 7 main field types, each with specific configurations:

### 1. Text Field (`free-text`)

Captures text or numeric input from users.

**Configuration:**
- `inputType`: `"text"`, `"number"`, `"email"`, `"password"`, `"tel"`
- `length`: `"short"` or `"long"` (for textarea)
- `units`: Optional array of measurement units (e.g., `["kg", "lb"]`)

**Use Cases:**
- Patient weight with units (kg/lb)
- Height measurements (cm/in)
- Temperature readings (°C/°F)
- Free-text notes
- Phone numbers, emails

**Example:**
```json
{
  "id": "weight-field",
  "fieldType": "free-text",
  "inputType": "number",
  "name": "Patient Weight",
  "description": "Enter the patient's current weight",
  "required": true,
  "length": "short",
  "units": ["kg", "lb"]
}
```

---

### 2. Binary/Checkbox Field (`binary`)

For yes/no or true/false questions.

**Configuration:**
- `inputType`: `"checkbox"`, `"radio"`, `"select"`
- `options`: Array of options (typically Yes/No)

**Use Cases:**
- Symptom presence (Has fever? Yes/No)
- Medical history questions
- Consent checkboxes

**Example:**
```json
{
  "id": "fever-field",
  "fieldType": "binary",
  "inputType": "checkbox",
  "name": "Patient has fever",
  "description": "Check if patient reports fever",
  "required": false,
  "options": [
    { "label": "Yes", "value": "yes" },
    { "label": "No", "value": "no" }
  ]
}
```

---

### 3. Options Field (`options`)

Multiple choice questions with single or multiple selections.

**Configuration:**
- `inputType`: `"radio"` (single), `"checkbox"` (multiple), `"select"` (dropdown)
- `multi`: `true` for multiple selections, `false` for single
- `options`: Array of choices

**Use Cases:**
- Symptom selection (multiple)
- Pain level (single choice)
- Treatment preferences
- Risk factors

**Example:**
```json
{
  "id": "symptoms-field",
  "fieldType": "options",
  "inputType": "checkbox",
  "multi": true,
  "name": "Current Symptoms",
  "description": "Select all symptoms the patient is experiencing",
  "required": true,
  "options": [
    { "label": "Cough", "value": "cough" },
    { "label": "Fever", "value": "fever" },
    { "label": "Headache", "value": "headache" },
    { "label": "Fatigue", "value": "fatigue" },
    { "label": "Nausea", "value": "nausea" }
  ]
}
```

---

### 4. Date Field (`date`)

Captures date information.

**Configuration:**
- `inputType`: `"date"`
- Optional `min`/`max` date constraints

**Use Cases:**
- Date of symptom onset
- Last vaccination date
- Surgery dates
- Follow-up appointment dates

**Example:**
```json
{
  "id": "onset-date",
  "fieldType": "date",
  "inputType": "date",
  "name": "Symptom Onset Date",
  "description": "When did symptoms first appear?",
  "required": true
}
```

---

### 5. Medicine Field (`medicine`)

Complex field for prescribing medications with dosage, route, and schedule.

**Configuration:**
- `inputType`: `"input-group"`
- `options`: Array of medicine names (autocomplete)
- `fields`: Object containing medication details

**Medicine Subfields:**
- `name`: Medicine name
- `route`: Administration route (oral, IV, topical, etc.)
- `form`: Medicine form (tablet, syrup, injection, etc.)
- `frequency`: How often to take (e.g., "3 times daily")
- `intervals`: Time between doses
- `dose`: Amount per dose
- `doseUnits`: Unit of measurement (mg, mL, etc.)
- `duration`: How long to take
- `durationUnits`: Time unit (days, weeks, months)

**Available Routes:**
`oral`, `sublingual`, `rectal`, `topical`, `inhalation`, `intravenous`, `intramuscular`, `intradermal`, `subcutaneous`, `nasal`, `ophthalmic`, `otic`, `vaginal`, `transdermal`, `other`

**Available Forms:**
`tablet`, `syrup`, `ampule`, `suppository`, `cream`, `drops`, `bottle`, `spray`, `gel`, `lotion`, `inhaler`, `capsule`, `injection`, `patch`, `other`

**Dose Units:**
`mg`, `g`, `mcg`, `mL`, `L`, `units`

**Duration Units:**
`hours`, `days`, `weeks`, `months`, `years`

**Example:**
```json
{
  "id": "medication-field",
  "fieldType": "medicine",
  "inputType": "input-group",
  "name": "Prescribed Medication",
  "description": "Enter medication details",
  "required": true,
  "options": ["Amoxicillin", "Paracetamol", "Ibuprofen"],
  "fields": {
    "name": "Medication Name",
    "route": ["oral", "intravenous", "topical"],
    "form": ["tablet", "syrup", "injection"],
    "frequency": "Frequency",
    "dose": "Dose",
    "doseUnits": ["mg", "mL"],
    "duration": "Duration",
    "durationUnits": ["days", "weeks"]
  }
}
```

**Important Notes:**
- Medicine inputs have mandatory fields and must be tested carefully
- Test the appearance after every change as inputs may interact with each other
- This is a custom input type with special handling

---

### 6. Diagnosis Field (`diagnosis`)

ICD-11 diagnosis picker with search functionality.

**Configuration:**
- `inputType`: `"select"`
- `options`: Searchable ICD-11 diagnosis codes
- Supports multiple diagnoses

**Use Cases:**
- Primary diagnosis
- Secondary diagnoses
- Differential diagnoses

**Example:**
```json
{
  "id": "diagnosis-field",
  "fieldType": "diagnosis",
  "inputType": "select",
  "name": "ICD-11 Diagnosis",
  "description": "Search and select diagnosis",
  "required": true,
  "options": []
}
```

**Important Notes:**
- This is a custom input type with special handling
- The diagnosis field name is reserved and cannot be used for other purposes

---

### 7. File Field (`file`)

Upload files, images, or documents.

**Configuration:**
- `inputType`: `"file"`
- `allowedMimeTypes`: Restrict file types (`["image/png", "image/jpeg", "application/pdf"]`)
- `multiple`: Allow multiple files
- `minItems`: Minimum number of files
- `maxItems`: Maximum number of files

**Use Cases:**
- Medical images
- Lab results (PDF)
- Patient photos
- Consent forms

**Example:**
```json
{
  "id": "xray-upload",
  "fieldType": "file",
  "inputType": "file",
  "name": "X-Ray Images",
  "description": "Upload chest X-ray images",
  "required": false,
  "allowedMimeTypes": ["image/png", "image/jpeg"],
  "multiple": true,
  "minItems": 1,
  "maxItems": 5
}
```

---

## Form Properties

### Core Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string (UUID) | Unique identifier for the form |
| `name` | string | Display name of the form |
| `description` | string | Brief description of form purpose |
| `language` | string | Language code (e.g., "en", "es", "ar") |
| `is_editable` | boolean | Whether form responses can be edited after submission |
| `is_snapshot_form` | boolean | If true, captures point-in-time data (non-editable) |
| `form_fields` | array | Array of field definitions |
| `metadata` | object | Additional custom metadata |

### Field Properties

Every field has these base properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique field identifier |
| `fieldType` | string | Yes | Type of field (see Input Types) |
| `inputType` | string | Yes | How the field is rendered |
| `name` | string | Yes | Field label shown to user |
| `description` | string | No | Help text for the field |
| `required` | boolean | Yes | Whether field must be filled |

### Reserved Field Names

The following field names are **reserved** and cannot be used:
- `diagnosis`
- `medicine`

These names are reserved because they have special handling in the system.

---

## Event Form Builder Guide

### Accessing the Form Builder

1. Navigate to **Event Forms** in the sidebar of the Admin portal
2. Click **"Register New Form"** or **"Edit"** on an existing form

### Creating a New Form

#### Step 1: Basic Information

Fill in the form metadata:
- **Form Title**: Give your form a descriptive name
- **Form Language**: Select the primary language
- **Form Description**: Explain when to use this form
- **Is Editable**: Check if responses can be modified later
- **Is Snapshot**: Check if this captures one-time data

#### Step 2: Adding Fields

Click the appropriate button to add a field type:
- **Text** - For text or numeric input
- **Date** - For date selection
- **Select** - For dropdown choices
- **Radio** - For single-choice options
- **File** - For file uploads
- **Medicine** - For prescriptions
- **Diagnosis** - For ICD-11 diagnoses

#### Step 3: Configuring Fields

For each field you add, configure:

1. **Field Name**: The label users will see
2. **Description**: Optional help text
3. **Required**: Whether this field is mandatory
4. **Type-specific options**:
   - For **Text**: Choose short/long, add units if needed
   - For **Select/Radio**: Add your options (one per line or comma-separated)
   - For **Medicine**: Specify available medicines
   - For **File**: Set allowed file types and limits

#### Step 4: Reordering Fields

Drag and drop fields to reorder them. The order in the builder is the order users will see.

#### Step 5: Preview

The right panel shows a **live preview** of your form as you build it.

#### Step 6: Save

Click **"Save"** to create/update the form. It becomes immediately available after mobile devices sync.

### Editing Existing Forms

1. Go to **Event Forms** → **Forms List**
2. Click **"Edit"** on the form you want to modify
3. Make your changes
4. Click **"Save"**

**⚠️ Important Notes:**
- Editing a form affects all future uses
- Existing form responses are not modified
- As forms change and get updated, all data collected with the new forms will be slightly different from previous data
- When form inputs are edited and updated, keep in mind that users who try to edit old entries following the old schemas will have missing fields/entries
- Consider creating a new version for major changes

### Form Settings

#### Is Editable
- ✅ **Checked**: Users can edit submitted responses
- ❌ **Unchecked**: Responses are locked after submission

**Use Cases for Non-Editable:**
- Legal documentation
- Consent forms
- Lab results
- Audit trails

#### Is Snapshot Form
- ✅ **Checked**: Captures data at a specific point in time and shows up under the patient profile for quick access to interesting patient histories
- ❌ **Unchecked**: General purpose form

**Use Cases for Snapshot:**
- Vital signs at admission
- Pre-operative assessment
- Triage data
- Baseline measurements

### Language-Specific Forms

**Important:** Forms in a specific language only show up when the mobile app is set to that specific language. You can disable this behavior in the code by removing the language-specific query to show all forms regardless of language.

**Best Practice:** Create separate forms for each language and name them clearly:
- "Physical Exam (English)"
- "Physical Exam (Arabic)"
- "Physical Exam (Spanish)"

### Deleting Forms

1. Go to **Event Forms** → **Forms List**
2. Click **"Delete"** on the form
3. Confirm deletion

**⚠️ Important:**
- Deleted forms are soft-deleted (marked as deleted but not removed)
- Associated event data is preserved
- Forms cannot be recovered through the UI after deletion

---

## Form Renderer

The mobile application has a set of screens and components that interpret the JSON form data and render out a functioning form capable of recording and storing the information.

### How It Works

1. **Form Sync**: Mobile apps sync form definitions from the database
2. **Dynamic Rendering**: The app interprets the JSON structure and renders appropriate input components
3. **Data Collection**: User input is collected and validated according to field rules
4. **Storage**: Completed forms are stored as JSON in the `metadata` field on both client and server

### Data Storage

- Forms are stored in the `event_forms` table
- Field definitions are stored as JSONB for flexibility
- Form responses are stored in the `events` table with `form_data` field
- All form data is stored as JSON on both the client (SQLite) and the server
- Being a JSON field, managing this data is more complex. Learn more here: https://www.sqlite.org/json1.html

### Input Customization on Mobile

- The input field components can be found inside the `components` folder
- There are as many types of input components as there are field types in the TypeScript definitions
- **Screen Size Considerations**: Keep in mind the screen sizes of your users when customizing fields
  - For users on smaller screens, it's not recommended to layout multiple fields in a row
  - Prefer column layouts for smaller screens
  - Test on actual devices (mobile/tablet) before deploying

---

## Best Practices

### Form Design

1. **Keep forms focused**: One form = one purpose
2. **Use clear names**: "Blood Pressure Reading" not "BP"
3. **Add descriptions**: Help users understand what to enter
4. **Group related fields**: Put related information together
5. **Minimize required fields**: Only mark essential fields as required

### Field Configuration

1. **Text Fields**:
   - Use "short" for single-line input
   - Use "long" for detailed notes
   - Add units for measurements
   - Use appropriate input types (number, email, tel)

2. **Options Fields**:
   - Keep option lists concise (< 10 items when possible)
   - Use radio buttons for 2-5 options
   - Use select dropdowns for 5+ options
   - Use checkboxes when multiple selections make sense

3. **Medicine Fields**:
   - Pre-populate common medicines in options
   - Include generic names
   - Consider local medicine availability
   - Test thoroughly as these have mandatory fields

4. **Required Fields**:
   - Only mark fields as required if data is essential
   - Consider workflow: Can form be partially filled and completed later?

### Multilingual Support

1. Create separate forms for each language
2. Use consistent field structures across languages
3. Name forms clearly: "Physical Exam (English)", "Physical Exam (Arabic)"
4. Consider right-to-left languages in field design

### Form Organization

1. **Use logical ordering**:
   - Patient identification → History → Examination → Diagnosis → Treatment
   
2. **Create form categories**:
   - Triage forms
   - Specialist consultations
   - Procedure documentation
   - Discharge summaries

3. **Version control**:
   - Include dates or version numbers in form names when creating updated versions
   - Example: "Intake Form v2 (2024)"

### Performance

1. **Limit form complexity**: Very large forms (50+ fields) may impact performance
2. **Consider breaking large forms**: Split into multiple focused forms
3. **Test with real data**: Validate forms with actual clinical workflows

### Data Quality

1. **Use validation**: Leverage input types (number, email, date)
2. **Provide examples**: Use descriptions to show expected formats
3. **Add units consistently**: Always specify units for measurements
4. **Use standard codes**: ICD-11 for diagnoses, standard drug names

### Testing New Forms

Before deploying a new form:
1. ✅ Fill out the form yourself with test data
2. ✅ Check the preview panel matches your intent
3. ✅ Test required field validation
4. ✅ Verify dropdown options are complete
5. ✅ Test on actual devices (mobile/tablet if applicable)
6. ✅ Have a colleague review for clarity

---

## Common Use Cases

### Example 1: Social History Form

```json
{
  "name": "Social History",
  "description": "Record patient social and lifestyle history",
  "language": "en",
  "is_editable": true,
  "is_snapshot_form": false,
  "form_fields": [
    {
      "id": "smoking-status",
      "fieldType": "options",
      "inputType": "radio",
      "multi": false,
      "name": "Smoking Status",
      "required": true,
      "options": [
        { "label": "Never", "value": "never" },
        { "label": "Former", "value": "former" },
        { "label": "Current", "value": "current" }
      ]
    },
    {
      "id": "alcohol-use",
      "fieldType": "options",
      "inputType": "radio",
      "multi": false,
      "name": "Alcohol Use",
      "required": true,
      "options": [
        { "label": "None", "value": "none" },
        { "label": "Occasional", "value": "occasional" },
        { "label": "Regular", "value": "regular" }
      ]
    },
    {
      "id": "occupation",
      "fieldType": "options",
      "inputType": "select",
      "multi": false,
      "name": "Occupation",
      "required": false,
      "options": [
        { "label": "Employed", "value": "employed" },
        { "label": "Unemployed", "value": "unemployed" },
        { "label": "Student", "value": "student" },
        { "label": "Retired", "value": "retired" }
      ]
    },
    {
      "id": "exercise",
      "fieldType": "binary",
      "inputType": "checkbox",
      "name": "Regular Exercise",
      "required": false,
      "options": [
        { "label": "Yes", "value": "yes" },
        { "label": "No", "value": "no" }
      ]
    }
  ]
}
```

### Example 2: Vital Signs Form (Snapshot)

This would include:
- Blood pressure (number with mmHg units)
- Heart rate (number with BPM units)
- Temperature (number with °C/°F units)
- Respiratory rate (number)
- Oxygen saturation (number with %)
- Weight (number with kg/lb units)
- Height (number with cm/in units)

### Example 3: Consultation Form

This would include:
- Chief complaint (long text)
- History of present illness (long text)
- Examination findings (options + text)
- Diagnosis (diagnosis field)
- Treatment plan (medicine + text)
- Follow-up instructions (long text)

### Example 4: Triage Form

This would include:
- Patient arrival time (date)
- Triage category (options: Red/Yellow/Green)
- Chief complaint (text)
- Vital signs (numbers with units)
- Alert status (binary)
- Priority notes (text)

---

## Technical Reference

### TypeScript Type Definitions

The form structure is defined by the following TypeScript types:

```typescript
export type FieldType =
  | 'binary'
  | 'medicine'
  | 'diagnosis'
  | 'dosage'
  | 'free-text'
  | 'input-group'
  | 'options'
  | 'date'
  | 'custom'

export type HHFieldBase = {
  id: string
  name: string
  description: string
  required: boolean
}

export type FieldOption = {
  label: string
  value: string
}

export type BinaryField = HHFieldBase & {
  fieldType: 'binary'
  inputType: 'checkbox' | 'radio' | 'select'
  options: FieldOption[]
}

export type OptionsField = HHFieldBase & {
  fieldType: 'options'
  inputType: 'checkbox' | 'radio' | 'select'
  options: FieldOption[]
}

export type DiagnosisField = HHFieldBase & {
  fieldType: 'diagnosis'
  inputType: 'select'
  options: FieldOption[]
}

export type TextField = HHFieldBase &
  (
    | {
        fieldType: 'free-text'
        inputType: 'text' | 'number' | 'email' | 'password' | 'tel'
        length: 'short'
        units?: DoseUnit[] | DurationUnit[]
      }
    | {
        fieldType: 'free-text'
        inputType: 'textarea'
        length: 'long'
        units?: DoseUnit[] | DurationUnit[]
      }
  )

export type MedicineField = HHFieldBase & {
  fieldType: 'medicine'
  inputType: 'input-group'
  fields: {
    name: TextField
    route: MedicineRoute
    form: MedicineForm
    frequency: TextField
    intervals: TextField
    dose: TextField
    doseUnits: DoseUnit
    duration: TextField
    durationUnits: DurationUnit
  }
}

type MedicationEntry = {
  name: string
  route: MedicineRoute
  form: MedicineForm
  frequency: number
  intervals: number
  dose: number
  doseUnits: DoseUnit
  duration: number
  durationUnits: DurationUnit
}

export type DateField = HHFieldBase & {
  fieldType: 'date'
  inputType: 'date'
  min?: Date
  max?: Date
}

export type HHField =
  | BinaryField
  | TextField
  | MedicineField
  | DiagnosisField
  | DateField
  | OptionsField
```

### Field Validation

All fields are validated using Effect schemas for type safety. Invalid field configurations will be caught before saving.

### Measurement Units Available

**Length:** `cm`, `m`, `in`, `ft`

**Weight:** `kg`, `lb`

**Pressure:** `mmHg`, `cmH2O`, `mmH2O`

**Temperature:** `°C`, `°F`

**Rate:** `BPM`, `P`

**Concentration:** `mmol/L`, `mg/dL`, `%`

**Dose:** `mg`, `g`, `mcg`, `mL`, `L`, `units`

---

## Troubleshooting

### Issue: Form won't save

**Possible causes:**
- Duplicate field names
- Using reserved field names (diagnosis, medicine)
- Missing required field properties
- Invalid field configuration

**Solution:** 
- Check browser console for validation errors
- Ensure all required field properties are set
- Verify field names are unique
- Check that field configurations match the expected structure

### Issue: Field not showing in preview

**Possible causes:**
- Field type not supported in preview
- Field configuration incomplete
- Missing required properties

**Solution:** 
- Ensure all required field properties are set
- Check that `fieldType` and `inputType` are valid
- Verify the field structure matches the TypeScript definitions

### Issue: Options not appearing in dropdown

**Possible causes:**
- Options array is empty
- Options not properly formatted
- Invalid option structure

**Solution:** 
- Check that options follow format: `{ label: "Display", value: "value" }`
- Ensure options array is not empty
- Verify JSON structure is valid

### Issue: Form not appearing on mobile app

**Possible causes:**
- Language mismatch between form and app
- Form not synced to mobile device
- Form marked as deleted

**Solution:**
- Verify the form language matches the mobile app language setting
- Ensure mobile device has synced with the server
- Check that form is not soft-deleted in the database

### Issue: Cannot edit old form entries

**Possible causes:**
- Form schema has changed since entry was created
- Form marked as non-editable
- Form is a snapshot form

**Solution:**
- Check if `is_editable` is set to false
- Verify form hasn't been significantly modified since entry creation
- Note that snapshot forms may have different edit permissions

---

## Support

For additional help or to report issues with the Event Form system:
1. Check the application logs for error details
2. Consult with your system administrator
3. Review existing forms for examples
4. Contact the Hikma Health support team
5. Refer to the SQLite JSON documentation: https://www.sqlite.org/json1.html