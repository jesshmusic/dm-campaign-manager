import React from 'react';
import { MonsterAction, UserProps } from '../../../utilities/types';
import rest from '../../../api/api';
import { connect } from 'react-redux';
import DataTable from '../../../components/DataTable/DataTable';

const ActionsTable = (props: {
  getCustomActions: (searchTerm?: string) => void;
  actions: MonsterAction[];
  loading: boolean;
  user?: UserProps;
}) => {
  const { getCustomActions, actions, user } = props;

  React.useEffect(() => {
    getCustomActions();
  }, [user]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Action',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'desc',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return actions.map((action: MonsterAction) => {
      return {
        id: action.id,
        name: action.name,
        desc: action.desc,
      };
    });
  }, [actions]);

  const onSearch = (searchTerm: string) => {
    getCustomActions(searchTerm);
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={false}
      onSearch={onSearch}
      results={data.length}
    />
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
    actions: state.customActions.actions,
    loading: state.users.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCustomActions: (searchTerm?: string) => {
      if (searchTerm) {
        dispatch(rest.actions.getCustomActions({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getCustomActions());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsTable);
