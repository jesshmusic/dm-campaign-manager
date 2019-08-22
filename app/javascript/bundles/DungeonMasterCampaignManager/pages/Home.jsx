import React from 'react';
import PropTypes from 'prop-types';
import { configureStore } from 'redux-starter-kit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import { Router } from '@reach/router';
import HomePage from './HomePage';
import Campaigns from './Campaigns';
import Campaign from './Campaign';
import Armor from './Armor';
import Weapons from './Weapons';
import Login from './Login';
import Items from './Items';
import MagicItems from './MagicItems';
import Gear from './Gear';
import Tools from './Tools';
import Vehicles from './Vehicles';

const store = (props) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    user: props.user,
    campaigns: {
      campaigns: [],
      currentCampaign: null,
    },
    nonPlayerCharacters: [],
    playerCharacters: [],
    dungeonMasters: [],
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
