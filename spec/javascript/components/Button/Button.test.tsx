import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button';
import { Colors } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/enums';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button color={Colors.primary} title="Click Me" />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button color={Colors.primary} title="Test" onClick={onClick} />);
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="test-icon">🔥</span>;
    render(<Button color={Colors.primary} title="With Icon" icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('hides title when hideTitle is true', () => {
    render(<Button color={Colors.primary} title="Hidden" hideTitle={true} />);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('applies primary color class', () => {
    const { container } = render(<Button color={Colors.primary} title="Primary" />);
    const button = container.querySelector('.primary');
    expect(button).toBeInTheDocument();
  });

  it('applies secondary color class', () => {
    const { container } = render(<Button color={Colors.secondary} title="Secondary" />);
    const button = container.querySelector('.secondary');
    expect(button).toBeInTheDocument();
  });

  it('applies success color class', () => {
    const { container } = render(<Button color={Colors.success} title="Success" />);
    const button = container.querySelector('.success');
    expect(button).toBeInTheDocument();
  });

  it('applies danger color class', () => {
    const { container } = render(<Button color={Colors.danger} title="Danger" />);
    const button = container.querySelector('.danger');
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Button color={Colors.primary} title="Custom" className="custom-button" />);
    const button = container.querySelector('.custom-button');
    expect(button).toBeInTheDocument();
  });

  it('sets type to button by default', () => {
    render(<Button color={Colors.primary} title="Default Type" />);
    const button = screen.getByText('Default Type');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('sets type to submit when specified', () => {
    render(<Button color={Colors.primary} title="Submit" type="submit" />);
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('disables button when disabled is true', () => {
    render(<Button color={Colors.primary} title="Disabled" disabled={true} />);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });

  it('applies custom id', () => {
    render(<Button color={Colors.primary} title="With ID" id="custom-id" />);
    const button = screen.getByText('With ID');
    expect(button).toHaveAttribute('id', 'custom-id');
  });

  it('applies custom style', () => {
    render(<Button color={Colors.primary} title="Styled" style={{ backgroundColor: 'red' }} />);
    const button = screen.getByText('Styled');
    expect(button.style.backgroundColor).toBe('red');
  });

  it('applies fullWidth class when isFullWidth is true', () => {
    const { container } = render(<Button color={Colors.primary} title="Full Width" isFullWidth={true} />);
    const button = container.querySelector('.fullWidth');
    expect(button).toBeInTheDocument();
  });

  it('renders button element', () => {
    render(<Button color={Colors.primary} title="Button Element" />);
    const button = screen.getByText('Button Element');
    expect(button.tagName).toBe('BUTTON');
  });
});
