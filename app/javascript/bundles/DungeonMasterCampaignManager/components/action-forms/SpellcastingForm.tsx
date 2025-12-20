import { ControlledInput, ControllerInput } from '../forms/ControllerInput';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import axios from 'axios';
import { filterOptionsWithData } from '../../utilities/character-utilities';
import FormSelect from '../forms/FormSelect';
import FormSelectAsync from '../forms/FormSelectAsync';

import {
  SpellsForm,
  SubformWrapper,
  ActionCol,
  SpellSlots,
} from '../../pages/monster-generator/MonsterGenerator.styles';

export const abilityOptions = [
  { label: 'Charisma', value: 'charisma' },
  { label: 'Intelligence', value: 'intelligence' },
  { label: 'Wisdom', value: 'wisdom' },
];

const slotNames = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
];

const SpellcastingForm = (props: {
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
}) => {
  const { fieldName, errors, control } = props;

  const getSpells = (inputValue: string, callback: unknown) => {
    axios
      .get<{ results: unknown[] }>(`/v1/spells.json?list=true&search=${inputValue}}`)
      .then((response) => {
        const options = filterOptionsWithData(response.data.results);
        (callback as (options: unknown[]) => void)(options);
      })
      .catch((_error) => {});
  };

  return (
    <SpellsForm>
      <h5>Spellcasting</h5>
      <SubformWrapper>
        <ActionCol>
          <Controller
            render={({ field: { ref: _ref, ...rest } }) => (
              <ControllerInput type="number" label="Spellcasting Level" errors={errors} {...rest} />
            )}
            name={`${fieldName}.spellCasting.level`}
            control={control}
          />
        </ActionCol>
        <ActionCol>
          <FormSelect
            label={'Spellcasting Ability'}
            name={`${fieldName}.spellCasting.abilityOption`}
            control={control}
            defaultValue={abilityOptions[0]}
            options={abilityOptions}
          />
        </ActionCol>
      </SubformWrapper>
      <SpellSlots>
        {slotNames.map((slotName, index) => (
          <ControlledInput
            key={`${fieldName}.spellCasting.slots.${slotName}${index}`}
            fieldName={`${fieldName}.spellCasting.slots.${slotName}`}
            errors={errors}
            control={control}
            type="number"
            label={(index + 1).toString()}
          />
        ))}
      </SpellSlots>
      <SubformWrapper>
        <ActionCol>
          <FormSelectAsync
            label={'Spells (search by name, level, or school)'}
            name={`${fieldName}.spellCasting.spellOptions`}
            getOptions={getSpells}
            control={control}
            menuPlacement="top"
            isMulti
            isClearable
          />
        </ActionCol>
      </SubformWrapper>
    </SpellsForm>
  );
};

export default SpellcastingForm;
