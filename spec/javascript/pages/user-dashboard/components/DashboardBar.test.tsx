import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardBar from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/DashboardBar';

jest.mock('react-icons/all', () => ({
  GiChecklist: () => <span>Checklist</span>,
}));

jest.mock('react-modal', () => {
  const MockReactModal = function({ isOpen, children, onRequestClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" onClick={onRequestClose}>
        {children}
      </div>
    );
  };
  MockReactModal.setAppElement = jest.fn();
  return MockReactModal;
});

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/AddList', () => {
  return function MockAddList() {
    return <div data-testid="add-list">Add List</div>;
  };
});

describe('DashboardBar', () => {
  it('renders without crashing', () => {
    render(
      <DashboardBar
        items={[]}
        onRemoveItem={jest.fn()}
        onAddItem={jest.fn()}
        widgets={[]}
      />
    );
  });

  it('displays Dashboard heading', () => {
    render(
      <DashboardBar
        items={[]}
        onRemoveItem={jest.fn()}
        onAddItem={jest.fn()}
        widgets={[]}
      />
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays Select Widgets button', () => {
    render(
      <DashboardBar
        items={[]}
        onRemoveItem={jest.fn()}
        onAddItem={jest.fn()}
        widgets={[]}
      />
    );
    expect(screen.getByText('Select Widgets')).toBeInTheDocument();
  });

  it('opens modal when Select Widgets is clicked', () => {
    render(
      <DashboardBar
        items={[]}
        onRemoveItem={jest.fn()}
        onAddItem={jest.fn()}
        widgets={[]}
      />
    );

    const button = screen.getByText('Select Widgets');
    fireEvent.click(button);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
