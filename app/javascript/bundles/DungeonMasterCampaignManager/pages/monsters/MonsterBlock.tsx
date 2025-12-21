import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MonsterProps } from '../../utilities/types';
import { abilityScoreModifier } from '../monster-generator/services';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import { GiBeerStein } from 'react-icons/gi';

import {
  MonsterPage,
  FrameStat,
  AbilityScoresBlock,
  AbilityScoresCol,
  AbilityScoresName,
  MonsterFrameAction,
  CRStats,
  MonsterDescription,
} from './MonsterBlock.styles';

const MonsterStat = (props: { name: string; value: string | number }) => {
  return (
    <FrameStat>
      <span>{props.name}</span> {props.value}
    </FrameStat>
  );
};

export const AbilityScores = (props: { monster: MonsterProps }) => {
  const abilityModString = (ability: number): string => {
    const mod = abilityScoreModifier(ability);
    if (mod > 0) {
      return `(+ ${mod})`;
    } else if (mod < 0) {
      return `(- ${Math.abs(mod)})`;
    }
    return '';
  };

  return (
    <AbilityScoresBlock>
      <AbilityScoresCol>
        <AbilityScoresName>STR</AbilityScoresName>
        <div>
          {props.monster.strength} {abilityModString(props.monster.strength)}
        </div>
      </AbilityScoresCol>
      <AbilityScoresCol>
        <AbilityScoresName>DEX</AbilityScoresName>
        <div>
          {props.monster.dexterity} {abilityModString(props.monster.dexterity)}
        </div>
      </AbilityScoresCol>
      <AbilityScoresCol>
        <AbilityScoresName>CON</AbilityScoresName>
        <div>
          {props.monster.constitution} {abilityModString(props.monster.constitution)}
        </div>
      </AbilityScoresCol>
      <AbilityScoresCol>
        <AbilityScoresName>INT</AbilityScoresName>
        <div>
          {props.monster.intelligence} {abilityModString(props.monster.intelligence)}
        </div>
      </AbilityScoresCol>
      <AbilityScoresCol>
        <AbilityScoresName>WIS</AbilityScoresName>
        <div>
          {props.monster.wisdom} {abilityModString(props.monster.wisdom)}
        </div>
      </AbilityScoresCol>
      <AbilityScoresCol>
        <AbilityScoresName>CHA</AbilityScoresName>
        <div>
          {props.monster.charisma} {abilityModString(props.monster.charisma)}
        </div>
      </AbilityScoresCol>
    </AbilityScoresBlock>
  );
};

