import React from 'react';
import { render, screen } from '@testing-library/react';
import DndSpinner from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner';

jest.mock('react-icons/all', () => ({
  GiLinkedRings: ({ size, className }) => (
    <svg data-testid="linked-rings-icon" data-size={size} className={className} />
  ),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/TableFrame', () => {
  return function MockTableFrame({ children, showSpinner }) {
    return <div data-testid="table-frame" data-show-spinner={showSpinner}>{children}</div>;
  };
});

describe('DndSpinner', () => {
  it('renders without crashing', () => {
    render(<DndSpinner />);
    expect(screen.getByTestId('linked-rings-icon')).toBeInTheDocument();
  });

  it('renders spinner icon', () => {
    render(<DndSpinner />);
    const icon = screen.getByTestId('linked-rings-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-size', '100');
  });

  it('renders with table frame when showTableFrame is true', () => {
    render(<DndSpinner showTableFrame={true} />);
    const tableFrame = screen.getByTestId('table-frame');
    expect(tableFrame).toBeInTheDocument();
    expect(tableFrame).toHaveAttribute('data-show-spinner', 'true');
  });

  it('renders without table frame when showTableFrame is false', () => {
    const { container } = render(<DndSpinner showTableFrame={false} />);
    expect(screen.queryByTestId('table-frame')).not.toBeInTheDocument();
    expect(container.querySelector('.noFrame')).toBeInTheDocument();
  });

  it('renders without table frame by default', () => {
    const { container } = render(<DndSpinner />);
    expect(screen.queryByTestId('table-frame')).not.toBeInTheDocument();
    expect(container.querySelector('.noFrame')).toBeInTheDocument();
  });

  it('renders text when provided', () => {
    render(<DndSpinner text="Loading monsters..." />);
    expect(screen.getByText('Loading monsters...')).toBeInTheDocument();
  });

  it('does not render text when not provided', () => {
    const { container } = render(<DndSpinner />);
    const h3 = container.querySelector('h3');
    expect(h3).not.toBeInTheDocument();
  });

  it('renders text with table frame', () => {
    render(<DndSpinner showTableFrame={true} text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
    expect(screen.getByTestId('table-frame')).toBeInTheDocument();
  });

  it('applies spinner className to icon', () => {
    render(<DndSpinner />);
    const icon = screen.getByTestId('linked-rings-icon');
    expect(icon).toHaveClass('spinner');
  });

  it('renders text in h3 element', () => {
    render(<DndSpinner text="Please wait..." />);
    const heading = screen.getByText('Please wait...');
    expect(heading.tagName).toBe('H3');
  });

  it('applies margin style to text', () => {
    render(<DndSpinner text="Test" />);
    const heading = screen.getByText('Test');
    expect(heading).toHaveStyle({ marginLeft: '10px' });
  });
});
