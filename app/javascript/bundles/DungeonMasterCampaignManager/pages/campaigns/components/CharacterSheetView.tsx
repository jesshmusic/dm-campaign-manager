import React from 'react';
import styled from 'styled-components';
import { CharacterSheet } from '../types';
import { Meta } from '../Campaigns.styles';

// The sheet comes from the Foundry module, so every part may be missing
const listOf = <T,>(value: T[] | undefined): T[] => (Array.isArray(value) ? value : []);

export const signed = (value?: number) =>
  typeof value !== 'number' ? '—' : value >= 0 ? `+${value}` : `${value}`;

/** "AC 18 · HP 38 · Speed 30 ft · Passive Perception 13 · Spell DC 14" */
export const quickStats = (sheet: CharacterSheet) =>
  [
    typeof sheet.ac === 'number' && `AC ${sheet.ac}`,
    typeof sheet.hpMax === 'number' && `HP ${sheet.hpMax}`,
    sheet.speed?.walk && `Speed ${sheet.speed.walk} ft`,
    typeof sheet.passives?.perception === 'number' &&
      `Passive Perception ${sheet.passives.perception}`,
    typeof sheet.spellcasting?.dc === 'number' && `Spell DC ${sheet.spellcasting.dc}`,
  ]
    .filter(Boolean)
    .join(' · ');

const PROFICIENCY_MARKS: Record<string, { mark: string; label: string }> = {
  '0.5': { mark: '◐', label: 'half proficient' },
  '1': { mark: '●', label: 'proficient' },
  '2': { mark: '◆', label: 'expertise' },
};

const FEATURE_KINDS: Record<string, string> = {
  class: 'Class',
  race: 'Species',
  background: 'Background',
  feat: 'Feats',
};

const SPEED_LABELS: Record<string, string> = {
  walk: 'Walk',
  burrow: 'Burrow',
  climb: 'Climb',
  fly: 'Fly',
  swim: 'Swim',
};

const Sheet = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  margin-top: 0.75rem;

  h4 {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0 0 0.25rem;
  }
`;

const Wide = styled.section`
  grid-column: 1 / -1;
`;

const Abilities = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
`;

const Ability = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  padding: 0.25rem;

  strong {
    display: block;
    font-size: 1.25rem;
  }
`;

const Compact = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    gap: 0.5rem;
    justify-content: space-between;
  }
`;

const Backstory = styled.p`
  white-space: pre-wrap;
`;

const Fact = ({ label, value }: { label: string; value?: React.ReactNode }) =>
  value === undefined || value === null || value === '' ? null : (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  );

const joined = (values?: string[]) => listOf(values).join(', ') || undefined;

