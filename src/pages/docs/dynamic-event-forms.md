---
title: Dynamic Event Forms
description: Create and manage forms from the administrators portal for all users to utilize
---

Through the Admin portal, users can create all the forms they need and have them available on the mobile applications for the beneficiaries.

---

## Event Forms

The term "Event" is used to describe any and all interactions between a patient and a care provider.

Examples of Events include:

- Patient symptoms
- Patient treatment plans
- Dental examination
- Lab testing & investigations
- ...

These forms can be created and customized by clinic administrators at any time for use by the care providers on the ground.

### Form Builder

The administrators portal has a built-in form builder that allows them to use a variety of input types for richer and more complete data collection. Below are the types of inputs that are collected defined by their type signatures

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

The form generated is simply a collection of the above inputs and is stored in the database where the mobile apps can sync to.

### Form Renderer

The mobile app has a set of screens and components that interpret the JSON form data and render out a functioning form capable of recording and storing the information as a JSON blob in the metadata field

---

## Considerations
- Forms can be editable, check/uncheck the field on the dashboard to allow/disable edit functionality
- Forms that show up under the patient profile are called "snapshot forms", these provide quick access to interesting histories of patients. This can be managed on the dashboard
- The forms in a specific language only show up when the app is set to that specific language. You can disable this in the code by removing the language specific query to show all forms regardless of language.
- As forms change and get updated, all data collected with the new forms will be slightly different from previous data
- All form data is stored as json on both the client and the server in a field called "metadata"
- Being a json field, it managing this data is more complex, learn more here: https://www.sqlite.org/json1.html
- When form inputs are edited and updated, keep in mind that users that try to edit old entries following the old schemas will have missing fields/entries
- There are 2 custom inputs, medicine and diagnoses, these inputs have mandatory fields and make sure to test out the appearance after every change due to how the inputs may interact with each other

### Input Customization on Mobile
- The input fields can be found inside the `components` folder
- There as many types of inputs as there are types of fields in the above typescript type definitions
- Keep in mind the screen sizes of your users when editing the fields. If users are on smaller screens, its not recommended to layout multiple fields in a row - prefer column layouts for smaller screens.

