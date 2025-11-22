import React from 'react';
import { render, screen } from '@testing-library/react';
import ReadOnlyField from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ReadOnlyField';

describe('ReadOnlyField', () => {
  it('renders with label and value', () => {
    render(<ReadOnlyField label="Monster Name" name="monster_name" value="Red Dragon" />);
    expect(screen.getByText('Monster Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Red Dragon')).toBeInTheDocument();
  });

  it('renders with numeric value', () => {
    render(<ReadOnlyField label="Challenge Rating" name="cr" value={17} />);
    expect(screen.getByDisplayValue('17')).toBeInTheDocument();
  });

  it('renders with empty string value', () => {
    render(<ReadOnlyField label="Description" name="desc" value="" />);
    const input = screen.getByDisplayValue('') as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('input is readonly', () => {
    render(<ReadOnlyField label="Name" name="name" value="Test" />);
    const input = screen.getByDisplayValue('Test') as HTMLInputElement;
    expect(input).toHaveAttribute('readonly');
  });

  it('input has type text', () => {
    render(<ReadOnlyField label="Name" name="name" value="Test" />);
    const input = screen.getByDisplayValue('Test');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ReadOnlyField className="custom-class" label="Name" name="name" value="Test" />
    );
    const wrapper = container.querySelector('.custom-class');
    expect(wrapper).toBeInTheDocument();
  });

  it('displays label text', () => {
    render(<ReadOnlyField label="Test Label" name="test_name" value="value" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('handles zero as value', () => {
    render(<ReadOnlyField label="Count" name="count" value={0} />);
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  it('renders with long text value', () => {
    const longText = 'A'.repeat(500);
    render(<ReadOnlyField label="Description" name="desc" value={longText} />);
    expect(screen.getByDisplayValue(longText)).toBeInTheDocument();
  });

  it('has autocomplete disabled', () => {
    render(<ReadOnlyField label="Name" name="name" value="Test" />);
    const input = screen.getByDisplayValue('Test');
    expect(input).toHaveAttribute('autocomplete', '');
  });
});
