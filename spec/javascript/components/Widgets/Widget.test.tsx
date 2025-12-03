import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import Widget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/Widget';

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
  return function MockFrame({ children, title, subtitle, icon, actionButton }) {
    return (
      <div data-testid="frame">
        <div>{title}</div>
        <div>{subtitle}</div>
        {icon}
        {actionButton}
        {children}
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/CloseButton', () => {
  return function MockCloseButton({ onClick }) {
    return <button onClick={onClick} data-testid="close-button">Close</button>;
  };
});

const MockComponent = ({ content }) => <div>{content}</div>;

describe('Widget', () => {
  const defaultProps = {
    widgetId: 'widget-1',
    title: 'Test Widget',
    subtitle: 'Widget Subtitle',
    component: MockComponent,
    onRemoveItem: jest.fn(),
    hideFrame: false,
  };

  it('renders with title', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByText('Test Widget')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByText('Widget Subtitle')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="widget-icon">🎲</span>;
    render(<Widget {...defaultProps} icon={icon} />);
    expect(screen.getByTestId('widget-icon')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<Widget {...defaultProps} />);
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });

  it('calls onRemoveItem when close button clicked', () => {
    const onRemoveItem = jest.fn();
    render(<Widget {...defaultProps} onRemoveItem={onRemoveItem} />);
    fireEvent.click(screen.getByTestId('close-button'));
    expect(onRemoveItem).toHaveBeenCalledWith('widget-1');
  });

  it('renders content in component', () => {
    render(<Widget {...defaultProps} content="Widget Content" />);
    expect(screen.getByText('Widget Content')).toBeInTheDocument();
  });

  it('passes hideFrame prop to component', () => {
    const Component = ({ hideFrame }) => <div>{hideFrame ? 'Hidden' : 'Visible'}</div>;
    render(<Widget {...defaultProps} component={Component} hideFrame={true} />);
    expect(screen.getByText('Hidden')).toBeInTheDocument();
  });
});
