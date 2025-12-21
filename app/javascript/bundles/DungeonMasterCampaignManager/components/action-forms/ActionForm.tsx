import { Control, FieldErrors, useWatch } from 'react-hook-form';
import { ControlledInput } from '../forms/ControllerInput';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { GiTrashCan } from 'react-icons/gi';
import AbilityForm from './AbilityForm';
import AttackForm from './AttackForm';
import { ActionTypes } from '../../utilities/types';
import SpellcastingForm from './SpellcastingForm';

import {
  ActionContainer,
  ActionWrapper,
  ActionCol,
  ActionContent,
} from '../../pages/monster-generator/MonsterGenerator.styles';

const ActionForm = (props: {
  actionIndex?: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove?: (index?: number | number[] | undefined) => void;
}) => {
  const { actionIndex, control, errors, fieldName, remove } = props;
  const fieldNamePrefix = actionIndex ? `${fieldName}.${actionIndex}.` : `${fieldName}.`;

  const actionType = useWatch({
    control,
    name: `${fieldNamePrefix}actionType`,
    defaultValue: ActionTypes.attack,
  });

  return (
    <ActionContainer>
      <ActionWrapper>
        <ActionCol>
          <ControlledInput
            fieldName={`${fieldNamePrefix}name`}
            errors={errors}
            control={control}
            label="Name"
          />
        </ActionCol>
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
      </ActionWrapper>
      <ActionContent id={`actionContent${actionIndex}`}>
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
      </ActionContent>
    </ActionContainer>
  );
};

export default ActionForm;
