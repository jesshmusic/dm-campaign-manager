import React from 'react';
import { MonsterProps, SelectOption } from '../../../utilities/types';
import {
  alignmentOptions,
  damageTypes,
  filterOptionsWithData,
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
import { useWatch } from 'react-hook-form';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';
import axios, { AxiosResponse } from 'axios';

const styles = require('./generator.module.scss');

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
    handleGenerateName,
    handleGenerateMonsterName,
    onSubmit,
    updateForm,
    UseForm,
  } = useData(props);
  const [testState, setTestState] = React.useState();

  const attackBonus = useWatch({
    control: UseForm.control,
    name: 'attackBonus',
  }) as unknown as number;

  const profBonus = useWatch({
    control: UseForm.control,
    name: 'profBonus',
  }) as unknown as number;

  const getConditions = (inputValue: string, callback: any) => {
    axios
      .get(`/v1/conditions.json?search=${inputValue}`)
      .then((response: AxiosResponse<any>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((error) => {});
  };

  React.useEffect(() => {
    const subscription = UseForm.watch((value, { name }) => {
      if (name) {
        updateForm(name, value);
      }
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

          <h4>Stats</h4>
          <div className={styles.fourCol}>
            <MonsterTypeSelect control={UseForm.control} />
            <FormField
              label="Subtype"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              placeholder={'Subtype...'}
              name="monsterSubtype"
            />
            <FormSelect
              label="Alignment"
              name="alignmentOption"
              control={UseForm.control}
              options={alignmentOptions}
            />
            <FormSelect
              label="Size"
              name="size"
              control={UseForm.control}
              options={monsterSizeOptions}
            />
          </div>
          <div className={styles.fourCol}>
            <FormField
              label="Armor Class"
              errors={UseForm.formState.errors}
              type="number"
              register={UseForm.register}
              required
              name="armorClass"
            />
            <FormField
              label="Hit Dice Count"
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
              register={UseForm.register}
              required
              name="attackBonus"
            />
            <FormField
              label="Save DC"
              type="number"
              errors={UseForm.formState.errors}
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
              name="hitDiceValue"
              readOnly
            />
            <FormField
              label="Hit Points"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
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
              name="xp"
              readOnly
            />
            <FormField
              label="Proficiency Bonus"
              type="text"
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name="profBonus"
              readOnly
            />
          </div>
          <h4>Ability Scores</h4>
          <div className={styles.sixCol}>
            <AbilityScoreField
              label={'STR'}
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name={'strength'}
              setValue={UseForm.setValue}
            />
            <AbilityScoreField
              label={'DEX'}
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name={'dexterity'}
              setValue={UseForm.setValue}
            />
            <AbilityScoreField
              label={'CON'}
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name={'constitution'}
              setValue={UseForm.setValue}
            />
            <AbilityScoreField
              label={'INT'}
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name={'intelligence'}
              setValue={UseForm.setValue}
            />
            <AbilityScoreField
              label={'WIS'}
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name={'wisdom'}
              setValue={UseForm.setValue}
            />
            <AbilityScoreField
              label={'CHA'}
              errors={UseForm.formState.errors}
              register={UseForm.register}
              name={'charisma'}
              setValue={UseForm.setValue}
            />
          </div>
          <h4>Resistances & Vulnerabilities</h4>
          <div className={styles.fourCol}>
            <FormSelectAsync
              label="Condition Immunities"
              name="conditionImmunitiesOptions"
              control={UseForm.control}
              getOptions={getConditions}
              isMulti
            />
            <FormSelect
              label="Damage Resistances"
              name="damageResistancesOptions"
              control={UseForm.control}
              isCreatable
              isMulti
              options={damageTypes}
            />
            <FormSelect
              label="Damage Immunities"
              name="damageImmunitiesOptions"
              control={UseForm.control}
              isCreatable
              isMulti
              options={damageTypes}
            />
            <FormSelect
              label="Damage Vulnerabilities"
              name="damageVulnerabilitiesOptions"
              control={UseForm.control}
              isCreatable
              isMulti
              options={damageTypes}
            />
          </div>
          <div className={styles.actionsSection}>
            <ActionsForm
              fieldName="actions"
              singularTitle="Action"
              title="Actions"
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
