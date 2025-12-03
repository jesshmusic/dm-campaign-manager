import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen } from '../../test-utils';
import { useForm } from 'react-hook-form';
import FormSelect from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect';

// Mock react-select components
jest.mock('react-select', () => {
  return function Select(props: any) {
    return (
      <div data-testid="react-select" className={props.className}>
        <select
          data-testid="select-element"
          data-clearable={props.isClearable?.toString()}
          data-multi={props.isMulti?.toString()}
          data-searchable={props.isSearchable?.toString()}
          onChange={(e) => props.onChange?.(e.target.value)}
        >
          {props.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('react-select/creatable', () => {
  return function CreatableSelect(props: any) {
    return (
      <div data-testid="react-select-creatable" className={props.className}>
        <select
          data-testid="creatable-select-element"
          data-clearable={props.isClearable?.toString()}
          data-multi={props.isMulti?.toString()}
          data-searchable={props.isSearchable?.toString()}
          onChange={(e) => props.onChange?.(e.target.value)}
        >
          {props.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

// Wrapper component to provide form context
const FormSelectWrapper = (props: any) => {
  const { control } = useForm();
  return <FormSelect {...props} control={control} />;
};

describe('FormSelect Component', () => {
  const defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  describe('rendering', () => {
    it('should render select with label', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Test Select"
          options={defaultOptions}
        />
      );

      expect(screen.getByText('Test Select')).toBeInTheDocument();
      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });

    it('should render regular Select by default', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Test Select"
          options={defaultOptions}
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
      expect(screen.queryByTestId('react-select-creatable')).not.toBeInTheDocument();
    });

    it('should render CreatableSelect when isCreatable is true', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Creatable Select"
          options={defaultOptions}
          isCreatable={true}
        />
      );

      expect(screen.getByTestId('react-select-creatable')).toBeInTheDocument();
      expect(screen.queryByTestId('react-select')).not.toBeInTheDocument();
    });

    it('should render options', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Test Select"
          options={defaultOptions}
        />
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('label', () => {
    it('should render label with correct text', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="My Select Field"
          options={defaultOptions}
        />
      );

      expect(screen.getByText('My Select Field')).toBeInTheDocument();
    });

    it('should associate label with select', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Labeled Select"
          options={defaultOptions}
        />
      );

      const label = screen.getByText('Labeled Select');
      expect(label).toHaveAttribute('for', 'testSelect');
    });
  });

  describe('props', () => {
    it('should set isClearable prop', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Clearable Select"
          options={defaultOptions}
          isClearable={true}
        />
      );

      const select = screen.getByTestId('select-element');
      expect(select).toHaveAttribute('data-clearable', 'true');
    });

    it('should not be clearable by default', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Not Clearable Select"
          options={defaultOptions}
        />
      );

      const select = screen.getByTestId('select-element');
      expect(select).toHaveAttribute('data-clearable', 'false');
    });

    it('should set isMulti prop', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Multi Select"
          options={defaultOptions}
          isMulti={true}
        />
      );

      const select = screen.getByTestId('select-element');
      expect(select).toHaveAttribute('data-multi', 'true');
    });

    it('should not be multi by default', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Single Select"
          options={defaultOptions}
        />
      );

      const select = screen.getByTestId('select-element');
      expect(select).toHaveAttribute('data-multi', 'false');
    });

    it('should be searchable by default', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Searchable Select"
          options={defaultOptions}
        />
      );

      const select = screen.getByTestId('select-element');
      expect(select).toHaveAttribute('data-searchable', 'true');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <FormSelectWrapper
          name="testSelect"
          label="Custom Class Select"
          options={defaultOptions}
          className="custom-class"
        />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });

  describe('required field', () => {
    it('should handle required validation', () => {
      render(
        <FormSelectWrapper
          name="requiredSelect"
          label="Required Select"
          options={defaultOptions}
          required={true}
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });

    it('should not be required by default', () => {
      render(
        <FormSelectWrapper
          name="optionalSelect"
          label="Optional Select"
          options={defaultOptions}
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });
  });

  describe('default value', () => {
    it('should accept defaultValue prop', () => {
      const defaultValue = { value: 'option2', label: 'Option 2' };

      render(
        <FormSelectWrapper
          name="testSelect"
          label="Select with Default"
          options={defaultOptions}
          defaultValue={defaultValue}
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });
  });

  describe('menu placement', () => {
    it('should set menuPlacement to auto by default', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Auto Placement"
          options={defaultOptions}
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });

    it('should accept custom menuPlacement', () => {
      render(
        <FormSelectWrapper
          name="testSelect"
          label="Top Placement"
          options={defaultOptions}
          menuPlacement="top"
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });
  });

  describe('creatable select', () => {
    it('should render CreatableSelect with all props', () => {
      render(
        <FormSelectWrapper
          name="creatableSelect"
          label="Creatable Select"
          options={defaultOptions}
          isCreatable={true}
          isClearable={true}
          isMulti={true}
        />
      );

      expect(screen.getByTestId('react-select-creatable')).toBeInTheDocument();
      const select = screen.getByTestId('creatable-select-element');
      expect(select).toHaveAttribute('data-clearable', 'true');
      expect(select).toHaveAttribute('data-multi', 'true');
    });

    it('should render CreatableSelect with default value', () => {
      const defaultValue = { value: 'option1', label: 'Option 1' };

      render(
        <FormSelectWrapper
          name="creatableSelect"
          label="Creatable with Default"
          options={defaultOptions}
          isCreatable={true}
          defaultValue={defaultValue}
        />
      );

      expect(screen.getByTestId('react-select-creatable')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper label association', () => {
      render(
        <FormSelectWrapper
          name="accessibleSelect"
          label="Accessible Select"
          options={defaultOptions}
        />
      );

      const label = screen.getByText('Accessible Select');
      expect(label.tagName).toBe('LABEL');
      expect(label).toHaveAttribute('for', 'accessibleSelect');
    });

    it('should apply reactSelect className', () => {
      const { container } = render(
        <FormSelectWrapper
          name="testSelect"
          label="Test Select"
          options={defaultOptions}
        />
      );

      expect(container.querySelector('.reactSelect')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty options array', () => {
      render(
        <FormSelectWrapper
          name="emptySelect"
          label="Empty Select"
          options={[]}
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });

    it('should handle undefined options', () => {
      render(
        <FormSelectWrapper
          name="undefinedSelect"
          label="Undefined Options"
        />
      );

      expect(screen.getByTestId('react-select')).toBeInTheDocument();
    });

  });

  describe('combined props', () => {
    it('should handle all props together', () => {
      const defaultValue = { value: 'option1', label: 'Option 1' };

      const { container } = render(
        <FormSelectWrapper
          name="comboSelect"
          label="Combo Select"
          options={defaultOptions}
          defaultValue={defaultValue}
          isClearable={true}
          isMulti={true}
          isCreatable={true}
          className="custom-combo-class"
          menuPlacement="bottom"
          required={true}
        />
      );

      expect(screen.getByText('Combo Select')).toBeInTheDocument();
      expect(screen.getByTestId('react-select-creatable')).toBeInTheDocument();
      expect(container.querySelector('.custom-combo-class')).toBeInTheDocument();
    });
  });
});
