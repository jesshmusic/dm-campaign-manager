import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import CloseButton from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/CloseButton';

jest.mock('react-icons/all', () => ({
  GiCrossMark: () => <svg data-testid="cross-mark-icon" />,
}));

describe('CloseButton', () => {
  it('renders without crashing', () => {
    const mockOnClick = jest.fn();
    render(<CloseButton onClick={mockOnClick} />);
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    const { container } = render(<CloseButton onClick={mockOnClick} />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();

    fireEvent.click(button!);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with close icon', () => {
    const mockOnClick = jest.fn();
    const { container } = render(<CloseButton onClick={mockOnClick} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders as a button element', () => {
    const mockOnClick = jest.fn();
    const { container } = render(<CloseButton onClick={mockOnClick} />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('can be clicked multiple times', () => {
    const mockOnClick = jest.fn();
    const { container } = render(<CloseButton onClick={mockOnClick} />);

    const button = container.querySelector('button');

    fireEvent.click(button!);
    fireEvent.click(button!);
    fireEvent.click(button!);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });

  it('accepts and uses onClick prop', () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    const { container } = render(<CloseButton onClick={handleClick} />);
    const button = container.querySelector('button');

    fireEvent.click(button!);
    expect(clicked).toBe(true);
  });
});
