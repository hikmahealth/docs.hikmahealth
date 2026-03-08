---
title: "Dynamic Event Forms"
description: "Learn how dynamic event forms work in Hikma Health."
order: 2
---

## Dynamic Event Forms

Event forms in Hikma Health are fully dynamic and configurable through the admin interface. This allows organizations to customize data collection without code changes.

![Patient Form Example](/images/HH-Patient-Form.png)

### How it works

The form system is built around a flexible JSON schema that defines the structure, validation rules, and display logic for each form. When a healthcare worker opens a form on the mobile app, the schema is interpreted at runtime to render the appropriate fields.

### Key features

- **No-code form builder** — Create and modify forms directly from the admin dashboard.
- **Field types** — Supports text, number, date, dropdown, multi-select, checkbox, and more.
- **Conditional logic** — Show or hide fields based on previous answers.
- **Validation** — Define required fields, min/max values, and custom validation rules.
- **Offline support** — Forms are cached locally and work without internet connectivity.

### Creating a new form

1. Navigate to the **Forms** section in the admin interface.
2. Click **Create New Form** and give it a name and description.
3. Add fields using the drag-and-drop form builder.
4. Configure validation and conditional logic as needed.
5. Save and publish the form — it will be available on mobile devices after their next sync.

### Form schema structure

Each form is stored as a JSON document with the following high-level structure:

```
{
  "id": "uuid",
  "name": "Patient Intake Form",
  "description": "Initial patient registration form",
  "fields": [
    {
      "id": "field_uuid",
      "type": "text",
      "label": "Patient Name",
      "required": true
    }
  ]
}
```

> This page is a work in progress. More detailed documentation on the form schema, field types, and advanced configuration is coming soon.