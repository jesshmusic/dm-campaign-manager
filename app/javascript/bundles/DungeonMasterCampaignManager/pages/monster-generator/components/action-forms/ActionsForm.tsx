/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower } from 'react-icons/gi';
import {
  ActionTypes,
  MonsterGeneratorFormFields,
} from '../../../../utilities/types';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';

import '../../../../components/forms/inputOverrides.scss';
import ActionForm from './ActionForm';

const styles = require('./action-form.module.scss');

const ActionsForm = (props: {
  attackBonus: number;
  profBonus: number;
  fieldName: keyof MonsterGeneratorFormFields;
  title: string;
  singularTitle: string;
  useForm: UseFormReturn<any, object>;
}) => {
  const {
    attackBonus,
    profBonus,
    fieldName,
    singularTitle,
    title,
    useForm: {
      control,
      formState: { errors },
      getValues,
      setValue,
      register,
      unregister,
      trigger,
      watch,
    },
  } = props;

  const isInitialRender = React.useRef(true);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: fieldName,
    }
  );

  const addAction = () => {
    append({
      name: 'New Action',
      actionType: { value: ActionTypes.attack, label: 'Attack' },
      numAttacks: 1,
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
      <h3>{title}</h3>
      {fields.map((action, actionIndex) => (
        <ActionForm
          key={action.id}
          actionIndex={actionIndex}
          attackBonus={attackBonus}
          control={control}
          errors={errors}
          getValues={getValues}
          profBonus={profBonus}
          remove={remove}
          setValue={setValue}
        />
      ))}
      <Button
        type="button"
        onClick={addAction}
        color={Colors.success}
        icon={<GiSwordsPower size={30} />}
        title={`Add ${singularTitle}`}
      />
    </div>
  );
};

export default ActionsForm;
