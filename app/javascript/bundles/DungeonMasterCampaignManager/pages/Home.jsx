import React from 'react';
import PropTypes from 'prop-types';
import { configureStore } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import { Router } from '@reach/router';
import HomePage from './front-page/HomePage';
import Campaigns from './campaigns/Campaigns';
import Campaign from './campaigns/Campaign';
import EditCampaign from './campaigns/EditCampaign';
import Login from './Login';
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

const store = (props) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    users: {
      user: props.user,
      users: [],
      currentUser: null,
    },
    campaigns: {
      campaigns: [],
      currentCampaign: null,
    },
    nonPlayerCharacters: [],
    playerCharacters: [],
    flashMessages: [],
  },
});

const Home = (props) => (
  <Provider store={store(props)}>
    <Router>
      <HomePage path="/" />
      <Campaigns path='/app/campaigns'/>
      <Campaign path='/app/campaigns/:campaignSlug'/>
      <EditCampaign path='/app/campaigns/:campaignSlug/edit'/>
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
      <Login path='/app/login' />
    </Router>
  </Provider>
);

Home.propTypes = {
  campaigns: PropTypes.object,
  nonPlayerCharacters: PropTypes.object,
  playerCharacters: PropTypes.object,
  dungeonMasters: PropTypes.object,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
};

export default Home;
