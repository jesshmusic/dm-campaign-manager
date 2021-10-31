import React from 'react';
import {
  ControlledInput,
  ControllerInput,
} from '../../../../../../components/forms/ControllerInput';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';

const styles = require('./action-form.module.scss');

const AbilityForm = (props: {
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
  readOnly: boolean;
}) => {
  const { fieldName, errors, control, readOnly } = props;
  return (
    <div className={styles.subformWrapper}>
      <ControlledInput
        className={styles.actionCol}
        fieldName={`${fieldName}.desc`}
        errors={errors}
        control={control}
        readOnly={readOnly}
        isTextArea={true}
        label="Description"
      />
    </div>
  );
};

export default AbilityForm;
