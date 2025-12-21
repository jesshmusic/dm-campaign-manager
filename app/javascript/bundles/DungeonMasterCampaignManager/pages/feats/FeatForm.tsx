import React from 'react';
import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Feat } from '../../reducers/feats';
import { ControlledInput, ControlledSelect } from '../../components/forms/ControllerInput';
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
    min-height: 200px;
    font-family: ${({ theme }) => theme.fonts?.sansSerif || 'sans-serif'};
  }

  .ql-editor {
    min-height: 200px;
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

export type FeatFormData = {
  name: string;
  category: string;
  prerequisite: string;
  description: string;
  repeatable: boolean;
};

type FeatFormProps = {
  initialData?: Feat | null;
  onSubmit: (data: FeatFormData) => void;
  isSubmitting?: boolean;
};

const categoryOptions = [
  { value: 'Origin', label: 'Origin' },
  { value: 'General', label: 'General' },
  { value: 'Fighting Style', label: 'Fighting Style' },
  { value: 'Epic Boon', label: 'Epic Boon' },
];

const FeatForm: React.FC<FeatFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting: _isSubmitting = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeatFormData>({
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'General',
      prerequisite: initialData?.prerequisite || '',
      description: initialData?.description || '',
      repeatable: initialData?.repeatable || false,
    },
  });

  // Cast control to satisfy ControlledInput/ControlledSelect type expectations
  const typedControl = control as unknown as Control<FieldValues, object>;

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      id="feat-form">
      <FormGrid>
        <ControlledInput fieldName="name" control={typedControl} label="Name" errors={errors} />

        <ControlledSelect
          fieldName="category"
          control={typedControl}
          label="Category"
          options={categoryOptions}
        />

        <FullWidthField>
          <ControlledInput
            fieldName="prerequisite"
            control={typedControl}
            label="Prerequisite"
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

        <CheckboxWrapper>
          <Controller
            name="repeatable"
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
          <FormLabel htmlFor="repeatable">Repeatable</FormLabel>
        </CheckboxWrapper>
      </FormGrid>
    </form>
  );
};

export default FeatForm;
