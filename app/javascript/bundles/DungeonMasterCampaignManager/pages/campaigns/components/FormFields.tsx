import { useState } from 'react';
import {
  CheckboxField,
  Field,
  FormGrid,
  HelperButton,
  Input,
  InputWithHelper,
  Notice,
  TextArea,
} from '../Campaigns.styles';
import SearchSelect from './SearchSelect';
import type { FieldConfig, FieldHelper, FormValues } from './EntityForm';

type FormFieldsProps = {
  fields: FieldConfig[];
  values: FormValues;
  onChange: (name: string, value: string | boolean) => void;
};

/**
 * The inputs for a list of fields, laid out as a grid with wide fields and
 * checkboxes below. The caller owns the values, so a form can span steps.
 */
const FormFields = ({ fields, values, onChange }: FormFieldsProps) => {
  const [helping, setHelping] = useState<string | null>(null);
  const [helperError, setHelperError] = useState<string | null>(null);

  const runHelper = async (name: string, helper: FieldHelper) => {
    setHelping(name);
    setHelperError(null);
    try {
      onChange(name, await helper.generate(values));
    } catch {
      setHelperError(`${helper.label} didn't work this time. Please try again.`);
    } finally {
      setHelping(null);
    }
  };

  const helperButton = (field: FieldConfig & { helper?: FieldHelper }) =>
    field.helper && (
      <HelperButton
        type="button"
        disabled={helping !== null}
        onClick={() => void runHelper(field.name, field.helper as FieldHelper)}
      >
        {helping === field.name ? 'Thinking…' : field.helper.label}
      </HelperButton>
    );

  const renderControl = (field: FieldConfig) => {
    const id = `field-${field.name}`;
    const value = values[field.name];
    switch (field.type) {
      case 'checkbox':
        return null;
      case 'select':
        // Type to filter the choices; a field with a blank choice can be cleared
        return (
          <SearchSelect
            inputId={id}
            aria-label={field.label}
            options={field.options}
            value={field.options.find((option) => option.value === String(value ?? '')) ?? null}
            isClearable={field.blankLabel !== undefined}
            placeholder={field.blankLabel ?? 'Choose…'}
            onChange={(option) => onChange(field.name, option?.value ?? '')}
          />
        );
      case 'number':
        return (
          <Input
            id={id}
            type="number"
            min={field.min}
            max={field.max}
            value={String(value ?? '')}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
      case 'textarea':
      case 'lines': {
        const textarea = (
          <TextArea
            id={id}
            value={String(value ?? '')}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
        return field.type === 'textarea' && field.helper ? (
          <InputWithHelper>
            {textarea}
            {helperButton(field)}
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
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );
        return field.helper ? (
          <InputWithHelper>
            {input}
            {helperButton(field)}
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
    <>
      {gridFields.length > 0 && <FormGrid>{gridFields.map(renderField)}</FormGrid>}
      {wideFields.map(renderField)}
      {checkboxes.map((field) => (
        <CheckboxField key={field.name}>
          <input
            type="checkbox"
            checked={Boolean(values[field.name])}
            onChange={(e) => onChange(field.name, e.target.checked)}
          />
          {field.label}
        </CheckboxField>
      ))}
      {helperError && <Notice $tone="warning">{helperError}</Notice>}
    </>
  );
};

export default FormFields;
