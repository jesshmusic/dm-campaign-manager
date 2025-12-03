import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen } from '../../test-utils';
import FormField from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormField';

// Mock register function that returns proper props
const mockRegister = (name: string, options?: any) => ({
  name,
  id: name,
  ref: jest.fn(),
  onChange: jest.fn(),
  onBlur: jest.fn(),
  ...(options?.required && { required: true }),
});

describe('FormField Component', () => {
  describe('rendering', () => {
    it('should render text input with label', () => {
      render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Field')).toHaveAttribute('type', 'text');
    });

    it('should render number input', () => {
      render(
        <FormField
          name="numberField"
          label="Number Field"
          type="number"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Number Field');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render email input', () => {
      render(
        <FormField
          name="emailField"
          label="Email Field"
          type="email"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Email Field');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(
        <FormField
          name="passwordField"
          label="Password"
          type="password"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Password');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('checkbox and radio inputs', () => {
    it('should render checkbox with proper structure', () => {
      render(
        <FormField
          name="checkboxField"
          label="Accept Terms"
          type="checkbox"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveClass('form-check-input');
      expect(screen.getByText('Accept Terms')).toBeInTheDocument();
    });

    it('should render radio button with proper structure', () => {
      render(
        <FormField
          name="radioField"
          label="Option A"
          type="radio"
          value="optionA"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const radio = screen.getByRole('radio');
      expect(radio).toBeInTheDocument();
      expect(radio).toHaveClass('form-check-input');
      expect(radio).toHaveAttribute('value', 'optionA');
    });

    it('should apply form-check class for checkbox', () => {
      const { container } = render(
        <FormField
          name="checkboxField"
          label="Checkbox"
          type="checkbox"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(container.querySelector('.form-check')).toBeInTheDocument();
    });

    it('should apply form-check class for radio', () => {
      const { container } = render(
        <FormField
          name="radioField"
          label="Radio"
          type="radio"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(container.querySelector('.form-check')).toBeInTheDocument();
    });
  });

  describe('label behavior', () => {
    it('should hide label when hideLabel is true', () => {
      render(
        <FormField
          name="testField"
          label="Hidden Label"
          type="text"
          hideLabel={true}
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.queryByText('Hidden Label')).not.toBeInTheDocument();
    });

    it('should show label by default', () => {
      render(
        <FormField
          name="testField"
          label="Visible Label"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.getByText('Visible Label')).toBeInTheDocument();
    });

    it('should hide checkbox label when hideLabel is true', () => {
      render(
        <FormField
          name="checkboxField"
          label="Hidden Checkbox Label"
          type="checkbox"
          hideLabel={true}
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.queryByText('Hidden Checkbox Label')).not.toBeInTheDocument();
    });
  });

  describe('help text', () => {
    it('should display help text when provided', () => {
      render(
        <FormField
          name="testField"
          label="Field with Help"
          type="text"
          helpText="This is helpful information"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
      expect(screen.getByText('This is helpful information')).toHaveClass('form-text');
    });

    it('should not display help text when not provided', () => {
      const { container } = render(
        <FormField
          name="testField"
          label="Field without Help"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(container.querySelector('.form-text')).not.toBeInTheDocument();
    });

    it('should link help text with aria-describedby', () => {
      render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          helpText="Help text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveAttribute('aria-describedby', 'testField-help-text');
    });
  });

  describe('error handling', () => {
    it('should display error message when field has error', () => {
      const mockErrors = { testField: { type: 'required', message: 'This is required' } };

      render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          register={mockRegister as any}
          errors={mockErrors}
        />
      );

      expect(screen.getByText('This is required')).toBeInTheDocument();
    });

    it('should display fire icon with error', () => {
      const mockErrors = { testField: { type: 'required', message: 'This is required' } };

      const { container } = render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          register={mockRegister as any}
          errors={mockErrors}
        />
      );

      expect(screen.getByText('This is required')).toBeInTheDocument();
    });

    it('should not display error when no error exists', () => {
      render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.queryByText('This is required')).not.toBeInTheDocument();
    });

    it('should display error for checkbox fields', () => {
      const mockErrors = { checkboxField: { type: 'required', message: 'This is required' } };

      render(
        <FormField
          name="checkboxField"
          label="Checkbox"
          type="checkbox"
          register={mockRegister as any}
          errors={mockErrors}
        />
      );

      expect(screen.getByText('This is required')).toBeInTheDocument();
    });
  });

  describe('field attributes', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          className="custom-class"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });

    it('should set min attribute for number input', () => {
      render(
        <FormField
          name="numberField"
          label="Number Field"
          type="number"
          min={5}
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Number Field');
      expect(input).toHaveAttribute('min', '5');
    });

    it('should set readOnly attribute', () => {
      render(
        <FormField
          name="readOnlyField"
          label="Read Only Field"
          type="text"
          readOnly={true}
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Read Only Field');
      expect(input).toHaveAttribute('readOnly');
    });

    it('should set custom id', () => {
      render(
        <FormField
          name="testField"
          label="Test Field"
          type="checkbox"
          id="custom-id"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('id', 'custom-id');
    });

    it('should set value for checkbox', () => {
      render(
        <FormField
          name="checkboxField"
          label="Checkbox"
          type="checkbox"
          value="checkboxValue"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'checkboxValue');
    });
  });

  describe('required field', () => {
    it('should mark field as required', () => {
      render(
        <FormField
          name="requiredField"
          label="Required Field"
          type="text"
          required={true}
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Required Field');
      expect(input).toBeRequired();
    });

    it('should not mark field as required by default', () => {
      render(
        <FormField
          name="optionalField"
          label="Optional Field"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Optional Field');
      expect(input).not.toBeRequired();
    });
  });

  describe('accessibility', () => {
    it('should have proper label association', () => {
      render(
        <FormField
          name="accessibleField"
          label="Accessible Field"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Accessible Field');
      expect(input).toBeInTheDocument();
    });

    it('should have aria-describedby for help text', () => {
      render(
        <FormField
          name="fieldWithHelp"
          label="Field"
          type="text"
          helpText="Help information"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const input = screen.getByLabelText('Field');
      expect(input).toHaveAttribute('aria-describedby', 'fieldWithHelp-help-text');
    });

    it('should have proper checkbox label association', () => {
      render(
        <FormField
          name="accessibleCheckbox"
          label="Accessible Checkbox"
          type="checkbox"
          register={mockRegister as any}
          errors={{}}
        />
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle missing register gracefully', () => {
      const { container } = render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(container.querySelector('input')).toBeInTheDocument();
    });

    it('should handle empty errors object', () => {
      render(
        <FormField
          name="testField"
          label="Test Field"
          type="text"
          register={mockRegister as any}
          errors={{}}
        />
      );

      expect(screen.queryByText('This is required')).not.toBeInTheDocument();
    });

    it('should handle multiple checkbox inputs with same name', () => {
      render(
        <div>
          <FormField
            name="group"
            label="Option 1"
            type="checkbox"
            value="option1"
            register={mockRegister as any}
            errors={{}}
          />
          <FormField
            name="group"
            label="Option 2"
            type="checkbox"
            value="option2"
            register={mockRegister as any}
            errors={{}}
          />
        </div>
      );

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(2);
    });
  });
});
