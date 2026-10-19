import styled from 'styled-components';
import { quickStats } from '../components/CharacterSheetView';
import { MONSTER_CATEGORIES, pickedLinks, REWARD_CATEGORIES } from '../components/CompendiumLinks';
import { Campaign, PartyCharacter, PlannerSession, SessionLink } from '../types';
import { Card, List, Meta } from '../Campaigns.styles';

// The Lazy DM's eight steps, as session prep and its summary head them
export const PREP_STEPS = {
  characters: '1. Review the characters',
  strongStart: '2. Create a strong start',
  scenes: '3. Outline potential scenes',
  secrets: '4. Define secrets and clues',
  locations: '5. Develop fantastic locations',
  npcs: '6. Outline important NPCs',
  monsters: '7. Choose relevant monsters',
  treasure: '8. Select treasure and magic items',
};

export const Step = styled(Card)`
  h3 {
    margin-bottom: 0.25rem;
  }
`;

/**
 * A session's links by step: secrets, locations, NPCs, and the monsters and
 * treasure as session prep lists them
 */
export const prepLinkGroups = (session: PlannerSession, campaign: Campaign) => {
  const ofType = (type: SessionLink['linkableType']) =>
    session.links.filter((link) => link.linkableType === type);
  return {
    secrets: ofType('CampaignSecret'),
    locations: ofType('CampaignLocation'),
    npcs: ofType('CampaignNpc'),
    monsters: pickedLinks(session.links, campaign, 'Monster', MONSTER_CATEGORIES),
    treasure: pickedLinks(session.links, campaign, 'Item', REWARD_CATEGORIES),
  };
};

/** The party with quick stats and the hooks in their sheets (bonds and flaws) */
export const PartyList = ({ party }: { party: PartyCharacter[] }) =>
  party.length > 0 ? (
    <List aria-label="The party">
      {party.map((character) => (
        <li key={character.id}>
          <strong>{character.name}</strong>
          {character.sheet.summary && ` (${character.sheet.summary})`}
          {quickStats(character.sheet) && <Meta as="span"> · {quickStats(character.sheet)}</Meta>}
          {[
            character.sheet.personality?.bonds && `Bond: ${character.sheet.personality.bonds}`,
            character.sheet.personality?.flaws && `Flaw: ${character.sheet.personality.flaws}`,
          ]
            .filter(Boolean)
            .map((hook) => (
              <Meta key={hook as string}>{hook}</Meta>
            ))}
        </li>
      ))}
    </List>
  ) : null;