/** A player character's full sheet, as the Foundry module sends it. */
const CharacterSheetView = ({ sheet }: { sheet: CharacterSheet }) => {
  const abilities = listOf(sheet.abilities);
  const skills = listOf(sheet.skills);
  const spellcasting = sheet.spellcasting;
  const spells = listOf(spellcasting?.spells);
  const spellLevels = [...new Set(spells.map((spell) => spell.level))].sort((a, b) => a - b);
  // "Level 1 × 4, Level 2 × 3": slots per long rest, not how many are left
  const slots = listOf(spellcasting?.slots)
    .map((slot) => `${slot.label} × ${slot.max}`)
    .join(', ');
  const features = listOf(sheet.features);
  const featureKinds = [...new Set(features.map((feature) => feature.kind ?? 'other'))];
  const inventory = listOf(sheet.inventory);
  const currency = Object.entries(sheet.currency ?? {})
    .filter(([, amount]) => amount)
    .map(([coin, amount]) => `${amount} ${coin}`)
    .join(', ');
  const personality = sheet.personality ?? {};
  const details = sheet.details ?? {};

  return (
    <Sheet>
      {abilities.length > 0 && (
        <section>
          <h4>Abilities</h4>
          <Abilities>
            {abilities.map((ability) => (
              <Ability key={ability.key}>
                {ability.label}
                <strong>{ability.score ?? '—'}</strong>
                <Meta>
                  {signed(ability.mod)} · save {signed(ability.save)}
                  {ability.proficient && <span title="proficient"> ●</span>}
                </Meta>
              </Ability>
            ))}
          </Abilities>
        </section>
      )}

      <section>
        <h4>Combat</h4>
        <Fact label="Armor Class" value={sheet.ac} />
        <Fact label="Hit point maximum" value={sheet.hpMax} />
        <Fact
          label="Initiative"
          value={typeof sheet.initiative === 'number' ? signed(sheet.initiative) : undefined}
        />
        <Fact
          label="Proficiency bonus"
          value={typeof sheet.proficiency === 'number' ? signed(sheet.proficiency) : undefined}
        />
        <Fact
          label="Speed"
          value={
            Object.entries(sheet.speed ?? {})
              .map(([kind, feet]) => `${SPEED_LABELS[kind] ?? kind} ${feet} ft`)
              .join(', ') || undefined
          }
        />
        <Fact label="Senses" value={joined(sheet.senses)} />
        <Fact label="Resistances" value={joined(sheet.defenses?.resistances)} />
        <Fact label="Immunities" value={joined(sheet.defenses?.immunities)} />
        <Fact label="Vulnerabilities" value={joined(sheet.defenses?.vulnerabilities)} />
        <Fact label="Condition immunities" value={joined(sheet.defenses?.conditionImmunities)} />
      </section>

      {skills.length > 0 && (
        <section>
          <h4>Skills</h4>
          <Compact>
            {skills.map((skill) => {
              const proficiency = PROFICIENCY_MARKS[String(skill.proficiency ?? 0)];
              return (
                <li key={skill.key}>
                  <span>
                    {skill.label}
                    {proficiency && <span title={proficiency.label}> {proficiency.mark}</span>}
                  </span>
                  <span>{signed(skill.total)}</span>
                </li>
              );
            })}
          </Compact>
          <Meta>● proficient · ◆ expertise · ◐ half proficient</Meta>
          <Meta>
            {[
              typeof sheet.passives?.perception === 'number' &&
                `Passive Perception ${sheet.passives.perception}`,
              typeof sheet.passives?.insight === 'number' && `Insight ${sheet.passives.insight}`,
              typeof sheet.passives?.investigation === 'number' &&
                `Investigation ${sheet.passives.investigation}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Meta>
        </section>
      )}

      <section>
        <h4>Proficiencies and languages</h4>
        <Fact label="Armor" value={joined(sheet.proficiencies?.armor)} />
        <Fact label="Weapons" value={joined(sheet.proficiencies?.weapons)} />
        <Fact label="Tools" value={joined(sheet.proficiencies?.tools)} />
        <Fact label="Languages" value={joined(sheet.languages)} />
      </section>

      {spellcasting && (
        <Wide>
          <h4>Spellcasting</h4>
          <Meta>
            {[
              spellcasting.ability,
              typeof spellcasting.dc === 'number' && `Save DC ${spellcasting.dc}`,
              typeof spellcasting.attack === 'number' && `Attack ${signed(spellcasting.attack)}`,
              slots && `Slots: ${slots}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Meta>
          {spellLevels.map((level) => (
            <Fact
              key={level}
              label={level === 0 ? 'Cantrips' : `Level ${level}`}
              value={spells
                .filter((spell) => spell.level === level)
                .map((spell) => `${spell.name}${spell.prepared === 2 ? ' (always)' : ''}`)
                .join(', ')}
            />
          ))}
        </Wide>
      )}

      {features.length > 0 && (
        <section>
          <h4>Features and traits</h4>
          {featureKinds.map((kind) => (
            <Fact
              key={kind}
              label={FEATURE_KINDS[kind] ?? 'Other'}
              value={features
                .filter((feature) => (feature.kind ?? 'other') === kind)
                .map((feature) => feature.name)
                .join(', ')}
            />
          ))}
        </section>
      )}

      {(inventory.length > 0 || currency) && (
        <section>
          <h4>Equipment</h4>
          <Compact>
            {inventory.map((item, index) => (
              <li key={`${item.name}-${index}`}>
                <span>
                  {item.name}
                  {item.quantity && item.quantity > 1 ? ` ×${item.quantity}` : ''}
                </span>
                <Meta as="span">
                  {[item.equipped && 'equipped', item.attuned && 'attuned', item.rarity]
                    .filter(Boolean)
                    .join(', ')}
                </Meta>
              </li>
            ))}
          </Compact>
          <Fact label="Coins" value={currency} />
        </section>
      )}

      {Object.values(personality).some(Boolean) && (
        <Wide>
          <h4>Personality and backstory</h4>
          <Fact label="Traits" value={personality.traits} />
          <Fact label="Ideals" value={personality.ideals} />
          <Fact label="Bonds" value={personality.bonds} />
          <Fact label="Flaws" value={personality.flaws} />
          <Fact label="Appearance" value={personality.appearance} />
          {personality.backstory && <Backstory>{personality.backstory}</Backstory>}
        </Wide>
      )}

      <section>
        <h4>Details</h4>
        <Fact label="Species" value={sheet.species} />
        <Fact label="Background" value={sheet.background} />
        <Fact label="Alignment" value={sheet.alignment} />
        <Fact label="Size" value={sheet.size} />
        <Fact label="Experience" value={sheet.xp} />
        {Object.entries(details).map(([label, value]) => (
          <Fact key={label} label={label[0].toUpperCase() + label.slice(1)} value={value} />
        ))}
      </section>
    </Sheet>
  );
};

export default CharacterSheetView;
