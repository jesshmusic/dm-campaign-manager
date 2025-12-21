import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { SpellProps } from '../../utilities/types';
import {
  ControlledInput,
  ControlledSelect,
  ControlledTagInput,
} from '../../components/forms/ControllerInput';
import { Checkbox, FormWrapper, FormLabel } from '../../components/forms/Forms.styles';

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);

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

const ClassCheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ClassCheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;

  input {
    cursor: pointer;
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
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

export type SpellFormData = {
  name: string;
  description: string;
  higher_level: string;
  range: string;
  components: string;
  material: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  school: string;
  spell_classes: string[];
};

type SpellFormProps = {
  initialData?: SpellProps | null;
  onSubmit: (data: SpellFormData) => void;
  isSubmitting?: boolean;
};

const schoolOptions = [
  { value: 'Abjuration', label: 'Abjuration' },
  { value: 'Conjuration', label: 'Conjuration' },
  { value: 'Divination', label: 'Divination' },
  { value: 'Enchantment', label: 'Enchantment' },
  { value: 'Evocation', label: 'Evocation' },
  { value: 'Illusion', label: 'Illusion' },
  { value: 'Necromancy', label: 'Necromancy' },
  { value: 'Transmutation', label: 'Transmutation' },
];

const levelOptions = [
  { value: 0, label: 'Cantrip' },
  { value: 1, label: '1st Level' },
  { value: 2, label: '2nd Level' },
  { value: 3, label: '3rd Level' },
  { value: 4, label: '4th Level' },
  { value: 5, label: '5th Level' },
  { value: 6, label: '6th Level' },
  { value: 7, label: '7th Level' },
  { value: 8, label: '8th Level' },
  { value: 9, label: '9th Level' },
];

const dndClassOptions = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
];

const SpellForm: React.FC<SpellFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SpellFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      higher_level: initialData?.higherLevel || '',
      range: initialData?.range || '',
      components: initialData?.components?.join(', ') || '',
      material: initialData?.material || '',
      ritual: initialData?.ritual || false,
      duration: initialData?.duration || '',
      concentration: initialData?.concentration || false,
      casting_time: initialData?.castingTime || '',
      level: initialData?.level ?? 0,
      school: initialData?.school || 'Evocation',
      spell_classes: initialData?.spellClasses || [],
    },
  });

  // Cast control to satisfy ControlledInput type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      id="spell-form">
      <FormGrid>
        <TwoColumnField>
          <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />
        </TwoColumnField>

        <ControlledSelect
          fieldName="level"
          control={typedControl}
          label="Level"
          options={levelOptions}
        />

        <ControlledSelect
          fieldName="school"
          control={typedControl}
          label="School"
          options={schoolOptions}
        />

        <ControlledInput
          fieldName="casting_time"
          control={typedControl}
          label="Casting Time"
          errors={errors}
        />

        <ControlledInput fieldName="range" control={typedControl} label="Range" errors={errors} />

        <ControlledInput
          fieldName="duration"
          control={typedControl}
          label="Duration"
          errors={errors}
        />

        <FullWidthField>
          <ControlledTagInput
            fieldName="components"
            control={typedControl}
            label="Components"
            placeholder="Add components (V, S, M)..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledInput
            fieldName="material"
            control={typedControl}
            label="Material"
            errors={errors}
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

        <FullWidthField>
          <FormWrapper>
            <FormLabel>At Higher Levels</FormLabel>
            <QuillWrapper>
              <Controller
                name="higher_level"
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

        <FullWidthField>
          <FormWrapper>
            <FormLabel>Spell Classes</FormLabel>
            <Controller
              name="spell_classes"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ClassCheckboxGrid>
                  {dndClassOptions.map((className) => (
                    <ClassCheckboxItem key={className}>
                      <input
                        type="checkbox"
                        checked={value?.includes(className) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange([...(value || []), className]);
                          } else {
                            onChange((value || []).filter((c: string) => c !== className));
                          }
                        }}
                      />
                      {className}
                    </ClassCheckboxItem>
                  ))}
                </ClassCheckboxGrid>
              )}
            />
          </FormWrapper>
        </FullWidthField>

        <CheckboxWrapper>
          <Controller
            name="ritual"
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
          <FormLabel htmlFor="ritual">Ritual</FormLabel>
        </CheckboxWrapper>

        <CheckboxWrapper>
          <Controller
            name="concentration"
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
          <FormLabel htmlFor="concentration">Concentration</FormLabel>
        </CheckboxWrapper>
      </FormGrid>
    </form>
  );
};

export default SpellForm;
