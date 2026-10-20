import React, { useState } from 'react';
import FormFields from './FormFields';
import PlannerModal from './PlannerModal';
import { Form } from '../Campaigns.styles';
import { Truth } from '../types';
import { truthsFrom, truthsMissingName, truthsToSave } from '../truths';

// Text, a checkbox, or a list of truths
export type FormValue = string | boolean | Truth[];
export type FormValues = Record<string, FormValue>;

type BaseField = {
  // Rails attribute name (snake_case)
  name: string;
  label: string;
  hint?: string;
  // Full-width fields span the whole form instead of one grid column
  wide?: boolean;
};

// A button next to a text field that fills it in, e.g. "Random name"
export type FieldHelper = {
  label: string;
  generate: (values: FormValues) => Promise<string>;
};

export type FieldConfig = BaseField &
  (
    | { type: 'text'; required?: boolean; placeholder?: string; helper?: FieldHelper }
    | { type: 'textarea'; placeholder?: string; helper?: FieldHelper }
    // A list of strings, edited one per line
    | { type: 'lines'; placeholder?: string }
    // Truths of the setting, each a name and a description (see TruthsEditor)
    | { type: 'truths' }
    | { type: 'number'; min?: number; max?: number }
    | { type: 'select'; options: { value: string; label: string }[]; blankLabel?: string }
    | { type: 'checkbox' }
  );

/**
 * Converts form values to request attributes: numbers, null for blanks, lines
 * to arrays, and truths trimmed without empty rows
 */
export const toAttributes = (fields: FieldConfig[], values: FormValues) =>
  Object.fromEntries(
    fields.map((field) => {
      const value = values[field.name];
      if (field.type === 'checkbox') return [field.name, Boolean(value)];
      if (field.type === 'truths') return [field.name, truthsToSave(truthsFrom(value))];
      const text = typeof value === 'string' ? value.trim() : '';
      if (field.type === 'lines') {
        return [
          field.name,
          text
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        ];
      }
      if (field.type === 'number') return [field.name, text === '' ? null : Number(text)];
      return [field.name, text === '' ? null : text];
    }),
  );

/** Converts a record's values (strings, numbers, arrays, null) into form values */
export const toFormValues = (fields: FieldConfig[], record: Record<string, unknown>) =>
  Object.fromEntries(
    fields.map((field) => {
      const value = record[field.name];
      if (field.type === 'checkbox') return [field.name, Boolean(value)];
      if (field.type === 'truths') return [field.name, truthsFrom(value)];
      if (Array.isArray(value)) return [field.name, value.join('\n')];
      return [field.name, value === null || value === undefined ? '' : String(value)];
    }),
  ) as FormValues;

type EntityFormProps = {
  // The modal's title, e.g. "Edit Hommlet"
  title: string;
  fields: FieldConfig[];
  initialValues: FormValues;
  submitLabel: string;
  onSubmit: (attributes: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
};

/**
 * Adds or edits a record in a modal. Nothing is saved until the Save button
 * (or Enter in a field); Cancel throws the changes away.
 */
const EntityForm = ({
  title,
  fields,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: EntityFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setValue = (name: string, value: FormValue) =>
    setValues((current) => ({ ...current, [name]: value }));

  const submit = async () => {
    const missing = fields.find(
      (field) =>
        field.type === 'text' && field.required && !String(values[field.name] ?? '').trim(),
    );
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    if (
      fields.some(
        (field) => field.type === 'truths' && truthsMissingName(truthsFrom(values[field.name])),
      )
    ) {
      setError('Each truth needs a name.');
      return;
    }
    setSaving(true);
    setError(null);
    const saved = await onSubmit(toAttributes(fields, values));
    setSaving(false);
    if (saved) onCancel();
    else setError("Couldn't save. Check the fields and try again.");
  };

  return (
    <PlannerModal
      isOpen
      title={title}
      saveLabel={submitLabel}
      saving={saving}
      error={error}
      dirty={JSON.stringify(values) !== JSON.stringify(initialValues)}
      onSave={submit}
      onCancel={onCancel}
    >
      <Form
        onSubmit={(event: React.FormEvent) => {
          event.preventDefault();
          void submit();
        }}
      >
        <FormFields fields={fields} values={values} onChange={setValue} />
        {/* Lets Enter in a field save, as in any form */}
        <button type="submit" hidden aria-hidden tabIndex={-1} />
      </Form>
    </PlannerModal>
  );
};

export default EntityForm;
