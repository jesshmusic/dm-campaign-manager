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

class Monsters extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getMonsters();
  }

  get columns () {
    return [
      {
        dataField: 'name',
        text: 'Item',
        sort: true,
        filter: textFilter(),
      }, {
        dataField: 'challenge_rating',
        text: 'CR',
        sort: true,
        formatter: (cell) => this.selectCROptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectCROptions,
          placeholder: 'CR',
        }),
      }, {
        dataField: 'monster_type',
        text: 'Type',
        sort: true,
      }, {
        dataField: 'monster_subtype',
        text: 'Subtype',
        sort: true,
      },
    ];
  }

  get selectCROptions () {
    return _.map(_.uniqBy(this.props.monsters, 'challenge_rating'), (monster) => ({
      value: monster.challenge_rating,
      label: monster.challenge_rating,
    }));
  }

  get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <ReactMarkdown source={row.description_text}
                       allowedTypes={[
                         'paragraph',
                         'text',
                         'emphasis',
                         'strong',
                         'link',
                         'blockquote',
                         'delete',
                         'list',
                         'listItem',
                         'heading',
                         'code',
                         'thematicBreak',
                         'table',
                         'tableHead',
                         'tableBody',
                         'tableRow',
                         'tableCell',
                         'html',
                       ]}
                       escapeHtml={false}
        />
      ),
    };
  }

  render () {
    const {monsters, flashMessages, user} = this.props;
    return (
      <PageContainer user={user} flashMessages={flashMessages} pageTitle={'Monsters'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <BreadcrumbLink to='/app/monsters/' title={'Items'}/>
            <Breadcrumb.Item active>ItemsList</Breadcrumb.Item>
          </Breadcrumb>
          <BootstrapTable keyField='id'
                          data={ monsters }
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

Monsters.propTypes = {
  monsters: PropTypes.array,
  flashMessages: PropTypes.array,
  getMonsters: PropTypes.func,
  user: PropTypes.object.isRequired,
};

function mapStateToProps (state) {
  return {
    monsters: state.monsters.monsters,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getMonsters: () => {
      dispatch(rest.actions.getMonsters());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monsters);