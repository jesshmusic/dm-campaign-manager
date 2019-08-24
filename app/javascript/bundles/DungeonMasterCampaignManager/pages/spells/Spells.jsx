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
        dataField: 'spell_level',
        text: 'Level',
        sort: true,
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
      },
    ];
  }

  get selectSchoolOptions () {
    return _.map(_.uniqBy(this.props.spells, 'school'), (spell) => ({
      value: spell.school,
      label: spell.school,
    }));
  }

  get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <ReactMarkdown source={row.description}
                       allowedTypes={Util.allowedTypes}
                       escapeHtml={false}
        />
      ),
    };
  }

  render () {
    const {spells, flashMessages, user} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle={'Spells'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <Breadcrumb.Item active>Spells</Breadcrumb.Item>
          </Breadcrumb>
          <BootstrapTable keyField='id'
                          data={ spells }
                          columns={ this.columns }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          expandRow={ this.expandRow } />
        </div>
      </PageContainer>
    );
  }
}

Spells.propTypes = {
  spells: PropTypes.array,
  flashMessages: PropTypes.array,
  getSpells: PropTypes.func,
  user: PropTypes.object.isRequired,
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