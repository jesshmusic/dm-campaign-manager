import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { MonsterAction, UserProps } from '../../utilities/types';
import rest from '../../api/api';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';
import { useAdminState } from './use-admin-state';
import UsersTable from './components/UsersTable';
import CustomActions from './components/CustomActions';

const styles = require('./admin-dashboard.module.scss');

const AdminDashboard = (props: {
  createCustomAction: (action: any) => void;
  user: UserProps;
  users: UserProps[];
  token?: string;
}) => {
  const { onSubmitActionForm, updateActionForm, user, UseForm } = useAdminState(props);

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
          <UsersTable />
        </div>
        <div className={styles.section}>
          <h2>User Created NPCs</h2>
          {user ? <MonstersTable user={user} /> : null}
        </div>
        <div className={styles.section}>
          <h2>Custom Actions</h2>
          <CustomActions useForm={UseForm} onSubmitActionForm={onSubmitActionForm} />
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
    createCustomAction: (action: MonsterAction, token?: string) => {
      const actionBody = {
        body: JSON.stringify({
          custom_action: action,
          token,
        }),
      };
      dispatch(rest.actions.createCustomAction({}, actionBody));
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
