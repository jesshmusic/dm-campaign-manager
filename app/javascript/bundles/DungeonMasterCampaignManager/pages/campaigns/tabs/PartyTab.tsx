import { useState } from 'react';
import styled from 'styled-components';
import CharacterSheetView, { quickStats } from '../components/CharacterSheetView';
import PartyPicker from '../components/PartyPicker';
import useLoadedList from '../useLoadedList';
import { CampaignState } from '../useCampaign';
import { Campaign, PartyCharacter } from '../types';
import { Card, EmptyState, Meta, SectionTitle } from '../Campaigns.styles';

const Characters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SheetToggle = styled.details`
  margin-top: 0.5rem;

  summary {
    cursor: pointer;
    font-weight: bold;
  }
`;

type PartyTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

/** The campaign's party, with their character sheets from Foundry, and who to put in it. */
const PartyTab = ({ campaign, state }: PartyTabProps) => {
  const characters = useLoadedList(state.api.listPlayerCharacters);
  // Each change saves the whole party, so wait for one save before the next
  const [saving, setSaving] = useState(false);

  const saveParty = async (ids: string[]) => {
    setSaving(true);
    await state.updateCampaign({ party_character_ids: ids });
    setSaving(false);
  };

  const card = (character: PartyCharacter) => (
    <Card key={character.id}>
      <h3>{character.name}</h3>
      <Meta>
        {[
          character.sheet.summary,
          character.playerName && `played by ${character.playerName}`,
          character.worldTitle && `from ${character.worldTitle}`,
        ]
          .filter(Boolean)
          .join(', ')}
      </Meta>
      {quickStats(character.sheet) && <p>{quickStats(character.sheet)}</p>}
      <SheetToggle>
        <summary>Character sheet</summary>
        <CharacterSheetView sheet={character.sheet} />
      </SheetToggle>
    </Card>
  );

  return (
    <>
      <Meta>
        Character sheets come from Foundry and update when they change there. Spell, feature and
        item descriptions stay in Foundry; only their names come here.
      </Meta>
      <SectionTitle>The party</SectionTitle>
      {campaign.party.length > 0 ? (
        <Characters>{campaign.party.map(card)}</Characters>
      ) : (
        <EmptyState>No one is in the party yet. Choose the characters below.</EmptyState>
      )}
      <SectionTitle>Choose the party</SectionTitle>
      <Card>
        <PartyPicker
          characters={characters}
          selected={campaign.party.map((character) => character.id)}
          onChange={(ids) => void saveParty(ids)}
          disabled={saving}
        />
      </Card>
    </>
  );
};

export default PartyTab;
