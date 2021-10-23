import React from 'react';
import { ControllerInput } from '../../../../components/forms/ControllerInput';
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
      <Controller
        render={({ field: { ref, ...rest } }) => (
          <ControllerInput
            type="text"
            label="Description"
            className={styles.actionCol}
            placeholder="Description text..."
            errors={errors}
            readOnly={readOnly}
            {...rest}
          />
        )}
        name={`${fieldName}.desc`}
        control={control}
      />
    </div>
  );
};

export default AbilityForm;
