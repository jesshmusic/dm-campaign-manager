import {
  draftForEncounter,
  encounterAttributes,
  encountersChanged,
  moveEncounter,
  newEncounterDraft,
  planEncounters,
  questEncounters,
  saveEncounters,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/quest/encounterDraft';
import { referenceMaker } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/planDraft';
import { addDraftLink } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/linkDraft';
import { encounter, makeApi, questLink, sampleCampaign } from '../fixtures';

const GHOUL = questLink({
  id: 'el1',
  linkableType: 'Monster',
  linkableId: '12',
  name: 'Ghoul',
  quantity: 4,
});
const AMBUSH = encounter({
  id: 'e1',
  name: 'Ambush',
  description: 'At the gate',
  rewardCurrency: { gp: 10 },
  rewardXp: 50,
  links: [GHOUL],
});
const DOOR = encounter({ id: 'e2', name: 'Riddle door', kind: 'puzzle', position: 1 });

describe('encounter drafts', () => {
  const campaign = sampleCampaign({
    encounters: [DOOR, AMBUSH, encounter({ id: 'e3', questId: 'q2', name: 'Elsewhere' })],
  });

  it("lists a quest's encounters in order", () => {
    expect(questEncounters(campaign.quests[0], campaign).map((each) => each.id)).toEqual([
      'e1',
      'e2',
    ]);
    expect(questEncounters(campaign.quests[2], campaign)).toEqual([]);
  });

  it('drafts an encounter as the modal edits it', () => {
    expect(draftForEncounter(AMBUSH)).toEqual({
      key: 'e1',
      savedId: 'e1',
      name: 'Ambush',
      kind: 'combat',
      description: 'At the gate',
      foundryScenes: [],
      coins: { pp: '', gp: '10', ep: '', sp: '', cp: '' },
      xp: '50',
      links: [GHOUL],
    });
  });

  it('starts a new fight named for its place, with a key of its own', () => {
    const first = newEncounterDraft(3);
    const second = newEncounterDraft(3);

    expect(first).toMatchObject({ savedId: null, name: 'Encounter 3', kind: 'combat', links: [] });
    expect(first.key).toMatch(/^new-encounter-/);
    expect(second.key).not.toBe(first.key);
  });

  it('moves one up or down, but not past either end', () => {
    const drafts = [AMBUSH, DOOR].map(draftForEncounter);

    expect(moveEncounter(drafts, 0, 1).map((draft) => draft.key)).toEqual(['e2', 'e1']);
    expect(moveEncounter(drafts, 1, -1).map((draft) => draft.key)).toEqual(['e2', 'e1']);
    expect(moveEncounter(drafts, 0, -1)).toBe(drafts);
    expect(moveEncounter(drafts, 1, 1)).toBe(drafts);
  });

  describe('attributes', () => {
    it('saves its fields at its place in the quest', () => {
      expect(encounterAttributes({ ...draftForEncounter(AMBUSH), name: ' Ambush ' }, 2)).toEqual({
        attributes: {
          name: 'Ambush',
          kind: 'combat',
          description: 'At the gate',
          position: 2,
          foundry_scenes: [],
          reward_currency: { gp: 10 },
          reward_xp: 50,
        },
      });
    });

    it('clears a blank description and XP', () => {
      const attributes = encounterAttributes(
        { ...draftForEncounter(AMBUSH), description: '  ', xp: '' },
        0,
      );

      expect(attributes).toMatchObject({ attributes: { description: null, reward_xp: null } });
    });

    it.each([
      [{ name: ' ' }, 'Encounter 2 needs a name.'],
      [{ name: 'x'.repeat(121) }, "Encounter 2's name can be up to 120 characters."],
      [
        { coins: { pp: '', gp: '-1', ep: '', sp: '', cp: '' } },
        'Ambush: Coins must be whole numbers',
      ],
      [{ xp: '1.5' }, 'Ambush: XP must be a whole number from 0 to 1,000,000.'],
    ])('refuses %j', (changes, message) => {
      const result = encounterAttributes({ ...draftForEncounter(AMBUSH), ...changes }, 1);

      expect('error' in result && result.error).toContain(message);
    });
  });

  describe('changes', () => {
    const saved = [AMBUSH, DOOR];
    const drafts = () => saved.map(draftForEncounter);

    it('has none when the drafts are the saved encounters', () => {
      expect(encountersChanged(drafts(), saved, campaign.references)).toBe(false);
    });

    it('sees a new, removed or moved encounter', () => {
      expect(encountersChanged([...drafts(), newEncounterDraft(3)], saved, [])).toBe(true);
      expect(encountersChanged(drafts().slice(1), saved, [])).toBe(true);
      expect(encountersChanged(moveEncounter(drafts(), 0, 1), saved, [])).toBe(true);
    });

    it('sees a changed field, link or count', () => {
      const [ambush, door] = drafts();

      expect(encountersChanged([{ ...ambush, kind: 'trap' }, door], saved, [])).toBe(true);
      expect(encountersChanged([{ ...ambush, links: [] }, door], saved, [])).toBe(true);
      expect(
        encountersChanged(
          [{ ...ambush, links: [{ ...GHOUL, quantityText: '5' }] }, door],
          saved,
          [],
        ),
      ).toBe(true);
      expect(
        encountersChanged(
          [{ ...ambush, links: [{ ...GHOUL, quantityText: '0' }] }, door],
          saved,
          [],
        ),
      ).toBe(true);
    });

    it('takes a link removed and picked again as no change', () => {
      const [ambush, door] = drafts();
      const picked = addDraftLink([], {
        linkableType: 'Monster',
        linkableId: '12',
        name: 'Ghoul',
        detail: null,
      });

      expect(
        encountersChanged(
          [{ ...ambush, links: [{ ...picked[0], quantityText: '4' }] }, door],
          saved,
          [],
        ),
      ).toBe(false);
    });
  });

  describe('planning a Save', () => {
    it('plans each draft at its place, with the encounter it changes', () => {
      const planned = planEncounters(
        [draftForEncounter(DOOR), newEncounterDraft(2)],
        [AMBUSH, DOOR],
        [],
      );

      expect(
        'plans' in planned &&
          planned.plans.map((plan) => [plan.saved?.id, plan.attributes.position]),
      ).toEqual([
        ['e2', 0],
        [undefined, 1],
      ]);
    });

    it('stops at the first draft it would refuse', () => {
      expect(
        planEncounters(
          [{ ...draftForEncounter(AMBUSH), links: [{ ...GHOUL, quantityText: '0' }] }],
          [AMBUSH],
          [],
        ),
      ).toEqual({ error: 'Ambush: Quantities must be whole numbers from 1 to 9,999.' });
      expect(planEncounters([{ ...draftForEncounter(AMBUSH), name: '' }], [AMBUSH], [])).toEqual({
        error: 'Encounter 1 needs a name.',
      });
    });
  });

  describe('saving', () => {
    it('deletes the ones dropped, then adds and changes the rest in order', async () => {
      const api = makeApi({ createEncounter: jest.fn().mockResolvedValue({ id: 'e7' }) });
      const onCreated = jest.fn();
      const fresh = newEncounterDraft(2);
      const drafts = [
        fresh,
        { ...draftForEncounter(AMBUSH), name: 'Bandits', links: [{ ...GHOUL, quantity: 2 }] },
      ];
      const planned = planEncounters(drafts, [AMBUSH, DOOR], []);
      if (!('plans' in planned)) throw new Error(planned.error);

      await saveEncounters({
        api,
        campaign,
        quest: campaign.quests[0],
        saved: [AMBUSH, DOOR],
        plans: planned.plans,
        reference: referenceMaker(api, campaign),
        onCreated,
      });

      expect(api.deleteEncounter.mock.calls).toEqual([['zombie-siege', 'q1', 'e2']]);
      expect(api.createEncounter).toHaveBeenCalledWith(
        'zombie-siege',
        'q1',
        expect.objectContaining({ name: 'Encounter 2', position: 0 }),
      );
      expect(onCreated).toHaveBeenCalledWith(fresh.key, 'e7');
      expect(api.updateEncounter.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e1', { name: 'Bandits', position: 1 }],
      ]);
      expect(api.updateEncounterLink.mock.calls).toEqual([
        ['zombie-siege', 'q1', 'e1', 'el1', { quantity: 2 }],
      ]);
      expect(api.deleteEncounter.mock.invocationCallOrder[0]).toBeLessThan(
        api.createEncounter.mock.invocationCallOrder[0],
      );
    });
  });
});
