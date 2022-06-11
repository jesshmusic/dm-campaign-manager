import React from 'react';
import { gsap } from 'gsap/gsap-core';
import { Control, FieldErrors, useWatch } from 'react-hook-form';
import { ControlledInput } from '../../../../../../../components/forms/ControllerInput';
import Button from '../../../../../../../components/Button/Button';
import { Colors } from '../../../../../../../utilities/enums';
import { GiTrashCan } from 'react-icons/gi';
import AbilityForm from './AbilityForm';
import AttackForm from './AttackForm';
import { ActionTypes } from '../../../../../../../utilities/types';
import SpellcastingForm from './SpellcastingForm';

const styles = require('./action-form.module.scss');

const ActionForm = (props: {
  actionIndex?: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove?: (index?: number | number[] | undefined) => void;
}) => {
  const { actionIndex, control, errors, fieldName, remove } = props;
  const isFirstRender = React.useRef(true);
  const fieldNamePrefix = actionIndex ? `${fieldName}.${actionIndex}.` : `${fieldName}.`;

  const actionType = useWatch({
    control,
    name: `${fieldNamePrefix}actionType`,
    defaultValue: ActionTypes.attack,
  });

  const slots = useWatch({
    control,
    name: `${fieldNamePrefix}spellCasting.slots`,
  });

  return (
    <div className={styles.actionContainer}>
      <div className={styles.actionWrapper}>
        <ControlledInput
          fieldName={`${fieldNamePrefix}name`}
          errors={errors}
          className={styles.actionCol}
          control={control}
          label="Name"
        />
        {remove ? (
          <Button
            type="button"
            onClick={() => remove(actionIndex)}
            color={Colors.danger}
            icon={<GiTrashCan size={30} />}
            hideTitle
            title="Remove Action"
          />
        ) : null}
      </div>
      <div id={`actionContent${actionIndex}`} className={styles.actionContent}>
        <AbilityForm
          control={control}
          errors={errors}
          fieldName={actionIndex ? `${fieldName}.${actionIndex}` : fieldName}
          readOnly={actionType !== ActionTypes.ability}
        />
        {actionType === ActionTypes.attack && (
          <AttackForm
            control={control}
            errors={errors}
            fieldName={actionIndex ? `${fieldName}.${actionIndex}` : fieldName}
          />
        )}
        {actionType === ActionTypes.spellCasting && (
          <SpellcastingForm
            control={control}
            errors={errors}
            fieldName={actionIndex ? `${fieldName}.${actionIndex}` : fieldName}
          />
        )}
      </div>
    </div>
  );
};

export default ActionForm;
