import React from 'react';
import CopyField from '../../components/CopyField';
import Frame from '../../components/Frame/Frame';

const MonsterDisplay = ({ monster, shortDisplay = false }) => (
  <Frame
    title={`New Monster: "${monster.name}"`}
    subtitle="Click individual fields to copy to the clipboard"
  >
    <form>
      <CopyField
        placeHolder={'Name'}
        fieldId={'monsterName'}
        label={'Name'}
        text={monster.name}
      />
      <CopyField
        placeHolder={'Size'}
        fieldId={'monsterSize'}
        label={'Size'}
        colWidth={'4'}
        text={monster.size_and_type}
      />
      <CopyField
        placeHolder={'Alignment'}
        fieldId={'monsterAlignment'}
        label={'Alignment'}
        colWidth={'4'}
        text={monster.alignment}
      />
      <CopyField
        placeHolder={'CR'}
        fieldId={'monsterChallengeRating'}
        label={'CR'}
        colWidth={'2'}
        text={monster.challenge_rating}
      />
      <CopyField
        placeHolder={'XP'}
        fieldId={'monsterXP'}
        label={'XP'}
        colWidth={'2'}
        text={monster.xp}
      />
      <CopyField
        placeHolder={'Armor Class'}
        fieldId={'monsterArmorClass'}
        label={'Armor Class'}
        colWidth={'2'}
        text={monster.armor_class}
      />
      <CopyField
        placeHolder={'Hit Points'}
        fieldId={'monsterHitPoints'}
        label={'Hit Points'}
        colWidth={'2'}
        text={monster.hit_points}
      />
      <CopyField
        placeHolder={'Hit Dice'}
        fieldId={'monsterHitHitDice'}
        label={'Hit Dice'}
        colWidth={'3'}
        text={monster.hit_dice}
      />
      <CopyField
        placeHolder={'Speed'}
        fieldId={'monsterSpeed'}
        label={'Speed'}
        colWidth={'5'}
        text={monster.speed}
      />
      <CopyField
        placeHolder={'Strength'}
        fieldId={'monsterStrength'}
        label={'Strength'}
        colWidth={'2'}
        text={monster.strength}
      />
      <CopyField
        placeHolder={'Dexterity'}
        fieldId={'monsterDexterity'}
        label={'Dexterity'}
        colWidth={'2'}
        text={npc.dexterity}
      />
      <CopyField
        placeHolder={'Constitution'}
        fieldId={'npcConstitution'}
        label={'Constitution'}
        colWidth={'2'}
        text={npc.constitution}
      />
      <CopyField
        placeHolder={'Intelligence'}
        fieldId={'npcIntelligence'}
        label={'Intelligence'}
        colWidth={'2'}
        text={npc.intelligence}
      />
      <CopyField
        placeHolder={'Wisdom'}
        fieldId={'npcWisdom'}
        label={'Wisdom'}
        colWidth={'2'}
        text={npc.wisdom}
      />
      <CopyField
        placeHolder={'Charisma'}
        fieldId={'npcCharisma'}
        label={'Charisma'}
        colWidth={'2'}
        text={npc.charisma}
      />
      {!shortDisplay ? (
        <div>
          <CopyField
            placeHolder={'None'}
            fieldId={'npcSavingThrows'}
            label={'Saving Throws'}
            text={npc.saving_throws}
          />
          <CopyField
            placeHolder={'None'}
            fieldId={'npcSkills'}
            label={'Skills'}
            text={npc.skills_string}
          />
          <CopyField
            placeHolder={'Senses'}
            fieldId={'npcSenses'}
            label={'Senses'}
            colWidth={'6'}
            text={npc.senses}
          />
          <CopyField
            placeHolder={'Languages'}
            fieldId={'npcLanguages'}
            label={'Languages'}
            colWidth={'6'}
            text={npc.languages}
          />
          <CopyField
            placeHolder={'None'}
            fieldId={'npcImmunities'}
            label={'Immunities'}
            colWidth={'12'}
            text={npc.damage_immunities}
          />
          <CopyField
            placeHolder={'None'}
            fieldId={'npcResistances'}
            label={'Resistances'}
            colWidth={'12'}
            text={npc.damage_resistances}
          />
          <CopyField
            placeHolder={'None'}
            fieldId={'npcVulnerabilites'}
            label={'Vulnerabilites'}
            colWidth={'12'}
            text={npc.damage_vulnerabilities}
          />
        </div>
      ) : null}
      <h4>Actions</h4>
      {npc.actions.map((action, index) => (
        <CopyField
          placeHolder={action.name}
          key={`npcAction${index}`}
          fieldId={`npcAction${index}`}
          label={action.name}
          colWidth={'12'}
          isTextArea
          text={action.description}
        />
      ))}
      {npc.legendary_actions.length > 0 ? (
        <div>
          <h4>Legendary Actions</h4>
          {npc.legendary_actions.map((action, index) => (
            <CopyField
              placeHolder={action.name}
              key={action.id}
              fieldId={`npcLegendaryAction${index}`}
              label={action.name}
              colWidth={'12'}
              isTextArea
              text={action.description}
            />
          ))}
        </div>
      ) : null}
      {npc.special_abilities.length > 0 ? (
        <div>
          <h4>Traits</h4>
          {npc.special_abilities.map((ability, index) => (
            <CopyField
              placeHolder={ability.name}
              key={`npcTrait${index}`}
              fieldId={`npcSpecialAbility${ability.id}`}
              label={ability.name}
              colWidth={'12'}
              isTextArea
              text={ability.description}
            />
          ))}
        </div>
      ) : null}
    </form>
  </Frame>
);
//
// MonsterDisplay.propTypes = {
//   npc: PropTypes.object.isRequired,
//   shortDisplay: PropTypes.bool,
// };

export default MonsterDisplay;
