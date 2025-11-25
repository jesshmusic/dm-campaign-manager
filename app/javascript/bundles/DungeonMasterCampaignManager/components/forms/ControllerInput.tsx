import React, { useState, KeyboardEvent } from 'react';
import classNames from 'classnames';
import { GiFire } from 'react-icons/gi';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { SelectOption } from '../../utilities/types';
import Select from 'react-select';

import styles from './input.module.scss';

export const ControllerInput = (props) => {
  const { type, label, errors, className, name, placeholder, isTextArea, ...rest } = props;

  if (type === 'checkbox' || type === 'radio') {
    return (
      <div className={classNames(styles.wrapper, className)}>
        <input className={styles.checkbox} type={type} {...rest} />
        <label className={styles.checkboxLabel}>{label}</label>
      </div>
    );
  }
  return (
    <div className={classNames(styles.wrapper, className)}>
      <label className={styles.label}>{label}</label>
      {isTextArea ? (
        <textarea className={styles.input} placeholder={placeholder} {...rest} />
      ) : (
        <input className={styles.input} type={type || 'text'} placeholder={placeholder} {...rest} />
      )}

      {errors[name] && (
        <p className={styles.error}>
          <GiFire /> This is required
        </p>
      )}
    </div>
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
    <div className={className}>
      <label htmlFor={fieldName} className={styles.label}>
        {label}
      </label>
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
    </div>
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
    <div className={classNames(styles.wrapper, className)}>
      <label className={styles.label}>{label}</label>
      <div className={styles.tagInputContainer}>
        <div className={styles.tagsWrapper}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tagPill}>
              {tag}
              <button type="button" onClick={() => removeTag(index)} className={styles.tagRemove}>
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Add tags...'}
          className={styles.tagInput}
        />
      </div>
    </div>
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
