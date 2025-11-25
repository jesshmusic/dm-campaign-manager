/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { ConditionProps } from '../../utilities/types';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { useNavigate } from 'react-router-dom';

const Conditions = (props: {
  getConditions: (searchTerm?: string) => void;
  conditions: ConditionProps[];
  loading: boolean;
}) => {
  const { getConditions, loading, conditions } = props;
  const navigate = useNavigate();

  React.useEffect(() => {
    getConditions();
  }, []);

  const goToPage = (row: Row<Record<string, unknown>>) => {
    navigate(`/app/conditions/${row.original.slug}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Condition',
        accessor: 'name',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return conditions.map((condition: ConditionProps) => {
      return {
        name: condition.name,
        slug: condition.slug,
      };
    });
  }, [conditions]);

  const onSearch = (searchTerm: string) => {
    props.getConditions(searchTerm);
  };

  return (
    <PageContainer
      pageTitle={'Conditions'}
      description={
        "All D&D conditions. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      }
    >
      <PageTitle title={'Conditions'} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        loading={loading}
        onSearch={onSearch}
        results={data.length}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    conditions: state.conditions.conditions,
    user: state.users.user,
    flashMessages: state.flashMessages,
    loading: state.conditions.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getConditions: (searchTerm?: string) => {
      if (searchTerm) {
        dispatch(rest.actions.getConditions({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getConditions());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Conditions);
