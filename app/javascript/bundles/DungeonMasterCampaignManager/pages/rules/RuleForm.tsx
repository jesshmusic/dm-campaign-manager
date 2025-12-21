import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ControlledInput } from '../../components/forms/ControllerInput';
import { Checkbox, FormWrapper, FormLabel } from '../../components/forms/Forms.styles';

const FormGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
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
    min-height: 300px;
    font-family: ${({ theme }) => theme.fonts?.sansSerif || 'sans-serif'};
  }

  .ql-editor {
    min-height: 300px;
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

type RuleData = {
  name: string;
  slug: string;
  description: string;
};

export type RuleFormData = {
  name: string;
  description: string;
  parent_slug: string;
  homebrew: boolean;
};

type RuleFormProps = {
  initialData?: RuleData | null;
  onSubmit: (data: RuleFormData) => void;
  isSubmitting?: boolean;
};

const RuleForm: React.FC<RuleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RuleFormData>({
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      parent_slug: '',
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
      id="rule-form"
    >
      <FormGrid>
        <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />

        <ControlledInput
          fieldName="parent_slug"
          control={typedControl}
          label="Parent Rule Slug (optional)"
          errors={errors}
        />

        <FormWrapper>
          <FormLabel>Description (Markdown)</FormLabel>
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

export default RuleForm;
