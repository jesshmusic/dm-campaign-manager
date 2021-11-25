import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MonsterProps } from '../../utilities/types';
import { abilityScoreModifier } from '../monster-generator/services';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import { GiBeerStein } from 'react-icons/all';

const styles = require('./monsters.module.scss');

const MonsterStat = (props: { name: string; value: string | number }) => {
  return (
    <div className={styles.frameStat}>
      <span>{props.name}</span> {props.value}
    </div>
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
    <div className={styles.abilityScoresBlock}>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>STR</div>
        <div>
          {props.monster.strength} {abilityModString(props.monster.strength)}
        </div>
      </div>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>DEX</div>
        <div>
          {props.monster.dexterity} {abilityModString(props.monster.dexterity)}
        </div>
      </div>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>CON</div>
        <div>
          {props.monster.constitution} {abilityModString(props.monster.constitution)}
        </div>
      </div>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>INT</div>
        <div>
          {props.monster.intelligence} {abilityModString(props.monster.intelligence)}
        </div>
      </div>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>WIS</div>
        <div>
          {props.monster.wisdom} {abilityModString(props.monster.wisdom)}
        </div>
      </div>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>CHA</div>
        <div>
          {props.monster.charisma} {abilityModString(props.monster.charisma)}
        </div>
      </div>
    </div>
  );
};

const MonsterBlock = (props: { monster: MonsterProps }) => {
  const { monster } = props;
  const [fileDownloadUrl, setFileDownloadUrl] = React.useState('');
  const fileLink = React.useRef<HTMLAnchorElement>(null);

  const downloadXmlFile = () => {
    if (props.monster.fguXml) {
      const blob = new Blob([props.monster.fguXml]);
      const fileUrl = URL.createObjectURL(blob);
      setFileDownloadUrl(fileUrl);
    }
  };

  React.useEffect(() => {
    if (fileDownloadUrl && fileDownloadUrl !== '' && fileLink.current) {
      fileLink.current.click();
      URL.revokeObjectURL(fileDownloadUrl);
      setFileDownloadUrl('');
    }
  }, [fileDownloadUrl]);

  return (
    <div className={styles.monsterPage}>
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
        <MonsterStat name="Challenge" value={monster.challengeString || ''} />
        <hr />
      </div>
      {monster.specialAbilities &&
        monster.specialAbilities.length > 0 &&
        monster.specialAbilities.map((action, index) => (
          <div className={styles.monsterFrameAction} key={index}>
            <ReactMarkdown children={`_**${action.name}**_. ${action.desc}`} />
          </div>
        ))}
      {monster.actions && monster.actions.length > 0 && (
        <>
          <h3>Actions</h3>
          {monster.actions.map((action, index) => (
            <div className={styles.monsterFrameAction} key={index}>
              <ReactMarkdown children={`_**${action.name}**_. ${action.desc}`} />
            </div>
          ))}
        </>
      )}
      {monster.legendaryActions && monster.legendaryActions.length > 0 && (
        <>
          <h3>Legendary Actions</h3>
          {monster.legendaryActions.map((action, index) => (
            <div className={styles.monsterFrameAction} key={index}>
              <ReactMarkdown children={`_**${action.name}**_. ${action.desc}`} />
            </div>
          ))}
        </>
      )}
      {monster.reactions && monster.reactions.length > 0 && (
        <>
          <h3>Reactions</h3>
          {monster.reactions.map((action, index) => (
            <div className={styles.monsterFrameAction} key={index}>
              <ReactMarkdown children={`_**${action.name}**_. ${action.desc}`} />
            </div>
          ))}
        </>
      )}
      {monster.fguXml ? (
        <div>
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
            title={'Download Fantasy Grounds XML file'}
            onClick={downloadXmlFile}
          />
        </div>
      ) : null}
    </div>
  );
};

export default MonsterBlock;
