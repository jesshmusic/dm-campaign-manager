import React, { useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import {
  ButtonRow,
  CheckboxField,
  Field,
  Form,
  FormGrid,
  HelperButton,
  Input,
  InputWithHelper,
  Notice,
  Select,
  TextArea,
} from '../Campaigns.styles';

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
  const [helping, setHelping] = useState<string | null>(null);
  const [helperError, setHelperError] = useState<string | null>(null);

  const setValue = (name: string, value: string | boolean) =>
    setValues((current) => ({ ...current, [name]: value }));

  const runHelper = async (name: string, helper: FieldHelper) => {
    setHelping(name);
    setHelperError(null);
    try {
      setValue(name, await helper.generate(values));
    } catch {
      setHelperError(`${helper.label} didn't work this time. Please try again.`);
    } finally {
      setHelping(null);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onSubmit(toAttributes(fields, values));
    setSaving(false);
    if (saved) onCancel?.();
  };

  const renderControl = (field: FieldConfig) => {
    const id = `field-${field.name}`;
    const value = values[field.name];
    switch (field.type) {
      case 'checkbox':
        return null;
      case 'select':
        return (
          <Select
            id={id}
            value={String(value ?? '')}
            onChange={(e) => setValue(field.name, e.target.value)}
          >
            {field.blankLabel !== undefined && <option value="">{field.blankLabel}</option>}
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        );
      case 'number':
        return (
          <Input
            id={id}
            type="number"
            min={field.min}
            max={field.max}
            value={String(value ?? '')}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        );
      case 'textarea':
      case 'lines': {
        const textarea = (
          <TextArea
            id={id}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        );
        return field.type === 'textarea' && field.helper ? (
          <InputWithHelper>
            {textarea}
            <HelperButton
              type="button"
              disabled={helping !== null}
              onClick={() => void runHelper(field.name, field.helper as FieldHelper)}
            >
              {helping === field.name ? 'Thinking…' : field.helper.label}
            </HelperButton>
          </InputWithHelper>
        ) : (
          textarea
        );
      }
      default: {
        const input = (
          <Input
            id={id}
            type="text"
            required={field.required}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => setValue(field.name, e.target.value)}
          />
        );
        return field.helper ? (
          <InputWithHelper>
            {input}
            <HelperButton
              type="button"
              disabled={helping !== null}
              onClick={() => void runHelper(field.name, field.helper as FieldHelper)}
            >
              {helping === field.name ? 'Thinking…' : field.helper.label}
            </HelperButton>
          </InputWithHelper>
        ) : (
          input
        );
      }
    }
  };

  const gridFields = fields.filter((field) => !field.wide && field.type !== 'checkbox');
  const wideFields = fields.filter((field) => field.wide && field.type !== 'checkbox');
  const checkboxes = fields.filter((field) => field.type === 'checkbox');

  const renderField = (field: FieldConfig) => (
    <Field key={field.name} htmlFor={`field-${field.name}`}>
      {field.label}
      {field.hint && <small>{field.hint}</small>}
      {renderControl(field)}
    </Field>
  );

  return (
    <Form onSubmit={(event) => void submit(event)}>
      {gridFields.length > 0 && <FormGrid>{gridFields.map(renderField)}</FormGrid>}
      {wideFields.map(renderField)}
      {checkboxes.map((field) => (
        <CheckboxField key={field.name}>
          <input
            type="checkbox"
            checked={Boolean(values[field.name])}
            onChange={(e) => setValue(field.name, e.target.checked)}
          />
          {field.label}
        </CheckboxField>
      ))}
      {helperError && <Notice $tone="warning">{helperError}</Notice>}
      <ButtonRow>
        <Button type="submit" color={Colors.primary} title={submitLabel} disabled={saving} />
        {onCancel && <Button color={Colors.secondary} title="Cancel" onClick={onCancel} />}
      </ButtonRow>
    </Form>
  );
};

export default EntityForm;
