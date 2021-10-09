import React from 'react';
import {
  MonsterGeneratorFormFields,
  MonsterProps,
  RandomNameResult,
  SelectOption,
} from '../../../utilities/types';
import {
  alignmentOptions,
  monsterSizeOptions,
} from '../../../utilities/character-utilities';
import axios from 'axios';
import {
  abilityScoreModifier,
  calculateCR,
  getMonsterObject,
  hitPoints,
} from '../services';
import Frame from '../../../components/Frame/Frame';
import { useForm } from 'react-hook-form';
import NameFormField from './NameFormField';
import FormField from '../../../components/forms/FormField';
import ChallengeRatingField from './ChallengeRatingField';
import FormSelect from '../../../components/forms/FormSelect';
import MonsterTypeSelect from './MonsterTypeSelect';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import AbilityScoreField from './AbilityScoreField';

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

type GenerateMonsterProps = {
  setMonster: (monster: MonsterProps) => void;
};

const GenerateMonster = (props: GenerateMonsterProps) => {
  const [monsterForm, setMonsterForm] =
    React.useState<MonsterGeneratorFormFields>({
      name: 'New Monster',
      alignment: 'Neutral',
      alignmentOption: {
        value: 'Neutral',
        label: 'Neutral',
      },
      armorClass: 10,
      attackBonus: 2,
      damageBonus: 0,
      challengeRating: '0',
      hitDice: '1d6',
      hitDiceNumber: 1,
      hitDiceValue: 'd6',
      hitPoints: 4,
      languages: [],
      monsterType: {
        value: 'humanoid',
        label: 'Humanoid',
      },
      profBonus: 2,
      saveDC: 12,
      size: {
        label: 'Medium',
        value: 'medium',
      },
      xp: 10,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      conditions: [],
      damageImmunities: [],
      damageResistances: [],
      damageVulnerabilities: [],
      actions: [],
      legendaryActions: [],
      reactions: [],
      specialAbilities: [],
      senses: [],
      speeds: [],
      monsterProficiencies: [],
    });

  const { control, getValues, handleSubmit, register, setValue, watch } =
    useForm<MonsterGeneratorFormFields>({
      defaultValues: monsterForm,
    });

  const watchMonsterName = watch('name', monsterForm.name);
  const onSubmit = (data) => {
    // props.setMonster(getMonsterObject(data));
  };

  const handleGenerateName = async (gender, race) => {
    const apiURL = `/v1/random_fantasy_name?random_monster_gender=${gender}&random_monster_race=${
      race ? race : 'human'
    }`;
    try {
      const response = await axios.get<RandomNameResult>(apiURL);
      setValue('name', response.data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalculateCR = async () => {
    try {
      const response = await calculateCR(getValues());
      setValue('profBonus', response.data.prof_bonus);
      setValue('xp', response.data.xp);
      setValue('saveDC', response.data.save_dc);
      setValue('challengeRating', response.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (name: string, value: number) => {
    switch (name) {
      case 'strength':
        const profBonus = getValues('profBonus');
        const strMod = abilityScoreModifier(value);
        setValue('attackBonus', profBonus + strMod, { shouldDirty: true });
        setValue('damageBonus', strMod, { shouldDirty: true });
        break;
      case 'dexterity':
        break;
      case 'constitution':
        setValue(
          'hitPoints',
          hitPoints(
            value,
            getValues('hitDiceNumber'),
            getValues('hitDiceValue')
          ),
          { shouldDirty: true }
        );
        break;
      case 'intelligence':
        break;
      case 'wisdom':
        break;
      case 'charisma':
        break;
      case 'hitDiceNumber':
        setValue(
          'hitPoints',
          hitPoints(
            getValues('constitution'),
            value,
            getValues('hitDiceValue')
          ),
          { shouldDirty: true }
        );
        break;
    }
  };

  return (
    <Frame
      title="Random Monster Generator"
      subtitle="Select options to create a new Monster"
      className="random-monster-generator"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        // className={classNames(validated && 'was-validated')}
        noValidate
      >
        <div className="mb-3">
          <NameFormField
            handleGenerateName={handleGenerateName}
            register={register}
          />
        </div>
        <div
          className="grid"
          style={{ '--bs-columns': 4 } as React.CSSProperties}
        >
          <MonsterTypeSelect control={control} onChange={handleChange} />
          <FormField
            label={'Subtype'}
            type={'text'}
            register={register}
            name={'monsterSubtype'}
          />
          <FormSelect
            label={'Alignment'}
            name={'alignmentOption'}
            control={control}
            options={alignmentOptions}
          />
          <FormSelect
            label={'Size'}
            name={'size'}
            control={control}
            onChange={handleChange}
            options={monsterSizeOptions}
          />
        </div>
        <div
          className="grid"
          style={{ '--bs-columns': 4 } as React.CSSProperties}
        >
          <FormField
            label={'Armor Class'}
            onChange={handleChange}
            type={'number'}
            register={register}
            name={'armorClass'}
          />
          <FormField
            label={'Hit Dice Count'}
            onChange={handleChange}
            type={'number'}
            register={register}
            name={'hitDiceNumber'}
          />
          <FormField
            label={'Hit Dice Value'}
            type={'text'}
            register={register}
            name={'hitDiceValue'}
            readOnly
          />
          <FormField
            label={'Hit Points'}
            type={'text'}
            register={register}
            name={'hitPoints'}
            readOnly
          />
          <ChallengeRatingField
            onCalculateCr={handleCalculateCR}
            register={register}
          />
          <FormField
            label={'XP'}
            type={'number'}
            register={register}
            name={'xp'}
            readOnly
          />
          <FormField
            label={'Proficiency Bonus'}
            type={'number'}
            register={register}
            name={'profBonus'}
            readOnly
          />
        </div>
        <h4>Ability Scores</h4>
        <div
          className="grid mb-3"
          style={{ '--bs-columns': 6 } as React.CSSProperties}
        >
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
          <div className="btn-group" aria-label="Character actions">
            <button type="submit" className="btn btn-success">
              <span>Generate Monster</span>{' '}
              <GiDiceTwentyFacesTwenty size={30} className={'ms-3'} />
            </button>
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
