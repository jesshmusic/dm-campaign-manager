import React from 'react';
import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { WidgetProps } from '../../components/Widgets/Widget';
import { useCreateWidgetState } from './use-create-widget-state';
import WidgetForm from './components/WidgetForm';

const styles = require('./create-widget-page.module.scss');

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
        'Dungeon Master GURU is a free resource for DMs for reference that includes tools for smooth games.'
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
      <WidgetForm useForm={UseForm} onSubmit={onSubmit} />
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
