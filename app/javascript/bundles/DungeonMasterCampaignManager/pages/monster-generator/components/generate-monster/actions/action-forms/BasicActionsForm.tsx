/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import { GiAbacus } from 'react-icons/gi';
import {
  ActionFormComponentProps,
  ActionTypes,
} from '../../../../../../utilities/types';
import Button from '../../../../../../components/Button/Button';
import { Colors } from '../../../../../../utilities/enums';

import '../../../../../../components/forms/inputOverrides.scss';
import ActionForm from './ActionForm';

const BasicActionsForm = (props: ActionFormComponentProps) => {
  const {
    appendAction,
    fieldName,
    fields,
    handleRemove,
    singularTitle,
    useForm: {
      control,
      formState: { errors },
    },
  } = props;

  const addAction = () => {
    appendAction({
      desc: '',
      actionType: ActionTypes.ability,
    });
  };

  return (
    <>
      {fields.map((action, actionIndex) => (
        <ActionForm
          key={action.id}
          actionIndex={actionIndex}
          fieldName={fieldName}
          control={control}
          errors={errors}
          remove={handleRemove}
        />
      ))}
      <Button
        type="button"
        onClick={addAction}
        color={Colors.success}
        icon={<GiAbacus size={30} />}
        title={`Add ${singularTitle}`}
      />
    </>
  );
};

export default BasicActionsForm;
