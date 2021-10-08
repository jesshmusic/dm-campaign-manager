/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle/PageTitle';
import { SpellProps } from '../../utilities/types';
import DataTable from '../../components/DataTable/DataTable';
import { Row } from 'react-table';
import { navigate } from '@reach/router';

const Spells = (props: {
  getSpells: (searchTerm?: string) => void;
  spells: SpellProps[]
}) => {
  const { getSpells, spells } = props;

  React.useEffect(() => {
    getSpells();
  }, []);

  const goToPage = (row: Row<any>) => {
    navigate(`/app/spells/${row.original.slug}`);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Spell',
        accessor: 'name'
      },
      {
        Header: 'Level',
        accessor: 'spellLevel'
      },
      {
        Header: 'Components',
        accessor: 'componentsString'
      },
      {
        Header: 'Classes',
        accessor: 'classesString'
      }
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
        slug: spell.slug
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
        'All D&D spells. Dungeon Master\'s Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.'
      }
      breadcrumbs={[{ isActive: true, title: 'Spells' }]}
    >
      <PageTitle title={'Spells'} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        loading={!spells || spells.length === 0}
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
    flashMessages: state.flashMessages
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
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spells);
