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
import PageContainer from '../../containers/PageContainer';
import ReactMarkdown from 'react-markdown';
import Util from '../../utilities/utilities';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';

class NPCs extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getNPCs();
  }

  get columns () {
    return [
      {
        dataField: 'name',
        text: 'NPC',
        sort: true,
        filter: textFilter(),
      }, {
        dataField: 'hitDice',
        text: 'Hit Dice',
      }, {
        dataField: 'hitPoints',
        text: 'Hit Points',
      }, {
        dataField: 'armorClass',
        text: 'Armor Class',
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
      }, {
        dataField: 'challengeRating',
        text: 'CR',
        formatter: (cell) => this.selectCROptions.find((opt) => opt.value === cell).label,
        filter: selectFilter({
          options: this.selectCROptions,
          placeholder: 'CR',
        }),
      },
    ];
  }

  get selectCROptions () {
    const crs = _.map(_.uniqBy(this.props.npcs, 'challengeRating'), (npc) => {
      if (npc.challengeRating === '1/8') {
        return 0.125;
      } else if (npc.challengeRating === '1/4') {
        return 0.25;
      } else if (npc.challengeRating === '1/2') {
        return 0.5;
      }
      return parseFloat(npc.challengeRating);
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
    return _.map(_.uniqBy(this.props.npcs, 'monsterType'), (npc) => ({
      value: npc.monsterType,
      label: npc.monsterType,
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
    const {npcs, flashMessages, user} = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'NPCs'}
                     description={'All npcs with descriptions and stats. Dungeon Master\'s Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[{url: null, isActive: true, title: 'NPCs'}]}>
        <PageTitle title={'NPCs'}/>
        {npcs && npcs.length > 0 ? (
          <BootstrapTable keyField='id'
                          data={ npcs }
                          columns={ this.columns }
                          bordered={ false }
                          bootstrap4
                          hover
                          filter={ filterFactory() }
                          pagination={ paginationFactory() }
                          expandRow={ this.expandRow } />
        ) : (
          <DndSpinner/>
        )}
      </PageContainer>
    );
  }
}

NPCs.propTypes = {
  npcs: PropTypes.array,
  npcTypes: PropTypes.array,
  flashMessages: PropTypes.array,
  getNPCs: PropTypes.func,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    npcs: state.npcs.npcs,
    npcTypes: state.npcs.npcTypes,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getNPCs: () => {
      dispatch(rest.actions.getNPCs());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NPCs);