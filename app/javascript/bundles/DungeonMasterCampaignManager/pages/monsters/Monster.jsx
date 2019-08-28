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
        text: 'Monster',
        sort: true,
        filter: textFilter(),
      }, {
        dataField: 'challengeRating',
        text: 'CR',
        sort: true,
        formatter: (cell) => this.selectCROptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectCROptions,
          placeholder: 'CR',
        }),
      }, {
        dataField: 'monsterType',
        text: 'Type',
        sort: true,
        formatter: (cell) => this.selectTypeOptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectTypeOptions,
          placeholder: 'Type',
        }),
      }, {
        dataField: 'monsterSubtype',
        text: 'Subtype',
        sort: true,
      },
    ];
  }

  get selectCROptions () {
    const crs = _.map(_.uniqBy(this.props.monsters, 'challengeRating'), (monster) => {
      if (monster.challengeRating === '1/8') {
        return 0.125;
      } else if (monster.challengeRating === '1/4') {
        return 0.25;
      } else if (monster.challengeRating === '1/2') {
        return 0.5;
      }
      return parseFloat(monster.challengeRating);
    }).sort((a, b) => a - b);

    return crs.map((cr) => {
      if (cr === 0.125) {
        return {
          value: '1/8',
          label: '1/8',
        };
      } else if (cr === 0.25) {
        return {
          value: '1/4',
          label: '1/4',
        };
      } else if (cr === 0.5) {
        return {
          value: '1/2',
          label: '1/2',
        };
      }
      return {
        value: `${cr}`,
        label: `${cr}`,
      };
    });
  }

  get selectTypeOptions () {
    return _.map(_.uniqBy(this.props.monsters, 'monsterType'), (monster) => ({
      value: monster.monsterType,
      label: monster.monsterType,
    }));
  }

  get expandRow () {
    return {
      parentClassName: 'table-primary',
      onlyOneExpanding: true,
      renderer: (row) => (
        <ReactMarkdown source={row.descriptionText}
                       allowedTypes={Util.allowedTypes}
                       escapeHtml={false}
        />
      ),
    };
  }

  render () {
    const {monsters, flashMessages, user} = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'Monsters'}
                     description={`All monsters with descriptions and stats. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            <Breadcrumb.Item active>Monsters</Breadcrumb.Item>
          </Breadcrumb>
          {monsters && monsters.length > 0 ? (
            <BootstrapTable keyField='id'
                            data={ monsters }
                            columns={ this.columns }
                            bootstrap4
                            hover
                            filter={ filterFactory() }
                            pagination={ paginationFactory() }
                            expandRow={ this.expandRow } />
          ) : (
            <Spinner animation="border" variant="primary" />
          )}
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