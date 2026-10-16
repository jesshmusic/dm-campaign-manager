import React, { useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import FormFields from './FormFields';
import { ButtonRow, Form } from '../Campaigns.styles';

export type FormValues = Record<string, string | boolean>;

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
    | { type: 'number'; min?: number; max?: number }
    | { type: 'select'; options: { value: string; label: string }[]; blankLabel?: string }
    | { type: 'checkbox' }
  );

/** Converts form values to request attributes: numbers, null for blanks, lines to arrays */
export const toAttributes = (fields: FieldConfig[], values: FormValues) =>
  Object.fromEntries(
    fields.map((field) => {
      const value = values[field.name];
      if (field.type === 'checkbox') return [field.name, Boolean(value)];
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
      if (Array.isArray(value)) return [field.name, value.join('\n')];
      return [field.name, value === null || value === undefined ? '' : String(value)];
    }),
  ) as FormValues;

type EntityFormProps = {
  fields: FieldConfig[];
  initialValues: FormValues;
  submitLabel: string;
  onSubmit: (attributes: Record<string, unknown>) => Promise<boolean>;
  onCancel?: () => void;
};

const EntityForm = ({
  fields,
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: EntityFormProps) => {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [saving, setSaving] = useState(false);

  const setValue = (name: string, value: string | boolean) =>
    setValues((current) => ({ ...current, [name]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onSubmit(toAttributes(fields, values));
    setSaving(false);
    if (saved) onCancel?.();
  };

  return (
    <Form onSubmit={(event) => void submit(event)}>
      <FormFields fields={fields} values={values} onChange={setValue} />
      <ButtonRow>
        <Button type="submit" color={Colors.primary} title={submitLabel} disabled={saving} />
        {onCancel && <Button color={Colors.secondary} title="Cancel" onClick={onCancel} />}
      </ButtonRow>
    </Form>
  );
};

export default EntityForm;