const MonsterBlock = (props: { monster: MonsterProps; showCRStats?: boolean }) => {
  const { monster, showCRStats } = props;
  const [fileDownloadUrl, setFileDownloadUrl] = React.useState('');
  const [foundryDownloadUrl, setFoundryDownloadUrl] = React.useState('');
  const fileLink = React.useRef<HTMLAnchorElement>(null);
  const foundryFileLink = React.useRef<HTMLAnchorElement>(null);

  const downloadXmlFile = () => {
    if (props.monster.fguXml) {
      const blob = new Blob([props.monster.fguXml]);
      const fileUrl = URL.createObjectURL(blob);
      setFileDownloadUrl(fileUrl);
    }
  };

  const downloadFoundryFile = () => {
    if (props.monster.foundryVttJson) {
      const blob = new Blob([props.monster.foundryVttJson], { type: 'application/json' });
      const fileUrl = URL.createObjectURL(blob);
      setFoundryDownloadUrl(fileUrl);
    }
  };

  React.useEffect(() => {
    if (fileDownloadUrl && fileDownloadUrl !== '' && fileLink.current) {
      fileLink.current.click();
      URL.revokeObjectURL(fileDownloadUrl);
      setFileDownloadUrl('');
    }
  }, [fileDownloadUrl]);

  React.useEffect(() => {
    if (foundryDownloadUrl && foundryDownloadUrl !== '' && foundryFileLink.current) {
      foundryFileLink.current.click();
      URL.revokeObjectURL(foundryDownloadUrl);
      setFoundryDownloadUrl('');
    }
  }, [foundryDownloadUrl]);

  return (
    <MonsterPage>
      <div className="monster-frame__group">
        <h1>
          {monster.name}
          {monster.user ? (
            <span>
              <GiBeerStein size={14} /> <small>{monster.user.username}</small>
            </span>
          ) : null}
        </h1>
        <h2>
          {monster.size} {monster.monsterType}, {monster.alignment}
        </h2>
        {monster.description && <MonsterDescription>{monster.description}</MonsterDescription>}
        <hr />
        <MonsterStat name="Armor Class" value={monster.armorClass} />
        <MonsterStat name="Hit Points" value={monster.hitPointsString} />
        <MonsterStat name="Speed" value={monster.speeds.join(', ')} />
        <hr />
        <AbilityScores monster={monster} />
        <hr />
        <MonsterStat
          name="Condition Immunities"
          value={
            monster.conditionImmunities.length > 0
              ? monster.conditionImmunities.join(', ')
              : ' None'
          }
        />
        {monster.savingThrows && (
          <MonsterStat
            name="Saving Throws"
            value={monster.savingThrows.length > 0 ? monster.savingThrows.join(', ') : ' None'}
          />
        )}
        {monster.skills && (
          <MonsterStat
            name="Skills"
            value={monster.skills.length > 0 ? monster.skills.join(', ') : ' None'}
          />
        )}
        <MonsterStat
          name="Damage Resistances"
          value={
            monster.damageResistances.length > 0 ? monster.damageResistances.join(', ') : ' None'
          }
        />
        <MonsterStat
          name="Damage Immunities"
          value={
            monster.damageImmunities.length > 0 ? monster.damageImmunities.join(', ') : ' None'
          }
        />
        <MonsterStat
          name="Damage Vulnerabilities"
          value={
            monster.damageVulnerabilities.length > 0
              ? monster.damageVulnerabilities.join(', ')
              : ' None'
          }
        />
        <MonsterStat
          name="Senses"
          value={monster.senses.length > 0 ? monster.senses.join(', ') : ' None'}
        />
        <MonsterStat name="Languages" value={monster.languages} />
        <MonsterStat name="Challenge" value={monster.challengeString ?? ''} />
        <hr />
      </div>
      {monster.specialAbilities &&
        monster.specialAbilities.length > 0 &&
        monster.specialAbilities.map((action, index) => (
          <MonsterFrameAction key={index}>
            <ReactMarkdown>{`_**${action.name}**_. ${action.desc}`}</ReactMarkdown>
          </MonsterFrameAction>
        ))}
      {monster.actions && monster.actions.length > 0 && (
        <>
          <h3>Actions</h3>
          {monster.actions.map((action, index) => (
            <MonsterFrameAction key={index}>
              <ReactMarkdown>{`_**${action.name}**_. ${action.desc}`}</ReactMarkdown>
            </MonsterFrameAction>
          ))}
        </>
      )}
      {monster.legendaryActions && monster.legendaryActions.length > 0 && (
        <>
          <h3>Legendary Actions</h3>
          {monster.legendaryActions.map((action, index) => (
            <MonsterFrameAction key={index}>
              <ReactMarkdown>{`_**${action.name}**_. ${action.desc}`}</ReactMarkdown>
            </MonsterFrameAction>
          ))}
        </>
      )}
      {monster.reactions && monster.reactions.length > 0 && (
        <>
          <h3>Reactions</h3>
          {monster.reactions.map((action, index) => (
            <MonsterFrameAction key={index}>
              <ReactMarkdown>{`_**${action.name}**_. ${action.desc}`}</ReactMarkdown>
            </MonsterFrameAction>
          ))}
        </>
      )}
      {(monster.fguXml ?? monster.foundryVttJson) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
          {monster.fguXml && (
            <>
              <a
                style={{ display: 'none' }}
                download={`${monster.name.replace(' ', '-')}.xml`}
                href={fileDownloadUrl}
                ref={fileLink}
              >
                download it
              </a>
              <Button
                color={Colors.primary}
                title={'Fantasy Grounds XML'}
                onClick={downloadXmlFile}
              />
            </>
          )}
          {monster.foundryVttJson && (
            <>
              <a
                style={{ display: 'none' }}
                download={`${monster.name.replace(' ', '-')}-foundry-v13.json`}
                href={foundryDownloadUrl}
                ref={foundryFileLink}
              >
                download foundry
              </a>
              <Button
                color={Colors.info}
                title={'Foundry VTT v13 JSON'}
                onClick={downloadFoundryFile}
              />
            </>
          )}
        </div>
      )}
      {showCRStats && (
        <CRStats>
          <h3>Challenge Rating Info</h3>
          <MonsterStat name="Damage Per Round:" value={monster.damagePerRound ?? 0} />
          <MonsterStat name="Offensive CR:" value={monster.offensiveCr ?? ''} />
          <MonsterStat name="Defensive CR:" value={monster.defensiveCr ?? ''} />
          <MonsterStat name="Proficiency Bonus:" value={monster.profBonus} />
          <MonsterStat name="Save DC:" value={monster.saveDc} />
        </CRStats>
      )}
    </MonsterPage>
  );
};

export default MonsterBlock;
