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

type GenerateMonsterProps = {
  setMonster: (monster: MonsterProps) => void;
};

const GenerateMonster = (props: GenerateMonsterProps) => {
  const {
    control,
    handleCalculateCR,
    handleChange,
    handleGenerateName,
    handleSubmit,
    onSubmit,
    register
  } = useData();

  return (
    <Frame
      title='Random Monster Generator'
      subtitle='Select options to create a new Monster'
      className='random-monster-generator'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.genForm}
        noValidate
      >
        <NameFormField
          handleGenerateName={handleGenerateName}
          register={register}
        />
        <div className={styles.fourCol}>
          <MonsterTypeSelect control={control} />
          <FormField
            label='Subtype'
            type='text'
            register={register}
            name='monsterSubtype'
          />
          <FormSelect
            label='Alignment'
            name='alignmentOption'
            control={control}
            options={alignmentOptions}
            handleSelectChange={handleChange}
          />
          <FormSelect
            label='Size'
            name='size'
            control={control}
            options={monsterSizeOptions}
            handleSelectChange={handleChange}
          />
        </div>
        <div className={styles.fourCol}>
          <FormField
            label='Armor Class'
            onChange={handleChange}
            type='number'
            register={register}
            name='armorClass'
          />
          <FormField
            label='Hit Dice Count'
            onChange={handleChange}
            type='number'
            register={register}
            name='hitDiceNumber'
          />
          <FormField
            label='Hit Dice Value'
            type='text'
            register={register}
            name='hitDiceValue'
            readOnly
          />
          <FormField
            label='Hit Points'
            type='text'
            register={register}
            name='hitPoints'
            readOnly
          />
          <ChallengeRatingField
            onCalculateCr={handleCalculateCR}
            register={register}
          />
          <FormField
            label='XP'
            type='number'
            register={register}
            name='xp'
            readOnly
          />
          <FormField
            label='Proficiency Bonus'
            type='number'
            register={register}
            name='profBonus'
            readOnly
          />
        </div>
        <h4>Ability Scores</h4>
        <div className={styles.sixCol}>
          <AbilityScoreField
            label={'STR'}
            onChangeAbility={handleChange}
            register={register}
            name={'strength'}
          />
          <AbilityScoreField
            label={'DEX'}
            onChangeAbility={handleChange}
            register={register}
            name={'dexterity'}
          />
          <AbilityScoreField
            label={'CON'}
            onChangeAbility={handleChange}
            register={register}
            name={'constitution'}
          />
          <AbilityScoreField
            label={'INT'}
            onChangeAbility={handleChange}
            register={register}
            name={'intelligence'}
          />
          <AbilityScoreField
            label={'WIS'}
            onChangeAbility={handleChange}
            register={register}
            name={'wisdom'}
          />
          <AbilityScoreField
            label={'CHA'}
            onChangeAbility={handleChange}
            register={register}
            name={'charisma'}
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
  //               <ActionForm name='actions'
  //                           title='Actions'
  //                           singularTitle='Action'
  //                           values={values}
  //                           push={push} />
  //               <ActionForm name='legendaryActions'
  //                           title='Legendary Actions'
  //                           singularTitle='Legendary Action'
  //                           values={values}
  //                           push={push} />
  //               <ActionForm name='reactions'
  //                           title='Reactions'
  //                           singularTitle='Reaction'
  //                           values={values}
  //                           push={push} />
  //               <ActionForm name='specialAbilities'
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
