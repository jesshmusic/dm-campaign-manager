import React, { useState, KeyboardEvent } from 'react';
import { GiFire } from 'react-icons/gi';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { SelectOption } from '../../utilities/types';
import Select from 'react-select';

import {
  FormWrapper,
  FormInput,
  FormTextArea,
  FormLabel,
  Checkbox,
  CheckboxLabel,
  ErrorMessage,
  TagInputContainer,
  TagsWrapper,
  TagPill,
  TagRemove,
  TagInputField,
} from './Forms.styles';

interface ControllerInputProps {
  type?: string;
  label: string;
  errors: FieldErrors;
  className?: string;
  name: string;
  placeholder?: string;
  isTextArea?: boolean;
  [key: string]: unknown;
}

export const ControllerInput = (props: ControllerInputProps) => {
  const { type, label, errors, className, name, placeholder, isTextArea, ...rest } = props;

  if (type === 'checkbox' || type === 'radio') {
    return (
      <FormWrapper className={className}>
        <Checkbox type={type} {...rest} />
        <CheckboxLabel>{label}</CheckboxLabel>
      </FormWrapper>
    );
  }
  return (
    <FormWrapper className={className}>
      <FormLabel>{label}</FormLabel>
      {isTextArea ? (
        <FormTextArea placeholder={placeholder} {...rest} />
      ) : (
        <FormInput type={type || 'text'} placeholder={placeholder} {...rest} />
      )}

      {errors[name] && (
        <ErrorMessage>
          <GiFire /> This is required
        </ErrorMessage>
      )}
    </FormWrapper>
  );
};

export const ControlledInput = (props: {
  fieldName: string;
  errors: FieldErrors;
  className?: string;
  control: Control<FieldValues, object>;
  label: string;
  isTextArea?: boolean;
  min?: number;
  required?: boolean;
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
}) => {
  const {
    fieldName,
    errors,
    className,
    control,
    isTextArea,
    label,
    min,
    readOnly,
    required,
    type,
    disabled,
  } = props;
  return (
    <Controller
      render={({ field: { ref: _ref, ...rest } }) => (
        <ControllerInput
          type={type ? type : 'text'}
          label={label}
          className={className}
          placeholder={`${label}...`}
          errors={errors}
          isTextArea={isTextArea}
          min={min}
          required={required}
          readOnly={readOnly}
          disabled={disabled}
          {...rest}
        />
      )}
      name={fieldName}
      control={control}
    />
  );
};

export const ControlledSelect = (props: {
  fieldName: string;
  className?: string;
  control: Control<FieldValues, object>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
}) => {
  const { control, label, className, fieldName, options, disabled } = props;

  return (
    <FormWrapper className={className}>
      <FormLabel htmlFor={fieldName}>{label}</FormLabel>
      <Controller
        render={({ field: { onChange, value, ...rest } }) => {
          // Convert string value to option object for react-select
          const selectedOption = options.find((option) => option.value === value) || null;

          return (
            <Select
              className={'reactSelect'}
              classNamePrefix={'reactSelect'}
              options={options}
              isSearchable
              isDisabled={disabled}
              value={selectedOption}
              onChange={(option: SelectOption | null) => {
                // Extract just the value string for react-hook-form
                onChange(option ? option.value : null);
              }}
              {...rest}
            />
          );
        }}
        name={fieldName}
        control={control}
      />
    </FormWrapper>
  );
};

export const TagInput = (props: {
  tags: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder?: string;
  className?: string;
}) => {
  const { tags, onChange, label, placeholder, className } = props;
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(',')) {
      const newTag = value.replace(',', '').trim();
      if (newTag) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const addTag = () => {
    const trimmedTag = inputValue.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <FormWrapper className={className}>
      <FormLabel>{label}</FormLabel>
      <TagInputContainer>
        <TagsWrapper>
          {tags.map((tag, index) => (
            <TagPill key={index}>
              {tag}
              <TagRemove type="button" onClick={() => removeTag(index)}>
                ×
              </TagRemove>
            </TagPill>
          ))}
        </TagsWrapper>
        <TagInputField
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Add tags...'}
        />
      </TagInputContainer>
    </FormWrapper>
  );
};

export const ControlledTagInput = (props: {
  fieldName: string;
  control: Control<FieldValues, object>;
  label: string;
  placeholder?: string;
  className?: string;
}) => {
  const { fieldName, control, label, placeholder, className } = props;

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field: { onChange, value } }) => {
        // Convert comma-separated string to array if needed
        const tagsArray =
          typeof value === 'string'
            ? value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : value || [];

        return (
          <TagInput
            tags={tagsArray}
            onChange={(newTags) => onChange(newTags.join(', '))}
            label={label}
            placeholder={placeholder}
            className={className}
          />
        );
      }}
    />
  );
};
