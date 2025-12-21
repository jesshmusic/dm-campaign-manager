import { Control, FieldErrors, FieldValues, useWatch } from 'react-hook-form';
import { ControlledInput, ControlledSelect } from '../forms/ControllerInput';
import { damageTypes, diceOptions } from '../../utilities/character-utilities';

import {
  AttackWrapper,
  SubformWrapper,
  ActionCol,
  DiceSelectField,
  Checkbox,
} from '../../pages/monster-generator/MonsterGenerator.styles';

const AttackForm = (props: {
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
}) => {
  const { control, errors, fieldName } = props;

  const isRanged = useWatch({
    control,
    name: `${fieldName}.damage.isRanged`,
  });

  return (
    <AttackWrapper>
      <SubformWrapper>
        <ActionCol>
          <ControlledInput
            control={control}
            errors={errors}
            fieldName={`${fieldName}.numAttacks`}
            label="Number of Attacks"
            min={1}
            type="number"
          />
        </ActionCol>
        <ActionCol>
          <ControlledInput
            control={control}
            errors={errors}
            fieldName={`${fieldName}.damage.numDice`}
            label="Dice Count"
            min={1}
            type="number"
          />
        </ActionCol>
        <DiceSelectField>
          <ControlledSelect
            fieldName={`${fieldName}.damage.diceValueOption`}
            control={control}
            label="Dice Type"
            options={diceOptions}
          />
        </DiceSelectField>
        <DiceSelectField>
          <ControlledSelect
            fieldName={`${fieldName}.damage.damageTypeOption`}
            control={control}
            label="Damage Type"
            options={damageTypes}
          />
        </DiceSelectField>
        <ActionCol>
          <ControlledInput
            control={control}
            errors={errors}
            fieldName={`${fieldName}.damage.numTargets`}
            label="Number of Targets"
            min={1}
            type="number"
          />
        </ActionCol>
        {!isRanged && (
          <ActionCol>
            <ControlledInput
              fieldName={`${fieldName}.damage.reach`}
              errors={errors}
              control={control}
              label="Reach"
              type="number"
              min={0}
            />
          </ActionCol>
        )}
        <Checkbox>
          <ControlledInput
            fieldName={`${fieldName}.damage.isRanged`}
            errors={errors}
            control={control}
            label="Ranged Attack"
            type="checkbox"
          />
        </Checkbox>
      </SubformWrapper>
      {isRanged && (
        <SubformWrapper>
          <ActionCol>
            <ControlledInput
              fieldName={`${fieldName}.damage.rangeNormal`}
              errors={errors}
              control={control}
              label="Normal Range"
              type="number"
              min={0}
            />
          </ActionCol>
          <ActionCol>
            <ControlledInput
              fieldName={`${fieldName}.damage.rangeLong`}
              errors={errors}
              control={control}
              label="Long Range"
              type="number"
              min={0}
            />
          </ActionCol>
        </SubformWrapper>
      )}
    </AttackWrapper>
  );
};

export default AttackForm;
