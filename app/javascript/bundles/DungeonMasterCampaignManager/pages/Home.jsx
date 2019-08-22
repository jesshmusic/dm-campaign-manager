import React from 'react';
import PropTypes from 'prop-types';
import { configureStore } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import { Router } from '@reach/router';
import HomePage from './HomePage';
import Campaigns from './Campaigns';
import Campaign from './Campaign';
import Armor from './items/Armor';
import Weapons from './items/Weapons';
import Login from './Login';
import Items from './items/Items';
import MagicItems from './items/MagicItems';
import Gear from './items/Gear';
import Tools from './items/Tools';
import Vehicles from './items/Vehicles';

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
      <Items path='/app/items' />
      <Armor path='/app/items/armor/' />
      <Weapons path='/app/items/weapons/' />
      <MagicItems path='/app/items/magic-items/' />
      <Gear path='/app/items/gear/' />
      <Tools path='/app/items/tools/' />
      <Vehicles path='/app/items/vehicles/' />
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
