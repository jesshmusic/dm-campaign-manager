import React from 'react';
import { useForm, Controller, Control, FieldValues, useFieldArray } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { RaceProps } from '../../utilities/types';
import { ControlledInput, ControlledTagInput } from '../../components/forms/ControllerInput';
import { Checkbox, FormWrapper, FormLabel } from '../../components/forms/Forms.styles';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import { FaPlus, FaTrash } from 'react-icons/fa';

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

const TraitSection = styled.div`
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const TraitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AddButton = styled(Button)`
  margin-top: 0.5rem;
`;

const quillModules = {
  toolbar: [['bold', 'italic', 'underline'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']],
};

type TraitFormData = {
  name: string;
  desc: string;
};

export type RaceFormData = {
  name: string;
  speed: number;
  size: string;
  size_description: string;
  age: string;
  alignment: string;
  language_description: string;
  languages: string;
  language_choices: string;
  starting_languages: number;
  subraces: string;
  traits: TraitFormData[];
  homebrew: boolean;
};

type RaceFormProps = {
  initialData?: RaceProps | null;
  onSubmit: (data: RaceFormData) => void;
  isSubmitting?: boolean;
};

const RaceForm: React.FC<RaceFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RaceFormData>({
    defaultValues: {
      name: initialData?.name || '',
      speed: initialData?.speed || 30,
      size: initialData?.size || 'Medium',
      size_description: initialData?.sizeDescription || '',
      age: initialData?.age || '',
      alignment: initialData?.alignment || '',
      language_description: initialData?.languageDescription || '',
      languages: initialData?.languages?.join(', ') || 'Common',
      language_choices: initialData?.languageChoices?.join(', ') || '',
      starting_languages: initialData?.startingLanguages || 2,
      subraces: initialData?.subraces?.join(', ') || '',
      traits: initialData?.traits?.map((t) => ({ name: t.name, desc: t.desc.join('\n\n') })) || [],
      homebrew: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'traits',
  });

  // Cast control to satisfy ControlledInput type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="race-form">
      <FormGrid>
        <TwoColumnField>
          <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />
        </TwoColumnField>

        <ControlledInput
          fieldName="speed"
          control={typedControl}
          label="Speed (ft)"
          errors={errors}
          type="number"
        />

        <ControlledInput fieldName="size" control={typedControl} label="Size" errors={errors} />

        <ControlledInput
          fieldName="starting_languages"
          control={typedControl}
          label="Starting Languages #"
          errors={errors}
          type="number"
        />

        <FullWidthField>
          <ControlledInput
            fieldName="size_description"
            control={typedControl}
            label="Size Description"
            errors={errors}
            isTextArea
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledInput
            fieldName="age"
            control={typedControl}
            label="Age"
            errors={errors}
            isTextArea
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledInput
            fieldName="alignment"
            control={typedControl}
            label="Alignment"
            errors={errors}
            isTextArea
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledInput
            fieldName="language_description"
            control={typedControl}
            label="Language Description"
            errors={errors}
            isTextArea
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="languages"
            control={typedControl}
            label="Languages"
            placeholder="Add languages..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="language_choices"
            control={typedControl}
            label="Language Choices"
            placeholder="Add language choices..."
          />
        </FullWidthField>

        <FullWidthField>
          <ControlledTagInput
            fieldName="subraces"
            control={typedControl}
            label="Subraces"
            placeholder="Add subraces..."
          />
        </FullWidthField>

        <FullWidthField>
          <FormWrapper>
            <FormLabel>Traits</FormLabel>
            {fields.map((field, index) => (
              <TraitSection key={field.id}>
                <TraitHeader>
                  <strong>Trait {index + 1}</strong>
                  <Button
                    color={Colors.danger}
                    onClick={() => remove(index)}
                    icon={<FaTrash />}
                    title="Remove Trait"
                    type="button"
                  />
                </TraitHeader>
                <Controller
                  name={`traits.${index}.name`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormWrapper>
                      <FormLabel>Trait Name</FormLabel>
                      <input
                        type="text"
                        value={value || ''}
                        onChange={onChange}
                        placeholder="Trait name..."
                      />
                    </FormWrapper>
                  )}
                />
                <Controller
                  name={`traits.${index}.desc`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormWrapper>
                      <FormLabel>Description</FormLabel>
                      <QuillWrapper>
                        <ReactQuill
                          theme="snow"
                          value={value || ''}
                          onChange={onChange}
                          modules={quillModules}
                        />
                      </QuillWrapper>
                    </FormWrapper>
                  )}
                />
              </TraitSection>
            ))}
            <AddButton
              color={Colors.secondary}
              onClick={() => append({ name: '', desc: '' })}
              icon={<FaPlus />}
              title="Add Trait"
              type="button"
            />
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

export default RaceForm;
