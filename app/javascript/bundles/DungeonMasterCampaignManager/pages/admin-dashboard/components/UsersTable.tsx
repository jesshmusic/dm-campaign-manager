import React from 'react';
import { UserProps } from '../../../utilities/types';
import rest from '../../../api/api';
import { connect } from 'react-redux';
import DataTable from '../../../components/DataTable/DataTable';

const UsersTable = (props: {
  getUsers: (searchTerm?: string) => void;
  users: UserProps[];
  loading: boolean;
  user?: UserProps;
}) => {
  const { getUsers, users, user } = props;

  React.useEffect(() => {
    getUsers();
  }, [user]);

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
    getUsers(searchTerm);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={false}
      onSearch={onSearch}
      results={data.length}
      noHover
    />
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
    users: state.users.users,
    loading: state.users.loading,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable);
