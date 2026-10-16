import React from 'react';
import { render, screen } from '../../../test-utils';
import LinkPicker from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/LinkPicker';
import { SessionLink } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { sampleCampaign } from '../fixtures';
import { chooseOption, menuOptions, openSelect, removeValue } from '../selectHelpers';

const links: SessionLink[] = sampleCampaign().sessions[1].links;

const secretOptions = [
  { id: 's1', label: 'The mayor is a cultist' },
  { id: 's2', label: "Lareth wears the mayor's ring" },
  { id: 's3', label: 'The tunnel leads to the moathouse' },
];

const renderPicker = (props: Partial<React.ComponentProps<typeof LinkPicker>> = {}) => {
  const onAdd = jest.fn();
  const onRemove = jest.fn();
  const view = render(
    <LinkPicker
      label="Add a secret"
      linkableType="CampaignSecret"
      links={links}
      options={secretOptions}
      emptyText="No secrets in the campaign yet."
      onAdd={onAdd}
      onRemove={onRemove}
      {...props}
    />,
  );
  return { ...view, onAdd, onRemove };
};

describe('LinkPicker', () => {
  it('shows what is linked of its type as removable values', () => {
    renderPicker();

    expect(screen.getByText('The mayor is a cultist')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove The mayor is a cultist' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Hommlet/)).not.toBeInTheDocument();
  });

  it('offers only what is not linked yet', () => {
    renderPicker();
    openSelect('Add a secret');

    expect(menuOptions()).toEqual([
      "Lareth wears the mayor's ring",
      'The tunnel leads to the moathouse',
    ]);
  });

  it('filters the options as you type', () => {
    renderPicker();
    openSelect('Add a secret', 'tunnel');

    expect(menuOptions()).toEqual(['The tunnel leads to the moathouse']);
  });

  it('adds the picked option', async () => {
    const { onAdd } = renderPicker();

    await chooseOption('Add a secret', "Lareth wears the mayor's ring");

    expect(onAdd).toHaveBeenCalledWith('CampaignSecret', 's2');
  });

  it('removes a linked record with its ×', () => {
    const { onRemove } = renderPicker();

    removeValue('The mayor is a cultist');

    expect(onRemove).toHaveBeenCalledWith(
      expect.objectContaining({ linkableType: 'CampaignSecret', linkableId: 's1' }),
    );
  });

  it('only shows links within its scope', () => {
    renderPicker({ scopeIds: ['s2'] });

    expect(screen.queryByText('The mayor is a cultist')).not.toBeInTheDocument();
  });

  it('says when the campaign has nothing to pick', () => {
    renderPicker({ links: [], options: [] });
    openSelect('Add a secret');

    expect(screen.getByText('No secrets in the campaign yet.')).toBeInTheDocument();
  });
});
