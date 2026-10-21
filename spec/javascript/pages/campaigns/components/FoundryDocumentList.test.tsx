import React from 'react';
import { render, screen, fireEvent, within } from '../../../test-utils';
import FoundryDocumentList from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/FoundryDocumentList';

const DOCUMENTS = [
  { uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'A letter' },
  { uuid: 'Compendium.world.lore.JournalEntry.abcdefghijklmnop', name: 'Rumors' },
];

describe('FoundryDocumentList', () => {
  it('lists the documents by name, marking those from a compendium', () => {
    render(<FoundryDocumentList label="Handouts" documents={DOCUMENTS} emptyText="None yet." />);

    const list = screen.getByRole('list', { name: 'Handouts' });
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['A letter', 'Rumors (compendium)']);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('says when there are none', () => {
    render(<FoundryDocumentList label="Handouts" documents={[]} emptyText="None yet." />);

    expect(screen.getByText('None yet.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('removes one', () => {
    const onRemove = jest.fn();
    render(
      <FoundryDocumentList
        label="Handouts"
        documents={DOCUMENTS}
        emptyText="None yet."
        onRemove={onRemove}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove Rumors' }));

    expect(onRemove).toHaveBeenCalledWith(DOCUMENTS[1]);
  });

  it("can't remove one while disabled", () => {
    render(
      <FoundryDocumentList
        label="Handouts"
        documents={DOCUMENTS}
        emptyText="None yet."
        onRemove={jest.fn()}
        disabled
      />,
    );

    expect(screen.getByRole('button', { name: 'Remove A letter' })).toBeDisabled();
  });
});
