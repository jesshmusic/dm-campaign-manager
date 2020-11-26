import React from 'react';
import PropTypes from 'prop-types';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import { Router } from '@reach/router';
import HomePage from './front-page/HomePage';
import Campaigns from './campaigns/Campaigns';
import Campaign from './campaigns/Campaign';
import EditCampaign from './campaigns/EditCampaign';
import Items from './items/Items';
import AllItems from './items/AllItems';
import Armor from './items/Armor';
import Gear from './items/Gear';
import MagicItems from './items/MagicItems';
import Tools from './items/Tools';
import Vehicles from './items/Vehicles';
import Weapons from './items/Weapons';
import Monsters from './monsters/Monster';
import Spells from './spells/Spells';
import DndClass from './dnd-classes/DndClass';
import DndClasses from './dnd-classes/DndClasses';
import NewCampaign from './campaigns/NewCampaign';
import PlayerCharacter from './characters/PlayerCharacter';
import NonPlayerCharacter from './characters/NonPlayerCharacter';
import PlayerCharacterEditor from './characters/PlayerCharacterEditor';
import NonPlayerCharacterEditor from './characters/NonPlayerCharacterEditor';
import GenerateNPC from './characters/GenerateNPC';
import Adventure from './adventures/Adventure';
import EditAdventure from './adventures/EditAdventure';
import Encounter from './encounters/Encounter';
import EditEncounter from './encounters/EditEncounter';
import NewAdventure from './adventures/NewAdventure';
import NewEncounter from './encounters/NewEncounter';

const store = (props) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    adventures: {
      currentAdventure: null,
    },
    campaigns: {
      campaigns: [],
      count: 0,
      currentCampaign: null,
      loading: true,
    },
    encounters: {
      currentEncounter: null,
    },
    flashMessages: [],
    items: {
      items: [],
      count: props.itemsCount,
      currentItem: null,
    },
    monsters: {
      monsters: [],
      count: props.monstersCount,
      currentMonster: null,
    },
    nonPlayerCharacters: {
      characters: [],
      count: props.npcsCount,
      currentCharacter: null,
    },
    playerCharacters: {
      characters: [],
      count: props.pcsCount,
      currentCharacter: null,
    },
    races: {
      races: [],
      currentRace: null,
    },
    spells: {
      spells: [],
      count: props.spellsCount,
      currentSpell: null,
    },
    users: {
      user: props.user,
      users: [],
      count: props.usersCount,
      currentUser: null,
    },
  },
});

const Home = (props) => (
  <Provider store={store(props)}>
    <Router>
      <HomePage path="/" />
      <Campaigns path='/app/campaigns'/>
      <Campaign path='/app/campaigns/:campaignSlug'/>
      <NewCampaign path='/app/campaigns/new'/>
      <EditCampaign path='/app/campaigns/:campaignSlug/edit'/>
      <Adventure path='/app/campaigns/:campaignSlug/adventures/:id'/>
      <EditAdventure path={'/app/campaigns/:campaignSlug/adventures/:id/edit'}/>
      <NewAdventure path={'/app/campaigns/:campaignSlug/adventures/new'}/>
      <Encounter path='/app/campaigns/:campaignSlug/adventures/:adventureId/encounters/:id'/>
      <EditEncounter path={'/app/campaigns/:campaignSlug/adventures/:adventureId/encounters/:id/edit'}/>
      <NewEncounter path='/app/campaigns/:campaignSlug/adventures/:adventureId/encounters/new'/>
      <PlayerCharacter path='/app/campaigns/:campaignSlug/pcs/:pcSlug' />
      <NonPlayerCharacter path='/app/campaigns/:campaignSlug/npcs/:npcSlug' />
      <PlayerCharacterEditor path='/app/campaigns/:campaignSlug/pcs/:pcSlug/edit'/>
      <PlayerCharacterEditor path='/app/campaigns/:campaignSlug/pcs/new' />
      <NonPlayerCharacterEditor path='/app/campaigns/:campaignSlug/npcs/:npcSlug/edit'/>
      <NonPlayerCharacterEditor path='/app/campaigns/:campaignSlug/npcs/new' />
      <GenerateNPC path='/app/campaigns/:campaignSlug/npcs/generate' />
      <DndClass path='/app/classes/:dndClassSlug' />
      <DndClasses path='/app/classes' />
      <Items path='/app/items' />
      <AllItems path='/app/items/all/' />
      <Armor path='/app/items/armor/' />
      <Weapons path='/app/items/weapons/' />
      <MagicItems path='/app/items/magic-items/' />
      <Gear path='/app/items/gear/' />
      <Tools path='/app/items/tools/' />
      <Vehicles path='/app/items/vehicles/' />
      <Monsters path='/app/monsters/' />
      <Spells path='/app/spells/' />
    </Router>
  </Provider>
);

Home.propTypes = {
  campaigns: PropTypes.object,
  campaignsCount: PropTypes.number.isRequired,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  itemsCount: PropTypes.number.isRequired,
  monstersCount: PropTypes.number.isRequired,
  npcsCount: PropTypes.number.isRequired,
  pcsCount: PropTypes.number.isRequired,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
  usersCount: PropTypes.number.isRequired,
};

export default Home;
