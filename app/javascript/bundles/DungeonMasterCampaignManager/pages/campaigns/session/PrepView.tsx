import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { formatCoins } from '../components/CoinFields';
import { linkDetail, LinkName } from '../components/CompendiumLinks';
import SceneThumbnail, { SceneGallery } from '../components/SceneThumbnail';
import { nameWithQuantity } from '../quest/questLinks';
import { CampaignState } from '../useCampaign';
import { Campaign, NPC_ROLE_LABELS, PlannerSession, SessionLink } from '../types';
import { AddHeading, Badge, EmptyState, List, Meta } from '../Campaigns.styles';
import PrepModal from './PrepModal';
import { PartyList, PREP_STEPS, prepLinkGroups, Step } from './prepSteps';

const PrepBar = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  justify-content: space-between;
  margin: 1rem 0;
`;

const StepGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
`;

const Summary = styled(Step)<{ $wide?: boolean }>`
  ${({ $wide }) =>
    $wide &&
    css`
      grid-column: 1 / -1;
    `}
`;

const MapsHeading = styled(AddHeading)`
  margin-top: 0.25rem;
`;

type PrepViewProps = {
  campaign: Campaign;
  session: PlannerSession;
  state: CampaignState;
};

/**
 * A session's prep at a glance, step by step, with "Prep this session" to
 * open the prep in a modal.
 */
const PrepView = ({ campaign, session, state }: PrepViewProps) => {
  const [prepping, setPrepping] = useState(false);
  const { secrets, locations, npcs, monsters, treasure } = prepLinkGroups(session, campaign);
  const coins = formatCoins(session.treasureCurrency);

  // A link's details, then a line of extra details in a list item
  const renderLink = (link: SessionLink, detail?: string | null, extra?: string | null) => (
    <li key={link.id}>
      {link.name}
      {detail && <Meta as="span"> ({detail})</Meta>}
      {extra && <Meta>{extra}</Meta>}
    </li>
  );

  return (
    <>
      <PrepBar>
        <Meta>
          Prep with the Lazy DM&apos;s eight steps: what you pick syncs to Foundry with Dorman
          Lakely&apos;s Campaign Planner.
        </Meta>
        <Button
          color={Colors.primary}
          title="Prep this session"
          onClick={() => setPrepping(true)}
        />
      </PrepBar>

      <StepGrid>
        <Summary>
          <h3>{PREP_STEPS.characters}</h3>
          <PartyList party={campaign.party} />
          {session.characterNotes ? (
            <p>{session.characterNotes}</p>
          ) : (
            <EmptyState>No character notes yet.</EmptyState>
          )}
        </Summary>

        <Summary>
          <h3>{PREP_STEPS.strongStart}</h3>
          {session.strongStart ? (
            <p>{session.strongStart}</p>
          ) : (
            <EmptyState>No strong start yet.</EmptyState>
          )}
        </Summary>

        <Summary>
          <h3>{PREP_STEPS.scenes}</h3>
          {session.scenes.length > 0 ? (
            <List aria-label="Potential scenes">
              {session.scenes.map((scene) => (
                <li key={scene}>{scene}</li>
              ))}
            </List>
          ) : (
            <EmptyState>No scenes yet.</EmptyState>
          )}
        </Summary>

        <Summary>
          <h3>{PREP_STEPS.secrets}</h3>
          {secrets.length > 0 ? (
            <List aria-label="Secrets and clues">
              {secrets.map((link) => {
                const secret = campaign.secrets.find((other) => other.id === link.linkableId);
                return (
                  <li key={link.id}>
                    {secret?.text ?? link.name}
                    {secret?.revealed && (
                      <>
                        {' '}
                        <Badge $tone="success">Revealed</Badge>
                      </>
                    )}
                  </li>
                );
              })}
            </List>
          ) : (
            <EmptyState>No secrets picked yet.</EmptyState>
          )}
          <Meta>
            Write new ones in the{' '}
            <Link to={`/app/campaigns/${campaign.slug}?tab=secrets`}>Secrets tab</Link>.
          </Meta>
        </Summary>

        <Summary $wide>
          <h3>{PREP_STEPS.locations}</h3>
          {locations.length > 0 ? (
            <List aria-label="Locations">
              {locations.map((link) => {
                const place = campaign.locations.find((other) => other.id === link.linkableId);
                return renderLink(link, null, place?.features.join(' · '));
              })}
            </List>
          ) : (
            <EmptyState>No locations picked yet.</EmptyState>
          )}
          <MapsHeading>Maps</MapsHeading>
          {session.foundryScenes.length > 0 ? (
            <SceneGallery aria-label="Session maps">
              {session.foundryScenes.map((scene) => (
                <li key={scene.uuid}>
                  <SceneThumbnail
                    name={scene.name}
                    url={campaign.sceneThumbnails[scene.uuid]}
                    label={null}
                  />
                </li>
              ))}
            </SceneGallery>
          ) : (
            <EmptyState>No maps picked yet.</EmptyState>
          )}
        </Summary>

        <Summary>
          <h3>{PREP_STEPS.npcs}</h3>
          {npcs.length > 0 ? (
            <List aria-label="NPCs">
              {npcs.map((link) => {
                const npc = campaign.npcs.find((other) => other.id === link.linkableId);
                return renderLink(link, npc && NPC_ROLE_LABELS[npc.role], npc?.motive);
              })}
            </List>
          ) : (
            <EmptyState>No NPCs picked yet.</EmptyState>
          )}
        </Summary>

        <Summary>
          <h3>{PREP_STEPS.monsters}</h3>
          {monsters.length > 0 ? (
            <List aria-label="Monsters">
              {monsters.map((link) => {
                const detail = linkDetail(link, campaign);
                return (
                  <li key={link.id}>
                    <LinkName link={link} campaign={campaign} />
                    {detail && <Meta as="span"> ({detail})</Meta>}
                  </li>
                );
              })}
            </List>
          ) : (
            <EmptyState>No monsters picked yet.</EmptyState>
          )}
        </Summary>

        <Summary>
          <h3>{PREP_STEPS.treasure}</h3>
          {!session.treasure && !coins && treasure.length === 0 && (
            <EmptyState>No treasure yet.</EmptyState>
          )}
          {session.treasure && <p>{session.treasure}</p>}
          {coins && <p>{coins}</p>}
          {treasure.length > 0 && (
            <List aria-label="Treasure">
              {treasure.map((link) => {
                const detail = linkDetail(link, campaign);
                return (
                  <li key={link.id}>
                    {nameWithQuantity(link)}
                    {detail && <Meta as="span"> ({detail})</Meta>}
                  </li>
                );
              })}
            </List>
          )}
        </Summary>
      </StepGrid>

      {prepping && (
        <PrepModal
          campaign={campaign}
          session={session}
          state={state}
          onClose={() => setPrepping(false)}
        />
      )}
    </>
  );
};

export default PrepView;
