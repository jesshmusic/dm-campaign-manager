import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { GiTrashCan } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import {
  ControlledInput,
  ControlledSelect,
} from '../../../../../../components/forms/ControllerInput';
import { speeds } from '../../../../../../utilities/character-utilities';

import {
  FormContainer,
  FormElementSelect,
  FormElementInput,
} from '../../../../MonsterGenerator.styles';

const SpeedForm = (props: {
  speedIndex: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { speedIndex, control, errors, fieldName, remove } = props;

  return (
    <FormContainer>
      <FormElementSelect>
        <ControlledSelect
          fieldName={`${fieldName}.${speedIndex}.nameOption`}
          control={control}
          label="Speed"
          options={speeds}
        />
      </FormElementSelect>
      <FormElementInput>
        <ControlledInput
          fieldName={`${fieldName}.${speedIndex}.value`}
          errors={errors}
          control={control}
          label="Value"
          type="number"
        />
      </FormElementInput>
      <Button
        type="button"
        onClick={() => remove(speedIndex)}
        color={Colors.danger}
        icon={<GiTrashCan size={30} />}
        hideTitle
        title="Remove Action"
      />
    </FormContainer>
  );
};

export default SpeedForm;
