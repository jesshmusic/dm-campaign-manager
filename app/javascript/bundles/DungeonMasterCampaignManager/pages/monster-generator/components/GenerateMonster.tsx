import React from 'react';
import { MonsterProps, SelectOption } from '../../../utilities/types';
import {
  alignmentOptions,
  monsterSizeOptions,
} from '../../../utilities/character-utilities';
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
  { label: 'Passive Perception', value: 'darkvision' },
];

export const speeds: SelectOption[] = [
  { label: 'Burrow', value: 'burrow' },
  { label: 'Climb', value: 'climb' },
  { label: 'Fly', value: 'fly' },
  { label: 'Hover', value: 'hover' },
  { label: 'Swim', value: 'swim' },
  { label: 'Walk', value: 'walk' },
];

export type GenerateMonsterProps = {
  setMonster: (monster: MonsterProps) => void;
};

const GenerateMonster = (props: GenerateMonsterProps) => {
  const {
    handleCalculateCR,
    handleChange,
    handleGenerateName,
    handleGenerateMonsterName,
    onSubmit,
    UseForm,
  } = useData(props);
  const [testState, setTestState] = React.useState();

  React.useEffect(() => {
    const subscription = UseForm.watch((value) => {
      // @ts-ignore
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  return (
    <>
      <pre
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: '#fff',
          width: '150px',
          zIndex: 200,
        }}
      >
        {JSON.stringify(testState, null, 2)}
      </pre>
      <Frame
        title="Random Monster Generator"
        subtitle="Select options to create a new Monster"
        className="random-monster-generator"
      >
        <form
          onSubmit={UseForm.handleSubmit(onSubmit)}
          className={styles.genForm}
          noValidate
        >
          <NameFormField
            handleGenerateName={handleGenerateName}
            handleGenerateMonsterName={handleGenerateMonsterName}
            register={UseForm.register}
            monsterType={UseForm.getValues('monsterType')}
            errors={UseForm.formState.errors}
          />
          <div className={styles.fourCol}>
            <MonsterTypeSelect
              control={UseForm.control}
              onChange={handleChange}
            />
            <FormField
              label="Subtype"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              onChange={UseForm.setValue}
              placeholder={'Subtype...'}
              name="monsterSubtype"
            />
            <FormSelect
              label="Alignment"
              name="alignmentOption"
              control={UseForm.control}
              options={alignmentOptions}
              handleSelectChange={handleChange}
            />
            <FormSelect
              label="Size"
              name="size"
              control={UseForm.control}
              options={monsterSizeOptions}
              handleSelectChange={handleChange}
            />
          </div>
          <div className={styles.fourCol}>
            <FormField
              label="Armor Class"
              onChange={handleChange}
              errors={UseForm.formState.errors}
              type="number"
              register={UseForm.register}
              required
              name="armorClass"
            />
            <FormField
              label="Hit Dice Count"
              onChange={handleChange}
              errors={UseForm.formState.errors}
              type="number"
              register={UseForm.register}
              required
              name="hitDiceNumber"
            />
            <FormField
              label="Attack Bonus"
              type="number"
              errors={UseForm.formState.errors}
              onChange={UseForm.setValue}
              register={UseForm.register}
              required
              name="attackBonus"
            />
            <FormField
              label="Save DC"
              type="number"
              errors={UseForm.formState.errors}
              onChange={UseForm.setValue}
              register={UseForm.register}
              required
              name="saveDC"
            />
          </div>
          <div className={styles.fiveCol}>
            <FormField
              label="Hit Dice Value"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              onChange={UseForm.setValue}
              name="hitDiceValue"
              readOnly
            />
            <FormField
              label="Hit Points"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              onChange={UseForm.setValue}
              name="hitPoints"
              readOnly
            />
            <ChallengeRatingField
              onCalculateCr={handleCalculateCR}
              register={UseForm.register}
            />
            <FormField
              label="XP"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              onChange={UseForm.setValue}
              name="xp"
              readOnly
            />
            <FormField
              label="Proficiency Bonus"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              onChange={UseForm.setValue}
              name="profBonus"
              readOnly
            />
          </div>
          <h4>Ability Scores</h4>
          <div className={styles.sixCol}>
            <AbilityScoreField
              label={'STR'}
              errors={UseForm.formState.errors}
              onChangeAbility={handleChange}
              register={UseForm.register}
              name={'strength'}
            />
            <AbilityScoreField
              label={'DEX'}
              errors={UseForm.formState.errors}
              onChangeAbility={handleChange}
              register={UseForm.register}
              name={'dexterity'}
            />
            <AbilityScoreField
              label={'CON'}
              errors={UseForm.formState.errors}
              onChangeAbility={handleChange}
              register={UseForm.register}
              name={'constitution'}
            />
            <AbilityScoreField
              label={'INT'}
              errors={UseForm.formState.errors}
              onChangeAbility={handleChange}
              register={UseForm.register}
              name={'intelligence'}
            />
            <AbilityScoreField
              label={'WIS'}
              errors={UseForm.formState.errors}
              onChangeAbility={handleChange}
              register={UseForm.register}
              name={'wisdom'}
            />
            <AbilityScoreField
              label={'CHA'}
              errors={UseForm.formState.errors}
              onChangeAbility={handleChange}
              register={UseForm.register}
              name={'charisma'}
            />
          </div>
          <div className={styles.actionsSection}>
            <ActionsForm
              fieldName="actions"
              title="Actions"
              singularTitle="Action"
              useForm={UseForm}
            />
          </div>
          <div>
            <div className="btn-group" aria-label="Character actions">
              <Button
                color={Colors.success}
                title="Generate Monster"
                type="submit"
                icon={<GiDiceTwentyFacesTwenty size={30} />}
              />
              {/*<button type='button' onClick={reset}>Reset</button>*/}
            </div>
          </div>
        </form>
      </Frame>
    </>
  );
};

export default GenerateMonster;
