import { ControlledInput } from '../../../components/forms/ControllerInput';
import FormIconSelect from '../../../components/forms/FormIconSelect';
import { allGiIcons } from '../../../utilities/icons';
import { Controller, UseFormReturn } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import * as Icons from 'react-icons/gi';
import React from 'react';

import { WidgetFormWrapper, SelectRow } from '../AdminDashboard.styles';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
};

const WidgetForm = (props: { useForm: UseFormReturn; onSubmit: (data) => void }) => {
  return (
    <WidgetFormWrapper onSubmit={props.useForm.handleSubmit(props.onSubmit)} noValidate>
      <ControlledInput
        fieldName={`title`}
        errors={props.useForm.formState.errors}
        control={props.useForm.control}
        label="Title"
      />
      <ControlledInput
        fieldName={`subtitle`}
        errors={props.useForm.formState.errors}
        control={props.useForm.control}
        label="Subtitle (Optional)"
      />
      <SelectRow>
        <FormIconSelect
          label={'Icon'}
          control={props.useForm.control}
          options={allGiIcons}
          name={'iconOption'}
        />
      </SelectRow>
      <label htmlFor={'content'}>Content</label>
      <Controller
        control={props.useForm.control}
        name={'content'}
        render={({ field: { onChange, value } }) => (
          <ReactQuill
            theme="snow"
            value={value || ''}
            onChange={onChange}
            modules={modules}
            style={{ minHeight: '300px' }}
          />
        )}
      />
      <Button
        color={Colors.success}
        title={'Save'}
        type="submit"
        icon={<Icons.GiSave />}
        isFullWidth
      />
    </WidgetFormWrapper>
  );
};

export default WidgetForm;
