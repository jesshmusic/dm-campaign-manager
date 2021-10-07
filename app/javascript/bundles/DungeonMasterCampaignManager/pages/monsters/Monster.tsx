import React from 'react';
import { MonsterProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import DndSpinner from '../../components/layout/DndSpinners/DndSpinner';
import { abilityScoreModifier } from '../monster-generator/services';

const styles = require('./monsters.module.scss');

type MonsterPageProps = {
  monster?: MonsterProps;
  monsterSlug: string;
  getMonster: (monsterSlug: string) => void;
};

const MonsterStat = (props: { name: string; value: string | number }) => {
  return (
    <div className={styles.frameStat}>
      <span>{props.name}</span> {props.value}
    </div>
  );
};

const AbilityScores = (props: { monster: MonsterProps }) => {
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
          {props.monster.constitution}{' '}
          {abilityModString(props.monster.constitution)}
        </div>
      </div>
      <div className={styles.abilityScoresCol}>
        <div className={styles.abilityScoresName}>INT</div>
        <div>
          {props.monster.intelligence}{' '}
          {abilityModString(props.monster.intelligence)}
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

const Monster = (props: MonsterPageProps) => {
  const { monster, monsterSlug, getMonster } = props;

  React.useEffect(() => {
    getMonster(monsterSlug);
  }, []);

  const monsterTitle = monster ? monster.name : 'Monster Loading...';

  return (
    <PageContainer
      breadcrumbs={[
        { url: '/app/monsters', isActive: false, title: 'Monsters' },
        { isActive: true, title: monsterTitle },
      ]}
      description={`Monster: ${monsterTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      pageTitle={monsterTitle}
    >
      {monster ? (
        <div className={styles.monsterPage}>
          <div className="monster-frame__group">
            <h1>{monster.name}</h1>
            <h2>
              {monster.size} {monster.monsterType}, {monster.alignment}
            </h2>
            <hr />
            <MonsterStat name="ArmorItems Class" value={monster.armorClass} />
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
            <MonsterStat
              name="Saving Throws"
              value={
                monster.savingThrows.length > 0
                  ? monster.savingThrows.join(', ')
                  : ' None'
              }
            />
            <MonsterStat
              name="Skills"
              value={
                monster.skills.length > 0 ? monster.skills.join(', ') : ' None'
              }
            />
            <MonsterStat
              name="Damage Resistances"
              value={
                monster.damageResistances.length > 0
                  ? monster.damageResistances.join(', ')
                  : ' None'
              }
            />
            <MonsterStat
              name="Damage Immunities"
              value={
                monster.damageImmunities.length > 0
                  ? monster.damageImmunities.join(', ')
                  : ' None'
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
              value={
                monster.senses.length > 0 ? monster.senses.join(', ') : ' None'
              }
            />
            <MonsterStat name="Languages" value={monster.languages} />
            <MonsterStat name="Challenge" value={monster.challengeString} />
            <hr />
          </div>
          {monster.specialAbilities &&
            monster.specialAbilities.length > 0 &&
            monster.specialAbilities.map((special) => (
              <div className="monster-frame__action">
                <em>{special.name}. </em> {special.desc}
              </div>
            ))}
          {monster.actions && monster.actions.length > 0 && (
            <>
              <h3>Actions</h3>
              {monster.actions.map((action) => (
                <div className="monster-frame__action">
                  <em>{action.name}. </em> {action.desc}
                </div>
              ))}
            </>
          )}
          {monster.legendaryActions && monster.legendaryActions.length > 0 && (
            <>
              <h3>Legendary Actions</h3>
              {monster.legendaryActions.map((action) => (
                <div className="monster-frame__action">
                  <em>{action.name}. </em> {action.desc}
                </div>
              ))}
            </>
          )}
          {monster.reactions && monster.reactions.length > 0 && (
            <>
              <h3>Reactions</h3>
              {monster.reactions.map((action) => (
                <div className="monster-frame__action">
                  <em>{action.name}. </em> {action.desc}
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    monster: state.monsters.currentMonster,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonster: (monsterSlug: string) => {
      dispatch(rest.actions.getMonster({ slug: monsterSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monster);
