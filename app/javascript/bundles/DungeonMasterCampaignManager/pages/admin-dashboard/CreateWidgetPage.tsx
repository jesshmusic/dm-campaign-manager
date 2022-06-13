import React from 'react';
import PageContainer from '../../containers/PageContainer';
import ReactQuill from 'react-quill';
import { ControlledInput } from '../../components/forms/ControllerInput';
import { Controller } from 'react-hook-form';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import * as Icons from 'react-icons/gi';
import rest from '../../api/api';
import { connect } from 'react-redux';
import FormIconSelect from '../../components/forms/FormIconSelect';
import { WidgetProps } from '../../components/Widgets/Widget';
import { useCreateWidgetState } from './use-create-widget-state';
import { allGiIcons } from '../../utilities/icons';

const CreateWidgetPage = (props: {
  createWidget: (widget: WidgetProps, token?: string) => void;
  token?: string;
}) => {
  const { onSubmit, setTestState, testState, updateWidgetForm, UseForm } =
    useCreateWidgetState(props);

  React.useEffect(() => {
    const subscription = UseForm.watch((value, { name }) => {
      if (name) {
        updateWidgetForm(name, value);
      }
      // @ts-ignore
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  return (
    <PageContainer
      pageTitle={'Create Widget'}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
    >
      <h1>Create Widget</h1>
      {process.env.NODE_ENV === 'development' ? (
        <pre
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#fff',
            width: '150px',
            zIndex: 200,
          }}
        >
          {JSON.stringify(testState, null, 2)}
        </pre>
      ) : null}
      <form onSubmit={UseForm.handleSubmit(onSubmit)} noValidate>
        <ControlledInput
          fieldName={`title`}
          errors={UseForm.formState.errors}
          control={UseForm.control}
          label="Title"
        />
        <ControlledInput
          fieldName={`subtitle`}
          errors={UseForm.formState.errors}
          control={UseForm.control}
          label="Subtitle (Optional)"
        />
        <FormIconSelect
          label={'Icon'}
          control={UseForm.control}
          options={allGiIcons}
          name={'iconOption'}
        />
        <label htmlFor={'content'}>Content</label>
        <Controller
          control={UseForm.control}
          name={'content'}
          render={({ field }) => (
            <ReactQuill theme="snow" style={{ minHeight: '300px' }} {...field} />
          )}
        />
        <Button
          color={Colors.success}
          title={'Save'}
          type="submit"
          icon={<Icons.GiSave />}
          isFullWidth
        />
      </form>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createWidget: (widget: WidgetProps, token?: string) => {
      dispatch(
        rest.actions.createWidget(
          {},
          {
            body: JSON.stringify({
              widget: {
                title: widget.title,
                icon: widget.icon,
                subtitle: widget.subtitle,
                content: widget.content,
              },
              token,
            }),
          }
        )
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWidgetPage);
