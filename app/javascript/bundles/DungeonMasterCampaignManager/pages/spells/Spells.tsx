/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { SpellProps } from '../../utilities/types';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { useNavigate } from 'react-router-dom';

const Spells = (props: {
  getSpells: (searchTerm?: string) => void;
  spells: SpellProps[];
  loading: boolean;
}) => {
  const { getSpells, loading, spells } = props;
  const navigate = useNavigate();

  React.useEffect(() => {
    getSpells();
  }, []);

  const goToPage = (row: Row<unknown>) => {
    navigate(`/app/spells/${row.original.slug}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Spell',
        accessor: 'name',
      },
      {
        Header: 'Level',
        accessor: 'spellLevel',
      },
      {
        Header: 'Components',
        accessor: 'componentsString',
      },
      {
        Header: 'Classes',
        accessor: 'classesString',
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return spells.map((spell: SpellProps) => {
      return {
        name: spell.name,
        spellLevel: spell.spellLevel,
        componentsString: spell.components.join(', '),
        classesString: spell.spellClasses.join(', '),
        slug: spell.slug,
      };
    });
  }, [spells]);

  const onSearch = (searchTerm: string) => {
    props.getSpells(searchTerm);
  };

  return (
    <PageContainer
      pageTitle={'Spells'}
      description={
        "All D&D spells. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      }
    >
      <PageTitle title={'Spells'} />
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
    spells: state.spells.spells,
    user: state.users.user,
    flashMessages: state.flashMessages,
    loading: state.spells.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSpells: (searchTerm?: string) => {
      if (searchTerm) {
        dispatch(rest.actions.getSpells({ search: searchTerm }));
      } else {
        dispatch(rest.actions.getSpells());
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spells);
