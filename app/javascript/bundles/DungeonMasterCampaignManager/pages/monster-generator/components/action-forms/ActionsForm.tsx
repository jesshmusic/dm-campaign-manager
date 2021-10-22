/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower } from 'react-icons/gi';
import { MonsterGeneratorFormFields } from '../../../../utilities/types';
import {
  useFieldArray,
  UseFormGetValues,
  UseFormReturn,
} from 'react-hook-form';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';

import '../../../../components/forms/inputOverrides.scss';
import ActionForm from './ActionForm';

const styles = require('./action-form.module.scss');

export enum ActionTypes {
  attack = 'attack',
  ability = 'ability',
  spellCasting = 'spellCasting',
}

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
      attackType: { value: ActionTypes.attack, label: 'Attack' },
      numAttacks: 1,
      damage: {
        numDice: 1,
        diceValueOption: { label: 'd6', value: 6 },
        diceValue: 6,
        totalDamagePerRound: 4,
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
          control={control}
          getValues={getValues}
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
