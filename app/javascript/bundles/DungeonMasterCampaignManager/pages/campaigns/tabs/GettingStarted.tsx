import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Campaign, THREE_CLUE_MINIMUM } from '../types';
import { Badge, Card, CardHeader, LinkButton, Meta } from '../Campaigns.styles';

const Steps = styled.ol`
  margin: 0.5rem 0;
  padding-left: 1.25rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

const hiddenKey = (campaignId: string) => `dmguru.gettingStarted.${campaignId}.hidden`;

const isHidden = (campaignId: string) => {
  try {
    return window.localStorage.getItem(hiddenKey(campaignId)) === 'true';
  } catch {
    return false;
  }
};

/**
 * What to do next with a new campaign, checked off from what the campaign
 * already has. Goes away when everything is done, or when the DM hides it.
 */
const GettingStarted = ({ campaign }: { campaign: Campaign }) => {
  const [hidden, setHidden] = useState(() => isHidden(campaign.id));
  const base = `/app/campaigns/${campaign.slug}`;
  const firstSession = [...campaign.sessions].sort((a, b) => a.number - b.number)[0];

  const steps = [
    {
      label: 'Choose the party',
      detail: 'Pick the player characters, so session prep starts with them.',
      done: campaign.party.length > 0,
      to: `${base}?tab=party`,
    },
    {
      label: 'Give your villain a threat',
      detail: 'A front with grim portents, and a clock that fills if the heroes do nothing.',
      done: campaign.fronts.length > 0,
      to: `${base}?tab=story`,
    },
    {
      label: 'Add the cast',
      detail: 'At least three NPCs: a villain, an ally, and someone in between.',
      done: campaign.npcs.length >= 3,
      to: `${base}?tab=cast`,
    },
    {
      label: 'Hide some secrets',
      detail: 'Give each revelation three clues, so the players have more than one way to find it.',
      done:
        campaign.revelations.length > 0 &&
        campaign.revelations.every((revelation) => revelation.clueCount >= THREE_CLUE_MINIMUM),
      to: `${base}?tab=secrets`,
    },
    {
      label: 'Prep the first session',
      detail: 'Write a strong start: something already happening when play begins.',
      done: Boolean(firstSession?.strongStart),
      to: firstSession ? `${base}/sessions/${firstSession.id}?mode=prep` : `${base}?tab=sessions`,
    },
  ];
  const doneCount = steps.filter((step) => step.done).length;

  if (hidden || doneCount === steps.length) return null;

  const hide = () => {
    try {
      window.localStorage.setItem(hiddenKey(campaign.id), 'true');
    } catch {
      // Hidden for now, if not next time
    }
    setHidden(true);
  };

  return (
    <Card>
      <CardHeader>
        <h3>Getting started</h3>
        <Meta>
          {doneCount} of {steps.length} done
        </Meta>
      </CardHeader>
      <Steps>
        {steps.map((step) => (
          <li key={step.label}>
            <Link to={step.to}>{step.label}</Link>{' '}
            {step.done && <Badge $tone="success">Done</Badge>}
            <Meta>{step.detail}</Meta>
          </li>
        ))}
      </Steps>
      <LinkButton type="button" onClick={hide}>
        Hide this list
      </LinkButton>
    </Card>
  );
};

export default GettingStarted;
