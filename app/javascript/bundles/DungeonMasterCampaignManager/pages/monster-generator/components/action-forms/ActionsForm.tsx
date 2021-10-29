/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiAbacus, GiSwordsPower } from 'react-icons/gi';
import {
  ActionTypes,
  MonsterGeneratorFormFields,
} from '../../../../utilities/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';

import '../../../../components/forms/inputOverrides.scss';
import ActionForm from './ActionForm';
import { abilityOptions } from './SpellcastingForm';
import { GiMagicPalm } from 'react-icons/all';

const styles = require('./action-form.module.scss');

const ActionsForm = (props: {
  fieldName: keyof MonsterGeneratorFormFields;
  title: string;
  singularTitle: string;
  useForm: UseFormReturn<any, object>;
}) => {
  const {
    fieldName,
    singularTitle,
    title,
    useForm: {
      control,
      formState: { errors },
      setValue,
      register,
      unregister,
      trigger,
    },
  } = props;

  const isInitialRender = React.useRef(true);
  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const addAction = () => {
    append({
      name: 'New Action',
      desc: '',
      actionType: ActionTypes.ability,
    });
  };

  const addAttack = () => {
    append({
      name: 'New Action',
      actionType: ActionTypes.attack,
      numAttacks: 1,
      desc: '',
      damage: {
        damageTypeOption: { label: 'Slashing', value: 'slashing' },
        damageType: 'slashing',
        diceValueOption: { label: 'd6', value: 6 },
        diceValue: 6,
        isRanged: false,
        numDice: 1,
        numTargets: 1,
        rangeNormal: 120,
        rangeLong: 300,
        reach: 5,
      },
    });
  };

  const addSpellCasting = () => {
    append({
      name: 'New Action',
      actionType: ActionTypes.spellCasting,
      desc: '',
      spellCasting: {
        level: 1,
        ability: 'Intelligence',
        abilityOption: abilityOptions[3],
        slots: {
          first: 1,
          second: 2,
          third: 3,
          fourth: 4,
          fifth: 5,
          sixth: 6,
          seventh: 7,
          eighth: 8,
          ninth: 9,
        },
        spellIds: [],
      },
    });
  };

  React.useEffect(() => {
    if (!fields.length && !isInitialRender.current) {
      trigger(fieldName);
    }

    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [fields, register, setValue, unregister, trigger]);

  return (
    <div className={styles.wrapper}>
      <h4>{title}</h4>
      {fields.map((action, actionIndex) => (
        <ActionForm
          key={action.id}
          actionIndex={actionIndex}
          control={control}
          errors={errors}
          remove={remove}
        />
      ))}
      <Button
        type="button"
        onClick={addAction}
        color={Colors.success}
        icon={<GiAbacus size={30} />}
        title={`Add Action`}
      />
      <Button
        type="button"
        onClick={addAttack}
        color={Colors.danger}
        icon={<GiSwordsPower size={30} />}
        title={`Add Attack`}
      />
      <Button
        type="button"
        onClick={addSpellCasting}
        color={Colors.info}
        icon={<GiMagicPalm size={30} />}
        title={`Add Spellcasting`}
      />
    </div>
  );
};

export default ActionsForm;
