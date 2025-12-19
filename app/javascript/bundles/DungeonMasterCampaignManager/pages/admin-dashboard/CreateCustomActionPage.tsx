import React from 'react';
import PageContainer from '../../containers/PageContainer';
import { FlashMessage, MonsterAction, UserProps } from '../../utilities/types';
import FormSelect from '../../components/forms/FormSelect';
import { actionTypeOptions } from '../../utilities/character-utilities';
import ActionForm from '../../components/action-forms/ActionForm';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import { GiSave } from 'react-icons/gi';
import { useCustomActionState } from './use-custom-action-state';
import rest from '../../api/api';
import { connect } from 'react-redux';

import { ActionTypeContainer } from './AdminDashboard.styles';

const CreateCustomActionPage = (props: {
  createCustomAction: (action: unknown) => void;
  flashMessages: FlashMessage[];
  addFlashMessage: (flashMessage: FlashMessage) => void;
  user: UserProps;
  users: UserProps[];
  token?: string;
}) => {
  const { onSubmitActionForm, updateActionForm, UseForm } = useCustomActionState(props);

  const [testState, setTestState] = React.useState();

  React.useEffect(() => {
    const subscription = UseForm.watch((value, { name }) => {
      if (name) {
        updateActionForm(name, value);
      }
      // @ts-expect-error - Type mismatch between form value and test state
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  return (
    <PageContainer
      description={
        'Dungeon Master GURU is a free resource for DMs for reference that includes tools for smooth games.'
      }
      pageTitle={'Create Custom Action'}
    >
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
      <h1>Create Custom Action</h1>
      <form onSubmit={UseForm.handleSubmit(onSubmitActionForm)} noValidate>
        <ActionTypeContainer>
          <FormSelect
            label={'Action Type'}
            control={UseForm.control}
            options={actionTypeOptions}
            name={'actionTypeOption'}
          />
        </ActionTypeContainer>
        <ActionForm
          control={UseForm.control}
          errors={UseForm.formState.errors}
          fieldName={'action'}
        />
        <Button type="submit" color={Colors.success} icon={<GiSave size={30} />} title="Save" />
      </form>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
    users: state.users.users,
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createCustomAction: (action: MonsterAction, token?: string) => {
      const actionBody = {
        body: JSON.stringify({
          custom_action: action,
          token,
        }),
      };
      dispatch(rest.actions.createCustomAction({}, actionBody));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCustomActionPage);
