import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../../../test-utils';
import EncounterCard from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/EncounterCard';
import {
  draftForEncounter,
  EncounterDraft,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/encounterDraft';
import { encounter, makeApi, questLink, sampleCampaign } from '../fixtures';

const AMBUSH = draftForEncounter(
  encounter({
    id: 'e1',
    name: 'Ambush',
    links: [
      questLink({
        id: 'el1',
        linkableType: 'Monster',
        linkableId: '12',
        name: 'Ghoul',
        challengeRating: '1',
        quantity: 2,
      }),
      questLink({ id: 'el2', linkableType: 'CampaignNpc', linkableId: 'n1', name: 'Lareth' }),
    ],
  }),
);

const renderCard = (draft: EncounterDraft = AMBUSH, index = 0, count = 2) => {
  const campaign = sampleCampaign();
  const onChange = jest.fn();
  const onMove = jest.fn();
  const onRemove = jest.fn();
  render(
    <MemoryRouter>
      <EncounterCard
        campaign={campaign}
        api={makeApi()}
        quest={campaign.quests[0]}
        draft={draft}
        index={index}
        count={count}
        onChange={onChange}
        onMove={onMove}
        onRemove={onRemove}
      />
    </MemoryRouter>,
  );
  // What the last change does to the draft
  const changed = () =>
    (onChange.mock.calls.at(-1)?.[0] as (d: EncounterDraft) => EncounterDraft)(draft);
  return { onChange, onMove, onRemove, changed };
};

const card = () => screen.getByRole('region', { name: 'Encounter 1: Ambush' });

describe('EncounterCard', () => {
  it('shows the encounter by its place and name, with its monsters and NPCs', () => {
    renderCard();

    expect(within(card()).getByRole('textbox', { name: 'Name' })).toHaveValue('Ambush');
    expect(within(card()).getByRole('combobox', { name: 'Type' })).toHaveValue('combat');
    expect(within(card()).getByRole('spinbutton', { name: 'Quantity of Ghoul' })).toHaveValue(2);
    expect(within(card()).getByText('Lareth (Enemy)')).toBeInTheDocument();
    expect(within(card()).getByRole('note')).toHaveTextContent('Low: 400 XP');
  });

  it('changes its name, type and description through the draft', () => {
    const { changed } = renderCard();

    fireEvent.change(within(card()).getByRole('textbox', { name: 'Name' }), {
      target: { value: 'Bandits' },
    });
    expect(changed().name).toBe('Bandits');

    fireEvent.change(within(card()).getByRole('combobox', { name: 'Type' }), {
      target: { value: 'trap' },
    });
    expect(changed().kind).toBe('trap');

    fireEvent.change(within(card()).getByRole('textbox', { name: 'Description' }), {
      target: { value: 'Hidden archers' },
    });
    expect(changed().description).toBe('Hidden archers');
  });

  it('changes how many of a monster, and removes one', () => {
    const { changed } = renderCard();

    fireEvent.change(within(card()).getByRole('spinbutton', { name: 'Quantity of Ghoul' }), {
      target: { value: '5' },
    });
    expect(changed().links[0].quantityText).toBe('5');

    fireEvent.click(within(card()).getByRole('button', { name: 'Remove Ghoul' }));
    expect(changed().links.map((link) => link.name)).toEqual(['Lareth']);
  });

  it('moves and removes itself', () => {
    const { onMove, onRemove } = renderCard();

    expect(within(card()).getByRole('button', { name: 'Move Ambush up' })).toBeDisabled();
    fireEvent.click(within(card()).getByRole('button', { name: 'Move Ambush down' }));
    fireEvent.click(within(card()).getByRole('button', { name: 'Remove Ambush' }));

    expect(onMove).toHaveBeenCalledWith(1);
    expect(onRemove).toHaveBeenCalled();
  });

  it('shows no difficulty for anything but a fight, and names one without a name by its place', () => {
    renderCard({ ...AMBUSH, name: ' ', kind: 'social' }, 1, 2);

    const region = screen.getByRole('region', { name: 'Encounter 2: Encounter 2' });
    expect(within(region).queryByRole('note')).not.toBeInTheDocument();
    expect(within(region).getByRole('button', { name: 'Move Encounter 2 down' })).toBeDisabled();
  });
});
