import React from 'react';
import { Control, Controller, FieldErrors, useWatch } from 'react-hook-form';
import { ControllerInput } from '../../../../components/forms/ControllerInput';
import Select from 'react-select';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import { GiTrashCan } from 'react-icons/gi';
import AbilityForm from './AbilityForm';
import AttackForm from './AttackForm';
import { ActionTypes } from '../../../../utilities/types';
import SpellcastingForm from './SpellcastingForm';

const styles = require('./action-form.module.scss');
const inputStyles = require('../../../../components/forms/input.module.scss');

const ActionForm = (props: {
  actionIndex: number;
  control: Control;
  errors: FieldErrors;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { actionIndex, control, errors, remove } = props;

  const actionType = useWatch({
    control,
    name: `actions.${actionIndex}.actionType`,
    defaultValue: ActionTypes.attack,
  });

  return (
    <div className={styles.actionContainer}>
      <div className={styles.actionWrapper}>
        <Controller
          render={({ field: { ref, ...rest } }) => (
            <ControllerInput
              label="Name"
              {...rest}
              type="text"
              placeholder="Action Title..."
              errors={errors}
              className={styles.actionCol}
            />
          )}
          name={`actions.${actionIndex}.name`}
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
                  { value: ActionTypes.ability, label: 'Ability' },
                  { value: ActionTypes.attack, label: 'Attack' },
                  {
                    value: ActionTypes.spellCasting,
                    label: 'Spell Casting',
                  },
                ]}
              />
            </div>
          )}
          name={`actions.${actionIndex}.actionType`}
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
      <AbilityForm
        control={control}
        errors={errors}
        fieldName={`actions.${actionIndex}`}
        readOnly={actionType.value !== ActionTypes.ability}
      />
      {actionType.value === ActionTypes.attack && (
        <AttackForm
          control={control}
          errors={errors}
          fieldName={`actions.${actionIndex}`}
        />
      )}
      {actionType.value === ActionTypes.spellCasting && (
        <SpellcastingForm
          control={control}
          errors={errors}
          fieldName={`actions.${actionIndex}`}
        />
      )}
    </div>
  );
};

export default ActionForm;
