import React from 'react';
import { MonsterAction, UserProps } from '../../../utilities/types';
import rest from '../../../api/api';
import { connect } from 'react-redux';
import DataTable from '../../../components/DataTable/DataTable';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiTrashCan } from 'react-icons/gi';

const ActionsTable = (props: {
  getCustomActions: (searchTerm?: string) => void;
  deleteCustomAction: (id: number) => void;
  actions: MonsterAction[];
  loading: boolean;
  user?: UserProps;
}) => {
  const { getCustomActions, deleteCustomAction, actions, user } = props;

  React.useEffect(() => {
    getCustomActions();
  }, [user]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Action',
        accessor: 'name' as const,
      },
      {
        Header: 'Description',
        accessor: 'desc' as const,
      },
      {
        Header: 'Delete',
        accessor: 'id' as const,
        size: 25,
        Cell: ({ value }) => (
          <Button
            type="button"
            onClick={() => deleteCustomAction(value)}
            color={Colors.danger}
            icon={<GiTrashCan size={30} />}
            title="Delete"
            hideTitle
          />
        ),
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
      perPage={6}
      results={data.length}
      noHover
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
    deleteCustomAction: (id: number) => {
      dispatch(rest.actions.deleteCustomAction({ id }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsTable);
