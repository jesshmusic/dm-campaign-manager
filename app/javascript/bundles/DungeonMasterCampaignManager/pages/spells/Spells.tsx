/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import _ from 'lodash';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle/PageTitle';
import DndSpinner from '../../components/layout/DndSpinners/DndSpinner';
import { DndClassSummary, SpellProps } from '../../utilities/types';
import DataTable from '../../components/layout/DataTable/DataTable';
import { Row } from 'react-table';
import { navigate } from '@reach/router';

const Spells = (props: { getSpells: () => void; spells: SpellProps[] }) => {
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

  return (
    <PageContainer
      pageTitle={'Spells'}
      description={
        "All D&D spells. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      }
      breadcrumbs={[{ isActive: true, title: 'Spells' }]}
    >
      <PageTitle title={'Spells'} />
      <DataTable
        columns={columns}
        data={data}
        goToPage={goToPage}
        loading={!spells || spells.length === 0}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    spells: state.spells.spells,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSpells: () => {
      dispatch(rest.actions.getSpells());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spells);

// get columns() {
//   return [
//     {
//       dataField: 'name',
//       text: 'Spell',
//       sort: true,
//       filter: textFilter(),
//     },
//     {
//       dataField: 'spellLevel',
//       text: 'Level',
//       sort: true,
//       formatter: (cell) =>
//         this.selectLevelOptions.find((opt) => opt.value === cell).label,
//       filter: selectFilter({
//         options: this.selectLevelOptions,
//         placeholder: 'School',
//       }),
//     },
//     {
//       dataField: 'school',
//       text: 'Type',
//       sort: true,
//       formatter: (cell) =>
//         this.selectSchoolOptions.find((opt) => opt.value === cell).label,
//       filter: selectFilter({
//         options: this.selectSchoolOptions,
//         placeholder: 'School',
//       }),
//     },
//     {
//       dataField: 'components',
//       text: 'Components',
//       sort: true,
//       formatter: Spells.componentsFormatter,
//     },
//     {
//       dataField: 'spellClasses',
//       text: 'Classes',
//       sort: true,
//       formatter: Spells.classesFormatter,
//       filter: selectFilter({
//         onFilter: this.filterByClass,
//         options: Spells.selectClassOptions,
//       }),
//     },
//   ];
// }
//
// static componentsFormatter(cell, row) {
//   return row.components.join(', ');
// }
//
// static classesFormatter(cell, row) {
//   return row.spellClasses.join(', ');
// }
//
// get selectLevelOptions() {
//   return [
//     { value: 'Cantrip', label: 'Cantrip' },
//     { value: '1st level', label: '1st level' },
//     { value: '2nd level', label: '2nd level' },
//     { value: '3rd level', label: '3rd level' },
//     { value: '4th level', label: '4th level' },
//     { value: '5th level', label: '5th level' },
//     { value: '6th level', label: '6th Level' },
//     { value: '7th level', label: '7th level' },
//     { value: '8th level', label: '8th level' },
//     { value: '9th level', label: '9th level' },
//   ];
// }
//
// get selectSchoolOptions() {
//   return _.map(_.uniqBy(this.props.spells, 'school'), (spell) => ({
//     value: spell.school,
//     label: spell.school,
//   }));
// }
//
// static get selectClassOptions() {
//   return [
//     { value: 'Bard', label: 'Bard' },
//     { value: 'Cleric', label: 'Cleric' },
//     { value: 'Druid', label: 'Druid' },
//     { value: 'Paladin', label: 'Paladin' },
//     { value: 'Ranger', label: 'Ranger' },
//     { value: 'Sorcerer', label: 'Sorcerer' },
//     { value: 'Warlock', label: 'Warlock' },
//     { value: 'Wizard', label: 'Wizard' },
//   ];
// }
//
// filterByClass(filterClass, data) {
//   if (filterClass) {
//     return data.filter((spell) => spell.spellClasses.includes(filterClass));
//   }
//   return data;
// }

// get expandRow () {
//   return {
//     parentClassName: 'table-primary',
//     onlyOneExpanding: true,
//     renderer: (row) => (
//       <ReactMarkdown source={row.descriptionText.replace(/â€™/g, '\'').replace(/â€œ/g, '"').replace(/â€�/g, '"')}
//                      allowedTypes={Util.allowedTypes}
//                      escapeHtml={false}
//       />
//     ),
//   };
// }
