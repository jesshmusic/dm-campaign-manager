/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import filterFactory, {selectFilter, textFilter} from 'react-bootstrap-table2-filter';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import _ from 'lodash';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';
import PageContainer from '../../containers/PageContainer';
import ReactMarkdown from 'react-markdown';
import Util from '../../utilities/utilities';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PageTitle from '../../components/layout/PageTitle';

class Spells extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getSpells();
  }

  get columns () {
    return [
      {
        dataField: 'name',
        text: 'Spell',
        sort: true,
        filter: textFilter(),
      }, {
        dataField: 'spellLevel',
        text: 'Level',
        sort: true,
        formatter: (cell) => this.selectLevelOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectLevelOptions,
          placeholder: 'School',
        }),
      }, {
        dataField: 'school',
        text: 'Type',
        sort: true,
        formatter: (cell) => this.selectSchoolOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectSchoolOptions,
          placeholder: 'School',
        }),
      }, {
        dataField: 'components',
        text: 'Components',
        sort: true,
        formatter: Spells.componentsFormatter,
      }, {
        dataField: 'spellClasses',
        text: 'Classes',
        sort: true,
        formatter: Spells.classesFormatter,
        filter: selectFilter({
          onFilter: this.filterByClass,
          options: Spells.selectClassOptions,
        }),
      },
    ];
  }

  static componentsFormatter (cell, row) {
    return row.components.join(', ');
  }

  static classesFormatter (cell, row) {
    return row.spellClasses.join(', ');
  }

  get selectLevelOptions () {
    return [
      {value: 'Cantrip', label: 'Cantrip'},
      {value: '1st level', label: '1st level'},
      {value: '2nd level', label: '2nd level'},
      {value: '3rd level', label: '3rd level'},
      {value: '4th level', label: '4th level'},
      {value: '5th level', label: '5th level'},
      {value: '6th level', label: '6th Level'},
      {value: '7th level', label: '7th level'},
      {value: '8th level', label: '8th level'},
      {value: '9th level', label: '9th level'},
    ];
  }

  get selectSchoolOptions () {
    return _.map(_.uniqBy(this.props.spells, 'school'), (spell) => ({
      value: spell.school,
      label: spell.school,
    }));
  }

  static get selectClassOptions () {
    return [
      {value: 'Bard', label: 'Bard'},
      {value: 'Cleric', label: 'Cleric'},
      {value: 'Druid', label: 'Druid'},
      {value: 'Paladin', label: 'Paladin'},
      {value: 'Ranger', label: 'Ranger'},
      {value: 'Sorcerer', label: 'Sorcerer'},
      {value: 'Warlock', label: 'Warlock'},
      {value: 'Wizard', label: 'Wizard'},
    ];
  }

  filterByClass (filterClass, data) {
    if (filterClass) {
      return data.filter(spell => spell.spellClasses.includes(filterClass));
    }
    return data;
  }

  get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <ReactMarkdown source={row.descriptionText.replace(/â€™/g, '\'').replace(/â€œ/g, '"').replace(/â€�/g, '"')}
                       allowedTypes={Util.allowedTypes}
                       escapeHtml={false}
        />
      ),
    };
  }

  render () {
    const {spells, flashMessages, user} = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'Spells'}
                     description={'All D&D spells. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[{url: null, isActive: true, title: 'Spells'}]}>
        <PageTitle title={'Spells'}/>
        {spells && spells.length > 0 ? (
          <BootstrapTable keyField='id'
                          data={ spells }
                          columns={ this.columns }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          defaultSorted={[{
                            dataField: 'spell_level',
                            order: 'asc',
                          }]}
                          expandRow={ this.expandRow } />
        ) : (
          <Spinner animation="border" variant="primary" />
        )}
      </PageContainer>
    );
  }
}

Spells.propTypes = {
  spells: PropTypes.array,
  flashMessages: PropTypes.array,
  getSpells: PropTypes.func,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    spells: state.spells.spells,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getSpells: () => {
      dispatch(rest.actions.getSpells());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spells);