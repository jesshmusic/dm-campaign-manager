import React from 'react';
import { ControlledInput } from '../forms/ControllerInput';
import { Control, FieldErrors, FieldValues } from 'react-hook-form';

import { SubformWrapper, ActionCol } from '../../pages/monster-generator/MonsterGenerator.styles';

const AbilityForm = (props: {
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
  readOnly: boolean;
}) => {
  const { fieldName, errors, control, readOnly } = props;
  return (
    <SubformWrapper>
      <ActionCol>
        <ControlledInput
          fieldName={`${fieldName}.desc`}
          errors={errors}
          control={control}
          readOnly={readOnly}
          isTextArea={true}
          label="Description"
        />
      </ActionCol>
    </SubformWrapper>
  );
};

export default AbilityForm;
