import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Background } from '../../reducers/backgrounds';
import { ControlledInput, ControlledTagInput } from '../../components/forms/ControllerInput';
import { Checkbox, FormWrapper, FormLabel } from '../../components/forms/Forms.styles';

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
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
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

export type BackgroundFormData = {
  name: string;
  description: string;
  feat_name: string;
  tool_proficiency: string;
  equipment_option_a: string;
  equipment_option_b: string;
  abilityScores: string;
  skillProficiencies: string;
  homebrew: boolean;
};

type BackgroundFormProps = {
  initialData?: Background | null;
  onSubmit: (data: BackgroundFormData) => void;
  isSubmitting?: boolean;
};

const BackgroundForm: React.FC<BackgroundFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BackgroundFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      feat_name: initialData?.feat_name || '',
      tool_proficiency: initialData?.tool_proficiency || '',
      equipment_option_a: initialData?.equipment_option_a || '',
      equipment_option_b: initialData?.equipment_option_b || '',
      abilityScores: initialData?.abilityScores?.join(', ') || '',
      skillProficiencies: initialData?.skillProficiencies?.join(', ') || '',
      homebrew: initialData?.homebrew || false,
    },
  });

  // Cast control to satisfy ControlledInput type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      id="background-form"
    >
      <FormGrid>
        <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />

        <ControlledInput
          fieldName="feat_name"
          control={typedControl}
          label="Feat Name"
          errors={errors}
        />

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

        <ControlledInput
          fieldName="tool_proficiency"
          control={typedControl}
          label="Tool Proficiency"
          errors={errors}
        />

        <FullWidthField>
          <ControlledTagInput
            fieldName="skillProficiencies"
            control={typedControl}
            label="Skill Proficiencies"
            placeholder="Add skill proficiencies..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="abilityScores"
            control={typedControl}
            label="Ability Scores"
            placeholder="Add ability scores..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledInput
            fieldName="equipment_option_a"
            control={typedControl}
            label="Equipment Option A"
            errors={errors}
            isTextArea
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledInput
            fieldName="equipment_option_b"
            control={typedControl}
            label="Equipment Option B"
            errors={errors}
            isTextArea
          />
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

export default BackgroundForm;
