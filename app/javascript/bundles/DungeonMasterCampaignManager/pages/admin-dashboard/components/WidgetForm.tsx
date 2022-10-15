import { ControlledInput } from '../../../components/forms/ControllerInput';
import FormIconSelect from '../../../components/forms/FormIconSelect';
import { allGiIcons } from '../../../utilities/icons';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import * as Icons from 'react-icons/gi';
import React from 'react';

const styles = require('../create-widget-page.module.scss');

const plugins = [
  'advlist',
  'autolink',
  'lists',
  'link',
  'charmap',
  'preview',
  'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'table',
  'code',
  'help',
  'wordcount',
];

const toolbar =
  'undo redo | blocks | ' +
  'bold italic forecolor | alignleft aligncenter ' +
  'alignright alignjustify | bullist numlist outdent indent | ' +
  'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol' +
  'removeformat | help';

const WidgetForm = (props: { useForm: UseFormReturn; onSubmit: (data) => void }) => {
  return (
    <form onSubmit={props.useForm.handleSubmit(props.onSubmit)} noValidate className={styles.form}>
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
      <FormIconSelect
        className={styles.selectRow}
        label={'Icon'}
        control={props.useForm.control}
        options={allGiIcons}
        name={'iconOption'}
      />
      <label htmlFor={'content'}>Content</label>
      <Controller
        control={props.useForm.control}
        name={'content'}
        render={({ field: { onChange, ...rest } }) => {
          const handleChange = (data) => {
            onChange(data);
          };
          return (
            <Editor
              apiKey="p7j8xfgttb661xyhyd0c2p0kn9hma0ivisrd48vn7zjzl0vh"
              init={{
                height: 500,
                plugins,
                toolbar,
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
              onEditorChange={handleChange}
              {...rest}
            />
          );
        }}
      />
      <Button
        color={Colors.success}
        title={'Save'}
        type="submit"
        icon={<Icons.GiSave />}
        isFullWidth
      />
    </form>
  );
};

export default WidgetForm;
