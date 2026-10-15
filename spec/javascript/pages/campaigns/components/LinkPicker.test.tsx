import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import LinkPicker from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/LinkPicker';
import { SessionLink } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { sampleCampaign } from '../fixtures';

const links: SessionLink[] = sampleCampaign().sessions[1].links;

const secretOptions = [
  { id: 's1', label: 'The mayor is a cultist' },
  { id: 's2', label: "Lareth wears the mayor's ring" },
];

const renderPicker = (props: Partial<React.ComponentProps<typeof LinkPicker>> = {}) => {
  const onAdd = jest.fn().mockResolvedValue(true);
  const onRemove = jest.fn().mockResolvedValue(true);
  const view = render(
    <LinkPicker
      label="Add a secret"
      linkableType="CampaignSecret"
      links={links}
      options={secretOptions}
      emptyText="No secrets picked yet."
      onAdd={onAdd}
      onRemove={onRemove}
      {...props}
    />,
  );
  return { ...view, onAdd, onRemove };
};

const picker = () => screen.getByRole('combobox', { name: 'Add a secret' });

describe('LinkPicker', () => {
  it('lists only links of its type', () => {
    renderPicker();

    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    expect(within(list).getByText(/The mayor is a cultist/)).toBeInTheDocument();
    expect(screen.queryByText(/Hommlet/)).not.toBeInTheDocument();
  });

  it('only offers options that are not linked yet', () => {
    renderPicker();

    expect(
      within(picker())
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['Choose…', "Lareth wears the mayor's ring"]);
  });

  it('shows the empty text when nothing of its type is linked', () => {
    renderPicker({ links: [] });

    expect(screen.getByText('No secrets picked yet.')).toBeInTheDocument();
    expect(within(picker()).getAllByRole('option')).toHaveLength(3);
  });

  it('hides the dropdown when every option is linked', () => {
    renderPicker({ options: [secretOptions[0]] });

    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('adds the chosen option and resets the dropdown', async () => {
    const { onAdd } = renderPicker();
    const addButton = screen.getByRole('button', { name: 'Add' });

    expect(addButton).toBeDisabled();
    fireEvent.change(picker(), { target: { value: 's2' } });
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);

    expect(onAdd).toHaveBeenCalledWith('CampaignSecret', 's2');
    await waitFor(() => expect(picker()).toHaveValue(''));
  });

  it('keeps the choice when adding fails', async () => {
    const { onAdd } = renderPicker();
    onAdd.mockResolvedValue(false);

    fireEvent.change(picker(), { target: { value: 's2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => expect(onAdd).toHaveBeenCalled());
    expect(picker()).toHaveValue('s2');
  });

  it('removes a link', () => {
    const { onRemove } = renderPicker();

    fireEvent.click(screen.getByRole('button', { name: 'Remove The mayor is a cultist' }));

    expect(onRemove).toHaveBeenCalledWith(links[0]);
  });

  it('limits links to the scoped ids when one type is split up', () => {
    renderPicker({
      label: 'Add a monster from your books',
      linkableType: 'CampaignReference',
      options: [{ id: 'r1', label: 'Cult Fanatic (MM p. 34)' }],
      scopeIds: ['r1'],
    });

    expect(screen.getByText(/Cult Fanatic/)).toBeInTheDocument();
    expect(screen.queryByText(/Bag of Holding/)).not.toBeInTheDocument();
  });

  it('shows every link of its type without a scope', () => {
    renderPicker({ linkableType: 'CampaignReference', options: [] });

    expect(screen.getByText(/Cult Fanatic/)).toBeInTheDocument();
    expect(screen.getByText(/Bag of Holding/)).toBeInTheDocument();
  });

  it('renders links with a custom renderer', () => {
    renderPicker({
      linkableType: 'CampaignReference',
      options: [],
      renderLink: (link) => `${link.name} [${link.detail}]`,
    });

    expect(screen.getByText(/Cult Fanatic \[MM p\. 34\]/)).toBeInTheDocument();
  });
});
