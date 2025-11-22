import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddList from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/components/AddList';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/CloseButton', () => {
  return function MockCloseButton({ onClick }: any) {
    return <button data-testid="close-button" onClick={onClick}>X</button>;
  };
});

const TestIcon = () => <span>Icon</span>;

describe('AddList', () => {
  const mockWidgets = [
    { title: 'Notes', key: 'notes', icon: TestIcon },
    { title: 'Actions', key: 'actions', icon: TestIcon },
  ];

  it('renders without crashing', () => {
    render(
      <AddList
        items={[]}
        onAddItem={jest.fn()}
        onRemoveItem={jest.fn()}
        onCloseModal={jest.fn()}
        widgets={mockWidgets}
      />
    );
  });

  it('displays heading', () => {
    render(
      <AddList
        items={[]}
        onAddItem={jest.fn()}
        onRemoveItem={jest.fn()}
        onCloseModal={jest.fn()}
        widgets={mockWidgets}
      />
    );
    expect(screen.getByText('Select Widgets')).toBeInTheDocument();
  });

  it('renders all widgets', () => {
    render(
      <AddList
        items={[]}
        onAddItem={jest.fn()}
        onRemoveItem={jest.fn()}
        onCloseModal={jest.fn()}
        widgets={mockWidgets}
      />
    );

    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('calls onAddItem when checkbox is checked', () => {
    const onAddItem = jest.fn();
    render(
      <AddList
        items={[]}
        onAddItem={onAddItem}
        onRemoveItem={jest.fn()}
        onCloseModal={jest.fn()}
        widgets={mockWidgets}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(onAddItem).toHaveBeenCalledWith('notes');
  });

  it('calls onRemoveItem when checkbox is unchecked', () => {
    const onRemoveItem = jest.fn();
    render(
      <AddList
        items={['notes']}
        onAddItem={jest.fn()}
        onRemoveItem={onRemoveItem}
        onCloseModal={jest.fn()}
        widgets={mockWidgets}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(onRemoveItem).toHaveBeenCalledWith('notes');
  });

  it('calls onCloseModal when close button is clicked', () => {
    const onCloseModal = jest.fn();
    render(
      <AddList
        items={[]}
        onAddItem={jest.fn()}
        onRemoveItem={jest.fn()}
        onCloseModal={onCloseModal}
        widgets={mockWidgets}
      />
    );

    fireEvent.click(screen.getByTestId('close-button'));
    expect(onCloseModal).toHaveBeenCalled();
  });
});
