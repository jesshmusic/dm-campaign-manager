import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Link } from 'react-router-dom';
import { ConditionProps, PageProps, UserProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';
import NameField from '../../components/Widgets/NameField';
import TavernNameField from '../../components/Widgets/TavernNameField';
import rest from '../../api/api';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';
import DataTable from '../../components/DataTable/DataTable';

const styles = require('./admin-dashboard.module.scss');

const AdminDashboard = (props: {
  getUsers: (searchTerm?: string) => void;
  user: UserProps;
  users: UserProps[];
}) => {
  const { getUsers, user, users } = props;

  React.useEffect(() => {
    getUsers();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: 'name',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'NPCs',
        accessor: 'monsters',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return users.map((user: UserProps) => {
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        monsters: user.monsters.length,
      };
    });
  }, [users]);

  const onSearch = (searchTerm: string) => {
    props.getUsers(searchTerm);
  };

  const changeRole = (userId: number, isPromotion: boolean) => {};

  return (
    <PageContainer
      pageTitle={'DM Screen Admin'}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
    >
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
          <MonstersTable user={user} />
        </div>
      </div>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
    users: state.users.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
