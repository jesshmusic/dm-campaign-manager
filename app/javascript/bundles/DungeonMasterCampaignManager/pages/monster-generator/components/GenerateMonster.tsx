import React from 'react';
import { DevTool } from '@hookform/devtools';
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
    onSubmit,
    UseForm,
  } = useData(props);

  return (
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
          register={UseForm.register}
        />
        <div className={styles.fourCol}>
          <MonsterTypeSelect control={UseForm.control} />
          <FormField
            label="Subtype"
            type="text"
            register={UseForm.register}
            onChange={UseForm.setValue}
            name="monsterSubtype"
          />
          <FormSelect
            label="Alignment"
            name="alignmentOption"
            control={UseForm.control}
            options={alignmentOptions}
            handleSelectChange={UseForm.setValue}
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
            type="number"
            register={UseForm.register}
            name="armorClass"
          />
          <FormField
            label="Hit Dice Count"
            onChange={handleChange}
            type="number"
            register={UseForm.register}
            name="hitDiceNumber"
          />
          <FormField
            label="Attack Bonus"
            type="number"
            onChange={UseForm.setValue}
            register={UseForm.register}
            name="attackBonus"
          />
          <FormField
            label="Save DC"
            type="number"
            onChange={UseForm.setValue}
            register={UseForm.register}
            name="saveDC"
          />
        </div>
        <div className={styles.fiveCol}>
          <FormField
            label="Hit Dice Value"
            type="text"
            register={UseForm.register}
            onChange={UseForm.setValue}
            name="hitDiceValue"
            readOnly
          />
          <FormField
            label="Hit Points"
            type="text"
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
            register={UseForm.register}
            onChange={UseForm.setValue}
            name="xp"
            readOnly
          />
          <FormField
            label="Proficiency Bonus"
            type="text"
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
        <div className={styles.actionsSection}></div>
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
        <ActionsForm
          fieldName="actions"
          title="Actions"
          singularTitle="Action"
          useForm={UseForm}
        />
      </form>
      <DevTool control={UseForm.control} />
    </Frame>
  );

  // const { setMonster } = props;
  // const [monster] = React.useState({

  // });
  // const [validated, setValidated] = React.useState(false);
  //
  // const npcFormDecorator = React.useMemo(() => {
  //   return npcCalculationsDecorator;
  // }, []);
  //
  // const handleSubmit = (values: MonsterGeneratorFormFields) => {
  //   const monster: MonsterProps = getMonsterObject(values);
  //   setMonster(monster);
  // };

  // const validate = (values) => {
  //   const errors: MonsterFormErrors = {};
  //   if (!values.name) {
  //     errors.name = 'Character name is required.';
  //   }
  //   if (!values.alignment) {
  //     errors.alignmentOption = 'Character alignment is required.';
  //   }
  //   if (!values.charisma) {
  //     errors.charisma = 'Charisma is required';
  //   }
  //   if (!values.constitution) {
  //     errors.constitution = 'Constitution is required';
  //   }
  //   if (!values.dexterity) {
  //     errors.dexterity = 'Dexterity is required';
  //   }
  //   if (!values.intelligence) {
  //     errors.intelligence = 'Intelligence is required';
  //   }
  //   if (!values.strength) {
  //     errors.strength = 'Strength is required';
  //   }
  //   if (!values.wisdom) {
  //     errors.wisdom = 'Wisdom is required';
  //   }
  //   return errors;
  // };

  // return (
  //   <Frame title='Random Monster Generator' subtitle='Select options to create a new Monster' className='random-monster-generator'>
  //     <Form onSubmit={handleSubmit}
  //           decorators={[npcFormDecorator]}
  //           initialValues={monster}
  //           validate={validate}
  //           mutators={{ ...arrayMutators }}
  //           render={({
  //                      handleSubmit,
  //                      form: {
  //                        mutators: { push }
  //                      },
  //                      submitting,
  //                      form,
  //                      pristine,
  //                      values
  //                    }) => (
  //             <form onSubmit={handleSubmit}
  //                   className={classNames(validated && 'was-validated')}
  //                   noValidate>
  //               <div className='mb-3'>
  //                 <NameFormField values={values}
  //                                handleGenerateName={handleGenerateName} />
  //               </div>
  //               <div className='grid' style={{ '--bs-columns': 2 } as React.CSSProperties}>
  //                 <MonsterTypeSelect colWidth={'8'} />
  //                 <FormField label={'Subtype'}
  //                            type={'text'}
  //                            name={'monsterSubtype'} />
  //               </div>
  //               <div className='grid' style={{ '--bs-columns': 4 } as React.CSSProperties}>
  //                 <ChallengeRatingField onCalculateCr={handleCalculateCR} values={values} />
  //                 <ReadOnlyField label={'XP'}
  //                                name={'xp'}
  //                                value={calcValues.xp} />
  //                 <FormSelect label={'Alignment'}
  //                             name={'alignmentOption'}
  //                             value={values.alignment}
  //                             options={alignmentOptions} />
  //                 <FormSelect label={'Size'}
  //                             name={'size'}
  //                             value={values.size}
  //                             options={npcSizeOptions} />
  //                 <ReadOnlyField label={'Proficiency Bonus'}
  //                                name={'profBonus'}
  //                                value={calcValues.profBonus} />
  //                 <FormField label={'Armor Class'}
  //                            type={'number'}
  //                            name={'armorClass'} />
  //                 <FormField label={'Hit Dice Count'}
  //                            type={'number'}
  //                            name={'hitDiceNumber'} />
  //                 <FormField label={'Hit Dice Value'}
  //                            type={'text'}
  //                            name={'hitDiceValue'}
  //                            readOnly />
  //                 <FormField label={'Hit Points'}
  //                            type={'text'}
  //                            name={'hitPoints'}
  //                            readOnly />
  //               </div>

  //               <Senses push={push} />
  //               <Speeds push={push} />
  //               <ActionsForm name='actions'
  //                           title='Actions'
  //                           singularTitle='Action'
  //                           values={values}
  //                           push={push} />
  //               <ActionsForm name='legendaryActions'
  //                           title='Legendary Actions'
  //                           singularTitle='Legendary Action'
  //                           values={values}
  //                           push={push} />
  //               <ActionsForm name='reactions'
  //                           title='Reactions'
  //                           singularTitle='Reaction'
  //                           values={values}
  //                           push={push} />
  //               <ActionsForm name='specialAbilities'
  //                           singularTitle='Special Ability'
  //                           values={values}
  //                           title='Special Abilities'
  //                           push={push} />

  //             </form>
  //           )}
  //     />
  //   </Frame>
  // );
};

export default GenerateMonster;
