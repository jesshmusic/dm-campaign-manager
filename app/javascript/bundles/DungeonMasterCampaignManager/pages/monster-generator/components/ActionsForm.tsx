/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower, GiTrashCan } from 'react-icons/gi';
import { MonsterGeneratorFormFields } from '../../../utilities/types';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import ControllerInput from '../../../components/forms/ControllerInput';

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
    useForm: { control, setValue, register, unregister, trigger }
  } = props;

  const isInitialRender = React.useRef(true);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      // @ts-ignore
      name: fieldName
    }
  );

  const addAction = () => {
    append({
      name: 'New Action',
      numAttacks: 0,
      hasDc: false,
      hasUsages: false,
      hasSpellCasting: false
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

  const handleChange = (
    name: string,
    value: string | number | boolean,
    config?: {
      shouldDirty?: boolean;
      shouldValidate?: boolean;
      shouldTouch?: boolean;
    }
  ) => {
  };

  return (
    <div className={styles.wrapper}>
      <h3>{title}</h3>
      {fields.map((action, actionIndex) => (
        <div key={action.id} className={styles.actionWrapper}>
          <Controller
            render={({ field }) => (
              <ControllerInput label='Name' field={field} type='text' />
            )}
            name={`${fieldName}.${actionIndex}.name`}
            control={control}
          />
          <Controller
            render={({ field }) => (
              <ControllerInput
                type='number'
                label='Number of Attacks'
                field={field}
              />
            )}
            name={`${fieldName}.${actionIndex}.numAttacks`}
            control={control}
          />
          <div>
            <Controller
              render={({ field }) => (
                <ControllerInput
                  type='radio'
                  label='Attack'
                  field={field}
                  value='attack'
                />
              )}
              name={`${fieldName}.${actionIndex}.attackType`}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <ControllerInput
                  type='radio'
                  label='Special Ability'
                  field={field}
                  value='specialAbility'
                />
              )}
              name={`${fieldName}.${actionIndex}.attackType`}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <ControllerInput
                  type='radio'
                  label='Spell Casting'
                  field={field}
                  value='spellcasting'
                />
              )}
              name={`${fieldName}.${actionIndex}.attackType`}
              control={control}
            />
          </div>
          <Button
            type='button'
            onClick={() => remove(actionIndex)}
            color={Colors.danger}
            icon={<GiTrashCan size={30} />}
            hideTitle
            title='Remove Action'
          />
        </div>
      ))}
      <Button
        type='button'
        onClick={addAction}
        color={Colors.success}
        icon={<GiSwordsPower size={30} />}
        title={`Add ${singularTitle}`}
      />
    </div>
  );
};

export default ActionsForm;
