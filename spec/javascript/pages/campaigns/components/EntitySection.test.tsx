import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import EntitySection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/EntitySection';
import { FieldConfig } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/EntityForm';

type Item = { id: string; name?: string; level: number | null };

const fields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'level', label: 'Level', type: 'number' },
];

const items: Item[] = [
  { id: '1', name: 'Lareth', level: 5 },
  { id: '2', name: 'Elmo', level: 2 },
];

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;

const renderSection = (props: Partial<React.ComponentProps<typeof EntitySection<Item>>> = {}) => {
  const onSave = jest.fn().mockResolvedValue(true);
  const onDelete = jest.fn().mockResolvedValue(true);
  render(
    <EntitySection<Item>
      title="Cast"
      noun="NPC"
      items={items}
      fields={fields}
      valuesFor={(item) => ({ ...item })}
      newValues={{ level: 1 }}
      renderItem={(item) => <h3>{item.name}</h3>}
      emptyText="No NPCs yet."
      onSave={onSave}
      onDelete={onDelete}
      {...props}
    />,
  );
  return { onSave, onDelete };
};

const cardFor = (name: string) =>
  screen.getByRole('heading', { name }).parentElement as HTMLElement;

const dialog = (name: string) => screen.getByRole('dialog', { name });

describe('EntitySection', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('renders a titled region with a card per item', () => {
    renderSection({ intro: <p>Everyone the party might meet.</p> });

    const section = screen.getByRole('region', { name: 'Cast' });
    expect(within(section).getByRole('heading', { name: /Cast/, level: 2 })).toBeInTheDocument();
    expect(within(section).getByRole('heading', { name: 'Lareth' })).toBeInTheDocument();
    expect(within(section).getByRole('heading', { name: 'Elmo' })).toBeInTheDocument();
    expect(screen.getByText('Everyone the party might meet.')).toBeInTheDocument();
    expect(screen.queryByText('No NPCs yet.')).not.toBeInTheDocument();
  });

  it('shows the empty text when there are no items', () => {
    renderSection({ items: [] });

    expect(screen.getByText('No NPCs yet.')).toBeInTheDocument();
  });

  it('renders extra actions for each item', () => {
    renderSection({
      renderActions: (item) => <button type="button">Roll for {item.name}</button>,
    });

    expect(screen.getByRole('button', { name: 'Roll for Lareth' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Roll for Elmo' })).toBeInTheDocument();
  });

  describe('adding', () => {
    it('opens a form in a modal with the new values and saves without an id', async () => {
      const { onSave } = renderSection({ items: [] });

      fireEvent.click(screen.getByRole('button', { name: 'Add NPC' }));

      expect(dialog('New NPC')).toBeInTheDocument();
      expect(input('level')).toHaveValue(1);

      fireEvent.change(input('name'), { target: { value: 'Ostler' } });
      fireEvent.click(within(dialog('New NPC')).getByRole('button', { name: 'Add NPC' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(onSave).toHaveBeenCalledWith({ name: 'Ostler', level: 1 });
      expect(onSave.mock.calls[0]).toHaveLength(1);
    });

    it('closes the form on cancel', () => {
      const { onSave } = renderSection();

      fireEvent.click(screen.getByRole('button', { name: 'Add NPC' }));
      fireEvent.click(within(dialog('New NPC')).getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(onSave).not.toHaveBeenCalled();
    });

    it('keeps the form open when saving fails', async () => {
      const { onSave } = renderSection();
      onSave.mockResolvedValue(false);

      fireEvent.click(screen.getByRole('button', { name: 'Add NPC' }));
      fireEvent.click(within(dialog('New NPC')).getByRole('button', { name: 'Add NPC' }));

      await waitFor(() => expect(onSave).toHaveBeenCalled());
      expect(dialog('New NPC')).toBeInTheDocument();
    });
  });

  describe('editing', () => {
    it('opens a form in a modal with the item values and saves with its id', async () => {
      const { onSave } = renderSection();

      fireEvent.click(within(cardFor('Lareth')).getByRole('button', { name: 'Edit' }));

      expect(dialog('Edit Lareth')).toBeInTheDocument();
      expect(input('name')).toHaveValue('Lareth');
      expect(input('level')).toHaveValue(5);

      fireEvent.change(input('level'), { target: { value: '6' } });
      fireEvent.click(within(dialog('Edit Lareth')).getByRole('button', { name: 'Save' }));

      await waitFor(() => expect(onSave).toHaveBeenCalledWith({ name: 'Lareth', level: 6 }, '1'));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    });

    it('goes back to the card on cancel', () => {
      renderSection();

      fireEvent.click(within(cardFor('Elmo')).getByRole('button', { name: 'Edit' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(screen.getByRole('heading', { name: 'Elmo' })).toBeInTheDocument();
      expect(input('name')).toBeNull();
    });
  });

  describe('deleting', () => {
    it('deletes after confirming by name', () => {
      const { onDelete } = renderSection();

      fireEvent.click(within(cardFor('Elmo')).getByRole('button', { name: 'Delete' }));

      expect(confirmSpy).toHaveBeenCalledWith('Delete "Elmo"? This can\'t be undone.');
      expect(onDelete).toHaveBeenCalledWith('2');
    });

    it('does nothing when the confirmation is declined', () => {
      confirmSpy.mockReturnValue(false);
      const { onDelete } = renderSection();

      fireEvent.click(within(cardFor('Elmo')).getByRole('button', { name: 'Delete' }));

      expect(onDelete).not.toHaveBeenCalled();
    });

    it('describes unnamed items by noun', () => {
      const { onDelete } = renderSection({
        items: [{ id: '9', level: null }],
        renderItem: () => <h3>Unnamed</h3>,
      });

      fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

      expect(confirmSpy).toHaveBeenCalledWith("Delete this npc? This can't be undone.");
      expect(onDelete).toHaveBeenCalledWith('9');
    });
  });
});
