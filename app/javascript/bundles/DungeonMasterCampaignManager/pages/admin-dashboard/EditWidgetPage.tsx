import React from 'react';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { CreateWidgetForm, WidgetProps } from '../../components/Widgets/Widget';
import WidgetForm from './components/WidgetForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { parseIconName } from '../../utilities/icons';

const styles = require('./create-widget-page.module.scss');

const EditWidgetPage = (props: {
  getWidget: (widgetId: number) => void;
  updateWidget: (widget: WidgetProps, token?: string) => void;
  token?: string;
  widget: WidgetProps;
}) => {
  const [testState, setTestState] = React.useState();
  const { getWidget, updateWidget, widget, token } = props;
  const { widgetId } = useParams<'widgetId'>();
  const navigate = useNavigate();

  const UseForm = useForm<CreateWidgetForm>({
    mode: 'onChange',
    defaultValues: {
      title: 'New Widget',
      subtitle: '',
      icon: 'Sword In Stone',
      iconOption: {
        value: 'GiSwordInStone',
        label: 'Sword In Stone',
      },
      content: '',
    },
  });

  const updateWidgetForm = async (fieldName: string | undefined, value: unknown) => {
    // @ts-ignore
    const fields = value as CreateWidgetForm;
    if (fieldName === 'iconOption') {
      UseForm.setValue('icon', fields.iconOption.value as string);
    }
  };

  React.useEffect(() => {
    if (widget) {
      console.log(widget);
      UseForm.reset({
        id: widget.id,
        title: widget.title,
        subtitle: widget.subtitle,
        icon: widget.icon,
        iconOption: {
          value: widget.icon,
          label: parseIconName(widget.icon),
        },
        content: widget.content,
      });
    }
  }, [widget]);

  // React.useEffect(() => {
  //   const subscription = UseForm.watch((value) => {
  //     // @ts-ignore
  //     setTestState(value);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [UseForm.watch]);

  React.useEffect(() => {
    const subscription = UseForm.watch((value, { name }) => {
      if (name) {
        updateWidgetForm(name, value);
      }
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  React.useEffect(() => {
    getWidget(parseInt(widgetId as string));
  }, []);

  const onSubmit = (data) => {
    updateWidget(data, token);
    navigate('/app/admin-dashboard');
  };

  return (
    <PageContainer
      pageTitle={'Edit Widget'}
      description={
        'Dungeon Master GURU is a free resource for DMs for reference that includes tools for smooth games.'
      }
    >
      <h1>Edit Widget</h1>
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
      {widget ? <WidgetForm useForm={UseForm} onSubmit={onSubmit} /> : <DndSpinner />}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    token: state.users.token,
    widget: state.widgets.widget,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWidget: (widgetId: number) => {
      dispatch(rest.actions.getWidget({ id: widgetId }));
    },
    updateWidget: (widget: WidgetProps, token?: string) => {
      dispatch(
        rest.actions.updateWidget(
          { id: widget.id },
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

export default connect(mapStateToProps, mapDispatchToProps)(EditWidgetPage);
