import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import PlannerModal from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/PlannerModal';

const renderModal = (props: Partial<React.ComponentProps<typeof PlannerModal>> = {}) => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  render(
    <PlannerModal isOpen title="Plan the quest" onSave={onSave} onCancel={onCancel} {...props}>
      <p>The plan</p>
    </PlannerModal>,
  );
  return { onSave, onCancel };
};

describe('PlannerModal', () => {
  afterEach(() => jest.restoreAllMocks());

  it('shows a titled dialog with its content', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: 'Plan the quest' })).toBeInTheDocument();
    expect(screen.getByText('The plan')).toBeInTheDocument();
  });

  it('saves with the Save button', () => {
    const { onSave } = renderModal({ saveLabel: 'Save the quest' });

    fireEvent.click(screen.getByRole('button', { name: 'Save the quest' }));

    expect(onSave).toHaveBeenCalled();
  });

  it('cancels without asking when nothing changed', () => {
    const confirm = jest.spyOn(window, 'confirm');
    const { onCancel } = renderModal();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('asks before throwing changes away', () => {
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    const { onCancel } = renderModal({ dirty: true });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(confirm).toHaveBeenCalledWith('Discard your changes?');
    expect(onCancel).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('shows an error and disables the buttons while saving', () => {
    renderModal({ saving: true, error: 'Name is required.' });

    expect(screen.getByRole('alert')).toHaveTextContent('Name is required.');
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  });

  it('shows nothing when closed', () => {
    renderModal({ isOpen: false });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
