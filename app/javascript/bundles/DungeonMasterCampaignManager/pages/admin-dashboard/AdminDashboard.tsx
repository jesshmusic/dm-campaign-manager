import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { ActionTypes, MonsterAction, UserProps } from '../../utilities/types';
import rest from '../../api/api';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';
import DataTable from '../../components/DataTable/DataTable';
import ActionForm from '../monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm';
import { Colors } from '../../utilities/enums';
import Button from '../../components/Button/Button';
import { GiSave } from 'react-icons/all';
import { useAdminState } from './use-admin-state';

const styles = require('./admin-dashboard.module.scss');

const AdminDashboard = (props: {
  createAction: (action: any) => void;
  getUsers: (searchTerm?: string) => void;
  user: UserProps;
  users: UserProps[];
  token?: string;
}) => {
  const { columns, data, onSearch, onSubmitActionForm, updateActionForm, user, UseForm } =
    useAdminState(props);

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
      pageTitle={'DM Screen Admin'}
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
      <div className={styles.wrapper}>
        <PageTitle title="DM Screen Admin" />
        <div className={styles.section}>
          <h2>Users</h2>
          <DataTable
            columns={columns}
            data={data}
            loading={false}
            onSearch={onSearch}
            results={data.length}
          />
        </div>
        <div className={styles.section}>
          <h2>User Created NPCs</h2>
          {user ? <MonstersTable user={user} /> : null}
        </div>
        <div className={styles.section}>
          <h2>Custom Actions</h2>
          <form
            onSubmit={UseForm.handleSubmit(onSubmitActionForm)}
            className={styles.genForm}
            noValidate
          >
            <ActionForm
              control={UseForm.control}
              errors={UseForm.formState.errors}
              fieldName={'action'}
            />
            <Button type="submit" color={Colors.success} icon={<GiSave size={30} />} title="Save" />
          </form>
        </div>
      </div>
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
    createAction: (action: MonsterAction, token?: string) => {
      dispatch(rest.actions.createAction({}, { body: JSON.stringify({ action, token }) }));
    },
    getUsers: (searchTerm?: string) => {
      if (searchTerm) {
        dispatch(rest.actions.getUsers({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getUsers());
      }
    },
    updateUserRole: (user: UserProps, newRole: 'admin' | 'dungeon-master' | 'user') => {
      const { role, dndClasses, items, spells, ...userProps } = user;
      dispatch(
        rest.actions.users.put(
          { id: user.id },
          {
            body: {
              user: JSON.stringify({
                role: newRole,
                ...userProps,
              }),
            },
          }
        )
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
