import React from 'react';
import { MonsterProps, SelectOption } from '../../../utilities/types';
import { alignmentOptions, monsterSizeOptions } from '../../../utilities/character-utilities';
import Frame from '../../../components/Frame/Frame';
import NameFormField from './NameFormField';
import FormField from '../../../components/forms/FormField';
import ChallengeRatingField from './ChallengeRatingField';
import FormSelect from '../../../components/forms/FormSelect';
import MonsterTypeSelect from './MonsterTypeSelect';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import AbilityScoreField from './AbilityScoreField';
import { Colors } from '../../../utilities/enums';
import Button from '../../../components/Button/Button';
import { useData } from './use-data';
import ActionsForm from './action-forms/ActionsForm';

const styles = require('./generator.module.scss');

type MonsterFormErrors = {
  name?: string;
  characterAlignment?: string;
  charisma?: string;
  constitution?: string;
  dexterity?: string;
  intelligence?: string;
  strength?: string;
  wisdom?: string;
};

export const senses: SelectOption[] = [
  { label: 'Blindsight', value: 'blindsight' },
  { label: 'Darkvision', value: 'darkvision' },
  { label: 'Tremorsense', value: 'tremorsense' },
  { label: 'Truesight', value: 'truesight' },
  { label: 'Passive Perception', value: 'darkvision' }
];

export const speeds: SelectOption[] = [
  { label: 'Burrow', value: 'burrow' },
  { label: 'Climb', value: 'climb' },
  { label: 'Fly', value: 'fly' },
  { label: 'Hover', value: 'hover' },
  { label: 'Swim', value: 'swim' },
  { label: 'Walk', value: 'walk' }
];

export type GenerateMonsterProps = {
  setMonster: (monster: MonsterProps) => void;
};

const GenerateMonster = (props: GenerateMonsterProps) => {
  const {
    handleCalculateCR,
    handleChange,
    handleGenerateName,
    onSubmit,
    UseForm
  } = useData(props);

  return (
    <Frame
      title='Random Monster Generator'
      subtitle='Select options to create a new Monster'
      className='random-monster-generator'
    >
      <form
        onSubmit={UseForm.handleSubmit(onSubmit)}
        className={styles.genForm}
        noValidate
      >
        <NameFormField
          handleGenerateName={handleGenerateName}
          register={UseForm.register}
        />
        <div className={styles.fourCol}>
          <MonsterTypeSelect control={UseForm.control} />
          <FormField
            label='Subtype'
            type='text'
            register={UseForm.register}
            onChange={UseForm.setValue}
            placeholder={'Subtype...'}
            name='monsterSubtype'
          />
          <FormSelect
            label='Alignment'
            name='alignmentOption'
            control={UseForm.control}
            options={alignmentOptions}
            handleSelectChange={UseForm.setValue}
          />
          <FormSelect
            label='Size'
            name='size'
            control={UseForm.control}
            options={monsterSizeOptions}
            handleSelectChange={handleChange}
          />
        </div>
        <div className={styles.fourCol}>
          <FormField
            label='Armor Class'
            onChange={handleChange}
            type='number'
            register={UseForm.register}
            name='armorClass'
          />
          <FormField
            label='Hit Dice Count'
            onChange={handleChange}
            type='number'
            register={UseForm.register}
            name='hitDiceNumber'
          />
          <FormField
            label='Attack Bonus'
            type='number'
            onChange={UseForm.setValue}
            register={UseForm.register}
            name='attackBonus'
          />
          <FormField
            label='Save DC'
            type='number'
            onChange={UseForm.setValue}
            register={UseForm.register}
            name='saveDC'
          />
        </div>
        <div className={styles.fiveCol}>
          <FormField
            label='Hit Dice Value'
            type='text'
            register={UseForm.register}
            onChange={UseForm.setValue}
            name='hitDiceValue'
            readOnly
          />
          <FormField
            label='Hit Points'
            type='text'
            register={UseForm.register}
            onChange={UseForm.setValue}
            name='hitPoints'
            readOnly
          />
          <ChallengeRatingField
            onCalculateCr={handleCalculateCR}
            register={UseForm.register}
          />
          <FormField
            label='XP'
            type='text'
            register={UseForm.register}
            onChange={UseForm.setValue}
            name='xp'
            readOnly
          />
          <FormField
            label='Proficiency Bonus'
            type='text'
            register={UseForm.register}
            onChange={UseForm.setValue}
            name='profBonus'
            readOnly
          />
        </div>
        <h4>Ability Scores</h4>
        <div className={styles.sixCol}>
          <AbilityScoreField
            label={'STR'}
            onChangeAbility={handleChange}
            register={UseForm.register}
            name={'strength'}
          />
          <AbilityScoreField
            label={'DEX'}
            onChangeAbility={handleChange}
            register={UseForm.register}
            name={'dexterity'}
          />
          <AbilityScoreField
            label={'CON'}
            onChangeAbility={handleChange}
            register={UseForm.register}
            name={'constitution'}
          />
          <AbilityScoreField
            label={'INT'}
            onChangeAbility={UseForm.setValue}
            register={UseForm.register}
            name={'intelligence'}
          />
          <AbilityScoreField
            label={'WIS'}
            onChangeAbility={UseForm.setValue}
            register={UseForm.register}
            name={'wisdom'}
          />
          <AbilityScoreField
            label={'CHA'}
            onChangeAbility={UseForm.setValue}
            register={UseForm.register}
            name={'charisma'}
          />
        </div>
        <div className={styles.actionsSection}>
          <ActionsForm
            fieldName='actions'
            title='Actions'
            singularTitle='Action'
            useForm={UseForm}
          />
        </div>
        <div>
          <div className='btn-group' aria-label='Character actions'>
            <Button
              color={Colors.success}
              title='Generate Monster'
              type='submit'
              icon={<GiDiceTwentyFacesTwenty size={30} />}
            />
            {/*<button type='button' onClick={reset}>Reset</button>*/}
          </div>
        </div>
      </form>
    </Frame>
  );
};

export default GenerateMonster;
