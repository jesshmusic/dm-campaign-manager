import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MonsterProps } from '../../utilities/types';
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
    min-height: 150px;
    font-family: ${({ theme }) => theme.fonts?.sansSerif || 'sans-serif'};
  }

  .ql-editor {
    min-height: 150px;
  }
`;

const quillModules = {
  toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
};

export type MonsterFormData = {
  name: string;
  description: string;
  size: string;
  monster_type: string;
  monster_subtype: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: string;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  challenge_rating: string;
  languages: string;
  damage_immunities: string;
  damage_resistances: string;
  damage_vulnerabilities: string;
  condition_immunities: string;
  saving_throws: string;
  skills: string;
  homebrew: boolean;
};

type MonsterFormProps = {
  initialData?: MonsterProps | null;
  onSubmit: (data: MonsterFormData) => void;
  isSubmitting?: boolean;
};

const sizeOptions = [
  { value: 'Tiny', label: 'Tiny' },
  { value: 'Small', label: 'Small' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Large', label: 'Large' },
  { value: 'Huge', label: 'Huge' },
  { value: 'Gargantuan', label: 'Gargantuan' },
];

const monsterTypeOptions = [
  { value: 'Aberration', label: 'Aberration' },
  { value: 'Beast', label: 'Beast' },
  { value: 'Celestial', label: 'Celestial' },
  { value: 'Construct', label: 'Construct' },
  { value: 'Dragon', label: 'Dragon' },
  { value: 'Elemental', label: 'Elemental' },
  { value: 'Fey', label: 'Fey' },
  { value: 'Fiend', label: 'Fiend' },
  { value: 'Giant', label: 'Giant' },
  { value: 'Humanoid', label: 'Humanoid' },
  { value: 'Monstrosity', label: 'Monstrosity' },
  { value: 'Ooze', label: 'Ooze' },
  { value: 'Plant', label: 'Plant' },
  { value: 'Undead', label: 'Undead' },
];

const MonsterForm: React.FC<MonsterFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MonsterFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      size: initialData?.size || 'Medium',
      monster_type: initialData?.monsterType || 'Humanoid',
      monster_subtype: initialData?.monsterSubtype || '',
      alignment: initialData?.alignment || '',
      armor_class: initialData?.armorClass || 10,
      hit_points: initialData?.hitPoints || 1,
      hit_dice: initialData?.hitDice || '1d8',
      strength: initialData?.strength || 10,
      dexterity: initialData?.dexterity || 10,
      constitution: initialData?.constitution || 10,
      intelligence: initialData?.intelligence || 10,
      wisdom: initialData?.wisdom || 10,
      charisma: initialData?.charisma || 10,
      challenge_rating: initialData?.challengeRating || '0',
      languages: initialData?.languages || '',
      damage_immunities: initialData?.damageImmunities?.join(', ') || '',
      damage_resistances: initialData?.damageResistances?.join(', ') || '',
      damage_vulnerabilities: initialData?.damageVulnerabilities?.join(', ') || '',
      condition_immunities: initialData?.conditionImmunities?.join(', ') || '',
      saving_throws: initialData?.savingThrows?.join(', ') || '',
      skills: initialData?.skills?.join(', ') || '',
      homebrew: false,
    },
  });

  // Cast control to satisfy ControlledInput type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      id="monster-form">
      <FormGrid>
        <TwoColumnField>
          <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />
        </TwoColumnField>

        <ControlledSelect
          fieldName="size"
          control={typedControl}
          label="Size"
          options={sizeOptions}
        />

        <ControlledSelect
          fieldName="monster_type"
          control={typedControl}
          label="Type"
          options={monsterTypeOptions}
        />

        <ControlledInput
          fieldName="monster_subtype"
          control={typedControl}
          label="Subtype"
          errors={errors}
        />

        <ControlledInput
          fieldName="alignment"
          control={typedControl}
          label="Alignment"
          errors={errors}
        />

        <ControlledInput
          fieldName="armor_class"
          control={typedControl}
          label="AC"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="hit_points"
          control={typedControl}
          label="HP"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="hit_dice"
          control={typedControl}
          label="Hit Dice"
          errors={errors}
        />

        <ControlledInput
          fieldName="challenge_rating"
          control={typedControl}
          label="CR"
          errors={errors}
        />

        <ControlledInput
          fieldName="strength"
          control={typedControl}
          label="STR"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="dexterity"
          control={typedControl}
          label="DEX"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="constitution"
          control={typedControl}
          label="CON"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="intelligence"
          control={typedControl}
          label="INT"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="wisdom"
          control={typedControl}
          label="WIS"
          errors={errors}
          type="number"
        />

        <ControlledInput
          fieldName="charisma"
          control={typedControl}
          label="CHA"
          errors={errors}
          type="number"
        />

        <TwoColumnField>
          <ControlledInput
            fieldName="languages"
            control={typedControl}
            label="Languages"
            errors={errors}
          />
        </TwoColumnField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="saving_throws"
            control={typedControl}
            label="Saving Throws"
            placeholder="Add saving throws..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="skills"
            control={typedControl}
            label="Skills"
            placeholder="Add skills..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="damage_immunities"
            control={typedControl}
            label="Damage Immunities"
            placeholder="Add damage immunities..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="damage_resistances"
            control={typedControl}
            label="Damage Resistances"
            placeholder="Add damage resistances..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="damage_vulnerabilities"
            control={typedControl}
            label="Damage Vulnerabilities"
            placeholder="Add damage vulnerabilities..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="condition_immunities"
            control={typedControl}
            label="Condition Immunities"
            placeholder="Add condition immunities..."
          />
        </FullWidthField>

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

export default MonsterForm;
