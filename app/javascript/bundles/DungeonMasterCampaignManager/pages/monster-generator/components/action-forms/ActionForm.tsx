import React from 'react';
import { Control, FieldErrors, useWatch } from 'react-hook-form';
import { ControlledInput } from '../../../../components/forms/ControllerInput';
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
        <ControlledInput
          fieldName={`actions.${actionIndex}.name`}
          errors={errors}
          className={styles.actionCol}
          control={control}
          label="Name"
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
        readOnly={actionType !== ActionTypes.ability}
      />
      {actionType === ActionTypes.attack && (
        <AttackForm
          control={control}
          errors={errors}
          fieldName={`actions.${actionIndex}`}
        />
      )}
      {actionType === ActionTypes.spellCasting && (
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
