/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import DataTable from '../../components/layout/DataTable';

const NPCs = ({getNPCs, npcs, npcTypes, flashMessages, user}) => {

  React.useEffect(() => {
    getNPCs();
  }, []);

  const data = React.useMemo(() => {
    return npcs.map((npc) => {
      return {
        name: npc.name,
        alignment: npc.alignment,
        challengeRating: npc.challengeRating,
        hitPoints: `${ npc.hitPoints } ( ${ npc.hitDice } )`,
        monsterType: npc.monsterType,
      };
    });
  }, [npcs]);

  const columns = React.useMemo(() => [
    {
      Header: 'NPC',
      accessor: 'name',
    },
    {
      Header: 'Alignment',
      accessor: 'alignment',
    },
    {
      Header: 'CR',
      accessor: 'challengeRating',
    },
    {
      Header: 'HP',
      accessor: 'hitPoints',
    },
    {
      Header: 'Type',
      accessor: 'monsterType',
    },
  ]);

  // get columns () {
  //   return [
  //     {
  //       dataField: 'name',
  //       text: 'NPC',
  //       sort: true,
  //     }, {
  //       dataField: 'hitDice',
  //       text: 'Hit Dice',
  //     }, {
  //       dataField: 'hitPoints',
  //       text: 'Hit Points',
  //     }, {
  //       dataField: 'armorClass',
  //       text: 'Armor Class',
  //     }, {
  //       dataField: 'monsterType',
  //       text: 'Type',
  //       sort: true,
  //       formatter: (cell) => this.selectTypeOptions.find((opt) => opt.value === cell).label,
  //       filter: selectFilter({
  //         options: this.selectTypeOptions,
  //         placeholder: 'Type',
  //       }),
  //     }, {
  //       dataField: 'monsterSubtype',
  //       text: 'Subtype',
  //       sort: true,
  //     }, {
  //       dataField: 'challengeRating',
  //       text: 'CR',
  //       formatter: (cell) => this.selectCROptions.find((opt) => opt.value === cell).label,
  //       filter: selectFilter({
  //         options: this.selectCROptions,
  //         placeholder: 'CR',
  //       }),
  //     },
  //   ];
  // }

  return (
    <PageContainer user={ user }
                   flashMessages={ flashMessages }
                   pageTitle={ 'NPCs' }
                   description={ 'All npcs with descriptions and stats. Dungeon Master\'s Toolbox is a free resource for DMs to manage their campaigns, adventures, and NPCs.' }
                   breadcrumbs={ [{url: null, isActive: true, title: 'NPCs'}] }>
      <PageTitle title={ 'NPCs' }/>
      { npcs && npcs.length > 0 ? (
        <DataTable data={ data } columns={ columns }/>
      ) : (
        <DndSpinner/>
      ) }
    </PageContainer>
  );
};

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