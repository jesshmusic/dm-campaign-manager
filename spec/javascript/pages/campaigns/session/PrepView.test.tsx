import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PrepView from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/session/PrepView';
import {
  Campaign,
  PlannerSession,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import {
  FakeState,
  makeState,
  plannerSession,
  playerCharacter,
  questLink,
  reference,
  sampleCampaign,
} from '../fixtures';

const renderPrep = (
  campaign: Campaign = sampleCampaign(),
  session: PlannerSession = campaign.sessions[1],
  state: FakeState = makeState(),
) => {
  render(
    <MemoryRouter>
      <PrepView campaign={campaign} session={session} state={state} />
    </MemoryRouter>,
  );
  return { campaign, session, state };
};

// Each step is a card headed "N. ..."
const step = (number: number) =>
  screen.getByRole('heading', { name: new RegExp(`^${number}\\. `) }).parentElement as HTMLElement;

const itemsOf = (list: HTMLElement) =>
  within(list)
    .getAllByRole('listitem')
    .map((item) => item.textContent);

describe('PrepView', () => {
  it("sums up the session's prep in the Lazy DM's eight steps", () => {
    renderPrep();

    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    ).toEqual([
      '1. Review the characters',
      '2. Create a strong start',
      '3. Outline potential scenes',
      '4. Define secrets and clues',
      '5. Develop fantastic locations',
      '6. Outline important NPCs',
      '7. Choose relevant monsters',
      '8. Select treasure and magic items',
    ]);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the notes, strong start and scenes', () => {
    renderPrep();

    expect(within(step(1)).getByText('Aria wants revenge')).toBeInTheDocument();
    expect(within(step(2)).getByText('The bell tolls at midnight')).toBeInTheDocument();
    expect(itemsOf(within(step(3)).getByRole('list', { name: 'Potential scenes' }))).toEqual([
      'Fight at the gate',
      'Meet Elmo',
    ]);
  });

  it('lists the party with quick stats and hooks', () => {
    renderPrep(sampleCampaign({ party: [playerCharacter()] }));

    const akra = within(within(step(1)).getByRole('list', { name: 'The party' })).getByRole(
      'listitem',
    );
    expect(akra).toHaveTextContent('Akra (Level 5 Dragonborn Cleric (Life Domain))');
    expect(akra).toHaveTextContent('AC 18 · HP 38 · Speed 30 ft · Passive Perception 13');
    expect(within(akra).getByText('Bond: My temple in Hommlet')).toBeInTheDocument();
    expect(within(akra).getByText('Flaw: Too trusting')).toBeInTheDocument();
  });

  it('lists the secrets picked, marking the revealed ones, and links to the Secrets tab', () => {
    const campaign = sampleCampaign();
    campaign.sessions[1].links.push(
      questLink({ id: 'link7', linkableType: 'CampaignSecret', linkableId: 's3', name: 'Tunnel' }),
    );
    renderPrep(campaign);

    const secrets = within(step(4)).getByRole('list', { name: 'Secrets and clues' });
    expect(itemsOf(secrets)).toEqual([
      'The mayor is a cultist',
      'The moathouse has a tunnel Revealed',
    ]);
    expect(within(step(4)).getByRole('link', { name: 'Secrets tab' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege?tab=secrets',
    );
  });

  it('lists the locations with their features, and the maps as thumbnails', () => {
    const campaign = sampleCampaign();
    campaign.sessions[1].foundryScenes = [
      { uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Mountain Pass' },
      { uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Cragmaw Cave' },
    ];
    campaign.sceneThumbnails = { 'Scene.5wVcsNPOg2RjRbFx': 'https://example.com/pass.webp' };
    renderPrep(campaign);

    expect(itemsOf(within(step(5)).getByRole('list', { name: 'Locations' }))).toEqual([
      'HommletInn of the Welcome Wench · Druid grove',
    ]);
    const maps = within(step(5)).getByRole('list', { name: 'Session maps' });
    expect(within(maps).getByRole('img', { name: 'Map: Mountain Pass' })).toHaveAttribute(
      'src',
      'https://example.com/pass.webp',
    );
    // No thumbnail until Foundry sends one
    expect(within(maps).queryByRole('img', { name: 'Map: Cragmaw Cave' })).not.toBeInTheDocument();
    expect(within(maps).getByText('Cragmaw Cave')).toBeInTheDocument();
  });

  it('lists the NPCs with their roles and what they want', () => {
    renderPrep();

    expect(itemsOf(within(step(6)).getByRole('list', { name: 'NPCs' }))).toEqual([
      'Elmo (Ally)Protect the village',
    ]);
  });

  it('lists the monsters, linked to their pages, with book citations', () => {
    renderPrep();

    expect(itemsOf(within(step(7)).getByRole('list', { name: 'Monsters' }))).toEqual([
      'Ghoul',
      'Cult Fanatic (CR 2 · MM p. 34)',
    ]);
    expect(within(step(7)).getByRole('link', { name: 'Ghoul' })).toHaveAttribute(
      'href',
      '/app/2024/monsters/ghoul',
    );
  });

  it('shows the treasure: notes, coins and items with how many', () => {
    const campaign = sampleCampaign();
    const session = campaign.sessions[1];
    session.treasureCurrency = { gp: 50, sp: 12 };
    session.links = session.links.map((link) =>
      link.id === 'link6' ? { ...link, quantity: 2 } : link,
    );
    session.links.push(
      questLink({
        id: 'link7',
        linkableType: 'Item',
        linkableId: '40',
        name: 'Potion of Healing',
        detail: 'common',
      }),
    );
    renderPrep(campaign);

    expect(within(step(8)).getByText('200 gp')).toBeInTheDocument();
    expect(within(step(8)).getByText('50 gp, 12 sp')).toBeInTheDocument();
    expect(itemsOf(within(step(8)).getByRole('list', { name: 'Treasure' }))).toEqual([
      'Bag of Holding ×2 (DMG p. 224)',
      'Potion of Healing (common)',
    ]);
  });

  it('lists any book reference but a monster as treasure, as session prep does', () => {
    const campaign = sampleCampaign();
    campaign.references.push(
      reference({
        id: 'r5',
        name: 'Fireball',
        book: 'phb',
        category: 'spell',
        citation: 'PHB p. 241',
      }),
      reference({
        id: 'r6',
        name: 'Grappling',
        book: 'phb',
        category: 'rule',
        citation: 'PHB p. 366',
      }),
      reference({
        id: 'r7',
        name: 'A ship',
        book: 'dmg',
        category: 'other',
        citation: 'DMG p. 60',
      }),
    );
    const session = campaign.sessions[1];
    session.links = [
      ...session.links,
      ...[
        ['r5', 'Fireball'],
        ['r6', 'Grappling'],
        ['r7', 'A ship'],
        // Not in the campaign's books
        ['r99', 'Gone'],
      ].map(([id, name]) =>
        questLink({ id: `link-${id}`, linkableType: 'CampaignReference', linkableId: id, name }),
      ),
    ];
    renderPrep(campaign);

    expect(itemsOf(within(step(7)).getByRole('list', { name: 'Monsters' }))).toEqual([
      'Ghoul',
      'Cult Fanatic (CR 2 · MM p. 34)',
    ]);
    expect(itemsOf(within(step(8)).getByRole('list', { name: 'Treasure' }))).toEqual([
      'Bag of Holding (DMG p. 224)',
      'Fireball (PHB p. 241)',
      'Grappling (PHB p. 366)',
      'A ship (DMG p. 60)',
    ]);
  });

  it('says what a fresh session has not prepped yet', () => {
    renderPrep(sampleCampaign(), plannerSession({ id: 'sess3', number: 3 }));

    expect(within(step(1)).getByText('No character notes yet.')).toBeInTheDocument();
    expect(within(step(2)).getByText('No strong start yet.')).toBeInTheDocument();
    expect(within(step(3)).getByText('No scenes yet.')).toBeInTheDocument();
    expect(within(step(4)).getByText('No secrets picked yet.')).toBeInTheDocument();
    expect(within(step(5)).getByText('No locations picked yet.')).toBeInTheDocument();
    expect(within(step(5)).getByText('No maps picked yet.')).toBeInTheDocument();
    expect(within(step(6)).getByText('No NPCs picked yet.')).toBeInTheDocument();
    expect(within(step(7)).getByText('No monsters picked yet.')).toBeInTheDocument();
    expect(within(step(8)).getByText('No treasure yet.')).toBeInTheDocument();
    expect(screen.queryByRole('list', { name: 'The party' })).not.toBeInTheDocument();
  });

  describe('Prep this session', () => {
    it('opens the prep in a modal and closes it on Cancel', () => {
      const { state } = renderPrep();

      fireEvent.click(screen.getByRole('button', { name: 'Prep this session' }));

      const prep = screen.getByRole('dialog', { name: 'Prep Session 2' });
      expect(within(prep).getByRole('textbox', { name: 'Strong start' })).toHaveValue(
        'The bell tolls at midnight',
      );
      fireEvent.click(within(prep).getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(state.api.updateChild).not.toHaveBeenCalled();
    });

    it('saves the prep, reloads the campaign once and closes', async () => {
      const { state } = renderPrep();

      fireEvent.click(screen.getByRole('button', { name: 'Prep this session' }));
      const prep = screen.getByRole('dialog', { name: 'Prep Session 2' });
      fireEvent.change(within(prep).getByRole('textbox', { name: 'Strong start' }), {
        target: { value: 'Zombies at the gate' },
      });
      fireEvent.click(within(prep).getByRole('button', { name: 'Save' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(state.api.updateChild).toHaveBeenCalledWith('zombie-siege', 'sessions', 'sess2', {
        strong_start: 'Zombies at the gate',
      });
      expect(state.reload).toHaveBeenCalledTimes(1);
    });
  });
});
