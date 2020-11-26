import React from 'react';
import PropTypes from 'prop-types';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import { Router } from '@reach/router';
import HomePage from './front-page/HomePage';
import Items from './items/Items';
import AllItems from './items/AllItems';
import Armor from './items/Armor';
import Gear from './items/Gear';
import MagicItems from './items/MagicItems';
import Tools from './items/Tools';
import Vehicles from './items/Vehicles';
import Weapons from './items/Weapons';
import NPCs from './npcs/NPC';
import Spells from './spells/Spells';
import DndClass from './dnd-classes/DndClass';
import DndClasses from './dnd-classes/DndClasses';

const store = (props) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    flashMessages: [],
    items: {
      items: [],
      count: props.itemsCount,
      currentItem: null,
    },
    npcs: {
      npcs: [],
      count: props.npcsCount,
      currentNPC: null,
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
      currentUser: null,
    },
  },
});

const Home = (props) => (
  <Provider store={store(props)}>
    <Router>
      <HomePage path="/" />
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
      <NPCs path='/app/npcs/' />
      <Spells path='/app/spells/' />
    </Router>
  </Provider>
);

Home.propTypes = {
  flashMessages: PropTypes.array,
  itemsCount: PropTypes.number.isRequired,
  npcsCount: PropTypes.number.isRequired,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
};

export default Home;
