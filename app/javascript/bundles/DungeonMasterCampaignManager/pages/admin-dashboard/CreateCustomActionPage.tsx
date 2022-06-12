import React from 'react';
import PageContainer from '../../containers/PageContainer';
import { FlashMessage, MonsterAction, UserProps } from '../../utilities/types';
import FormSelect from '../../components/forms/FormSelect';
import { actionTypeOptions } from '../../utilities/character-utilities';
import ActionForm from '../monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import { GiSave } from 'react-icons/all';
import { useCustomActionState } from './use-custom-action-state';
import rest from '../../api/api';
import { connect } from 'react-redux';

const styles = require('./admin-dashboard.module.scss');

const CreateCustomActionPage = (props: {
  createCustomAction: (action: any) => void;
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
      // @ts-ignore
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  return (
    <PageContainer
      pageTitle={'Create Custom Action'}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
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
      <form
        onSubmit={UseForm.handleSubmit(onSubmitActionForm)}
        className={styles.genForm}
        noValidate
      >
        <div className={styles.actionTypeContainer}>
          <FormSelect
            label={'Action Type'}
            control={UseForm.control}
            options={actionTypeOptions}
            name={'actionTypeOption'}
          />
        </div>
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
