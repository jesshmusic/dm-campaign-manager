/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiSwordsPower, GiTrashCan } from 'react-icons/gi';
import { MonsterGeneratorFormFields } from '../../../../utilities/types';
import {
  Controller,
  useFieldArray,
  UseFieldArrayProps,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import ControllerInput from '../../../../components/forms/ControllerInput';
import Select from 'react-select';
import AbilityForm from './AbilityForm';

import '../../../../components/forms/inputOverrides.scss';
const styles = require('./action-form.module.scss');
const inputStyles = require('../../../../components/forms/input.module.scss');

enum ActionTypes {
  action = 'action',
  ability = 'ability',
  spellCasting = 'spellCasting',
}

const ActionsForm = (props: {
  fieldName: keyof MonsterGeneratorFormFields;
  title: string;
  singularTitle: string;
  useForm: UseFormReturn<any, object>;
}) => {
  const [actionFormState, setActionFormState] = React.useState(
    ActionTypes.ability
  );
  const {
    fieldName,
    singularTitle,
    title,
    useForm: { control, setValue, register, unregister, trigger, watch },
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
      attackType: { value: ActionTypes.ability, label: 'Ability' },
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
  ) => {};

  console.log(actionFormState);
  return (
    <div className={styles.wrapper}>
      <h3>{title}</h3>
      {fields.map((action, actionIndex) => (
        <div className={styles.actionContainer}>
          <div key={action.id} className={styles.actionWrapper}>
            <Controller
              render={({ field: { ref, ...rest } }) => (
                <ControllerInput
                  label="Name"
                  {...rest}
                  type="text"
                  placeholder="Action Title..."
                  className={styles.actionCol}
                />
              )}
              name={`${fieldName}.${actionIndex}.name`}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <div className={`${inputStyles.wrapper} ${styles.actionCol}`}>
                  <label className={inputStyles.label}>Action Type</label>
                  <Select
                    className={inputStyles.selectStyle}
                    classNamePrefix={'reactSelect'}
                    {...field}
                    defaultValue={{ value: 'ability', label: 'Ability' }}
                    isSearchable={false}
                    options={[
                      { value: ActionTypes.action, label: 'Attack' },
                      { value: ActionTypes.ability, label: 'Ability' },
                      {
                        value: ActionTypes.spellCasting,
                        label: 'Spell Casting',
                      },
                    ]}
                  />
                </div>
              )}
              name={`${fieldName}.${actionIndex}.attackType`}
              control={control}
            />
            <Button
              type="button"
              onClick={() => remove(actionIndex)}
              color={Colors.danger}
              icon={<GiTrashCan size={30} />}
              hideTitle
              title="Remove Action"
            />
          </div>
          {actionFormState === ActionTypes.ability && (
            <AbilityForm
              fieldName={fieldName}
              actionIndex={actionIndex}
              control={control}
            />
          )}
        </div>
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
