import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DndClass } from '../../utilities/types';
import {
  ControlledInput,
  ControlledSelect,
  ControlledTagInput,
} from '../../components/forms/ControllerInput';
import { Checkbox, FormWrapper, FormLabel } from '../../components/forms/Forms.styles';

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const TwoColumnField = styled.div`
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const CheckboxWrapper = styled(FormWrapper)`
  align-items: center;
  flex-direction: row;
  gap: 0.5rem;

  label {
    margin-bottom: 0;
  }
`;

const QuillWrapper = styled.div`
  .quill {
    background-color: white;
    border-radius: 0.25rem;
  }

  .ql-container {
    min-height: 100px;
    font-family: ${({ theme }) => theme.fonts?.sansSerif || 'sans-serif'};
  }

  .ql-editor {
    min-height: 100px;
  }
`;

const quillModules = {
  toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
};

export type DndClassFormData = {
  name: string;
  hit_die: number;
  primary_abilities: string;
  spell_ability: string;
  subclasses: string;
  description: string;
  homebrew: boolean;
};

type DndClassFormProps = {
  initialData?: DndClass | null;
  onSubmit: (data: DndClassFormData) => void;
  isSubmitting?: boolean;
};

const hitDieOptions = [
  { value: '6', label: 'd6' },
  { value: '8', label: 'd8' },
  { value: '10', label: 'd10' },
  { value: '12', label: 'd12' },
];

const spellAbilityOptions = [
  { value: '', label: 'None' },
  { value: 'INT', label: 'Intelligence' },
  { value: 'WIS', label: 'Wisdom' },
  { value: 'CHA', label: 'Charisma' },
];

const DndClassForm: React.FC<DndClassFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DndClassFormData>({
    defaultValues: {
      name: initialData?.name || '',
      hit_die: initialData?.hitDie || 8,
      primary_abilities: initialData?.abilityScores?.map((a) => a.name).join(', ') || '',
      spell_ability: initialData?.spellCasting?.spellCastingAbility || '',
      subclasses: initialData?.subclasses?.join(', ') || '',
      description: '',
      homebrew: false,
    },
  });

  // Cast control to satisfy ControlledInput type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="dnd-class-form">
      <FormGrid>
        <TwoColumnField>
          <ControlledInput
            fieldName="name"
            control={typedControl}
            label="Class Name"
            errors={errors}
          />
        </TwoColumnField>

        <ControlledSelect
          fieldName="hit_die"
          control={typedControl}
          label="Hit Die"
          options={hitDieOptions}
        />

        <ControlledSelect
          fieldName="spell_ability"
          control={typedControl}
          label="Spellcasting Ability"
          options={spellAbilityOptions}
        />

        <TwoColumnField>
          <ControlledInput
            fieldName="primary_abilities"
            control={typedControl}
            label="Primary Abilities"
            errors={errors}
            placeholder="e.g., Strength, Dexterity"
          />
        </TwoColumnField>

        <TwoColumnField>
          <ControlledTagInput
            fieldName="subclasses"
            control={typedControl}
            label="Subclasses"
            placeholder="Add subclasses..."
          />
        </TwoColumnField>

        <FullWidthField>
          <FormWrapper>
            <FormLabel>Description</FormLabel>
            <QuillWrapper>
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ReactQuill
                    theme="snow"
                    value={value || ''}
                    onChange={onChange}
                    modules={quillModules}
                  />
                )}
              />
            </QuillWrapper>
          </FormWrapper>
        </FullWidthField>

        <CheckboxWrapper>
          <Controller
            name="homebrew"
            control={control}
            render={({ field: { value, onChange, ...rest } }) => (
              <Checkbox
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                {...rest}
              />
            )}
          />
          <FormLabel htmlFor="homebrew">Homebrew</FormLabel>
        </CheckboxWrapper>
      </FormGrid>
    </form>
  );
};

export default DndClassForm;
